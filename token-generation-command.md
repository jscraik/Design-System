# token-generation-command

Generate a complete design token system using the provided inputs, following the three-tier architecture: Brand → Alias → Mapped.

## Prerequisites

Before starting, confirm you have:

- Color scales with hue names and hex values
- Font family names and weights
- Any brand-specific requirements

If any required input is missing, **pause and request clarification**.

## Generation Steps

### 1. Brand Collection

Generate raw design values with **no semantic meaning**:

**Colors:**

- Use pure hex values only
- Group by hue (e.g., slate, blue, green, red, orange, grey)
- Use 100–1200 scale (lower = lighter, higher = darker)
- Allowed increments: 100 (default), 50 (intermediate), 25 (refinement)
- Keep white and black in dedicated group

**Typography:**

- Include font families as string variables
- Include font weights as string variables

### 2. Alias Collection

Translate brand tokens into semantic meaning:

**Semantic Mapping:**

- Primary → Slate
- Information → Blue
- Success → Green
- Error → Red
- Warning → Orange
- Neutral light → Slate
- Neutral dark → Grey
- Foundations → White & Black

**Rules:**

- Must reference brand tokens only (no raw hex values)
- Not all brand scales need aliasing
- Secondary and tertiary scales are optional
- If brand scales exceed needs, **pause and ask which to alias**
- Single brand = single mode (no mode variants unless confirmed)

### 3. Mapped Collection

Create component-consumable tokens with light/dark modes:

**Categories:**

- Surface
- Text
- Icon
- Border

**Semantics:**

- Primary
- Secondary
- Disabled
- Error
- Success
- Information
- Warning

**Requirements:**

- Every token must have explicit light and dark values
- Must reference alias tokens only (never brand directly)
- Text/icon tokens must meet WCAG contrast requirements
- Include on-color variants for colored surfaces
- Include focus states (reuse semantic colors)

**Typography Tokens:**
Provide for: heading, hero, body, placeholder, caption

- Can live in separate group (not required in base)
- Include on-color variants

### 4. Responsive Collection

Create responsive typography tokens:

**Required Styles:**

- Hero
- h1, h2, h3, h4, h5, h6
- Paragraph lg, md, sm
- Caption

**Properties per style:**

- Text size
- Line height
- Paragraph spacing

**Constraints:**

- Base paragraph size (paragraph.md) must be 16px

## Output Requirements

1. Single JSON file compatible with Tokens Studio import
2. Follow three-tier structure: brand → alias → mapped → responsive
3. Do not invent values, infer meaning, or auto-correct contrast
4. Include proper token references using `{collection.group.token}` syntax
5. Return only the final JSON output (no explanations unless errors occur)

## Validation Checklist

Before returning output, verify:

- [ ] Brand tokens use only hex values
- [ ] Alias tokens reference only brand tokens
- [ ] Mapped tokens reference only alias tokens
- [ ] All mapped tokens have light and dark modes
- [ ] Typography base size is 16px
- [ ] No invented or assumed values
- [ ] Valid Tokens Studio JSON format

---

This command will be available in chat with `/token-generation-command`
