// Gera skins.<idioma>.json a partir da valorant-api.com (comunidade). Requer Node 18+. Uso: node build.mjs
// Preços: a API não traz preço por skin; usamos o preço padrão da raridade (estimativa, marcada com "~").
// Facas (Melee) ficam sem preço — corrija em overrides.json usando o uuid da skin (ou o id numérico).
import fs from 'fs';
const LANGS = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
const PRICE = { Select: 875, Deluxe: 1275, Premium: 1775, Exclusive: 2175, Ultra: 2475 }; // VP por devName da raridade
const U = 'https://valorant-api.com/v1/';
const J = async u => { const r = await fetch(u); if (!r.ok) throw new Error(r.status + ' ' + u); return (await r.json()).data; };
let over = {}; try { over = JSON.parse(fs.readFileSync('overrides.json', 'utf8')); } catch {}
let ver = ''; try { ver = (await J(U + 'version')).version || ''; } catch {}

for (const [code, l] of Object.entries(LANGS)) {
  const [W, T, C] = await Promise.all(['weapons', 'themes', 'contenttiers'].map(p => J(`${U}${p}?language=${l}`)));
  const tiers = C.map(t => ({ u: t.uuid, name: t.displayName, dev: t.devName, color: '#' + (t.highlightColor || '6b7b8aff').slice(0, 6) }));
  const ti = new Map(tiers.map((t, i) => [t.u, i]));
  const th = new Map(T.map(t => [t.uuid, t.displayName]));
  const seen = new Set();
  const weapons = W.map(w => {
    const melee = /melee/i.test(w.category || '');
    const s = w.skins.filter(k => ti.has(k.contentTierUuid)).map(k => {
      const id = parseInt(k.uuid.slice(0, 8), 16);
      if (seen.has(id)) throw new Error('colisão de id em ' + k.uuid);
      seen.add(id);
      const t = ti.get(k.contentTierUuid), o = over[k.uuid] || over[id] || {};
      const p = melee ? 0 : PRICE[tiers[t].dev] || 0;
      return { id, name: o.name || k.displayName, icon: k.displayIcon || k.levels?.[0]?.displayIcon || k.chromas?.[0]?.fullRender || '',
        t, cost: o.cost ?? p, est: o.cost != null || !p ? 0 : 1, th: th.get(k.themeUuid) || '' };
    });
    return { id: w.uuid, name: w.displayName, icon: w.displayIcon, s };
  }).filter(w => w.s.length).sort((a, b) => a.name.localeCompare(b.name, code));
  fs.writeFileSync(`skins.${code}.json`, JSON.stringify({ v: ver, t: new Date().toISOString(), tiers: tiers.map(({ name, color }) => ({ name, color })), weapons }));
  console.log(`OK ${code}: ${weapons.length} armas, ${weapons.reduce((a, w) => a + w.s.length, 0)} skins`);
}
