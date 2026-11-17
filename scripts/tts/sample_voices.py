"""목소리 설정 비교용 샘플 만들기 → scripts/tts/samples/ (git 에 안 올림)
샘플만들기-windows.bat 이 실행함. 들어 보고 마음에 드는 설정을 골라 make_voices.py 옵션으로 전체를 다시 만듦"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from make_voices import audio_filter  # noqa: E402

SENTENCES = ['우와, 잘했어요!', '강아지를 찾아 보세요!', '손 씻기! 무엇부터 할까요?']
# 이름, 빠르기, 억양 다양성(sdp), 말투 변화(noise), 길이 변화(noise_w), 높이(반음)
VARIANTS = [  # D(빠르기 1.0, 반음 2개 높게)를 바탕으로 억양만 점점 더 다양하게 (sdp 최대 1.0)
    ('D_기준', 1.0, 0.6, 0.8, 1.0, 2),
    ('D1_억양조금더', 1.0, 0.8, 0.85, 1.0, 2),
    ('D2_억양많이', 1.0, 1.0, 0.9, 1.1, 2),
    ('D3_억양아주많이', 1.0, 1.0, 1.0, 1.25, 2),
]


def main() -> None:
    import imageio_ffmpeg
    from melo.api import TTS

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    out = Path(__file__).parent / 'samples'
    shutil.rmtree(out, ignore_errors=True)  # 지난 샘플 지우고 새로 (git 에 안 올리는 폴더)
    out.mkdir(exist_ok=True)
    model = TTS(language='KR', device='auto')
    speaker = model.hps.data.spk2id['KR']
    tmp = Path(tempfile.gettempdir()) / 'melo_sample.wav'
    for name, speed, sdp, noise, noise_w, pitch in VARIANTS:
        for i, text in enumerate(SENTENCES, 1):
            model.tts_to_file(text, speaker, str(tmp), speed=speed, sdp_ratio=sdp, noise_scale=noise, noise_scale_w=noise_w, quiet=True)
            dst = out / f'{name}_{i}.mp3'
            subprocess.run([ffmpeg, '-y', '-loglevel', 'error', '-i', str(tmp), '-af', audio_filter(pitch), '-ac', '1', '-b:a', '64k', str(dst)], check=True)
            print(f'{dst.name}: {text}')
    print(f'\n샘플 {len(VARIANTS) * len(SENTENCES)}개 → {out}')


if __name__ == '__main__':
    main()
