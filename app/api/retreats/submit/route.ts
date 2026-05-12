import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName, lastName, email, phone,
      retreatName, retreatSlug, selectedDate, participants, message,
    } = body;

    if (!firstName || !lastName || !email || !retreatName) {
      return NextResponse.json({ error: 'missing_required_fields' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('retreat_submissions').insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone ?? null,
      retreat_name: retreatName,
      retreat_slug: retreatSlug ?? null,
      selected_date: selectedDate ?? null,
      participants: participants ?? 1,
      message: message ?? null,
    });

    if (error) {
      console.error('[POST /api/retreats/submit]', error.message);
      return NextResponse.json({ error: 'database_error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/retreats/submit]', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
