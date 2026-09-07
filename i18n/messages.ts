import type en from '../messages/en.json';

/** The full catalogue, typed from the English file. */
export type Messages = typeof en;
export type Namespace = keyof Messages;

/**
 * Namespaces every page needs on the client — the chrome that the layout and
 * the shared components render everywhere. The layout's provider carries
 * these and nothing else; a page adds its own namespace(s) through
 * `PageMessages`, so a visitor to /about never downloads the training's
 * two hundred strings.
 */
export const SHARED_NAMESPACES: Namespace[] = ['nav', 'footer', 'whatsapp', 'common'];

/** The subset of a catalogue a page sends to the client. */
export function pickMessages(messages: Messages, namespaces: readonly Namespace[]): Partial<Messages> {
  const picked: Partial<Messages> = {};
  for (const ns of namespaces) {
    if (ns in messages) Object.assign(picked, { [ns]: messages[ns] });
  }
  return picked;
}
