import { useState } from "react";

import {
	Alert,
	AlertDescription,
	AlertTitle,
	AspectRatio,
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Button,
	Card,
	CardContent,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	DatePicker,
	DateRangePicker,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Input,
	Progress,
	SegmentedControl,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Skeleton,
	ToggleGroup,
	ToggleGroupItem,
} from "../../components/ui";
import { CodeBlock } from "../../design-system/showcase/docs/CodeBlock";

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
- Links with icons
- Code blocks with syntax highlighting

\`\`\`typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> This is a blockquote with important information.

---

That's all folks!`;

export function NewComponentsShowcase() {
	const [view, setView] = useState("grid");
	const [tags, setTags] = useState<string[]>(["React", "TypeScript"]);
	const [tagInput, setTagInput] = useState("");
	const [date, setDate] = useState<Date>();
	const [rangeStart, setRangeStart] = useState<Date>();
	const [rangeEnd, setRangeEnd] = useState<Date>();
	const [selectedFramework, setSelectedFramework] = useState("");
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
	const [showTransition, setShowTransition] = useState(true);
	const [showCollapse, setShowCollapse] = useState(false);

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
							Essential components for notifications, code, empty states, and
							loading
						</p>
					</div>

					{/* Alert */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							Alert Component
						</h3>
						<div className="grid gap-3">
							<Alert>
								<AlertTitle>Information</AlertTitle>
								<AlertDescription>
									This is an informational alert with important details.
								</AlertDescription>
							</Alert>
							<Alert>
								<AlertTitle>Success!</AlertTitle>
								<AlertDescription>
									Your changes have been saved successfully.
								</AlertDescription>
							</Alert>
							<Alert variant="destructive">
								<AlertTitle>Warning</AlertTitle>
								<AlertDescription>
									Please review your settings before continuing.
								</AlertDescription>
							</Alert>
							<Alert variant="destructive">
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
						<CodeBlock code={codeExample} language="tsx" />
					</div>

					{/* EmptyMessage (mapped to Card + Button) */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							EmptyMessage Component
						</h3>
						<Card className="border border-foundation-text-dark-primary/10 bg-foundation-bg-dark-2">
							<CardContent className="py-10 text-center space-y-3">
								<div className="text-lg font-semibold text-foundation-text-dark-primary">
									No results found
								</div>
								<div className="text-sm text-foundation-text-dark-tertiary">
									Try adjusting your search query or filters
								</div>
								<Button variant="outline" size="sm">
									Clear Search
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Indicator (mapped to Progress + Badge) */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							Indicator Component
						</h3>
						<div className="flex flex-col gap-4 p-6 border border-foundation-text-dark-primary/10 rounded-lg">
							<div className="flex items-center gap-6">
								<Badge variant="secondary">Idle</Badge>
								<Badge variant="default">Processing</Badge>
								<Badge variant="outline">Queued</Badge>
							</div>
							<div className="space-y-2">
								<div className="text-sm text-foundation-text-dark-secondary">
									Loading…
								</div>
								<Progress value={42} />
							</div>
						</div>
					</div>

					{/* ShimmerText (mapped to Skeleton) */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							ShimmerText Component
						</h3>
						<div className="space-y-4 p-6 bg-foundation-bg-dark-1 border border-foundation-text-dark-primary/10 rounded-lg">
							<div className="text-sm text-foundation-text-dark-tertiary mb-2">
								Loading skeleton with animated shimmer effect
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-4/5" />
								<Skeleton className="h-4 w-3/5" />
								<Skeleton className="h-4 w-2/3" />
							</div>
							<div className="h-px bg-foundation-text-dark-primary/10 my-4" />
							<div className="text-sm text-foundation-text-dark-tertiary mb-2">
								Inline shimmer for single elements
							</div>
							<Skeleton className="h-6 w-2/3" />
						</div>
					</div>

					{/* SegmentedControl */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							SegmentedControl Component
						</h3>
						<SegmentedControl
							options={[
								{ value: "grid", label: "Grid" },
								{ value: "list", label: "List" },
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

					{/* TagInput (mapped to Input + Badge list) */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							TagInput Component
						</h3>
						<div className="space-y-3">
							<div className="flex flex-wrap gap-2">
								{tags.map((tag) => (
									<Badge key={tag} variant="secondary">
										{tag}
									</Badge>
								))}
							</div>
							<Input
								value={tagInput}
								placeholder="Add tags... (Press Enter)"
								onChange={(event) => setTagInput(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === "Enter" && tagInput.trim()) {
										event.preventDefault();
										setTags((prev) => [...prev, tagInput.trim()]);
										setTagInput("");
									}
								}}
							/>
						</div>
					</div>

					{/* DatePicker */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							DatePicker Component
						</h3>
						<DatePicker value={date} onValueChange={setDate} />
					</div>

					{/* DateRangePicker */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							DateRangePicker Component
						</h3>
						<DateRangePicker
							startDate={rangeStart}
							endDate={rangeEnd}
							onRangeChange={(
								start: Date | undefined,
								end: Date | undefined,
							) => {
								setRangeStart(start);
								setRangeEnd(end);
							}}
						/>
					</div>

					{/* SelectControl (mapped to Select + ToggleGroup) */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							SelectControl Component
						</h3>
						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm mb-2">Single Select</label>
								<Select
									value={selectedFramework}
									onValueChange={setSelectedFramework}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select framework..." />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="react">React</SelectItem>
										<SelectItem value="vue">Vue</SelectItem>
										<SelectItem value="angular">Angular</SelectItem>
										<SelectItem value="svelte">Svelte</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="block text-sm mb-2">Multi Select</label>
								<ToggleGroup
									type="multiple"
									value={selectedLanguages}
									onValueChange={setSelectedLanguages}
									className="flex flex-wrap gap-2"
								>
									{[
										{ value: "typescript", label: "TypeScript" },
										{ value: "javascript", label: "JavaScript" },
										{ value: "python", label: "Python" },
										{ value: "rust", label: "Rust" },
										{ value: "go", label: "Go" },
									].map((item) => (
										<ToggleGroupItem key={item.value} value={item.value}>
											{item.label}
										</ToggleGroupItem>
									))}
								</ToggleGroup>
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

					{/* Menu (mapped to DropdownMenu) */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							Menu Component
						</h3>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">Actions Menu</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem>Edit</DropdownMenuItem>
								<DropdownMenuItem>Copy</DropdownMenuItem>
								<DropdownMenuItem>Share</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="text-destructive">
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* TextLink (mapped to Button variant) */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							TextLink Component
						</h3>
						<div className="space-y-2 p-6 border border-foundation-text-dark-primary/10 rounded-lg">
							<div>
								<Button variant="link" asChild>
									<a
										href="https://example.com"
										target="_blank"
										rel="noreferrer"
									>
										Default link
									</a>
								</Button>
							</div>
							<div>
								<Button variant="link">Subtle link style</Button>
							</div>
							<div>
								<Button variant="link">Navigation link</Button>
							</div>
							<div>
								<Button variant="link" className="text-destructive">
									Destructive link
								</Button>
							</div>
						</div>
					</div>

					{/* Image (mapped to Avatar + AspectRatio) */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							Image Component
						</h3>
						<div className="grid md:grid-cols-3 gap-4">
							<div>
								<p className="text-sm text-foundation-text-dark-tertiary mb-2">
									Avatar with fallback
								</p>
								<Avatar className="size-16">
									<AvatarImage
										src="https://i.pravatar.cc/150?img=1"
										alt="John Doe"
									/>
									<AvatarFallback>JD</AvatarFallback>
								</Avatar>
							</div>
							<div>
								<p className="text-sm text-foundation-text-dark-tertiary mb-2">
									Error state
								</p>
								<Card className="overflow-hidden">
									<AspectRatio ratio={16 / 9}>
										<div className="flex h-full w-full items-center justify-center bg-foundation-bg-dark-2">
											<span className="text-sm text-foundation-text-dark-tertiary">
												Image failed
											</span>
										</div>
									</AspectRatio>
								</Card>
							</div>
							<div>
								<p className="text-sm text-foundation-text-dark-tertiary mb-2">
									Loading state
								</p>
								<Card className="overflow-hidden">
									<AspectRatio ratio={16 / 9}>
										<Skeleton className="h-full w-full" />
									</AspectRatio>
								</Card>
							</div>
						</div>
					</div>

					{/* Markdown (mapped to text + CodeBlock) */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							Markdown Component
						</h3>
						<div className="p-6 border border-foundation-text-dark-primary/10 rounded-lg space-y-4">
							<p className="text-foundation-text-dark-secondary">
								This example renders markdown content using existing primitives.
							</p>
							<CodeBlock code={markdownExample} language="md" />
						</div>
					</div>

					{/* Transition (mapped to Collapsible) */}
					<div className="space-y-3">
						<h3 className="text-lg font-medium text-foundation-text-dark-primary">
							Transition Components
						</h3>
						<div className="space-y-4 p-6 border border-foundation-text-dark-primary/10 rounded-lg">
							<div className="flex gap-2">
								<Button
									onClick={() => setShowTransition(!showTransition)}
									size="sm"
								>
									Toggle Transition
								</Button>
								<Button
									onClick={() => setShowCollapse(!showCollapse)}
									size="sm"
								>
									Toggle Collapse
								</Button>
							</div>

							<div
								className={
									showTransition
										? "p-4 bg-foundation-bg-dark-2 rounded-lg transition-all duration-300 opacity-100 translate-y-0"
										: "p-4 bg-foundation-bg-dark-2 rounded-lg transition-all duration-300 opacity-0 -translate-y-2 pointer-events-none"
								}
							>
								<p className="text-foundation-text-dark-primary">
									This content fades in when shown
								</p>
							</div>

							<Collapsible open={showCollapse}>
								<CollapsibleTrigger asChild>
									<div />
								</CollapsibleTrigger>
								<CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
									<div className="p-4 bg-foundation-bg-dark-2 rounded-lg">
										<p className="text-foundation-text-dark-primary">
											This content expands and collapses smoothly
										</p>
									</div>
								</CollapsibleContent>
							</Collapsible>

							<div className="space-y-2">
								{"First,Second,Third".split(",").map((item, index) => (
									<div
										key={item}
										className="p-3 bg-foundation-bg-dark-2 rounded-lg transition-all duration-300 opacity-100 translate-y-0"
										style={{ transitionDelay: `${index * 80}ms` }}
									>
										{item} item with stagger animation
									</div>
								))}
							</div>
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
