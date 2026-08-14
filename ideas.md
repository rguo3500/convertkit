# ConvertKit Design Direction

## Three Initial Directions

### Theme Name: Paper Instrument
Very Brief Intro: A warm, editorial utility desk that makes technical conversion feel calm, precise, and human. Ivory paper tones, ink-blue controls, and compact typographic labels create a trustworthy reference-tool mood.
Probability: 0.07

### Theme Name: Signal Workshop
Very Brief Intro: A high-contrast technical workbench for developers and makers, using structured panels, measured spacing, and selective cobalt highlights to make every conversion step feel explicit.
Probability: 0.04

### Theme Name: Quiet Atlas
Very Brief Intro: A soft, map-inspired system that treats units as a network of relationships, with mineral neutrals, terracotta markers, and subtle cartographic lines.
Probability: 0.09

## Chosen Direction: Signal Workshop

### Design Movement
Contemporary Swiss International Typographic Style blended with industrial control-panel ergonomics. ConvertKit should feel like a reliable instrument: clear, measured, and built for repeated use.

### Core Principles
1. **Precision before decoration:** every label, number, and control has a clear hierarchy and generous alignment.
2. **Visible system logic:** formulas, base units, and conversion tables are treated as first-class content rather than hidden implementation details.
3. **Quiet confidence:** use a restrained palette and strong typography instead of loud gradients or generic SaaS gloss.
4. **Fast, tactile feedback:** every input, swap, copy, and reset action should respond immediately and accessibly.

### Color Philosophy
The interface uses a near-black blue graphite as the workbench, warm paper-white for reading surfaces, and a signature cobalt signal blue for actions and focus. A restrained amber is reserved for metadata and “local processing” notices. This contrast communicates that the site is technical but not cold: the dark shell frames the tool, while pale cards create a calm reading lane.

### Layout Paradigm
Use a split instrument layout rather than a centered landing-page stack. The hero begins with an offset copy block and a large conversion console anchored to the right on desktop, then collapses into a single reading lane on mobile. Content sections use editorial columns and horizontal rails to suggest a catalog of tools rather than a generic card grid.

### Signature Elements
1. **Signal rail:** a slim cobalt rule with a tiny square marker appears beside section headings and key metadata.
2. **Instrument cards:** conversion surfaces use crisp 2px borders, small uppercase labels, and a deep inset result well.
3. **Calibration ticks:** subtle dotted baselines and monospace numbers appear in tables, formulas, and empty states.

### Interaction Philosophy
Interactions should feel like operating a physical instrument. Inputs remain prominent, swap is a reversible action with a distinct rotating icon, and copy feedback appears as a short state change rather than a blocking toast. Keyboard focus is visible as a cobalt outline; errors are direct and calm.

### Animation
Use short 160–220ms ease-out transitions for controls, with a small translateY(-2px) on hover and scale(0.98) on press. Swap may rotate its icon 180 degrees across 240ms. Results should fade and shift upward by 4px only when the value changes. Stagger catalog items by 40ms on page entry. Respect prefers-reduced-motion and remove non-essential transitions when requested.

### Typography System
Display: **Space Grotesk** 600–700 for the brand and page titles, with slightly tightened tracking. Body: **IBM Plex Sans** 400–600 for paragraphs and labels. Numbers and formulas: **IBM Plex Mono** 500–600. Use sentence case for headings, uppercase with 0.14em tracking for small labels, and keep body copy at a comfortable 1.6 line height.

### Brand Essence
ConvertKit is the dependable browser-local instrument for people who need to move between units and formats without friction, noise, or data uploads. Personality: **exact, composed, useful**.

### Brand Voice
Headlines are direct and specific. CTAs sound like actions, not hype. Microcopy explains the system in plain language and avoids filler.

Example lines:
- “Make the number usable.”
- “Your data stays in this browser whenever possible.”

### Wordmark & Logo
The mark is a compact cobalt square containing two offset white calibration ticks—one horizontal, one vertical—forming an abstract “C” through negative space. The wordmark is set in Space Grotesk with a custom shortened crossbar on the K, paired with a small mono “TOOLS / 01” utility tag.

### Signature Brand Color
**Signal Cobalt — #356AE6.** It is bright enough to be unmistakably actionable against graphite, but controlled enough to remain credible beside paper-white content surfaces.
