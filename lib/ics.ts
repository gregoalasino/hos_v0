import { format, addMinutes } from 'date-fns';

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
    `UID:${uid}@houseofshakti.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatICSDate(startsAt)}`,
    `DTEND:${formatICSDate(endsAt)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    organizerName ? `ORGANIZER;CN=${organizerName}:mailto:info@houseofshakti.com` : '',
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
