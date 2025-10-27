# Suit Up! — Prompt-Ready Architecture & Coding Context (Markdown Template)

> Copy-paste this into your repo (e.g., `/docs/architecture/prompt-context.md`).  
> Keep it **living**: update as decisions change. This enables agents (and humans) to produce consistent designs, code, and reviews.

---

## 0) How to use this doc in prompts

**When asking an agent to design or code**, include:
- The **Goal** (what you want now),
- The **Scope** (what’s in/out),
- The **Constraints** and **Non-functionals**,
- The **Chosen stack** and **Interfaces** from this doc,
- Any **ADRs** IDs that must be respected (e.g., ADR-004).

Example preamble:

> “Use the Suit Up! context below. Respect ADR-004 (pgvector) and ADR-007 (React Native offline strategy). Output: a NestJS controller + Zod schemas + unit tests.”

---

## 1) Vision & Scope

- **Product:** Suit Up! — personal wardrobe scanner + daily outfit recommender.
- **Primary jobs-to-be-done:**  
  1) Capture garments (photo + metadata),  
  2) Generate on-demand outfits,  
  3) Learn preferences via feedback.
- **Out of scope (for now):** Marketplace, social feeds, rentals, multi-user closets.

**Release train:** MVP → V1 hardening → V2 on-device ML.

---

## 2) Non-Functional Requirements (NFRs)

- **Performance:** Outfit suggestion ≤ **1200 ms P95** server time; media upload start-to-thumb ≤ **5 s**.  
- **Availability:** 99.9% (core APIs); graceful degradation when weather or LLM is down.  
- **Privacy/GDPR:** Export/delete account; delete embeddings on user deletion.  
- **Security:** JWT + refresh; S3 presigned uploads; PII minimization; SBOM.  
- **Cost:** Weather requests cached 15 min; image tiers (hot/cold); LLM token budget warnings.  
- **Observability:** OTel traces end-to-end; SLIs: JSON validity rate, accept CTR, pipeline error rate.

> Agents: do **not** introduce components that violate these budgets without creating a draft ADR.

---

## 3) System Context (C4 — System level)

- **Clients:** React Native app (Expo RN + TypeScript).  
- **APIs:** API Gateway (NestJS) → domain services (Wardrobe, Reco, Media, Context, Search).  
- **Data:** Postgres, **pgvector**, Redis, S3-compatible storage, event bus (Kafka/Pub/Sub).  
- **External:** Weather, reverse-geocoding, LLM provider(s).

Diagram cue (for humans):  
`Mobile ↔ API GW ↔ {Wardrobe, Reco, Media Worker, Context, Search} ↔ {PG, Redis, S3, Kafka}`

---

## 4) Architecture Decisions (ADRs)

> Keep ADRs short. One change = one ADR. Link code PRs.

### ADR Template

```
# ADR-XXX: <Decision Title>
- Date: YYYY-MM-DD
- Status: Proposed | Accepted | Superseded by ADR-YYY
- Context: <why we need a decision; constraints, NFRs>
- Options:
  1) <Option A> — pros/cons
  2) <Option B> — pros/cons
- Decision: <chosen option>
- Consequences:
  - Positive: ...
  - Negative/Risks: ...
- Follow-ups:
  - [ ] Tasks / migrations / runbooks
- Links: PRs, tickets
```

### ADRs that agents must respect (current)

- **ADR-004**: Use **pgvector** in Postgres for embeddings (vs external vector DB).  
- **ADR-007**: **Offline-first RN** with SQLite + background sync; server is source of truth.  
- **ADR-010**: **LLM response must pass JSON Schema**; auto-repair loop allowed max 1 retry.  
- **ADR-012**: Media processing via **async pipeline** (queue + worker); never synchronous.

---

## 5) Domain Model (prompt-friendly)

```ts
// Minimal, stable contracts for prompts and codegen.
type UUID = string; type ISODate = string;

export interface User {
  id: UUID; locale: "fr-FR"|"en-US"; unitSystem: "metric"|"imperial";
  styleProfile: StyleProfile; measurements?: BodyMeasurements; createdAt: ISODate;
}
export interface StyleProfile {
  archetypes: ("minimal"|"classic"|"streetwear"|"boho"|"sporty"|"business")[];
  palette: string[]; dislikes?: string[]; dressCodes: ("casual"|"smart-casual"|"business"|"formal")[];
  warmthPreference: -2|-1|0|1|2;
}
export interface Garment {
  id: UUID; userId: UUID; category: "top"|"bottom"|"dress"|"outerwear"|"footwear"|"accessory";
  subcategory?: string; colors: string[]; pattern?: string; materials?: string[];
  warmthIndex?: -2|-1|0|1|2; formality?: 0|1|2|3; seasonality?: ("spring"|"summer"|"autumn"|"winter")[];
  fit?: "slim"|"regular"|"relaxed"|"oversized"; imageUrls: {original: string; thumb: string; cutout?: string};
  vectorEmb?: number[]; availability: {inLaundry: boolean; lastWorn?: ISODate}; createdAt: ISODate;
}
export interface WeatherSnapshot {
  asOf: ISODate; lat: number; lon: number; city?: string; country?: string;
  tempC: number; feelsLikeC: number; precipMm?: number; windKph?: number;
  condition: "clear"|"cloudy"|"rain"|"snow"|"storm";
}
export interface Outfit {
  id: UUID; userId: UUID; items: UUID[]; rationale: string; tags: string[];
  score?: number; weatherContext?: WeatherSnapshot; createdAt: ISODate;
}
export interface Feedback {
  outfitId: UUID; userId: UUID; liked: boolean;
  warmEnough?: boolean; comfortable?: boolean; occasionFit?: boolean; notes?: string; createdAt: ISODate;
}
```

---

## 6) API Contracts (OpenAPI cues)

**REST base:** `/v1`

- `POST /garments` (multipart) → `{ garmentId }`  
- `GET /garments?filters=...` → `Garment[]`  
- `POST /recommendations:generate` → `OutfitResponse`  
- `POST /feedback` → `200`  
- `GET /context/weather?lat&lon` → `WeatherSnapshot`

**OutfitResponse JSON Schema** (agents must output **exactly** this):

```json
{
  "$id": "https://suitup.ai/schema/outfit-response.json",
  "type": "object",
  "required": ["outfits"],
  "properties": {
    "outfits": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["items","tags","rationale","score"],
        "properties": {
          "items": {"type":"array","items":{"type":"object","required":["garmentId"],"properties":{"garmentId":{"type":"string"}}}},
          "tags": {"type":"array","items":{"type":"string"}},
          "rationale": {"type":"string","minLength": 10},
          "warnings": {"type":"array","items":{"type":"string"}, "maxItems": 3},
          "score": {"type":"number","minimum":0,"maximum":1}
        }
      }
    },
    "alternatives": {"type":"array","items":{"type":"object","properties":{"reason":{"type":"string"}}}},
    "diagnostics": {"type":"object"}
  }
}
```

---

## 7) LLM Agent Context & Tools

**System prompt (Stylist Agent)**

```
You are Suit Up!’s Stylist Agent.
OBJECTIVE: Propose 1–3 complete outfits the user can wear now.
CONSTRAINTS:
- Use only garment IDs provided in inventory.candidates.
- Respect weather, formality, dislikes, and availability.
- Enforce color harmony (2–3 colors), silhouette balance, and weather layering.
- Avoid materials unsuitable for conditions (e.g., suede in rain).
OUTPUT: Valid JSON per OutfitResponse schema (no prose outside JSON).
```

**Tooling (function calling) — canonical spec**

```json
[
  {
    "name": "get_weather",
    "description": "Normalized weather snapshot",
    "parameters": {"type":"object","properties":{"lat":{"type":"number"},"lon":{"type":"number"}},"required":["lat","lon"]}
  },
  {
    "name": "search_garments",
    "description": "Retrieve candidate garments",
    "parameters": {"type":"object","properties":{
      "categories":{"type":"array","items":{"type":"string"}},
      "formality":{"type":"integer","minimum":0,"maximum":3},
      "season":{"type":"string"},
      "limit":{"type":"integer","default":50}
    }}
  },
  {
    "name": "record_feedback",
    "description": "Persist structured feedback",
    "parameters": {"type":"object","properties":{
      "outfitId":{"type":"string"},"liked":{"type":"boolean"},"notes":{"type":"string"}
    },"required":["outfitId","liked"]}
  }
]
```

**Validation & repair loop (pseudo)**

```ts
const res = await llm.call(systemPrompt, userJson);
if (!validate(res, OutfitResponseSchema)) {
  const repair = await llm.call(systemPrompt + "
Your last output was invalid JSON. Return valid JSON only.", { last: res, schema: OutfitResponseSchema });
  acceptOrFail(repair);
}
```

---

## 8) Heuristic Rules (pre-LLM)

- **Layering by weather**  
  - ≥25 °C: single breathable layer  
  - 15–20 °C: base + light mid or light outer  
  - 10–15 °C: base + mid + optional outer  
  - <10 °C: insulated outer + accessories  
  - **Rain:** waterproof layer; avoid suede/canvas footwear
- **Palette harmony:** prefer user palette; ≤3 colors; anchor with neutrals.
- **Formality guardrails:** sneakers→derbies→oxfords; denim→chino→wool trouser; tee→OCBD→shirt+blazer.
- **Silhouette balance:** slim ↔ relaxed counterbalance.

> Agents: run these as **filters** before calling the LLM to reduce token use.

---

## 9) Mobile App Architecture (React Native)

- **State/Data:** TanStack Query + Zustand/Redux; normalized entities; optimistic updates.
- **Local DB:** SQLite/WatermelonDB; background sync; conflict resolution = “server wins with merge on notes”.
- **Camera:** `react-native-vision-camera`; JPEG/HEIF; pre-upload crop; optional local background remove.
- **Theming/A11y:** dynamic type; high-contrast; dark/light adaptive.
- **Feature flags:** remote config; kill-switch for LLM.

**Key flows**
1. **Ingest garment:** capture → local review → upload → pipeline enrich → user edits → save.  
2. **Generate outfit:** collect context → request → render variants → like/save → feedback.

---

## 10) Backend Services (NestJS, DDD/Hex)

- **Wardrobe Service:** CRUD garments/outfits; availability status; ownership checks.
- **Recommendation Service:** retrieval → rules → LLM → validate → rerank; store diagnostics.
- **Media Service (worker):** EXIF scrub → background removal → color/pattern/material classifiers → embeddings → thumbs.
- **Context Service:** weather, reverse-geo, calendar hooks.
- **Search Service:** text + vector (pgvector) for similar items, duplicate detection.

**Cross-cutting**
- **Auth:** OAuth/Apple/Google or passwordless; JWT short + refresh; device binding.
- **Events:** outbox → Kafka topics: `garment.created`, `garment.processed`, `reco.requested`, `reco.accepted`.
- **Caching:** Redis for sessions, weather, hot recos.

---

## 11) Data & Storage

- **Postgres schemas** per bounded context.  
- **pgvector** column on `garments(vector_emb)`.  
- **S3 buckets:** `raw/`, `cutout/`, `thumb/`; lifecycle to cold after 30 d.  
- **PII policy:** garment images are non-PII; user tokens encrypted.  
- **Migrations:** Prisma/Liquibase; blue/green deploys.

---

## 12) Testing & Quality Gates

- **Unit:** >80% critical domains; Zod/Schema tests for contracts.  
- **API Contract:** OpenAPI snapshot tests; Pact (consumer/provider).  
- **Mobile E2E:** Detox/Maestro happy paths (capture, recommend, feedback).  
- **Load:** Reco P95 under 1.2 s @ expected QPS.  
- **Prompt eval:** golden set of contexts → expected JSON → drift alerts.

---

## 13) CI/CD & Environments

- **Pipelines:** lint, typecheck, unit, contracts, build images; mobile build lanes.  
- **Secrets:** Vault/Secret Manager; no secrets in env files committed.  
- **Feature flags:** progressive rollouts; canary for recommender.

**Env variables (stable names)**
```
AUTH_JWT_SECRET
DB_URL
REDIS_URL
S3_ENDPOINT / S3_ACCESS_KEY / S3_SECRET
WEATHER_API_KEY
LLM_PROVIDER / LLM_MODEL / LLM_TIMEOUT_MS / LLM_MAX_TOKENS
RECO_MAX_REPAIR_ATTEMPTS=1
PGVECTOR_ENABLED=true
```

---

## 14) Security, Privacy, Compliance

- TLS everywhere; HSTS.  
- KMS encryption at rest (DB, S3).  
- **Data subject rights:** export/delete; delete embeddings and cached vectors on account deletion.  
- **Audit:** auth events, admin actions; anomaly alerts.  
- **Abuse:** upload limits, content type checks, AV scan.

---

## 15) Observability & KPIs

- **Traces:** Mobile → Gateway → Services (OTel IDs).  
- **Logs:** structured JSON; PII-safe.  
- **Key metrics:**  
  - JSON validity rate (LLM): **>98%**  
  - Outfit accept CTR (per cohort)  
  - Pipeline failure rate **<1%**  
  - Reco P95 latency  
  - Weather cache hit rate **>80%**  
- **Dashboards:** API latency, worker queue depth, token spend per user.

---

## 16) Prompt Snippets (copy-ready)

**Ask for an outfit (agent call)**

```json
{
  "intent": {"type":"request_outfit","occasion":"office","activities":["commute","meetings"],
    "constraints":{"formality":1,"mustAvoid":["white sneakers today"]}},
  "environment": {"weather":{"tempC":12,"feelsLikeC":10,"condition":"rain","windKph":20},
    "location":{"city":"Paris","country":"FR"}},
  "user":{"locale":"fr-FR","styleProfile":{"archetypes":["minimal","business"],
    "palette":["#1a1a1a","#ffffff","#0d6efd"],"dislikes":["neon"],"dressCodes":["smart-casual"],"warmthPreference":0}},
  "inventory":{"candidates":[/* subset of garments with ids+attrs */]},
  "history":{"recentOutfits":[],"feedback":[]},
  "outputSpec":{"maxOutfits":3,"explain":true,"format":"JSON"}
}
```

**Request to generate code (backend controller + tests)**

> “Using **NestJS** and the API contract `POST /v1/recommendations:generate` that returns `OutfitResponse` (schema below), generate:
> 1) Controller and DTO validation with **Zod** or **class-validator**,  
> 2) A service stub calling `RecoEngine.generate()`,  
> 3) Unit tests that validate schema errors and happy path,  
> 4) OTel trace spans.”

(Then paste the JSON Schema from §6.)

---

## 17) Risk Register & Open Questions

- **RQ-01:** On-device background removal viability on low-end devices? (Battery/latency trade-offs)  
- **RQ-02:** Cold-start on empty closets—how to avoid poor first recommendations?  
- **RQ-03:** Seasonal localization (southern hemisphere) — heuristics vs explicit user setting?  
- **Security-01:** Handling compromised refresh tokens on multi-device accounts.

> Agents proposing solutions must tag the risk ID and state mitigation.

---

## 18) Glossary

- **Cutout:** garment image with background removed (PNG).  
- **Warmth Index:** coarse measure (-2 .. +2) mapping to layering.  
- **Formality:** 0 casual … 3 formal ladder.  
- **Acceptance CTR:** % of shown outfits that user saves/uses.

---

## 19) Code Conventions (brief)

- **TS strict**; ESLint + Prettier; no `any`.  
- **Logic in services, not controllers.**  
- **Error model:** problem+json with stable error codes.  
- **Frontend:** feature-based folders, hooks for data access, server-driven schemas when possible.

---

## 20) Changelog (for prompts)

- **2025-10-17:** Initial template published.  
- **TODO:** Link ADR-IDs to PRs; add concrete OpenAPI; add golden prompt set.

---

### Final note to future agents
If a requested change conflicts with ADRs or NFRs, **propose an ADR** (draft status) with trade-offs and a migration sketch before generating code.
