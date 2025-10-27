# Suit Up! — Product Requirements & AI Prompting Context (v0.1)

_Last updated: 2025‑10‑17_

---

## 1) Product vision & goals

**Vision:** Help anyone decide what to wear _today_ by combining their wardrobe, personal style, and local conditions (weather, activities, dress code), with explainable AI suggestions.

**Primary goals (MVP):**

- Let users digitize their wardrobe quickly (photo → auto‑tag → confirm).
- Generate on‑demand outfit suggestions that feel personal, practical, and stylish.
- Explain “why this outfit.”
- Respect privacy; be fast and lightweight.

**Secondary goals (vNext):**

- Calendar/occasion sync, packing lists, capsule wardrobe insights, and social sharing.

**North‑star metric:** % sessions with at least one outfit accepted (saved/worn/exported).

**Supporting metrics:** first wardrobe item added within 5 min; median auto‑tag accuracy >85%; time‑to‑first outfit <60s; retention D7/D30.

---

## 2) Target users & personas

- **Busy Pragmatist (primary):** wants quick, climate‑appropriate outfits. Success = minimal time to decision.
- **Style Explorer:** wants inspiration and variety. Success = high novelty without clashing with preferences.
- **Planner/Packer:** wants capsule packing and upcoming‑week looks based on forecast + calendar.

Accessibility note: support screen readers, high contrast, tap targets ≥44px, color‑blind‑safe feedback.

---

## 3) Core user journeys (MVP)

1. **Onboard & seed wardrobe** → photo capture/import → background removal → AI attributes → user confirms → item saved.
2. **Request outfit** → (optional) set occasion/activity → fetch geolocation & weather snapshot → generate 3 looks → user accepts/edits/saves.
3. **Explain & adjust** → show rationale (temp, precipitation, style fit) → quick swaps (top/bottom/shoes/accessories) → re‑roll.

---

## 4) Functional requirements (MVP)

### 4.1 Wardrobe capture & management

- Take/upload photos; automatic background removal and square crop.
- Multi‑item batch import.
- Auto‑tag (category, subcategory, color, material, warmth/insulation score, formality, brand if visible, seasonality, care).
- User corrections override model.
- Item states: `draft` → `verified` → `archived` (see state machine below).

### 4.2 Preferences & constraints

- Style profiles (e.g., minimal, classic, street, boho; user can multi‑select, weighted).
- Fit constraints: preferred silhouettes, rise, heel height comfort, fabric sensitivities.
- Dress codes: work casual, business formal, smart casual, cocktail, outdoors, sports.
- Color rules: liked/disliked palettes; skin undertone (optional); avoid‑together lists.

### 4.3 Context ingestion

- Geolocation permission with fallback city entry.
- Weather snapshot: temp min/max, feels like, precipitation probability, wind, UV, sunrise/sunset at outfit generation time.
- Occasion: free text + presets (date, party, office, interview, hiking, travel, etc.).
- Activity constraints (walking >10k steps? bike commute?).

### 4.4 Outfit generation

- Request yields 3 distinct suggestions (Top/Bottom/Dress, Layers, Shoes, Accessories).
- Each suggestion includes an **explanation** and **confidence** (0–1), plus **comfort bands** (temp range satisfied).
- Swap controls per slot; “lock” parts and re‑roll remainder.
- Duplicates and out‑of‑season items are down‑weighted by default.

### 4.5 Save, share, and history

- Save outfit; mark worn; export image (grid/ghost mannequin) & text list.
- History with quick re‑wear and season filters.

### 4.6 Privacy & permissions

- Local processing for photos where possible; user‑controlled cloud sync.
- Granular toggles: geolocation, analytics, model improvement opt‑in.

---

## 5) Non‑functional requirements

- **Performance:** p95 wardrobe add ≤1.5s after photo; p95 outfit generation ≤3s (with cache).
- **Offline:** cached wardrobe; cached last forecast; degrade gracefully (show context‑free outfits).
- **Observability:** trace ID per generation; metrics on rejection/acceptance reasons.
- **Security:** OAuth; at‑rest encryption; signed URLs for images; PII minimization.

---

## 6) Data model (canonical JSON schemas)

```json
// User
{
  "userId": "uuid",
  "profile": {
    "name": "string",
    "heightCm": 168,
    "skinUndertone": "neutral|warm|cool|null",
    "styleWeights": { "classic": 0.6, "minimal": 0.4 },
    "colorLikes": ["navy", "camel"],
    "colorDislikes": ["neon green"],
    "fitConstraints": { "heelMaxCm": 6, "rise": "mid|high|low|null" },
    "allergies": ["wool"],
    "commute": { "walkKm": 3, "bike": false }
  },
  "settings": { "units": "metric", "cloudSync": true, "analyticsOptIn": true }
}
```

```json
// WardrobeItem
{
  "itemId": "uuid",
  "userId": "uuid",
  "state": "draft|verified|archived",
  "media": { "imageUrl": "https://...", "thumbUrl": "https://..." },
  "category": "top|bottom|dress|outerwear|shoes|accessory",
  "subcategory": "tshirt|shirt|jeans|chinos|skirt|coat|sneakers|boots|scarf|...",
  "colorPrimary": "navy",
  "colorSecondary": ["white"],
  "material": ["cotton", "elastane"],
  "styleTags": ["minimal", "classic"],
  "formality": 0.4,
  "warmth": 0.3,
  "seasonality": ["spring", "summer"],
  "care": ["machine_cold"],
  "brand": "optional",
  "fit": { "rise": "mid", "lengthDescriptor": "crop|regular|long" },
  "notes": "string",
  "createdAt": "ISO",
  "updatedAt": "ISO"
}
```

```json
// WeatherSnapshot
{
  "lat": 48.8566,
  "lon": 2.3522,
  "timestamp": "ISO",
  "source": "providerId",
  "tempC": 16.2,
  "tempMinC": 14.0,
  "tempMaxC": 18.0,
  "feelsLikeC": 15.8,
  "precipProb": 0.2,
  "windKph": 12,
  "uvIndex": 3,
  "sunrise": "ISO",
  "sunset": "ISO"
}
```

```json
// OutfitSuggestion
{
  "suggestionId": "uuid",
  "userId": "uuid",
  "context": {
    "occasion": "office",
    "activity": { "steps": 10000, "bike": false },
    "weather": { /* WeatherSnapshot */ },
    "constraints": { "avoid": ["neon green"], "mustInclude": [] }
  },
  "slots": {
    "top": "itemId",
    "bottom": "itemId",
    "dress": null,
    "outerwear": "itemId",
    "shoes": "itemId",
    "accessories": ["itemId", "itemId"]
  },
  "explanation": "Layered due to wind; navy complements camel; sneakers for 10k steps.",
  "confidence": 0.84,
  "comfortBandC": { "min": 12, "max": 20 },
  "version": "rec-0.1"
}
```

---

## 7) Item state machine

```
[draft] --(user confirms attributes)--> [verified] --(user archives)--> [archived]
[archived] --(restore)--> [verified]
```

Invalid transitions blocked; outfits only pull from `verified`.

---

## 8) System architecture (high‑level)

- **Mobile app (React Native):** capture, local cache (SQLite), inference for bg‑removal on‑device when possible.
- **API Gateway (REST/GraphQL):** authn/z, rate limiting, schema validation.
- **Wardrobe Service:** items CRUD, media pipeline, search.
- **Media Service:** signed upload URLs, background removal, thumbnails, CDN.
- **Profile/Prefs Service:** style weights, constraints, AB flags.
- **Context Service:** geolocation normalization, weather snapshot (provider abstraction + caching).
- **Recommendation Service:** rule‑based core + LLM rerank + color/fabric compatibility engine; explanation generator.
- **Feature Store & Embeddings:** item vectors (color/material/style), user taste vectors, retrieval for candidate generation.
- **Telemetry/Experimentation:** events, funnels, holdouts.

---

## 9) External integrations

- **Weather:** provider abstraction (e.g., Open‑Meteo, Tomorrow.io); cache by (lat, lon, hour) TTL 60min.
- **Background removal:** on‑device (MLKit/Metal) with server fallback (U2‑Net‑like).
- **Login:** Apple, Google; optional email magic link.

---

## 10) APIs (selected endpoints)

```
POST /v1/items: {imageUploadUrl} → itemId
PATCH /v1/items/{id}: attributes update
GET   /v1/items?state=verified
POST /v1/outfits: {occasion, activity, location|city, preferences?}
GET   /v1/outfits/{id}
POST /v1/outfits/{id}/feedback: {accepted:boolean, reasons:[…], swaps:{slot:itemId}}
GET   /v1/weather/snapshot?lat&lon
```

GraphQL example:

```
mutation GenerateOutfit($input: OutfitInput!) { generateOutfit(input:$input) { id, slots { top bottom shoes outerwear accessories }, explanation, confidence } }
```

---

## 11) Recommendation logic (hybrid)

1. **Candidate generation (deterministic):**

   - Filter: verified items, dress code, weather comfort (warmth vs temp), activity constraints, user dislikes.
   - Build outfits via rules (top+bottom vs dress; outerwear if wind/temp < threshold; shoe comfort).

2. **Scoring:**

   - **Heuristics:** seasonality match, color harmony (complementary/analogous/neutral), formality distance to target.
   - **Similarity to user taste:** cosine between item embeddings and user taste vector.
   - **Diversity penalty:** reduce near‑duplicates within same request.

3. **LLM rerank + explanation:**

   - Input structured context, output natural‑language rationale and confidence.

Fallbacks: if <3 viable outfits, relax constraints by step (expand colors → allow neutral outerwear → drop accessories → allow near‑season items).

---

## 12) Prompting context for agents (authoritative source)

> The following templates standardize interactions for extraction, normalization, recommendation, and explanation. Use strict JSON outputs where specified.

### 12.1 Item attribute extraction (from photo + minimal hints)

**System:** “You extract clothing attributes from a single item photo. Be conservative; prefer ‘unknown’ to hallucination. Return strict JSON (schema below). Do not invent brand.”
**User:** _Inputs_: base64 image ref, optional free‑text notes.
**Output JSON schema:**

```json
{
  "category": "top|bottom|dress|outerwear|shoes|accessory|unknown",
  "subcategory": "string|unknown",
  "primaryColor": "string|unknown",
  "secondaryColors": ["string"],
  "material": ["cotton", "wool", "polyester", "leather", "denim", "unknown"],
  "styleTags": ["minimal", "classic", "street", "sport", "boho", "preppy", "y2k", "unknown"],
  "formality": 0.0,
  "warmth": 0.0,
  "seasonality": ["spring", "summer", "autumn", "winter"],
  "care": ["machine_cold", "hand_wash", "dry_clean", "unknown"]
}
```

**Guardrails:** if ambiguous color under warm light, lean neutral (black/white/navy/grey) and set `confidenceMap` by field.

### 12.2 Normalization & deduping

**Goal:** prevent near‑duplicates (e.g., 3 identical white tees).
**Prompt:** “Given new item attributes and existing inventory list (up to 50 nearest neighbors by embedding), decide if the item is duplicate (≥0.92 cosine). Output `{isDuplicate:boolean, duplicateOf:itemId|null, reason}`.”

### 12.3 Weather‑aware outfit generator (LLM re‑rank stage)

**System:** “You score and explain candidate outfits using weather, activity, and user preferences. You must prefer comfort and dress code compliance. Penalize disliked colors. Encourage variety across suggestions.”
**Input:** candidates (max 12), user profile, weather snapshot, occasion, activity, recent history (last 7 days).
**Output JSON:**

```json
{
  "ranked": [
    { "candidateId": "id", "score": 0.0, "explanation": "…", "comfortBandC": {"min": 12, "max": 20} }
  ],
  "diversityNotes": "…"
}
```

### 12.4 Natural‑language rationale (user‑facing)

**Prompt:** “Explain the outfit in ≤2 sentences: reference temperature/wind/precip; mention one color/style harmony; mention activity comfort. End with a concise styling tip.”

### 12.5 Style coaching (optional)

**Prompt:** “Given the saved outfit and wardrobe gaps, suggest 1–2 additions that maximize versatility in this user’s palette. Avoid upsell tone.”

---

## 13) Evaluation & quality

- **Attribute extraction:** manual audit sample; field‑level F1; confusion on colors/materials.
- **Outfit acceptance rate:** overall and per‑context (rainy, hot, formal).
- **Diversity index:** unique items per week used in top‑1 suggestions.
- **Novelty vs comfort tradeoff:** A/B test exploration weight.
- **Latency SLOs:** p95 <3s for generation.
- **Human‑in‑the‑loop:** quick thumbs up/down per slot; capture reasons (too cold, color clash, formality off).

Offline eval harness: fixed seed wardrobe + rotating weather scripts (hot/dry, cold/windy, rainy/commute) → compare heuristics vs LLM‑rerank scores to human ratings.

---

## 14) Telemetry (event contract)

- `ItemAdded(itemId, autoTagAccuracy, correctedFields[])`
- `OutfitRequested(contextHash, candidatesN, latencyMs)`
- `OutfitShown(suggestionId, rank)`
- `OutfitAccepted(suggestionId)` / `OutfitRejected(suggestionId, reasons[])`
- `SlotSwap(suggestionId, slot, fromItem, toItem)`
- `ExplainViewed(suggestionId)`
- `Crash/Perf(AppStart, WarmStart, GenLatency)`

All events anonymized; userId hashed.

---

## 15) UX flows (MVP)

- **Onboarding:** 3‑card value prop → permission asks (photos, location) with rationale → add first 3 items → first outfit.
- **Wardrobe grid:** filters by category, season, color; long‑press to edit.
- **Generator screen:** occasion/activity chips; location preview; ‘Generate’ CTA; results carousel; swap chips.
- **Explain panel:** weather badges + short rationale; ‘How to tweak’ tips.

---

## 16) Accessibility & i18n

- Dynamic type, VoiceOver/ TalkBack labels, focus order tested.
- Locales: EN, FR (metric/imperial), later ES/DE/PT.
- Date/time/units auto localized.

---

## 17) Privacy, safety, fairness

- Photos stay local by default; cloud toggle = explicit consent.
- No sale of data; ads prohibited (paid model later).
- Bias checks: diverse style examples; avoid gender stereotypes; neutral messaging.
- Right to delete: full wipe including images and embeddings.

---

## 18) Roadmap

**MVP (8–10 weeks):** capture → auto‑tag → generate 3 looks with weather; explain; save.
**v1.1:** calendar sync; outfit plan for the week; packing generator.
**v1.2:** social share; capsule insights; wardrobe gaps.

---

## 19) Acceptance criteria (samples)

- When user denies geolocation, city input is required; forecast fetched by city.
- With rain prob ≥60%, at least one suggestion includes water‑resistant outerwear and closed shoes.
- For activity steps ≥10k, heel height suggestions ≤ user `heelMaxCm` and comfort shoes prioritized.
- If wardrobe has <5 verified items, show ‘boost import’ flow with tips and batch add.

---

## 20) Open questions

- Warmth scoring calibration—community dataset vs learned from feedback?
- Should we recommend laundry/care scheduling? (defer)
- How to handle multi‑climate travel days (AM cold → PM warm)? Adaptive layering v1.1.

---

## 21) Visual references & component inventory (for design systems)

- Image card with removable bg mask; tag chips; confidence badges.
- Weather bar (temp, precip %, wind) with color‑blind‑safe icons.
- Generator result card: slot thumbnails, rationale text, swap locks, ‘save’ CTA.
- Color tokens: neutrals (white/ivory/grey/black), navies, earth tones (camel/olive), accent palettes by user.

---

## 22) Security & compliance

- JWT with short TTL + refresh; Keychain/Secure Enclave for tokens.
- S3‑like bucket with least privilege; signed PUT URLs; object lifecycle rules.
- GDPR readiness: export & delete endpoints; DPA for processors.

---

## 23) Edge cases

- Very small wardrobes; all‑black wardrobes; niche items (tux, hiking boots only).
- Severe weather: heatwave (>35°C), storm (wind >50kph), heavy rain (>80% prob) → safety tips.
- No network: fallback cached outfits not tied to weather.

---

## 24) Testing strategy

- Unit: extraction mappers, rule engines, color compatibility, filters.
- Contract tests: API schemas.
- Snapshot tests: generator UI cards.
- Synthetic user tests: scripted wardrobes + weather fixtures.
- Device matrix: low‑end Android to flagship iOS; cold‑start/warm‑start.

---

## 25) Example payloads

**Outfit request:**

```json
{
  "occasion": "office",
  "activity": {"steps": 12000},
  "location": {"city": "Paris", "lat": 48.8566, "lon": 2.3522},
  "preferencesOverride": {"disliked": ["neon green"]}
}
```

**Outfit response (abridged):**

```json
{
  "suggestions": [
    {
      "slots": {"top":"it_top_1","bottom":"it_bot_2","outerwear":"it_coat_4","shoes":"it_shoe_8","accessories":["it_scarf_3"]},
      "explanation": "Windy 16°C—light coat + scarf for warmth; navy and camel harmonize; sneakers comfy for 12k steps.",
      "confidence": 0.86
    },
    { "slots": {"dress":"it_dress_9","outerwear":"it_trench_2","shoes":"it_boot_5"}, "explanation": "…", "confidence": 0.81 },
    { "slots": {"top":"it_top_7","bottom":"it_jeans_5","shoes":"it_sneaker_1"}, "explanation": "…", "confidence": 0.78 }
  ]
}
```

---

## 26) Release checklist (MVP)

- [ ] Data schemas versioned and validated
- [ ] Weather provider abstraction + cache
- [ ] Image pipeline (bg removal + thumb)
- [ ] Rule engine + LLM rerank + explanations
- [ ] Telemetry dashboards + SLOs
- [ ] Privacy toggles and data export/delete
- [ ] App Store/Play metadata, privacy nutrition labels

---

**End of spec v0.1**
