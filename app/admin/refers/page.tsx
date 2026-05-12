import { getAllReferralCodes } from '@/lib/queries/referralCodes';
import { getAllUpsells } from '@/lib/queries/upsells';
import RefersClient from './_components/RefersClient';

export default async function AdminRefersPage() {
  const [codes, upsells] = await Promise.all([
    getAllReferralCodes(),
    getAllUpsells(),
  ]);

  const serializedCodes = codes.map(c => ({
    ...c,
    validFrom: c.validFrom ? c.validFrom.toISOString() : undefined,
    validUntil: c.validUntil ? c.validUntil.toISOString() : undefined,
    createdAt: c.createdAt.toISOString(),
  }));

  return <RefersClient initialCodes={serializedCodes} upsells={upsells} />;
}
