# Accessibility Audit Template

**Date:** YYYY-MM-DD  
**Owner:** Jamie Scott Craik (@jscraik)  
**Release/PR:** <link>  
**Scope:** New or modified components since last release  

## Components Audited

- Component: <name>
- Surface: web | widget | desktop
- Stories reviewed: <links>

## Required Checks (WCAG 2.2 AA)

- [ ] Keyboard-only navigation (Tab/Shift+Tab/Enter/Space/Escape)
- [ ] Focus-visible indicators are present and not obscured
- [ ] Name/role/value present for interactive controls
- [ ] Form labels and instructions are programmatically associated
- [ ] Color contrast meets 4.5:1 for normal text, 3:1 for large text
- [ ] Motion is reduced when prefers-reduced-motion is enabled
- [ ] Error states are announced and recoverable

## Findings

- Issue: <description>
- Severity: low | medium | high
- Location: <component/story>
- Fix owner: <name>
- Status: open | fixed | deferred

## Evidence

- Axe report: <link or file>
- Screenshots (if relevant): <links>
- Notes: <free-form>

## Sign-off

- [ ] All high severity issues resolved
- [ ] Remaining issues have owners and timelines
- [ ] Audit artifact linked in release checklist
