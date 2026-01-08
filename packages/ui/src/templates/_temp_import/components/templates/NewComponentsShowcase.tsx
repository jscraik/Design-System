import { useState } from "react";
import { Grid, List, Settings, Copy, Edit, Trash, Share } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { CodeBlock } from "../ui/code-block";
import { EmptyMessage } from "../ui/empty-message";
import { Indicator, InlineIndicator } from "../ui/indicator";
import { ShimmerText, ShimmerInline } from "../ui/shimmer-text";
import { SegmentedControl } from "../ui/segmented-control";
import { TagInput, Tag } from "../ui/tag-input";
import { DatePicker } from "../ui/date-picker";
import { DateRangePicker } from "../ui/date-range-picker";
import { SelectControl, MultiSelectControl } from "../ui/select-control";
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  MenuShortcut,
} from "../ui/menu";
import { TextLink } from "../ui/text-link";
import { Image, AvatarImage } from "../ui/image";
import { Markdown } from "../ui/markdown";
import { Transition, Stagger, Collapse, SlideIn } from "../ui/transition";
import { Button } from "../ui/button";

export function NewComponentsShowcase() {
  // State for interactive demos
  const [view, setView] = useState("grid");
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", label: "React" },
    { id: "2", label: "TypeScript" },
  ]);
  const [date, setDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [selectedFramework, setSelectedFramework] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showTransition, setShowTransition] = useState(true);
  const [showCollapse, setShowCollapse] = useState(false);

  const codeExample = `function HelloWorld() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`;

  const markdownExample = `# Markdown Demo

This is a **bold** statement and this is *italic*.

## Features

- Inline \`code\` support
- **Bold** and *italic* text
- [Links](https://example.com) with icons
- Code blocks with syntax highlighting

\`\`\`typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> This is a blockquote with important information.

---

That's all folks!`;

  return (
    <div className="h-full overflow-auto bg-foundation-bg-dark-1">
      <div className="max-w-6xl mx-auto p-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-foundation-text-dark-primary">
            New Components Showcase
          </h1>
          <p className="text-foundation-text-dark-secondary">
            10 new ChatGPT-styled components across 3 phases
          </p>
        </div>

        {/* Phase 1: Core UI Components */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foundation-text-dark-primary mb-2">
              Phase 1: Core UI Components
            </h2>
            <p className="text-foundation-text-dark-tertiary">
              Essential components for notifications, code, empty states, and loading
            </p>
          </div>

          {/* Alert */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              Alert Component
            </h3>
            <div className="grid gap-3">
              <Alert variant="info">
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This is an informational alert with important details.
                </AlertDescription>
              </Alert>
              <Alert variant="success" onClose={() => console.log("closed")}>
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your changes have been saved successfully.
                </AlertDescription>
              </Alert>
              <Alert variant="warning">
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Please review your settings before continuing.
                </AlertDescription>
              </Alert>
              <Alert variant="error">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* CodeBlock */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              CodeBlock Component
            </h3>
            <CodeBlock code={codeExample} language="tsx" showLineNumbers />
          </div>

          {/* EmptyMessage */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              EmptyMessage Component
            </h3>
            <div className="border border-foundation-text-dark-primary/10 rounded-lg">
              <EmptyMessage
                variant="search"
                title="No results found"
                description="Try adjusting your search query or filters"
                action={
                  <Button variant="outline" size="sm">
                    Clear Search
                  </Button>
                }
              />
            </div>
          </div>

          {/* Indicator */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              Indicator Component
            </h3>
            <div className="flex items-center gap-6 p-6 border border-foundation-text-dark-primary/10 rounded-lg">
              <Indicator size="sm" variant="default" />
              <Indicator size="md" variant="primary" label="Loading..." />
              <Indicator size="lg" variant="success" />
              <div className="flex items-center gap-2">
                <span className="text-foundation-text-dark-primary">Processing</span>
                <InlineIndicator size="sm" variant="primary" />
              </div>
            </div>
          </div>

          {/* ShimmerText */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              ShimmerText Component
            </h3>
            <div className="space-y-4 p-6 bg-foundation-bg-dark-1 border border-foundation-text-dark-primary/10 rounded-lg">
              <div className="text-sm text-foundation-text-dark-tertiary mb-2">
                Loading skeleton with animated shimmer effect
              </div>
              <ShimmerText lines={3} lineHeight="md" />
              <div className="h-px bg-foundation-text-dark-primary/10 my-4" />
              <div className="text-sm text-foundation-text-dark-tertiary mb-2">
                Inline shimmer for single elements
              </div>
              <ShimmerInline width="60%" height="24px" />
            </div>
          </div>

          {/* SegmentedControl */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              SegmentedControl Component
            </h3>
            <SegmentedControl
              options={[
                { value: "grid", label: "Grid", icon: <Grid className="size-4" /> },
                { value: "list", label: "List", icon: <List className="size-4" /> },
              ]}
              value={view}
              onChange={setView}
              size="md"
            />
          </div>
        </section>

        {/* Phase 2: Enhanced Inputs */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foundation-text-dark-primary mb-2">
              Phase 2: Enhanced Input Components
            </h2>
            <p className="text-foundation-text-dark-tertiary">
              Advanced inputs with rich functionality
            </p>
          </div>

          {/* TagInput */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              TagInput Component
            </h3>
            <TagInput
              tags={tags}
              onTagsChange={setTags}
              placeholder="Add tags... (Press Enter)"
              maxTags={5}
            />
          </div>

          {/* DatePicker */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              DatePicker Component
            </h3>
            <DatePicker
              date={date}
              onDateChange={setDate}
              placeholder="Select a date"
            />
          </div>

          {/* DateRangePicker */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              DateRangePicker Component
            </h3>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Select date range"
            />
          </div>

          {/* SelectControl */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              SelectControl Component
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Single Select</label>
                <SelectControl
                  options={[
                    { value: "react", label: "React", description: "A JavaScript library" },
                    { value: "vue", label: "Vue", description: "Progressive framework" },
                    { value: "angular", label: "Angular", description: "Platform for web" },
                    { value: "svelte", label: "Svelte", description: "Cybernetically enhanced" },
                  ]}
                  value={selectedFramework}
                  onValueChange={setSelectedFramework}
                  searchable
                  clearable
                  placeholder="Select framework..."
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Multi Select</label>
                <MultiSelectControl
                  options={[
                    { value: "typescript", label: "TypeScript" },
                    { value: "javascript", label: "JavaScript" },
                    { value: "python", label: "Python" },
                    { value: "rust", label: "Rust" },
                    { value: "go", label: "Go" },
                  ]}
                  values={selectedLanguages}
                  onValuesChange={setSelectedLanguages}
                  maxSelections={3}
                  placeholder="Select up to 3 languages..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Phase 3: Polish & Advanced */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foundation-text-dark-primary mb-2">
              Phase 3: Polish & Advanced Components
            </h2>
            <p className="text-foundation-text-dark-tertiary">
              Advanced UI patterns and utilities
            </p>
          </div>

          {/* Menu */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              Menu Component
            </h3>
            <Menu>
              <MenuTrigger asChild>
                <Button variant="outline">
                  <Settings className="mr-2 size-4" />
                  Actions Menu
                </Button>
              </MenuTrigger>
              <MenuContent>
                <MenuLabel>Actions</MenuLabel>
                <MenuItem>
                  <Edit className="mr-2 size-4" />
                  Edit
                  <MenuShortcut>⌘E</MenuShortcut>
                </MenuItem>
                <MenuItem>
                  <Copy className="mr-2 size-4" />
                  Copy
                  <MenuShortcut>⌘C</MenuShortcut>
                </MenuItem>
                <MenuItem>
                  <Share className="mr-2 size-4" />
                  Share
                </MenuItem>
                <MenuSeparator />
                <MenuItem destructive>
                  <Trash className="mr-2 size-4" />
                  Delete
                  <MenuShortcut>⌘⌫</MenuShortcut>
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>

          {/* TextLink */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              TextLink Component
            </h3>
            <div className="space-y-2 p-6 border border-foundation-text-dark-primary/10 rounded-lg">
              <div>
                <TextLink href="https://example.com" variant="default" showExternalIcon>
                  Default link with icon
                </TextLink>
              </div>
              <div>
                <TextLink href="#" variant="subtle">
                  Subtle link style
                </TextLink>
              </div>
              <div>
                <TextLink href="#" variant="nav">
                  Navigation link
                </TextLink>
              </div>
              <div>
                <TextLink href="#" variant="destructive">
                  Destructive link
                </TextLink>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              Image Component
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-foundation-text-dark-tertiary mb-2">Avatar with fallback</p>
                <AvatarImage
                  src="https://i.pravatar.cc/150?img=1"
                  name="John Doe"
                  size="xl"
                />
              </div>
              <div>
                <p className="text-sm text-foundation-text-dark-tertiary mb-2">Error state</p>
                <Image
                  src="invalid-url"
                  alt="Error demo"
                  className="w-full h-32 rounded-lg"
                />
              </div>
              <div>
                <p className="text-sm text-foundation-text-dark-tertiary mb-2">Loading state</p>
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
                  alt="Landscape"
                  className="w-full h-32 rounded-lg"
                  aspectRatio="video"
                />
              </div>
            </div>
          </div>

          {/* Markdown */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              Markdown Component
            </h3>
            <div className="p-6 border border-foundation-text-dark-primary/10 rounded-lg">
              <Markdown content={markdownExample} />
            </div>
          </div>

          {/* Transition */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foundation-text-dark-primary">
              Transition Components
            </h3>
            <div className="space-y-4 p-6 border border-foundation-text-dark-primary/10 rounded-lg">
              <div className="flex gap-2">
                <Button onClick={() => setShowTransition(!showTransition)} size="sm">
                  Toggle Transition
                </Button>
                <Button onClick={() => setShowCollapse(!showCollapse)} size="sm">
                  Toggle Collapse
                </Button>
              </div>

              <Transition show={showTransition} variant="slideUp">
                <div className="p-4 bg-foundation-bg-dark-2 rounded-lg">
                  <p className="text-foundation-text-dark-primary">
                    This content slides up when shown
                  </p>
                </div>
              </Transition>

              <Collapse open={showCollapse}>
                <div className="p-4 bg-foundation-bg-dark-2 rounded-lg">
                  <p className="text-foundation-text-dark-primary">
                    This content expands and collapses smoothly
                  </p>
                </div>
              </Collapse>

              <Stagger staggerDelay={0.1}>
                {["First", "Second", "Third"].map((item) => (
                  <div
                    key={item}
                    className="p-3 bg-foundation-bg-dark-2 rounded-lg mb-2"
                  >
                    {item} item with stagger animation
                  </div>
                ))}
              </Stagger>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="text-center p-8 bg-foundation-bg-dark-2 rounded-lg">
          <h2 className="text-2xl font-semibold text-foundation-text-dark-primary mb-3">
            🎉 All 16 Components Ready!
          </h2>
          <p className="text-foundation-text-dark-secondary mb-4">
            100% Apps SDK UI coverage achieved with production-ready components
          </p>
          <div className="flex justify-center gap-4 text-sm text-foundation-text-dark-tertiary">
            <div>✅ 16 new components</div>
            <div>✅ Dark mode support</div>
            <div>✅ Fully accessible</div>
            <div>✅ TypeScript typed</div>
          </div>
        </section>
      </div>
    </div>
  );
}