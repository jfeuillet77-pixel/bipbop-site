"""
maillage-avis.py — relie aux avis les modèles que les maquettes citent sans lien.

Posé le 23/09/2026 (chantier 3 de design/audit-seo-2026-09-23.md) directement dans les maquettes
de « Claude Design - MàJ/ », que le portage recopie ensuite. Ce dossier n'est dans aucun dépôt :
un ré-export depuis Claude Design effacerait ces liens. Ce script est là pour les reposer :

    python3 design/maillage-avis.py              # simulation : ce qu'il ajouterait
    python3 design/maillage-avis.py --appliquer  # l'écrit (copie .avant-maillage à côté)
    node scripts/port.mjs && npm run check && npm run fidelite

Trois passes, dans cet ordre, et jamais un lien vers un avis que la page lie déjà :
 1. la cellule « nom » d'un tableau comparatif (le motif existe : la ligne Nitro Max) ;
 2. le lien connexe « Donner DED-200X » du duel, écrit vers /avis/ avant que l'avis existe ;
 3. la première mention du modèle dans une phrase (<p> ou <li>, hors titre, bouton, lien).
Les liens ajoutés héritent de la couleur du texte (color:inherit) : un encadré sombre
(« Le conseil de BipBop ») les rendait invisibles avec l'encre fixe #241c14.
Idempotent : relancé sur des maquettes déjà traitées, il n'ajoute rien.
"""
import re, glob, sys, os

os.chdir('/Users/jordanefeuillet/batteries-electroniques-2027/Claude Design - MàJ')
APPLIQUER = '--appliquer' in sys.argv
STYLE = 'color:inherit;text-decoration:underline;text-underline-offset:3px'


# avis -> (nom complet dans les tableaux, motif dans une phrase)
AVIS = {
    'Avis-Alesis-Nitro-Max.dc.html': ('Alesis Nitro Max', r'(?:Alesis )?Nitro Max(?: Mesh)?(?! ?(?:Kit|Expansion|Pro))'),
    'Avis-Millenium-MPS-150X.dc.html': ('Millenium MPS-150X', r'(?:Millenium )?MPS-150X(?: Mesh)?'),
    'Avis-Roland-TD-02KV.dc.html': ('Roland TD-02KV', r'(?:Roland )?TD-02KV'),
    'Avis-Yamaha-DTX432K.dc.html': ('Yamaha DTX432K', r'(?:Yamaha )?DTX432K'),
    'Avis-Donner-DED-200X.dc.html': ('Donner DED-200X', r'(?:Donner )?DED-200X'),
    'Avis-Millenium-MPS-450.dc.html': ('Millenium MPS-450', r'(?:Millenium )?MPS-450(?!\d)'),
    'Avis-Alesis-Turbo-Mesh.dc.html': ('Alesis Turbo Mesh', r'(?:Alesis )?Turbo Mesh(?: Kit)?'),
    'Avis-Millenium-MPS-750X.dc.html': ('Millenium MPS-750X', r'(?:Millenium )?MPS-750X'),
    'Avis-Millenium-MPS-850.dc.html': ('Millenium MPS-850', r'(?:Millenium )?MPS-850(?!\d)'),
}
NOM_VERS_AVIS = {nom: c for c, (nom, _) in AVIS.items()}
SOURCES = sorted(glob.glob('Guide-*.dc.html') + glob.glob('Les-Bases-*.dc.html') + glob.glob('Duel-*.dc.html') + glob.glob('Avis-*.dc.html'))
SOURCES = [s for s in SOURCES if s != 'Guide-Du-Projet.dc.html']
MAX_PHRASES = 5
# Lignes qu'une correction de port-corrections.json retire de la page : un lien y ferait échouer
# le portage. La Turbo Mesh est à 309 €, le guide « moins de 300 € » ne la présente plus.
EXCLUS = {('Guide-Moins-De-300-Euros.dc.html', 'Avis-Alesis-Turbo-Mesh.dc.html')}

VIDES = {'img', 'br', 'hr', 'meta', 'link', 'input', 'source', 'path', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon', 'use', 'stop'}
INTERDITS = {'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'button', 'th', 'label', 'title', 'script', 'style', 'svg', 'figcaption'}


def segments_de_texte(h):
    """Chaque texte entre deux balises, avec la pile des éléments ouverts autour de lui."""
    pile, pos = [], 0
    for m in re.finditer(r'<(/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(/?)>|<!--.*?-->', h, re.S):
        if m.start() > pos:
            yield pos, m.start(), tuple(pile)
        pos = m.end()
        if m.group(0).startswith('<!--'):
            continue
        ferme, nom, auto = m.group(1), m.group(2).lower(), m.group(3)
        if ferme:
            if nom in pile:
                while pile and pile.pop() != nom:
                    pass
        elif not auto and nom not in VIDES:
            pile.append(nom)


def dans_une_phrase(pile):
    return ('p' in pile or 'li' in pile) and not (INTERDITS & set(pile))


def lie(h, cible):
    return f'href="{cible}"' in h


rapport, total = [], 0
for src in SOURCES:
    h = open(src, encoding='utf-8').read()
    neuf = h

    # 1. Cellule « nom » d'un tableau comparatif : le motif existe (ligne Nitro Max), les lignes
    #    des modèles dont l'avis est paru après la maquette ne l'ont jamais reçu.
    def cellule(m):
        cible = NOM_VERS_AVIS[m.group(2)]
        if cible == src or (src, cible) in EXCLUS:
            return m.group(0)
        rapport.append(dict(page=src, cible=cible, ancre=m.group(2) + (m.group(3) or ''), ou='tableau'))
        return f'{m.group(1)}<a href="{cible}" style="{STYLE}">{m.group(2)}{m.group(3) or ""}</a>{m.group(4)}'

    neuf = re.sub(r'(<div style="padding:15px 16px;font-weight:[67]00">)(' + '|'.join(map(re.escape, NOM_VERS_AVIS)) + r')( Mesh| Kit)?(</div>|<div)', cellule, neuf)

    # 2. Lien connexe écrit vers le hub faute d'avis à l'époque : il vise maintenant l'avis.
    avant = neuf
    neuf = re.sub(r'href="Avis\.dc\.html"((?:\s[^>]*)?)>Donner DED-200X<', r'href="Avis-Donner-DED-200X.dc.html"\1>Donner DED-200X<', neuf)
    if neuf != avant:
        rapport.append(dict(page=src, cible='Avis-Donner-DED-200X.dc.html', ancre='Donner DED-200X', ou='lien connexe (visait /avis/)'))

    # 3. Première mention dans une phrase d'un avis que la page ne lie toujours pas.
    ajouts = []
    for cible, (_, motif) in AVIS.items():
        if cible == src or (src, cible) in EXCLUS or lie(neuf, cible):
            continue
        for d, f, pile in segments_de_texte(neuf):
            if not dans_une_phrase(pile):
                continue
            m = re.search(motif, neuf[d:f])
            if m:
                ajouts.append((d + m.start(), d + m.end(), cible, m.group(0)))
                break
    ajouts = sorted(ajouts)[:MAX_PHRASES]
    for a, b, cible, txt in ajouts:
        texte = ' '.join(re.sub(r'<[^>]+>', ' ', neuf[max(0, a - 160):b + 60]).split())
        rapport.append(dict(page=src, cible=cible, ancre=txt, ou='phrase : …' + texte[-140:]))
    for a, b, cible, txt in sorted(ajouts, reverse=True):
        neuf = neuf[:a] + f'<a href="{cible}" style="{STYLE}">{txt}</a>' + neuf[b:]

    if neuf != h:
        if APPLIQUER:
            if not os.path.exists(src + '.avant-maillage'):
                open(src + '.avant-maillage', 'w', encoding='utf-8').write(h)
            open(src, 'w', encoding='utf-8').write(neuf)

for r in rapport:
    print(f"{r['page'].replace('.dc.html', '')[:40]:40} → {r['cible'].replace('.dc.html', '').replace('Avis-', ''):20} « {r['ancre']} » {r['ou'][:120]}")
print(len(rapport), 'liens', 'APPLIQUÉS' if APPLIQUER else '(simulation)')
