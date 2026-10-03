"""
Convert every PNG/JPG/JPG in assets/photos (and assets/eras) to WebP.
- longest side capped at MAX (default 1600 px), aspect kept, no upscaling
- quality 82
- skips a file if the .webp already exists and is newer
- prints a before/after size report

Run:  python tools/to_webp.py
      python tools/to_webp.py --max 1400 --quality 80
      python tools/to_webp.py --dry            (report only, write nothing)
"""

import argparse
import os
import sys
from PIL import Image

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGETS = ["assets/photos", "assets/eras"]
EXTS = {".png", ".jpg", ".jpeg"}


def human(n):
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.1f} {unit}" if unit != "B" else f"{int(n)} B"
        n /= 1024


def convert(path, maxs, quality):
    out = os.path.splitext(path)[0] + ".webp"
    im = Image.open(path)
    # honour EXIF orientation, then drop the tag
    try:
        from PIL import ImageOps
        im = ImageOps.exif_transpose(im)
    except Exception:
        pass
    # flatten transparency onto white so the webp is not huge with alpha
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        im = bg
    else:
        im = im.convert("RGB")
    w, h = im.size
    scale = min(1.0, maxs / max(w, h))
    if scale < 1.0:
        im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)
    im.save(out, "WEBP", quality=quality, method=6)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--max", type=int, default=1600)
    ap.add_argument("--quality", type=int, default=82)
    ap.add_argument("--dry", action="store_true")
    args = ap.parse_args()

    before_total = 0
    after_total = 0
    count = 0
    skipped = 0

    for rel in TARGETS:
        folder = os.path.join(BASE, rel)
        if not os.path.isdir(folder):
            continue
        for name in sorted(os.listdir(folder)):
            ext = os.path.splitext(name)[1].lower()
            if ext not in EXTS:
                continue
            src = os.path.join(folder, name)
            dst = os.path.splitext(src)[0] + ".webp"
            b = os.path.getsize(src)
            before_total += b
            if not args.dry and os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
                after_total += os.path.getsize(dst)
                skipped += 1
                continue
            if args.dry:
                continue
            try:
                f = convert(src, args.max, args.quality)
                a = os.path.getsize(f)
                after_total += a
                count += 1
                if count % 25 == 0:
                    print(f"  ... {count} converted")
            except Exception as e:
                print(f"  FAIL {name}: {e}")
                after_total += b  # keep accounting honest

    if args.dry:
        print("DRY RUN - no files written")
        return
    print(f"\nconverted {count} files ({skipped} already fresh)")
    print(f"before: {human(before_total)}")
    print(f"after : {human(after_total)}")
    if before_total:
        print(f"saved : {human(before_total - after_total)}  ({100*(before_total-after_total)/before_total:.0f}%)")


if __name__ == "__main__":
    main()
