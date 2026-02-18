# Transcript (Cleaned & Sectioned)

## Quick Index
- **What it covers:** Figma variable mapping masterclass, 3‑tier vs 2‑tier token architectures, and responsive (jumper) variables.
- **Why it matters:** Avoids common mistakes and enforces scalable design‑system token structure.
- **Key sections:** Tiered architectures, collection rules, multi‑brand guidance, responsive jumpers.

---

## 1) Intro — Why this masterclass
- The presenter builds design systems professionally and sees many incorrect interpretations of token setup.
- This session walks through **Figma variable setup step‑by‑step** with real‑system context.

## 2) Two approaches: 3‑tier vs 2‑tier
- **Three‑tier:** Brand → Alias → Mapped.
- **Two‑tier:** Primitive → Semantic (common in Figma tutorials).
- Three‑tier is favored for **enterprise/multi‑brand** systems because aliasing scales better than cramming brands into primitives.

## 3) Why 3‑tier is scalable for multi‑brand
- Enterprise clients often use **multiple brands**.
- Keeping brand definitions at the root and mapping through alias keeps usage clean.

## 4) Common myths and mistakes
- Many creators copy patterns without understanding the underlying use cases.
- The video emphasizes understanding **why** a mapping choice exists.

## 5) Collection guidance (high level)
- **Brand** = raw values.
- **Alias** = semantic intent for scaling and reuse.
- **Mapped** = usage slots for components.
- He highlights the importance of aligning intent with actual usage.

## 6) Responsive variables (“jumper variables”)
- Introduces a **responsive collection** (also called “jumper variables”) to handle desktop → mobile transitions.
- Example: A padding value might be 96 on desktop, 64 on mobile.
- The key is to **only define the combinations you actually use**—don’t create every possible combination.

## 7) How to define jumper variables
- Create a dedicated grouping (e.g., `spacing`).
- Define mappings like **XL → MD**, **2XL → MD**, etc., based on real design usage.
- The goal is to encode how components “jump” in spacing/width between breakpoints.

## 8) Design‑first rule for responsive tokens
- Build the designs first.
- Audit which responsive combinations actually occur.
- Then codify only those into variables (avoid explosion of unused mappings).

## 9) Wrap‑up
- Reinforces the need for careful variable architecture and disciplined audit.
- Suggests deeper videos on responsive/jumper variables for those who need more detail.

