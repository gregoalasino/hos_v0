export type YogaClass = {
  id: string;
  name: string;
  slug: string;
  description: string;
  instructor: string;
  startsAt: Date;
  durationMinutes: number;
  capacity: number;
  spotsRemaining: number;
  priceUsd: number;
  location: string;
  isActive: boolean;
  color?: string;
};

export type RecurringSlot = {
  id: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Dom, 1=Lun...
  timeStart: string; // "HH:mm"
  capacity: number;
  priceUsd: number;
  isActive: boolean;
};

export type Booking = {
  id: string;
  classId: string;
  className: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  persons: number;
  upsells: string[];
  paymentStatus: 'pending' | 'paid' | 'free' | 'cancelled' | 'no-show';
  bookingReference: string;
  referralCode?: string;
  createdAt: Date;
};

export type Upsell = {
  id: string;
  name: string;
  description: string;
  priceUsd: number;
  isActive: boolean;
};

export type ReferralCode = {
  id: string;
  code: string;
  partnerName: string;
  description: string;
  benefitType: 'percentage' | 'fixed' | 'free_upsell';
  discountPercent?: number;   // used when benefitType === 'percentage'
  discountFixed?: number;     // used when benefitType === 'fixed'
  freeUpsellId?: string;      // used when benefitType === 'free_upsell'
  isActive: boolean;
  usageLimit?: number;        // undefined = unlimited
  usageCount: number;
  validFrom?: Date;
  validUntil?: Date;
  minPurchaseUsd: number;
  createdAt: Date;
};

export type Instructor = {
  id: string;
  name: string;
  email: string | null;
  bio: string | null;
  photo_url: string | null;
  created_at: string;
};

export type ClassTemplate = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  instructor_id: string | null;
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  time_start: string;
  duration_minutes: number;
  capacity: number;
  price_dropin_usd: number;
  location: string;
  color: string | null;
  is_active: boolean;
  created_at: string;
  // Present when the row is fetched with the instructors join.
  instructors?: { id: string; name: string } | null;
};

export type ClassPack = {
  id: string;
  name: string;
  classes_count: number;
  price_usd: number;
  is_active: boolean;
};

export type RetreatSubmission = {
  id: string;
  retreat_name: string;
  retreat_slug: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  selected_date: string | null;
  participants: number;
  message: string | null;
  created_at: string;
};

// DB booking status (differs from legacy frontend Booking.paymentStatus)
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'no-show';

// Shape returned by Supabase for a class row joined with instructor
export type DbClass = {
  id: string;
  template_id: string | null;
  instructor_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  starts_at: string; // ISO 8601 UTC
  duration_minutes: number;
  capacity: number;
  spots_remaining: number;
  price_dropin_usd: number;
  location: string;
  color: string | null;
  is_active: boolean;
  created_at: string;
  instructors: { id: string; name: string } | null;
};

// DbClass mapped to the legacy YogaClass shape used by UI components
export function dbClassToYogaClass(row: DbClass): YogaClass {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    instructor: row.instructors?.name ?? '',
    startsAt: new Date(row.starts_at),
    durationMinutes: row.duration_minutes,
    capacity: row.capacity,
    spotsRemaining: row.spots_remaining,
    priceUsd: Number(row.price_dropin_usd),
    location: row.location,
    isActive: row.is_active,
    color: row.color ?? undefined,
  };
}
