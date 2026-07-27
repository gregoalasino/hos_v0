import { Resend } from 'resend';

// Email is optional infrastructure: if RESEND_API_KEY is not set, sends are
// skipped (not thrown) so local dev and the pack flow keep working. The admin
// can always resend a pack code once the key is configured.
const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? 'House of Shakti <onboarding@resend.dev>';

const resend = apiKey ? new Resend(apiKey) : null;

export type SendResult = { sent: boolean; skipped?: boolean; error?: string };

type PackCodeEmail = {
  to: string;
  firstName: string;
  code: string;
  packName: string;
  classesTotal: number;
};

export async function sendPackCodeEmail(params: PackCodeEmail): Promise<SendResult> {
  const { to, firstName, code, packName, classesTotal } = params;

  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping pack code email to', to);
    return { sent: false, skipped: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `Your ${packName} is ready — House of Shakti`,
      html: packCodeHtml({ firstName, code, packName, classesTotal }),
    });
    if (error) {
      console.error('[email] pack code send failed:', error);
      return { sent: false, error: String(error) };
    }
    return { sent: true };
  } catch (err) {
    console.error('[email] pack code send threw:', err);
    return { sent: false, error: err instanceof Error ? err.message : 'unknown' };
  }
}

function packCodeHtml({
  firstName,
  code,
  packName,
  classesTotal,
}: Omit<PackCodeEmail, 'to'>): string {
  return `
  <div style="font-family: Georgia, 'Times New Roman', serif; background:#f7f4ef; padding:40px 0; color:#313131;">
    <div style="max-width:520px; margin:0 auto; background:#ffffff; border:1px solid #ececec;">
      <div style="background:#1f1b18; padding:32px 40px;">
        <p style="margin:0; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,0.5);">House of Shakti</p>
        <h1 style="margin:8px 0 0; font-size:22px; font-weight:300; color:#f7f4ef;">Your class pack is ready</h1>
      </div>
      <div style="padding:36px 40px;">
        <p style="font-size:15px; line-height:1.6;">Hello ${escapeHtml(firstName)},</p>
        <p style="font-size:15px; line-height:1.6;">
          Thank you for your <strong>${escapeHtml(packName)}</strong>. You have
          <strong>${classesTotal} classes</strong> to enjoy at the shala.
        </p>
        <p style="font-size:15px; line-height:1.6;">Use this code when you book a class — the class fee will be waived:</p>
        <div style="margin:24px 0; text-align:center;">
          <span style="display:inline-block; font-family: 'Courier New', monospace; font-size:24px; letter-spacing:4px; padding:16px 28px; background:#f7f4ef; border:1px dashed #b08d57; color:#1f1b18;">
            ${escapeHtml(code)}
          </span>
        </div>
        <p style="font-size:13px; line-height:1.6; color:#7a6b5d;">
          The code works for ${classesTotal} bookings. Enter it in the “Referral code” field at checkout.
          Optional add-ons (like Ice Bath &amp; Sauna) are charged separately.
        </p>
        <p style="font-size:15px; line-height:1.6; margin-top:28px;">See you on the mat,<br/>House of Shakti</p>
      </div>
      <div style="border-top:1px solid #ececec; padding:20px 40px;">
        <p style="margin:0; font-size:11px; color:#a6896d;">Santa Teresa · Puntarenas · Costa Rica</p>
      </div>
    </div>
  </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
