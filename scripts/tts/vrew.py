#!/usr/bin/env python3
"""Vrew AI 목소리로 앱 음성 만들기 (반자동) — 집 PC 에서 실행

1) 대본 만들기:  python scripts/tts/vrew.py script [앱...]      (더블클릭: Vrew대본만들기.bat)
     → scripts/tts/vrew-work/<앱>_01.txt, _02.txt …  (한 줄 = 한 문장, 300줄씩)
     기본은 녹음이 아직 없는 말만. --all 이면 전부 (목소리를 Vrew 로 통일할 때)
2) Vrew 에서 (파일마다): [새로 만들기] → [텍스트로 비디오 만들기] → 대본 붙여 넣기 → AI 목소리 고르기
     → [파일] → [오디오 내보내기] (MP3)  +  [자막 내보내기] (SRT)
     → 두 파일을 txt 와 같은 이름으로 vrew-work 폴더에 저장:  hangulplay_01.mp3, hangulplay_01.srt
3) 자르기:  python scripts/tts/vrew.py split      (더블클릭: Vrew음성자르기.bat)
     → 자막 시간대로 문장마다 잘라 apps/<앱>/public/voice/<id>.mp3 에 넣고 재생 목록(src/voice-files.json) 갱신
     → Vrew 가 문장을 자막 여러 줄로 나누거나 두 문장을 한 줄로 합쳐도 글자 단위로 맞춤
       (합친 줄은 글자 비율로 나눠서 "들어 보고 확인" 목록에 보여 줌. 글자가 안 맞는 문장은 건너뜀)

Vrew AI 목소리는 상업적 이용 가능 (Vrew 공식 도움말 "[상업 이용] AI 목소리를 상업적인 용도로 사용할 수 있을까요?")
"""
import argparse
import difflib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORK = Path(__file__).resolve().parent / 'vrew-work'
sys.path.insert(0, str(Path(__file__).resolve().parent))
from make_voices import TRIM, write_index  # noqa: E402  (재생 목록 쓰기·무음 자르기는 MeloTTS 스크립트와 같게)


def apps_with_lines(names):
    all_apps = sorted(p.parent.name for p in ROOT.glob('apps/*/voice-lines.json'))
    for n in names:
        if n not in all_apps:
            sys.exit(f'{n}: voice-lines.json 이 없습니다 (있는 앱: {", ".join(all_apps)})')
    return names or all_apps


def has_audio(app: str, vid: str) -> bool:
    return any((ROOT / 'apps' / app / 'public/voice' / f'{vid}.{e}').exists() for e in ('mp3', 'wav'))


# ───────── 1) 대본 ─────────
def make_script(a):
    WORK.mkdir(exist_ok=True)
    total = 0
    for app in apps_with_lines(a.apps):
        for old in WORK.glob(f'{app}_*.txt'):
            old.unlink()
        lines: dict[str, str] = json.loads((ROOT / 'apps' / app / 'voice-lines.json').read_text(encoding='utf-8'))
        texts: dict[str, list[str]] = {}  # 읽을 말 → id 들 (같은 말은 한 번만 읽힘)
        for vid, t in lines.items():
            if a.all or not has_audio(app, vid):
                texts.setdefault(t, []).append(vid)
        items = list(texts.items())
        chunks = [items[i:i + a.size] for i in range(0, len(items), a.size)]
        for n, chunk in enumerate(chunks, 1):
            name = f'{app}_{n:02d}'
            (WORK / f'{name}.txt').write_text('\n'.join(t for t, _ in chunk) + '\n', encoding='utf-8')
            (WORK / f'{name}.json').write_text(json.dumps(chunk, ensure_ascii=False, indent=1), encoding='utf-8')
        chars = sum(len(t) for t, _ in items)
        total += chars
        print(f'{app}: {len(items)}문장, {chars}자 → 대본 {len(chunks)}개' if items else f'{app}: 만들 문장 없음')
    print(f'합계 {total}자 ≈ Vrew {-(-total // 100)} 크레딧 (1 크레딧 = 100자)  →  {WORK}')


# ───────── 3) 자르기 ─────────
def norm(s: str) -> str:
    return re.sub(r'[^0-9A-Za-z가-힣]', '', s)


def read_srt(path: Path):
    """[(시작초, 끝초, 글자)]"""
    t = lambda h, m, s, ms: int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000
    out = []
    for block in re.split(r'\n\s*\n', path.read_text(encoding='utf-8-sig').replace('\r', '')):
        m = re.search(r'(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)\n(.*)', block, re.S)
        if m:
            g = m.groups()
            out.append((t(*g[0:4]), t(*g[4:8]), ' '.join(g[8].split('\n'))))
    return out


def align(expected: list[str], subs):
    """대본 문장마다 ((시작, 끝), 추정 여부) 또는 None
    자막 글자를 모두 이어 붙여 대본 글자와 맞춤 (문장이 자막 여러 줄로 나뉘거나, 두 문장이 한 줄로 합쳐져도 됨).
    글자마다 그 자막 시간 안에서 비율로 시간을 줌 → 합쳐진 자막은 글자 비율로 나눔(추정, 들어 보고 확인)"""
    chars = []  # (시작, 끝, 자막의 첫 글자?, 자막의 끝 글자?)
    stream = ''
    for a, b, txt in subs:
        n = norm(txt)
        for i in range(len(n)):
            chars.append((a + (b - a) * i / len(n), a + (b - a) * (i + 1) / len(n), i == 0, i == len(n) - 1))
        stream += n
    sents = [norm(e) for e in expected]
    whole = ''.join(sents)
    pos = {}  # 대본 글자 위치 → 자막 글자 위치
    for m in difflib.SequenceMatcher(None, whole, stream, autojunk=False).get_matching_blocks():
        for k in range(m.size):
            pos[m.a + k] = m.b + k
    res, p = [], 0
    for sn in sents:
        q = p + len(sn)
        got = [pos.get(i) for i in range(p, q)]
        if sn and None not in got and got[-1] - got[0] == len(sn) - 1:
            first, last = chars[got[0]], chars[got[-1]]
            res.append(((first[0], last[1]), not (first[2] and last[3])))
        else:
            res.append(None)
        p = q
    return res


def ffmpeg_exe():
    exe = shutil.which('ffmpeg')
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit('ffmpeg가 필요합니다: pip install imageio-ffmpeg')


def split(a):
    ff = ffmpeg_exe()
    names = sorted(p.stem for p in WORK.glob('*.json') if (WORK / f'{p.stem}.srt').exists())
    if not names:
        sys.exit(f'{WORK} 에 Vrew 에서 내보낸 <이름>.mp3 + <이름>.srt 가 없습니다')
    done_apps = set()
    for name in names:
        audio = next((WORK / f'{name}.{e}' for e in ('mp3', 'wav', 'm4a') if (WORK / f'{name}.{e}').exists()), None)
        if not audio:
            print(f'{name}: 오디오 파일이 없어 건너뜀')
            continue
        app = name.rsplit('_', 1)[0]
        chunk = json.loads((WORK / f'{name}.json').read_text(encoding='utf-8'))
        spans = align([t for t, _ in chunk], read_srt(WORK / f'{name}.srt'))
        out = ROOT / 'apps' / app / 'public/voice'
        ok, bad, guess = 0, [], []
        for (text, ids), got in zip(chunk, spans):
            if not got:
                bad.append(text)
                continue
            span, approx = got
            if approx:
                guess.append(text)
            s, e = max(0, span[0] - a.pad), span[1] + a.pad
            first = out / f'{ids[0]}.mp3'
            first.parent.mkdir(parents=True, exist_ok=True)
            subprocess.run([ff, '-y', '-loglevel', 'error', '-ss', f'{s:.3f}', '-to', f'{e:.3f}', '-i', str(audio),
                            '-af', TRIM, '-ac', '1', '-b:a', '64k', str(first)], check=True)
            for vid in ids[1:]:
                (out / f'{vid}.mp3').parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(first, out / f'{vid}.mp3')
            ok += 1
        print(f'{name}: {ok}/{len(chunk)}문장 넣음')
        if guess:
            print(f'  자막 한 줄에 여러 문장 → 글자 비율로 나눔, 들어 보고 확인 ({len(guess)}개): {" / ".join(guess)}')
        if bad:
            print(f'  자막과 글자가 안 맞아 건너뜀 ({len(bad)}개, 예전 녹음·기기 음성으로 읽음): {" / ".join(bad)}')
        done_apps.add(app)
    for app in sorted(done_apps):
        write_index(json.loads((ROOT / 'apps' / app / 'voice-lines.json').read_text(encoding='utf-8')),
                    ROOT / 'apps' / app / 'public/voice', ROOT / 'apps' / app / 'voice-lines.json')


def main():
    ap = argparse.ArgumentParser(description='Vrew AI 목소리로 앱 음성 만들기 (반자동)')
    sub = ap.add_subparsers(dest='cmd', required=True)
    s = sub.add_parser('script', help='Vrew 에 붙여 넣을 대본 만들기')
    s.add_argument('apps', nargs='*')
    s.add_argument('--all', action='store_true', help='녹음이 있는 말도 전부 (목소리 통일)')
    s.add_argument('--size', type=int, default=300, help='대본 하나에 넣을 문장 수')
    p = sub.add_parser('split', help='Vrew 오디오+자막을 문장마다 잘라 앱에 넣기')
    p.add_argument('--pad', type=float, default=0.08, help='앞뒤 여유 (초)')
    a = ap.parse_args()
    make_script(a) if a.cmd == 'script' else split(a)


if __name__ == '__main__':
    main()
