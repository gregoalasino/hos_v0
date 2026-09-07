import type en from '../messages/en.json';
import type es from '../messages/es.json';

// The two catalogues must have the same shape. TypeScript compares them here,
// in both directions, and `next build` runs the type check — so a key added
// to English without its Spanish twin fails the build, and so does a Spanish
// key nothing in English asks for. (Lists are compared by element type, not
// by length: a FAQ with seven answers in one language and eight in the other
// passes here and is caught by the runtime check in scripts/check-messages.)
type Messages = typeof en;
type SpanishMessages = typeof es;

type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;

// Fails to compile when either side is missing something the other has.
const spanishMatchesEnglish: Exact<SpanishMessages, Messages> = true;
export default spanishMatchesEnglish;
