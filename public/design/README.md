# Handoff: Vehicle Damage Inspector — Redesign

## Overview

This handoff bundles a **complete visual redesign** of the Vehicle Damage Inspector web app, transforming the current minimal/light interface into a dark, premium, AI-instrument aesthetic. The redesign covers all three primary states of the app: **Upload**, **Analyzing**, and **Results**.

The redesign is intended to be implemented in the existing codebase:
- React 19.2 + TypeScript 5.9
- Chakra UI 3.29 (with Emotion)
- Vite 7.2

## About the Design Files

The file `prototype/Vehicle Damage Inspector.html` in this bundle is a **design reference created in HTML** — an interactive prototype that demonstrates the intended look, feel, animations, and state transitions. It is **not production code** and should **not be copied directly** into the codebase.

The task is to **recreate this design in the existing React + Chakra UI environment**, using Chakra's component system, theme tokens, and recipe patterns. Replace the vanilla HTML/CSS with Chakra primitives (`Box`, `Flex`, `Heading`, `Button`, etc.) and move the design tokens defined below into `src/theme.ts`.

## Fidelity

**High-fidelity (hifi).** Every color, font size, padding value, border radius, and animation timing in this design is intentional. Recreate pixel-perfectly. Hex values, typography sizes, and spacing are documented exhaustively in the **Design Tokens** section below.

## Files in this Bundle

| File | Purpose |
|------|---------|
| `prototype/Vehicle Damage Inspector.html` | The full interactive prototype — open in a browser to see all three states |
| `theme.ts.snippet` | Drop-in Chakra UI theme tokens — copy into `src/theme.ts` |
| `README.md` | This document |

---

## Screens / Views

The app has **three sequential states** within a single page (no routing). State transitions are driven by user action:

```
[Upload] → click "Analyze" → [Analyzing] → (auto, ~2.9s) → [Results] → click "New Inspection" → [Upload]
```

### Global Layout

- **Background:** `#070b12` (deep navy black)
- **Background grid:** Subtle radial gradients (top-left blue glow, bottom-right violet glow) overlaid with a 52px × 52px dot grid at `rgba(77,143,245,0.03)`
- **Page width:** Centered, max-width `1120px`, horizontal padding `24px`
- **Navbar:** Fixed top, height `62px`, full-width, `rgba(7,11,18,0.82)` background with `backdrop-filter: blur(20px)` and a `1px` bottom border

### Navbar

- **Brand block** (left):
  - `34×34px` gradient logo tile (135° linear: `var(--accent)` → `var(--accent-2)`), `10px` border-radius, soft glow shadow
  - Inside: shield-with-checkmark SVG icon (18×18, white)
  - Wordmark: **"Daz**`em`{accent color}**ellle"`** — Space Grotesk 700, 17px, letter-spacing `-0.4px`
  - "AI Vision" chip: 10px Space Grotesk 600 uppercase, accent color, `accent-dim` background, `accent-border`, padding `3px 10px`, `100px` border-radius
- **Status block** (right):
  - Small pulsing green dot (`6×6px`, `#10d9a0`, animated opacity 1 → 0.4 → 1 over 2s)
  - "Model Online" text — DM Sans 12px, `--text-2`

### Hero

- Centered, max-width `680px`, padding `56px 24px 44px`
- **Eyebrow chip:** "Computer Vision · Damage Detection" — Space Grotesk 11px 600 uppercase, accent color on `accent-dim` pill background, `6px 16px` padding
- **Title:** "Vehicle Damage<br>Inspector" — Space Grotesk 700, **54px**, line-height 1.08, letter-spacing `-1.8px`. Gradient text fill: `linear-gradient(150deg, #eef2ff 10%, #a5b4fc 60%, #818cf8 100%)`
- **Subtitle:** "Upload pickup and return inspection photos. Our AI instantly identifies new damage between inspections — precise, annotated, reportable." — DM Sans 16px, `--text-2`, line-height 1.65, max-width `520px`

---

### State 1: Upload

**Layout:** 2-column grid of upload cards (`1fr 1fr`, gap `20px`), centered below the hero, followed by the primary "Analyze Damage" CTA and a small "Try with sample demo" text link.

#### Upload Card

- Background: `--surface` (`#111827`), border: `1px solid var(--border-2)`, border-radius: `26px`, hidden overflow
- **On hover:** drop-icon scales `1.06` and gains accent glow
- **On drag-over:** entire card border becomes `var(--accent)` with outer + inset blue glow

##### Card Header

- Padding `18px 22px 16px`, bottom border `1px solid var(--border)`
- **Left:** color pip (`9×9px` circle with glow shadow) + label group
  - **Pickup** uses `--accent` blue; **Return** uses `--danger` red
  - Title: Space Grotesk 15px 600
  - Subtitle: DM Sans 12px `--text-3`
- **Right:** Status badge — Space Grotesk 10px 600 uppercase
  - Default: "Awaiting" — `rgba(255,255,255,0.04)` bg, `--text-3` color
  - Filled: "Ready" — `rgba(16,217,160,0.1)` bg, `--success` color

##### Drop Zone (empty state)

- Padding `44px 28px`, min-height `230px`, centered flex column, gap `18px`
- **Drop-icon wrap:** `76×76px`, `--surface-2` background, `--border-2`, border-radius `20px`. Contains upload-arrow SVG (24×24, stroke `--text-3`)
- **Drop label:** Space Grotesk 14px 600 "Click to upload or drag & drop" + DM Sans 12px `--text-3` "PNG, JPG, JPEG — up to 10 MB"
- The hidden `<input type="file">` covers the entire zone (`opacity: 0; position: absolute; inset: 0`)

##### Preview Zone (filled state)

- Padding `14px 20px 22px`
- **Image preview:** aspect-ratio `16/9`, border-radius `14px`, `object-fit: cover`
- **Remove button:** `28×28px` circle, top-right corner, `rgba(0,0,0,0.65)` + backdrop-blur. Hover: turns red
- **Filename row:** small file icon + DM Sans 12px `--text-2` filename

#### Analyze Button

- Pill shape, height `58px`, padding `0 52px`
- Space Grotesk 16px 700 white text, letter-spacing `0.2px`
- Background: `linear-gradient(130deg, var(--accent), var(--accent-2))`
- **Disabled:** opacity `0.22`, no hover
- **Hover:** translateY(-3px), `box-shadow: 0 12px 36px rgba(<accent>, 0.4)`, plus a blurred glow halo via `::after`
- Search-icon SVG (16×16) before text

#### Demo Link

- "Try with sample demo →" — Below the button, DM Sans 13px `--text-3`, underline on hover. Goes straight to results.

---

### State 2: Analyzing

**Layout:** Single centered card (`max-width: 480px`), `padding: 80px 48px`, background `--surface`, border `--border-2`, border-radius `26px`.

#### Scanner Animation

- `130×130px` square, contains 4 concentric layers:
  - **Ring 1** (outer, inset 0): 2px border, transparent except top, `border-top-color: var(--accent)`, spins clockwise 1.1s linear
  - **Ring 2** (inset 14px): same but `border-top-color: rgba(139,92,246,0.8)` (or `--accent-2`), spins counter-clockwise 1.7s
  - **Ring 3** (inset 28px): faint accent (35% opacity), clockwise 2.3s
  - **Core** (inset 42px): circle with `--accent-dim` bg, `--accent-border`, contains a 18×18 search icon. Pulses outward shadow every 2s

#### Title & Status

- Title: "Analyzing Images" — Space Grotesk 22px 700 centered
- Subtitle: "AI is scanning for damage patterns…" — DM Sans 14px `--text-2` centered

#### Progress Bar

- Full width, height `3px`, background `--surface-3`, border-radius `100px`
- Fill: linear-gradient(90deg, accent → accent-2), animation:
  ```
  0% → 0%
  25% → 30%
  60% → 68%
  90% → 88%
  100% → 96% (held until state transition)
  ```
  duration: `2.6s`, easing: `ease-in-out`

#### Steps List

Four rows, each `display: flex`, gap `10px`, DM Sans 13px:

1. "Encoding images for processing"
2. "Detecting damage regions"
3. "Comparing inspections"
4. "Generating report"

Each row has a `6×6px` pip and three states:
- **Default:** pip is `--text-3`, text is `--text-3`
- **Active:** pip is `--accent` with glow, text is `--text-1`
- **Done:** pip is `--success`, text is `--success`

**Animation timing:**
- `t=0`: step 1 done, step 2 active
- `t=900ms`: step 2 → done, step 3 → active
- `t=1700ms`: step 3 → done, step 4 → active
- `t=2300ms`: step 4 → done
- `t=2900ms`: transition to results

---

### State 3: Results

**Layout:** Vertical stack of four blocks with `gap: 20px`:

1. Header row (title + "New Inspection" button)
2. Stats row (4 cards)
3. Annotated image grid (2 cards)
4. Damage table

#### Header Row

- Flex row, space-between, gap `16px`
- **Left:** "Inspection Report" (Space Grotesk 20px 700) + "Analysis complete · {date}" (DM Sans 13px `--text-2`)
- **Right:** "New Inspection" button — pill, `--surface-2` bg, `--border-2`, height `40px`, padding `0 20px`, refresh-icon + Space Grotesk 13px 600. Hover: `--surface-3` bg

#### Stats Row

Grid `repeat(4, 1fr)`, gap `14px`. Each stat card:

- Background `--surface`, border `--border-2`, border-radius `20px`, padding `18px 22px`
- **Label** (top): DM Sans 10px 600 uppercase letter-spacing `0.8px`, color `--text-3`
- **Value** (middle): Space Grotesk 38px 700, color `--text-1`, line-height 1
- **Hint** (bottom): DM Sans 12px `--text-3`

The "New Damage" card uses an **alert variant**:
- Background: `linear-gradient(135deg, rgba(244,63,94,0.06), rgba(244,63,94,0.02))`
- Border: `var(--danger-border)`
- Value color: `--danger`

**Demo values:** Pickup Damages 3, Return Damages 5, New Damage 2 (alert), Avg. Confidence 87%.

#### Annotated Image Grid

2-column grid (`1fr 1fr`), gap `18px`. Each panel:

- **Header** (15px 20px padding, bottom border):
  - Pip + label (Space Grotesk 14px 600)
  - Right badge — "3 damages" (default style) or "2 NEW" (ready/green style)
- **Canvas wrap:** aspect-ratio `16/10`, background `--surface-2`, canvas fills with `object-fit: contain`
- **Legend** (12px 20px padding, top border): legend items with 10×10 squares + DM Sans 11px `--text-2`

##### Canvas Drawing Logic

Each bounding box is drawn with:

1. **Soft fill:** `<color>22` alpha (~13% opacity) full rectangle
2. **Border:** 2px stroke in the box color
3. **Corner accents:** four 10px L-shapes in 3px stroke at each corner of the rectangle
4. **Label pill:** rounded rect above the box's top-left corner
   - Background: solid box color, border-radius 4px
   - Text: white, DM Sans 11px 600, format: `<Type>  <conf>%`

**Box data structures** (positions are relative to the 800×500 canvas):

```ts
const PICKUP_BOXES = [
  { x: 110, y: 70,  w: 145, h: 110, label: 'Scratch', conf: '94%', color: '#3b82f6' },
  { x: 390, y: 175, w: 130, h: 100, label: 'Dent',    conf: '88%', color: '#3b82f6' },
  { x: 540, y: 300, w: 175, h: 115, label: 'Crack',   conf: '79%', color: '#3b82f6' },
];

const RETURN_BOXES = [
  // ... same 3 pre-existing in blue
  { x: 235, y: 305, w: 165, h: 125, label: 'Dent',    conf: '91%', color: '#f43f5e' },
  { x: 615, y: 170, w: 135, h: 90,  label: 'Scratch', conf: '83%', color: '#f43f5e' },
];
```

In production, these come from the Roboflow API response — pre-existing damage is colored `#3b82f6` and new damage (detected by the spatial-proximity algorithm) is colored `#f43f5e`.

#### Damage Table

- Background `--surface`, border `--border-2`, border-radius `26px`
- **Header** (18px 22px padding, bottom border):
  - "New Damage Detected" — Space Grotesk 15px 600
  - "N Items" pill — DM Sans 10px 700 uppercase, danger color on `--danger-dim` background, `--danger-border`
- **Damage rows** (13px 22px padding, bottom border, hover: `--surface-2` bg):
  - **Left:** 8×8 colored dot + info block:
    - Type: DM Sans 14px 500 `--text-1`, text-transform capitalize
    - Location: DM Sans 12px `--text-3`
  - **Right (confidence wrap):** 84×3px bar (background `--surface-3`) with fill in damage color + DM Sans 12px 600 percentage

---

## Interactions & Behavior

### Upload Flow
1. User clicks anywhere on a drop zone → native file picker opens (transparent `<input type="file">` covers the zone)
2. Or user drags an image file onto a card → card border turns blue, drop-icon glows
3. On valid drop/select: zone is replaced by preview, badge flips to "Ready"
4. Once **both** cards are "Ready": the "Analyze Damage" button becomes enabled (opacity 1, gradient visible)
5. User clicks remove (✕): preview is cleared, zone returns, badge returns to "Awaiting"

### Analyze Flow
- On click: instant transition to Analyzing state
- Steps animate as documented above
- After ~2.9s: transition to Results

### Reset Flow
- "New Inspection" button: clears `files` state, revokes object URLs, resets badges, transitions to Upload

### Animations & Easing

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Status dot pulse | opacity 1 → 0.4 → 1 | 2s | ease-in-out, infinite |
| Card drag-over | border-color, box-shadow | 250ms | ease |
| Drop-icon hover | transform: scale, color | 300ms | ease |
| Analyze btn hover | translateY, shadow | 300ms | ease |
| Scanner rings | rotate 360° | 1.1s / 1.7s / 2.3s | linear |
| Scanner core pulse | box-shadow ring | 2s | ease-in-out |
| Progress fill | width 0 → 96% | 2.6s | ease-in-out |
| Step row transition | color | 300ms | ease |
| Damage row hover | background | 150ms | ease |
| Stat card | border-color | 200ms | ease |

---

## State Management

Suggested React state shape inside `App.tsx`:

```ts
type AppState = 'upload' | 'analyzing' | 'results';

type UploadFile = { file: File; url: string } | null;

const [state, setState] = useState<AppState>('upload');
const [pickup, setPickup] = useState<UploadFile>(null);
const [return_, setReturn] = useState<UploadFile>(null);
const [analysisResult, setAnalysisResult] = useState<RoboflowComparisonResult | null>(null);
```

Keep the existing `services/roboflow.ts` integration and types in `types/roboflow.ts` — those don't change. Only the visual layer is being redesigned.

**Remember to `URL.revokeObjectURL` previews on unmount and reset.**

---

## Design Tokens

Paste these into `src/theme.ts` (Chakra UI 3 system config). A ready-to-use snippet is in `theme.ts.snippet`.

### Colors

| Token | Value | Usage |
|---|---|---|
| `bg` | `#070b12` | Page background |
| `bg.2` | `#0c1220` | Background variation |
| `surface` | `#111827` | Card background |
| `surface.2` | `#16202f` | Elevated surface, badges |
| `surface.3` | `#1c2b40` | Hover state, progress track |
| `accent` | `#a78bfa` | Primary accent (violet — user-selected) |
| `accent.dim` | `rgba(167, 139, 250, 0.12)` | Accent backgrounds |
| `accent.border` | `rgba(167, 139, 250, 0.28)` | Accent borders |
| `accent.2` | `#ec4899` | Secondary accent (pink — user-selected, used in gradients) |
| `danger` | `#f43f5e` | New damage, error |
| `danger.dim` | `rgba(244, 63, 94, 0.1)` | Danger backgrounds |
| `danger.border` | `rgba(244, 63, 94, 0.3)` | Danger borders |
| `success` | `#10d9a0` | Ready badges, online status |
| `text.1` | `#e8f0fe` | Primary text |
| `text.2` | `#7e93b8` | Secondary text |
| `text.3` | `#3e506e` | Tertiary text / placeholders |
| `border` | `rgba(255,255,255,0.055)` | Subtle dividers |
| `border.2` | `rgba(255,255,255,0.09)` | Card borders |
| `box.blue` | `#3b82f6` | Pre-existing damage boxes |
| `box.red` | `#f43f5e` | New damage boxes |

> **Note:** The user customized the accent to violet (`#a78bfa`) and pink (`#ec4899`) via the in-prototype Tweaks panel. If you prefer the original blue (`#4d8ff5` + `#8b5cf6`), or want to expose an accent picker in production, both options work.

### Typography

```css
--font-display: 'Space Grotesk', sans-serif;  /* headings, brand, stat values */
--font-body:    'DM Sans', sans-serif;        /* everything else */
```

**Type scale:**

| Token | Size | Weight | Letter-Spacing | Line-Height | Usage |
|---|---|---|---|---|---|
| `display.hero` | 54px | 700 | -1.8px | 1.08 | Hero title |
| `display.lg` | 38px | 700 | normal | 1 | Stat values |
| `display.md` | 22px | 700 | normal | normal | Analyzing title |
| `display.sm` | 20px | 700 | normal | normal | Results title |
| `display.xs` | 15-17px | 600-700 | -0.4px (brand) | normal | Card titles, brand wordmark |
| `body.lg` | 16px | 400 | normal | 1.65 | Hero subtitle |
| `body.md` | 14px | 400-500 | normal | normal | Body, damage type |
| `body.sm` | 13px | 400-600 | normal | normal | Steps, buttons |
| `body.xs` | 12px | 400-500 | normal | normal | Subtitles, filenames |
| `label` | 10-11px | 600 | 0.5-0.8px | normal | Uppercase labels, badges |

### Spacing

Standard 4px-scale Chakra spacing is fine, but key values to use:

```
padding: 18px 22px      (card headers)
padding: 13px 22px      (table rows)
padding: 44px 28px      (drop zones)
padding: 56px 24px 44px (hero)
padding: 80px 48px      (analyzing card)
gap: 14px               (stats row)
gap: 18px               (results grid)
gap: 20px               (workspace blocks)
```

### Border Radius

| Token | Value | Usage |
|---|---|---|
| `radii.sm` | 8px | Inputs, density buttons |
| `radii.md` | 14px | Preview images |
| `radii.lg` | 20px | Stat cards, drop-icon |
| `radii.xl` | 26px | Upload cards, analyzing card, damage table |
| `radii.pill` | 100px | Badges, buttons, chips |

### Shadows / Glows

```css
/* Logo glow */
box-shadow: 0 0 16px rgba(<accent>, 0.35);

/* Analyze button hover */
box-shadow: 0 12px 36px rgba(<accent>, 0.4);

/* Card drag-over */
box-shadow: 0 0 0 1px var(--accent), 0 0 40px rgba(<accent>, 0.15),
            inset 0 0 30px rgba(<accent>, 0.04);

/* Pip glow (label dots) */
box-shadow: 0 0 8px rgba(<color>, 0.7);
```

### Background

```css
background-image:
  radial-gradient(circle at 15% 15%, rgba(<accent>, 0.07) 0%, transparent 55%),
  radial-gradient(circle at 85% 75%, rgba(<accent-2>, 0.06) 0%, transparent 50%),
  linear-gradient(rgba(<accent>, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(<accent>, 0.03) 1px, transparent 1px);
background-size: 100% 100%, 100% 100%, 52px 52px, 52px 52px;
```

---

## Component Mapping (against existing codebase)

| Existing file | What changes |
|---|---|
| `src/theme.ts` | **Replace entirely.** Use the new dark token system. Set `initialColorMode: 'dark'` and force dark mode. |
| `src/index.css` | Update body background, font imports, base text color. Add the Google Fonts `<link>` for Space Grotesk + DM Sans, or use `@import`. |
| `src/App.tsx` | Restructure into three render branches based on `state`. Move drop-zone + analyze button + state machine here, or split into `UploadView`, `AnalyzingView`, `ResultsView`. |
| `src/components/ImageUpload.tsx` | Rebuild as the new card-style drop zone with header, badge, drop zone, and preview zone variants. Keep the `onChange(file)` API. |
| `src/components/AnnotatedImage.tsx` | Update the canvas box-drawing routine: add soft fill, corner accents, and pill labels (see drawing logic above). Color logic stays the same (blue for pre-existing, red for new). |
| `src/components/ui/provider.tsx` | Ensure dark mode is forced; wire up new theme. |
| `src/services/roboflow.ts` | **No changes.** Keep the existing API integration. |
| `src/types/roboflow.ts` | **No changes.** |

### New Components to Add

- `Navbar.tsx` — logo, brand, AI chip, status dot
- `Hero.tsx` — eyebrow + gradient title + subtitle
- `Scanner.tsx` — animated triple-ring analyzing visual
- `ProgressSteps.tsx` — the 4-step list with active/done states
- `StatCard.tsx` — value/label/hint with optional alert variant
- `DamageTable.tsx` — table of newly-detected damages with confidence bars
- `ResultPanel.tsx` — annotated image with legend (wraps `AnnotatedImage`)

---

## Assets

- **Fonts:** Space Grotesk (400, 500, 600, 700) and DM Sans (400, 500, 600) from Google Fonts. Add to `index.html` or import in `index.css`.
- **Icons:** All icons in the prototype are inline SVG (upload arrow, search, file, refresh, shield-with-check). They can stay inline, or switch to `react-icons` (already in your stack) — `FiUpload`, `FiSearch`, `FiFile`, `FiRefreshCcw`, `FiShield` are close equivalents.
- **No raster images** required. The shield logo is the only branded mark.

---

## Implementation Order (suggested)

1. **Tokens & globals first.** Replace `theme.ts`, update `index.css`, force dark mode in `provider.tsx`. Get the body background + dot grid rendering.
2. **Navbar + Hero.** Static layout, no interactivity. Verify typography sizes and colors match the prototype.
3. **Upload state.** Build `ImageUpload.tsx` redesign — header, badge, drop zone, preview. Wire to existing file-handling logic in `App.tsx`. Verify drag-over glow and badge state transitions.
4. **Analyze button + demo link.** Match gradient, glow, disabled state.
5. **Analyzing state.** Build `Scanner.tsx` (CSS-only animation) and `ProgressSteps.tsx`. Use `setTimeout`s or `useEffect` to advance steps on the documented schedule.
6. **Results state.** Stats grid → `AnnotatedImage` canvas update → damage table.
7. **Polish.** Verify all hover states, drag-over states, transitions, and the demo link path.

---

## Open Questions for the Developer

- **Accent color in production:** ship with the user-selected violet/pink, or restore the original blue/violet, or expose a user-pickable accent? (Currently the prototype defaults to violet/pink as per the user's Tweak.)
- **Light theme:** the redesign is dark-only. If a light variant is needed, scope a follow-up.
- **Mobile responsive:** the prototype is desktop-first (designed at 1440 wide). Stack the two upload cards vertically below ~768px and adjust hero type to ~36px.
- **Empty/error states:** beyond the documented states, add toast notifications for upload errors, API failures, and unsupported file types using Chakra's toast system. Match the danger/`--danger` color treatment.
