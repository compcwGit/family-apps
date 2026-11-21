# 동물 친구들 앱 아이콘 (직접 그림): 동글동글한 점토 느낌 강아지 얼굴. 실행: python scripts/icons/animalfriends.py → python scripts/make-icons.py
import numpy as np
from PIL import Image, ImageFilter
S = 1024
rng = np.random.default_rng(7)
y, x = np.mgrid[0:S, 0:S].astype(np.float32)

def blur(a, r):
    im = Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r)), np.float32) / 255

def ell(cx, cy, rx, ry, rot=0.0):
    c, s = np.cos(rot), np.sin(rot)
    dx, dy = x - cx, y - cy
    u = (dx * c + dy * s) / rx
    v = (-dx * s + dy * c) / ry
    return np.sqrt(u * u + v * v)  # <1 inside

def noise(scale, seed):
    r = np.random.default_rng(seed)
    n = r.random((S // scale + 2, S // scale + 2)).astype(np.float32)
    im = Image.fromarray((n * 255).astype(np.uint8)).resize((S, S), Image.BICUBIC)
    return np.asarray(im, np.float32) / 255

# 털: 가는 결(위에서 아래로 흐르는 결) + 가장자리 들쭉날쭉
strand = blur(rng.random((S, S)).astype(np.float32), 0.6)
streak = np.asarray(Image.fromarray((rng.random((S, S)) * 255).astype(np.uint8)).filter(ImageFilter.BoxBlur(1)).resize((S, S)), np.float32) / 255
edge_n = noise(3, 1) * 0.6 + noise(9, 2) * 0.4

def polar_noise(cx, cy, k=700, rs=26, seed=3):
    r = np.random.default_rng(seed)
    g = r.random((S // rs + 3, k + 1)).astype(np.float32)
    g[:, -1] = g[:, 0]
    th = (np.arctan2(y - cy, x - cx) / (2 * np.pi) + 0.5) * k
    rr = np.hypot(x - cx, y - cy) / rs
    i0 = np.floor(th).astype(int); f = th - i0
    j0 = np.clip(np.floor(rr).astype(int), 0, g.shape[0] - 2); fr = rr - np.floor(rr)
    a = g[j0, i0 % k] * (1 - f) + g[j0, (i0 + 1) % k] * f
    b = g[j0 + 1, i0 % k] * (1 - f) + g[j0 + 1, (i0 + 1) % k] * f
    return a * (1 - fr) + b * fr

PN = polar_noise(S / 2, S / 2 - 20)
PN2 = polar_noise(S / 2, S / 2 - 20, k=3000, rs=6, seed=9)

def fur_mask(d, fuzz=0.06):
    # d<1 inside; 가장자리를 털 노이즈로 흔들어 보송하게
    return np.clip((1 - d) * 160, 0, 1)  # 매끈한 테두리 (안티에일리어싱)

def dome(d):
    return np.sqrt(np.clip(1 - np.minimum(d, 1) ** 2, 0, 1))

def shade(h, base, light=(-0.45, -0.6, 0.66), amb=0.42, spec=0.0):
    gy, gx = np.gradient(h * 140)
    n = np.stack([-gx, -gy, np.ones_like(h)], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    L = np.array(light); L = L / np.linalg.norm(L)
    lam = np.clip((n * L).sum(-1), 0, 1)
    col = base[None, None, :] * (amb + (1 - amb) * lam)[..., None]
    if spec:
        H = L + np.array([0, 0, 1.0]); H /= np.linalg.norm(H)
        sp = np.clip((n * H).sum(-1), 0, 1) ** 60 * spec
        col = col + sp[..., None]
    return col

ALPHA = np.zeros((S, S), np.float32)
def over(dst, col, a):
    global ALPHA
    ALPHA = ALPHA * (1 - a) + a
    return dst * (1 - a[..., None]) + col * a[..., None]

# 배경: 앱 대표색(산호색) 파스텔 그라데이션
top, bot = np.array([1.0, 0.89, 0.84]), np.array([1.0, 0.72, 0.62])
t = (y / S)[..., None]
BG = top * (1 - t) + bot * t
vig = ell(S * .5, S * .45, S * .75, S * .75)
BG = BG * (1.02 - 0.06 * np.clip(vig, 0, 1))[..., None]
img = np.zeros((S, S, 3), np.float32)

C = S / 2
# 그림자


BROWN = np.array([0.66, 0.40, 0.22]); CREAM = np.array([1.0, 0.95, 0.86]); EAR = np.array([0.45, 0.25, 0.14])
furtex = 1.0

# 머리 (아래가 살짝 넓은 찹쌀떡 모양)
dh = ell(C, C + 30, 320, 300)
ah = fur_mask(dh, 0.04)
hh = dome(dh)
head = shade(hh, np.array([0.80, 0.52, 0.30]), amb=0.55, spec=0.12)
# 이마 가운데 크림색 줄 + 주둥이 크림색
blaze = np.clip(1 - ell(C, C - 120, 70, 200), 0, 1)
muz_d = ell(C, C + 120, 185, 135)
cream_a = np.clip((1 - muz_d) * 25, 0, 1)

cream = shade(hh, CREAM, amb=0.7, spec=0.12)
headcol = head * (1 - cream_a[..., None]) + cream * cream_a[..., None]
img = over(img, np.clip(headcol * furtex, 0, 1), ah)

# 귀 (축 늘어진 강아지 귀) — 얼굴 뒤
for sgn in (-1, 1):
    d = ell(C + sgn * 300, C + 5, 95, 175, rot=sgn * -0.28)
    a = fur_mask(d, 0.05)
    h = dome(d) * 0.9
    img = over(img, np.clip(shade(h, np.array([0.62, 0.37, 0.21]), amb=0.55, spec=0.1), 0, 1), a)

# 주둥이 볼록 (조명만 더함)
mh = dome(muz_d) * 0.6
mz = shade(hh * 0.6 + mh, CREAM, amb=0.7, spec=0.15)
ma = np.clip((1 - muz_d) * 120, 0, 1)
img = over(img, np.clip(mz * furtex, 0, 1), ma)

# 볼 홍조
for sgn in (-1, 1):
    b = blur(np.clip(1 - ell(C + sgn * 205, C + 95, 55, 38), 0, 1), 18)
    img = over(img, np.array([1.0, 0.55, 0.55]), b * 0.45)

# 눈 (반짝이는 검은 구슬)
for sgn in (-1, 1):
    ex, ey = C + sgn * 135, C - 15
    d = ell(ex, ey, 46, 52)
    a = np.clip((1 - d) * 40, 0, 1)
    h = dome(d)
    eye = shade(h, np.array([0.07, 0.05, 0.05]), amb=0.6, spec=1.2)
    img = over(img, np.clip(eye, 0, 1), a)
    for (ox, oy, rr) in ((-14, -18, 15), (14, 16, 6)):
        hl = np.clip((1 - ell(ex + ox, ey + oy, rr, rr)) * 8, 0, 1)
        img = over(img, np.array([1, 1, 1.0]), hl * 0.95)

# 코 (반질반질 하트 모양 비슷한 둥근 세모)
nd = np.minimum(ell(C, C + 62, 62, 42), ell(C, C + 82, 40, 34))
na = np.clip((1 - nd) * 30, 0, 1)
nose = shade(dome(nd), np.array([0.17, 0.10, 0.09]), amb=0.55, spec=0.9)
img = over(img, np.clip(nose, 0, 1), na)
hl = np.clip((1 - ell(C - 18, C + 44, 18, 9)) * 6, 0, 1)
img = over(img, np.array([1, 1, 1.0]), hl * 0.7)

# 입 (작은 ω) + 혀
mouth = np.zeros((S, S), np.float32)
for sgn in (-1, 1):
    d = ell(C + sgn * 34, C + 140, 36, 30)
    ring = np.clip(1 - np.abs(d - 1) * 9, 0, 1) * (y > C + 140)
    mouth = np.maximum(mouth, ring)
stem = np.clip(1 - np.abs(x - C) / 5, 0, 1) * ((y > C + 100) & (y < C + 142))
mouth = np.maximum(mouth, stem)
td = ell(C, C + 178, 30, 32)
ta = np.clip((1 - td) * 25, 0, 1) * (y > C + 160)
img = over(img, np.clip(shade(dome(td), np.array([0.96, 0.42, 0.48]), spec=0.4), 0, 1), ta)
img = over(img, np.array([0.25, 0.12, 0.09]), blur(mouth, 1.2))

K = 0.84  # 안드로이드 동그란 마스크(가운데 약 80%) 안에 귀까지 들어가게
fg = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).resize((int(S*K), int(S*K)), Image.LANCZOS)
al = Image.fromarray((np.clip(ALPHA, 0, 1) * 255).astype(np.uint8)).resize((int(S*K), int(S*K)), Image.LANCZOS)
off = (S - int(S*K)) // 2
F = np.zeros((S, S, 3), np.float32); A = np.zeros((S, S), np.float32)
F[off:off+fg.size[1], off:off+fg.size[0]] = np.asarray(fg, np.float32) / 255
A[off:off+al.size[1], off:off+al.size[0]] = np.asarray(al, np.float32) / 255
sh = blur(np.clip(1 - ell(C, C + 250, 260, 55), 0, 1), 28)
BG = BG * (1 - 0.16 * sh)[..., None]
# 털끝 은은한 빛 번짐
glow = blur(A, 10)[..., None]
BG = BG * (1 - 0.0 * glow) + np.array([1, .97, .93]) * glow * 0.0 + BG * 0
BG = np.asarray(BG)
res = BG * (1 - A[..., None]) + F * A[..., None] / np.maximum(A[..., None], 1e-3) * A[..., None]
res = BG * (1 - A[..., None]) + F  # F 는 이미 알파가 곱해진 색
out = Image.fromarray((np.clip(res, 0, 1) * 255).astype(np.uint8))
out.save('apps/animalfriends/icon-1024.png')
print('ok')
