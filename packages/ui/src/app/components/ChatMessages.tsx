import { IconOpenAILogo, IconUser } from './icons/ChatGPTIcons';
import { Copy, Pencil } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const sampleMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm ChatGPT 5.2 Pro. I'm here to help you with any questions or tasks you have. What would you like to work on today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    role: 'user',
    content: 'Can you help me understand how to merge two different chat interfaces to create the best user experience?',
    timestamp: new Date(Date.now() - 1000 * 60 * 28),
  },
  {
    id: '3',
    role: 'assistant',
    content: "Of course! When merging chat interfaces, you'll want to focus on several key principles:\n\n1. **Navigation & Organization**: Combine the best sidebar navigation with clear chat history\n2. **Input Experience**: Create a powerful yet intuitive input area with quick actions\n3. **Visual Hierarchy**: Use proper spacing, typography, and colors to guide the user's eye\n4. **Accessibility**: Ensure keyboard shortcuts and screen reader support\n5. **Performance**: Keep the interface responsive and smooth\n\nWould you like me to elaborate on any of these points?",
    timestamp: new Date(Date.now() - 1000 * 60 * 27),
  },
];

export function ChatMessages() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#212121]">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {sampleMessages.map((message, index) => (
          <div key={index} className="flex gap-4 group relative">
            <div className="flex-1 max-w-3xl flex items-start gap-2">
              <div
                className={`text-[15px] leading-[24px] tracking-[-0.3px] font-normal rounded-2xl px-4 py-3 relative flex-1 ${
                  message.role === 'user' 
                    ? 'bg-[#2f7a4f] text-white' 
                    : 'bg-[#2f2f2f] text-white/90'
                }`}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigator.clipboard.writeText(message.content)}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    title="Copy"
                  >
                    <Copy className="size-3.5" />
                  </button>
                  <button
                    onClick={() => console.log('Edit message:', message.id)}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}