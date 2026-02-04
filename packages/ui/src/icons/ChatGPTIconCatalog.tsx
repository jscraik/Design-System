// Simplified Icon Catalog - will be replaced with full version
// This is a placeholder to allow the build to succeed
// TODO: Integrate full ChatGPTIconCatalog with proper design tokens

import { useState } from "react";

import * as Icons from "./chatgpt/ChatGPTIconsFixed";

export function ChatGPTIconCatalog() {
  const iconNames = Object.keys(Icons).filter(
    (name) => name.startsWith("Icon") && typeof Icons[name as keyof typeof Icons] === "function",
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCopy = async (name: string) => {
    if (!navigator?.clipboard?.writeText) {
      setStatusMessage(`Clipboard unavailable. Select and copy: ${name}`);
      window.prompt("Clipboard unavailable. Copy the icon name manually:", name);
      return;
    }

    try {
      await navigator.clipboard.writeText(name);
      setStatusMessage(`Copied ${name} to clipboard.`);
    } catch (error) {
      setStatusMessage(`Couldn't copy ${name}. Select and copy it manually.`);
      window.prompt("Clipboard failed. Copy the icon name manually:", name);
    }
  };

  return (
    <div className="p-8 bg-foundation-bg-dark-1 min-h-screen text-foundation-text-dark-primary">
      <h1 className="text-3xl font-bold mb-4">ChatGPT Icon Catalog</h1>
      <p className="text-foundation-text-dark-secondary mb-8">{iconNames.length} icons available</p>
      {statusMessage ? (
        <p className="text-sm text-foundation-text-dark-secondary mb-4">{statusMessage}</p>
      ) : null}
      <div className="grid grid-cols-6 gap-4">
        {iconNames.map((name) => {
          const IconComponent = Icons[name as keyof typeof Icons];
          return (
            <div
              key={name}
              className="p-4 bg-foundation-bg-dark-2 rounded-lg border border-foundation-bg-dark-3 hover:border-foundation-accent-blue cursor-pointer transition-colors"
              title={name}
              onClick={() => void handleCopy(name)}
            >
              <div className="flex flex-col items-center gap-2">
                <IconComponent className="size-6" />
                <span className="text-xs text-foundation-text-dark-tertiary text-center truncate w-full">
                  {name.replace("Icon", "")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
