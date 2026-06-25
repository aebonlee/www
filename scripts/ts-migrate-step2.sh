#!/bin/bash
# Step 2: Create tsconfig.json, vite-env.d.ts, update index.html, rename files, fix catch patterns

TSCONFIG='{"compilerOptions":{"target":"ES2020","useDefineForClassFields":true,"lib":["ES2020","DOM","DOM.Iterable"],"module":"ESNext","skipLibCheck":true,"moduleResolution":"bundler","allowImportingTsExtensions":true,"isolatedModules":true,"moduleDetection":"force","noEmit":true,"jsx":"react-jsx","strict":true,"noImplicitAny":false,"strictNullChecks":false,"noUnusedLocals":false,"noUnusedParameters":false,"noFallthroughCasesInSwitch":true,"noUncheckedSideEffectImports":true},"include":["src"]}'

PROJECTS="planning aI-agents chatgpt autowork genspark forjob koreait gemini ai-media career allthat software papers ai-data uxdesign marketing koreatech ai-prompt ahp_basic"

for proj in $PROJECTS; do
  DIR="D:/dreamit-web/$proj"
  echo "=== $proj ==="

  # tsconfig.json
  echo "$TSCONFIG" > "$DIR/tsconfig.json"

  # vite-env.d.ts
  echo '/// <reference types="vite/client" />' > "$DIR/src/vite-env.d.ts"

  # Update index.html
  sed -i 's/main\.jsx/main.tsx/g' "$DIR/index.html"

  # Rename .jsx to .tsx
  find "$DIR/src" -name "*.jsx" -exec bash -c 'mv "$0" "${0%.jsx}.tsx"' {} \;

  # Fix catch patterns
  find "$DIR/src" -name "*.tsx" -exec sed -i 's/catch (err)/catch (err: any)/g' {} \;
  find "$DIR/src" -name "*.tsx" -exec sed -i 's/catch (error)/catch (error: any)/g' {} \;
  find "$DIR/src" -name "*.tsx" -exec sed -i 's/catch (e)/catch (e: any)/g' {} \;

  TSX=$(find "$DIR/src" -name "*.tsx" | wc -l)
  JSX=$(find "$DIR/src" -name "*.jsx" | wc -l)
  echo "  tsx=$TSX jsx=$JSX"
done

echo "STEP 2 COMPLETE"
