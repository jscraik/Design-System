import { ChatInput } from "../ChatInput";

export function ChatInputDemo() {
  const model = { name: "GPT-4", shortName: "GPT-4", description: "Most capable model" };

  return (
    <div className="h-full bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 overflow-auto">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        <div className="space-y-4">
          <div>
            <h2 className="text-[24px] font-semibold leading-[28px] tracking-[-0.25px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-2">
              Chat Input Component
            </h2>
            <p className="text-[16px] font-normal leading-[26px] tracking-[-0.4px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Complete chat input with attachments, search toggle, research toggle, and voice input
              - fully compliant with ChatGPT design tokens
            </p>
          </div>
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg overflow-hidden bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1">
            <ChatInput
              selectedModel={model}
              onSendMessage={(msg) => console.log("Send:", msg)}
              onAttachmentAction={(action) => console.log("Attachment:", action)}
              onMoreAction={(action) => console.log("More:", action)}
              onToolAction={(action) => console.log("Tool:", action)}
              onSearchToggle={(enabled) => console.log("Search:", enabled)}
              onResearchToggle={(enabled) => console.log("Research:", enabled)}
              onAutoClear={() => console.log("Auto-clear")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold leading-[28px] tracking-[-0.25px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            Features & Design Tokens
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
              <h3 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
                Attachment Menu
              </h3>
              <ul className="text-[14px] font-normal leading-[18px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-2">
                <li>• Add photos & files</li>
                <li>• Deep research</li>
                <li>• Create image</li>
              </ul>
            </div>
            <div className="p-4 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
              <h3 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
                Tools & Actions
              </h3>
              <ul className="text-[14px] font-normal leading-[18px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-2">
                <li>• Search toggle</li>
                <li>• Research toggle</li>
                <li>• Voice input</li>
                <li>• History</li>
                <li>• Auto-clear</li>
              </ul>
            </div>
            <div className="p-4 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
              <h3 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
                Design Tokens
              </h3>
              <ul className="text-[14px] font-normal leading-[18px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-2">
                <li>• foundation-bg-* colors</li>
                <li>• foundation-text-* hierarchy</li>
                <li>• foundation-accent-* states</li>
                <li>• Official typography scale</li>
                <li>• 8px spacing system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
