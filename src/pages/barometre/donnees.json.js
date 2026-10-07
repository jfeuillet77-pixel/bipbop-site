/**
 * /barometre/donnees.json : les chiffres du baromètre en JSON, les mêmes que la page /barometre/,
 * recalculés à chaque build depuis src/data/barometre/ (src/lib/barometre.mjs). Le dernier état
 * complet, la série jour par jour, et la liste des batteries du dernier relevé avec leur prix.
 */
import { donnees } from '../../lib/barometre.mjs';

export function GET() {
  return new Response(JSON.stringify(donnees(), null, 1), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
