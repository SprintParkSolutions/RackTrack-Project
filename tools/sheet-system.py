#!/usr/bin/env python3
"""Sheet 00 - system schematic. Same drafting language as the tour set:
white paper, #1a1a1a linework, #6f6f6f secondary, #b8b8b8 hatch, one blue #1a3fd4."""

INK, MID, LT, BLUE = '#1a1a1a', '#6f6f6f', '#b8b8b8', '#1a3fd4'
MONO = 'Geist Mono,ui-monospace,SFMono-Regular,Menlo,monospace'
W, H = 1600, 620
o = []
A = o.append


def t(x, y, s, size=11, fill=INK, anchor='start', ls='0.06em', weight='400'):
    A(f"<text x='{x}' y='{y}' font-family='{MONO}' font-size='{size}' fill='{fill}' "
      f"text-anchor='{anchor}' letter-spacing='{ls}' font-weight='{weight}'>{s}</text>")


def box(x, y, w, h, sw=1.2, stroke=INK, fill='#ffffff', dash=None):
    d = f" stroke-dasharray='{dash}'" if dash else ''
    A(f"<rect x='{x}' y='{y}' width='{w}' height='{h}' fill='{fill}' stroke='{stroke}' stroke-width='{sw}'{d}/>")


def line(x1, y1, x2, y2, sw=0.6, stroke=INK, dash=None):
    d = f" stroke-dasharray='{dash}'" if dash else ''
    A(f"<line x1='{x1}' y1='{y1}' x2='{x2}' y2='{y2}' stroke='{stroke}' stroke-width='{sw}'{d}/>")


def arrow(x1, y1, x2, y2, stroke=INK, sw=1.1, dash=None):
    """single-line link with a drafting arrowhead"""
    line(x1, y1, x2, y2, sw, stroke, dash)
    dx, dy = x2 - x1, y2 - y1
    m = (dx * dx + dy * dy) ** 0.5 or 1
    ux, uy = dx / m, dy / m
    px, py = -uy, ux
    s, wdt = 9, 3.4
    A(f"<path d='M{x2},{y2} L{x2-ux*s+px*wdt},{y2-uy*s+py*wdt} L{x2-ux*s-px*wdt},{y2-uy*s-py*wdt} Z' fill='{stroke}'/>")


A(f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {W} {H}' width='{W}' height='{H}' "
  f"shape-rendering='geometricPrecision' role='img' "
  f"aria-label='System schematic: rack sweep and network telemetry reconciled, then published to systems of record'>")
A("<defs><pattern id='sysHatch' width='6' height='6' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'>"
  f"<line x1='0' y1='0' x2='0' y2='6' stroke='{LT}' stroke-width='.7'/></pattern></defs>")
A(f"<rect x='0' y='0' width='{W}' height='{H}' fill='#ffffff'/>")

# ── title block ────────────────────────────────────────────────────────────
box(44, 34, 232, 30, sw=0, stroke='none', fill=BLUE)
t(56, 54, 'DC1 / SYSTEM SCHEMATIC', 13, '#ffffff', ls='0.10em', weight='500')
t(1556, 48, 'RECONCILIATION DATA FLOW', 13, INK, 'end', ls='0.10em', weight='500')
t(1556, 68, 'DWG RT-SYS-001 &#183; REV A &#183; NOT TO SCALE', 11, MID, 'end')
line(44, 88, 1556, 88, 1.2, INK)

t(44, 112, 'SOURCES', 11, MID, ls='0.14em')
t(800, 112, 'RECONCILIATION', 11, MID, 'middle', ls='0.14em')
t(1556, 112, 'SYSTEMS OF RECORD', 11, MID, 'end', ls='0.14em')

# ── source A - rack sweep (cabinet elevation glyph) ───────────────────────
ax, ay = 44, 150
box(ax, ay, 150, 168)
for i in range(9):                                    # U-slots
    yy = ay + 16 + i * 16
    box(ax + 16, yy, 118, 11, sw=0.55, stroke=MID)
    if i in (1, 4):                                   # two devices read this sweep
        box(ax + 16, yy, 118, 11, sw=0.55, stroke=BLUE, fill='#eaf1ff')
line(ax + 8, ay, ax + 8, ay + 168, 0.55, MID)          # rack ear
line(ax + 142, ay, ax + 142, ay + 168, 0.55, MID)
t(ax, ay + 192, 'RACK SWEEP', 11, INK, ls='0.10em', weight='500')
t(ax, ay + 210, 'IMAGES &#183; LABELS &#183; PORTS', 11, MID)

# ── source B - network telemetry (switch glyph) ───────────────────────────
bx, by = 44, 400
box(bx, by, 150, 46)
for i in range(12):                                    # port row
    box(bx + 12 + i * 11, by + 14, 7, 8, sw=0.55, stroke=MID)
for i in (3, 4, 8):
    box(bx + 12 + i * 11, by + 14, 7, 8, sw=0.55, stroke=BLUE, fill=BLUE)
t(bx + 12, by + 38, 'ToR', 11, MID)
t(bx, by + 72, 'NETWORK TELEMETRY', 11, INK, ls='0.10em', weight='500')
t(bx, by + 90, 'CDP &#183; LLDP &#183; NEIGHBOUR', 11, MID)

# ── converge into the engine ──────────────────────────────────────────────
EX, EY, EW, EH = 560, 150, 470, 340
arrow(194, 234, EX - 6, 234)
arrow(194, 423, 380, 423)
line(380, 423, 380, 330, 0.6)
arrow(380, 330, EX - 6, 330)
t(300, 226, 'PHYSICAL', 11, MID, 'middle')
t(300, 415, 'LOGICAL', 11, MID, 'middle')

# ── engine ────────────────────────────────────────────────────────────────
box(EX, EY, EW, EH, sw=1.2)
line(EX, EY, EX + EW, EY, 1.6, INK)                    # heavier top edge
t(EX + 20, EY + 30, 'RACKTRACK ENGINE', 13, INK, ls='0.10em', weight='500')
t(EX + EW - 20, EY + 30, '3 STAGES', 11, MID, 'end')
line(EX, EY + 46, EX + EW, EY + 46, 0.6)

stages = [
    ('01', 'PERCEIVE',  'every device, port, label and cable read from the sweep'),
    ('02', 'RECONCILE', 'observations validated against live switch data'),
    ('03', 'COGNIZE',   'change, drift and dependency resolved across scans'),
]
sy = EY + 46
for i, (idx, name, desc) in enumerate(stages):
    y = sy + i * 98
    if i:
        line(EX, y, EX + EW, y, 0.55, LT)
    t(EX + 20, y + 34, idx, 11, BLUE, weight='500')
    t(EX + 54, y + 34, name, 13, INK, ls='0.08em', weight='500')
    t(EX + 54, y + 56, desc, 11, MID)
    line(EX + 54, y + 68, EX + EW - 20, y + 68, 0.55, LT)

# ── outputs ───────────────────────────────────────────────────────────────
OX = 1180
outs = [('CMDB', 'RECORD UPDATED'), ('DCIM', 'CAPACITY &#183; U-SPACE'), ('AUDIT PACK', 'EVIDENCE &#183; DATED')]
for i, (nm, sub) in enumerate(outs):
    y = 168 + i * 116
    box(OX, y, 376, 74)
    line(OX, y, OX, y + 74, 3.4, BLUE) if i == 0 else None
    t(OX + 20, y + 30, nm, 13, INK, ls='0.08em', weight='500')
    t(OX + 20, y + 52, sub, 11, MID)
    arrow(EX + EW + 6, y + 37, OX - 6, y + 37)

# ── write-back, dashed and conditional ────────────────────────────────────
line(OX + 188, 242, OX + 188, 560, 0.9, BLUE, dash='6 4')
line(OX + 188, 560, 800, 560, 0.9, BLUE, dash='6 4')
arrow(800, 560, 800, EY + EH + 6, BLUE, 0.9, dash='6 4')
t(986, 552, 'WRITE-BACK &#183; ON APPROVAL ONLY', 11, BLUE, 'middle', ls='0.08em')

# ── legend, bottom left ───────────────────────────────────────────────────
ly = 560                                               # one row across the empty bottom band
t(44, ly, 'KEY', 11, MID, ls='0.14em')
items = [
    (96,  'solid',  'READ THIS SWEEP'),
    (290, 'dashed', 'CONDITIONAL PATH'),
    (492, 'blue',   'VERIFIED / TRACED'),
]
for x, kind, label in items:
    if kind == 'solid':
        line(x, ly - 4, x + 26, ly - 4, 1.1, INK)
    elif kind == 'dashed':
        line(x, ly - 4, x + 26, ly - 4, 0.9, BLUE, dash='6 4')
    else:
        box(x, ly - 9, 26, 10, sw=0.55, stroke=BLUE, fill='#eaf1ff')
    t(x + 38, ly, label, 11, MID)

# ── sheet footer ──────────────────────────────────────────────────────────
line(44, 588, 1556, 588, 0.6, LT)
t(44, 606, 'RACKTRACK &#183; PHYSICAL INFRASTRUCTURE INTELLIGENCE', 11, MID)
t(1556, 606, 'SHEET 00 &#183; SYSTEM', 11, MID, 'end')

A('</svg>')
print(''.join(o))
