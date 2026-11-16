#!/usr/bin/env python3
"""MeloTTS(MIT 라이선스)로 앱에 넣을 음성 파일 만들기 — 집 PC(WSL)에서 실행

사용법 (저장소 루트에서, melo 가상환경을 켠 상태로):
  python scripts/tts/make_voices.py apps/numberplay/voice-lines.json apps/numberplay/public/voice

  --speed 0.9          읽는 속도 (작을수록 천천히, 기본 0.9)
  --only native/23 ... 이 id만 다시 만들기 (마음에 안 드는 것만 고칠 때)
                       '/'로 끝나면 그 묶음 전체: --only jamo/ praise/
  --force              이미 있는 파일도 전부 다시 만들기
  --format wav         mp3 대신 wav (ffmpeg 없을 때)

목록 JSON 형식: { "파일 id": "읽을 말" }  →  <저장 폴더>/<파일 id>.mp3
예) "native/23": "스물셋"  →  apps/numberplay/public/voice/native/23.mp3
"""
import argparse
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

# 앞뒤 무음 자르기 (세기 앱에서 누르자마자 소리가 나도록)
TRIM = (
    'silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
    'silenceremove=start_periods=1:start_threshold=-45dB,areverse'
)


def main() -> None:
    ap = argparse.ArgumentParser(description='MeloTTS로 음성 파일 만들기')
    ap.add_argument('lines', help='음성 목록 JSON')
    ap.add_argument('out', help='저장 폴더')
    ap.add_argument('--speed', type=float, default=0.9)
    ap.add_argument('--only', nargs='*', default=None)
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--format', choices=['mp3', 'wav'], default='mp3')
    a = ap.parse_args()

    lines: dict[str, str] = json.loads(Path(a.lines).read_text(encoding='utf-8'))
    if a.only:
        hit = lambda k, o: k.startswith(o) if o.endswith('/') else k == o
        missing = [o for o in a.only if not any(hit(k, o) for k in lines)]
        if missing:
            sys.exit(f'목록에 없는 id: {missing}')
        lines = {k: v for k, v in lines.items() if any(hit(k, o) for o in a.only)}
    if a.format == 'mp3' and not shutil.which('ffmpeg'):
        sys.exit('ffmpeg가 필요합니다: sudo apt install ffmpeg  (또는 --format wav)')

    from melo.api import TTS  # 설치 안 됐으면 여기서 에러 → scripts/tts/README.md 참고

    model = TTS(language='KR', device='auto')  # 첫 실행 때 모델을 내려받음
    speaker = model.hps.data.spk2id['KR']
    out = Path(a.out)
    tmp = Path(tempfile.gettempdir()) / 'melo_tmp.wav'

    made = skipped = 0
    for i, (vid, text) in enumerate(lines.items(), 1):
        dst = out / f'{vid}.{a.format}'
        if dst.exists() and not (a.force or a.only):
            skipped += 1
            continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        if a.format == 'wav':
            model.tts_to_file(text, speaker, str(dst), speed=a.speed)
        else:
            model.tts_to_file(text, speaker, str(tmp), speed=a.speed)
            subprocess.run(
                ['ffmpeg', '-y', '-loglevel', 'error', '-i', str(tmp),
                 '-af', TRIM, '-ac', '1', '-b:a', '64k', str(dst)],
                check=True,
            )
        made += 1
        print(f'[{i}/{len(lines)}] {vid}: {text}')

    print(f'완료: 새로 만듦 {made}개, 이미 있어서 건너뜀 {skipped}개 → {out}')


if __name__ == '__main__':
    main()
