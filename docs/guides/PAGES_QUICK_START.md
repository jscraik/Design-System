# Pages Quick Start Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Add a new web app page with routing, navigation, and a starter layout.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start-add-a-simple-page)
- [Verify](#verify)
- [Troubleshooting](#troubleshooting)
- [Examples](#examples)
- [Next steps](#next-steps)

## Prerequisites

- `pnpm install` completed
- Dev server available (`pnpm dev`)

## Quick start: add a simple page

### 1) Create the page file

Create `platforms/web/apps/web/src/pages/MyPage.tsx`:

```tsx
import { Button, Card, IconButton, SectionHeader } from "@chatui/ui";
import type { Route } from "../Router";

interface MyPageProps {
  onNavigate: (route: Route) => void;
}

export function MyPage({ onNavigate }: MyPageProps) {
  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="flex items-center gap-3 p-4">
          <IconButton
            icon={<span>←</span>}
            onClick={() => onNavigate("chat")}
            title="Back to Chat"
            variant="ghost"
          />
          <h1 className="text-xl font-semibold">My Page</h1>
        </div>
      </div>
      <div className="mx-auto max-w-4xl p-6">
        <Card className="p-6">
          <SectionHeader title="Welcome to My Page" description="Add your content here." />
        </Card>
      </div>
    </div>
  );
}
```

### 2) Register the route

Update `platforms/web/apps/web/src/app/Router.tsx` in these places:

```tsx
// Add to Route type
export type Route =
  | "chat" | "harness" | "settings" | "profile" | "about"
  | "mypage";

// Add to URL parsing (in useState initializer)
if (path === "/mypage") return "mypage";

// Add to renderPage() switch
case "mypage":
  return <MyPage onNavigate={navigate} />;

// Add to handlePopState
else if (path === "/mypage") setCurrentRoute("mypage");
```

### 3) Add a navigation entry

Place a link or button where users can reach the page:

```tsx
<Button onClick={() => onNavigate("mypage")}>Go to My Page</Button>
```

## Verify

1. Start the dev server: `pnpm dev`.
2. Visit `http://localhost:5173/mypage`.
3. Confirm the header renders and the Back button returns to Chat.

## Troubleshooting

**The page shows a blank screen**

- Confirm the route string is added in all four locations in `Router.tsx`.

**The Back button does nothing**

- Verify the parent component passes `onNavigate` correctly.

## Examples

- Settings: `http://localhost:5173/settings`
- Profile: `http://localhost:5173/profile`
- About: `http://localhost:5173/about`
- Dashboard (Storybook): `Pages/DashboardPage`

## Next steps

- Follow `.kiro/steering/page-development.md` for advanced patterns and layout variations.

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

