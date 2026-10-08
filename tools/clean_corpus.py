#!/usr/bin/env python3
"""Remove layout artifacts from brochure paragraph text without renumbering paragraphs.

The current corpus already contains cross-reference indices keyed by (document, paragraph),
so this first pass deliberately keeps the existing paragraph ids intact.
"""
from __future__ import annotations
import argparse, gzip, json, re
from pathlib import Path

PAGE_MARK = re.compile(r"\s*Brochures\s+William\s+Branham\s*·\s*Zone\s*\d+\s*/\s*\d+\s*[—-]\s*page\s*\d+\s*", re.I)
ZONE_PAGE = re.compile(r"\s*Zone\s*\d+\s*/\s*\d+\s*[—-]\s*page\s*\d+\s*", re.I)
# Decorative title/code tails found after the actual last paragraph.
TAIL_CODE = re.compile(r"\s+(?:FRN|SHP)\s*\d{2}[-–]\d{3,4}[A-Z]?(?:\s*\([^)]*\))?\s*$", re.I)
TAIL_BROCHURE = re.compile(r"\s+Brochures\s+William\s+Branham.*$", re.I)
EDITORIAL_INLINE = re.compile(r"\s+(?:\([^)]{3,100}\)\s+)?(?:Ce (?:Message|texte) est|Tous droits réservés|Veuillez adresser|Avis de droit d’auteur|FRENCH\s+©|Pour plus de renseignements|La Voix de Dieu\s+C\.P\.)\b.*$", re.I)
EDITORIAL_ONLY = re.compile(r"^(?:Ce (?:Message|texte) est|Tous droits réservés|Veuillez adresser|Avis de droit d’auteur|FRENCH\s+©|Pour plus de renseignements|La Voix de Dieu\s+C\.P\.|B\.P\.\s*\d|supplémentaires peuvent être obtenus)\b", re.I)


def norm(s: str) -> str:
    s = s.upper().replace("’", "'")
    return re.sub(r"[^A-ZÀ-ÖØ-Þ0-9]+", " ", s).strip()


def clean_text(text: str, title: str) -> tuple[str, int]:
    before = text
    # Page footers may be embedded between two words, so remove them globally.
    text = PAGE_MARK.sub(" ", text)
    text = ZONE_PAGE.sub(" ", text)
    # Remove a repeated title only when it is a standalone all-caps layout line
    # immediately followed by a page/paragraph number. Natural mentions remain.
    tnorm = norm(title)
    if tnorm and len(tnorm) >= 6:
        words = re.escape(tnorm).replace(r"\ ", r"\s+")
        text = re.sub(rf"(?<![\wÀ-ÿ]){words}(?=\s+(?:#?\s*)?\d{{1,4}}(?:\s|$))", " ", text, flags=re.I)
    # Remove editorial code and brochure footer text only at the end of a paragraph.
    text = TAIL_BROCHURE.sub("", text)
    text = TAIL_CODE.sub("", text)
    text = EDITORIAL_INLINE.sub("", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = text.strip()
    return text, int(text != before)


def process(path: Path, write: bool) -> tuple[int, int, int]:
    with gzip.open(path, "rt", encoding="utf-8") as fh:
        data = json.load(fh)
    changed = removed = 0
    for doc in data.get("docs", []):
        title = str(doc[1])
        new_paras = []
        for pair in doc[4]:
            n, text = pair
            cleaned, did = clean_text(str(text), title)
            if did:
                changed += 1
                removed += len(str(text)) - len(cleaned)
            new_paras.append([n, cleaned])
        while new_paras and EDITORIAL_ONLY.match(new_paras[-1][1].strip()):
            new_paras.pop()
        doc[4] = new_paras
    if write:
        tmp = path.with_suffix(path.suffix + ".tmp")
        with gzip.open(tmp, "wt", encoding="utf-8", compresslevel=9, newline="\n") as fh:
            json.dump(data, fh, ensure_ascii=False, separators=(",", ":"))
        tmp.replace(path)
    return len(data.get("docs", [])), changed, removed


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("root", type=Path)
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()
    total = [0, 0, 0]
    for path in sorted((args.root / "data").glob("brochures_z*.json.gz")):
        result = process(path, args.write)
        print(path.name, "docs=%d changed_paragraphs=%d chars_removed=%d" % result)
        total = [a + b for a, b in zip(total, result)]
    print("TOTAL docs=%d changed_paragraphs=%d chars_removed=%d" % tuple(total))


if __name__ == "__main__":
    main()
