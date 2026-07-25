# House of Shakti — Design System & Visual Direction

## 1\. North Star

Aman Resorts (aman.com). Luxury wellness sanctuary. Editorial, cinematic, slow, generous with whitespace. The website should feel like a printed magazine, not a SaaS landing.

## 2\. Non-negotiables (hard rules)

### Color tokens (already in globals.css — DO NOT REDEFINE)

- Background: var(--warm-white) \#FFFDF7  
- Primary text: var(--dark) \#340000  
- Accent: var(--burgundy) \#8D0000  
- Muted bg: var(--cream) \#F2EBDA  
- Borders: var(--border) \#E0D5C5

### Typography (already configured)

- Serif: Cormorant Garamond → ALL headings (h1, h2, h3)  
- Sans: Inter → body, UI, microcopy  
- Headings: font-light, never font-bold  
- Microcopy/eyebrows: text-xs or text-sm, tracking-\[0.3em\], uppercase

### Spacing

- Section vertical padding: minimum py-32 lg:py-40  
- Container max-width: max-w-7xl mx-auto px-6 (default) or max-w-5xl for narrative  
- Between elements within section: space-y-12 or higher  
- NEVER use py-12 or py-16 for main sections — too tight

### Motion

- Default duration: 1.2s (NOT 0.8s)  
- Easing: ease-out  
- Stagger children: 0.15s minimum  
- useInView with margin: "-100px" and once: true

### Image treatment

- Prefer aspect ratios: aspect-\[3/4\], aspect-\[4/5\], aspect-video, aspect-square  
- AVOID rigid 3-col symmetric grids — break to editorial layouts  
- Use object-cover always  
- Hover: subtle scale (1.03 max), 700ms duration

## 3\. Visual patterns (DO this / DON'T do this)

### Heroes

DO: full-bleed image, text in corner (bottom-left or bottom-center), serif headline, max 2 CTAs DON'T: centered text with heavy gradient overlay, generic "Welcome" copy, multiple competing CTAs

### Section intros (eyebrows \+ heading)

DO: small uppercase tracking-wide label above (NOT ALWAYS, this is too AI) \+ large serif heading below Pattern: "" then h2 with font-serif font-light DON'T: sans-serif headings, bold weights

### Grids

DO: asymmetric editorial layouts (1 large \+ 2 small, staggered columns, varied aspect ratios) DON'T: perfect 3x3 or 4x4 symmetric grids unless it's a true gallery

### Microcopy & numbering

DO: "I / II / III" or "01 / 02 / 03" as section dividers Eyebrow text in burgundy: "tracking-\[0.3em\] uppercase text-burgundy" DON'T: emoji, exclamation marks, marketing-y copy

### CTAs

DO: ghost buttons with border, uppercase text-sm tracking-wide, arrow icon on the right that slides on hover DON'T: solid colored buttons with rounded-full, gradient backgrounds

## 4\. Page-by-page reference

### Home (/)

Reference: aman.com (homepage)

- Hero: full-bleed video, "Santa Teresa · Costa Rica" eyebrow, serif "House of Shakti", scroll cue  
- Introduction about the place. Editorial Style.  
- Pillars (3 business units): editorial 3-section breakdown (NOT symmetric grid). Yoga / Retreats / Accommodation   
- Seasonal Experiences: for House of Shakti Experiences. Same behaviour as Aman.  
- Gallery moments: masonry or staggered. Let’s work this in an artistic way.  
- Footer: thin, lots of whitespace. SIMPLICITY WILL BE OUR ALLY

### Yoga (/yoga)

Reference: aman.com/resorts/amangiri (page structure)

- Hero specific to yoga w/ 2 CTA’s: Learn more / Book now   
- Narrative section "Our practice" BEFORE the calendar  
- Weekly calendar: editorial typography, refined category colors. This should connect directly with Supabase Yoga Classes and its availability.  
- Presentation of each yoga class with a dedicated row with: editorial image, description and CTA that goes directly to Calendar. [https://www.amanatsea.com/](https://www.amanatsea.com/) good reference.  
- Footer

### Booking flow (/booking/\[classId\])

Reference: aman.com booking flow \+ Ritz Paris reservation

- Step 1: cinematic class detail, large photo, minimal info cards  
- Step 2: extras as elegant cards with refined badges  
- Step 3: data inputs with border-bottom only (editorial, not boxy)  
- Step 4: premium payment screen even if mock (payment screen will be Stripe’s)  
- Confirmation: full-bleed photo \+ reference centered

### Accommodations

Reference: amangiri rooms page

- Hero w/ cinematic video  
- Each room: large photo \+ minimal copy w/ main features and offering \+ Cloudbeds CTA  
- The place and its offerings  
- Footer

### Retreats

Reference: I like the way it is presented right now, let’s make some visual improvements based on Aman UI.

- Retreats hero w/video (to define)  
- Hub of retreats as editorial cards. Each retreat should have: Editorial image, retreat name, place and date “from to”, description, what’s included, NO PRICING, CTA to retreat landing page.  
- "Host your retreat" section as a separate moment, after all retreats.

### Gallery

Reference: https://www.aman.com/interiors

- Masonry layout, varied aspect ratios, NO uniform grid

### Contact us

Reference: https://www.aman.com/interiors

SAME STRUCTURE as AMAN.

## 5\. Visual references (Aman screenshots)

\[Aquí pegás las 5-8 capturas con un nombre descriptivo cada una\]

heros.png \-\> “Reference for heros sections”.  
pillars.png \-\> “Reference for 3 Pillars”.  
seasonal-experiences.png \-\> “Reference for Seasonal experiences”.  
retreats/yoga-classes presentation-1.png \-\> “Reference for Retreats and Yoga Classes Presentation 1”  
retreats/yoga-classes presentation-2.png \-\> “Reference for Retreats and Yoga Classes Presentation 2”  
class-reservation-1.png \-\> Reference for “Yoga Classes Reservations 1”  
class-reservation-2.png \-\> Reference for “Yoga Classes Reservations 2”  
gallery.png \-\> Reference for “Gallery”

## 6\. What to AVOID (anti-patterns from current site)

- Heavy cream gradients over images (hero actual)  
- Symmetric 3-column grids for content (pillars actual)  
- font-bold or font-semibold in headings (Cormorant should be font-light)  
- Rounded-full buttons  
- Emoji in microcopy  
- Section padding less than py-32

## 7\. How to use this document with Claude Code

When prompting Claude Code, ALWAYS include:

1. The relevant principle section (e.g. "Heroes" \+ "Spacing" \+ "Motion")  
2. The page-specific reference  
3. The anti-patterns to avoid

Example prompt skeleton: "Following the principles in DESIGN\_PRINCIPLES.md, specifically sections \[X, Y\], redesign \[component\]. Avoid the anti-patterns listed in section 6."  
