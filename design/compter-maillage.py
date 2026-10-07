"""Compte, par réceptrice de design/strategie-maillage.md, les pages de dist/ dont le CORPS
(en-tête data-hdr et pied <footer> exclus) contient un lien vers elle.

Usage : npm run build && python3 design/compter-maillage.py dist [v]   (v : liste les pages)
"""
import sys,re,glob,os
DIST=sys.argv[1]
R={'R1':'/guides/choisir-batterie-electronique-adulte-debutant/','R2':'/guides/choisir-batterie-electronique-enfant/','R3':'/comparatif-batterie-electronique/','R4':'/guides/acheter-batterie-electronique-occasion/','R5':'/guides/prix-batterie-electronique/'}
def corps(s):
    b=s.find('<body')
    s=s[b:]
    i=s.find('data-hdr')
    if i>=0:
        st=s.rfind('<',0,i); tag=re.match(r'<(\w+)',s[st:]).group(1); depth=0; j=st
        for m in re.finditer(r'<%s\b|</%s>'%(tag,tag),s[st:]):
            depth+= 1 if not m.group(0).startswith('</') else -1
            if depth==0: j=st+m.end(); break
        s=s[:st]+s[j:]
    f=s.find('<footer')
    if f>=0: s=s[:f]
    return s
res={k:[] for k in R}
for p in glob.glob(DIST+'/**/index.html',recursive=True):
    route='/'+os.path.relpath(os.path.dirname(p),DIST).replace('.','')+'/'
    route=route.replace('//','/')
    c=corps(open(p,encoding='utf-8').read())
    for k,u in R.items():
        if route==u: continue
        if re.search(r'href="(https://bipbop\.eu)?'+re.escape(u)+r'(#[^"]*)?"',c): res[k].append(route)
for k in R:
    print(k,len(res[k]),' '.join(sorted(res[k])) if len(sys.argv)>2 else '')
