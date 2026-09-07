// ─── Shakti Experience — copy, in both languages ─────────────────────────────
// Same contract as lib/i18n-ytt.ts, for the same reason: this page is mostly
// prose, one key per section, and `tr()` would drown it. English is the
// source of truth and the default; Spanish is a considered translation in
// neutral Latin-American tuteo, the register the training's dictionary set.
// Brand names stay as they are — Shakti Experience, Full Reset, Refresh,
// Your Own Way, House of Shakti — and breathwork keeps its English, as the
// Spanish-speaking wellness world does.
//
// `en` defines the shape; `es` must satisfy it, so a missing translation is a
// type error, not a silently English paragraph.

import type { Lang } from '@/lib/i18n';

const en = {
  hero: {
    title: 'Shakti Experience',
    subtitle: 'An invitation to return to the place that has always been yours: the body.',
    cta: 'Reserve your place',
  },
  intro: {
    headline: 'Shakti is the energy of life, movement and transformation.',
    paragraphs: [
      'It lives in nature, in the body, in creativity, and in our capacity to feel and enjoy.',
      'This retreat is an invitation to slow down, rest, breathe and reconnect with yourself away from the noise and demands of everyday life.',
      'A space to relax, nourish the body, enjoy nature, move gently, and simply give yourself permission to pause.',
    ],
    trackAria: 'Scenes from the Shakti Experience',
  },
  moreThanAStay: {
    heading: 'More than a stay.',
    intro: 'Everything you need to slow down, recharge and feel good.',
    trackAria: 'What the Shakti Experience holds',
    items: [
      {
        slug: 'yoga',
        title: 'Yoga',
        description:
          'Yoga classes designed to create space in the body and support overall well-being, adapted to each participant’s level and intentions.',
      },
      {
        slug: 'breathwork',
        title: 'Breathwork',
        description: 'Guided breathing practices to release tension and create space to relax.',
      },
      {
        slug: 'sauna-icebath',
        title: 'Sauna & Ice Bath',
        description: 'A restorative hot-and-cold experience to refresh your body and senses.',
      },
      {
        slug: 'sound-healing',
        title: 'Sound Healing',
        description: 'Relax into soothing sounds and vibrations.',
      },
      {
        slug: 'massage',
        title: 'Massage',
        description:
          'Restorative massages offered by specialized therapists for deep relaxation and renewal.',
      },
      {
        slug: 'nourishing-food',
        title: 'Nourishing Food',
        description:
          'Breakfast included. Fresh, wholesome meals made to nourish and energize you.',
      },
      {
        slug: 'time-in-nature',
        title: 'Time in Nature',
        description: 'Space to enjoy the beauty, sounds and rhythms of Costa Rica.',
      },
      {
        slug: 'time-to-rest',
        title: 'Time to Rest',
        description: 'Unstructured time to slow down, do less and simply enjoy being.',
      },
      {
        slug: 'nature-experience',
        title: 'Nature Experience',
        description:
          'Waterfall hikes through Costa Rica’s lush landscapes, boat trips for dolphin and whale watching or snorkeling in crystal-clear waters, horseback riding and surf lessons.',
      },
      {
        slug: 'support',
        title: 'Support from the House of Shakti team',
        description: 'We’re here to make your stay feel easy, comfortable and cared for.',
      },
      {
        slug: 'welcome-gift',
        title: 'Welcome Gift',
        description: 'A little something to make you feel at home from the moment you arrive.',
      },
    ],
  },
  testimonial: {
    quote:
      'In July, my best friend and I attended the Shakti Experience at House of Shakti. It was a magical week spent at the house, filled with yoga, surf, breathwork and sound healing. The house is conveniently located 10 min from the beach and 15 min to the main town. Waking up to the sounds of the birds and monkeys every morning was such a treat. Nancy is an amazing teacher, I am so grateful to have found her and her oasis. Couldn’t recommend this place more!',
    author: 'Guest review',
    role: 'Shakti Experience · July',
  },
  whoFor: {
    heading: 'This experience is for you if…',
    audience: [
      {
        lead: 'You’ve been feeling disconnected from your body',
        detail: 'and want to slow down and reconnect.',
      },
      {
        lead: 'You’ve been moving through life on autopilot',
        detail: 'and need space to rest and reset.',
      },
      {
        lead: 'You’re craving a safe, peaceful environment',
        detail: 'away from the noise and demands of everyday life.',
      },
      {
        lead: 'You want to reconnect with your body',
        detail: 'through gentle, nourishing yoga practices.',
      },
      {
        lead: 'You simply feel the need to pause',
        detail: 'to breathe, and to take care of yourself.',
      },
    ],
    closing:
      'No previous yoga experience is needed — the classes suit every level, beginners included.',
  },
  pricing: {
    heading: 'Choose your experience.',
    includesLabel: 'Includes',
    tiers: [
      {
        tag: '01 · Full Reset',
        duration: '7 days · 6 nights',
        price: 'From USD 1,400',
        body: 'A full week to step away from your routine and immerse yourself in the House of Shakti experience. A balanced combination of movement, wellness, nature, nourishing food, and time for yourself. The most complete way to experience Shakti.',
        includes: [
          'Accommodation',
          'Daily breakfast',
          'Yoga classes',
          'Sauna & ice bath',
          'Breathwork session',
          'Massage',
          'Nature experience',
          'Welcome gift',
        ],
      },
      {
        tag: '02 · Refresh',
        duration: '5 days · 4 nights',
        price: 'From USD 950',
        body: 'A few days to reset your rhythm, recharge your energy and enjoy a change of scenery. A balanced experience with movement, relaxation, nourishing mornings, and plenty of space to enjoy yourself. A little time away to feel refreshed.',
        includes: [
          'Accommodation',
          'Daily breakfast',
          'Yoga classes',
          'Sauna & ice bath',
          'Massage',
          'Welcome gift',
        ],
      },
      {
        tag: '03 · Your Own Way',
        duration: 'Custom experience',
        price: 'Make it yours.',
        body: 'Choose how long you stay and which experiences you want to include — from yoga and breathwork to massage, sound healing, sauna & ice bath, or a guided nature experience.',
        includes: [] as string[],
        extra:
          'One of our House of Shakti experts will help you create a personalized experience based on what you’re looking for.',
        closing: 'Designed around you, your needs, and your rhythm.',
        cta: 'Design my experience',
      },
    ],
    groupNote: 'We offer special rates for groups of two or more.',
    cta: 'Reserve your place',
  },
  day: {
    heading: 'What does your day look like?',
    eyebrow: 'Every day, at your own pace',
    blocks: [
      { time: '8:00 AM', title: 'Breakfast', detail: 'A fresh, nourishing start to the morning.' },
      { time: '10:00 AM', title: 'Yoga class', detail: 'Move, breathe, and ground your day.' },
      {
        time: 'Midday',
        title: 'Free time',
        detail: 'Explore, relax, enjoy the beach, or simply take some time for yourself.',
      },
      {
        time: '5:00 PM',
        title: 'Breathwork',
        detail: 'A guided practice to unwind into the evening — offered once during your stay.',
      },
      {
        time: '6:30 PM',
        title: 'Sauna & ice bath',
        detail: 'Hot and cold, to refresh your body and senses.',
      },
      {
        time: 'On request',
        title: 'Massage & nature experiences',
        detail: 'Scheduled around your preferences, arranged with our team during your stay.',
      },
      {
        time: 'Midday & evening',
        title: 'Lunch & dinner',
        detail:
          'A spacious shared kitchen to cook your own, and plenty of good places nearby if you’d rather eat out.',
      },
      {
        time: 'Getting around',
        title: 'Rent an ATV or a car',
        detail: 'For the freedom to explore the area at your own pace.',
      },
    ],
    footnote:
      'Our team of facilitators is with you throughout your stay, while the experience stays independent — you choose what to join and how to spend your time.',
    trackAria: 'Moments of a day at House of Shakti',
  },
  sanctuary: {
    heading: 'House of Shakti Yoga Sanctuary',
    body: 'Where the jungle meets beach, and ancient wisdom meets modern comfort. We are located in Santa Teresa, Costa Rica, just 7 minutes from the beach in Playa Hermosa.',
    trackAria: 'The sanctuary at House of Shakti',
  },
  closing: {
    heading: 'This season of your life can be about slowing down.',
    body: 'Resting, enjoying what you’ve created, and making space to simply be. Because sometimes, there is nothing to fix — just a little more space to rest, feel, and enjoy life.',
    cta: 'Reserve your place',
  },
  faq: {
    heading: 'Everything you might be wondering.',
    items: [
      {
        q: 'Is this a retreat?',
        a: 'No. This is a more independent experience designed to give you space to enjoy House of Shakti at your own pace. Our team will be here to support you, answer questions, and help you throughout your stay, but there is no single facilitator or teacher guiding the entire experience. You choose how you want to spend your time and which activities you’d like to join.',
      },
      {
        q: 'What is the difference between Full Reset and Refresh?',
        a: 'Full Reset is a 7-day, 6-night experience with a more complete selection of activities. Refresh is a shorter 5-day, 4-night experience, designed to enjoy the essentials of House of Shakti.',
      },
      {
        q: 'Can I customize my experience?',
        a: 'Absolutely. With Your Own Way, you can choose the length of your stay and the experiences you’d like to include. One of our House of Shakti experts will help you design a stay based on what you’re looking for.',
      },
      {
        q: 'Do I need previous yoga experience?',
        a: 'Not at all. Our classes are suitable for different levels, including beginners.',
      },
      {
        q: 'Do I have to participate in every activity?',
        a: 'Not at all. You are free to choose what feels right for you and enjoy the rest of your time at your own pace.',
      },
      {
        q: 'Can I come on my own?',
        a: 'Of course. The experience is ideal for solo travelers who want to enjoy some personal time while also having the option to connect through shared activities.',
      },
      {
        q: 'What should I bring?',
        a: 'Comfortable clothes for yoga, swimwear, sunscreen, insect repellent, and anything else you may need to enjoy your stay.',
      },
      {
        q: 'How do I book?',
        a: 'Send us an inquiry and our team will help you choose the experience that best suits you and guide you through the booking process.',
      },
    ],
  },
  whatsapp: {
    // Written as the visitor, not as the brand — this is the draft that
    // appears in their message box. Named in full: the house runs more than
    // one offering.
    message: 'Hi! I’d like to reserve my place at the Shakti Experience at House of Shakti.',
    // The custom card asks a different first question, so it opens with it.
    messageCustom:
      'Hi! I’d like to design my own Shakti Experience at House of Shakti. Could we talk about dates and what to include?',
  },
};

export type ShaktiDictionary = typeof en;

const es: ShaktiDictionary = {
  hero: {
    title: 'Shakti Experience',
    subtitle: 'Una invitación a volver al lugar que siempre ha sido tuyo: el cuerpo.',
    cta: 'Reserva tu lugar',
  },
  intro: {
    headline: 'Shakti es la energía de la vida, el movimiento y la transformación.',
    paragraphs: [
      'Vive en la naturaleza, en el cuerpo, en la creatividad y en nuestra capacidad de sentir y disfrutar.',
      'Este retiro es una invitación a bajar el ritmo, descansar, respirar y reconectar contigo, lejos del ruido y las exigencias de la vida cotidiana.',
      'Un espacio para relajarte, nutrir el cuerpo, disfrutar de la naturaleza, moverte con suavidad y, simplemente, darte permiso para hacer una pausa.',
    ],
    trackAria: 'Escenas de la Shakti Experience',
  },
  moreThanAStay: {
    heading: 'Más que una estadía.',
    intro: 'Todo lo que necesitas para bajar el ritmo, recargar energía y sentirte bien.',
    trackAria: 'Lo que incluye la Shakti Experience',
    items: [
      {
        slug: 'yoga',
        title: 'Yoga',
        description:
          'Clases de yoga diseñadas para crear espacio en el cuerpo y apoyar el bienestar general, adaptadas al nivel y a las intenciones de cada participante.',
      },
      {
        slug: 'breathwork',
        title: 'Breathwork',
        description:
          'Prácticas de respiración guiadas para liberar tensión y crear espacio para relajarte.',
      },
      {
        slug: 'sauna-icebath',
        title: 'Sauna y baño de hielo',
        description:
          'Una experiencia restauradora de calor y frío para refrescar el cuerpo y los sentidos.',
      },
      {
        slug: 'sound-healing',
        title: 'Sanación con sonido',
        description: 'Relájate entre sonidos y vibraciones que calman.',
      },
      {
        slug: 'massage',
        title: 'Masajes',
        description:
          'Masajes restauradores a cargo de terapeutas especializados, para una relajación y una renovación profundas.',
      },
      {
        slug: 'nourishing-food',
        title: 'Comida nutritiva',
        description:
          'Desayuno incluido. Comidas frescas y saludables, pensadas para nutrirte y darte energía.',
      },
      {
        slug: 'time-in-nature',
        title: 'Tiempo en la naturaleza',
        description: 'Espacio para disfrutar la belleza, los sonidos y los ritmos de Costa Rica.',
      },
      {
        slug: 'time-to-rest',
        title: 'Tiempo para descansar',
        description:
          'Tiempo sin estructura para bajar el ritmo, hacer menos y simplemente disfrutar de estar.',
      },
      {
        slug: 'nature-experience',
        title: 'Experiencia en la naturaleza',
        description:
          'Caminatas a cascadas entre los paisajes exuberantes de Costa Rica, paseos en bote para avistar delfines y ballenas o hacer snorkel en aguas cristalinas, cabalgatas y clases de surf.',
      },
      {
        slug: 'support',
        title: 'El acompañamiento del equipo de House of Shakti',
        description: 'Estamos aquí para que tu estadía se sienta fácil, cómoda y cuidada.',
      },
      {
        slug: 'welcome-gift',
        title: 'Regalo de bienvenida',
        description:
          'Un pequeño detalle para que te sientas en casa desde el momento en que llegas.',
      },
    ],
  },
  testimonial: {
    quote:
      'En julio, mi mejor amiga y yo participamos de la Shakti Experience en House of Shakti. Fue una semana mágica en la casa, llena de yoga, surf, breathwork y sanación con sonido. La casa está muy bien ubicada, a 10 minutos de la playa y a 15 del centro del pueblo. Despertar cada mañana con el sonido de los pájaros y los monos fue un regalo. Nancy es una profesora increíble; estoy muy agradecida de haberla encontrado a ella y a su oasis. ¡No podría recomendar más este lugar!',
    author: 'Reseña de una huésped',
    role: 'Shakti Experience · julio',
  },
  whoFor: {
    heading: 'Esta experiencia es para ti si…',
    audience: [
      {
        lead: 'Sientes que has perdido la conexión con tu cuerpo',
        detail: 'y quieres bajar el ritmo y volver a él.',
      },
      {
        lead: 'Vienes viviendo en piloto automático',
        detail: 'y necesitas espacio para descansar y reiniciar.',
      },
      {
        lead: 'Anhelas un entorno seguro y tranquilo',
        detail: 'lejos del ruido y las exigencias de la vida cotidiana.',
      },
      {
        lead: 'Quieres reconectar con tu cuerpo',
        detail: 'a través de prácticas de yoga suaves y nutritivas.',
      },
      {
        lead: 'Simplemente sientes la necesidad de hacer una pausa',
        detail: 'para respirar y cuidar de ti.',
      },
    ],
    closing:
      'No necesitas experiencia previa en yoga: las clases se adaptan a todos los niveles, incluidos principiantes.',
  },
  pricing: {
    heading: 'Elige tu experiencia.',
    includesLabel: 'Incluye',
    tiers: [
      {
        tag: '01 · Full Reset',
        duration: '7 días · 6 noches',
        price: 'Desde USD 1.400',
        body: 'Una semana completa para salir de la rutina y sumergirte en la experiencia House of Shakti. Una combinación equilibrada de movimiento, bienestar, naturaleza, comida nutritiva y tiempo para ti. La forma más completa de vivir Shakti.',
        includes: [
          'Alojamiento',
          'Desayuno diario',
          'Clases de yoga',
          'Sauna y baño de hielo',
          'Sesión de breathwork',
          'Masaje',
          'Experiencia en la naturaleza',
          'Regalo de bienvenida',
        ],
      },
      {
        tag: '02 · Refresh',
        duration: '5 días · 4 noches',
        price: 'Desde USD 950',
        body: 'Unos días para reiniciar tu ritmo, recargar energía y disfrutar de un cambio de aire. Una experiencia equilibrada con movimiento, relajación, mañanas nutritivas y mucho espacio para disfrutar. Un pequeño paréntesis para volver con la energía renovada.',
        includes: [
          'Alojamiento',
          'Desayuno diario',
          'Clases de yoga',
          'Sauna y baño de hielo',
          'Masaje',
          'Regalo de bienvenida',
        ],
      },
      {
        tag: '03 · Your Own Way',
        duration: 'Experiencia a medida',
        price: 'Hazla tuya.',
        body: 'Elige cuánto tiempo te quedas y qué experiencias quieres incluir: desde yoga y breathwork hasta masajes, sanación con sonido, sauna y baño de hielo o una experiencia guiada en la naturaleza.',
        includes: [],
        extra:
          'Una de nuestras expertas de House of Shakti te ayudará a crear una experiencia personalizada según lo que estés buscando.',
        closing: 'Diseñada alrededor de ti, de tus necesidades y de tu ritmo.',
        cta: 'Diseñar mi experiencia',
      },
    ],
    groupNote: 'Ofrecemos tarifas especiales para grupos de dos o más personas.',
    cta: 'Reserva tu lugar',
  },
  day: {
    heading: '¿Cómo es un día aquí?',
    eyebrow: 'Cada día, a tu ritmo',
    blocks: [
      { time: '8:00 AM', title: 'Desayuno', detail: 'Un comienzo fresco y nutritivo para la mañana.' },
      { time: '10:00 AM', title: 'Clase de yoga', detail: 'Moverte, respirar y aterrizar el día.' },
      {
        time: 'Mediodía',
        title: 'Tiempo libre',
        detail: 'Explora, descansa, disfruta de la playa o simplemente tómate un tiempo para ti.',
      },
      {
        time: '5:00 PM',
        title: 'Breathwork',
        detail:
          'Una práctica guiada para soltar y entrar en la noche; se ofrece una vez durante tu estadía.',
      },
      {
        time: '6:30 PM',
        title: 'Sauna y baño de hielo',
        detail: 'Calor y frío para refrescar el cuerpo y los sentidos.',
      },
      {
        time: 'A pedido',
        title: 'Masajes y experiencias en la naturaleza',
        detail: 'Se programan según tus preferencias, junto con nuestro equipo, durante tu estadía.',
      },
      {
        time: 'Mediodía y noche',
        title: 'Almuerzo y cena',
        detail:
          'Una amplia cocina compartida para preparar tus comidas, y muchos lugares cerca si prefieres salir a comer.',
      },
      {
        time: 'Para moverte',
        title: 'Alquila un cuatriciclo o un auto',
        detail: 'Para explorar la zona con libertad y a tu propio ritmo.',
      },
    ],
    footnote:
      'Nuestro equipo de facilitadores te acompaña durante toda la estadía, mientras la experiencia sigue siendo independiente: tú eliges en qué participar y cómo usar tu tiempo.',
    trackAria: 'Momentos de un día en House of Shakti',
  },
  sanctuary: {
    heading: 'House of Shakti Yoga Sanctuary',
    body: 'Donde la selva se encuentra con el mar y la sabiduría ancestral con el confort moderno. Estamos en Santa Teresa, Costa Rica, a solo 7 minutos de la playa en Playa Hermosa.',
    trackAria: 'El santuario de House of Shakti',
  },
  closing: {
    heading: 'Esta etapa de tu vida puede ser para bajar el ritmo.',
    body: 'Descansar, disfrutar de lo que has creado y hacer espacio para simplemente ser. Porque a veces no hay nada que arreglar: solo un poco más de espacio para descansar, sentir y disfrutar de la vida.',
    cta: 'Reserva tu lugar',
  },
  faq: {
    heading: 'Todo lo que te puedes estar preguntando.',
    items: [
      {
        q: '¿Es un retiro?',
        a: 'No. Es una experiencia más independiente, pensada para darte espacio para disfrutar de House of Shakti a tu propio ritmo. Nuestro equipo estará aquí para acompañarte, responder tus preguntas y ayudarte durante toda la estadía, pero no hay un único facilitador o profesor que guíe toda la experiencia. Tú eliges cómo usar tu tiempo y a qué actividades sumarte.',
      },
      {
        q: '¿Cuál es la diferencia entre Full Reset y Refresh?',
        a: 'Full Reset es una experiencia de 7 días y 6 noches, con una selección más completa de actividades. Refresh es una experiencia más corta, de 5 días y 4 noches, pensada para disfrutar lo esencial de House of Shakti.',
      },
      {
        q: '¿Puedo personalizar mi experiencia?',
        a: 'Por supuesto. Con Your Own Way eliges la duración de tu estadía y las experiencias que quieres incluir. Una de nuestras expertas de House of Shakti te ayudará a diseñar una estadía según lo que estés buscando.',
      },
      {
        q: '¿Necesito experiencia previa en yoga?',
        a: 'Para nada. Nuestras clases se adaptan a distintos niveles, incluidos principiantes.',
      },
      {
        q: '¿Tengo que participar en todas las actividades?',
        a: 'Para nada. Eres libre de elegir lo que sientas adecuado para ti y disfrutar el resto de tu tiempo a tu propio ritmo.',
      },
      {
        q: '¿Puedo venir por mi cuenta?',
        a: 'Claro que sí. La experiencia es ideal para quienes viajan en solitario y quieren disfrutar de tiempo personal, con la opción de conectar con otras personas en las actividades compartidas.',
      },
      {
        q: '¿Qué debo llevar?',
        a: 'Ropa cómoda para yoga, traje de baño, protector solar, repelente de insectos y todo lo que puedas necesitar para disfrutar de tu estadía.',
      },
      {
        q: '¿Cómo reservo?',
        a: 'Envíanos una consulta y nuestro equipo te ayudará a elegir la experiencia que mejor se adapte a ti y te guiará en el proceso de reserva.',
      },
    ],
  },
  whatsapp: {
    message: '¡Hola! Me gustaría reservar mi lugar en la Shakti Experience de House of Shakti.',
    messageCustom:
      '¡Hola! Me gustaría diseñar mi propia Shakti Experience en House of Shakti. ¿Podemos hablar de fechas y de qué incluir?',
  },
};

export const SHAKTI_DICTIONARIES: Record<Lang, ShaktiDictionary> = { en, es };
