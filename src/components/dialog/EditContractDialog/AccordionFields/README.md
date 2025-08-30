# Composants de Signature

Ce dossier contient les composants refactorisés pour la gestion des signatures dans l'éditeur de contrat.

## Structure

### Composants

- **`Signatures.tsx`** - Composant principal qui orchestre l'affichage et l'édition des signatures
- **`SignatureCanvas.tsx`** - Composant pour afficher une signature existante avec bouton d'édition
- **`SignatureEditor.tsx`** - Composant pour l'édition de signature avec SignaturePad

### Hooks et Services

- **`useSignatureManager.ts`** - Hook personnalisé et singleton pour gérer la logique des signatures

### Types et Constantes

- **`types.ts`** - Interfaces et types TypeScript
- **`constants.ts`** - Constantes pour les classes CSS, labels et titres
- **`index.ts`** - Exports centralisés

## Utilisation

### Utilisation avec le hook (recommandé pour les composants)

```tsx
import { Signatures } from "./AccordionFields";

// Dans votre composant
<Signatures 
  toggleItem={toggleItem}
  items={items}
/>
```

### Utilisation directe du singleton

```tsx
import { getSignatureManager } from "./AccordionFields";

// Accès direct au singleton
const signatureManager = getSignatureManager();
const signatures = signatureManager.signatures;
const updateSignature = signatureManager.updateSignature;
```

## Fonctionnalités

- Affichage de deux signatures (remplacé et remplaçant)
- Édition de signature avec SignaturePad
- Sauvegarde et restauration des signatures
- Interface responsive
- Gestion des événements de redimensionnement

## Améliorations apportées

1. **Séparation des responsabilités** : Chaque composant a une responsabilité unique
2. **Réutilisabilité** : Les composants sont modulaires et réutilisables
3. **Maintenabilité** : Code organisé avec types et constantes centralisés
4. **Lisibilité** : Code plus clair et plus facile à comprendre
5. **Performance** : Optimisation des effets et de la gestion d'état
6. **Singleton Pattern** : Instance unique partagée dans toute l'application
7. **Flexibilité** : Possibilité d'utiliser le hook ou d'accéder directement au singleton

## Intégration avec PDFTool

La classe `PDFTool` a été mise à jour pour fonctionner avec les nouveaux signaux de signature :

### Méthodes mises à jour

- **`downloadModifiedPdf(pdfFile, signatures)`** : 
  - Accepte maintenant le signal `signatures` contenant les DataURL
  - Utilise directement les DataURL des signatures stockées dans le signal
  - Plus fiable car ne dépend pas des canvases DOM
  - Inclut des logs de débogage pour diagnostiquer les problèmes

- **`updateSignaturesInContract(signatures)`** : 
  - Met à jour les signatures dans les données du contrat
  - Utilise directement les DataURL du signal `signatures`
  - Plus simple et plus fiable
  - Inclut des logs pour confirmer la mise à jour

- **`downloadModifiedPdfWithStoredSignatures(pdfFile)`** : 
  - Méthode alternative qui utilise les signatures stockées dans `contractData`
  - Plus fiable car elle ne dépend pas des signaux en temps réel
  - Recommandée pour le téléchargement final

### Exemple d'utilisation

```tsx
import { useSignatureManager } from "./useSignatureManager";
import { PDFTool } from "../../contract/editor/PDFTool";

const { signatures } = useSignatureManager();
const pdfTool = new PDFTool("url", "canvas-id");

// Méthode 1: Utiliser les DataURL directement
await pdfTool.downloadModifiedPdf(
  pdfFile,
  signatures
);

// Méthode 2: Mettre à jour les signatures dans le contrat
pdfTool.updateSignaturesInContract(signatures);

// Méthode 3: Utiliser les signatures stockées (recommandée)
pdfTool.updateSignaturesInContract(signatures);
await pdfTool.downloadModifiedPdfWithStoredSignatures(pdfFile);
```

### Dépannage

Si les signatures n'apparaissent pas dans le PDF téléchargé :

1. **Vérifiez les logs dans la console** pour voir si les DataURL sont récupérés
2. **Utilisez la méthode `downloadModifiedPdfWithStoredSignatures`** qui est plus fiable
3. **Assurez-vous que les signatures ont été sauvegardées** avant le téléchargement
4. **Vérifiez que les DataURL contiennent du contenu** en inspectant les logs
5. **Vérifiez que le signal `signatures` contient les bonnes données**
