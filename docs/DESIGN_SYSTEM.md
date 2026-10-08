# Design System

Implemented in `apps/web/src/app/globals.css`. Every token is declared there and
nowhere else, so a brand change is a single-file edit.

## Colour

| Token | Hex | Role |
|---|---|---|
| `ink` | `#121214` | Page background |
| `surface` | `#1A1A1D` | Alternating section background |
| `card` | `#232227` | Cards, panels |
| `elevated` | `#2B2A30` | Hover surfaces, menu rows |
| `line` | `#333237` | Hairlines |
| `line-strong` | `#46444C` | Emphasised borders, muted numerals |
| `gold` | `#C7A668` | Identity accent |
| `gold-light` | `#D9BC84` | Gold hover |
| `yellow` | `#FFC72C` | Action colour |
| `yellow-dark` | `#E5A800` | Yellow hover |
| `text` | `#F5F3EF` | Primary text |
| `muted` | `#A8A49C` | Secondary text |
| `faint` | `#6E6A64` | Captions, disclaimers |
| `whatsapp` | `#25D366` | WhatsApp controls only |
| `available` / `booked` | `#2ECC71` / `#E5484D` | Calendar states |

Gold and yellow are never interchanged. Gold carries identity: rules, icon
outlines, the logo lockup, outlined buttons. Yellow means something is clickable
and important: primary buttons, prices, active states. Two warm tones competing
for the same job is how a dark gold theme turns muddy.

`#FFC72C` on `#121214` measures 11.9:1, and `#121214` on `#FFC72C` 12.4:1. Both
clear WCAG AAA for body text.

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
Everything respects `prefers-reduced-motion`.

## Components built so far

`Container`, `Button` / `ButtonLink`, `SectionHeading`, `Reveal`, `Logo`,
`SocialLinks`, brand icons, `Header` with mega menu, `TopBar`, `Footer`,
`StickyActions`, `PreviewDataNotice`, `VehicleCard`, `VehicleMedia`,
`QuickBookingForm`, `HeroQuoteCard`, and ten homepage sections.
