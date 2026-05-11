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
