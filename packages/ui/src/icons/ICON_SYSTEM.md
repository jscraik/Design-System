# ChatGPT Icon System 🎨

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


A comprehensive icon library with **350+ production-ready React components** integrated into your ChatGPT-style UI component library.

## 📦 Quick Start

```tsx
import { 
  IconCheckmark, 
  IconArrowUpSm, 
  IconPlay, 
  IconUser 
} from './icons/ChatGPTIcons';

function MyComponent() {
  return (
    <div>
      <IconCheckmark className="size-6" />
      <IconArrowUpSm className="size-8 text-[#2f7a4f]" />
      <IconPlay className="size-6 text-[#ececec]" />
    </div>
  );
}
```

## 📊 Icon Library

| Category | Count | File |
|----------|-------|------|
| Arrows & Navigation | 40+ | `chatgpt/arrows.tsx` |
| Media & Audio | 70+ | `chatgpt/media.tsx` |
| General UI | 100+ | `chatgpt/general-ui.tsx` |
| Interface | 15+ | `chatgpt/interface.tsx` |
| Platform | 25+ | `chatgpt/platform.tsx` |
| Account/User | 25+ | `chatgpt/account.tsx` |
| Public/Chat | 10+ | `chatgpt/public.tsx` |
| Settings | 5+ | `chatgpt/settings.tsx` |
| Miscellaneous | 15+ | `chatgpt/misc.tsx` |
| **TOTAL** | **350+** | **9 files** |

## 🎨 Visual Catalog

Browse all icons interactively:

```tsx
import ChatGPTIconCatalog from './icons/ChatGPTIconCatalog';

function App() {
  return <ChatGPTIconCatalog />;
}
```

Features:
- 🔍 Search by icon name
- 🏷️ Filter by category
- 📋 Click to copy icon name
- 🎨 Live preview
- 🌙 Dark mode ChatGPT styling

## 📏 Size System

```typescript
import { chatGPTIconSizes, getSizeClass } from './icons/ChatGPTIcons';

// Available sizes
{
  xs: 12,    // 12px
  sm: 16,    // 16px
  md: 20,    // 20px
  lg: 24,    // 24px (default)
  key: 32,   // 32px - for keyboard keys
  toggle: { width: 44, height: 24 } // for toggles
}

// Usage
<IconSettings className={getSizeClass('md')} />
```

## 🎯 Common Patterns

### Icon Button
```tsx
<button className="p-2 hover:bg-foundation-bg-dark-3/40 rounded-lg">
  <IconTrash className="size-5 text-[#ececec]" />
</button>
```

### Button with Icon
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-foundation-accent-green text-accent-foreground rounded-lg">
  <IconPlus className="size-5" />
  <span>New Chat</span>
</button>
```

### Conditional State
```tsx
{isMuted ? (
  <IconMicOff className="size-6 text-accent-red" />
) : (
  <IconMic className="size-6 text-[#2f7a4f]" />
)}
```

### Animated Icon
```tsx
<IconSpinner className="size-6 animate-spin text-[#2f7a4f]" />
```

## 🎨 ChatGPT Colors

```tsx
// Text
text-[#ececec]       // Primary
text-[#ececec]/60    // Secondary
text-[#ececec]/40    // Tertiary

// Backgrounds
bg-[#0d0d0d]        // App background
bg-[#171717]        // Panel background

// Brand
text-[#2f7a4f]      // Primary green
bg-[#2f7a4f]        // Primary button

// Borders
border-white/10     // Subtle
border-[#2f7a4f]    // Active
```

## 📝 Documentation

- **ChatGPTIconCatalog.tsx** - Interactive visual catalog
- **ChatGPTIconSizes.ts** - Size utilities and constants

## ✨ Features

✅ 350+ production-ready icons  
✅ 9 organized categories  
✅ Full TypeScript support  
✅ ChatGPT design system integration  
✅ Tree-shakeable imports  
✅ Visual catalog component  
✅ Size utilities  
✅ Responsive & accessible  
✅ Click-to-copy in catalog  

## 🚀 Status

**Status:** ✅ Production Ready  
**Total Icons:** 350+  
**Categories:** 9  
**Last Updated:** December 2024

---

For the full icon list, see `ChatGPTIconCatalog.tsx`.
