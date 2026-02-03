import { IconChevronLeftMd, IconChevronRightMd } from "../../../icons/ChatGPTIcons";
import type { SettingsPanelProps } from "../shared/types";

export function ArchivedChatsPanel({ onBack }: SettingsPanelProps) {
  const archivedChats = {
    Today: [
      "Showcase CastMetal Info",
      "GPG for Repo Development",
      "ChatGPT Enhancements",
      "OpenAI Batch Guide",
    ],
    "2 days ago": ["Figma Make Design to Code"],
    "3 days ago": ["2.ai Coding Overview"],
    "4 days ago": ["Snowboot Size Conversion", "Market-Based SP Inquiry"],
    "3 weeks ago": [
      "Anthropic agent workflow blog",
      "Chatma math guide",
      "OpenAI C3 installation",
      "Snowboot Size Conversion",
      "Microsoft PowerPoint overview",
      "Clarify apps AOK meeting",
    ],
    "4 weeks ago": [
      "Audit overview",
      "New login process",
      "Anthropic agent workflow status",
      "Context2 overview",
      "Character count update",
      "Improve React website design",
    ],
    "Last month": [
      "Verp mean/std enquired",
      "Apps SDK Figma PDF",
      "Apps SDK Figma library",
      "Figma SDK Audit",
      "Rejection Iterative Dynamics",
      "Student set-class max value",
      "OpenAI blog link",
      "Context2 no-rated Localization",
      "Canva FIRST overview",
      "ProductPhys interview",
      "Verify Alert SDK Developer",
      "Couchbase status limits",
      "Anthropic Batch API",
      "Audit/Verify Batch API",
      "Gpt meeting expansion",
      "Clarify BT meeting",
      "GPH-6 status check",
      "Army Cycling union overview",
      "Defense Discount Service",
      "Anti-gravity ideas summary",
      "Figma SDK Audit",
      "John Urquhart College overview",
      "gpw-generate mcp integration",
      "PubMed API overview",
      "WWW-Authenticate header explanation",
      "MCP PC version release",
      "GitHub Codebook resources",
      "Clarify Batch guide",
      "ChatGPT commerce overview",
      "Anthropic Batch API",
      "MCP communication overview",
      "Create Columbus UI Bucket",
      "Npm login usage",
      "Rockchip mepoc conflicts",
      "Duckduck API app usage",
      "Btc-stream details",
      "Figma SDK Audit",
      "Spare Maths overview",
      "Spare Header overview",
      "Bash commands vs prompts",
      "Netwest online banking guide",
    ],
  };

  return (
    <>
      <div className="px-6 py-4 border-b border-foreground/10 flex items-center gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            className="size-3 rounded-full bg-status-error hover:bg-status-error/80 transition-colors"
            aria-label="Close"
          />
          <div className="size-3 rounded-full bg-accent-orange" />
          <div className="size-3 rounded-full bg-accent-green" />
        </div>
        <button
          type="button"
          onClick={onBack}
          className="p-1 hover:bg-muted rounded transition-colors"
          aria-label="Back to settings"
        >
          <IconChevronLeftMd className="size-4 text-foreground" />
        </button>
        <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foreground">
          Archived chats
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
        {/* Search bar */}
        <div className="px-6 py-4 border-b border-foreground/10">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search Archive"
              aria-label="Search archived chats"
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-muted rounded-lg text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/20"
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="px-6 py-4">
          {Object.entries(archivedChats).map(([period, chats]) => (
            <div key={period} className="mb-6">
              <h3 className="text-[13px] font-semibold leading-[18px] tracking-[-0.32px] text-muted-foreground mb-2">
                {period}
              </h3>
              <div className="space-y-0.5">
                {chats.map((chat) => (
                  <button
                    type="button"
                    key={`${period}-${chat}`}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-secondary rounded-lg transition-colors text-left"
                  >
                    <span className="text-[14px] font-normal leading-[20px] tracking-[-0.3px] text-foreground">
                      {chat}
                    </span>
                    <IconChevronRightMd className="size-4 text-muted-foreground flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
