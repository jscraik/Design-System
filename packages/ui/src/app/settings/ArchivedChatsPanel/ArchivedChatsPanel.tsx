import { IconChevronRightMd } from "../../../icons/ChatGPTIcons";
import { SettingsPanelShell } from "../shared/SettingsPanelShell";
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
    <SettingsPanelShell title="Archived chats" onBack={onBack}>
      <div className="border-border/60 border-b px-0 pb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
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
            className="w-full rounded-lg border border-border bg-secondary py-2 pl-10 pr-4 text-body-small text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        </div>
      </div>

      <div className="px-0 py-4">
        {Object.entries(archivedChats).map(([period, chats]) => (
          <div key={period} className="mb-6">
            <h3 className="mb-2 text-caption font-semibold text-muted-foreground">{period}</h3>
            <div className="space-y-0.5">
              {chats.map((chat) => (
                <button
                  type="button"
                  key={`${period}-${chat}`}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="text-body-small text-foreground">{chat}</span>
                  <IconChevronRightMd className="ml-2 size-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SettingsPanelShell>
  );
}
