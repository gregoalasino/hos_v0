// Every leaf key in messages/en.json must exist in messages/es.json and vice
// versa, lists included, element by element. TypeScript already compares the
// two files by shape (i18n/messages.check.ts); this closes the gap it leaves
// for list lengths. Run by `npm run build` before Next starts.
import { readFileSync } from 'node:fs';

const load = (locale) => JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), 'utf8'));

function leaves(value, prefix = '') {
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${prefix}${i}.`));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([k, v]) => leaves(v, `${prefix}${k}.`));
  return [prefix.slice(0, -1)];
}

const en = new Set(leaves(load('en')));
const es = new Set(leaves(load('es')));
const missing = [...en].filter((k) => !es.has(k));
const extra = [...es].filter((k) => !en.has(k));

if (missing.length || extra.length) {
  for (const k of missing) console.error(`messages/es.json is missing: ${k}`);
  for (const k of extra) console.error(`messages/es.json has no English twin for: ${k}`);
  process.exit(1);
}
console.log(`messages: ${en.size} keys, en and es in step`);
