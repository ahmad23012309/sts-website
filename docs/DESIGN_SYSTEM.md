# Design System

Implemented in `apps/web/src/app/globals.css`. Every token is declared there and
nowhere else, so a brand change is a single-file edit.

## Colour

The palette comes from the company mark: the red of the ring and the lettering,
and the navy of the inner crescent. Yellow is the third voice, added for the
actions that matter most.

| Token | Hex | Role |
|---|---|---|
| `ink` | `#0D0E12` | Page background |
| `surface` | `#14161B` | Alternating section background |
| `card` | `#1B1E25` | Cards, panels |
| `elevated` | `#252933` | Hover surfaces, menu rows |
| `line` | `#2C313B` | Hairlines |
| `line-strong` | `#3C4250` | Emphasised borders, outline buttons |
| `red` | `#CE1D17` | Logo red. Primary buttons, icon outlines |
| `red-dark` | `#B5190F` | Primary button hover |
| `red-bright` | `#E8463F` | Red type and icons on dark backgrounds |
| `navy` | `#123785` | Logo navy. Corporate surfaces, gradients |
| `navy-deep` | `#0C2559` | Deep end of the corporate gradient |
| `blue` | `#4C7DE0` | Blue type and icons on dark backgrounds |
| `yellow` | `#FFC72C` | Prices, highlights, the strongest action on a screen |
| `yellow-dark` | `#E5A800` | Yellow hover |
| `text` | `#F4F5F7` | Primary text |
| `muted` | `#A2A8B4` | Secondary text |
| `faint` | `#717886` | Captions, disclaimers |
| `whatsapp` | `#25D366` | WhatsApp controls only |
| `available` / `booked` | `#2ECC71` / `#E5484D` | Calendar states |

### How the three brand colours divide the work

Three accent colours is one more than most palettes can carry, so each has a
single job and never takes another's:

- **Red** is identity and the default action: primary buttons, eyebrows, icon
  outlines, the rule under each heading.
- **Navy** is support: the corporate band, the hero glow, deep gradients. It is
  a surface colour, not a text colour.
- **Yellow** is held back. It marks prices and the one highest-intent action on
  a screen, which is why the hero estimate button and the corporate call-back
  button are yellow while everything else is red.

Section rules run red into navy, echoing the sweep inside the logo.

### Contrast

Two of the logo colours are too dark to serve as text on a dark page, so each
has a lightened counterpart used only for type and icons:

| Pair | Ratio | Verdict |
|---|---|---|
| White on `red` | 5.51:1 | AA for body text |
| `red` as text on `ink` | 3.50:1 | Too low, so `red-bright` is used instead |
| `red-bright` on `ink` | 4.94:1 | AA |
| `navy` as text on `ink` | 1.76:1 | Surface only, never text |
| `blue` on `ink` | 4.88:1 | AA |
| `yellow` on `ink`, `ink` on `yellow` | 12.36:1 | AAA both ways |
| `text` on `ink` | 17.68:1 | AAA |
| `muted` on `ink` | 8.08:1 | AAA |

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
