// ─── Yoga Teacher Training — copy, in both languages ─────────────────────────
// The rest of the site translates inline with `tr(lang, es, en)` from
// `lib/i18n.ts`. This landing does not: it was authored as a full dictionary,
// one key per section, and it carries far too much prose for the inline form
// to stay readable. Both live side by side on purpose — `tr()` for pages with
// a handful of strings, this for the one page that is mostly copy.
//
// English is the source of truth and the default; Spanish is a considered
// translation, not a mirror. Choices made once, applied throughout:
//
//   · Neutral Latin-American Spanish, tuteo — the register wellness brands use
//     across the region and Spain alike.
//   · Proper nouns, Sanskrit and credentials stay: House of Shakti, Yoga
//     Alliance, RYT 200, asana, pranayama, satsang, breathwork (the term the
//     Spanish-speaking wellness world itself uses).
//   · The program's name keeps its English brand — "The Awakened Body" — with
//     the descriptor translated, as course brands are handled in ES marketing.
//
// Structure mirrors the page, one key per section. `en` defines the shape;
// `es` must satisfy it, so a missing translation is a type error, not a
// silently English paragraph.

import type { Lang } from '@/lib/i18n';

const en = {
  nav: {
    menu: 'Menu',
    // Matches the hero's CTA rather than differing from it. Both open the same
    // WhatsApp conversation, so one phrase for one action reads as a single
    // invitation carried down the page — where two would read as two offers.
    // Deliberately not "Apply now": the navbar is seen on arrival, and applying
    // is a commitment that belongs further down, beside the terms it implies.
    // Second person throughout, like the rest of the page.
    apply: 'Reserve your place',
    items: ['The Training', 'Curriculum', 'Your Teachers', 'Investment', 'Questions'],
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    drawerLabel: 'Page navigation',
    langLabel: 'Language',
  },
  hero: {
    location: 'Santa Teresa, Costa Rica',
    dates: 'November 21 – December 4, 2026',
    title: 'The Awakened Body: Tantra Yoga Teacher Training',
    subtitle:
      'A 100-hour immersion, with an optional 100-hour online program, leading to a Yoga Alliance Registered 200-Hour Yoga Teacher Training — guided by Nancy Goodfellow.',
    cta: 'Reserve your place',
  },
  intro: {
    headline:
      'Embody the wisdom of Tantra — yoga as a path of embodiment, healing, and conscious living.',
    paragraphs: [
      'This training goes far beyond the physical practice of yoga. Through movement, breathwork, meditation, Tantra philosophy, ritual, nervous system regulation, somatic awareness, and authentic connection, you’ll explore yoga as a living practice that transforms the way you relate to yourself and the world.',
      'Held in the lush tropical beauty of Costa Rica, this immersive experience offers the perfect balance of disciplined study, embodied practice, community living, and deep restoration.',
      'Whether your intention is to become a yoga teacher or simply to deepen your personal practice, this training offers a grounded, integrative, and heart-centered path into embodied living.',
    ],
    trackAria: 'Scenes from the training',
  },
  different: {
    heading: 'More than a traditional teacher training.',
    sub: 'Rather than focusing solely on postures and sequencing, this immersion explores yoga as a complete path of embodied living. Here, you’ll learn to:',
    cards: [
      {
        title: 'Presence over performance',
        body: 'Move from presence rather than performance.',
      },
      {
        title: 'Teach from experience',
        body: 'Teach from lived experience rather than memorization.',
      },
      {
        title: 'Body, breath and nervous system',
        body: 'Cultivate a relationship with your body, breath, and nervous system that supports lasting transformation.',
      },
      {
        title: 'Ancient wisdom, modern practice',
        body: 'Bridge the wisdom of Tantra with modern somatic practices and conscious leadership.',
      },
    ],
  },
  pathway: {
    heading: 'Two pathways, one journey.',
    phases: [
      {
        tag: 'Phase One',
        title: '100-Hour Residential Immersion',
        place: 'House of Shakti · Costa Rica',
        formatLabel: 'In person',
        body: 'Your journey begins with a 100-hour residential immersion — daily practice, philosophy, and embodiment held in the jungle above Playa Hermosa. On completion you receive a 100-Hour Certificate of Completion.',
      },
      {
        tag: 'Phase Two',
        title: '100-Hour Online Training',
        place: 'Optional · From anywhere in the world',
        formatLabel: 'Online',
        body: 'For those who wish to continue, the experience extends through an in-depth online curriculum designed for integration and professional development — allowing you to study from anywhere in the world.',
      },
    ],
    rytBefore: 'Complete both phases to receive your ',
    rytHighlight: 'Yoga Alliance Registered 200-Hour Yoga Teacher Training Certificate (RYT 200)',
    rytAfter:
      ' — one of the world’s most widely recognized yoga teaching credentials, recognized internationally.',
  },
  curriculum: {
    heading: 'Six modules. 100 hours of embodied study.',
    sub: 'Open any module to see what it covers.',
    modules: [
      {
        title: 'The Tantric View',
        focus: 'Philosophy & Worldview',
        hours: '15 hrs',
        points: [
          'What Tantra is — dispelling myths, entering the real tradition',
          'Kashmir Shaivism & non-dual philosophy',
          'Spanda — the divine pulse; Shakti & Shiva, the cosmic polarity within the body',
          'The Tattvas — 36 elements of reality; karma, dharma & the awakened life',
        ],
      },
      {
        title: 'The Living Body',
        focus: 'Embodied Anatomy & Tantric Physiology',
        hours: '20 hrs',
        points: [
          'The koshas through a Tantric lens',
          'Prana, nadis & the subtle body',
          'The chakra system — beyond the basics',
          'Kundalini — theory, signs of awakening, safe facilitation; somatic awareness',
        ],
      },
      {
        title: 'Sacred Current Practices',
        focus: 'Advanced Asana & Movement',
        hours: '35 hrs',
        points: [
          'Asana as ritual — moving with intention',
          'Advanced sequencing through a Tantric arc',
          'Working with polarity in the body',
          'Adjustment & touch as sacred transmission',
        ],
      },
      {
        title: 'Breath as Gateway',
        focus: 'Pranayama & Breathwork',
        hours: '15 hrs',
        points: [
          'Classical pranayama — nadi shodhana, kapalabhati, bhastrika',
          'Tantric breathwork — breath as Shakti activation',
          'Circular breathing & altered states',
          'Facilitating breathwork for groups — safety & holding space',
        ],
      },
      {
        title: 'Sound, Mantra & Meditation',
        focus: 'Inner Technologies',
        hours: '5 hrs',
        points: [
          'Mantra as vibrational medicine — bija mantras, seed sounds',
          'Nada yoga — the yoga of sacred sound',
          'Tantric meditation — pratyahara, dharana, dhyana',
          'Guided visualization & inner journeying',
        ],
      },
      {
        title: 'The Awakened Teacher',
        focus: 'Holding Sacred Space',
        hours: '10 hrs',
        points: [
          'Ethics of teaching advanced & devotional practices',
          'Trauma-informed facilitation in Tantric contexts',
          'Designing rituals & ceremonial openings/closings',
          'Building your offering — retreats, intensives, immersions',
        ],
      },
    ],
  },
  testimonial: {
    quote:
      'Nancy is exceptional and by far one of the best yoga teacher we have gotten to experience globally. Whether it is her practice, her approach, the flow and diversity of the classes, or with how much details she was able to guide us in our practice, it was a truly profound experience to meet her and join her over her classes.',
    author: 'Sacha Revillard',
  },
  included: {
    heading: 'The 100 Hours Costa Rica Immersion includes.',
    items: [
      'Accommodation at House of Shakti',
      'Two nourishing meals daily (brunch & dinner)',
      'Full 100-Hour Yoga Teacher Training',
      'Daily yoga, meditation & embodiment practices',
      'Two breathwork journeys',
      'Sauna & ice bath experiences',
      'Boat tour',
      'Comprehensive training manual',
      'Certificate of Completion (100 hours)',
      'Connection with nature & conscious community',
    ],
    notHeading: 'Not included.',
    notItems: [
      'International airfare',
      'Airport transportation',
      'Travel insurance',
      'Additional beverages',
      'Personal expenses',
      'Optional excursions',
    ],
    note: 'Vegetarian meals are included, and most dietary requirements can be accommodated with advance notice.',
  },
  rhythm: {
    heading: 'Your Daily Schedule',
    eyebrow: 'Monday to Saturday',
    blocks: [
      {
        time: '8:00 AM – 11:30 AM',
        title: 'Morning Practice',
        detail: 'Breathwork · Tantra Vinyasa · Meditation',
      },
      { time: '11:30 AM', title: 'Brunch & noble silence', detail: '' },
      {
        time: '2:00 PM – 6:00 PM',
        title: 'Asana Lab & teaching methodology',
        detail: 'Lectures · Workshops · Embodiment practices',
      },
      { time: '6:00 PM', title: 'Dinner & Satsang', detail: '' },
      {
        time: '7:30 PM',
        title: 'Evening Integration',
        detail: 'Sauna & Ice Bath · Ritual · Group Reflection around fire pit',
      },
    ],
    footnote: '*2nd & 3rd Sundays — free day to play!',
    trackAria: 'Moments from the daily rhythm',
  },
  teachers: {
    heading: 'Meet your teachers',
    bios: [
      [
        'Nancy brings together years of experience in yoga, embodiment practices, nervous system regulation, conscious leadership, and transformational retreat facilitation.',
        'Her teaching style is compassionate, authentic, and deeply experiential, weaving the timeless wisdom of Tantra with modern somatic approaches. She believes yoga is not simply something we practice — it is a way of living.',
      ],
      [
        'Nayla is an internationally certified breath and mindfulness coach, Yoga Alliance–certified teacher, and motivational speaker with 2,500+ hours of training.',
        'She studied in India for many months among Himalayan masters and other world-renowned teachers. A survivor of a near-death experience, she now teaches on breath, mindfulness, and resilience.',
      ],
    ],
  },
  sanctuary: {
    heading: 'House of Shakti Yoga Sanctuary',
    body: 'Where the jungle meets beach, and ancient wisdom meets modern comfort. We are located in Santa Teresa, Costa Rica, just 7 minutes from the beach in Playa Hermosa.',
    trackAria: 'The sanctuary at House of Shakti',
  },
  whoFor: {
    heading: 'Who Is This Training For?',
    intro: 'This immersion is designed for:',
    audience: [
      {
        lead: 'Aspiring yoga teachers',
        detail: 'who want to begin sharing and teaching the practice',
      },
      {
        lead: 'Yoga teachers',
        detail: 'looking to deepen their knowledge and refine their teaching skills',
      },
      {
        lead: 'Dedicated yoga practitioners',
        detail: 'ready to take their practice to a deeper level',
      },
      {
        lead: 'Retreat facilitators, coaches, therapists, and wellness professionals',
        detail: 'looking to integrate embodied practices into their work',
      },
      {
        lead: 'Anyone',
        detail:
          'interested in developing a more conscious, embodied, and connected relationship with themselves and others',
      },
    ],
    closing: 'No previous teaching experience is required.',
  },
  pricing: {
    heading: 'Costa Rica Immersion — 100 hours.',
    tiers: [
      {
        tag: 'Early Bird · August',
        price: 'USD $4,015',
        detail: 'Private room · 100-Hour Costa Rica immersion',
      },
      {
        tag: 'Regular',
        price: 'USD $4,340',
        detail: 'Private room · 100-Hour Costa Rica immersion',
      },
      {
        tag: 'Training Only',
        price: 'USD $2,620',
        detail: 'Training + 1 meal · without accommodation',
      },
    ],
    onlineLine:
      'Optional 100-Hour online program — pricing and schedule available upon request. Please contact us for available payment options.',
    requestCta: 'Request pricing & dates',
    paymentHeading: 'Payment Schedule',
    schedule: [
      'A Non-refundable deposit of $500 is required to hold your space (once accepted into program).',
      '½ Tuition Investment must be paid within 30 days of acceptance. (Unless special payment arrangements were made).',
      'Full tuition must be paid by November 21, 2026.',
      'Cancellation Policy: The deposit of $500 is non-refundable once accepted, but may be used for future trainings or retreats.',
      '75% of the remaining amount will be refunded up until 30 days before the course starts. No refunds given under any circumstances after the commencement of the course.',
    ],
    invitation: 'Self-Love investment is within your reach',
    applyCta: 'Apply now',
    closing: 'Hold your space now with a $500 deposit',
  },
  outcomes: {
    heading: 'By the End of This Journey You Will…',
    items: [
      'Develop a deep understanding of Tantra as a living philosophy.',
      'Build a sustainable and meaningful personal practice.',
      'Learn to regulate your nervous system through embodied practices.',
      'Cultivate confidence in guiding yoga classes and transformational experiences.',
      'Deepen your relationship with breath, movement, and meditation.',
      'Strengthen your authentic voice and leadership.',
      'Experience greater presence, resilience, and self-awareness.',
      'Join a global community of practitioners and teachers.',
      'Receive your internationally recognized Yoga Alliance certification upon completion of both phases.',
    ],
  },
  closing: {
    heading: 'Join Us in Costa Rica For An Unforgettable Experience',
    body: 'We invite you to push the boundaries of your capacities, summon the compassion, courage and confidence of your inner teacher and step wildly into the light-hearted expression of your own authentic voice – your most valuable gift to share with the world.',
    cta: 'Begin your training',
  },
  faq: {
    heading: 'Everything you might be wondering.',
    items: [
      {
        q: 'Do I need to be an experienced yogi?',
        a: 'No. This training is open to anyone with a sincere interest in deepening their practice. A consistent personal practice and an open mind are all that’s required — no previous teaching experience is needed.',
      },
      {
        q: 'Is this training only for future teachers?',
        a: 'Not at all. Many participants join to deepen their personal practice, cultivate self-awareness, and integrate yoga more fully into their lives. It welcomes aspiring teachers, dedicated practitioners, retreat facilitators, coaches, therapists, and anyone seeking a more embodied, conscious way of living.',
      },
      {
        q: 'Will I receive a certificate?',
        a: 'Yes. After completing the Costa Rica immersion you receive a 100-Hour Certificate of Completion. Students who complete the additional 100-hour online program receive a Yoga Alliance Registered 200-Hour Yoga Teacher Training Certificate (RYT 200).',
      },
      {
        q: 'Is the certification recognized internationally?',
        a: 'Yes. Upon successful completion of both phases, graduates are eligible to register with Yoga Alliance as RYT 200 — one of the world’s most widely recognized yoga teaching credentials.',
      },
      {
        q: 'What airport should I fly into?',
        a: 'Juan Santamaría International Airport (SJO), Costa Rica. Detailed travel information will be provided after registration.',
      },
      {
        q: 'Can dietary requirements be accommodated?',
        a: 'Yes. Vegetarian meals are included, and most dietary requirements can be accommodated with advance notice.',
      },
    ],
  },
  footer: {
    tagline: 'A sanctuary in the canopy of Costa Rica.',
    visit: 'Visit',
    connect: 'Connect',
    maps: 'View on Google Maps',
    enquire: 'Enquire about the training',
    rights: 'All rights reserved.',
  },
  whatsapp: {
    aria: 'Any questions? Chat with us on WhatsApp',
    q: 'Any questions?',
    cta: 'Chat with us.',
    // Written as the visitor, not as the brand — this is the draft that appears
    // in their message box, so it has to sound like something a person would
    // actually send. Named in full, because Nancy runs more than one offering
    // and "the training" would make her guess.
    message:
      'Hi! I’d like to know more about The Awakened Body — Tantra Yoga Teacher Training at House of Shakti.',
    // The pricing section's own button asks a narrower question, and arriving
    // with the general message would waste the first exchange establishing
    // which programme is meant.
    messagePricing:
      'Hi! I’d like to know the pricing and dates for the optional 100-hour online program of The Awakened Body Teacher Training at House of Shakti.',
  },
  arrows: {
    prev: 'Previous',
    next: 'Next',
  },
};

export type YttDictionary = typeof en;

const es: YttDictionary = {
  nav: {
    menu: 'Menú',
    apply: 'Reserva tu lugar',
    items: ['La formación', 'Plan de estudios', 'Tus maestras', 'Inversión', 'Preguntas'],
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    drawerLabel: 'Navegación de la página',
    langLabel: 'Idioma',
  },
  hero: {
    location: 'Santa Teresa, Costa Rica',
    dates: '21 de noviembre – 4 de diciembre, 2026',
    title: 'The Awakened Body: Formación de Profesores de Tantra Yoga',
    subtitle:
      'Una inmersión de 100 horas, con un programa online opcional de 100 horas, que conduce a una Formación de Profesores de Yoga de 200 horas registrada en Yoga Alliance — guiada por Nancy Goodfellow.',
    cta: 'Reserva tu lugar',
  },
  intro: {
    headline:
      'Encarna la sabiduría del Tantra — el yoga como camino de presencia, sanación y vida consciente.',
    paragraphs: [
      'Esta formación va mucho más allá de la práctica física del yoga. A través del movimiento, el breathwork, la meditación, la filosofía del Tantra, el ritual, la regulación del sistema nervioso, la conciencia somática y la conexión auténtica, explorarás el yoga como una práctica viva que transforma tu manera de relacionarte contigo y con el mundo.',
      'En medio de la exuberante belleza tropical de Costa Rica, esta experiencia inmersiva ofrece el equilibrio perfecto entre estudio disciplinado, práctica encarnada, vida en comunidad y descanso profundo.',
      'Ya sea que tu intención sea enseñar yoga o simplemente profundizar tu práctica personal, esta formación ofrece un camino sólido, integrador y centrado en el corazón hacia una vida encarnada.',
    ],
    trackAria: 'Escenas de la formación',
  },
  different: {
    heading: 'Más que una formación tradicional de profesores.',
    sub: 'En lugar de centrarse únicamente en posturas y secuencias, esta inmersión explora el yoga como un camino completo de vida encarnada. Aquí aprenderás a:',
    cards: [
      {
        title: 'Presencia sobre rendimiento',
        body: 'Moverte desde la presencia, no desde el rendimiento.',
      },
      {
        title: 'Enseñar desde la experiencia',
        body: 'Enseñar desde la experiencia vivida, no desde la memorización.',
      },
      {
        title: 'Cuerpo, respiración y sistema nervioso',
        body: 'Cultivar una relación con tu cuerpo, tu respiración y tu sistema nervioso que sostenga una transformación duradera.',
      },
      {
        title: 'Sabiduría ancestral, práctica moderna',
        body: 'Tender un puente entre la sabiduría del Tantra, las prácticas somáticas modernas y el liderazgo consciente.',
      },
    ],
  },
  pathway: {
    heading: 'Dos caminos, un mismo viaje.',
    phases: [
      {
        tag: 'Fase uno',
        title: 'Inmersión residencial de 100 horas',
        place: 'House of Shakti · Costa Rica',
        formatLabel: 'Presencial',
        body: 'Tu viaje comienza con una inmersión residencial de 100 horas: práctica diaria, filosofía y encarnación en la selva sobre Playa Hermosa. Al completarla recibes un Certificado de 100 Horas.',
      },
      {
        tag: 'Fase dos',
        title: 'Formación online de 100 horas',
        place: 'Opcional · Desde cualquier parte del mundo',
        formatLabel: 'Online',
        body: 'Para quienes deseen continuar, la experiencia se extiende con un plan de estudios online en profundidad, diseñado para la integración y el desarrollo profesional — estudiando desde cualquier parte del mundo.',
      },
    ],
    rytBefore: 'Completa ambas fases para recibir tu ',
    rytHighlight:
      'Certificado de Formación de Profesores de Yoga de 200 Horas registrado en Yoga Alliance (RYT 200)',
    rytAfter:
      ' — una de las credenciales de enseñanza de yoga más reconocidas del mundo, con validez internacional.',
  },
  curriculum: {
    heading: 'Seis módulos. 100 horas de estudio encarnado.',
    sub: 'Abre cualquier módulo para ver qué incluye.',
    modules: [
      {
        title: 'La visión tántrica',
        focus: 'Filosofía y cosmovisión',
        hours: '15 h',
        points: [
          'Qué es el Tantra: disipar mitos, entrar en la tradición real',
          'Shivaísmo de Cachemira y filosofía no dual',
          'Spanda, el pulso divino; Shakti y Shiva, la polaridad cósmica dentro del cuerpo',
          'Los tattvas: los 36 elementos de la realidad; karma, dharma y la vida despierta',
        ],
      },
      {
        title: 'El cuerpo vivo',
        focus: 'Anatomía encarnada y fisiología tántrica',
        hours: '20 h',
        points: [
          'Los koshas desde una mirada tántrica',
          'Prana, nadis y el cuerpo sutil',
          'El sistema de chakras, más allá de lo básico',
          'Kundalini: teoría, señales de despertar, facilitación segura; conciencia somática',
        ],
      },
      {
        title: 'Prácticas de la corriente sagrada',
        focus: 'Asana avanzada y movimiento',
        hours: '35 h',
        points: [
          'El asana como ritual: moverse con intención',
          'Secuenciación avanzada a través de un arco tántrico',
          'Trabajo con la polaridad en el cuerpo',
          'Ajuste y contacto como transmisión sagrada',
        ],
      },
      {
        title: 'La respiración como portal',
        focus: 'Pranayama y breathwork',
        hours: '15 h',
        points: [
          'Pranayama clásico: nadi shodhana, kapalabhati, bhastrika',
          'Breathwork tántrico: la respiración como activación de Shakti',
          'Respiración circular y estados ampliados de conciencia',
          'Facilitar breathwork en grupo: seguridad y sostén del espacio',
        ],
      },
      {
        title: 'Sonido, mantra y meditación',
        focus: 'Tecnologías internas',
        hours: '5 h',
        points: [
          'El mantra como medicina vibracional: bija mantras, sonidos semilla',
          'Nada yoga: el yoga del sonido sagrado',
          'Meditación tántrica: pratyahara, dharana, dhyana',
          'Visualización guiada y viajes internos',
        ],
      },
      {
        title: 'La enseñanza despierta',
        focus: 'Sostener el espacio sagrado',
        hours: '10 h',
        points: [
          'Ética al enseñar prácticas avanzadas y devocionales',
          'Facilitación informada en trauma en contextos tántricos',
          'Diseño de rituales y aperturas y cierres ceremoniales',
          'Construir tu propuesta: retiros, intensivos, inmersiones',
        ],
      },
    ],
  },
  testimonial: {
    quote:
      'Nancy es excepcional y, por lejos, una de las mejores profesoras de yoga que hemos tenido la oportunidad de conocer en el mundo. Ya sea por su práctica, su enfoque, la fluidez y diversidad de sus clases, o por el nivel de detalle con el que supo guiar nuestra práctica, conocerla y practicar con ella fue una experiencia profundamente transformadora.',
    author: 'Sacha Revillard',
  },
  included: {
    heading: 'La inmersión de 100 horas en Costa Rica incluye.',
    items: [
      'Alojamiento en House of Shakti',
      'Dos comidas nutritivas al día (brunch y cena)',
      'Formación completa de 100 horas',
      'Yoga, meditación y prácticas de encarnación a diario',
      'Dos viajes de breathwork',
      'Experiencias de sauna y baño de hielo',
      'Paseo en barco',
      'Manual completo de la formación',
      'Certificado de finalización (100 horas)',
      'Conexión con la naturaleza y comunidad consciente',
    ],
    notHeading: 'No incluye.',
    notItems: [
      'Vuelos internacionales',
      'Traslados al aeropuerto',
      'Seguro de viaje',
      'Bebidas adicionales',
      'Gastos personales',
      'Excursiones opcionales',
    ],
    note: 'Las comidas son vegetarianas, y la mayoría de los requerimientos alimentarios pueden acomodarse avisando con anticipación.',
  },
  rhythm: {
    heading: 'Tu día a día',
    eyebrow: 'De lunes a sábado',
    blocks: [
      {
        time: '8:00 AM – 11:30 AM',
        title: 'Práctica de la mañana',
        detail: 'Breathwork · Tantra Vinyasa · Meditación',
      },
      { time: '11:30 AM', title: 'Brunch y silencio noble', detail: '' },
      {
        time: '2:00 PM – 6:00 PM',
        title: 'Laboratorio de asana y metodología de enseñanza',
        detail: 'Clases teóricas · Talleres · Prácticas de encarnación',
      },
      { time: '6:00 PM', title: 'Cena y satsang', detail: '' },
      {
        time: '7:30 PM',
        title: 'Integración de la noche',
        detail: 'Sauna y baño de hielo · Ritual · Reflexión grupal alrededor del fuego',
      },
    ],
    footnote: '*2.º y 3.er domingo: ¡día libre para disfrutar!',
    trackAria: 'Momentos del ritmo diario',
  },
  teachers: {
    heading: 'Conoce a tus maestras',
    bios: [
      [
        'Nancy reúne años de experiencia en yoga, prácticas de encarnación, regulación del sistema nervioso, liderazgo consciente y facilitación de retiros transformacionales.',
        'Su estilo de enseñanza es compasivo, auténtico y profundamente vivencial, entretejiendo la sabiduría atemporal del Tantra con enfoques somáticos modernos. Cree que el yoga no es simplemente algo que practicamos: es una forma de vivir.',
      ],
      [
        'Nayla es coach internacional certificada en respiración y mindfulness, profesora certificada por Yoga Alliance y oradora motivacional con más de 2,500 horas de formación.',
        'Estudió en la India durante muchos meses junto a maestros del Himalaya y otros referentes de renombre mundial. Sobreviviente de una experiencia cercana a la muerte, hoy enseña sobre respiración, mindfulness y resiliencia.',
      ],
    ],
  },
  sanctuary: {
    heading: 'House of Shakti Yoga Sanctuary',
    body: 'Donde la selva se encuentra con el mar y la sabiduría ancestral con el confort moderno. Estamos en Santa Teresa, Costa Rica, a solo 7 minutos de la playa en Playa Hermosa.',
    trackAria: 'El santuario de House of Shakti',
  },
  whoFor: {
    heading: '¿Para quién es esta formación?',
    intro: 'Esta inmersión está diseñada para:',
    audience: [
      {
        lead: 'Futuros profesores de yoga',
        detail: 'que quieren comenzar a compartir y enseñar la práctica',
      },
      {
        lead: 'Profesores de yoga',
        detail: 'que buscan profundizar sus conocimientos y refinar su forma de enseñar',
      },
      {
        lead: 'Practicantes comprometidos',
        detail: 'listos para llevar su práctica a un nivel más profundo',
      },
      {
        lead: 'Facilitadores de retiros, coaches, terapeutas y profesionales del bienestar',
        detail: 'que desean integrar prácticas encarnadas en su trabajo',
      },
      {
        lead: 'Cualquier persona',
        detail:
          'interesada en desarrollar una relación más consciente, encarnada y conectada consigo misma y con los demás',
      },
    ],
    closing: 'No se requiere experiencia previa enseñando.',
  },
  pricing: {
    heading: 'Inmersión en Costa Rica — 100 horas.',
    tiers: [
      {
        tag: 'Precio anticipado · Agosto',
        price: 'USD $4,015',
        detail: 'Habitación privada · Inmersión de 100 horas en Costa Rica',
      },
      {
        tag: 'Regular',
        price: 'USD $4,340',
        detail: 'Habitación privada · Inmersión de 100 horas en Costa Rica',
      },
      {
        tag: 'Solo formación',
        price: 'USD $2,620',
        detail: 'Formación + 1 comida · sin alojamiento',
      },
    ],
    onlineLine:
      'Programa online opcional de 100 horas: precios y fechas disponibles a pedido. Contáctanos para conocer las opciones de pago.',
    requestCta: 'Consultar precios y fechas',
    paymentHeading: 'Plan de pagos',
    schedule: [
      'Se requiere un depósito no reembolsable de $500 para asegurar tu lugar (una vez aceptada tu postulación).',
      'La mitad de la inversión debe abonarse dentro de los 30 días posteriores a la aceptación (salvo acuerdos de pago especiales).',
      'El total debe estar abonado para el 21 de noviembre de 2026.',
      'Política de cancelación: el depósito de $500 no es reembolsable una vez aceptada la postulación, pero puede usarse para futuras formaciones o retiros.',
      'Se reembolsará el 75% del monto restante hasta 30 días antes del inicio. No se realizan reembolsos bajo ninguna circunstancia una vez comenzado el curso.',
    ],
    invitation: 'Invertir en ti está a tu alcance',
    applyCta: 'Postúlate ahora',
    closing: 'Asegura tu lugar con un depósito de $500',
  },
  outcomes: {
    heading: 'Al final de este viaje vas a…',
    items: [
      'Desarrollar una comprensión profunda del Tantra como filosofía viva.',
      'Construir una práctica personal sostenible y con sentido.',
      'Aprender a regular tu sistema nervioso a través de prácticas encarnadas.',
      'Cultivar confianza para guiar clases de yoga y experiencias transformacionales.',
      'Profundizar tu relación con la respiración, el movimiento y la meditación.',
      'Fortalecer tu voz auténtica y tu liderazgo.',
      'Experimentar mayor presencia, resiliencia y autoconocimiento.',
      'Unirte a una comunidad global de practicantes y profesores.',
      'Recibir tu certificación de Yoga Alliance, reconocida internacionalmente, al completar ambas fases.',
    ],
  },
  closing: {
    heading: 'Acompáñanos en Costa Rica en una experiencia inolvidable',
    body: 'Te invitamos a expandir los límites de tus capacidades, convocar la compasión, el coraje y la confianza de tu maestro interior, y dar un salto hacia la expresión libre y luminosa de tu propia voz auténtica: el regalo más valioso que tienes para compartir con el mundo.',
    cta: 'Comienza tu formación',
  },
  faq: {
    heading: 'Todo lo que te puedes estar preguntando.',
    items: [
      {
        q: '¿Necesito tener experiencia en yoga?',
        a: 'No. Esta formación está abierta a cualquier persona con un interés sincero en profundizar su práctica. Una práctica personal constante y una mente abierta son todo lo que se necesita; no se requiere experiencia previa enseñando.',
      },
      {
        q: '¿Esta formación es solo para futuros profesores?',
        a: 'Para nada. Muchas personas participan para profundizar su práctica personal, cultivar el autoconocimiento e integrar el yoga más plenamente en su vida. Recibe a futuros profesores, practicantes comprometidos, facilitadores de retiros, coaches, terapeutas y a cualquiera que busque una forma de vivir más consciente y encarnada.',
      },
      {
        q: '¿Recibiré un certificado?',
        a: 'Sí. Al completar la inmersión en Costa Rica recibes un Certificado de 100 Horas. Quienes completan además el programa online de 100 horas reciben el Certificado de Formación de Profesores de Yoga de 200 Horas registrado en Yoga Alliance (RYT 200).',
      },
      {
        q: '¿La certificación tiene validez internacional?',
        a: 'Sí. Al completar con éxito ambas fases, puedes registrarte en Yoga Alliance como RYT 200, una de las credenciales de enseñanza de yoga más reconocidas del mundo.',
      },
      {
        q: '¿A qué aeropuerto debo volar?',
        a: 'Al Aeropuerto Internacional Juan Santamaría (SJO), Costa Rica. Recibirás información detallada de viaje después de registrarte.',
      },
      {
        q: '¿Pueden adaptarse a requerimientos alimentarios?',
        a: 'Sí. Las comidas son vegetarianas, y la mayoría de los requerimientos alimentarios pueden acomodarse avisando con anticipación.',
      },
    ],
  },
  footer: {
    tagline: 'Un santuario entre las copas de Costa Rica.',
    visit: 'Visítanos',
    connect: 'Conecta',
    maps: 'Ver en Google Maps',
    enquire: 'Consulta por la formación',
    rights: 'Todos los derechos reservados.',
  },
  whatsapp: {
    aria: '¿Tienes preguntas? Escríbenos por WhatsApp',
    q: '¿Tienes preguntas?',
    cta: 'Escríbenos.',
    message:
      '¡Hola! Me gustaría saber más sobre The Awakened Body, la Formación de Profesores de Tantra Yoga en House of Shakti.',
    messagePricing:
      '¡Hola! Me gustaría conocer los precios y las fechas del programa online opcional de 100 horas de la Formación The Awakened Body en House of Shakti.',
  },
  arrows: {
    prev: 'Anterior',
    next: 'Siguiente',
  },
};

export const YTT_DICTIONARIES: Record<Lang, YttDictionary> = { en, es };
