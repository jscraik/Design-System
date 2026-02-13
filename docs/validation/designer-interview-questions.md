# Designer Interview Questions
**Date:** 2026-01-26
**Phase:** Validation - Week 1
**Purpose:** Validate designer interest in deferred features (token editor, Figma sync)

---

## Interview Protocol

**Target:** 3-5 designers
**Duration:** 30-45 minutes each
**Format:** Semi-structured interview
**Goal:** Understand current workflow and pain points

---

## Section 1: Warm-up (5 minutes)

### Opening Questions
1. What's your current role and primary design tools?
2. How long have you been working with [Company/Product]?
3. What's your typical workflow from design to handoff?

---

## Section 2: Design Token Workflow (10 minutes)

### Current Process
1. **How do you currently define and manage design tokens?**
   - Color palettes?
   - Spacing/sizing systems?
   - Typography scales?

2. **How do you communicate token changes to developers?**
   - Design spec documents?
   - Direct communication?
   - Design system tools?

3. **What happens when a token needs to be updated?**
   - Walk me through the last token change you made
   - What was the process?
   - How long did it take?
   - What were the pain points?

### Pain Points
4. **What frustrates you most about the current token workflow?**
   - Too manual?
   - Communication gaps?
   - Version control issues?
   - Lack of visibility?

5. **Have you ever had a token inconsistency between design and code?**
   - What happened?
   - How did you discover it?
   - How was it resolved?

---

## Section 3: Visual Token Editor Interest (10 minutes)

### Concept Explanation
*"We're considering building a visual token editor - a web-based interface where designers could view, modify, and manage design tokens directly, without needing to edit JSON files or coordinate with developers for simple changes."*

### Questions
6. **How appealing does this sound?** (Rate 1-5)
   - Why that rating?
   - What would make it more/less appealing?

7. **If you had a visual token editor, what would you want it to do?**
   - View all tokens in one place?
   - Edit token values directly?
   - See real-time preview in components?
   - Version history?
   - Export to different formats?

8. **How often would you use this tool?**
   - Daily?
   - Weekly?
   - Monthly?
   - Only during design system updates?

9. **What would make you NOT use it?**
   - Too complicated?
   - Don't trust the output?
   - Prefer current workflow?
   - Fear of breaking things?

### Workflow Questions
10. **If you could edit a color token directly and see it update in Storybook, would that change your workflow?**
    - How?
    - For better or worse?

11. **Who should approve token changes?**
    - Designer alone?
    - Developer review?
    - Design system team?
    - Anyone?

---

## Section 4: Figma Sync Interest (10 minutes)

### Concept Explanation
*"We're considering a Figma sync plugin that would:
- Pull tokens from code into Figma
- Push token changes from Figma to code
- Show which tokens are out of sync
- Allow bidirectional updates"*

### Questions
12. **How valuable would Figma sync be?** (Rate 1-5)
    - Why that rating?

13. **What's your current Figma → code handoff process?**
    - Manual?
    - Plugin?
    - Design system tool?

14. **Have you ever had tokens get out of sync between Figma and code?**
    - What happened?
    - How did you fix it?

15. **If Figma sync existed, would you:**
    - Design primarily in Figma, sync to code?
    - Design primarily in code, sync to Figma?
    - Use both approaches depending on context?

### Concerns
16. **What concerns would you have about Figma sync?**
    - Loss of control?
    - Automated changes breaking things?
    - Version conflicts?
    - Too complex to set up?

---

## Section 5: Theme Customization (5 minutes)

### Questions
17. **How often do you need to create custom themes or variants?**
    - Never
    - Rarely (1-2x/year)
    - Occasionally (quarterly)
    - Frequently (monthly)

18. **What's the process for creating a new theme currently?**
    - How long does it take?
    - Who's involved?

19. **Would a visual theme builder be useful?**
    - What features would it need?
    - How would you use it?

---

## Section 6: Prioritization (5 minutes)

### Ranking Exercise
20. **If you could only have ONE of these, which would you choose?**
    - Visual token editor
    - Figma sync
    - Theme builder
    - Component documentation site
    - Something else

21. **Rank these features by priority:**
    - Visual token editor
    - Figma sync (one-way: code → Figma)
    - Figma sync (bidirectional)
    - Theme builder
    - Token validation (catch inconsistencies)
    - Component catalog (visual reference)

---

## Section 7: Additional Input (5 minutes)

### Open-Ended
22. **What's missing from this list?**
    - What tool would actually make your life easier?

23. **What's the ONE thing that would most improve your design→developer workflow?**

24. **Any other thoughts or feedback?**

---

## Post-Interview: Analysis

### Score Each Designer

| Designer | Token Editor Interest | Figma Sync Interest | Theme Builder Interest | Overall Priority |
|----------|----------------------|---------------------|----------------------|------------------|
| Designer 1 | ?/5 | ?/5 | ?/5 | ? |
| Designer 2 | ?/5 | ?/5 | ?/5 | ? |
| Designer 3 | ?/5 | ?/5 | ?/5 | ? |

### Aggregate Findings

**Token Editor:**
- Average interest: ___/5
- Key feature requests: ___
- Main concerns: ___
- **Decision:** Build / Defer / Cancel

**Figma Sync:**
- Average interest: ___/5
- Direction preference: ___
- Main concerns: ___
- **Decision:** Build / Defer / Cancel

**Theme Builder:**
- Average interest: ___/5
- Usage frequency: ___
- **Decision:** Build / Defer / Cancel

---

## Summary Template

After all interviews, complete:

```
### Overall Assessment

**Designer interest in tools:**
- Token Editor: [HIGH / MEDIUM / LOW]
- Figma Sync: [HIGH / MEDIUM / LOW]
- Theme Builder: [HIGH / MEDIUM / LOW]

**Key quote:** "[Most insightful quote]"

**Recommendation:**
Based on [number] interviews with designers:

[SUMMARY OF FINDINGS]

**Proposed action:**
1. [Feature 1]: BUILD / DEFER / CANCEL - [reason]
2. [Feature 2]: BUILD / DEFER / CANCEL - [reason]
3. [Feature 3]: BUILD / DEFER / CANCEL - [reason]

**Timeline adjustment:**
- Original plan: [weeks]
- Revised plan: [weeks]
- Rationale: [why]
```
