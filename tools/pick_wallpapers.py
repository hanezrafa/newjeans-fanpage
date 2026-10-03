"""
Compress the chosen wallpapers to WebP 1920px into assets/wallpapers-web/,
and write a small JSON list the site reads for the random background.
Run:  python tools/pick_wallpapers.py
"""
import json
import os
from PIL import Image, ImageOps

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, "assets", "wallpapers")
OUT = os.path.join(BASE, "assets", "wallpapers-web")
LIST = os.path.join(BASE, "js", "wallpapers.json")

# 1-based indices picked from the contact sheets (best backgrounds)
PICKS = [4, 10, 12, 26, 36, 38, 44, 48, 57, 66, 75, 81, 84, 87, 107, 108, 109,
         110, 114, 126, 133, 154, 185, 189, 198, 201, 206, 210, 214, 235, 241,
         242, 243, 244, 246, 247, 248]

MAX = 1920
QUALITY = 76


def human(n):
    for u in ("B", "KB", "MB"):
        if n < 1024 or u == "MB":
            return f"{n:.1f} {u}" if u != "B" else f"{int(n)} B"
        n /= 1024


def main():
    os.makedirs(OUT, exist_ok=True)
    files = sorted(f for f in os.listdir(SRC) if f.lower().endswith((".jpg", ".jpeg", ".png")))
    names = []
    before = after = 0
    for i, idx in enumerate(PICKS, start=1):
        if idx < 1 or idx > len(files):
            continue
        src = os.path.join(SRC, files[idx - 1])
        outname = f"bg-{i:02d}.webp"
        dst = os.path.join(OUT, outname)
        before += os.path.getsize(src)
        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        w, h = im.size
        scale = min(1.0, MAX / max(w, h))
        if scale < 1.0:
            im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)
        im.save(dst, "WEBP", quality=QUALITY, method=6)
        after += os.path.getsize(dst)
        names.append(outname)
    with open(LIST, "w", encoding="utf-8") as fh:
        json.dump(names, fh, indent=1)
    print(f"wrote {len(names)} backgrounds")
    print(f"before: {human(before)}  after: {human(after)}  saved {100*(before-after)/before:.0f}%")


if __name__ == "__main__":
    main()
