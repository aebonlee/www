#!/bin/bash
# Build and Deploy all dreamitbiz projects
# 2026-03-25

echo "===== BUILD & DEPLOY START ====="

# Vite projects with deploy script (gh-pages)
DEPLOY_PROJECTS=(
  ahp_basic c-study python-study java-study algorithm
  data-structure ai-prompt software ai-data self-branding
  reactStudy webstudy uxdesign hohai
  coding linux-study koreatech career english japanese
  digitalbiz marketing edu-hub allthat papers reserve docs
  db-study koreait aebon
)

for dir in "${DEPLOY_PROJECTS[@]}"; do
  echo ""
  echo ">>> BUILD: $dir"
  cd "D:/dreamit-web/$dir" 2>/dev/null || { echo "SKIP"; continue; }

  npm run build 2>&1 | tail -3

  if [ $? -eq 0 ]; then
    echo "  BUILD OK"
    # Check if deploy script exists
    if npm run 2>/dev/null | grep -q "deploy"; then
      echo "  DEPLOYING..."
      npm run deploy 2>&1 | tail -3
      echo "  DEPLOY DONE: $dir"
    else
      echo "  NO deploy script"
    fi
  else
    echo "  BUILD FAILED: $dir"
  fi
done

# Next.js projects (build only, no gh-pages deploy)
echo ""
echo ">>> Next.js PROJECTS (build only)"
for dir in pbirobot books; do
  echo ">>> BUILD: $dir"
  cd "D:/dreamit-web/$dir" 2>/dev/null || continue
  npm run build 2>&1 | tail -5
  echo "  BUILD DONE: $dir"
done

echo ""
echo "===== ALL BUILDS & DEPLOYS COMPLETE ====="
