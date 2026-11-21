# 앱 아이콘(임시) 만들기: 앱 대표색 배경 + 대표 그림(Fluent 3D 이모지, MIT) → apps/<앱>/public/icon-*.png
# 실행: python scripts/make-icons.py   (pip install pillow)
# 직접 그린 아이콘이 생기면 apps/<앱>/icon-1024.png 만 바꾸고 다시 실행하면 나머지 크기가 따라 바뀜
from PIL import Image, ImageDraw, ImageFont
import os
E = 'node_modules/@lobehub/fluent-emoji-3d/assets/'
APPS = {
    'animalfriends': ('#FF8C6B', '#FFE3D8', E + '1f436.webp'),
    'hangulplay': ('#6EC1F5', '#DDF1FD', 'text:가'),
    'numberplay': ('#FFC94A', '#FFF2CC', E + '1f522.webp'),
    'shapeplay': ('#B79CF7', '#EEE6FF', E + '1f9e9.webp'),
    'lifeplay': ('#63D2A1', '#DDF6EA', E + '1f9fc.webp'),
    'stampplay': ('#D6402A', '#FFE9D9', E + '1f9f8.webp'),
}
def hexrgb(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
for app, (accent, soft, art) in APPS.items():
    pub = f'apps/{app}/public'
    master = f'apps/{app}/icon-1024.png'  # 원본은 public 밖 (배포 파일에 안 들어가게)
    if not os.path.exists(master):
        S = 1024
        im = Image.new('RGB', (S, S), hexrgb(soft))
        d = ImageDraw.Draw(im)
        # 아래쪽으로 갈수록 대표색이 조금 진해지는 부드러운 배경
        a, s = hexrgb(accent), hexrgb(soft)
        for y in range(S):
            t = (y / S) ** 2 * 0.55
            d.line([(0, y), (S, y)], fill=tuple(int(s[i] * (1 - t) + a[i] * t) for i in range(3)))
        if art.startswith('text:'):
            f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', 600)
            txt = art[5:]
            box = d.textbbox((0, 0), txt, font=f)
            w, h = box[2] - box[0], box[3] - box[1]
            x, y = (S - w) / 2 - box[0], (S - h) / 2 - box[1]
            d.text((x + 14, y + 22), txt, font=f, fill=tuple(int(c * 0.75) for c in a))
            d.text((x, y), txt, font=f, fill=(255, 255, 255), stroke_width=18, stroke_fill=a)
        else:
            em = Image.open(art).convert('RGBA')
            size = int(S * 0.62)  # 마스크(동그랗게 잘리는) 아이콘에서도 안 잘리게 가운데 62%
            em = em.resize((size, size), Image.LANCZOS)
            im.paste(em, ((S - size) // 2, (S - size) // 2), em)
        im.save(master)
    src = Image.open(master).convert('RGB')
    for n, name in [(512, 'icon-512.png'), (192, 'icon-192.png'), (180, 'apple-touch-icon.png'), (64, 'favicon.png')]:
        src.resize((n, n), Image.LANCZOS).save(f'{pub}/{name}', optimize=True)
    print('아이콘:', app)
