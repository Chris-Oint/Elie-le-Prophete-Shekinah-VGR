#!/usr/bin/env python3
"""Repair the two known paragraph-concatenation defects while preserving ids."""
from __future__ import annotations
import gzip, json, re
from pathlib import Path
from zipfile import ZipFile
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]


def load_zone(code: str):
    for p in (ROOT / 'data').glob('brochures_z*.json.gz'):
        d = json.load(gzip.open(p, 'rt', encoding='utf-8'))
        for doc in d['docs']:
            if doc[0] == code:
                yield p, d, doc


def source_vgr_paragraphs():
    p = next(Path('/tmp/brochure/VGR').glob('62-0318*.epub'))
    with ZipFile(p) as z:
        name = next(n for n in z.namelist() if n.endswith(('.xhtml', '.html')))
        soup = BeautifulSoup(z.read(name), 'html.parser')
        raw = [' '.join(x.get_text(' ', strip=True).split()) for x in soup.find_all('p')]
    page = re.compile(r'^(?:LA PAROLE PARL[ÉE]E EST LA|SEMENCE ORIGINELLE|\d+\s+LA PAROLE PARL[ÉE]E|LA PAROLE PARL[ÉE]E EST LA SEMENCE ORIGINELLE).*\d*$', re.I)
    out = []
    current = None
    for text in raw:
        text = text.replace('\uf6e1', '').strip()
        if not text or page.match(text):
            continue
        m = re.match(r'^(\d+)\s+(.*)$', text)
        if m:
            n, body = int(m.group(1)), m.group(2).strip()
            if 1 <= n <= 466:
                if current is not None:
                    out.append(current)
                current = [n, body]
                continue
        if current is not None:
            current[1] += ' ' + text
        elif not out:
            # The first source paragraph carries a decorative glyph instead of “1”.
            current = [1, text]
    if current is not None:
        out.append(current)
    # The source contains the original 1..466 sequence; reject a bad parse.
    by = {n: t for n, t in out}
    if set(range(1, 467)) - set(by):
        missing = sorted(set(range(1, 467)) - set(by))
        raise RuntimeError(f'VGR source parse missing paragraph ids: {missing[:20]}')
    return [[n, by[n]] for n in range(1, 467)]


def repair_vgr(doc):
    doc[4] = source_vgr_paragraphs()


def repair_shekinah(doc):
    paras = list(doc[4])
    idx = next(i for i, (n, _) in enumerate(paras) if n == 183)
    text = paras[idx][1]
    # The corrupted block contains the original markers 184..242 in order.
    positions = []
    expected = 184
    for m in re.finditer(r'(?<!\d)(\d{3})\s+', text):
        n = int(m.group(1))
        if n == expected:
            positions.append((n, m.start(), m.end()))
            expected += 1
            if expected == 243:
                break
    if expected != 243:
        raise RuntimeError(f'Shekinah source markers incomplete: stopped at {expected}')
    pieces = [[183, text[:positions[0][1]].strip()]]
    for j, (n, start, body_start) in enumerate(positions):
        end = positions[j + 1][1] if j + 1 < len(positions) else len(text)
        pieces.append([n, text[body_start:end].strip()])
    # Keep any paragraphs after the corrupted block, renumbering only if needed.
    tail = [[n, t] for n, t in paras if n > 183]
    if tail:
        raise RuntimeError('Unexpected tail paragraphs after corrupted Shekinah block')
    doc[4] = paras[:idx] + pieces


def main():
    changed = []
    for path, data, doc in load_zone('62-0318M'):
        if doc[3] == 'VGR':
            repair_vgr(doc); changed.append((path, doc[0], doc[3], len(doc[4])))
        with gzip.open(path.with_suffix(path.suffix + '.tmp'), 'wt', encoding='utf-8', compresslevel=9, newline='\n') as fh:
            json.dump(data, fh, ensure_ascii=False, separators=(',', ':'))
        path.with_suffix(path.suffix + '.tmp').replace(path)
    for path, data, doc in load_zone('52-0224'):
        if doc[3] == 'Shekinah':
            repair_shekinah(doc); changed.append((path, doc[0], doc[3], len(doc[4])))
        with gzip.open(path.with_suffix(path.suffix + '.tmp'), 'wt', encoding='utf-8', compresslevel=9, newline='\n') as fh:
            json.dump(data, fh, ensure_ascii=False, separators=(',', ':'))
        path.with_suffix(path.suffix + '.tmp').replace(path)
    print('repaired', changed)

if __name__ == '__main__':
    main()
