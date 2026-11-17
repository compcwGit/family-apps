#!/usr/bin/env bash
# WSL(Ubuntu) 안에서: MeloTTS 가 없으면 설치하고, 앱 음성을 만듦 (이미 만든 파일은 건너뜀)
# 보통은 Windows 에서 scripts\tts\음성만들기.bat 을 더블클릭하면 이 파일이 실행됨
#   bash scripts/tts/wsl-make.sh                 작은 앱부터 전부 (한글 놀이는 마지막, 오래 걸림)
#   bash scripts/tts/wsl-make.sh lifeplay        고른 앱만
set -euo pipefail
cd "$(dirname "$0")/../.."

if [ ! -x "$HOME/melo-env/bin/python" ]; then
  echo "=== MeloTTS 설치 (처음 한 번만, 10~20분) — 비밀번호를 물으면 Ubuntu 비밀번호를 입력하세요 ==="
  sudo apt update && sudo apt install -y git ffmpeg build-essential curl
  command -v uv >/dev/null || { curl -LsSf https://astral.sh/uv/install.sh | sh; }
  export PATH="$HOME/.local/bin:$PATH"
  uv venv "$HOME/melo-env" --python 3.9
  # shellcheck disable=SC1091
  source "$HOME/melo-env/bin/activate"
  [ -d "$HOME/MeloTTS" ] || git clone https://github.com/myshell-ai/MeloTTS.git "$HOME/MeloTTS"
  (cd "$HOME/MeloTTS" && uv pip install -e . && python -m unidic download)
fi
# shellcheck disable=SC1091
source "$HOME/melo-env/bin/activate"

apps=("$@")
[ ${#apps[@]} -eq 0 ] && apps=(lifeplay animalfriends shapeplay numberplay hangulplay)
bash scripts/tts/make_all.sh "${apps[@]}"
echo
echo "=== 다 만들었어요. 이 창을 닫고 Claude 에게 '다 됐어' 라고 알려 주세요 ==="
