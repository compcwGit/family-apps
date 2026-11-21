#!/usr/bin/env bash
# 안드로이드 앱 아이콘 만들기 (CI 와 집 PC 에서 같이 씀). 앱 폴더에서 실행: bash ../../scripts/android-icons.sh
# - icon-1024.png      : 예전 방식 아이콘(네모·동그라미) 원본
# - icon-android.png   : 적응형 아이콘(요즘 안드로이드, 가운데 2/3 만 보임)용 — 그림을 작게 그린 것. 없으면 icon-1024.png 사용
set -euo pipefail
[ -f icon-1024.png ] || { echo "icon-1024.png 없음 — 기본 아이콘 유지"; exit 0; }
[ -d android ] || { echo "android 폴더 없음 — 먼저 npx cap add android"; exit 1; }
mkdir -p assets
cp icon-1024.png assets/icon-only.png
fg=icon-1024.png
[ -f icon-android.png ] && fg=icon-android.png
cp "$fg" assets/icon-foreground.png
cp "$fg" assets/icon-background.png
npx -y @capacitor/assets@4 generate --android
rm -rf assets
