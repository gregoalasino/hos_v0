import { defineConfig, globalIgnores } from 'eslint/config';
import next from 'eslint-config-next';

// ─── ESLint ──────────────────────────────────────────────────────────────────
// Minimal on purpose. `next/core-web-vitals` is Next's own recommended set: the
// React and hooks rules, plus the Core Web Vitals checks that catch the things
// that actually cost ranking — an <img> where next/image belongs, a sync
// <script> in the head, a missing key.
//
// Installed ahead of the bilingual phase rather than after it. That refactor
// moves strings through 35 files, and the class of mistake it invites — a hook
// called conditionally, a variable left behind, a dependency array gone stale
// — is exactly what this catches and what a type checker does not.
export default defineConfig([
  globalIgnores([
    '.next/**',
    'node_modules/**',
    // shadcn/ui primitives, vendored rather than authored. Linting someone
    // else's generated code produces noise nobody will act on.
    'components/ui/**',
  ]),
  ...next,
]);
