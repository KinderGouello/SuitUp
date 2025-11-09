# ✅ Checklist Post-Migration - Actions à Effectuer

## 🎯 Tests Immédiats (Maintenant)

### 1. Tester l'API Backend
```bash
# Terminal 1 - Démarrer l'API
pnpm dev:api

# Terminal 2 - Tester les endpoints
curl http://localhost:3000/
curl http://localhost:3000/health
```

**Résultats attendus**:
- `/` → Message de bienvenue avec version et endpoints
- `/health` → Status OK avec uptime et timestamp

---

### 2. Tester l'App Mobile
```bash
# Démarrer Expo
pnpm dev:mobile

# Puis presser:
# - 'i' pour iOS simulator
# - 'a' pour Android emulator
# - 'w' pour web browser
```

**Points à vérifier**:
- [ ] L'app démarre sans erreurs
- [ ] Navigation entre les tabs fonctionne
- [ ] SQLite database s'initialise
- [ ] Les items de seed s'affichent dans la garde-robe
- [ ] Hot reload fonctionne (modifier un fichier et voir le changement)

---

### 3. Tester les Deux en Parallèle
```bash
# Lancer mobile + API simultanément
pnpm dev
```

**Points à vérifier**:
- [ ] Les deux serveurs démarrent sans conflit de ports
- [ ] Logs des deux apps visibles dans le terminal
- [ ] Pas de crash ou d'erreurs critiques

---

## 📝 Corriger les Erreurs TypeScript (Optionnel mais Recommandé)

Les erreurs suivantes existaient **avant** la migration et doivent être corrigées:

### Fichier `apps/mobile/lib/styles/tokens.ts`
**Erreur**: Propriétés manquantes (`h3`, `gray600`, `border`, `humidity`)

**Action**: Ajouter les tokens manquants ou les remplacer par des existants dans les composants.

### Fichier `apps/mobile/hooks/useFrameworkReady.ts:11`
**Erreur**: `window` non défini

**Action**: Ajouter une vérification:
```typescript
if (typeof window !== 'undefined') {
  // ... code utilisant window
}
```

---

## 🔄 Commit et Push

Une fois que vous avez validé que tout fonctionne:

```bash
# 1. Vérifier les fichiers modifiés
git status

# 2. Ajouter tous les changements
git add .

# 3. Créer le commit de migration
git commit -m "feat: migrate to turborepo monorepo

- Move mobile app to apps/mobile
- Add Node.js/Fastify API in apps/api
- Setup pnpm workspaces
- Configure Turborepo with caching
- Add shared eslint-config and typescript-config packages
- Setup Changesets for versioning
- Add comprehensive documentation (README.md, MIGRATION.md)

BREAKING CHANGE: Project structure changed to monorepo"

# 4. Push vers la branche main (ou créer une PR)
git push origin main
```

---

## 📦 Premier Changeset (Optionnel)

Pour tester le système de versioning:

```bash
# 1. Créer un changeset
pnpm changeset

# Répondre aux questions:
# - Quels packages sont affectés? (Sélectionner @suitup/mobile et @suitup/api)
# - Type de changement? (major/minor/patch)
# - Description du changement

# 2. Le fichier .changeset/xxx.md est créé
# 3. Commiter ce fichier
git add .changeset/
git commit -m "chore: add changeset for initial release"

# 4. Versionner les packages
pnpm version-packages

# 5. Cela mettra à jour les package.json avec les nouvelles versions
```

---

## 🚀 Développement Quotidien

### Ajouter une dépendance à Mobile
```bash
pnpm --filter @suitup/mobile add react-native-package
```

### Ajouter une dépendance à l'API
```bash
pnpm --filter @suitup/api add fastify-plugin
```

### Créer un nouveau package partagé
```bash
# 1. Créer le répertoire
mkdir -p packages/my-package/src

# 2. Créer package.json
cat > packages/my-package/package.json <<EOF
{
  "name": "@suitup/my-package",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "dependencies": {}
}
EOF

# 3. Créer src/index.ts
echo "export const hello = 'world';" > packages/my-package/src/index.ts

# 4. Réinstaller pour que pnpm détecte le nouveau package
pnpm install
```

### Utiliser un package partagé
```typescript
// Dans apps/mobile ou apps/api
import { hello } from '@suitup/my-package';
```

---

## 🔍 Debugging

### Problème: Metro ne trouve pas les modules workspace
**Solution**:
```bash
# 1. Vérifier pnpm-workspace.yaml
cat pnpm-workspace.yaml

# 2. Réinstaller avec hoist forcé
pnpm install --shamefully-hoist

# 3. Nettoyer le cache Metro
cd apps/mobile
rm -rf .expo node_modules/.cache
```

### Problème: Turborepo cache ne fonctionne pas
**Solution**:
```bash
# Effacer le cache
rm -rf .turbo

# Relancer avec verbose
pnpm build --verbosity=2
```

### Problème: TypeScript ne trouve pas les types
**Solution**:
```bash
# Régénérer les types
pnpm install

# Redémarrer l'éditeur (VSCode)
# Cmd+Shift+P → "Reload Window"
```

---

## 📊 Métriques de Succès

À la fin de cette checklist, vous devriez avoir:

- [ ] ✅ Backend API qui répond sur `http://localhost:3000`
- [ ] ✅ App mobile qui démarre sans erreurs
- [ ] ✅ Hot reload fonctionnel sur mobile et API
- [ ] ✅ Turborepo cache qui accélère les rebuilds
- [ ] ✅ Code commité et pushé
- [ ] ✅ Documentation complète lue (README.md, MIGRATION.md)
- [ ] ✅ Vous comprenez comment ajouter des dépendances
- [ ] ✅ Vous savez créer un changeset

---

## 🎉 Prochaines Étapes

Une fois cette checklist complétée, vous êtes prêt à:

1. **Développer de nouvelles features** dans mobile ou API
2. **Extraire du code partagé** dans packages/
3. **Configurer CI/CD** avec GitHub Actions
4. **Ajouter des tests** (Jest, Playwright, etc.)
5. **Déployer** l'API sur un service cloud (Railway, Render, etc.)

---

## 📞 Aide Supplémentaire

Si vous rencontrez des problèmes:

1. Consultez [MIGRATION.md](MIGRATION.md) pour les détails techniques
2. Lisez [README.md](README.md) pour les commandes disponibles
3. Vérifiez la [documentation Turborepo](https://turbo.build/repo/docs)
4. Ouvrez une issue GitHub pour des bugs spécifiques

**Bonne chance! 🚀**
