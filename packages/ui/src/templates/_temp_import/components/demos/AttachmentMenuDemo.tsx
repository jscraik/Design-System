import { useState } from "react";

import { AttachmentMenu } from "../AttachmentMenu";

export function AttachmentMenuDemo() {
  const [isWebSearchActive, setIsWebSearchActive] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string>("");

  return (
    <div className="h-full min-h-screen bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-12 space-y-12">
        {/* Hero Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-[40px] font-semibold leading-[44px] tracking-[-0.5px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
              Attachment Menu
            </h1>
            <p className="text-[18px] font-normal leading-[28px] tracking-[-0.4px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary max-w-3xl">
              Comprehensive attachment popover with 5 primary actions and 15+ integrations in nested submenu. Includes Slack, GitHub, Notion, and more.
            </p>
          </div>

          {/* Interactive Demo Section */}
          <div className="border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-2xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 p-12 overflow-visible">
            <div className="flex flex-col items-center justify-center gap-8 min-h-[200px]">
              <div className="flex items-center gap-6">
                <div className="flex items-center justify-center p-4 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1 rounded-xl">
                  <AttachmentMenu
                    onAttachmentAction={(action) => {
                      console.log(`Attachment action: ${action}`);
                      setLastAction(`Primary: ${action}`);
                    }}
                    onMoreAction={(action) => {
                      console.log(`More action: ${action}`);
                      setLastAction(`Integration: ${action}`);
                    }}
                    isWebSearchActive={isWebSearchActive}
                    onWebSearchToggle={() => setIsWebSearchActive(!isWebSearchActive)}
                    open={attachmentMenuOpen}
                    onOpenChange={setAttachmentMenuOpen}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[16px] font-normal leading-[24px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                    Click the <span className="inline-flex items-center justify-center size-6 rounded-md bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary font-medium text-sm mx-1">+</span> button
                  </p>
                  <p className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
                    Opens the attachment menu with all actions
                  </p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {isWebSearchActive && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foundation-accent-blue-light/10 dark:bg-foundation-accent-blue/10 border border-foundation-accent-blue-light/20 dark:border-foundation-accent-blue/20">
                    <svg className="size-5 text-foundation-accent-blue-light dark:text-foundation-accent-blue" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[14px] font-medium leading-[20px] tracking-[-0.3px] text-foundation-accent-blue-light dark:text-foundation-accent-blue">
                      Web search is active
                    </span>
                  </div>
                )}
                {lastAction && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-4">
                    <span className="text-[14px] font-medium leading-[20px] tracking-[-0.3px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
                      Last action: <span className="text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">{lastAction}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-6">
          <div>
            <h2 className="text-[28px] font-semibold leading-[32px] tracking-[-0.25px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
              Key Features
            </h2>
            <p className="text-[16px] font-normal leading-[26px] tracking-[-0.4px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Built with complete compliance to ChatGPT's official design system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-6 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
              <h3 className="text-[18px] font-semibold leading-[24px] tracking-[-0.4px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
                Primary Actions
              </h3>
              <ul className="text-[14px] font-normal leading-[22px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-2">
                <li>• Add photos & files</li>
                <li>• Deep research</li>
                <li>• Shopping research</li>
                <li>• Agent mode</li>
                <li>• Create image (DALL·E)</li>
              </ul>
            </div>

            <div className="p-6 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
              <h3 className="text-[18px] font-semibold leading-[24px] tracking-[-0.4px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
                Integrations
              </h3>
              <ul className="text-[14px] font-normal leading-[22px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-2">
                <li>• Slack, GitHub, Linear</li>
                <li>• Notion, Dropbox</li>
                <li>• SharePoint, Teams</li>
                <li> Canva, Figma</li>
                <li>• 15+ total integrations</li>
              </ul>
            </div>

            <div className="p-6 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2">
              <h3 className="text-[18px] font-semibold leading-[24px] tracking-[-0.4px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
                Design Tokens
              </h3>
              <ul className="text-[14px] font-normal leading-[22px] tracking-[-0.3px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary space-y-2">
                <li>• foundation-bg-* colors</li>
                <li>• Brand color preservation</li>
                <li>• Smooth animations</li>
                <li>• Nested popover support</li>
                <li>• Active state indicators</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Example */}
        <div className="space-y-4">
          <div>
            <h2 className="text-[28px] font-semibold leading-[32px] tracking-[-0.25px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-3">
              Usage Example
            </h2>
            <p className="text-[16px] font-normal leading-[26px] tracking-[-0.4px] text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
              Integrate the attachment menu into your chat interface
            </p>
          </div>
          <div className="p-6 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 rounded-xl bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 overflow-x-auto">
            <pre className="text-[13px] font-mono leading-[20px] text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
{`<AttachmentMenu
  onAttachmentAction={(action) => {
    console.log('Primary action:', action);
    // Handle: add-photos-files, deep-research, 
    // shopping-research, agent-mode, create-image
  }}
  onMoreAction={(action) => {
    console.log('Integration:', action);
    // Handle: slack, github, notion, etc.
  }}
  isWebSearchActive={isWebSearchActive}
  onWebSearchToggle={() => setIsWebSearchActive(!isWebSearchActive)}
  open={attachmentMenuOpen}
  onOpenChange={setAttachmentMenuOpen}
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}