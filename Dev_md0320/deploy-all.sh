#!/bin/bash
# Deploy all dreamitbiz projects
# Created: 2026-03-25

COMMIT_MSG="chore: update metadata, fix security vulnerabilities, add dev log

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

PROJECTS=(
  hohai coding edu-hub c-study python-study java-study
  koreatech algorithm data-structure linux-study db-study
  software ai-prompt ai-data reactStudy webstudy career
  digitalbiz marketing uxdesign self-branding koreait
  english japanese allthat papers reserve docs jdy aebon
  pbirobot books pbi ahp ahp_app database_test templete-ref
)

echo "===== Starting batch commit/push for ${#PROJECTS[@]} projects ====="

for dir in "${PROJECTS[@]}"; do
  echo ""
  echo ">>> Processing: $dir"
  cd "D:/dreamit-web/$dir" 2>/dev/null || { echo "SKIP: folder not found"; continue; }

  BRANCH=$(git branch --show-current 2>/dev/null)
  if [ -z "$BRANCH" ]; then
    echo "SKIP: not a git repo or no branch"
    continue
  fi
  echo "  Branch: $BRANCH"

  # Install dependencies (for newly added gh-pages etc)
  npm install --silent 2>/dev/null

  # Stage changed files
  git add package.json package-lock.json DEV_LOG.md .gitignore 2>/dev/null

  # Check if there are staged changes
  if git diff --cached --quiet 2>/dev/null; then
    echo "  No changes to commit"
  else
    git commit -m "$COMMIT_MSG" 2>&1 | head -3
  fi

  # Push
  git push origin "$BRANCH" 2>&1 | tail -2
  echo "  Push done"
done

echo ""
echo "===== All commits and pushes complete ====="
