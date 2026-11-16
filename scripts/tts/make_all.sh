#!/usr/bin/env bash
# 모든 앱 음성 한 번에 만들기 (집 PC WSL, melo 가상환경을 켠 상태로 저장소 루트에서)
#   bash scripts/tts/make_all.sh                 모든 앱 (이미 만든 파일은 건너뜀)
#   bash scripts/tts/make_all.sh numberplay      고른 앱만
#   SPEED=0.85 bash scripts/tts/make_all.sh      읽는 속도
set -euo pipefail
cd "$(dirname "$0")/../.."
apps=("$@")
if [ ${#apps[@]} -eq 0 ]; then
  for f in apps/*/voice-lines.json; do apps+=("$(basename "$(dirname "$f")")"); done
fi
for app in "${apps[@]}"; do
  echo "=== $app ==="
  python scripts/tts/make_voices.py "apps/$app/voice-lines.json" "apps/$app/public/voice" --speed "${SPEED:-0.9}"
done
