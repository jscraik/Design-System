# Transcript (Cleaned & Sectioned)

## Quick Index
- **What it covers:** AI‑generated design tokens with Brand → Alias → Mapped → Responsive collections.
- **Why it matters:** Ensures light/dark + desktop/mobile consistency with enforceable token rules.
- **Key sections:** Workflow, Collection Rules, Mode Cleanup, Audit.

**Video:** https://youtu.be/rYzstFEY0t8?list=PLkmvmF0zhgT87wHp_KdEdmauLq3m9U5uQ  
**Note:** Lightly cleaned for clarity (removed filler; preserved meaning/order).

---

## 1) Intro — What we’re doing
- Build design tokens with AI so they work for **light/dark** and **desktop/mobile**.
- Use **Cursor** to generate a JSON token file from **explicit rules**, then import into **Token Studio**.
- You don’t need a technical background, but a basic understanding of design tokens helps.

## 2) Prereqs & optional learning
- If you’re new to design tokens and Figma variables, the creator recommends watching foundational videos first.
- The method supports **three‑tier** (brand/alias/mapped) or **two‑tier** (primitive/semantic) token architectures.

## 3) Token architecture (3‑tier)
- **Brand collection** = raw palette values.
- **Alias collection** = semantic intent (primary, success, error, etc.).
- **Mapped collection** = concrete usage slots (text/action/icon/border) with light/dark modes.
- You can also add a **responsive collection** for type/spacing scales across breakpoints.

## 4) Workflow overview
1. Connect **Cursor** to Figma via MCP (for pulling base scales).
2. Build **rules** that instruct the AI how to structure tokens.
3. Create a **single command** to generate token JSON with all rules applied.
4. Import tokens into **Token Studio** and clean up modes/collections.

## 5) Connect Figma MCP + import raw scales
- Use Cursor to connect to Figma via MCP.
- Pull in your **raw scales** (colors, spacing, typography) as inputs for token generation.

## 6) Rule‑building for the AI
- The core of the workflow is **rule clarity**: tell the model exactly how to structure collections, modes, and naming.
- The rules include:
  - Collection purpose and constraints.
  - Naming conventions.
  - Mode handling (light/dark, desktop/mobile).
  - Semantic meanings for alias/mapped tiers.

## 7) Generate the token JSON
- Use a single structured prompt/command that includes all rules.
- The AI outputs a JSON token file that matches the desired structure.

## 8) Import into Token Studio
- Bring the generated JSON into Token Studio.
- Verify collections and modes were created correctly.

## 9) Collection rules (as described in the video)
### Brand Collection Rules
- Contains **raw hex values** only.
- No semantic meaning; grouped by hue.
- Scale structure like **100–1200** (increments of 100, with optional 50/25 if needed).
- White/black are in a dedicated group.

### Alias Collection Rules
- Translates brand colors into semantic intent.
- **Aliases must reference brand values**.
- Semantic groups (primary, success, error, warning, neutral, etc.).
- Not all brand scales need to be aliased.

### Mapped Collection Rules
- **Mapped tokens are the only tokens components should use.**
- Categories include surface/text/icon/border.
- Semantic states include primary, secondary, disabled, hover, success, warning, etc.
- **Light/dark** values are defined per mapped token.

### Responsive Collection Rules
- Houses responsive variables across desktop/mobile, especially for **type**.
- Needs: text size, line height, paragraph spacing for
  - Hero
  - h1–h6
  - Paragraph lg/md/sm/caption
- Accessibility constraint: base paragraph size should be **16px**.

## 10) Clean‑up: combining modes & collections
- The AI may output **separate collections** for light/dark or desktop/mobile.
- Merge these into **one collection** with **multiple modes**:
  - Example: a single `mapped` collection with `light` + `dark` modes.
  - Example: a single `responsive` collection with `desktop` + `mobile` modes.
- This makes mode swapping easier in Figma.

## 11) Audit & finishing steps
- After import, **audit the variables**:
  - Check typography placement (mapped vs alias).
  - Fix string variables or missing aliases.
  - Relink where needed.
- Expect the AI to handle ~85–90% of the work; manual cleanup is still required.

## 12) Wrap‑up
- You now have a full token set: **brand + alias + mapped + responsive**.
- Final step is **audit and refine** for full consistency.
