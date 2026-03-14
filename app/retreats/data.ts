export type ItineraryDay = {
  day: string;
  title: string;
  activities: string[];
};

export type Retreat = {
  id: string;
  name: string;
  duration: string;
  price: number;
  tagline: string;
  description: string;
  extendedDescription: string;
  highlights: string[];
  image: string;
  heroImage: string;
  dates: string[];
  itinerary: ItineraryDay[];
  included: string[];
};

export const retreats: Retreat[] = [
  {
    id: "shakti_sadhana",
    name: "Shakti Sadhana",
    duration: "7 Days",
    price: 2499,
    tagline: "Awaken the Divine Feminine",
    description:
      "A deep dive into the feminine divine. This week-long immersion combines daily yoga practice, Tantric philosophy, sacred ceremony, and transformative bodywork. Guided by our senior teachers, you'll explore the awakening of Shakti energy through movement, breath, and meditation.",
    extendedDescription:
      "Shakti Sadhana is a seven-day initiation into the sacred feminine. Drawing from the living traditions of Tantra, Kashmir Shaivism, and embodied yoga, this immersion invites you to meet yourself at the deepest level. Each day is structured to take you inward—through vigorous morning practice, philosophical study, creative ritual, and profound stillness. You will be held in a small, intimate group of seekers, guided by teachers who carry decades of lineage-based study. This is not a vacation; it is a turning point.",
    highlights: [
      "Daily 2-hour yoga practice",
      "Tantric philosophy sessions",
      "Sacred fire ceremony",
      "Sound healing journey",
      "Private integration session",
    ],
    included: [
      "7 nights boutique accommodation",
      "3 nourishing plant-based meals daily",
      "All yoga and philosophy sessions",
      "One private integration session",
      "Sacred ceremony materials",
      "Airport transfers included",
    ],
    image: "/images/retreat-shakti.jpg",
    heroImage: "/images/retreat-hero.jpg",
    dates: ["Mar 15-22", "May 10-17", "Jul 5-12"],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival & Opening Ceremony",
        activities: [
          "Welcome orientation and property tour",
          "Intention-setting circle with all participants",
          "Gentle restorative yoga to ground after travel",
          "Opening fire ceremony at sunset",
          "Community welcome dinner",
        ],
      },
      {
        day: "Day 2",
        title: "Awakening",
        activities: [
          "6:00 AM Sunrise pranayama on the shala",
          "Morning Shakti Flow — 2 hours of dynamic vinyasa",
          "Breakfast followed by free time for integration",
          "Introduction to Tantric philosophy: The nature of Shakti",
          "Afternoon sound healing journey",
          "Evening journaling and silent meditation",
        ],
      },
      {
        day: "Day 3",
        title: "The Body as Temple",
        activities: [
          "6:00 AM Kundalini awakening practice",
          "Deep bodywork session: self-massage and partner practices",
          "Philosophy talk: The five elements and the feminine body",
          "Afternoon free — optional: jungle hike or beach walk",
          "Vedic chanting circle in the evening",
        ],
      },
      {
        day: "Day 4",
        title: "Into the Depths",
        activities: [
          "6:00 AM Yin yoga — surrendering into stillness",
          "Extended morning meditation: 90 minutes of guided silence",
          "Group sharing circle",
          "Sacred arts afternoon: mandala drawing and mantra writing",
          "Evening: Optional one-on-one sessions with teachers",
        ],
      },
      {
        day: "Day 5",
        title: "Ceremony & Transformation",
        activities: [
          "Pre-dawn walk: meeting the dark before the light",
          "Vinyasa flow with live music accompaniment",
          "Sacred fire ceremony — Agni Puja",
          "Afternoon rest and integration",
          "Community dinner with ritual offering",
        ],
      },
      {
        day: "Day 6",
        title: "Embodiment",
        activities: [
          "6:00 AM Ecstatic dance and free movement",
          "Philosophy: Integrating Shakti into daily life",
          "Personal integration session with a senior teacher",
          "Afternoon: Free time — optional spa treatments available",
          "Closing banquet dinner under the stars",
        ],
      },
      {
        day: "Day 7",
        title: "Integration & Farewell",
        activities: [
          "Final sunrise practice: each participant leads a moment",
          "Closing circle — sharing gifts and intentions forward",
          "Ceremonial breakfast",
          "Departures with full hearts",
        ],
      },
    ],
  },
  {
    id: "within",
    name: "Within",
    duration: "5 Days",
    price: 1899,
    tagline: "The Journey Inward Begins Here",
    description:
      "A silent retreat for those seeking profound inner stillness. Step away from the noise of daily life and journey inward through meditation, gentle yoga, and contemplative practices. Nourishing plant-based meals and optional journaling sessions support your process.",
    extendedDescription:
      "In a world that never stops speaking, Within offers the radical gift of silence. Over five days, you will enter a space of deep listening — to your breath, your body, and the quiet intelligence that lives beneath the noise of thought. Guided gently each morning and evening, with long stretches of unstructured silence throughout each day, this retreat is designed for those who feel called to go deeper than words can reach. Noble silence is held from the first evening until the final morning of the retreat.",
    highlights: [
      "Noble silence throughout",
      "Guided meditation sessions",
      "Gentle morning yoga",
      "Walking meditation in nature",
      "One-on-one guidance available",
    ],
    included: [
      "5 nights boutique accommodation",
      "3 nourishing plant-based meals daily",
      "All meditation and yoga sessions",
      "Walking meditation guides",
      "Journaling workbook",
      "One private guidance session",
    ],
    image: "/images/retreat-within.jpg",
    heroImage: "/images/retreat-hero.jpg",
    dates: ["Apr 1-6", "Jun 12-17", "Aug 20-25"],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival & Entering Stillness",
        activities: [
          "Welcome and orientation",
          "Introduction to the practice of noble silence",
          "Gentle restorative yoga",
          "Guided evening meditation",
          "Noble silence begins after dinner",
        ],
      },
      {
        day: "Day 2",
        title: "The First Silence",
        activities: [
          "5:30 AM Wake bell — optional seated meditation",
          "6:30 AM Gentle morning yoga with breath awareness",
          "Silent breakfast",
          "Walking meditation in the jungle: 90 minutes",
          "Free afternoon for rest, journaling, or contemplation",
          "Evening guided meditation: working with the mind",
        ],
      },
      {
        day: "Day 3",
        title: "Deepening",
        activities: [
          "5:30 AM Extended morning sit: 60 minutes",
          "Slow flow yoga — every movement as meditation",
          "Silent breakfast and extended silence period",
          "Body scan and yoga nidra: 75 minutes",
          "Beach walking meditation at low tide",
          "Evening dharma reading — distributed in silence",
        ],
      },
      {
        day: "Day 4",
        title: "The Still Point",
        activities: [
          "5:30 AM Pre-dawn sit: meeting the darkness",
          "Sunrise pranayama",
          "Silent breakfast",
          "Individual guidance sessions available (in silence)",
          "Free afternoon — deepest day of the retreat",
          "Evening meditation: loving-kindness practice",
        ],
      },
      {
        day: "Day 5",
        title: "Return & Integration",
        activities: [
          "Final morning sit followed by gentle movement",
          "Noble silence lifted after breakfast",
          "Guided sharing circle — voices returning slowly",
          "Integration workshop: bringing silence home",
          "Closing ceremony and farewell",
        ],
      },
    ],
  },
  {
    id: "pura-vida",
    name: "Pura Vida",
    duration: "4 Days",
    price: 1499,
    tagline: "Live the Pure Life",
    description:
      "Celebrate the pure life through movement, adventure, and connection. This dynamic retreat blends yoga with surf lessons, jungle hikes, and beach bonfire gatherings. Perfect for those who want to balance inner work with the joy of play.",
    extendedDescription:
      "Pura Vida — the pure life — is not just a phrase in Costa Rica. It is a philosophy. On this four-day retreat, you will embody it fully: waking before dawn for yoga, chasing waves all morning, exploring jungle trails in the afternoon, and gathering around a bonfire as the stars emerge. This retreat is for those who believe that joy is also a spiritual practice, that laughter is medicine, and that connection — with nature, with others, and with yourself — is the deepest form of wellness.",
    highlights: [
      "Surf lessons included",
      "Jungle waterfall hike",
      "Beach yoga sessions",
      "Community dinners",
      "Optional massage treatments",
    ],
    included: [
      "4 nights boutique accommodation",
      "3 meals daily (breakfast, lunch, dinner)",
      "2 surf lessons with certified instructors",
      "Guided jungle waterfall hike",
      "All yoga sessions",
      "Beach bonfire evening with live music",
    ],
    image: "/images/retreat-puravida.jpg",
    heroImage: "/images/retreat-hero.jpg",
    dates: ["Mar 28-31", "Apr 18-21", "May 23-26"],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrive & Unwind",
        activities: [
          "Check-in and welcome tour of the sanctuary",
          "Introduction circle on the beach at sunset",
          "Evening yoga: opening the body and setting intentions",
          "Welcome bonfire dinner with live music",
        ],
      },
      {
        day: "Day 2",
        title: "Ride the Wave",
        activities: [
          "6:30 AM Beach yoga — sun salutations facing the ocean",
          "Morning surf lesson: theory and first water session",
          "Group lunch at the sanctuary",
          "Afternoon: free beach time, optional massage bookings",
          "Evening yoga: releasing the body after surfing",
          "Communal dinner with sharing",
        ],
      },
      {
        day: "Day 3",
        title: "Into the Jungle",
        activities: [
          "6:30 AM Sunrise flow in the open-air shala",
          "Guided jungle waterfall hike — 4 hours",
          "Picnic lunch at the waterfall",
          "Return and afternoon rest",
          "Second surf lesson at golden hour",
          "Final bonfire gathering — community celebration",
        ],
      },
      {
        day: "Day 4",
        title: "Carry It With You",
        activities: [
          "6:30 AM Final morning yoga — integrating the experience",
          "Closing circle and intention sharing",
          "Leisurely farewell breakfast",
          "Departures — carrying the pure life forward",
        ],
      },
    ],
  },
];

export function getRetreatBySlug(slug: string): Retreat | undefined {
  return retreats.find((r) => r.id === slug);
}
