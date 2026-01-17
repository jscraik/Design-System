// Simplified Icon Catalog - will be replaced with full version
// This is a placeholder to allow the build to succeed
// TODO: Integrate full ChatGPTIconCatalog with proper design tokens

import * as Icons from "./chatgpt/ChatGPTIconsFixed";

export function ChatGPTIconCatalog() {
  const iconNames = Object.keys(Icons).filter(
    (name) => name.startsWith("Icon") && typeof Icons[name as keyof typeof Icons] === "function",
  );

  return (
    <div className="p-8 bg-foundation-bg-dark-1 min-h-screen text-foundation-text-dark-primary">
      <h1 className="text-3xl font-bold mb-4">ChatGPT Icon Catalog</h1>
      <p className="text-foundation-text-dark-secondary mb-8">{iconNames.length} icons available</p>
      <div className="grid grid-cols-6 gap-4">
        {iconNames.map((name) => {
          const IconComponent = Icons[name as keyof typeof Icons];
          return (
            <div
              key={name}
              className="p-4 bg-foundation-bg-dark-2 rounded-lg border border-foundation-bg-dark-3 hover:border-foundation-accent-blue cursor-pointer transition-colors"
              title={name}
              onClick={() => navigator.clipboard.writeText(name)}
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
