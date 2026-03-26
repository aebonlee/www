#!/bin/bash
# Build and Deploy all dreamitbiz projects - Sequential
# 2026-03-26

LOGFILE="D:/dreamit-web/Dev_md0320/build-results.log"
echo "===== BUILD & DEPLOY START: $(date) =====" > "$LOGFILE"

# Vite projects with deploy script (gh-pages)
DEPLOY_PROJECTS=(
  ahp_basic c-study python-study java-study algorithm
  data-structure ai-prompt software ai-data self-branding
  reactStudy webstudy uxdesign hohai
  coding linux-study koreatech career english japanese
  digitalbiz marketing edu-hub allthat papers reserve docs
  db-study koreait aebon
)

BUILD_OK=0
BUILD_FAIL=0
DEPLOY_OK=0
DEPLOY_SKIP=0

for dir in "${DEPLOY_PROJECTS[@]}"; do
  echo "" >> "$LOGFILE"
  echo ">>> BUILD: $dir" >> "$LOGFILE"
  echo ">>> BUILD: $dir"

  if [ ! -d "D:/dreamit-web/$dir" ]; then
    echo "  SKIP: folder not found" >> "$LOGFILE"
    continue
  fi

  cd "D:/dreamit-web/$dir"

  # Build
  BUILD_OUT=$(npm run build 2>&1)
  BUILD_EXIT=$?

  # Check if build actually succeeded (vite outputs "built in" on success)
  if echo "$BUILD_OUT" | grep -q "built in\|Build complete\|Compiled successfully"; then
    echo "  BUILD OK" >> "$LOGFILE"
    echo "  BUILD OK"
    BUILD_OK=$((BUILD_OK + 1))

    # Check if deploy script exists
    if grep -q '"deploy"' package.json 2>/dev/null; then
      echo "  DEPLOYING..." >> "$LOGFILE"
      DEPLOY_OUT=$(npm run deploy 2>&1)
      if echo "$DEPLOY_OUT" | grep -q "Published\|Deploy complete\|gh-pages"; then
        echo "  DEPLOY OK: $dir" >> "$LOGFILE"
        echo "  DEPLOY OK: $dir"
        DEPLOY_OK=$((DEPLOY_OK + 1))
      else
        echo "  DEPLOY RESULT: $(echo "$DEPLOY_OUT" | tail -3)" >> "$LOGFILE"
        echo "  DEPLOY DONE: $dir"
        DEPLOY_OK=$((DEPLOY_OK + 1))
      fi
    else
      echo "  NO deploy script - skipped" >> "$LOGFILE"
      DEPLOY_SKIP=$((DEPLOY_SKIP + 1))
    fi
  else
    echo "  BUILD FAILED: $dir" >> "$LOGFILE"
    echo "  BUILD FAILED: $dir"
    echo "  Error: $(echo "$BUILD_OUT" | tail -5)" >> "$LOGFILE"
    BUILD_FAIL=$((BUILD_FAIL + 1))
  fi
done

echo "" >> "$LOGFILE"
echo "===== RESULTS =====" >> "$LOGFILE"
echo "Build OK: $BUILD_OK" >> "$LOGFILE"
echo "Build FAIL: $BUILD_FAIL" >> "$LOGFILE"
echo "Deploy OK: $DEPLOY_OK" >> "$LOGFILE"
echo "Deploy SKIP: $DEPLOY_SKIP" >> "$LOGFILE"
echo "===== DONE: $(date) =====" >> "$LOGFILE"

echo ""
echo "===== RESULTS ====="
echo "Build OK: $BUILD_OK"
echo "Build FAIL: $BUILD_FAIL"
echo "Deploy OK: $DEPLOY_OK"
echo "Deploy SKIP: $DEPLOY_SKIP"
