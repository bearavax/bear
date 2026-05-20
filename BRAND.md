# Avalanche team1 Brand Guide

This is the brand reference for the **Team1 World Cup Predictions** app. The
guide below mirrors the canonical Avalanche team1 Brand Guide; the final
section maps each token to where it lives in this codebase.

## Color System

### Official team1 Brand Colors

| Name           | Hex Code  | Role                          |
| -------------- | --------- | ----------------------------- |
| Ava Red        | `#FF394A` | Primary brand color           |
| Ava Blue       | `#3055B3` | Primary accent color          |
| Secondary Blue | `#058AFF` | Secondary accent color        |
| Light Gray     | `#F5F5F9` | Light theme surface           |
| Dark Gray      | `#161617` | Dark theme surface            |
| Black          | `#000000` | Pure black for backgrounds    |
| White          | `#FFFFFF` | Pure white                    |

### Primary Colors

**Avalanche Red** (Primary Brand Color)
- Primary: `#FF394A`
- Hover: `#e02d3d`
- Gradient Start: `#FF394A`
- Gradient End: `#d02938`

**Usage**: Primary CTAs, interactive elements, brand accents, headings, borders on hover, active states

### Dark Theme (Default)

**Backgrounds**
- Background: `#000000` - Main app background (pure black)
- Surface: `#161617` - Cards, containers
- Surface Variant: `#1a1b1c` - Nested elements
- Surface Hover: `#2a2b2c` - Hover states

**Text**
- Primary Text: `#FF394A` - Headings, emphasized text
- Secondary Text: `#e5e7eb` - Body text, labels
- Tertiary Text: `#9ca3af` - Captions, placeholders
- White: `#ffffff` - High contrast text

**Borders & Effects**
- Border: `#2a2d31`
- Border Hover: `#FF394A`
- Shadow: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)`
- Shadow Card: `0 4px 24px 0 rgba(255, 57, 74, 0.15)`

### Accent Colors

**Brand Accents**
- Ava Blue: `#3055B3` (hover: `#264496`) - Secondary actions
- Secondary Blue: `#058AFF` (hover: `#0470d9`) - Tertiary actions

**Status & Category Colors**
- Green: `#16a34a` - Success states

---

## Logotype Rules

The use of a lowercase "t" is mandatory for all emblem compositions, ensuring
aesthetic consistency across all platforms.

**Always write "team1"** in lowercase. The only exception is when "team1"
appears at the beginning of a sentence — then capitalize as "Team1".

> Never use "TEAM1" in all caps or "Team1" mid-sentence. **Only "team1".**

---

## Typography

Our visual identity is built on clarity and modernity. All typographic
applications and logos exclusively use the Kanit typeface.

### Font Families

**Primary Heading Font**: Kanit Medium (headings, display text, logos)
**Primary Body Font**: Kanit Light (body text, web, documentation)

### Type Scale

**Headings** (Kanit Medium)
- H1: 36px / 2.25rem (Mobile: 30px / 1.875rem)
- H2: 30px / 1.875rem (Mobile: 24px / 1.5rem)
- H3: 24px / 1.5rem (Mobile: 20px / 1.25rem)

**Body Text** (Kanit Light)
- Body: 16px / 1rem
- Body Small: 14px / 0.875rem
- Caption: 12px / 0.75rem

### Font Weights
- Light: 300 (Body text — Kanit Light)
- Medium: 500 (Headings, labels, UI elements — Kanit Medium)

---

## Border Radius

- Cards: `0.75rem` / 12px
- Controls (buttons, inputs): `0.5rem` / 8px
- Labels: `0.25rem` / 4px
- Project logos: `1rem` / 16px

## Visual Effects

### Transitions
- Fast: `150ms ease` - UI interactions
- Medium: `200ms ease` - Transform effects
- Slow: `300ms ease` - Theme transitions

### Hover Effects
- Scale: 1.05 (buttons), translateY(-2px) for cards
- Shadow: Elevated card shadow (red glow)
- Border: Changes to Ava Red

### Focus States
- Box shadow: `0 0 0 3px rgba(255, 57, 74, 0.1)`
- Applied to: Inputs, selects, buttons (no outline)

---

## Applied in this project

Every token above is implemented as a CSS custom property in
[`app/globals.css`](app/globals.css):

| Brand token        | CSS variable          | Notes                              |
| ------------------ | --------------------- | ---------------------------------- |
| Ava Red            | `--ava-red`           | Primary CTA gradient, headings     |
| Ava Red hover      | `--ava-red-hover`     | Link / CTA hover                   |
| Ava Blue           | `--ava-blue`          | Secondary actions                  |
| Secondary Blue     | `--secondary-blue`    | Scoring highlights, info banners   |
| Black              | `--bg`                | App background (dark theme)        |
| Dark Gray          | `--surface`           | Cards and panels                   |
| Primary Text       | `--text-primary`      | All headings (`h1`–`h6`)           |
| Secondary Text     | `--text-secondary`    | Body copy                          |
| Tertiary Text      | `--text-tertiary`     | Captions, `.muted`                 |
| Card radius        | `--radius-card`       | `.panel`, `.group-card`            |
| Control radius     | `--radius-control`    | `.btn`, `.input`, `.team-select`   |
| Card shadow        | `--shadow-card`       | Button / card hover (red glow)     |
| Focus ring         | `--focus-ring`        | Inputs, selects                    |

**Typography**: Kanit is loaded from Google Fonts in
[`app/layout.tsx`](app/layout.tsx). Body text is Kanit Light (300); all
headings and UI labels use Kanit Medium (500).

**Logotype**: the wordmark always renders the lowercase `team1` (see
`components/Nav.tsx`). Sentence-leading uses such as page titles use the
capitalised `Team1` form, per the rule above.
