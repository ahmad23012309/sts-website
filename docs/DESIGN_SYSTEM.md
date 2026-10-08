# Design System

Implemented in `apps/web/src/app/globals.css`. Every token is declared there and
nowhere else, so a brand change is a single-file edit.

## Surfaces

The page is light, the way the logo sits on white. The header, the footer, the
fuel-price band and the corporate band are dark.

Surface colours are therefore semantic rather than literal. A component asks for
`bg-panel`, `text-fg` or `border-edge` and never for a specific shade; any
element inside a `[data-surface="dark"]` wrapper picks up the dark values of the
same tokens. One card component works correctly on either background without
being told which it is on, and a section can be flipped by adding a single
attribute.

| Token | Light | Dark |
|---|---|---|
| `page` | `#FFFFFF` | `#0D0E12` |
| `page-alt` | `#F4F6F9` | `#14161B` |
| `panel` | `#FFFFFF` | `#1B1E25` |
| `panel-alt` | `#EEF1F6` | `#252933` |
| `edge` | `#E3E7ED` | `#2C313B` |
| `edge-strong` | `#CBD2DC` | `#3C4250` |
| `fg` | `#15171C` | `#F4F5F7` |
| `fg-muted` | `#5A616E` | `#A2A8B4` |
| `fg-faint` | `#858C99` | `#717886` |
| `accent` | `#CE1D17` | `#E8463F` |
| `price` | `#123785` | `#FFC72C` |

`accent` and `price` flip for the same reason: the logo red measures 5.5:1 on
white but only 3.5:1 on the dark surfaces, and yellow is unreadable as type on
white at 1.6:1 while it is the clearest choice on dark at 12.4:1.

## Brand colour

| Token | Hex | Role |
|---|---|---|
| `red` | `#CE1D17` | Logo red. Primary buttons, eyebrows, icon outlines |
| `red-dark` | `#B5190F` | Primary button hover |
| `red-bright` | `#E8463F` | Red type on dark surfaces |
| `navy` | `#123785` | Logo navy. Prices on light, corporate gradients |
| `navy-deep` | `#0C2559` | Deep end of the dark bands |
| `blue` | `#4C7DE0` | Blue type on dark surfaces |
| `yellow` | `#FFC72C` | The strongest action on a screen, and prices on dark |
| `ink` | `#0D0E12` | Fixed near-black, for type set on yellow |

Three accent colours only work if each keeps to one job:

- **Red** is identity and the default action.
- **Navy** carries prices on light surfaces and backs the dark bands.
- **Yellow** is held back for one button per screen, and for figures on dark.

Section rules run red into navy, echoing the sweep inside the logo.

### Measured contrast

| Pair | Ratio |
|---|---|
| `fg` on white | 17.93:1 |
| `navy` on white | 10.99:1 |
| `red` on white | 5.51:1 |
| `fg-muted` on white | 6.23:1 |
| White on `red` | 5.51:1 |
| `ink` on `yellow` | 11.49:1 |
| `yellow` as type on white | 1.56:1 — never used |
| `accent` on dark `page` | 4.94:1 |
| `yellow` on dark `page` | 12.36:1 |

## Buttons

No arrow glyphs. A button reads as a button from its shape and colour, and the
arrow added nothing but visual noise at six repeats per screen. Inline text
links carry a brand-red underline instead.

| Variant | Appearance |
|---|---|
| `primary` | Brand red, white label |
| `accent` | Yellow, near-black label. One per screen |
| `outline` | Bordered, foreground label, red on hover |
| `ghost` | Text only |
| `whatsapp` | WhatsApp green |

## Type

| Face | Use |
|---|---|
| Anton | `h1`–`h4`, uppercase, applied through the base layer so headings cannot drift |
| Crimson Text | Body copy, 17px base |
| Inter | Buttons, labels, form fields, table data, badges, prices |

Interface elements are mapped to Inter in the base layer rather than by class, so
a new form picks up the right face without being told. A serif at 13px on a
near-black background loses definition, and that is exactly where booking forms
and rate tables live.

All three are self-hosted as subset `woff2` — 184 KB in total, no third-party
request at page load.

## Motion

One `Reveal` component backed by an IntersectionObserver. No animation library.
Everything respects `prefers-reduced-motion`, and the reveals show up front when
scripting is unavailable, so no content can be trapped at zero opacity.

## The 3D showroom

`components/three/` holds a turntable viewer: a stylised saloon that rotates
slowly, responds to dragging, and repaints to any of six finishes.

The car is **built in code** rather than downloaded. The freely licensed car
models available run to around twelve megabytes or carry attribution and
trademark conditions, and neither is an acceptable trade on a homepage that has
a performance budget to keep. `buildCar.ts` extrudes a side profile into a solid,
cuts the wheel arches as arcs in that profile, pushes a second extrusion through
the cabin to form the glazing, and adds wheels and lamps. It is a few kilobytes
of code, it renders instantly, it recolours on demand, and it carries no licence
conditions.

Cost control:

- Three.js is behind a dynamic import, so it is absent from the initial payload
- The scene is only created once the section is within 300px of the viewport, so
  a visitor who never scrolls that far never downloads the library
- The render loop pauses when the canvas is off screen or the tab is hidden
- Reflections come from a procedural room environment, so there is no HDR file
  to download
- Auto-rotation is disabled under `prefers-reduced-motion`
- Everything is disposed on unmount

Per-vehicle models on the fleet pages will use the same component, with a `.glb`
per vehicle where one exists.

## Header

The logo sits in the centre with the menu split around it: Fleet, Fare
Calculator and Corporate to the left, Services, Fuel Prices and Company to the
right, then a divider and the call and Book Now controls. The outer grid is
`1fr / auto / 1fr`, so the mark stays optically centred however wide either half
of the menu grows. Below 1280px the split collapses, the logo moves to the left
and the full menu moves into the drawer.

The header, the bar above it and the drawer are all dark, against the light
page.

## Contact rail

A single navy capsule pinned to the bottom right holds WhatsApp, call, email
and request-a-call-back, with a separate return-to-top control beneath it that
fades in past 600px of scroll. Labels slide out on hover; each control carries
an `aria-label` for anyone not using a pointer. Email and call-back are hidden
below 640px so the rail does not crowd a phone screen.

Every control in the rail resolves today. A persistent element that leads
somewhere unbuilt is worse than one control fewer, so nothing was added for
pages that do not exist yet.

## Components built so far

`Container`, `Button` / `ButtonLink`, `SectionHeading`, `Reveal`, `Logo`,
`SocialLinks`, brand icons, `Header` with mega menu, `TopBar`, `Footer`,
`StickyActions`, `PreviewDataNotice`, `VehicleCard`, `VehicleMedia`,
`QuickBookingForm`, `HeroQuoteCard`, `SketchfabViewer`, `FloatingActions`, and
the homepage sections.
