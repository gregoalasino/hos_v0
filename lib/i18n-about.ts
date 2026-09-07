// ─── About — copy, in both languages ─────────────────────────────────────────
// The page is a letter: Nancy's own words about herself and about the house,
// in the third person, and the layout is built to read as one. Same contract
// as lib/i18n-ytt.ts — `en` defines the shape, `es` must satisfy it — and the
// same neutral Latin-American tuteo where the copy speaks to the reader.
// Proper nouns and lineages stay: House of Shakti, Shakti, Ashtanga Vinyasa,
// Yoga Alliance.

import type { Lang } from '@/lib/i18n';

const en = {
  opening: {
    place: 'Santa Teresa, Costa Rica',
    title: 'About House of Shakti',
    second: 'A few words on the house, and on the woman who built it.',
  },
  nancy: {
    numeral: 'I',
    eyebrow: 'The founder',
    // The margin, in short — what a reader skimming the letter should still
    // take away. Every line is a fact from the paragraphs beside it.
    notes: [
      'Practicing since 1992',
      'Ashtanga Vinyasa tradition',
      '750+ hours · Yoga Alliance',
      'Santa Teresa, Costa Rica',
    ],
    paragraphs: [
      'Nancy began her yoga journey in 1992 through the Ashtanga Vinyasa tradition. After years of practice and study, she moved to Costa Rica in search of a simpler life, closer to nature and to what truly matters.',
      'Since then, she has completed more than 750 hours of Yoga Alliance training and has explored different yoga traditions and approaches.',
      'But her deepest teachings have also come from life itself. After experiencing profound loss, yoga became for Nancy more than a practice — it became a way of meeting life with greater presence, compassion, courage, and joy.',
      'Today, she brings this understanding into the spaces she creates and teaches: grounded, authentic and deeply human.',
    ],
    pull: 'Grounded, authentic and deeply human.',
    photoAlt: 'Nancy Goodfellow, founder of House of Shakti',
  },
  house: {
    numeral: 'II',
    eyebrow: 'The house',
    notes: [
      'Santa Teresa, Costa Rica',
      'Away from mass tourism',
      'Yoga · Retreats · Trainings',
      'Presence · Authenticity · Community · Conscious living',
    ],
    paragraphs: [
      'House of Shakti was born from the same vision: creating a space where people can slow down, reconnect with their bodies, nature and themselves.',
      'Created in Costa Rica and intentionally away from mass tourism, House of Shakti offers an intimate environment for yoga, retreats, trainings and meaningful connection.',
      'Rooted in the values of presence, authenticity, community and conscious living, the space invites each person to step away from the noise and reconnect with what is essential.',
      'Inspired by Shakti — the creative and life-giving energy of the universe — House of Shakti exists around one simple question:',
    ],
    pull: 'How can we live — and feel — more alive?',
    photoAlt: 'The main house at House of Shakti, seen from the pool',
  },
  signature: {
    name: 'Nancy Goodfellow',
    role: 'Founder · House of Shakti',
    handle: '@wildheart.yogini',
  },
  closing: {
    heading: 'The rest is better felt than read.',
    links: [
      { label: 'Stay with us', href: '/stay-with-us' },
      { label: 'Explore the retreats', href: '/retreats' },
    ],
  },
};

export type AboutDictionary = typeof en;

const es: AboutDictionary = {
  opening: {
    place: 'Santa Teresa, Costa Rica',
    title: 'Sobre House of Shakti',
    second: 'Unas palabras sobre la casa, y sobre la mujer que la construyó.',
  },
  nancy: {
    numeral: 'I',
    eyebrow: 'La fundadora',
    notes: [
      'Practica desde 1992',
      'Tradición Ashtanga Vinyasa',
      '750+ horas · Yoga Alliance',
      'Santa Teresa, Costa Rica',
    ],
    paragraphs: [
      'Nancy comenzó su camino en el yoga en 1992, en la tradición Ashtanga Vinyasa. Tras años de práctica y estudio, se mudó a Costa Rica en busca de una vida más simple, más cerca de la naturaleza y de lo que de verdad importa.',
      'Desde entonces ha completado más de 750 horas de formación de Yoga Alliance y ha explorado distintas tradiciones y enfoques del yoga.',
      'Pero sus enseñanzas más profundas también han llegado de la vida misma. Después de atravesar una pérdida profunda, el yoga se convirtió para Nancy en algo más que una práctica: en una forma de encontrarse con la vida con más presencia, compasión, coraje y alegría.',
      'Hoy lleva esa comprensión a los espacios que crea y en los que enseña: con los pies en la tierra, auténticos y profundamente humanos.',
    ],
    pull: 'Auténtica, con los pies en la tierra y profundamente humana.',
    photoAlt: 'Nancy Goodfellow, fundadora de House of Shakti',
  },
  house: {
    numeral: 'II',
    eyebrow: 'La casa',
    notes: [
      'Santa Teresa, Costa Rica',
      'Lejos del turismo masivo',
      'Yoga · Retiros · Formaciones',
      'Presencia · Autenticidad · Comunidad · Vida consciente',
    ],
    paragraphs: [
      'House of Shakti nació de esa misma visión: crear un espacio donde las personas puedan bajar el ritmo y reconectar con su cuerpo, con la naturaleza y consigo mismas.',
      'Creada en Costa Rica y, a propósito, lejos del turismo masivo, House of Shakti ofrece un entorno íntimo para el yoga, los retiros, las formaciones y la conexión con sentido.',
      'Arraigado en los valores de la presencia, la autenticidad, la comunidad y la vida consciente, el espacio invita a cada persona a alejarse del ruido y reconectar con lo esencial.',
      'Inspirada en Shakti, la energía creativa que da vida al universo, House of Shakti existe alrededor de una pregunta simple:',
    ],
    pull: '¿Cómo podemos vivir, y sentirnos, más vivos?',
    photoAlt: 'La casa principal de House of Shakti, vista desde la piscina',
  },
  signature: {
    name: 'Nancy Goodfellow',
    role: 'Fundadora · House of Shakti',
    handle: '@wildheart.yogini',
  },
  closing: {
    heading: 'Lo demás se siente mejor de lo que se lee.',
    links: [
      { label: 'Quédate con nosotras', href: '/stay-with-us' },
      { label: 'Explora los retiros', href: '/retreats' },
    ],
  },
};

export const ABOUT_DICTIONARIES: Record<Lang, AboutDictionary> = { en, es };
