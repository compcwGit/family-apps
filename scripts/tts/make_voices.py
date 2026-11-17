#!/usr/bin/env python3
"""MeloTTS(MIT 라이선스)로 앱에 넣을 음성 파일 만들기 — 집 PC(WSL 또는 Windows: 음성만들기-windows.bat)에서 실행

사용법 (저장소 루트에서, melo 가상환경을 켠 상태로):
  python scripts/tts/make_voices.py apps/numberplay/voice-lines.json apps/numberplay/public/voice

  --speed 0.9          읽는 속도 (작을수록 천천히, 기본 0.9)
  --only native/23 ... 이 id만 다시 만들기 (마음에 안 드는 것만 고칠 때)
                       '/'로 끝나면 그 묶음 전체: --only jamo/ praise/
  --force              이미 있는 파일도 전부 다시 만들기
  --format wav         mp3 대신 wav (ffmpeg 없을 때)
  --index-only         음성은 만들지 않고 재생 목록(src/voice-files.json)만 다시 쓰기

--only 에는 id 대신 읽을 말을 그대로 써도 됨: --only "모두 맞췄어요!"

목록 JSON 형식: { "파일 id": "읽을 말" }  →  <저장 폴더>/<파일 id>.mp3
예) "native/23": "스물셋"  →  apps/numberplay/public/voice/native/23.mp3

다 만들면 <앱>/src/voice-files.json 에 { "읽을 말": "파일 경로" } 를 씀 → 앱이 이 파일이 있는 말은 녹음으로,
없는 말은 기기 음성(TTS)으로 읽음 (packages/core/src/speech.ts)
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
    ap.add_argument('--index-only', action='store_true')
    a = ap.parse_args()

    full: dict[str, str] = json.loads(Path(a.lines).read_text(encoding='utf-8'))
    lines = full
    out = Path(a.out)
    if a.index_only:
        return write_index(full, out, Path(a.lines))
    if a.only:
        hit = lambda k, o: (k.startswith(o) if o.endswith('/') else k == o) or lines[k] == o
        missing = [o for o in a.only if not any(hit(k, o) for k in lines)]
        if missing:
            sys.exit(f'목록에 없는 id: {missing}')
        lines = {k: v for k, v in lines.items() if any(hit(k, o) for o in a.only)}
    ffmpeg = shutil.which('ffmpeg')
    if a.format == 'mp3' and not ffmpeg:
        try:  # Windows: pip 의 imageio-ffmpeg 가 ffmpeg 실행 파일을 같이 줌
            import imageio_ffmpeg
            ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
        except ImportError:
            sys.exit('ffmpeg가 필요합니다: sudo apt install ffmpeg 또는 pip install imageio-ffmpeg  (또는 --format wav)')

    from melo.api import TTS  # 설치 안 됐으면 여기서 에러 → scripts/tts/README.md 참고

    model = TTS(language='KR', device='auto')  # 첫 실행 때 모델을 내려받음
    speaker = model.hps.data.spk2id['KR']
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
                [ffmpeg, '-y', '-loglevel', 'error', '-i', str(tmp),
                 '-af', TRIM, '-ac', '1', '-b:a', '64k', str(dst)],
                check=True,
            )
        made += 1
        print(f'[{i}/{len(lines)}] {vid}: {text}')

    print(f'완료: 새로 만듦 {made}개, 이미 있어서 건너뜀 {skipped}개 → {out}')
    write_index(full, out, Path(a.lines))


def write_index(lines: dict[str, str], out: Path, lines_path: Path) -> None:
    """앱이 읽는 재생 목록: 파일이 실제로 있는 말만 { "읽을 말": "id.mp3" }"""
    index = {}
    for vid, text in lines.items():
        for ext in ('mp3', 'wav'):
            if (out / f'{vid}.{ext}').exists():
                index.setdefault(text, f'{vid}.{ext}')
                break
    dst = lines_path.parent / 'src' / 'voice-files.json'
    dst.write_text(json.dumps(index, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'재생 목록: {len(index)}/{len(lines)}개 녹음 있음 → {dst}')


if __name__ == '__main__':
    main()
