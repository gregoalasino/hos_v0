import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SHARED_NAMESPACES, pickMessages, type Namespace } from './messages';

// A page's own provider. Wraps the page's tree with the shared chrome
// namespaces plus the ones named here, so `useTranslations('yoga')` works in
// every client component below without the whole catalogue travelling in the
// HTML. Server components read through `getTranslations` and never need it.
export async function PageMessages({
  namespaces,
  children,
}: {
  namespaces: readonly Namespace[];
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={pickMessages(messages, [...SHARED_NAMESPACES, ...namespaces])}>
      {children}
    </NextIntlClientProvider>
  );
}
