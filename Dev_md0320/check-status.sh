#!/bin/bash
PROJECTS=(ahp_basic competency hohai coding edu-hub c-study python-study java-study koreatech algorithm data-structure linux-study db-study software ai-prompt ai-data reactStudy webstudy career digitalbiz marketing uxdesign self-branding koreait english japanese allthat papers reserve docs jdy aebon pbirobot books pbi ahp ahp_app database_test templete-ref)

for dir in "${PROJECTS[@]}"; do
  cd "D:/dreamit-web/$dir" 2>/dev/null || continue
  MSG=$(git log --oneline -1 2>/dev/null)
  BEHIND=$(git status -sb 2>/dev/null | head -1)
  echo "$dir | $MSG | $BEHIND"
done
