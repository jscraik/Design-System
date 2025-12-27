import { IconOpenAILogo, IconUser } from "./icons/ChatGPTIcons";
import {
  IconCopy,
  IconDotsHorizontal,
  IconEdit,
  IconRegenerate,
  IconShare,
  IconThumbDown,
  IconThumbUp,
} from "../../icons";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  emptyState?: React.ReactNode;
  messages?: Message[];
}

const sampleMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm ChatGPT 5.2 Pro. I'm here to help you with any questions or tasks you have. What would you like to work on today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    role: "user",
    content: "Can you help me understand how to merge two different chat interfaces to create the best user experience?",
    timestamp: new Date(Date.now() - 1000 * 60 * 28),
  },
  {
    id: "3",
    role: "assistant",
    content: "Of course! When merging chat interfaces, you'll want to focus on several key principles:\n\n1. **Navigation & Organization**: Combine the best sidebar navigation with clear chat history\n2. **Input Experience**: Create a powerful yet intuitive input area with quick actions\n3. **Visual Hierarchy**: Use proper spacing, typography, and colors to guide the user's eye\n4. **Accessibility**: Ensure keyboard shortcuts and screen reader support\n5. **Performance**: Keep the interface responsive and smooth\n\nWould you like me to elaborate on any of these points?",
    timestamp: new Date(Date.now() - 1000 * 60 * 27),
  },
  {
    id: "4",
    role: "user",
    content: "Yes, can you explain more about the visual hierarchy?",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: "5",
    role: "assistant",
    content: "Absolutely! Visual hierarchy is crucial for a great chat interface. Here are the key elements:\n\n**Typography**: Use consistent font sizes and weights. Primary text should be bright, secondary text should be lighter, and tertiary text should be muted.\n\n**Spacing**: Maintain consistent padding and margins. Chat bubbles should have comfortable spacing between them.\n\n**Color Contrast**: Use a dark theme with proper contrast ratios to reduce eye strain and improve readability.\n\n**Interactive Elements**: Buttons and clickable items should have clear hover states and visual feedback.",
    timestamp: new Date(Date.now() - 1000 * 60 * 24),
  },
  {
    id: "6",
    role: "user",
    content: "What about the sidebar navigation?",
    timestamp: new Date(Date.now() - 1000 * 60 * 22),
  },
  {
    id: "7",
    role: "assistant",
    content: "Great question! The sidebar should include:\n\n1. **Search functionality** at the top for quick access to past conversations\n2. **Chat history** with clear visual separation between items\n3. **Collapsible sections** like 'Today', 'Yesterday', 'Previous 7 days'\n4. **User profile** section at the bottom\n5. **Smooth animations** when expanding/collapsing\n\nThe sidebar should also be responsive - collapsible on desktop and an overlay drawer on mobile.",
    timestamp: new Date(Date.now() - 1000 * 60 * 21),
  },
  {
    id: "8",
    role: "user",
    content: "How do I make it responsive?",
    timestamp: new Date(Date.now() - 1000 * 60 * 19),
  },
  {
    id: "9",
    role: "assistant",
    content: "Responsive design involves several strategies:\n\n**Breakpoints**: Use media queries or CSS utilities to adjust layout at different screen sizes. Common breakpoints are 768px for tablets and 1024px for desktops.\n\n**Flexible Layouts**: Use flexbox and grid layouts that adapt to available space.\n\n**Touch Targets**: On mobile, ensure buttons are at least 44x44px for easy tapping.\n\n**Overflow Handling**: Make sure scrollable areas work well on both desktop and mobile.\n\n**Progressive Enhancement**: Start with a mobile-first approach, then enhance for larger screens.",
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
  },
  {
    id: "10",
    role: "user",
    content: "Perfect! This is very helpful.",
    timestamp: new Date(Date.now() - 1000 * 60 * 16),
  },
];

export function ChatMessages({ emptyState, messages }: ChatMessagesProps) {
  const resolvedMessages = messages ?? sampleMessages;

  if (emptyState && resolvedMessages.length === 0) {
    return <div className="bg-[var(--foundation-bg-dark-1)]">{emptyState}</div>;
  }

  return (
    <div className="bg-[var(--foundation-bg-dark-1)]">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {resolvedMessages.map((message, index) => (
          <div key={index} className="group">
            {message.role === "assistant" ? (
              <div className="flex gap-3">
                <div className="flex items-start justify-center size-8 rounded-full bg-[var(--foundation-bg-dark-2)] text-[var(--foundation-text-dark-tertiary)]">
                  <IconOpenAILogo className="size-4" />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="text-[15px] leading-[24px] tracking-[-0.3px] font-normal text-[var(--foundation-text-dark-primary)] whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigator.clipboard.writeText(message.content)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--foundation-text-dark-tertiary)] hover:text-[var(--foundation-text-dark-primary)] transition-colors"
                      title="Copy"
                    >
                      <IconCopy className="size-4" />
                    </button>
                    <button
                      onClick={() => console.log("Thumbs up:", message.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--foundation-text-dark-tertiary)] hover:text-[var(--foundation-text-dark-primary)] transition-colors"
                      title="Good response"
                    >
                      <IconThumbUp className="size-4" />
                    </button>
                    <button
                      onClick={() => console.log("Thumbs down:", message.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--foundation-text-dark-tertiary)] hover:text-[var(--foundation-text-dark-primary)] transition-colors"
                      title="Bad response"
                    >
                      <IconThumbDown className="size-4" />
                    </button>
                    <button
                      onClick={() => console.log("Share:", message.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--foundation-text-dark-tertiary)] hover:text-[var(--foundation-text-dark-primary)] transition-colors"
                      title="Share"
                    >
                      <IconShare className="size-4" />
                    </button>
                    <button
                      onClick={() => console.log("Regenerate:", message.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--foundation-text-dark-tertiary)] hover:text-[var(--foundation-text-dark-primary)] transition-colors"
                      title="Regenerate"
                    >
                      <IconRegenerate className="size-4" />
                    </button>
                    <button
                      onClick={() => console.log("More options:", message.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--foundation-text-dark-tertiary)] hover:text-[var(--foundation-text-dark-primary)] transition-colors"
                      title="More"
                    >
                      <IconDotsHorizontal className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="flex items-start gap-2 max-w-[70%]">
                  <div className="bg-[var(--foundation-accent-green)] text-[var(--foundation-text-dark-primary)] text-[15px] leading-[24px] tracking-[-0.3px] font-normal rounded-[20px] px-4 py-3">
                    {message.content}
                  </div>
                  <div className="flex items-center justify-center size-8 rounded-full bg-[var(--foundation-bg-dark-2)] text-[var(--foundation-text-dark-tertiary)]">
                    <IconUser className="size-4" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigator.clipboard.writeText(message.content)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--foundation-text-dark-tertiary)] hover:text-[var(--foundation-text-dark-primary)] transition-colors"
                      title="Copy"
                    >
                      <IconCopy className="size-3.5" />
                    </button>
                    <button
                      onClick={() => console.log("Edit message:", message.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--foundation-text-dark-tertiary)] hover:text-[var(--foundation-text-dark-primary)] transition-colors"
                      title="Edit"
                    >
                      <IconEdit className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
