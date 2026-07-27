import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureWeekMaterialized } from '@/lib/queries/classes';
import type { DbClass } from '@/types';
import { dbClassToYogaClass } from '@/types';

// Always run fresh: the endpoint materializes the week's occurrences and must
// reflect the live schedule (no static/route caching).
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json({ error: 'missing_params' }, { status: 400 });
    }

    const startDate = new Date(`${start}T00:00:00Z`);
    const endDate = new Date(`${end}T23:59:59Z`);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'invalid_dates' }, { status: 400 });
    }

    // Auto-create the week's occurrences from the recurring schedule before reading.
    await ensureWeekMaterialized(startDate);

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('classes')
      .select('*, instructors(id, name)')
      .eq('is_active', true)
      .gte('starts_at', startDate.toISOString())
      .lte('starts_at', endDate.toISOString())
      .order('starts_at', { ascending: true });

    if (error) {
      console.error('[GET /api/classes/week]', error.message);
      return NextResponse.json({ classes: [] });
    }

    const classes = (data as unknown as DbClass[]).map(dbClassToYogaClass).map((c) => ({
      ...c,
      startsAt: c.startsAt.toISOString(),
    }));

    return NextResponse.json({ classes });
  } catch (err) {
    console.error('[GET /api/classes/week]', err);
    return NextResponse.json({ classes: [] });
  }
}
