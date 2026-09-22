/**
 * comparatif-ui.mjs — fragments HTML de /comparatif-batterie-electronique/.
 *
 * Un seul exemplaire du balisage, partagé par le rendu au build et par le
 * navigateur : ce qui est affiché avant execution du JS est exactement ce que
 * le JS afficherait. Les styles sont recopies des maquettes Claude Design,
 * y compris les crochets data-*, seul moyen de toucher le responsive.
 */
import { OPTIONS } from './comparatif.mjs';

const style = {
  carte: 'background:#fff;border:2.5px solid #241c14;border-radius:18px;padding:22px;box-shadow:5px 5px 0 #241c14',
  numero: (couleur) => `width:24px;height:24px;flex:none;border-radius:50%;background:${couleur};border:2px solid #241c14;color:#fff;font:700 12px 'Work Sans',sans-serif;display:flex;align-items:center;justify-content:center`,
  question: 'font:700 17px \'Bricolage Grotesque\',sans-serif;letter-spacing:-.01em',
  options: 'display:flex;flex-direction:column;gap:9px',
  actif: "font:700 14.5px 'Work Sans',sans-serif;padding:11px 14px;border-radius:11px;border:2.5px solid #241c14;background:#ffd166;color:#241c14;cursor:pointer;text-align:left;width:100%;display:block",
  inactif: "font:500 14.5px 'Work Sans',sans-serif;padding:11px 14px;border-radius:11px;border:2px solid #e4d8c6;background:#fff;color:#5a4c3e;cursor:pointer;text-align:left;width:100%;display:block",
  carteTop: 'position:relative;background:#fff;border:2.5px solid #241c14;border-radius:20px;overflow:hidden;box-shadow:7px 7px 0 #d2431f',
  ruban: 'position:absolute;top:16px;right:16px;z-index:2;transform:rotate(6deg);background:#d2431f;color:#fff;border:2.5px solid #241c14;border-radius:10px;padding:8px 13px;font:700 13px \'Bricolage Grotesque\',sans-serif;pointer-events:none',
  cadreImage: 'height:240px;border-bottom:2.5px solid #241c14;background:#fff',
  corpsCarte: 'padding:24px 26px 26px',
  mono: "font:500 12px 'IBM Plex Mono',monospace;color:#786550;margin-bottom:6px",
  titre: 'font:800 34px/1.05 \'Bricolage Grotesque\',sans-serif;letter-spacing:-.03em;margin-bottom:12px',
  phrase: "font:400 16.5px/1.6 'Work Sans',sans-serif;color:#3a2f26;margin:0 0 16px",
  encart: 'background:#ffd166;border:2.5px solid #241c14;border-radius:14px;padding:15px 17px;margin-bottom:18px',
  etiquette: "font:700 12px 'Work Sans',sans-serif;letter-spacing:.05em;color:#5a4c3e;margin-bottom:6px",
  raison: "font:400 15.5px/1.55 'Work Sans',sans-serif;color:#241c14;margin:0",
  chiffres: 'display:flex;gap:20px;flex-wrap:wrap;margin-bottom:20px',
  chiffre: "font:800 20px 'Bricolage Grotesque',sans-serif;letter-spacing:-.02em",
  chiffreLegende: "font:500 11.5px 'IBM Plex Mono',monospace;color:#786550",
  rangee: 'display:flex;gap:12px;align-items:center;flex-wrap:wrap',
  achat: 'font:700 15px \'Work Sans\',sans-serif;text-decoration:none;color:#fff;background:#d2431f;border:2.5px solid #241c14;padding:13px 20px;border-radius:12px;box-shadow:4px 4px 0 #241c14;white-space:nowrap',
  avis: "font:600 14.5px 'Work Sans',sans-serif;color:#241c14;text-decoration:underline;text-underline-offset:4px",
  colonne: 'display:flex;flex-direction:column;gap:16px',
  carteAlt: (ombre) => `background:#fff;border:2.5px solid #241c14;border-radius:18px;overflow:hidden;box-shadow:5px 5px 0 ${ombre}`,
  altLigne: 'display:flex;gap:14px;align-items:stretch',
  altImage: 'width:104px;flex:none;border-right:2px solid #e4d8c6;background:#fff',
  altCorps: 'padding:15px 16px 15px 2px;flex:1;min-width:0',
  altRole: (c) => `font:700 10.5px 'Work Sans',sans-serif;letter-spacing:.06em;color:${c};margin-bottom:5px`,
  altNom: "font:700 18px/1.15 'Bricolage Grotesque',sans-serif;letter-spacing:-.02em;margin-bottom:5px",
  altRaison: "font:400 13.5px/1.45 'Work Sans',sans-serif;color:#4a3d31;margin-bottom:9px",
  altBas: 'display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap',
  altPrix: "font:800 18px 'Bricolage Grotesque',sans-serif;letter-spacing:-.02em",
  altLien: "font:700 12.5px 'Work Sans',sans-serif;text-decoration:none;color:#241c14;border-bottom:2px solid #d2431f;white-space:nowrap",
  sombre: 'background:#241c14;border-radius:18px;padding:20px 22px;color:#fdf6ec',
  sombreTitre: "font:700 12px 'Work Sans',sans-serif;letter-spacing:.05em;color:#ffd166;margin-bottom:8px",
  sombreTexte: "font:400 15px/1.55 'Work Sans',sans-serif;color:#e0d5c8;margin:0 0 14px",
  Recommencer: "font:700 13.5px 'Work Sans',sans-serif;color:#241c14;background:#ffd166;border:none;padding:10px 16px;border-radius:10px;cursor:pointer",
};

const echapper = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Les trois cartes de questions, avec l'option active selon l'état. */
export function questionsHTML(etat) {
  const cartes = [
    { cle: 'budget', n: '1', couleur: '#d2431f', titre: "T'as combien&nbsp;?" },
    { cle: 'place', n: '2', couleur: '#0f7d76', titre: 'Tu la mets où&nbsp;?' },
    { cle: 'usage', n: '3', couleur: '#241c14', titre: 'Tu veux en faire quoi&nbsp;?' },
  ];
  return cartes.map((c) => `
      <div style="${style.carte}">
        <div style="display:flex;align-items:center;gap:9px;margin-bottom:15px">
          <span style="${style.numero(c.couleur)}">${c.n}</span>
          <span style="${style.question}">${c.titre}</span>
        </div>
        <div style="${style.options}">${OPTIONS[c.cle].map(([valeur, label]) => `
          <button type="button" data-choisir="${c.cle}" data-valeur="${valeur}" aria-pressed="${etat[c.cle] === valeur}" style="${style[etat[c.cle] === valeur ? 'actif' : 'inactif']}">${echapper(label)}</button>`).join('')}
        </div>
      </div>`).join('');
}

/** Bloc de résultat : carte principale + colonne des deux alternatives. */
export function resultatHTML(r) {
  if (!r.top) return `
    <div data-rwd="sp2" data-mar style="margin:0 40px 22px;display:grid;grid-template-columns:1.35fr 1fr;gap:20px;align-items:start">
      <div style="${style.carte}">Aucun modèle de la sélection ne tient dans ce budget. Remonte « T'as combien ? » d'un cran.</div>
    </div>`;
  const t = r.top;
  return `
    <div data-rwd="sp2" data-mar style="margin:0 40px 22px;display:grid;grid-template-columns:1.35fr 1fr;gap:20px;align-items:start">
      <div style="${style.carteTop}">
        <div style="${style.ruban}">CELLE-LÀ</div>
        <div style="${style.cadreImage}">
          <img src="${echapper(t.img)}" alt="${echapper(t.nomComplet)}" style="width:100%;height:100%;object-fit:contain;display:block;padding:16px;box-sizing:border-box">
        </div>
        <div style="${style.corpsCarte}">
          <div style="${style.mono}">${echapper(t.ligneSource)}</div>
          <div data-big="c" style="${style.titre}">${echapper(t.nomComplet)}</div>
          <p style="${style.phrase}">${echapper(t.phrase)}</p>
          <div style="${style.encart}">
            <div style="${style.etiquette}">POURQUOI ELLE</div>
            <p style="${style.raison}">${echapper(t.raison)}</p>
          </div>
          <div style="${style.chiffres}">${t.chiffres.map((c) => `
            <div>
              <div style="${style.chiffre}">${echapper(c.valeur)}</div>
              <div style="${style.chiffreLegende}">${echapper(c.libelle)}</div>
            </div>`).join('')}
          </div>
          <div style="${style.rangee}">
            <a href="${echapper(t.url)}" rel="sponsored noopener" target="_blank" style="${style.achat}">${echapper(t.libelleAchat)}</a>
            ${t.avis ? `<a href="${echapper(t.avis)}" style="${style.avis}">Lire l'avis complet</a>` : ''}
          </div>
        </div>
      </div>
      <div style="${style.colonne}">${r.alternatives.map((a) => `
        <div style="${style.carteAlt(a.ombre)}">
          <div style="${style.altLigne}">
            <div style="${style.altImage}">
              <img src="${echapper(a.img)}" alt="${echapper(a.nomComplet)}" style="width:100%;height:100%;object-fit:contain;display:block;padding:9px;box-sizing:border-box">
            </div>
            <div style="${style.altCorps}">
              <div style="${style.altRole(a.couleurRole)}">${echapper(a.role)}</div>
              <div style="${style.altNom}">${echapper(a.nomComplet)}</div>
              <div style="${style.altRaison}">${echapper(a.raison)}</div>
              <div style="${style.altBas}">
                <span style="${style.altPrix}">${echapper(a.prixTexte)}</span>
                <a href="${echapper(a.lienPrincipal)}"${a.avis ? '' : ' rel="sponsored noopener" target="_blank"'} style="${style.altLien}">${echapper(a.libelleLien)}</a>
              </div>
            </div>
          </div>
        </div>`).join('')}
        <div style="${style.sombre}">
          <div style="${style.sombreTitre}">CE QUE TU SACRIFIES</div>
          <p style="${style.sombreTexte}">${echapper(t.sacrifice)}</p>
          <button type="button" data-reinitialiser style="${style.Recommencer}">Recommencer</button>
        </div>
      </div>
    </div>`;
}

export { style };
