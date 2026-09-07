import { format, addMinutes } from 'date-fns';
import { BUSINESS, EMAIL_DOMAIN } from '@/lib/business';

type ICSParams = {
  uid: string;
  title: string;
  description: string;
  location: string;
  startsAt: Date;
  durationMinutes: number;
  organizerName?: string;
};

function formatICSDate(date: Date): string {
  // Formato: 20260504T063000 (local time, sin Z para que el calendario use la hora local)
  return format(date, "yyyyMMdd'T'HHmmss");
}

export function generateICS(params: ICSParams): string {
  const { uid, title, description, location, startsAt, durationMinutes, organizerName } = params;
  const endsAt = addMinutes(startsAt, durationMinutes);
  const now = formatICSDate(new Date());

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//House of Shakti//Yoga Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    // Canonical domain — this used to read `houseofshakti.com`, which is not a
    // domain the business owns and disagreed with every address on the site.
    `UID:${uid}@${EMAIL_DOMAIN}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatICSDate(startsAt)}`,
    `DTEND:${formatICSDate(endsAt)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    // Reservations is the mailbox that actually handles bookings; `info@` was
    // invented and lived on the wrong domain. Still TODO_CONFIRM in business.ts.
    organizerName
      ? `ORGANIZER;CN=${organizerName}:mailto:${BUSINESS.email.reservations}`
      : '',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  return lines.join('\r\n');
}

export function downloadICS(params: ICSParams, filename: string): void {
  const content = generateICS(params);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
