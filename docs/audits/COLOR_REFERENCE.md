# ChatGPT Design System - Color Reference

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Core Backgrounds](#core-backgrounds)
  - [Modal & Panel Backgrounds](#modal-panel-backgrounds)
- [Text Colors](#text-colors)
  - [Primary Text](#primary-text)
- [Accent Colors](#accent-colors)
  - [Green (Primary Actions)](#green-primary-actions)
  - [Blue](#blue)
  - [Purple](#purple)
  - [Orange](#orange)
  - [Pink/Red](#pinkred)
- [Borders & Dividers](#borders-dividers)
- [Interactive States](#interactive-states)
  - [Buttons](#buttons)
  - [Inputs & Dropdowns](#inputs-dropdowns)
  - [Toggle Buttons (Pill Style)](#toggle-buttons-pill-style)
- [Mode Colors](#mode-colors)
  - [Mode Selection States](#mode-selection-states)
- [Category Tags](#category-tags)
- [Avatar Backgrounds](#avatar-backgrounds)
- [Usage Guidelines](#usage-guidelines)
  - [DO ✅](#do)
  - [DON'T ❌](#dont)
- [Migration Notes](#migration-notes)


This document outlines all colors used in the application for consistency across all components.

## Core Backgrounds

### Modal & Panel Backgrounds

- **Primary Modal Background**: `#171717` - Used for main modal containers (Pro Edit Config, Project Modal)
- **Secondary Surface**: `#2a2a2a` - Used for input fields, dropdowns, nested surfaces
- **Dark Background**: `#0D0D0D` - App main background
- **Sidebar Background**: `#171717` - Left sidebar background
- **Chat Background**: `#212121` - Main chat area
- **Header Background**: `#2C2C2C` - Top header bar
- **Input Container**: `#2C2C2C` - Chat input field background

## Text Colors

### Primary Text

- **White**: `#FFFFFF` - Primary text on dark backgrounds
- **Muted Text**: `#ababab` - Secondary/helper text (used in modals, descriptions)
- **Tertiary Text**: `white/60` or `white/40` - Placeholder text, icons

## Accent Colors

### Green (Primary Actions)

- **Bright Green**: `#40C977` - Success states, "Chat" mode, active indicators
- **Dark Green**: `#2f7a4f` - Primary buttons (Create project, Pro Edit Config), agent mode toggle
- **Light Green (old)**: `#10a37f` - Legacy color, being phased out

### Blue

- **Bright Blue**: `#48AAFF` - "Manual" mode, user messages, links
- **Blue Tint**: `#48AAFF/10` - User message bubbles background
- **Blue Border**: `#48AAFF/20` - User message bubble borders

### Purple

- **Purple**: `#BA8FF7` - Accent color for tags, gradients
- **Purple Tint**: `#BA8FF7/20` - Category tags background

### Orange

- **Orange**: `#FF9E6C` - Accent color for tags
- **Orange Tint**: `#FF9E6C/20` - Category tags background

### Pink/Red

- **Pink**: `#FF8FB3` - Accent color for tags
- **Pink Tint**: `#FF8FB3/20` - Category tags background
- **Red**: `#FF8583` - Error states, recording indicator

## Borders & Dividers

- **Primary Border**: `white/10` - Used for all borders, dividers
- **Hover Border**: `white/20` - Focus/hover state for inputs

## Interactive States

### Buttons

- **Primary Button**: `bg-[#2f7a4f] hover:bg-[#2f7a4f]/80`
- **Primary Button Disabled**: `bg-[#2f7a4f]/30`
- **Secondary Button**: `bg-white/5 hover:bg-white/10`
- **Ghost Button**: `hover:bg-white/5`

### Inputs & Dropdowns

- **Background**: `#2a2a2a`
- **Border**: `border-white/10`
- **Focus Ring**: `focus:ring-1 focus:ring-white/20`

### Toggle Buttons (Pill Style)

- **Container Background**: `#2a2a2a`
- **Active State**: `bg-[#2f7a4f] text-white`
- **Inactive State**: `text-[#ababab] hover:text-white`

## Mode Colors

### Mode Selection States

- **Manual Mode Selected**: `bg-[#48AAFF]/10 border-2 border-[#48AAFF]`
- **Other Modes Selected**: `bg-[#40C977]/10 border border-[#40C977]/30`
- **Unselected**: `bg-white/5 border border-transparent hover:bg-white/10`

## Category Tags

- **Investing**: `bg-[#40C977]/20 text-[#40C977] border-[#40C977]/30`
- **Homework**: `bg-[#48AAFF]/20 text-[#48AAFF] border-[#48AAFF]/30`
- **Writing**: `bg-[#BA8FF7]/20 text-[#BA8FF7] border-[#BA8FF7]/30`
- **Coding**: `bg-[#FF9E6C]/20 text-[#FF9E6C] border-[#FF9E6C]/30`
- **Research**: `bg-[#FF8FB3]/20 text-[#FF8FB3] border-[#FF8FB3]/30`

## Avatar Backgrounds

- **Assistant Avatar**: `bg-[#2f7a4f]` - Dark green
- **User Avatar**: `bg-gradient-to-br from-[#48AAFF] to-[#BA8FF7]` - Blue to purple gradient

## Usage Guidelines

### DO ✅

- Use `#2f7a4f` for all primary action buttons
- Use `#171717` for modal backgrounds
- Use `#2a2a2a` for input fields and dropdowns
- Use `#ababab` for secondary/helper text
- Use `white/10` for borders consistently

### DON'T ❌

- Don't use `#10a37f` (old green) - use `#2f7a4f` instead
- Don't mix different shades of the same color
- Don't use arbitrary opacity values - stick to /10, /20, /30, /40, /60, /80
- Don't use `#2a2a2a` for modal backgrounds (use `#171717`)
- Don't use `white/50` for text (use `#ababab` or `white/60`)

## Migration Notes

The following colors were updated for consistency:

- Project modal button: `#10a37f` → `#2f7a4f`
- Project modal background: `#2a2a2a` → `#171717`
- Secondary text in modals: `white/50` → `#ababab`
- Input backgrounds: `#1a1a1a` → `#2a2a2a`
- Assistant avatar: `#10a37f` → `#2f7a4f`
