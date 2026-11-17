"""모든 앱의 음성 목록과 녹음 파일·재생 목록이 맞는지 검사 (빠진 게 있으면 종료 코드 1)
win-make.ps1 -Publish 가 올리기 전에 실행함"""
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[2]
bad = 0
for lines_path in sorted(root.glob('apps/*/voice-lines.json')):
    app = lines_path.parent
    lines = json.loads(lines_path.read_text(encoding='utf-8'))
    index_path = app / 'src' / 'voice-files.json'
    index = json.loads(index_path.read_text(encoding='utf-8')) if index_path.exists() else {}
    missing_text = [t for t in set(lines.values()) if t not in index]
    missing_file = [f for f in set(index.values()) if not (app / 'public' / 'voice' / f).exists()]
    ok = not missing_text and not missing_file
    bad += not ok
    print(f"{'OK ' if ok else '빠짐'} {app.name}: 목록 {len(lines)}, 재생 목록 {len(index)}, 빠진 말 {len(missing_text)}, 없는 파일 {len(missing_file)}")
sys.exit(1 if bad else 0)
