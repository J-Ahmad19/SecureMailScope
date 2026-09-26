# Charm Design System

Charm is a polished, production-ready design system built to make interfaces feel approachable, confident, and warm. It avoids cold or overly corporate aesthetics, instead combining warm light surfaces, vivid coral actions, cream accent bands, pill-shaped controls, and softly rounded panels.

## 1. Design Tokens

### Color Palette

Charm uses warm neutral surfaces, reserving its coral brand color strictly for primary actions, links, focus states, and intentional feature accents. Status colors are reserved for genuine success, danger, and warning states, never for decoration.

| Token | Hex Value | Purpose |
| :--- | :--- | :--- |
| **Section Surface** | `#F7F7F5` | Warm, matte canvas for main page content |
| **Panel** | `#FBFAF9` | Background for cards, widgets, and raised surfaces |
| **Accent Band** | `#F1F2EA` | Background for heroes, footers, and broad sections |
| **Brand (Coral)** | `#E4544B` | Primary actions, emphasized buttons |
| **Brand Text** | `#C9443A` | Accessible links and text accents |
| **Heading** | `#1C1917` | High-emphasis warm stone ink for headers |
| **Body** | `#57534E` | Primary reading text |
| **Muted Body** | `#79716B` | Supporting copy, metadata, and subtle labels |
| **Border** | `#E7E6E5` | Subtle component boundaries and dividers |

### Typography

The typography scale is designed to bridge the gap between expressive marketing (up to 72px headings) and compact, readable product UI.

- **Body, Controls, Navigation:** `Inter`
- **Headings (Display):** `DM Sans` (acting as fallback for Circular). Set bold with tight tracking for a friendly but confident voice.
- **Labels & Code:** `Fragment Mono`. Used for uppercase labels, eyebrows, ticker text, and code-oriented details.

## 2. Shape and Spacing

### Shapes & Radii
- **Pill Shapes (Full Radius):** Buttons, inputs, and alerts. This is Charm's most recognizable interaction pattern.
- **Soft Panels (24px Radius):** Cards, widgets, modals, tables, and drawers.
- **Menus (12px Radius):** Dropdowns, context menus, and small popovers.
- **Compact (4px Radius):** Checkboxes.
- **Exceptions:** Textareas retain the 24px panel shape, rather than the pill shape, to accommodate multi-line text comfortably.

### Spacing
Spacing follows a strict **4px token scale**.
- Content sits in centered containers up to **1280px** wide.
- Use aligned side padding, generous section rhythm, and tighter spacing inside related control groups.

## 3. Surface and Depth

Charm separates surfaces primarily through warm tone changes, hairline borders, and spacing, rather than heavy drop shadows.

- **Resting Cards:** Light, quiet, and cleanly bordered (`Border` color).
- **Controls (Buttons/Inputs):** Subtle, restrained lift (layered shadow).
- **Floating Elements (Menus/Popovers):** Medium floating shadow.
- **Brand Emphasis:** Optional coral glow, reserved strictly for the most critical brand elements.

## 4. Component Language

- **Primary Actions:** Use a coral gradient (or solid Brand color) with white text, a restrained layered shadow, and accessible hover/focus states.
- **Hero Sections:** May use one subtle line-pattern treatment behind its content on the `Accent Band` background; the rest of the interface remains flat and untextured.
- **Consistency:** Every component inherits the same semantic tokens, responsive behavior, focus visibility, and contrast rules, ensuring dense application surfaces remain as coherent as marketing sections.
