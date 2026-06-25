#!/bin/bash
set -e
PROJECT=$1
DIR="/d/dreamit-web/$PROJECT"
echo "=== Migrating $PROJECT ==="
if [ ! -f "$DIR/package.json" ] || [ ! -d "$DIR/src" ]; then
  echo "SKIP: $PROJECT - no package.json or src/"
  exit 0
fi
if [ -f "$DIR/tsconfig.json" ]; then
  echo "SKIP: $PROJECT - already has tsconfig.json"
  exit 0
fi
cd "$DIR"
npm install -D typescript @types/react @types/react-dom 2>&1 | tail -3

# Create tsconfig.json
node -e "
const tsconfig = {
  compilerOptions: {
    target: 'ES2020', useDefineForClassFields: true,
    lib: ['ES2020', 'DOM', 'DOM.Iterable'], module: 'ESNext',
    skipLibCheck: true, moduleResolution: 'bundler',
    allowImportingTsExtensions: true, isolatedModules: true,
    moduleDetection: 'force', noEmit: true, jsx: 'react-jsx',
    strict: true, noUnusedLocals: true, noUnusedParameters: true,
    noFallthroughCasesInSwitch: true, noUncheckedSideEffectImports: true,
    baseUrl: '.', paths: { '@/*': ['src/*'] }
  },
  include: ['src']
};
require('fs').writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
"

echo '/// <reference types="vite/client" />' > src/vite-env.d.ts
[ -f vite.config.js ] && git mv vite.config.js vite.config.ts || true

cd src
find . -name "*.jsx" -exec bash -c 'git mv "$0" "${0%.jsx}.tsx"' {} \; 2>&1 || true
find . -name "*.js" -exec bash -c 'git mv "$0" "${0%.js}.ts"' {} \; 2>&1 || true
cd ..

sed -i 's/main\.jsx/main.tsx/g; s/main\.js"/main.ts"/g' index.html 2>&1 || true
echo "=== Setup done for $PROJECT ==="
