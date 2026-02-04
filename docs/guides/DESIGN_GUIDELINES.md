# Design Guidelines

Last updated: 2026-01-12

## Doc requirements

- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Every release or monthly (whichever is sooner)

These guidelines keep the UI consistent across ChatGPT widgets and standalone apps.

## Table of contents

- [Core principles](#core-principles)
- [Component usage](#component-usage)
- [Layout and spacing](#layout-and-spacing)
- [Colors and typography](#colors-and-typography)
- [Theme switching](#theme-switching)
- [Icons and imagery](#icons-and-imagery)
- [Accessibility checklist](#accessibility-checklist)
- [UI states checklist](#ui-states-checklist)
- [Review standard](#review-standard)
- [Verify](#verify)
- [Related docs](#related-docs)
- [Appendix A: UI Design Patterns](#appendix-a-ui-design-patterns)
- [Appendix B: Anti-Patterns: UI Design](#appendix-b-anti-patterns-ui-design)
- [Appendix C: Decisions: UI Design](#appendix-c-decisions-ui-design)
- [Appendix D: Sharp Edges: UI Design](#appendix-d-sharp-edges-ui-design)
- [Appendix E: Anti-Patterns: UX Design](#appendix-e-anti-patterns-ux-design)
- [Appendix F: Decisions: UX Design](#appendix-f-decisions-ux-design)
- [Appendix G: Sharp Edges: UX Design](#appendix-g-sharp-edges-ux-design)
- [Appendix H: Branding Anti-Patterns](#appendix-h-branding-anti-patterns)
- [Appendix I: Branding Decisions](#appendix-i-branding-decisions)
- [Appendix J: Branding Sharp Edges](#appendix-j-branding-sharp-edges)

## Core principles

- **Use Apps SDK UI first.** Prefer `@openai/apps-sdk-ui` components and `@design-studio/ui` wrappers.
- **Avoid raw tokens in production UI.** `@design-studio/tokens` is for audits and extensions only.
- **Match the system defaults.** Stick to component defaults before adding custom styling.
- **Accessibility is non-negotiable.** Every interactive control must be usable by keyboard and assistive tech.

## Component usage

### Use the UI library exports

```tsx
import { Button, Card, IconButton } from "@design-studio/ui";
```

If you need tree-shaking, use subpath exports:

```tsx
import { Button, SectionHeader } from "@design-studio/ui/base";
```

### Avoid direct imports from underlying libraries

- Do not import `@radix-ui/*` outside `packages/ui/src/primitives`.
- Do not import `lucide-react` directly; use the icons adapter in `packages/ui/src/icons`.

## Layout and spacing

- Use the layout components (`Card`, `SectionHeader`, `CollapsibleSection`) before writing custom containers.
- Keep page layouts simple: one primary column, consistent padding, and predictable section breaks.
- Prefer `flex` and `grid` layouts with Tailwind utilities; avoid absolute positioning unless required.

## Colors and typography

- Use component defaults and semantic classes from Apps SDK UI.
- Do not hardcode hex colors or raw CSS variables in new UI code.
- If you need a token, add it to `@design-studio/ui` or the Apps SDK UI layer, not directly in the page.
- **Token-only utilities:** use token-backed utilities only (for example, `bg-bg`, `text-fg`, `border-border`, `rounded-md`, `shadow-sm`). Do **not** use raw hex values (like `#fff` or `text-[#111]`) or custom utilities such as `text-[15px]`. For the allowed mapping rules and rationale, see `docs/theming/TOKEN_API_MAPPING.md`.

## Theme switching

- Theme switching is driven by `[data-theme]` attributes (for example, `[data-theme="dark"]`).
- Token values should resolve through CSS variables; do not hardcode per-theme values in components.
- Prefer `bg-bg`, `text-fg`, `border-border`, etc. so theme changes flow through tokens automatically.

## Icons and imagery

- Use existing icons from the adapter before adding new SVGs.
- Provide accessible names for icon-only controls (aria-label, title, or visually hidden text).

## Accessibility checklist

Every new UI surface should pass these checks:

- All interactive elements are reachable by keyboard.
- Focus styles are visible (not color-only).
- Icon-only buttons have accessible labels.
- Dialogs and menus are announced correctly by screen readers.

Use the existing test workflows:

- `pnpm test:a11y:widgets`
- `docs/KEYBOARD_NAVIGATION_TESTS.md`

## UI states checklist

Quick sanity pass for interactive surfaces:

- **Hover:** visible change, no layout shift.
- **Active/pressed:** clear feedback, no contrast loss.
- **Focus (keyboard):** visible ring that is not overridden by hover/active.
- **Disabled:** reduced contrast but legible; hover/focus styles do not apply.
- **Success/error:** semantic color + icon where needed; text remains readable.
- **Loading/empty:** clear feedback; no dead-end UI.

## Review standard

Before merging, verify:

- Component and styling choices are consistent with Apps SDK UI.
- No raw tokens or hex colors were introduced in UI code.
- A11y checks are satisfied and tests are updated if needed.

## Verify

- `pnpm lint:compliance` catches forbidden imports and token misuse.
- `pnpm test:a11y:widgets` confirms keyboard and screen reader paths for widgets.

## Related docs

- Component usage: `packages/ui/README.md`
- Page patterns: `docs/guides/PAGES_QUICK_START.md`
- Accessibility tests: `docs/KEYBOARD_NAVIGATION_TESTS.md`
- Token API mapping: `docs/theming/TOKEN_API_MAPPING.md`
- Storybook taxonomy: `docs/guides/STORYBOOK_TAXONOMY.md`
- Desktop overrides: `docs/guides/DESKTOP_THEME_OVERRIDES.md`

---

# Appendix A: UI Design Patterns

Proven visual design patterns that create clear, usable, and beautiful interfaces within the aStudio design system.

## Pattern 1: Spacing Grid System

**Context:** Establishing consistent spacing and sizing throughout an interface using aStudio's token-based spacing scale.

**The Pattern:**

```
All dimensions are multiples of 4px, using aStudio spacing tokens.

SPACING SCALE:
s4   - Fine adjustments (typography kerning)
s8   - Tight coupling (icon + text)
s16  - Related elements (form field + label)
s24  - Section content
s32  - Section boundaries
s48  - Major section breaks
s64  - Page-level separation

SIZING:
Icon sizes: s16, s24, s32, s40, s48
Button heights: s32 (small), s40 (medium), s48 (large)
Input heights: s40 (standard), s48 (touch-friendly)
Card padding: s16 or s24

EXCEPTIONS:
Typography can use s2 for fine-tuning line-height
Border widths: 1px, 2px are fine

WHY THIS SCALE?
- Based on aStudio's DTCG tokens
- Works with common screen densities
- Easy mental math with base-4
- Industry standard for accessibility

IMPLEMENTATION:
Use Tailwind utilities or CSS variables from @design-studio/tokens:

:root {
  --space-unit: 4px;
  --space-1: var(--s4);    /* 4px */
  --space-2: var(--s8);    /* 8px */
  --space-3: var(--s12);   /* 12px */
  --space-4: var(--s16);   /* 16px */
  --space-6: var(--s24);   /* 24px */
  --space-8: var(--s32);   /* 32px */
  --space-12: var(--s48);  /* 48px */
  --space-16: var(--s64);  /* 64px */
}
```

## Pattern 2: Visual Hierarchy Stack

**Context:** Ensuring users see the most important things first using aStudio's typography and color tokens.

**The Pattern:**

```
HIERARCHY TOOLS (in order of power):

1. SIZE
   Biggest = most important
   Heading1 > Heading2 > Heading3 > Body
   Hero CTA > Secondary CTA

2. COLOR/CONTRAST
   High contrast = draws attention
   Primary color = action
   Muted = secondary

3. WEIGHT
   Bold = emphasis (600 weight)
   Regular = normal (400 weight)
   Light = de-emphasis

4. POSITION
   Top-left = primary (LTR cultures)
   Center = focus point
   Bottom-right = completion/next step

5. WHITE SPACE
   More space around = more importance
   Isolation draws attention

APPLICATION:
┌─────────────────────────────────────────┐
│  BIG BOLD HEADLINE                      │  ← Size + Weight
│  Subtitle with supporting context       │  ← Size (smaller)
│                                         │  ← White space
│  Body text explaining the details       │  ← Normal weight
│  with additional information here.      │
│                                         │
│  [ Primary Action ]  Secondary Link     │  ← Color + Position
└─────────────────────────────────────────┘

RULE: Only ONE primary element per viewport
If everything is emphasized, nothing is.
```

## Pattern 3: Component Anatomy

**Context:** Building components that are flexible but consistent using @design-studio/ui primitives.

**The Pattern:**

```
Every component has these layers:

1. CONTAINER
   - Defines boundaries
   - Sets internal spacing with s16/s24
   - Handles variants (sizes, states)

2. CONTENT
   - The actual stuff inside
   - Text, icons, images
   - Follows its own rules

3. STATES
   - Default
   - Hover
   - Active/Pressed
   - Focus
   - Disabled
   - Loading
   - Error

BUTTON ANATOMY (using @design-studio/ui):
┌─────────────────────────────────┐
│ ┌─ Content ──────────────────┐ │
│ │  [Icon]  Button Text       │ │
│ └────────────────────────────┘ │
│ ← Padding s16 →                │
└─────────────────────────────────┘
↑ Border/Background from tokens

STATES DEFINITION:
.button {
  /* Default */
  background: var(--color-background-primary);

  &:hover {
    background: var(--color-background-secondary);
  }

  &:active {
    background: var(--color-background-tertiary);
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid var(--color-icon-accent);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &[data-loading] {
    color: transparent;
    /* Spinner overlay */
  }
}
```

## Pattern 4: Type Scale with Purpose

**Context:** Creating a typography system that communicates hierarchy using aStudio's type tokens.

**The Pattern:**

```
TYPE SCALE (aStudio responsive tokens):
Hero: 40px / 48px line-height (600 weight)
H1: 36px / 42px line-height (600 weight)
H2: 24px / 28px line-height (600 weight)
H3: 18px / 26px line-height (600 weight)
H4: 16px / 24px line-height (600 weight)
H5: 14px / 20px line-height (600 weight)
H6: 12px / 18px line-height (600 weight)
ParagraphLg: 18px / 26px line-height (400–600 weight)
ParagraphMd: 16px / 24px line-height (400–600 weight)
ParagraphSm: 14px / 20px line-height (400–600 weight)
Caption: 12px / 18px line-height (400–600 weight)

PRACTICAL IMPLEMENTATION:
Use @design-studio/ui text components or Tailwind token classes (preferred):

.text-hero { /* maps to --foundation-hero-* vars */ }
.text-h1 { /* maps to --foundation-h-1-* vars */ }
.text-paragraph-md { /* maps to --foundation-paragraph-md-* vars */ }

Legacy tokens remain for backwards compatibility:
.text-heading-1 / .text-heading-2 / .text-heading-3 / .text-body / .text-body-small

USAGE RULES:
- Never skip heading levels (H1 → H2 → H3)
- Only one H1 per page
- Keep paragraph-md at 16px minimum for accessibility
- Use weight, not just size, for hierarchy
- Prefer semantic text components from @design-studio/ui
```

## Pattern 5: Color System Architecture

**Context:** Building a color system that scales and adapts using aStudio's semantic color tokens.

**The Pattern:**

```
THREE COLOR LAYERS (aStudio approach):

1. FOUNDATION TOKENS (@design-studio/tokens)
   Raw colors with light/dark variants
   Background, text, icon scales

2. SEMANTIC TOKENS (in components)
   --color-primary: var(--icon-accent)
   --color-error: status error colors
   --color-success: status success colors

3. COMPONENT TOKENS (context)
   --button-primary-bg: var(--color-primary)
   --button-primary-text: white
   --input-border: var(--background-tertiary)
   --input-error-border: var(--color-error)

DARK MODE ARCHITECTURE (automatic):
:root {
  --bg-primary: var(--color-background-light-primary);
  --text-primary: var(--color-text-light-primary);
}

[data-theme="dark"] {
  --bg-primary: var(--color-background-dark-primary);
  --text-primary: var(--color-text-dark-primary);
}

/* Components use semantic tokens */
.card {
  background: var(--bg-primary);
  color: var(--text-primary);
}
/* Automatically adapts to dark mode */

ACCESSIBLE COLOR PAIRS:
Always define foreground + background together
Test contrast ratios for each pair
Document minimum requirements
Follow WCAG 2.2 AA standards
```

## Pattern 6: Responsive Layout Strategy

**Context:** Designing layouts that work across all screen sizes using aStudio's responsive approach.

**The Pattern:**

```
BREAKPOINT STRATEGY:
Mobile-first (start small, enhance up)

320px  - Minimum (never design smaller)
375px  - Common mobile
640px  - Large mobile / small tablet
768px  - Tablet
1024px - Small desktop
1280px - Desktop
1536px - Large desktop

LAYOUT SHIFTS:
Mobile (320-639):
  - Single column
  - Stacked navigation (hamburger)
  - Full-width cards
  - Bottom-fixed CTAs

Tablet (640-1023):
  - 2-column where appropriate
  - Visible navigation (possibly collapsed)
  - Side-by-side forms

Desktop (1024+):
  - Multi-column layouts
  - Persistent navigation
  - More information density

FLUID DESIGN RULES:
1. Use relative units (%, vw, rem)
2. Set max-width on containers (1280px typical)
3. Let content breathe with s16/s24 padding
4. Test at awkward widths (600px, 900px)

CONTAINER (using @design-studio/ui patterns):
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--s16);
}

@media (min-width: 640px) {
  .container { padding: 0 var(--s24); }
}

@media (min-width: 1024px) {
  .container { padding: 0 var(--s32); }
}
```

## Pattern 7: Progressive Disclosure

**Context:** Managing complexity by revealing information as needed using @design-studio/ui components.

**The Pattern:**

```
LEVELS OF DISCLOSURE:

Level 1: Essential (always visible)
  - Primary action
  - Key information
  - Navigation essentials

Level 2: Important (one click/tap away)
  - Settings and preferences
  - Additional actions
  - Supporting details

Level 3: Advanced (buried intentionally)
  - Rarely used options
  - Technical settings
  - Destructive actions

IMPLEMENTATION PATTERNS (using @design-studio/ui):

1. COLLAPSIBLE SECTION
   Use CollapsibleSection component
   [+] Section Title
       Expanded content here...
   [+] Another Section

2. TABS
   Use Tab components from Apps SDK UI
   [Tab 1] [Tab 2] [Tab 3]
   ╔═══════════════════════════╗
   ║ Content for selected tab  ║
   ╚═══════════════════════════╝

3. SHOW MORE
   Progressive loading patterns
   First paragraph visible...
   [Show more ↓]

4. PROGRESSIVE FORM
   Step 1: Basic info
   Step 2: Details (appears after step 1)
   Step 3: Confirmation

5. OVERFLOW MENU
   [Primary] [Secondary] [⋮]
                         ├─ Option 1
                         ├─ Option 2
                         └─ Option 3

RULES:
- Primary action never hidden
- Critical info never behind interaction
- Related items disclosed together
- Clear path to find hidden items
```

## Pattern 8: Feedback Loop Design

**Context:** Showing users the system is responding to their actions using aStudio's interaction patterns.

**The Pattern:**

```
EVERY ACTION NEEDS FEEDBACK:

1. IMMEDIATE (0-100ms)
   Button press: Visual change
   Click: State change
   Hover: Cursor + highlight

   .button:active {
     transform: scale(0.98);
     background: var(--color-background-secondary);
   }

2. PROGRESS (100ms - 3s)
   Loading: Spinner or skeleton
   Saving: "Saving..." indicator
   Processing: Progress bar

   <Button loading={isLoading}>
     {isLoading ? 'Saving...' : 'Save'}
   </Button>

3. COMPLETION (instant when done)
   Success: Confirmation + checkmark
   Error: Clear message + recovery
   Warning: Explanation + options

   <Toast type="success">
     ✓ Saved successfully
   </Toast>

4. PERSISTENT STATE
   Saved indicator: "Last saved 2m ago"
   Sync status: Cloud icon with state
   Connection: Online/offline badge

FEEDBACK TYPES:
- Visual: Color, icon, animation
- Textual: Status messages
- Positional: Progress indicators
- Temporal: Timestamps, durations

ANTI-PATTERNS:
✗ Silent failures
✗ Infinite spinners
✗ Success without confirmation
✗ Error without explanation
✗ Action without any response
```

## Pattern 9: Form Design Excellence

**Context:** Creating forms that are easy to complete correctly using @design-studio/ui form components.

**The Pattern:**

```
FORM PRINCIPLES:

1. LABELS
   - Always visible (not just placeholder)
   - Above the field (most scannable)
   - Clear and concise

   <label for="email">Email address</label>
   <input id="email" type="email" />

2. PLACEHOLDER
   - Example, not instruction
   - Disappears on focus

   placeholder="john@example.com"
   NOT: "Enter your email"

3. HELP TEXT
   - Below field
   - Before user makes mistake

   <input id="password" />
   <span class="help">
     Minimum 8 characters
   </span>

4. VALIDATION
   - Real-time when helpful
   - On blur for most fields
   - On submit as backup

   <input id="email" aria-invalid="true" />
   <span class="error" role="alert">
     Please enter a valid email
   </span>

5. LAYOUT
   Single column (usually best)
   Group related fields
   Logical tab order

FIELD SIZING (using tokens):
- Email/Text: Full width
- Phone: Sized for content (s40 height)
- Dates: Sized for content
- State/Country: Sized for dropdown

SUBMIT:
- Clear primary action
- Disabled until valid (with explanation)
- Loading state on submit
- Use Button from @design-studio/ui
```

## Pattern 10: Empty State Design

**Context:** What users see when there's no content yet, using aStudio's illustration and messaging patterns.

**The Pattern:**

```
EMPTY STATE COMPONENTS:

1. ILLUSTRATION
   Friendly, relevant visual
   Not too large (not the point)
   Optional for subtle empty states

2. MESSAGE
   What is this space for?
   Why is it empty?
   "No messages yet"
   "Your cart is empty"

3. ACTION
   How to fill it
   Clear, specific CTA
   "Send your first message"
   "Start shopping"

EXAMPLES:

FIRST-TIME USER:
┌─────────────────────────────────────────┐
│            [Illustration]               │
│                                         │
│        Welcome to Messages!             │
│   Connect with your team in real time   │
│                                         │
│        [ Start a conversation ]         │
└─────────────────────────────────────────┘

SEARCH NO RESULTS:
┌─────────────────────────────────────────┐
│   No results for "xyz123"               │
│                                         │
│   Suggestions:                          │
│   • Check your spelling                 │
│   • Try different keywords              │
│   • Browse categories                   │
│                                         │
│   [ Clear search ]                      │
└─────────────────────────────────────────┘

ERROR STATE:
┌─────────────────────────────────────────┐
│            [Error icon]                 │
│                                         │
│     Unable to load your messages        │
│                                         │
│   [ Try again ]   [ Contact support ]   │
└─────────────────────────────────────────┘

ZERO DATA (Dashboard):
┌─────────────────────────────────────────┐
│   Analytics                             │
│   ┌─────────────────────────────────┐   │
│   │  Once you have visitors,        │   │
│   │  your data will appear here.    │   │
│   │  [Share your site]              │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘

---

# Appendix B: Anti-Patterns: UI Design

These approaches look like reasonable design choices but consistently create confusion, frustration, and poor user experience. Avoid these patterns in aStudio interfaces.

## 1. The Icon Guessing Game

**The Mistake:**
```

Using icons without labels for non-universal actions.

UNIVERSAL ICONS (okay alone):
✓ Search (magnifying glass)
✓ Menu (hamburger)
✓ Close (X)
✓ Home (house)
✓ Settings (gear) - sometimes
✓ Play/Pause (triangle/bars)

NOT UNIVERSAL (need labels):
✗ Abstract icons for features
✗ Industry-specific symbols
✗ Metaphors that don't translate
✗ Multiple possible meanings

EXAMPLES OF CONFUSION:
[🔔] - Notifications? Reminders? Alerts?
[📤] - Share? Upload? Export?
[📋] - Copy? Notes? Tasks? Clipboard?
[🏷️] - Tags? Labels? Categories?

THE FIX:
Icon + Label (best)
Tooltip (acceptable for space constraints)
Only icons for truly universal actions

IMPLEMENTATION (using @design-studio/ui):
<Button>
<Icon name="bell" />
<span>Notifications</span>
</Button>

/_Not this_/
<Button aria-label="Notifications">
<Icon name="custom-bell-variant" />
</Button>

```

**Why It's Wrong:**
- Users spend time guessing instead of doing
- Different cultures interpret icons differently
- Tooltips require hover (no mobile support)
- Users avoid features they don't understand

## 2. The Infinite Scroll Trap

**The Mistake:**
```

Using infinite scroll for content where users need to find specific items.

BAD USE CASES:

- E-commerce product listings
- Search results
- Data tables
- Anything users filter/compare

PROBLEMS:

1. Can't link to specific page
2. Can't estimate content size
3. Footer is unreachable
4. Browser back breaks position
5. "Where was that item I saw?"
6. Performance degrades with length

GOOD USE CASES:

- Social media feeds (consumption)
- Activity logs (time-based)
- Infinite exploration (discovery)

THE FIX - PAGINATION OR LOAD MORE:

Pagination:
[1] [2] [3] [...] [50]
Showing 21-40 of 500 results

Load More:
[Load more results]
Showing 40 of 500 results

Virtual Scrolling (for huge lists):
Renders only visible items
Maintains scroll position
Works with search/filter

```

**Why It's Wrong:**
- Users lose their place
- No mental model of content size
- Poor accessibility
- SEO implications
- Difficult to share or bookmark

## 3. The Carousel Crime

**The Mistake:**
```

Auto-advancing carousels, especially on hero sections.

THE PROBLEMS:

1. Users can't read fast enough
2. Movement causes distraction
3. CTA changes before click
4. Content users want scrolls away
5. Accessibility nightmare
6. ~1% of users click past first slide

RESEARCH SHOWS:

- Hero carousels have near-zero engagement
- Auto-advance increases bounce rate
- Users perceive them as ads (banner blindness)

BAD IMPLEMENTATION:
<Carousel autoAdvance={5000}>
<Slide>Important Message 1</Slide>
<Slide>Important Message 2</Slide>
<Slide>Important Message 3</Slide>
</Carousel>

THE FIX:
Option 1: Pick your best content, feature it static
Option 2: Grid layout showing all options
Option 3: User-controlled carousel (no auto-advance)
Option 4: Vertical scroll (mobile-native)

IF YOU MUST USE CAROUSEL:

- No auto-advance
- Visible navigation dots
- Swipe support
- Pause on hover
- Respect prefers-reduced-motion

```

**Why It's Wrong:**
- Users don't control their experience
- Important content gets missed
- Accessible control is complex
- Mobile swipe conflicts with page scroll

## 4. The Mystery Meat Navigation

**The Mistake:**
```

Navigation where users must interact to discover where things go.

EXAMPLES:

- Icon-only sidebar (hover to reveal labels)
- Hamburger menu hiding primary navigation
- Deep dropdowns requiring precise hovering
- Labels that use internal jargon

BAD:
[🏠] [📊] [⚙️] [👤] // What are these?

[≡] ← Everything hidden here

"Go to Workspace Hub" ← What's a Workspace Hub?

GOOD:
[Home] [Dashboard] [Settings] [Profile]

Primary navigation visible on desktop

"Your projects" ← Users know their projects

```

**Why It's Wrong:**
- Users waste time exploring instead of doing
- Hidden navigation = hidden features
- Reduces discoverability
- Increases time to task

## 5. The Overzealous Validation

**The Mistake:**
```

Validating too aggressively or at the wrong time.

BAD PATTERNS:

1. Immediate error on empty required field
   User tabs into field → instant red error

2. Format validation while typing
   Phone: "5" → "Invalid phone number!"

3. Password requirements shown as errors
   "Must contain uppercase" shown as error
   while user is still typing

4. Clearing the field on invalid input
   User types, gets error, field cleared

GOOD VALIDATION TIMING:

- On blur (after user leaves field)
- On submit (final check)
- Real-time ONLY for success confirmation

GOOD PATTERNS (using @design-studio/ui):
// Show requirements upfront, not as errors
<PasswordField>
<Requirement met={hasUppercase}>
One uppercase letter
</Requirement>
<Requirement met={hasNumber}>
One number
</Requirement>
</PasswordField>

// Validate on blur
<input onBlur={validate} />

// Inline success
<EmailField>
{isValid && <CheckIcon />}
</EmailField>

```

**Why It's Wrong:**
- Creates anxiety before user has chance
- Slows down form completion
- Punishes correct behavior (typing)
- Makes users feel like failures

## 6. The Deceptive Pattern

**The Mistake:**
```

Dark patterns that trick users against their interests.

EXAMPLES:

Confirmshaming:
[ Opt out, I don't like saving money ]

Pre-checked options:
[✓] Sign me up for marketing emails
[✓] Share my data with partners

Hidden unsubscribe:
Unsubscribe link in 6pt font, gray on gray

Misdirection:
[Subscribe Now!] [No thanks, continue in tiny text]

Bait and switch:
"Free Trial" → requires credit card → auto-charges

Roach motel:
Easy to sign up, impossible to delete account

Trick questions:
"Uncheck this box to not receive no emails"

```

**Why It's Wrong:**
- Destroys trust permanently
- Illegal in many jurisdictions (GDPR, CCPA)
- Creates negative brand association
- Users will leave and warn others
- Short-term gains, long-term damage

## 7. The Feature Factory

**The Mistake:**
```

Adding every feature request without considering the interface.

SYMPTOMS:

- Settings page with 47 options
- Toolbar with 30 icons
- Modal with 10 form sections
- Homepage with 15 CTAs
- Navigation with 20+ items

THE RESULT:
[ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
Header with everything

[Feature 1] [Feature 2] [Feature 3] [Feature 4]
[Feature 5] [Feature 6] [Feature 7] [Feature 8]
[Feature 9] [And more...] [See all] [...]

Every element screaming for attention = none get it

THE FIX:

1. Hierarchy: 3 levels max visible at once
2. Progressive disclosure: Show more as needed
3. Smart defaults: Most users never change settings
4. Personas: Design for the 80% use case
5. Say no: Not every request deserves a button

```

**Why It's Wrong:**
- Paradox of choice paralyzes users
- Increased cognitive load
- Nothing feels important
- Power users can't find things either
- Maintenance nightmare

## 8. The Pixel Perfect Obsession

**The Mistake:**
```

Spending days perfecting static designs that break in reality.

WHAT DESIGNERS OBSESS OVER:

- Perfect spacing in one viewport
- Ideal content length
- Specific image dimensions
- Beautiful but fragile layouts

WHAT REALITY DELIVERS:

- Variable content lengths (names, titles)
- User-generated content (any length)
- Different viewport sizes
- Different browsers/devices
- Zoom and text scaling
- Translated content (German is 30% longer)

THE FIX:

1. Design with real content
   Use actual data, not "Lorem ipsum"

2. Test extremes
   What if the name is "X"?
   What if it's 40 characters?

3. Build in flexibility
   Min-width, max-width, truncation

4. Design in browser
   Responsive from the start

5. Accept imperfection
   Consistent systems > pixel-perfect one-offs

```

**Why It's Wrong:**
- The design breaks immediately in production
- Developers make impossible trade-offs
- Real content doesn't match mockups
- Maintenance becomes whack-a-mole

## 9. The Trendy Traps

**The Mistake:**
```

Following design trends without considering usability.

TREND → PROBLEM:

"Neumorphism" (soft 3D emboss)
→ Low contrast, poor accessibility

"Glassmorphism" (frosted glass)
→ Performance issues, contrast depends on background

"Ultra-thin fonts"
→ Unreadable, especially on Windows

"Low contrast aesthetic"
→ Accessibility failure

"Hidden navigation"
→ Discoverability death

"Full-bleed hero video"
→ Performance, distraction, data usage

"Brutalism"
→ Unusable for actual tasks

THE RULE:
Can you use this trend AND maintain:

- WCAG AA contrast (4.5:1)?
- Clear hierarchy?
- Obvious interactions?
- Good performance?
- Cross-device compatibility?

If no, skip the trend.

```

**Why It's Wrong:**
- Trends are optimized for awards, not users
- Usually sacrifices accessibility
- Ages poorly (looks dated quickly)
- Solves designer problems, not user problems

## 10. The One-Size-Fits-None

**The Mistake:**
```

Same exact UI for mobile, tablet, and desktop.

MOBILE PROBLEMS:

- Touch targets too small (hover-sized elements)
- Too much information density
- Horizontal scrolling
- Tiny text
- Unreachable navigation

DESKTOP PROBLEMS:

- Elements too large (mobile-sized)
- Single column wasting space
- Touch-sized buttons look childish
- Missing efficiency features
- Unused screen real estate

THE FIX:
Design for mobile first, then enhance for desktop.

MOBILE-SPECIFIC:

- Bottom navigation (thumb zone)
- Full-width buttons
- Stacked layouts
- Touch-sized targets (44px+)
- Simplified information

DESKTOP-SPECIFIC:

- Horizontal navigation
- Multi-column layouts
- Hover states
- Keyboard shortcuts
- Information density

```

**Why It's Wrong:**
- Each device has different affordances
- Touch vs. cursor requires different targets
- Screen real estate varies 10x
- Context of use differs

## 11. The Notification Nightmare

**The Mistake:**
```

Overusing notifications, badges, and alerts.

THE NOISE:
🔴 (17) Messages
🔴 (3) Notifications
🔴 (5) Updates
🔔 New feature!
💡 Tip: Did you know...
⚠️ Complete your profile
📢 Limited time offer!

User learns to ignore everything.

NOTIFICATION HIERARCHY:
CRITICAL (always interrupt):

- Security alerts
- Transaction confirmations
- Destructive action warnings

IMPORTANT (badge only):

- New messages
- Direct mentions
- Required actions

INFORMATIONAL (in-app only):

- Feature announcements
- Tips and suggestions
- Marketing

NONE (don't notify):

- Someone you don't follow posted
- Weekly newsletter available
- Similar items in stock

THE FIX:

1. Categorize all notifications
2. Aggressive default opt-outs
3. Easy granular controls
4. Respect user preferences
5. Batch non-urgent items

```

**Why It's Wrong:**
- Creates notification fatigue
- Important alerts get ignored
- Users disable all notifications
- Brand becomes annoying

## 12. The False Consistency

**The Mistake:**
```

Applying the same pattern everywhere, even where it hurts.

EXAMPLES:

"All buttons must be blue"
→ Destructive action in blue looks safe

"All forms have same layout"
→ Login form has unnecessary complexity

"All cards look the same"
→ Actionable cards look like info cards

"Same nav everywhere"
→ Full nav during checkout is distracting

"Consistent empty states"
→ Same illustration doesn't help context

THE REALITY:
Consistency is a means, not an end.
The goal is predictability for users.

WHEN TO BREAK CONSISTENCY:

- Destructive actions (should feel different)
- Focused flows (checkout, onboarding)
- Error states (should stand out)
- Celebrations (should feel special)
- Different user contexts

WHAT TO KEEP CONSISTENT:

- Interaction patterns (how things work)
- Language and tone
- Core visual elements (logo, primary colors)
- Spacing and layout systems
- Navigation location

```

**Why It's Wrong:**
- Hurts usability in specific contexts
- Important things don't stand out
- Forces patterns where they don't fit
- Design for process, not for users

---

# Appendix C: Decisions: UI Design

Critical decision points that determine interface success.

## Decision 1: Design Tool Selection

**Context:** Choosing the primary design tool for your team.

**Options:**

| Option | Pros | Cons | Choose When |
|--------|------|------|-------------|
| **Figma** | Collaborative, web-based, industry standard | Subscription cost, Adobe ownership | Default choice for teams |
| **Sketch** | Mac-native, mature ecosystem | Mac only, collaboration requires plugins | Mac-only team, existing Sketch files |
| **Adobe XD** | Adobe integration, free tier | Smaller ecosystem, uncertain future | Heavy Adobe suite users |
| **Framer** | Code-like components, real interactions | Learning curve, expensive | Design-to-code, advanced prototypes |

**Framework:**
```

Design tool selection:

Team size?
├── Solo → Figma (free for individuals)
├── Team → Figma (collaboration built-in)
└── Enterprise → Figma or Sketch (depends on ecosystem)

Existing ecosystem?
├── Adobe suite → Consider XD
├── Heavy prototyping → Framer
└── Standard UI work → Figma

Developer handoff?
├── Need production code → Framer
├── Standard specs → Figma Dev Mode
└── Custom tooling → Any (export to tokens)

Cross-platform team?
├── Windows + Mac → Figma (web-based)
└── Mac only → Sketch is option

FIGMA ADVANTAGES:

1. Real-time collaboration (like Google Docs)
2. Web-based (no installs, any OS)
3. Free for individuals
4. Largest plugin ecosystem
5. Built-in prototyping
6. Dev mode for handoff
7. Industry standard (hiring, resources)

```

**Default Recommendation:** Figma. It's the industry standard, works everywhere, and handles collaboration best. Only consider alternatives with specific justification.

## Decision 2: Color Palette Approach

**Context:** Building a color system for your product.

**Options:**

| Approach | Pros | Cons | Choose When |
|----------|------|------|-------------|
| **Brand-derived** | Strong identity, cohesive | May lack functional colors | Consumer products, brand-heavy |
| **Functional-first** | Clear meaning, accessible | May feel generic | Enterprise, utility apps |
| **Tailwind defaults** | Proven, comprehensive | Same as everyone else | Speed, no designer, MVP |
| **Custom palette** | Unique, precise | Time-consuming, error-prone | Strong design vision, resources |

**Framework:**
```

Color system decision:

Starting point?
├── Strong brand colors → Derive system from brand
├── No brand yet → Start functional, add personality
└── Speed priority → Tailwind or Radix colors

Application type?
├── Consumer/lifestyle → Brand expression important
├── Enterprise/utility → Functional clarity priority
├── Dashboard/data → Neutral base + accent

Required colors:

NEUTRAL SCALE (Gray):

- Background levels (3-4 shades)
- Text levels (3-4 shades)
- Border levels (2-3 shades)

PRIMARY (Brand):

- Main action color
- Hover/active states
- Light variant for backgrounds

SEMANTIC:

- Success (green)
- Warning (yellow/orange)
- Error (red)
- Info (blue)

EXTENDED (optional):

- Secondary brand color
- Accent colors
- Data visualization palette

ACCESSIBILITY CHECK:
Every color pairing must pass contrast
Use tools: Contrast plugin, accessibleweb.com
Minimum 4.5:1 for text, 3:1 for large text/icons

```

**Default Recommendation:** Start with Tailwind or Radix color palette, customize primary to brand. This gives you proven accessible colors with room for identity.

## Decision 3: Typography System

**Context:** Selecting and scaling typefaces for your interface.

**Options:**

| Approach | Pros | Cons | Choose When |
|----------|------|------|-------------|
| **System fonts** | Zero load time, native feel | Less unique, varies by OS | Performance priority, utility apps |
| **Single webfont** | Consistent, brand expression | Load time, licensing cost | Brand consistency matters |
| **Font pair** | Hierarchy, visual interest | Complexity, more loading | Content-heavy, editorial |
| **Variable font** | Flexibility, single file | Browser support, complexity | Modern browsers, design flexibility |

**Framework:**
```

Typography selection:

Performance budget?
├── Strict → System fonts (Inter for cross-platform consistency)
├── Moderate → Single font, 2-3 weights
└── Flexible → Font pair, variable fonts

Content type?
├── Data/UI heavy → Sans-serif (Inter, Roboto)
├── Editorial/reading → Serif or humanist sans
├── Technical/code → Monospace available
└── Brand expression → Custom selection

FONT STACK PATTERNS:

System fonts (fastest):
font-family: system-ui, -apple-system, sans-serif;

Modern fallback:
font-family: 'Inter', system-ui, sans-serif;

Safe web fonts:
font-family: 'Inter', 'Roboto', 'Helvetica Neue', sans-serif;

SCALE APPROACH:

1. Choose base size (16px standard)
2. Choose ratio (1.25 major third, 1.2 minor third)
3. Generate scale: base × ratio^n
4. Round to practical values
5. Limit to 6-8 sizes

WEIGHT USAGE:
400 (Regular) - Body text
500 (Medium) - Subtle emphasis
600 (Semibold) - Strong emphasis, subheadings
700 (Bold) - Headlines, CTAs

```

**Default Recommendation:** Inter (or system fonts) with a major third scale (1.25). Inter is free, designed for screens, and widely supported.

## Decision 4: Component Library Strategy

**Context:** Building or adopting a component library.

**Options:**

| Approach | Pros | Cons | Choose When |
|----------|------|------|-------------|
| **Build from scratch** | Fully custom, exact needs | Expensive, slow, maintenance | Large team, unique needs, long-term |
| **Headless (Radix, Headless UI)** | Accessible, unstyled, flexible | Need design skills | Custom design, accessibility priority |
| **Styled (Chakra, MUI)** | Fast start, full ecosystem | Customization friction, bundle size | MVP, standard design, speed |
| **Tailwind UI** | Beautiful, well-designed | Cost, Tailwind dependency | Tailwind already in stack |

**Framework:**
```

Component library decision:

Team design resources?
├── No designer → Styled library (Chakra, Shadcn)
├── Designer → Headless + custom styles
└── Design team → Consider custom system

Timeline?
├── MVP (weeks) → Styled library
├── Launch (months) → Headless + design
└── Long-term → Custom or hybrid

Unique design requirements?
├── Standard UI → Any library works
├── Custom brand → Headless required
└── Highly unique → Custom build

Tech stack alignment?
├── React → Most options
├── Vue → Vuetify, Headless Vue
├── Svelte → Skeleton, custom

RECOMMENDED APPROACH (React):
shadcn/ui + Radix primitives

- Radix: Accessible headless components
- shadcn: Copy-paste styled components
- Result: Customizable, accessible, owned

COMPONENT OWNERSHIP:

- Copy into your codebase (shadcn model)
- Full control over styling
- Update on your schedule
- No breaking changes from upstream

```

**Default Recommendation:** shadcn/ui for React projects. It gives you beautiful, accessible components that you own and can customize. For non-React, use Radix-style headless libraries.

## Decision 5: Responsive Breakpoint Strategy

**Context:** Defining breakpoints for responsive design.

**Options:**

| Approach | Pros | Cons | Choose When |
|----------|------|------|-------------|
| **Device-based** | Matches real devices | Fragile, devices change | Specific device targets |
| **Content-based** | Breaks where design needs it | Non-standard, harder to communicate | Custom layouts |
| **Framework default** | Standard, documented | May not fit all designs | Using CSS framework |

**Framework:**
```

Breakpoint strategy:

STANDARD BREAKPOINTS (Tailwind):
sm: 640px - Large phones, portrait tablets
md: 768px - Tablets
lg: 1024px - Small desktops, landscape tablets
xl: 1280px - Desktops
2xl: 1536px - Large desktops

COMMON DEVICE WIDTHS (2024):
320px - Older iPhones (SE)
375px - iPhone 12/13 mini
390px - iPhone 14/15
428px - iPhone 14/15 Plus/Pro Max
768px - iPad Mini
820px - iPad Air
1024px - iPad Pro 11"
1366px - Common laptop
1920px - Full HD desktop

MOBILE-FIRST APPROACH:
/_Base styles (mobile)_/
.component { width: 100%; }

/_Tablet and up_/
@media (min-width: 768px) {
.component { width: 50%; }
}

/_Desktop and up_/
@media (min-width: 1024px) {
.component { width: 33.33%; }
}

BREAKPOINT RULES:

1. Mobile-first (start small, enhance)
2. Major layout shifts only (2-3 breakpoints)
3. Container max-width (1280-1440px)
4. Test at awkward sizes (600px, 900px)
5. Don't forget landscape mobile

```

**Default Recommendation:** Use Tailwind's breakpoints (640, 768, 1024, 1280) with mobile-first approach. They're well-tested and standard enough for team communication.

## Decision 6: Icon System

**Context:** Selecting and implementing icons throughout the product.

**Options:**

| Approach | Pros | Cons | Choose When |
|----------|------|------|-------------|
| **Icon font (FontAwesome)** | Easy, widely supported | All icons loaded, styling limits | Quick implementation |
| **SVG library (Heroicons, Lucide)** | Tree-shakable, full control | Setup required | Modern projects, performance |
| **Custom icons** | Unique, exact match | Expensive, maintenance | Strong brand, specific needs |
| **Icon component library** | React/Vue components | Framework lock-in | Component-based apps |

**Framework:**
```

Icon system decision:

Performance priority?
├── High → SVG library (tree-shakable)
├── Medium → Icon fonts okay
└── Low → Either works

Customization needs?
├── Color/size only → Any
├── Animations → SVG required
└── Custom designs → Custom icons

Framework?
├── React → Lucide React, Heroicons React
├── Vue → Heroicons Vue
├── Vanilla → SVG sprites or inline

RECOMMENDED: LUCIDE ICONS

- 1000+ icons
- MIT license (free)
- Tree-shakable
- Consistent style
- React/Vue/Svelte packages
- Active development

IMPLEMENTATION:
// React component approach
import { Home, Settings, User } from 'lucide-react';

<Home size={24} strokeWidth={2} />

// Size system
const iconSizes = {
sm: 16,
md: 20,
lg: 24,
xl: 32,
};

// Wrapper component
function Icon({ name, size = 'md', ...props }) {
const IconComponent = icons[name];
return <IconComponent size={iconSizes[size]} {...props} />;
}

```

**Default Recommendation:** Lucide Icons (React/Vue package). Free, comprehensive, tree-shakable, and maintained. Heroicons is also excellent if you prefer that style.

## Decision 7: Motion/Animation Strategy

**Context:** Defining how and when to use animation.

**Options:**

| Approach | Pros | Cons | Choose When |
|----------|------|------|-------------|
| **Minimal (CSS only)** | Performance, simple | Less polished | Performance priority, utility |
| **Systematic (CSS + JS library)** | Consistent, reusable | Bundle size, learning curve | Refined experience |
| **Heavy animation** | Delightful, impressive | Performance, motion sickness | Marketing, first impressions |
| **None** | Simplest, accessible | Feels static | Accessibility priority |

**Framework:**
```

Animation strategy:

ANIMATION PURPOSES:

1. Feedback - Confirm user action
2. Orientation - Show where elements came from/go
3. Attention - Draw eye to changes
4. Delight - Make experience enjoyable

TIMING GUIDELINES:
Micro (buttons, inputs): 100-150ms
Small (dropdowns, tooltips): 150-200ms
Medium (modals, panels): 200-300ms
Large (page transitions): 300-500ms

Never exceed 500ms for UI animation

EASING:
ease-out: Entrances (element arriving)
ease-in: Exits (element leaving)
ease-in-out: Position changes (moving)
linear: Opacity, looping animations

CSS-FIRST APPROACH:
.button {
transition:
background-color 150ms ease-out,
transform 100ms ease-out;
}

.button:hover {
background-color: var(--primary-hover);
}

.button:active {
transform: scale(0.98);
}

REDUCED MOTION:
@media (prefers-reduced-motion: reduce) {
_,
_::before,
\*::after {
animation-duration: 0.01ms !important;
transition-duration: 0.01ms !important;
animation-iteration-count: 1 !important;
}
}

```

**Default Recommendation:** Minimal CSS-first with systematic tokens. Use Framer Motion or similar only for complex interactions. Always respect prefers-reduced-motion.

## Decision 8: Dark Mode Strategy

**Context:** Whether and how to implement dark mode.

**Options:**

| Approach | Pros | Cons | Choose When |
|----------|------|------|-------------|
| **Light only** | Simpler, less maintenance | Missing user preference | MVP, resource constraints |
| **Dark only** | Trendy, less eye strain | Limits audience | Developer tools, media apps |
| **System preference** | Respects user, automatic | Less control | Most products |
| **User toggle + system** | Maximum control | Most complex | Full product |

**Framework:**
```

Dark mode decision:

User expectations?
├── Developer/tech audience → Dark mode expected
├── General consumer → Nice to have
├── Professional/enterprise → Light typically preferred

Implementation complexity budget?
├── Low → Skip or light-only
├── Medium → System preference only
├── High → Full toggle + system

IMPLEMENTATION:

CSS Variables approach:
:root {
--bg-primary: white;
--text-primary: #1a1a1a;
}

[data-theme="dark"] {
--bg-primary: #1a1a1a;
--text-primary: #fafafa;
}

/_Or system preference_/
@media (prefers-color-scheme: dark) {
:root {
--bg-primary: #1a1a1a;
--text-primary: #fafafa;
}
}

DARK MODE PITFALLS:

1. Don't just invert colors
2. Reduce contrast slightly (not pure white on black)
3. Use darker shadows, not lighter
4. Images may need adjustment
5. Test every screen

COLOR ADJUSTMENT:
Light mode: Gray-900 on White
Dark mode: Gray-100 on Gray-900 (not pure)

Light shadows: rgba(0,0,0,0.1)
Dark shadows: rgba(0,0,0,0.3)

```

**Default Recommendation:** System preference detection with CSS custom properties. Add user toggle if audience expects it. Don't skip the work of properly adapting colors.

## Decision 9: Form Field Style

**Context:** Choosing how form inputs look and behave.

**Options:**

| Style | Pros | Cons | Choose When |
|-------|------|------|-------------|
| **Outlined** | Clear boundaries, accessible | Takes more space | Default, most forms |
| **Filled** | Compact, material design | Less distinct boundaries | Dense forms, Material |
| **Underlined** | Minimal, elegant | Less clear, accessibility | Simple forms, minimal aesthetic |
| **Floating label** | Saves space, animated | Complex, accessibility issues | Space constraints |

**Framework:**
```

Form field decision:

OUTLINED (Recommended default):
┌─────────────────────────────────┐
│ placeholder │
└─────────────────────────────────┘

Label above:
Email
┌─────────────────────────────────┐
│ <john@example.com> │
└─────────────────────────────────┘

FILLED:
╔═════════════════════════════════╗
║ placeholder ║
╚═════════════════════════════════╝

UNDERLINED:
placeholder
─────────────────────────────────

FLOATING LABEL:
Email
┌─────────────────────────────────┐
│ <john@example.com> │
└─────────────────────────────────┘

ACCESSIBILITY CHECKLIST:
□ Label always visible (not placeholder-only)
□ Error state clear and described
□ Focus state visible
□ Touch target 44px minimum
□ Contrast meets WCAG

RECOMMENDED PATTERN:

<div class="field">
  <label for="email">Email</label>
  <input id="email" type="email" />
  <span class="error" role="alert" hidden>
    Please enter a valid email
  </span>
</div>
```

**Default Recommendation:** Outlined inputs with labels above. Most accessible, clearest, and works in all contexts. Avoid floating labels unless absolutely necessary for space.

## Decision 10: Design Token Organization

**Context:** Structuring design tokens for scalability.

**Options:**

| Approach       | Pros                | Cons                      | Choose When                |
| -------------- | ------------------- | ------------------------- | -------------------------- |
| **Flat**       | Simple, quick       | Doesn't scale, no theming | Small project              |
| **Semantic**   | Meaningful names    | More abstraction          | Medium project             |
| **Multi-tier** | Maximum flexibility | Complex                   | Large project, multi-brand |

**Framework:**

```
Token architecture:

TIER 1: PRIMITIVES (Raw values)
--blue-500: #3b82f6;
--gray-900: #111827;
--space-4: 1rem;

TIER 2: SEMANTIC (Meaning)
--color-primary: var(--blue-500);
--color-text: var(--gray-900);
--spacing-md: var(--space-4);

TIER 3: COMPONENT (Context)
--button-bg: var(--color-primary);
--button-padding: var(--spacing-md);

ORGANIZATION:
tokens/
├── primitives/
│   ├── colors.css
│   ├── spacing.css
│   └── typography.css
├── semantic/
│   ├── colors.css
│   └── spacing.css
├── components/
│   ├── button.css
│   ├── input.css
│   └── card.css
└── themes/
    ├── light.css
    └── dark.css

THEMING WITH TIERS:
/* Base theme */
:root {
  --color-bg: white;
  --color-text: #1a1a1a;
}

/* Dark theme overrides semantic, not primitive */
[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #fafafa;
}

/* Component tokens use semantic */
.card {
  background: var(--color-bg);
  color: var(--color-text);
}
/* Automatically themed */
```

**Default Recommendation:** Two-tier (primitives + semantic) for most projects. Add component tier when you have a design system with multiple products or themes.

---

# Appendix D: Sharp Edges: UI Design

Critical mistakes that make interfaces confusing, inaccessible, or unusable.

## 1. The Contrast Crime

**Severity:** Critical
**Situation:** Using light gray text on white, or any low-contrast combination
**Why Dangerous:** WCAG requires 4.5:1 for normal text, 3:1 for large text. Low contrast fails 15% of users.

```
THE TRAP:
"Light gray looks more elegant"
"The brand colors are soft pastels"
"It looks fine on my Retina display"

THE REALITY:
- 8% of men have color vision deficiency
- Screen brightness varies wildly
- Aging eyes need more contrast
- Sunlight on mobile screens

BAD:
#999999 on #FFFFFF → 2.85:1 (FAILS)
#CCCCCC on #FFFFFF → 1.60:1 (FAILS)
Light blue on white  → Usually fails

GOOD:
#595959 on #FFFFFF → 7.0:1 (AAA)
#767676 on #FFFFFF → 4.54:1 (AA)
Use a contrast checker, every time
```

## 2. The Touch Target Terror

**Severity:** Critical
**Situation:** Interactive elements smaller than 44x44px on mobile
**Why Dangerous:** Small targets = misclicks, frustration, accessibility failure.

```
THE TRAP:
- Icon buttons at 24px
- Links in dense text
- Close buttons in corners
- Checkbox labels that don't work

MINIMUM SIZES:
Touch: 44x44 CSS pixels

FIXES:
1. Padding increases hit area
   <button style="padding: 12px">
     <icon size="20px" />
   </button>
   // Icon is 20px, target is 44px

2. Invisible touch expansion
   button::before {
     content: '';
     position: absolute;
     inset: -12px;
   }

3. Full-width list items
   Entire row is clickable, not just text
```

## 3. The Font Size Fiasco

**Severity:** High
**Situation:** Body text below 16px, or not respecting user font settings
**Why Dangerous:** Small text is unreadable. Fixed text breaks accessibility.

```
THE TRAP:
- 12px body text "looks cleaner"
- Using px instead of rem
- !important on font sizes
- Ignoring browser zoom

MINIMUM SIZES:
Body text: 16px (1rem) minimum
Captions: 14px with good contrast
Never go below 12px for anything

RESPONSIVE TYPE:
/* Base */
html { font-size: 100%; } /* 16px default */

/* Scale with viewport, within limits */
html {
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
}

/* Allow user preferences */
html {
  font-size: 100%; /* Respects browser setting */
}
p {
  font-size: 1rem; /* Scales with user preference */
}
```

## 4. The Inconsistent Component

**Severity:** High
**Situation:** Same component looks or behaves differently across the product
**Why Dangerous:** Inconsistency creates cognitive load. Users must relearn.

```
THE TRAP:
Button styles:
- Page A: Rounded, blue, 14px
- Page B: Square, green, 16px
- Page C: Pill, blue, 12px

THE FIX - DESIGN TOKENS:
/* Single source of truth */
:root {
  --button-radius: 6px;
  --button-primary-bg: #2563eb;
  --button-font-size: 0.875rem;
  --button-padding: 0.5rem 1rem;
}

/* All buttons use tokens */
.button {
  border-radius: var(--button-radius);
  background: var(--button-primary-bg);
  font-size: var(--button-font-size);
  padding: var(--button-padding);
}

COMPONENT LIBRARY:
1. Document all variants
2. Show usage guidelines
3. Explain when to use each
4. Lock down modifications
```

## 5. The Disabled State Disaster

**Severity:** High
**Situation:** Disabled elements that are invisible or confusing
**Why Dangerous:** Users don't understand what's wrong or what to do.

```
BAD PATTERNS:
- Light gray on light gray (invisible)
- No cursor change
- No explanation why it's disabled
- Removes the element entirely

GOOD DISABLED STATES:
1. Visible but clearly inactive
   opacity: 0.5;
   cursor: not-allowed;

2. Explain WHY it's disabled
   <button disabled aria-describedby="why">
     Submit
   </button>
   <span id="why">
     Please fill required fields
   </span>

3. Show what enables it
   "Add items to cart to checkout"

4. Consider hiding vs disabling
   If users can NEVER use it → hide
   If users need to DO something → disable + explain
```

## 6. The Color-Only Meaning

**Severity:** Critical (Accessibility)
**Situation:** Using color as the only way to convey information
**Why Dangerous:** Color blind users, monochrome displays, print.

```
BAD:
- Red = error, green = success (only)
- Required fields marked with red asterisk only
- Charts with colored lines only
- Status dots with no text

GOOD:
Error: Red color + icon + text
  ❌ Email is invalid

Success: Green color + icon + text
  ✓ Saved successfully

Required: Asterisk + label text
  Email* (required)

Charts: Color + pattern + labels
  [///] Revenue (green, striped)
  [===] Costs (red, dashed)

Status: Color + icon + text
  🟢 Online | 🔴 Offline
  ✓ Active | ✗ Inactive
```

## 7. The Modal Trap

**Severity:** High
**Situation:** Modals that trap users, stack infinitely, or lack escape
**Why Dangerous:** Users feel stuck. Keyboard users literally are stuck.

```
MODAL REQUIREMENTS:

1. Focus trap (accessibility)
   Focus must stay inside modal
   Tab cycles through modal elements

2. Escape routes
   - X button (obvious)
   - Escape key (keyboard)
   - Click outside (optional but expected)

3. Return focus
   When modal closes, focus returns to trigger

4. No modal inception
   Modal → Modal → Modal = UX nightmare
   If you need this, rethink the flow

5. Scroll lock
   Body doesn't scroll behind modal
   Modal content scrolls if needed

6. Mobile consideration
   Full screen or bottom sheet
   Not a tiny box in the middle

ARIA REQUIREMENTS:
<div role="dialog"
     aria-modal="true"
     aria-labelledby="modal-title"
     aria-describedby="modal-desc">
```

## 8. The Invisible Focus

**Severity:** Critical (Accessibility)
**Situation:** Removing focus outlines with `outline: none`
**Why Dangerous:** Keyboard users cannot navigate. WCAG violation.

```
THE CRIME:
*:focus {
  outline: none; /* NEVER DO THIS */
}

button:focus {
  outline: 0; /* STILL BAD */
}

THE FIX - FOCUS-VISIBLE:
/* Only hide for mouse users */
button:focus {
  outline: none;
}

button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Or use a custom focus style */
button:focus-visible {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
}

REQUIREMENTS:
- Clearly visible
- High contrast
- Consistent across site
- Works on all interactive elements
```

## 9. The Animation Assault

**Severity:** High
**Situation:** Animations that are too fast, too slow, or too much
**Why Dangerous:** Motion sickness, vestibular disorders, distraction.

```
BAD ANIMATIONS:
- Duration > 500ms (feels slow)
- Duration < 100ms (feels jarring)
- Parallax scrolling
- Auto-playing video backgrounds
- Infinite loading spinners
- Bounce/elastic that's too bouncy

GOOD ANIMATION PRINCIPLES:
Duration: 150-300ms for most UI
Easing: ease-out for entrances
        ease-in for exits
        ease-in-out for position changes

RESPECT PREFERENCES:
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

PURPOSE OF MOTION:
✓ Showing connection (this came from there)
✓ Confirming action (button pressed)
✓ Guiding attention (notification appeared)
✗ Decoration (things floating around)
```

## 10. The Spacing Chaos

**Severity:** High
**Situation:** Inconsistent spacing throughout the interface
**Why Dangerous:** Creates visual disorder, breaks grouping, looks amateur.

```
THE CHAOS:
margin: 17px; /* why 17? */
padding: 13px 22px; /* random */
gap: 9px; /* no rhythm */

THE SYSTEM - 4px/8px BASE:
4px   - Minimal (icon to text)
8px   - Tight (related items)
16px  - Standard (form fields)
24px  - Relaxed (sections)
32px  - Spacious (major sections)
48px  - Dramatic (page breaks)
64px  - Maximum (hero sections)

IMPLEMENTATION:
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 1rem;     /* 16px */
  --space-4: 1.5rem;   /* 24px */
  --space-5: 2rem;     /* 32px */
  --space-6: 3rem;     /* 48px */
  --space-7: 4rem;     /* 64px */
}

LAW OF PROXIMITY:
Related items: Close together
Unrelated items: Far apart
The space BETWEEN tells users what BELONGS together
```

## 11. The Hover-Only Action

**Severity:** Critical
**Situation:** Important actions only visible on hover
**Why Dangerous:** Touch devices have no hover. Discovery impossible.

```
BAD PATTERNS:
- Delete button appears on row hover
- Edit controls hidden until hover
- Navigation submenus on hover only
- Tooltips with essential info

THE PROBLEM:
- Mobile: No hover state exists
- Keyboard: No cursor to trigger
- Discoverability: Users don't know to hover

ALTERNATIVES:
1. Always visible (best for critical actions)
   [Item Name]  [Edit] [Delete]

2. Progressive disclosure
   [Item Name]  [...] → [Edit] [Delete]
   Three-dot menu is discoverable

3. Swipe actions (mobile)
   ← Swipe reveals actions →
   With visual hint it's possible

4. Long press (touch)
   Context menu on long press
   But provide alternative

5. Selection mode
   [□] Select items → bulk action bar appears
```

## 12. The Z-Index War

**Severity:** Medium
**Situation:** Z-index values spiraling: 999, 9999, 99999...
**Why Dangerous:** Unmaintainable. Components fight. Bugs appear randomly.

```
THE WAR:
.dropdown { z-index: 100; }
.modal { z-index: 999; }
.toast { z-index: 9999; }
.tooltip { z-index: 99999; }
/* New dev adds emergency fix */
.important { z-index: 999999999; }

THE PEACE - STACKING CONTEXT SCALE:
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
  --z-toast: 800;
}

RULES:
1. Use the scale, nothing outside it
2. Create stacking contexts intentionally
3. Document the hierarchy
4. Review z-index in code review

STACKING CONTEXT RESET:
.modal {
  isolation: isolate; /* New stacking context */
}
/* Children z-index only compete within modal */
```

---

# Appendix E: Anti-Patterns: UX Design

These approaches look like reasonable design decisions but consistently create confusion and frustration.

## 1. The False Door Test

**The Mistake:**

```
Testing demand by showing features that don't exist.

"Click here for Premium Features"
→ User clicks
→ "Thanks! Premium coming soon. Enter email."

User expectations shattered.
Trust damaged.
```

**Why It's Wrong:**

- Users feel tricked
- Damages brand trust
- Generates false demand data (clicks ≠ purchases)
- Creates negative word-of-mouth
- Users don't return when feature launches

**Better Approach:**

```
HONEST VALIDATION:
1. Landing page test
   "We're considering building X"
   "Would you be interested?"
   [Join waitlist]

   Clearly communicate it doesn't exist yet.

2. Wizard of Oz
   Feature appears to work
   But manually operated behind scenes
   Real experience, not fake promise

3. Concierge MVP
   "We'll do X for you manually"
   Test value proposition honestly
   Users know it's manual

4. Smoke test with clarity
   "Premium - Coming Soon"
   No fake button, just interest gauge
```

## 2. The Wizard of Overwhelm

**The Mistake:**

```
10-step onboarding wizard that users must complete.

Step 1: Enter your info
Step 2: Customize preferences
Step 3: Connect accounts
Step 4: Set up integrations
Step 5: Configure notifications
Step 6: Choose theme
Step 7: Invite team
Step 8: Complete tutorial
Step 9: Set goals
Step 10: Survey

90% drop off by step 3.
```

**Why It's Wrong:**

- Users just want to use the product
- Too much before any value
- Creates anxiety and abandonment
- Information overload before context
- Users can't make good choices yet

**Better Approach:**

```
PROGRESSIVE ONBOARDING:
Step 1: Minimum to start
  - Name, email, password
  - Or social login

Step 2: Quick win
  - Show value immediately
  - Complete one core task
  - Feel accomplishment

Step 3: Just-in-time learning
  - Explain features when relevant
  - "First time here? [Quick tip]"
  - Optional, dismissible

Ongoing: Progressive profiling
  - Ask for more info over time
  - When contextually relevant
  - "To share with your team, invite them here"

ONBOARDING METRICS:
Time to first value < 2 minutes
Required steps < 3
Optional steps = 0 (all just-in-time)
```

## 3. The Kitchen Sink Dashboard

**The Mistake:**

```
Dashboard showing every possible metric and widget.

┌─────────────────────────────────────────────┐
│ Users │ Revenue │ Sessions │ Bounces │ ... │
├─────────────────────────────────────────────┤
│ Chart │ Chart │ Chart │ Chart │ Chart │ ... │
├─────────────────────────────────────────────┤
│ Table │ Table │ Table │ List │ Stats │ ... │
├─────────────────────────────────────────────┤
│ More charts, more tables, more everything  │
└─────────────────────────────────────────────┘

User: "What am I supposed to look at?"
```

**Why It's Wrong:**

- No hierarchy = no focus
- Information overload
- Key insights buried
- Slow loading, cluttered interface
- Anxiety-inducing

**Better Approach:**

```
ACTIONABLE DASHBOARDS:

1. Start with questions
   "What does the user need to know?"
   "What actions might they take?"

2. Hierarchy of importance
   Primary: 1-2 key metrics
   Secondary: 3-4 supporting metrics
   Tertiary: Available on drill-down

3. Progressive disclosure
   Overview → Click for details
   Summary → Expand for breakdown

4. Clear layout
   ┌─────────────────────────────────┐
   │  KEY METRIC                     │
   │  What matters most right now    │
   ├─────────────────────────────────┤
   │ Supporting │ Supporting │ Trend │
   ├─────────────────────────────────┤
   │ Details available on request    │
   └─────────────────────────────────┘

5. Personalization
   Let users configure what they see
   Remember preferences
```

## 4. The Feature Announcement Bombardment

**The Mistake:**

```
Every session starts with:
"What's New! Check out these 10 features!"
[Modal blocks everything]

User dismisses.

Next day:
"Don't miss these updates!"
[Another modal]

User wants to do their work.
```

**Why It's Wrong:**

- Interrupts user's intent
- Creates announcement blindness
- Users start dismissing without reading
- Doesn't target relevant users
- Annoying

**Better Approach:**

```
CONTEXTUAL ANNOUNCEMENTS:

1. In-context notices
   When user navigates to feature
   "New! This now supports..."
   Small, dismissible badge

2. Changelog page
   Dedicated place for updates
   Users check when interested
   Searchable, organized

3. Targeted announcements
   Only show to users who'd benefit
   "You've used X a lot. Try new Y."

4. Progressive announcements
   Don't announce everything at once
   Space out over sessions
   Priority to high-impact

5. Passive indicators
   "New" badges on menu items
   Explore at user's pace
   No interruption

RULE:
Announcements should be:
- Targeted to relevant users
- Shown in relevant context
- Easily dismissible
- Not repeated after dismissal
```

## 5. The Settings Labyrinth

**The Mistake:**

```
Settings buried in endless nesting:

Settings
└── Account
    └── Preferences
        └── Notifications
            └── Email
                └── Frequency
                    └── Marketing
                        └── The thing you wanted

User: "Where is the setting to turn off emails?"
```

**Why It's Wrong:**

- Impossible to find things
- Mental model mismatch
- Creates support requests
- Users give up
- Settings become undiscoverable

**Better Approach:**

```
SETTINGS ORGANIZATION:

1. Flat when possible
   Settings page with clear sections
   No more than 2 levels deep

2. Searchable settings
   [Search settings...]
   "notifications" → jumps to section

3. Grouped by task
   Not by system architecture
   "Email preferences" not "SMTP configuration"

4. Most common = most visible
   Settings users need frequently → top
   Advanced/rare → bottom or hidden

5. Smart shortcuts
   Link to settings from relevant places
   Error message → link to fix setting
   Feature → link to configure it

STRUCTURE:
Settings
├── Account (name, email, password)
├── Notifications (all types, one place)
├── Appearance (theme, layout)
├── Privacy (data, sharing)
├── Integrations (connected apps)
└── Advanced (rarely used, clearly labeled)
```

## 6. The Infinite Personalization

**The Mistake:**

```
"Make it your own!"

Choose your:
- Theme (50 options)
- Layout (10 options)
- Font (30 options)
- Color scheme (unlimited)
- Widget arrangement (customizable)
- Dashboard modules (20+ options)
- Sidebar configuration
- ... more customization

User just wants to use the product.
```

**Why It's Wrong:**

- Paradox of choice
- Decision fatigue before value
- Creates maintenance burden
- Makes support harder (infinite configs)
- Users rarely change defaults anyway

**Better Approach:**

```
MEANINGFUL CUSTOMIZATION:

1. Smart defaults first
   Work great out of the box
   Customization optional

2. Curated options
   3-5 themes, not 50
   "Light / Dark / System" not color pickers

3. Progressive access
   Basics visible
   "Advanced customization" for power users

4. Presets over granular
   "Minimal" "Balanced" "Information Dense"
   Not 100 individual toggles

5. Learn from behavior
   "You use feature X a lot"
   "Would you like it on your dashboard?"

CUSTOMIZATION HIERARCHY:
Essential: 2-3 options (theme, notifications)
Common: 5-10 options (layout preferences)
Advanced: Hidden until requested
Power user: API/config file access
```

## 7. The Modal Madness

**The Mistake:**

```
Modal → Button → Another Modal → Button → Another Modal

"Are you sure?"
  [Yes]
    "This will affect..."
      [Continue]
        "Please confirm..."
          [OK]
            "Final warning..."
              [I'm Sure]
                Finally does the thing
```

**Why It's Wrong:**

- Exhausting
- Trains users to click through blindly
- Real warnings get ignored
- Shows lack of design effort
- Creates anxiety

**Better Approach:**

```
MODAL ALTERNATIVES:

1. Undo instead of confirm
   Just do it → offer undo
   Faster, less intrusive

2. Inline expansion
   Expand in place, no modal
   Keep user in context

3. Bottom sheets (mobile)
   Less disruptive
   Easy dismiss

4. Slide panels
   Related content in panel
   Main view still visible

5. Confirmation in-flow
   "Deleting 5 items" [Cancel] [Delete]
   No separate modal needed

WHEN MODALS ARE OK:
- Truly destructive actions
- Important decisions that need focus
- First-time critical information
- When you must interrupt

MODAL RULES:
- One modal at a time (never stack)
- Clear close/escape options
- Focused, minimal content
- Obvious primary action
```

## 8. The Perfection Paralysis

**The Mistake:**

```
Spending 6 months perfecting every pixel of a design
that users will actually hate when they use it.

"We need to get this perfect before showing users"
"Let's add one more design review"
"The animation needs more polish"

Meanwhile, building the wrong thing perfectly.
```

**Why It's Wrong:**

- User feedback comes too late
- Assumptions go unchallenged
- Expensive to change late
- Perfect design for wrong problem
- Teams fall in love with solutions

**Better Approach:**

```
TEST EARLY, TEST OFTEN:

Week 1: Problem validation
  Do users have this problem?
  Talk to 5-8 users

Week 2: Concept testing
  Paper sketches, rough wireframes
  "What do you think this does?"

Week 3: Usability testing
  Clickable prototype (not polished)
  5 users, observe, learn

Week 4+: Iterate based on feedback
  Polish what's validated
  Cut what doesn't work

TESTING ARTIFACTS:
- Paper sketches (earliest)
- Wireframes
- Clickable prototypes (Figma)
- Coded prototypes
- Beta features (production)

RULE:
If you're more than 2 weeks from user feedback,
you're too far from reality.

"Perfect" after feedback > "Perfect" before
```

## 9. The Research Theater

**The Mistake:**

```
"We did user research"

Research: 2-hour meeting where stakeholders
discussed what they think users want.

Or: Survey with leading questions.
"Would you use a feature that helps you save time?"
100% said yes. Ship it.

Or: Focus group with recruited participants
who say what they think you want to hear.
```

**Why It's Wrong:**

- Confirms existing biases
- Doesn't represent real behavior
- Leading questions = useless data
- Group dynamics skew responses
- "Would you" ≠ "Do you"

**Better Approach:**

```
REAL USER RESEARCH:

1. Behavioral observation
   Watch users use the product
   Note struggles, workarounds
   Don't intervene or explain

2. Contextual inquiry
   Talk to users in their environment
   See how they actually work
   Understand real context

3. Unbiased interview questions
   "Tell me about the last time you..."
   "What happened next?"
   "Why did you do it that way?"
   NOT: "Would you like feature X?"

4. Prototype testing
   Give users tasks
   Watch them try
   "Think aloud"

5. Analytics + Observation
   Data shows what
   Observation shows why
   Both together = insight

SAMPLE SIZE:
Qualitative research: 5-8 users finds 80% of issues
Survey/quantitative: Statistical significance needed

RULE:
If you haven't watched users struggle,
you don't understand the problem.
```

## 10. The Metric Obsession

**The Mistake:**

```
"We need to increase clicks on Feature X"

Designer adds:
- Pop-up prompting Feature X
- Banner advertising Feature X
- Notification about Feature X
- Tooltip pointing to Feature X

Clicks on X: ⬆️ 200%
User satisfaction: ⬇️ 50%
Referrals: ⬇️ 30%
But we hit the metric!
```

**Why It's Wrong:**

- Metrics are proxies, not goals
- Easy to game metrics badly
- Short-term gain, long-term damage
- Ignores holistic experience
- Dark patterns emerge

**Better Approach:**

```
BALANCED METRICS:

1. North Star metric
   Single metric representing user value
   "Weekly active users completing core task"

2. Supporting metrics (balanced)
   Engagement: Are they using it?
   Satisfaction: Are they happy?
   Retention: Do they come back?
   Virality: Do they recommend?

3. Counter-metrics
   For every metric you push, track counter
   Push sign-ups → track activation rate
   Push engagement → track churn
   Push clicks → track satisfaction

4. Qualitative check
   Numbers tell what
   Conversations tell why
   Both required

METRIC HIERARCHY:
User value > Business value > Vanity metrics

QUESTIONS TO ASK:
"Would a user thank us for this change?"
"Would we be proud to tell users about this?"
"Does this make the product better, or just bump a number?"
```

## 11. The Edge Case Neglect

**The Mistake:**

```
Design looks great with sample data:
- Perfect product photos
- Ideal-length titles
- Complete user profiles
- Standard use cases

Production reality:
- No image uploaded
- Title with 200 characters
- Profile with only email
- User from unexpected country
- User on 3G network
- User with screen reader

Interface breaks everywhere.
```

**Why It's Wrong:**

- Real users don't match samples
- Edge cases are common in aggregate
- Creates poor first impressions
- Accessibility failures
- Support burden increases

**Better Approach:**

```
DESIGN FOR EDGES:

1. Empty states
   What if no data yet?
   What if data deleted?
   What if loading forever?

2. Extreme content
   Very long text (truncation)
   Very short text (min-width)
   No image (placeholder)
   Many items (pagination)

3. Error states
   Network failure
   Server error
   Validation failure
   Permission denied

4. User variations
   New user, power user
   Mobile, desktop, tablet
   Slow connection, offline
   Screen reader, keyboard-only

5. Stress testing designs
   Before dev, test with:
   - Real content (not lorem ipsum)
   - Edge case content
   - Error scenarios
   - Diverse user types

CHECKLIST FOR EVERY FEATURE:
□ Empty state designed
□ Error state designed
□ Loading state designed
□ Long content handled
□ Missing data handled
□ Mobile variation considered
□ Accessibility verified
```

## 12. The Consistency Trap

**The Mistake:**

```
"We must be consistent!"

Same pattern applied everywhere:
- Checkout has full navigation (distracting)
- Error pages have full navigation (user is lost)
- Onboarding has same density as dashboard
- Destructive action uses same button as safe action
- Every form has same layout (even when wrong)
```

**Why It's Wrong:**

- Consistency is a means, not an end
- Different contexts need different solutions
- Foolish consistency hurts usability
- Ignores user's current mental state
- Blocks appropriate innovation

**Better Approach:**

```
PURPOSEFUL CONSISTENCY:

Consistent (across all contexts):
- Brand voice and tone
- Core interactions (how buttons work)
- Visual language (colors, typography)
- Navigation patterns
- Terminology

Contextual (varies by situation):
- Information density
- Navigation visibility
- Distraction level
- Emphasis and hierarchy
- Error handling approach

EXAMPLES:
Checkout: Hide navigation, focus on task
Dashboard: Show all navigation options
Onboarding: Progressive, limited options
Error recovery: Clear path forward, not full nav

RULE:
"Does consistency serve the user here?"
If no, break it intentionally.
Document why.

PREDICTABLE > CONSISTENT
Users should predict behavior
Not see identical interfaces everywhere
```

---

# Appendix F: Decisions: UX Design

Critical decision points that determine user experience success.

## Decision 1: Research Method Selection

**Context:** Choosing how to learn about users for a specific question.

**Options:**

| Method                | Pros                          | Cons                         | Choose When                             |
| --------------------- | ----------------------------- | ---------------------------- | --------------------------------------- |
| **User Interviews**   | Deep insights, context, "why" | Time-intensive, small sample | Understanding motivations, new problems |
| **Usability Testing** | Observes real behavior        | Lab vs. reality gap          | Validating designs, finding issues      |
| **Surveys**           | Large sample, quantifiable    | Surface-level, bias-prone    | Measuring attitudes, demographics       |
| **Analytics**         | Real behavior, scale          | No "why," what happened only | Understanding patterns, funnel analysis |
| **A/B Testing**       | Causal, production real       | Needs traffic, narrow scope  | Optimizing specific elements            |

**Framework:**

```
Research method selection:

What do you need to learn?
├── Why users do something → Interviews
├── If users can do something → Usability testing
├── How many users do something → Analytics
├── What users prefer → Survey or A/B test
└── What performs better → A/B test

Stage of product:
├── Concept (does problem exist?) → Interviews
├── Design (does solution work?) → Usability testing
├── Live (is it working?) → Analytics + A/B
└── Ongoing (what's changing?) → All methods

Available resources:
├── Time: Days → Analytics, surveys
├── Time: Weeks → Interviews, usability
├── Budget: Low → Guerrilla testing, surveys
├── Budget: High → Formal studies, recruiting

SAMPLE SIZES:
Usability testing: 5 users (finds 80% issues)
Interviews: 5-8 users (patterns emerge)
Surveys: 100+ for statistical significance
A/B tests: Depends on effect size, calculate power

RESEARCH COMBINATION:
Best insights = quant + qual together
Analytics: Shows what's happening
Interviews: Explains why it's happening
```

**Default Recommendation:** Start with 5 user interviews for new problems, usability testing for existing designs. Add analytics for ongoing measurement. Surveys only for large-scale questions.

## Decision 2: Information Architecture Approach

**Context:** Structuring content and navigation for a product.

**Options:**

| Approach           | Pros                    | Cons                       | Choose When                       |
| ------------------ | ----------------------- | -------------------------- | --------------------------------- |
| **Task-based**     | Maps to user goals      | May split related content  | Productivity apps, tools          |
| **Topic-based**    | Logical groupings       | May not match user goals   | Content-heavy sites               |
| **Audience-based** | Personalized experience | Duplicate content possible | Multiple distinct personas        |
| **Hybrid**         | Flexible, covers bases  | More complex               | Large products, multiple contexts |

**Framework:**

```
Information architecture decision:

Primary user goal?
├── Complete tasks → Task-based
├── Learn/explore → Topic-based
├── Different user types → Audience-based
└── Mixed goals → Hybrid

Content type?
├── Actions/tools → Task-based
├── Information/articles → Topic-based
├── Products/services → Varies by audience
└── Mixed → Hybrid

TASK-BASED STRUCTURE:
Navigation reflects what users do:
├── Create project
├── Invite team
├── Track progress
└── Generate reports

TOPIC-BASED STRUCTURE:
Navigation reflects content categories:
├── Projects
├── Team
├── Analytics
└── Settings

AUDIENCE-BASED STRUCTURE:
Navigation by user type:
├── For Developers
├── For Designers
├── For Managers
└── Enterprise

VALIDATION METHODS:
1. Card sorting (open)
   Give users content cards
   Ask them to group
   Learn their mental model

2. Card sorting (closed)
   Give users cards + categories
   Ask them to place
   Validate your model

3. Tree testing
   Text-only navigation
   "Where would you find X?"
   Validates hierarchy without design bias
```

**Default Recommendation:** Start task-based for products, topic-based for content sites. Validate with card sorting before committing. Hybrid when product matures.

## Decision 3: Navigation Pattern

**Context:** Choosing the primary navigation structure.

**Options:**

| Pattern                 | Pros                             | Cons                                    | Choose When                      |
| ----------------------- | -------------------------------- | --------------------------------------- | -------------------------------- |
| **Top nav**             | Standard, visible, scan-friendly | Limited items, takes vertical space     | Marketing sites, simple apps     |
| **Side nav**            | Many items, persistent           | Uses horizontal space, mobile challenge | Complex apps, dashboards         |
| **Bottom nav (mobile)** | Thumb-friendly, visible          | Limited to 5 items                      | Mobile-first apps                |
| **Hamburger menu**      | Saves space                      | Hidden, poor discovery                  | Secondary nav, space-constrained |
| **Tab bar**             | Clear sections, easy switching   | Limited items                           | Single-purpose apps              |

**Framework:**

```
Navigation pattern decision:

Platform priority?
├── Desktop-first → Top nav or side nav
├── Mobile-first → Bottom nav or tabs
└── Both equally → Adaptive (different per device)

Number of primary destinations?
├── 2-5 items → Top nav, tabs, bottom nav
├── 5-10 items → Side nav, mega menu
├── 10+ items → Side nav with grouping

User behavior?
├── Frequent section switching → Visible nav always
├── Deep work in one section → Collapsible nav
├── Browsing/exploring → Sticky visible nav

MOBILE CONSIDERATIONS:
Top of screen: Hard to reach (one-handed)
Bottom of screen: Easy thumb access
Hamburger: 3-click tax, poor discovery
Gesture navigation: Hidden, conflicts with OS

RESPONSIVE PATTERNS:
Desktop: Side nav (expanded)
Tablet: Side nav (collapsed) or top nav
Mobile: Bottom nav or hamburger

NAVIGATION TESTING:
- First-click test: Do users click right?
- Time to find: How long to reach sections?
- Navigation confidence: Do users feel oriented?
```

**Default Recommendation:** Top nav for marketing/simple sites, side nav for complex web apps, bottom nav for mobile apps. Always test with real users.

## Decision 4: Onboarding Strategy

**Context:** Designing the new user experience.

**Options:**

| Strategy                   | Pros                         | Cons                     | Choose When                       |
| -------------------------- | ---------------------------- | ------------------------ | --------------------------------- |
| **No onboarding**          | Immediate value, no barrier  | Users may be lost        | Simple, self-explanatory products |
| **Guided tour**            | Teaches features, low effort | Can be skippable/ignored | Complex products, many features   |
| **Progressive disclosure** | Learn by doing, contextual   | May miss features        | Moderate complexity               |
| **Checklist**              | Clear goals, flexible pace   | Can feel like homework   | Products needing setup            |
| **Interactive tutorial**   | Hands-on learning            | Longer time to value     | Complex workflows                 |

**Framework:**

```
Onboarding strategy selection:

Product complexity?
├── Simple → No onboarding or minimal tooltips
├── Moderate → Progressive disclosure
├── Complex → Guided tour or tutorial
└── Very complex → Combination approach

Setup requirements?
├── None needed → Skip straight to value
├── Some setup → Minimum viable, then just-in-time
└── Significant setup → Checklist with progress

User motivation?
├── High (paid, committed) → Can handle longer onboarding
├── Low (free, exploring) → Minimal friction, show value fast
└── Mixed → Optional depth

ONBOARDING PRINCIPLES:
1. Value before work
   Show outcome → teach input
   "Here's what you can do"

2. Minimum viable onboarding
   Only absolute requirements upfront
   Everything else later

3. Contextual learning
   Teach when relevant
   Not everything at once

4. Progress indication
   "Step 2 of 3"
   Completion motivation

5. Easy skip/revisit
   Don't trap users
   Help always available

METRICS:
Time to first value
Onboarding completion rate
Feature discovery rate
7-day retention by onboarding path
```

**Default Recommendation:** Progressive disclosure with minimum upfront requirements. Add checklist for setup-heavy products. Always measure time to first value.

## Decision 5: Error Handling Approach

**Context:** Designing how the system communicates and recovers from errors.

**Options:**

| Approach                 | Pros                        | Cons                       | Choose When                     |
| ------------------------ | --------------------------- | -------------------------- | ------------------------------- |
| **Prevent errors**       | Best UX, no recovery needed | Not always possible        | High-stakes, predictable inputs |
| **Inline validation**    | Immediate feedback          | Can be noisy               | Form inputs, known formats      |
| **Error messages**       | Clear communication         | Reactive, not proactive    | After-the-fact errors           |
| **Error recovery**       | Keeps users moving          | May mask underlying issues | Common, recoverable errors      |
| **Fallback/degradation** | Something works             | May confuse expectations   | System-level failures           |

**Framework:**

```
Error handling decision:

Can error be prevented?
├── Yes (constraints, validation) → Prevent it
├── Partially → Prevent + handle remainder
└── No (system failure, network) → Handle gracefully

Error type?
├── User input error → Inline validation + help
├── System error → Clear message + recovery
├── Network error → Retry + offline support
├── Authentication → Clear path to fix

Error severity?
├── Critical (data loss) → Block + confirm + help
├── Recoverable → Message + action
├── Informational → Toast/subtle alert
└── Silent → Log, don't show user

ERROR MESSAGE ANATOMY:
1. What happened (clear, non-technical)
2. Why it happened (if helpful)
3. How to fix it (specific action)
4. Alternative paths (if fix not possible)

EXAMPLES:
Bad: "Error 500"
Good: "We couldn't save your changes. Check your
      connection and try again. [Retry] [Save locally]"

Bad: "Invalid input"
Good: "Please enter a valid email address.
      Example: name@company.com"

PREVENTION METHODS:
- Constraints (dropdowns vs. free text)
- Smart defaults (pre-fill known values)
- Real-time validation (before submit)
- Confirmation for destructive actions
- Undo instead of confirm
```

**Default Recommendation:** Prevent errors first (constraints, defaults). Inline validation for user input. Clear error messages with specific recovery actions. Always test error states.

## Decision 6: Mobile Design Strategy

**Context:** Deciding how to approach mobile design relative to desktop.

**Options:**

| Strategy          | Pros                         | Cons                          | Choose When                       |
| ----------------- | ---------------------------- | ----------------------------- | --------------------------------- |
| **Mobile-first**  | Forces prioritization, clean | Desktop may feel sparse       | Mobile is primary platform        |
| **Desktop-first** | Familiar workflow            | Mobile often afterthought     | Desktop is primary platform       |
| **Responsive**    | One codebase, adapts         | Compromise in both contexts   | Similar experiences needed        |
| **Separate apps** | Optimized per platform       | Expensive, maintenance burden | Very different needs per platform |

**Framework:**

```
Mobile strategy decision:

Where do users access?
├── Primarily mobile → Mobile-first
├── Primarily desktop → Desktop-first
├── Mixed → Responsive with breakpoints
└── Very different contexts → Consider separate

Nature of tasks?
├── Quick actions → Mobile-optimized essential
├── Complex workflows → Desktop may be required
├── Content consumption → Responsive works well
└── Creation/editing → Desktop-first often better

MOBILE-FIRST PRINCIPLES:
1. Start with mobile constraints
2. Add complexity for larger screens
3. Touch-first interactions
4. Performance priority

RESPONSIVE BREAKPOINTS:
320px: Minimum mobile
375px: Common phones
768px: Tablets
1024px: Small desktop
1280px: Desktop
1536px: Large desktop

MOBILE CONSIDERATIONS:
- Touch targets: 44x44px minimum
- Thumb zone: Bottom of screen preferred
- Connection: Handle slow/offline
- Context: Users may be distracted
- Screen time: Quick interactions

RESPONSIVE PATTERNS:
Navigation: Top → hamburger on mobile
Layout: Multi-column → single column
Tables: → Cards or horizontal scroll
Forms: → Full width, larger inputs
Touch: → Larger tap targets
```

**Default Recommendation:** Mobile-first for consumer products, desktop-first for complex B2B tools. Always design both, not just scale one down.

## Decision 7: Accessibility Level

**Context:** Choosing how thoroughly to implement accessibility.

**Options:**

| Level           | Pros                        | Cons                   | Choose When                        |
| --------------- | --------------------------- | ---------------------- | ---------------------------------- |
| **WCAG A**      | Basic access, legal minimum | Excludes many users    | Minimum legal requirement          |
| **WCAG AA**     | Most users included         | Some investment needed | Standard for most products         |
| **WCAG AAA**    | Maximum inclusion           | Significant effort     | Government, education, healthcare  |
| **Beyond WCAG** | Exceptional experience      | Custom work required   | When a11y is competitive advantage |

**Framework:**

```
Accessibility level decision:

Legal requirements?
├── Government/education → AA minimum, often AAA
├── Healthcare → AA minimum
├── Finance → AA minimum
├── Consumer → AA strongly recommended
└── B2B → AA recommended

User base?
├── General public → AA minimum
├── Known demographics → Tailor to needs
├── Older users → Consider AAA
└── High-stakes decisions → Higher standards

WCAG LEVELS:
Level A (minimum):
- Alt text for images
- Keyboard navigation
- Form labels
- Page titles

Level AA (standard):
- Color contrast (4.5:1 text)
- Resize to 200% without loss
- Skip navigation links
- Error identification

Level AAA (enhanced):
- Higher contrast (7:1)
- Sign language for video
- Extended audio description
- Reading level guidance

QUICK WINS (do immediately):
□ Semantic HTML (headings, lists, landmarks)
□ Alt text on images
□ Form labels (not just placeholders)
□ Focus indicators visible
□ Color contrast checked
□ Keyboard navigation works

TESTING:
- Automated: axe, Lighthouse, WAVE
- Manual: Keyboard navigation test
- Screen reader: VoiceOver, NVDA
- User testing: Include disabled users
```

**Default Recommendation:** WCAG AA as baseline for all products. Test with automated tools + keyboard navigation. Include users with disabilities in research when possible.

## Decision 8: Feedback and Notification Strategy

**Context:** Deciding how to communicate with users proactively.

**Options:**

| Channel               | Pros                          | Cons                     | Choose When                |
| --------------------- | ----------------------------- | ------------------------ | -------------------------- |
| **In-app toast**      | Contextual, non-intrusive     | Missed if not in app     | UI feedback, confirmations |
| **In-app badge**      | Persistent, draws attention   | Can be noisy             | Actionable items awaiting  |
| **Push notification** | Reaches outside app           | Can be annoying, opt-out | Time-sensitive, important  |
| **Email**             | Permanent record, reaches all | Slow, inbox competition  | Not time-sensitive, formal |
| **SMS**               | High open rate, urgent        | Very intrusive, costly   | Critical, time-sensitive   |

**Framework:**

```
Notification strategy:

Urgency?
├── Immediate action needed → Push/SMS
├── Soon but not urgent → Push or badge
├── Eventually → Email or badge
└── Nice to know → In-app only

User expectation?
├── Requested (alerts they set up) → Push/email
├── System-generated → In-app first
├── Marketing → Email only, opt-in

NOTIFICATION HIERARCHY:
1. Critical: Security, money, status change
   → All channels, immediate

2. Important: Messages, deadlines
   → Push + badge + email

3. Useful: Updates, activity
   → Badge + optional push

4. Nice: Tips, suggestions
   → In-app only

NOTIFICATION PRINCIPLES:
- Default conservative (opt-in for most)
- Granular controls (by type)
- Easy unsubscribe
- Respect quiet hours
- Batch non-urgent

ANTI-PATTERNS TO AVOID:
✗ Push for marketing without consent
✗ Irreversible notification settings
✗ No way to mute temporarily
✗ Same priority for all notifications
✗ Notifications that don't deep-link

NOTIFICATION CONTENT:
- Clear, specific subject
- Actionable when possible
- Links to right place
- Easy to dismiss/act
```

**Default Recommendation:** In-app for UI feedback, push for time-sensitive and user-configured, email for records and non-urgent. Always provide granular controls.

## Decision 9: Empty State Design

**Context:** Deciding what to show when there's no content.

**Options:**

| Approach             | Pros                     | Cons                   | Choose When                 |
| -------------------- | ------------------------ | ---------------------- | --------------------------- |
| **Educational**      | Teaches users what to do | May feel like homework | New users, complex features |
| **Motivational**     | Encourages action        | Can feel pushy         | Creating content, goals     |
| **Template/starter** | Quick start, shows value | May not match needs    | Creative tools, documents   |
| **Minimal**          | Clean, not overwhelming  | No guidance            | Power users, simple actions |

**Framework:**

```
Empty state decision:

User context?
├── First time ever → Educational + motivational
├── Returning, empty section → Lighter guidance
├── Cleared/deleted content → Minimal + undo
└── No results (search) → Helpful alternatives

Feature complexity?
├── Simple (add button obvious) → Minimal
├── Moderate → Light guidance
├── Complex → Tutorial or templates
└── Creative → Templates + examples

EMPTY STATE COMPONENTS:
1. Visual (optional)
   - Illustration or icon
   - Relevant to context
   - Not too large

2. Message
   - What this space is for
   - Why it's empty
   - Encouraging tone

3. Action
   - Primary CTA to fill it
   - Alternative paths if relevant

4. Help (optional)
   - Link to documentation
   - Example content

EXAMPLES:

New user, projects:
[Illustration]
"No projects yet"
"Projects help you organize your work"
[Create your first project] [Import from other tool]

Search, no results:
"No results for 'xyz'"
"Try different keywords or browse categories"
[Clear search] [Browse all]

Cleared content:
"All done!"
[Task completed illustration]
"Nice work clearing your inbox"
[Archive] [View completed]
```

**Default Recommendation:** Educational for first-time empty states, minimal for returning users. Always include a clear primary action. Test that users understand what to do.

## Decision 10: User Testing Frequency

**Context:** Deciding how often to test designs with users.

**Options:**

| Frequency           | Pros                         | Cons                           | Choose When                          |
| ------------------- | ---------------------------- | ------------------------------ | ------------------------------------ |
| **Per feature**     | Validates each before dev    | Time/resource intensive        | High-risk features                   |
| **Per sprint**      | Regular cadence              | May not align with design work | Agile teams                          |
| **Weekly standing** | Continuous learning          | Overhead of recruiting         | Mature product, dedicated researcher |
| **As needed**       | Flexible, resource-efficient | May skip important tests       | Resource-constrained teams           |

**Framework:**

```
Testing frequency decision:

Resources available?
├── Dedicated researcher → Weekly standing
├── Designer does testing → Per sprint or feature
├── Limited time → As needed, prioritized
└── No resources → Guerrilla testing

Risk level?
├── High stakes (money, health) → Every change
├── Core flows → Per feature minimum
├── Edge features → Per sprint or less
└── Minor changes → As needed

TESTING APPROACHES BY RESOURCE:

Full resources (researcher):
- Weekly usability sessions
- Continuous recruitment
- Mix of moderated/unmoderated
- Regular synthesis and share-out

Limited resources (designer tests):
- Test major features before dev
- Guerrilla testing for quick checks
- Unmoderated tools (Maze, UserTesting)
- Share recordings with team

Minimal resources:
- Test core flows quarterly
- Hallway testing (grab anyone)
- Internal testing with fresh eyes
- Customer support feedback review

WHAT TO ALWAYS TEST:
□ New user onboarding
□ Core conversion flows
□ Major feature redesigns
□ Confusing existing flows (from analytics)
□ High-risk features

WHAT CAN SKIP TESTING:
- Minor copy changes
- Bug fixes
- Internal tools
- Exact replicas of proven patterns
```

**Default Recommendation:** Test every major feature before development, with lightweight testing (5 users) being sufficient for most usability questions. Establish regular rhythm over sporadic testing.

```

---

# Appendix G: Sharp Edges: UX Design

Critical mistakes that make products confusing, frustrating, or unusable.

---

## 1. The Assumption Trap

**Severity:** Critical
**Situation:** Building features based on assumptions instead of research
**Why Dangerous:** You'll build the wrong thing confidently.

```

THE TRAP:
"I know what users want"
"Our competitor does it this way"
"The stakeholder said users need this"
"It's obvious what they need"

THE REALITY:

- Users don't know what they want until they use it
- Competitors may also be wrong
- Stakeholders have biases
- "Obvious" is relative to your knowledge

VALIDATION METHODS:

1. User interviews (5-8 minimum)
   Ask about behavior, not preferences
   "Tell me about the last time you..."
   NOT: "Would you use feature X?"

2. Observation
   Watch actual usage
   Look for workarounds
   Note moments of confusion

3. Prototype testing
   Clickable mockup before code
   5 users finds 80% of issues
   Fail fast, fail cheap

4. Analytics review
   Where do users actually go?
   Where do they drop off?
   What paths do they take?

RESEARCH BEFORE EVERY MAJOR FEATURE
"We don't have time" = We have time to build the wrong thing

```

---

## 2. The Happy Path Only

**Severity:** Critical
**Situation:** Only designing for ideal scenarios, ignoring edge cases
**Why Dangerous:** Real users live in the edge cases.

```

THE HAPPY PATH:
User signs up → Completes profile → Uses product → Success!

REALITY:

- User has special characters in name
- User enters email wrong
- Session expires mid-form
- Network goes down
- User closes tab accidentally
- User doesn't have required info
- User changes mind midway
- User has accessibility needs
- User is on slow connection
- User speaks different language

EDGE CASES TO DESIGN FOR:
Empty states: No data yet
Error states: Something went wrong
Loading states: Data in transit
Partial states: Incomplete data
Offline states: No connection
Timeout states: Too slow
Permission states: Access denied
First-time states: New user
Returning states: Repeat visitor
Expert states: Power user
Stressed states: User under pressure

FOR EACH FLOW, ASK:

- What if they can't continue?
- What if they want to go back?
- What if they need help?
- What if something breaks?
- What if they have nothing yet?

```

---

## 3. The Feature Overload

**Severity:** High
**Situation:** Adding features without considering cognitive load
**Why Dangerous:** More features = more confusion = fewer completions.

```

THE TRAP:
V1: Simple, focused, works great
V2: Added "requested" features
V3: Added more "power user" features
V4: Nobody can find anything

SYMPTOMS:

- Long onboarding needed
- Users ask "where is X?"
- Support tickets increase
- Core metrics decline
- New users don't convert

THE FIX - PRIORITIZATION:
For each feature, ask:

1. How many users need this?
2. How often do they need it?
3. How critical is it when needed?

Feature Priority Matrix:
│ Many Users │ Few Users
─────────────┼────────────┼───────────
Frequent Use │ CORE │ CONSIDER
─────────────┼────────────┼───────────
Rare Use │ ACCESSIBLE │ HIDE/CUT

CORE: Primary navigation, always visible
CONSIDER: Could be core, needs validation
ACCESSIBLE: Settings, menus, secondary nav
HIDE/CUT: Probably don't build

HICK'S LAW:
Time to decide increases with number of options
Fewer choices = faster decisions = better UX

```

---

## 4. The Jargon Jungle

**Severity:** High
**Situation:** Using internal terminology in user-facing interfaces
**Why Dangerous:** Users don't speak your language.

```

INTERNAL LANGUAGE THAT CONFUSES:
"Workspace" → What is it?
"Instance" → Technical term
"Sync" → Vague action
"Dashboard" → Too generic
"Module" → Developer speak
"Entity" → Abstract
"Tenant" → Architecture term

USER LANGUAGE:
"Your projects"
"Your copy"
"Save changes"
"Your stats"
"Your apps"
"Your items"
"Your account"

TESTING JARGON:

1. 5-second test
   Show screen for 5 seconds
   Ask: "What is this page for?"
   If confusion → jargon problem

2. First-click test
   "Where would you click to [task]?"
   Wrong clicks → unclear language

3. Card sorting
   What do users call things?
   Group features by user mental model

RULES:

- Use verbs for actions: "Save" not "Persist"
- Use nouns users know: "Messages" not "Communications"
- Describe outcomes: "Share with team" not "Set permissions"
- Test with 5 non-expert users

```

---

## 5. The Invisible Action

**Severity:** High
**Situation:** Important actions that users can't find
**Why Dangerous:** Users can't use features they can't find.

```

HIDING PATTERNS:

- Actions in hover-only menus
- Important settings buried deep
- CTAs that look like text
- Actions behind icons without labels
- Mobile features requiring gestures

DISCOVERY PROBLEMS:
User: "I didn't know I could do that"
User: "Where is the button for X?"
User: "I looked everywhere"
User: "I had to ask someone"

MAKING ACTIONS DISCOVERABLE:

1. Primary actions = always visible
   Save, Submit, Next, Add

2. Secondary actions = one click away
   Edit, Delete, Share, Settings

3. Tertiary actions = in menus
   Export, Advanced options, Rarely used

VISIBILITY HIERARCHY:
Most important → Prominent button
Important → Visible link/button
Useful → Discoverable in menu
Rare → Settings or help

TESTING DISCOVERABILITY:
First-click test:
"How would you [action]?"
Track where users click

> 70% correct = discoverable
> <50% correct = hidden

```

---

## 6. The Infinite Options

**Severity:** High
**Situation:** Presenting too many choices at once
**Why Dangerous:** Choice paralysis prevents action.

```

THE PROBLEM:
Pick your plan:
□ Starter ($9)
□ Basic ($19)
□ Standard ($29)
□ Professional ($49)
□ Business ($79)
□ Enterprise ($149)
□ Custom (Contact us)

User: _closes tab_

THE FIX:
Pick your plan:
□ Free (Try it out)
□ Pro - Most Popular ($29)
□ Team (Contact us)

RESEARCH SHOWS:
2-4 options: Users can evaluate
5-7 options: Decisions slow down
8+ options: Paralysis sets in

REDUCING OPTIONS:

1. Smart defaults
   Pre-select the best option for most
   "Recommended for you"

2. Progressive disclosure
   Show basics first
   "Show more options" for power users

3. Categorization
   Group similar options
   "Popular" vs "Advanced"

4. Recommendations
   "Most popular"
   "Best for teams"
   "Recommended based on your usage"

5. Elimination
   If <5% use an option, remove it
   Or hide it in "Advanced"

```

---

## 7. The Broken Flow

**Severity:** Critical
**Situation:** User flows that don't match user mental models
**Why Dangerous:** Users get lost, frustrated, and leave.

```

BROKEN FLOW EXAMPLE:
User wants to: Send money to friend
App requires:

1. Add friend as contact
2. Verify contact's identity
3. Set up payment method
4. Configure transfer settings
5. Initiate transfer
6. Confirm with SMS
7. Wait for approval
8. Get confirmation

User expectation:

1. Enter friend's email
2. Enter amount
3. Send

MENTAL MODEL MISMATCH:
You think: Security is paramount
User thinks: I just want to send $20

FLOW DESIGN PRINCIPLES:

1. Start with the goal, work backward
   What does user want to achieve?
   What's the minimum path?

2. Progressive complexity
   Easy path for simple cases
   Advanced options for edge cases

3. Forgiving format
   Accept input flexibly
   Don't reject valid variations

4. Clear progress
   Where am I in this process?
   How much is left?

5. Easy recovery
   Go back without losing progress
   Edit previous steps
   Save and continue later

```

---

## 8. The Feedback Void

**Severity:** High
**Situation:** No feedback when users take actions
**Why Dangerous:** Users don't know if actions worked.

```

THE VOID:
User clicks button
...nothing visible happens...
User clicks again
...still nothing...
User refreshes page
Data is duplicated

FEEDBACK REQUIREMENTS:
Every action needs visible feedback within:
0-100ms: Visual acknowledgment (button press)
100ms-1s: Progress indicator
1-10s: Clear loading state with progress
10s+: Background processing with notification

FEEDBACK TYPES:
Immediate:

- Button state change
- Cursor change
- Ripple/click effect

Progress:

- Spinner
- Progress bar
- Skeleton screens
- Optimistic UI

Completion:

- Success message
- Confirmation screen
- Toast notification
- State change visible

Error:

- Clear error message
- What went wrong
- How to fix it
- Option to retry

IMPLEMENTATION PATTERN:
onClick = async () => {
setLoading(true) // Immediate feedback
try {
await action()
showSuccess() // Completion feedback
} catch (e) {
showError(e) // Error feedback
} finally {
setLoading(false)
}
}

```

---

## 9. The Forced Registration

**Severity:** High
**Situation:** Requiring account creation before value is shown
**Why Dangerous:** Users leave before seeing why they should sign up.

```

THE WALL:
User lands on page
"Create an account to continue"
[Sign up with email]
[Sign up with Google]

User has no idea what they're signing up for.

BETTER PATTERN:

1. Show value first
   Let users explore, try, experience

2. Prompt at value moment
   "Save your progress" → Sign up
   "Share with team" → Sign up
   "Unlock feature" → Sign up

3. Progressive registration
   Start as guest
   Convert when necessary
   Preserve their work

EXAMPLES:
Duolingo: Complete first lesson → then sign up
Canva: Create design → sign up to save
Spotify: Listen to music → sign up for features
Notion: Use templates → sign up to save

VALUE FIRST FLOW:
Landing → Try product → Experience value →
Natural prompt → Easy signup → Continue

VS WALL FLOW:
Landing → Signup wall → 80% bounce

DATA:
Removing forced registration can increase
conversion 20-50% because users who sign up
actually want to, having seen the value

```

---

## 10. The Form From Hell

**Severity:** High
**Situation:** Long, complex forms that overwhelm users
**Why Dangerous:** Every field is a chance to drop off.

```

THE HELL FORM:
Name: [***************]
Email: [***************]
Phone: [***************]
Address Line 1: [***************]
Address Line 2: [***************]
City: [***************]
State: [dropdown with 50 options]
ZIP: [***************]
Country: [dropdown with 195 options]
Password: [***************]
Confirm: [***************]
Birthday: [***************]
Gender: [***************]
Occupation: [***************]
Company: [***************]
How heard: [***************]
[Terms checkbox wall of text]
[Submit]

DROP-OFF RATE: 70%+

THE FIX:

1. Minimum viable fields
   Only ask what's essential
   Ask the rest later, or never

2. Progressive profiling
   Get email first
   Ask more over time
   "Complete your profile" later

3. Smart defaults
   Auto-detect country
   Auto-complete address
   Social sign-in

4. Multi-step with progress
   Step 1 of 3: Basic info
   Step 2 of 3: Preferences
   Step 3 of 3: Confirm

5. Inline validation
   Validate as they go
   Green checkmark on valid
   Error before submit

EVERY FIELD REMOVED:
+5-10% completion rate

```

---

## 11. The Dead End

**Severity:** High
**Situation:** Flows that end without clear next steps
**Why Dangerous:** Users don't know what to do next.

```

DEAD ENDS:
Error page: "Something went wrong" [blank]
Empty state: [blank page with no guidance]
Success: "Done!" [nothing else]
404: "Page not found" [go home only]
Confirmation: "Thank you" [end]

EVERY END NEEDS:

1. What happened (status)
2. What to do next (action)
3. Alternative paths (options)

FIXING DEAD ENDS:

Error page:
"Something went wrong"
→ "We couldn't load your data."
→ [Try again] [Go to dashboard] [Contact support]

Empty state:
[blank]
→ "No projects yet"
→ "Create your first project to get started"
→ [Create project] [Import existing]

Success:
"Done!"
→ "Your order is confirmed!"
→ "Confirmation email sent to <you@email.com>"
→ [View order] [Continue shopping] [Track delivery]

404:
"Page not found"
→ "We couldn't find that page"
→ "Try searching or browse popular pages:"
→ [Search] [Home] [Products] [Help]

RULE:
No screen should be a dead end.
Always provide at least one forward path.

```

---

## 12. The Permission Ambush

**Severity:** High
**Situation:** Asking for permissions without context
**Why Dangerous:** Users deny permissions they'd otherwise grant.

```

THE AMBUSH:
App loads
"Allow notifications?" [Allow] [Don't Allow]
"Allow location?" [Allow] [Don't Allow]
"Allow camera?" [Allow] [Don't Allow]

User: Denies all (defensive)

THE FIX - CONTEXTUAL PERMISSION:

1. Wait until the feature is used
   User taps "Take Photo" → camera permission
   User taps "Find nearby" → location permission

2. Explain the benefit first
   "Enable notifications to get updates on your order"
   Not: "Enable notifications"

3. Pre-permission education
   "To scan documents, we need camera access"
   [Enable Camera] [Not now]

4. Graceful degradation
   If denied, work without it
   Offer alternative methods
   "You can also enter the code manually"

PERMISSION FLOW:
User initiates action →
Explain why permission needed →
System permission prompt →
If denied → offer alternative →
If granted → continue with feature

STAT:
Contextual permission requests
have 2-3x higher grant rates

```

---

# Appendix H: Branding Anti-Patterns

Approaches that seem like good brand practice but undermine identity strength and coherence.

---

## 1. The Democratic Logo

**What it looks like**: Putting logo options to a vote. "Let's see what the team prefers." Choosing based on popularity rather than strategy.

**Why it seems good**: Inclusive. Everyone feels heard. Reduces conflict.

**Why it fails**: Most people aren't qualified to evaluate logos strategically. Votes go to "safe" options that offend no one but also excite no one. Group preferences trend toward generic. Best logos are often polarizing at first.

**What to do instead**: Strategy defines criteria, experts evaluate against criteria, decision-maker decides. Stakeholder input on strategy, not on solutions.

---

## 2. The Meaning-Heavy Logo

**What it looks like**: Logos designed to communicate everything about the company. "The three points represent our three values, the circle represents unity, the gradient represents growth..."

**Why it seems good**: Feels deep. Makes logo presentation impressive. Justifies design choices.

**Why it fails**: Audiences don't read logos—they recognize them. Meaning doesn't scale to small applications. Complexity undermines memorability. The explanation becomes more important than the impression.

**What to do instead**: Simple marks that feel right. Recognition over explanation. The Nike swoosh doesn't "mean" anything—it just feels like Nike.

---

## 3. The Perfect First Impression

**What it looks like**: Rejecting logos because "people won't get it at first." Expecting instant love from stakeholders.

**Why it seems good**: First impressions matter. Don't want to launch something people dislike.

**Why it fails**: The best logos grow on people. Familiarity breeds recognition, not contempt. Distinctive marks feel weird before they feel right. Stakeholder discomfort isn't user discomfort.

**What to do instead**: Evaluate against strategy, not gut reaction. Give unfamiliar marks time to sink in. Test with real users in context, not stakeholders in presentations.

---

## 4. The Complete Guidelines Syndrome

**What it looks like**: Waiting until guidelines document every possible scenario before launching. "We can't use the brand until guidelines are perfect."

**Why it seems good**: Thoroughness. Prevent misuse. Professional approach.

**Why it fails**: Perfect guidelines take forever. Brand sits unused while guidelines are perfected. Real applications reveal needs better than speculation.

**What to do instead**: Core guidelines that cover 80% of needs. Launch and learn. Expand guidelines based on actual questions and issues. Living document, not finished product.

---

## 5. The Rigid Grid

**What it looks like**: Complex construction grids and precise mathematical relationships in logo design. Golden ratio explanations. Pixel-perfect geometry.

**Why it seems good**: Scientific. Professional. Justifiable.

**Why it fails**: Construction grids often don't improve the actual logo. Optical adjustments matter more than mathematical precision. Grids become retroactive justification for intuitive decisions.

**What to do instead**: Design for visual balance, which is perceptual, not mathematical. Use grids as starting points, not constraints. What looks right trumps what measures right.

---

## 6. The Distinctive-At-All-Costs

**What it looks like**: Prioritizing uniqueness so highly that the brand becomes alienating. Invented words that are unpronounceable. Visual identity that feels foreign to the category.

**Why it seems good**: Differentiation is the goal. Stand out from competition.

**Why it fails**: Too different reads as "not for me." Category conventions exist for a reason—they signal belonging. Distinctiveness within the category, not alien to it.

**What to do instead**: Distinctive yet belonging. Different enough to notice, familiar enough to trust. Convention on most things, distinctive on key things.

---

## 7. The Borrowed Identity

**What it looks like**: "We want to feel like Apple" or "Make it look like Stripe." Copying successful brands' aesthetics.

**Why it seems good**: Proven approaches. Clear reference. Aspirational quality.

**Why it fails**: You're not Apple. Their identity serves their strategy. Borrowed aesthetics without borrowed substance rings false. You'll always be a copy, never the original.

**What to do instead**: Understand why their identity works. Extract principles, not executions. Develop your own authentic expression of your strategy.

---

## 8. The Perpetual Revision

**What it looks like**: Constantly tweaking identity. Logo adjustments every few months. Color updates. Typography changes. "We're always improving."

**Why it seems good**: Iterative. Responsive. Never settling.

**Why it fails**: Recognition requires consistency. Every change resets equity accumulation. Teams can't keep up with versions. Signals instability.

**What to do instead**: Commit and live with it. Minor refinements, not constant changes. Refresh cycles measured in years, not months. Consistency is a feature.

---

## 9. The Beautiful Guidelines

**What it looks like**: Brand guidelines that are gorgeous to look at but impossible to follow. Emphasis on inspiring imagery over practical guidance.

**Why it seems good**: Impressive. Sets high bar. Shows what's possible.

**Why it fails**: Guidelines exist to enable consistent application. If they're not practical, they're not followed. Beautiful shelfware helps no one.

**What to do instead**: Guidelines for use, not display. Clear rules, practical templates, common scenarios covered. Functional beats beautiful.

---

## 10. The Controlled Reveal

**What it looks like**: Elaborate brand launch with "big reveal." Secrecy until launch day. Surprise reveal to team.

**Why it seems good**: Dramatic. Exciting. Makes a moment.

**Why it fails**: No buy-in because no involvement. Surprise reactions may be negative—and now you've launched. Missed opportunity for pre-launch feedback.

**What to do instead**: Involve key stakeholders in process. Build understanding before reveal. Save drama for external launch, not internal reveal.

---

## 11. The Research Trap

**What it looks like**: Extensive focus groups and testing before any creative work. "Let's validate the direction before designing."

**Why it seems good**: De-risking. Data-driven. Customer-centered.

**Why it fails**: People can't imagine what doesn't exist. Research on descriptions isn't research on experience. Analysis paralysis before creative work begins.

**What to do instead**: Strategy research yes, design direction research minimally. Create options, then test. React to real work, not hypothetical descriptions.

---

## 12. The Sub-Brand Proliferation

**What it looks like**: Every product, feature, and initiative gets its own brand. Sub-brands multiply. Each with its own logo, colors, identity.

**Why it seems good**: Distinction. Tailored identity. Autonomy for teams.

**Why it fails**: Dilutes master brand. Customers confused. Identity inconsistency. Exponential maintenance burden. Often reflects organizational ego, not customer need.

**What to do instead**: Strong master brand, minimal sub-branding. Descriptive product names under master brand. Sub-brands only for strategically distinct businesses.

---

# Appendix I: Branding Decisions

Decision frameworks for identity development, management, and evolution.

---

## 1. Logo Type Selection

**Context**: What kind of logo to create for the brand.

| Option | When to Choose | Trade-offs |
|--------|----------------|------------|
| **Wordmark** | Distinctive name, typographic flexibility, no icon needed | Can't use icon alone, name-dependent |
| **Lettermark** | Long name, initials memorable, corporate feel | Less distinctive for new brands, abbreviation confusion |
| **Icon + Wordmark** | Need both symbol and name, maximum flexibility | More to manage, lockup complexity |
| **Abstract mark** | Universal meaning, global reach, unique symbol | Takes time to build recognition, meaning must be learned |
| **Pictorial mark** | Clear metaphor, instantly understandable | Limits evolution, can be literal |

**Decision criteria**: Name length, application needs, category conventions, global considerations.

**Red flags**: Lettermark for unknown brand, complex icon for small applications, abstract mark when clear metaphor exists.

---

## 2. Color Strategy

**Context**: How many colors and what role each plays.

| Option | When to Choose | Trade-offs |
|--------|----------------|------------|
| **Single color** | Strong distinction, simplicity, consistent recognition | Limited palette for variety |
| **Color pair** | Primary + accent, flexible yet simple | Pairing must work across contexts |
| **Multi-color system** | Diverse applications, category needs variety | Consistency harder, recognition diluted |
| **Black + accent** | Sophistication, versatility, works everywhere | Less distinctive, common approach |

**Decision criteria**: Application variety, distinctiveness needs, production constraints.

**Red flags**: Multi-color without clear system, colors that don't work together, ignoring accessibility.

---

## 3. Typography Approach

**Context**: Custom vs. existing typefaces.

| Option | When to Choose | Trade-offs |
|--------|----------------|------------|
| **Custom typeface** | Large brand, budget available, ultimate distinction | Expensive, time-consuming, needs maintenance |
| **Modified existing** | Distinction needed, moderate budget, some uniqueness | Still recognizable as base, licensing complexity |
| **Commercial typeface** | Quality focus, budget constrained, good selection exists | Not unique, others can use same font |
| **Open-source typeface** | Maximum budget efficiency, web performance | Limited selection, may lack character |

**Decision criteria**: Budget, distinctiveness needs, application variety, technical requirements.

**Red flags**: Custom typeface for startup budget, open-source for premium luxury brand.

---

## 4. Brand Architecture Model

**Context**: How to structure multiple products or lines.

| Option | When to Choose | Trade-offs |
|--------|----------------|------------|
| **Branded house** | Single business, all products related, brand strength | Products can't escape brand associations |
| **House of brands** | Diverse businesses, different audiences, risk isolation | No master brand leverage, expensive |
| **Endorsed brands** | Middle ground, sub-brand identity with parent connection | Complex, potentially confusing |
| **Hybrid** | Mix of above based on strategic needs | Hardest to manage consistently |

**Decision criteria**: Portfolio diversity, target audience overlap, cross-selling potential.

**Red flags**: House of brands for resource-constrained company, branded house for conflicting audiences.

---

## 5. Naming Convention

**Context**: How to name products and features.

| Option | When to Choose | Trade-offs |
|--------|----------------|------------|
| **Descriptive** | Clarity priority, SEO matters, simple explanation | Generic, hard to trademark |
| **Invented words** | Distinction priority, trademark-able, unique | Meaning must be learned, pronunciation risks |
| **Real words (evocative)** | Meaning + distinction, memorable, emotional | May have existing associations, availability |
| **Alphanumeric** | Technical products, versioning, category convention | Cold, hard to remember, commodity feel |

**Decision criteria**: Audience expectations, trademark goals, explanation burden.

**Red flags**: Invented words for commoditized product, descriptive names for premium differentiation.

---

## 6. Guideline Comprehensiveness

**Context**: How extensive brand guidelines should be.

| Option | When to Choose | Trade-offs |
|--------|----------------|------------|
| **Minimal (core elements)** | Early stage, small team, rapid evolution expected | More questions, more inconsistency |
| **Standard (common needs)** | Established brand, moderate application variety | May miss edge cases |
| **Comprehensive (all scenarios)** | Large organization, many creators, strict consistency | Expensive to create and maintain |
| **Living (continuously updated)** | Fast-moving brand, digital-first, frequent additions | Requires ongoing investment |

**Decision criteria**: Organization size, creator diversity, application variety, budget.

**Red flags**: Comprehensive guidelines for two-person startup, minimal guidelines for global enterprise.

---

## 7. Refresh vs. Rebrand

**Context**: How to approach updating an existing identity.

| Option | When to Choose | Trade-offs |
|--------|----------------|------------|
| **Refresh (evolution)** | Brand has equity, strategy unchanged, needs modernization | May not go far enough |
| **Rebrand (revolution)** | Strategy changed, negative associations, M&A | Discards existing equity, expensive |
| **Restore (heritage)** | Lost way from strong original, nostalgia value | May feel backward-looking |
| **Extend (additions)** | System works but incomplete, new needs arise | Complexity increases |

**Decision criteria**: Existing equity value, strategy change magnitude, negative associations.

**Red flags**: Rebrand when refresh would suffice, refresh when fundamental change needed.

---

## 8. Logo Application Flexibility

**Context**: How much variation to allow in logo use.

| Option | When to Choose | Trade-offs |
|--------|----------------|------------|
| **Strict (no exceptions)** | New brand building recognition, few touchpoints | May not fit all contexts |
| **Responsive (defined variants)** | Many contexts, planned flexibility | More versions to manage |
| **Flexible (principles-based)** | Experienced creators, creative culture | Consistency risk |
| **Adaptive (dynamic identity)** | Digital-first, generative systems | Harder to recognize, complex production |

**Decision criteria**: Application variety, creator skill level, brand maturity.

**Red flags**: Flexible guidelines with untrained creators, strict rules that prevent legitimate use.

---

## 9. Brand Asset Investment

**Context**: What level of asset quality and variety to develop.

| Option | When to Choose | Trade-offs |
|--------|----------------|------------|
| **Minimum viable** | Early stage, limited budget, testing product-market fit | May look amateur, limits application |
| **Standard kit** | Established product, typical needs, reasonable budget | Covers most needs, some gaps |
| **Comprehensive library** | Large organization, many touchpoints, brand-led growth | Expensive, maintenance intensive |
| **On-demand creation** | Unpredictable needs, dynamic business | Slow, potentially inconsistent |

**Decision criteria**: Budget, application volume, brand maturity, growth trajectory.

**Red flags**: Comprehensive library for pivot-stage startup, minimum viable for enterprise launch.

---

## 10. Verbal Identity Ownership

**Context**: Who develops and maintains verbal identity.

| Option | When to Choose | Trade-offs |
|--------|----------------|------------|
| **Brand/creative team** | Holistic identity ownership, integrated development | May lack copy expertise |
| **Copywriting/content team** | Writing expertise, practical application knowledge | May not align with visual identity |
| **External agency** | Specialized expertise, objectivity | Ongoing relationship needed |
| **Collaborative** | Best of both, balanced perspective | Coordination complexity |

**Decision criteria**: Internal capabilities, integration needs, budget.

**Red flags**: Split ownership with no coordination, verbal identity as afterthought.

---

# Appendix J: Branding Sharp Edges

Critical mistakes that create weak brands, dilute identity, or waste resources.

---

## 1. The Logo-First Fallacy

**The mistake**: Starting with logo design before brand strategy is defined. "We need a logo" as the first step.

**Why it happens**: Logos are tangible. Strategy is abstract. Stakeholders want to see something. Designers want to design.

**Why it's devastating**: You're designing a symbol for something undefined. Logo won't reflect strategy because there is no strategy. Multiple rounds of subjective feedback with no anchor. End up with a logo that looks nice but means nothing.

**The fix**: Strategy before design, always. Position, values, personality defined before first sketch. Logo visualizes strategy—can't visualize nothing.

---

## 2. The Crowdsourced Logo

**The mistake**: Using logo contests, spec work, or design-by-committee to create identity. "Let's see what the team comes up with."

**Why it happens**: Cheaper. More options. Everyone feels included.

**Why it's devastating**: No strategic foundation. Judged on surface appeal, not brand fit. Winner picked by popularity, not expertise. Often derivative or generic. Relationship with designer ends after delivery—no system thinking.

**The fix**: Work with qualified designers who ask strategic questions. Pay for their expertise, not just their output. Build relationship for ongoing brand evolution.

---

## 3. The Trendy Identity

**The mistake**: Creating identity based on current design trends. "We want that minimalist flat look." Gradient everything. Whatever Dribbble celebrates this year.

**Why it happens**: Trends look fresh. Easy to show examples. Clients ask for it.

**Why it's devastating**: Trends date rapidly. In 3 years you look outdated. You look like everyone else following the same trend. No distinctiveness—the opposite of branding's purpose.

**The fix**: Design for longevity. Ask "will this feel right in 10 years?" Look at enduring identities (Nike, Apple, Coca-Cola) and understand why they last. Trends for campaigns, not for identity.

---

## 4. The Unscalable Logo

**The mistake**: Creating logos that don't work at small sizes or in limited contexts. Intricate details that disappear. Wordmarks that become illegible.

**Why it happens**: Design on large screens. Fall in love with details. Don't test applications.

**Why it's devastating**: Favicon is a blur. App icon is unrecognizable. Embroidery is a mess. Social avatars fail. The most common uses of your logo are broken.

**The fix**: Design small first. Test at 16px. Test in monochrome. Test on backgrounds. If it doesn't work small, simplify until it does.

---

## 5. The Restricted Color Palette

**The mistake**: Colors that only work in limited contexts. Colors too similar to distinguish. No clear hierarchy or system.

**Why it happens**: Pick colors that look nice together in one composition. Don't think about system needs.

**Why it's devastating**: No accessible text colors. No way to show hierarchy. Colors muddy when combined. Can't create variety within brand.

**The fix**: Build a color system, not just a palette. Primary, secondary, accent, neutral, and functional colors. Test accessibility combinations. Provide clear usage guidance.

---

## 6. The Unclear Guidelines

**The mistake**: Brand guidelines that don't actually guide. Vague rules. Examples without principles. "Use good judgment."

**Why it happens**: Rushed delivery. Assumed understanding. Writer knows what they mean.

**Why it's devastating**: Everyone interprets differently. Inconsistent application. Guidelines become shelfware nobody follows. Brand erodes from a thousand small deviations.

**The fix**: Write for someone who's never seen the brand. Every rule has a reason explained. Good and bad examples. Specific enough to follow, flexible enough to enable.

---

## 7. The Unchangeable Logo

**The mistake**: Treating the logo as sacred and untouchable. Minimum size rules that prevent legitimate use. No flexibility for context.

**Why it happens**: Protecting the brand. Fear of dilution. Designer attachment.

**Why it's devastating**: Teams work around restrictions instead of with them. Brand appears rigid and outdated. Can't adapt to new contexts and channels.

**The fix**: Build flexibility into the system. Responsive logos that adapt. Clear permissions for adaptation. Trust trained teams to apply judgment.

---

## 8. The Verbal Afterthought

**The mistake**: Focusing entirely on visual identity, neglecting voice, tone, and verbal identity.

**Why it happens**: Visuals are more tangible. "Branding" seems visual. Copywriters come later.

**Why it's devastating**: Brand sounds different everywhere. Voice inconsistency undermines visual consistency. Incomplete identity system.

**The fix**: Verbal identity is half the work. Voice and tone defined alongside visual. Writing guidelines as robust as visual guidelines. Words and images designed together.

---

## 9. The Impossible Name

**The mistake**: Choosing names that are unavailable, unpronounceable, unspellable, or legally risky.

**Why it happens**: Love the sound. Don't check availability. Rush to commit.

**Why it's devastating**: Domain unavailable or costs fortune. Trademark conflicts. Customers can't find you. Constant "that's spelled..." conversations.

**The fix**: Name strategy before falling in love. Check domain, social handles, trademark database. Test pronounceability. Legal review before commitment.

---

## 10. The Stakeholder Sketch

**The mistake**: Executives providing sketches of what the logo should look like. "I was thinking something like this..."

**Why it happens**: Everyone has opinions on logos. Sketches seem helpful. Stakeholders don't understand design process.

**Why it's devastating**: Constrains exploration. Designer becomes executor of amateur ideas. Design quality suffers. Professional expertise wasted.

**The fix**: Stakeholders define strategy and objectives, not solutions. Provide attributes, not sketches. Trust designers to design. Evaluate work against strategy, not personal preference.

---

## 11. The Franken-Brand

**The mistake**: Piecing together identity from multiple sources over time. Different designer for logo, another for website, another for packaging. Each with different interpretations.

**Why it happens**: Budget constraints. Different projects, different vendors. No brand owner.

**Why it's devastating**: Incoherent identity. Styles clash. Nothing feels like it belongs together. The opposite of brand consistency.

**The fix**: Single identity system before extending. One designer/team for core identity. Guidelines before application. If using multiple vendors, strong central governance.

---

## 12. The Premature Rebrand

**The mistake**: Rebranding before the current brand has built equity. Changing identity because leadership is bored.

**Why it happens**: New leadership wants to make a mark. "Fresh start" mentality. Blame the brand for business problems.

**Why it's devastating**: Discards whatever equity exists. Confuses existing customers. Signals instability. Wastes resources on optics instead of substance.

**The fix**: Rebrand only for strategic reasons: M&A, market repositioning, shedding negative associations. "I'm tired of it" is not a reason. Evolution is usually better than revolution.

---

```
