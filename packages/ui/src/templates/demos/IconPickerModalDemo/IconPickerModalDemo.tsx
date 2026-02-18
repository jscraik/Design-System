import { useState } from "react";

import { IconPickerModal } from "../../../app/modals/IconPickerModal";
import {
  IconChat,
  IconFlask,
  IconFolder,
  IconImage,
  IconLightBulb,
  IconSettings,
  IconStar,
  IconTerminal,
} from "../../../icons/ChatGPTIcons";

// Icon component mapping (expand as needed)
const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  folder: IconFolder,
  chat: IconChat,
  star: IconStar,
  flask: IconFlask,
  image: IconImage,
  settings: IconSettings,
  lightbulb: IconLightBulb,
  terminal: IconTerminal,
};

// Color class mapping with full light/dark mode support
const getColorClasses = (colorId: string) => {
  const colorMap: Record<string, string> = {
    gray: "text-muted-foreground dark:text-muted-foreground",
    red: "text-status-error dark:text-status-error",
    orange: "text-accent-orange-light dark:text-accent-orange",
    yellow: "text-accent-orange dark:text-accent-orange",
    green: "text-accent-green-light dark:text-accent-green",
    blue: "text-accent-blue-light dark:text-accent-blue",
    purple: "text-accent-purple-light dark:text-accent-purple",
    pink: "text-accent-purple dark:text-accent-purple",
  };
  return colorMap[colorId] || colorMap.gray;
};

export function IconPickerModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState("folder");
  const [selectedColorId, setSelectedColorId] = useState("blue");

  const handleSave = (iconId: string, colorId: string) => {
    setSelectedIconId(iconId);
    setSelectedColorId(colorId);
  };

  const IconComponent = iconComponents[selectedIconId] || IconFolder;
  const colorClass = getColorClasses(selectedColorId);

  return (
    <div className="min-h-screen bg-background overflow-auto">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-[36px] font-semibold leading-[40px] tracking-[-0.1px] text-foreground">
            Icon Picker Modal
          </h1>
          <p className="text-[16px] font-normal leading-[26px] tracking-[-0.4px] text-text-secondary">
            A comprehensive icon picker with 28 icons and 8 color options. Features smooth
            animations, proper focus management, and complete light/dark mode support with ChatGPT
            design tokens.
          </p>
        </div>

        {/* Interactive Demo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Selection Display */}
          <div className="bg-secondary rounded-2xl border border-border p-8">
            <h3 className="text-[24px] font-semibold leading-[28px] tracking-[-0.25px] text-foreground mb-6">
              Current Selection
            </h3>
            <div className="flex items-center gap-6 mb-6">
              <div className={`p-6 rounded-2xl bg-muted ${colorClass} transition-all duration-200`}>
                <IconComponent className="size-12" />
              </div>
              <div className="flex-1">
                <p className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foreground capitalize">
                  {selectedIconId}
                </p>
                <p className="text-[14px] font-normal leading-[18px] tracking-[-0.3px] text-text-secondary capitalize">
                  Color: {selectedColorId}
                </p>
              </div>
            </div>

            {/* Trigger Button */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="w-full px-6 py-3 bg-accent-green-light dark:bg-accent-green text-accent-foreground hover:opacity-90 hover:scale-105 active:scale-95 rounded-xl transition-all duration-200 font-medium text-[16px] leading-[26px] tracking-[-0.4px] shadow-sm hover:shadow-md"
            >
              Choose Icon
            </button>
          </div>

          {/* Features List */}
          <div className="bg-secondary rounded-2xl border border-border p-8">
            <h3 className="text-[24px] font-semibold leading-[28px] tracking-[-0.25px] text-foreground mb-6">
              Features
            </h3>
            <ul className="space-y-3 text-[14px] font-normal leading-[18px] tracking-[-0.3px] text-text-secondary">
              <li className="flex items-start gap-3">
                <svg
                  className="size-5 text-accent-green-light dark:text-accent-green flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>28 carefully selected icons from ChatGPT library</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="size-5 text-accent-green-light dark:text-accent-green flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>8 color palette options with light/dark variants</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="size-5 text-accent-green-light dark:text-accent-green flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Real-time preview with smooth transitions</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="size-5 text-accent-green-light dark:text-accent-green flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Keyboard navigation & focus management</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="size-5 text-accent-green-light dark:text-accent-green flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Complete design token compliance</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Design Token Compliance Section */}
        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold leading-[28px] tracking-[-0.25px] text-foreground">
            Design Token Compliance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 border border-border rounded-xl bg-secondary">
              <h3 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foreground mb-3">
                Color System
              </h3>
              <ul className="text-[14px] font-normal leading-[18px] tracking-[-0.3px] text-text-secondary space-y-2">
                <li>• 8 foundation accent colors</li>
                <li>• Light & dark mode variants</li>
                <li>• Proper contrast ratios</li>
                <li>• Semantic color usage</li>
              </ul>
            </div>
            <div className="p-6 border border-border rounded-xl bg-secondary">
              <h3 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foreground mb-3">
                Typography
              </h3>
              <ul className="text-[14px] font-normal leading-[18px] tracking-[-0.3px] text-text-secondary space-y-2">
                <li>• Body: 16px/26px/-0.4px</li>
                <li>• Body Small: 14px/18px/-0.3px</li>
                <li>• Caption: 12px/16px/-0.1px</li>
                <li>• SF Pro font family</li>
              </ul>
            </div>
            <div className="p-6 border border-border rounded-xl bg-secondary">
              <h3 className="text-[18px] font-semibold leading-[26px] tracking-[-0.45px] text-foreground mb-3">
                Interactions
              </h3>
              <ul className="text-[14px] font-normal leading-[18px] tracking-[-0.3px] text-text-secondary space-y-2">
                <li>• 200ms smooth transitions</li>
                <li>• Scale & shadow effects</li>
                <li>• Focus ring indicators</li>
                <li>• Hover state animations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold leading-[28px] tracking-[-0.25px] text-foreground">
            Common Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Projects",
                desc: "Customize project icons",
                icon: IconFolder,
                color: "blue",
              },
              {
                title: "Folders",
                desc: "Organize file structure",
                icon: IconFolder,
                color: "green",
              },
              {
                title: "Categories",
                desc: "Visual categorization",
                icon: IconStar,
                color: "yellow",
              },
              { title: "Apps", desc: "Application branding", icon: IconTerminal, color: "purple" },
            ].map((useCase, index) => {
              const UseCaseIcon = useCase.icon;
              const useCaseColor = getColorClasses(useCase.color);
              return (
                <div
                  key={index}
                  className="p-5 border border-border rounded-xl bg-secondary hover:border-accent-blue-light/30 dark:hover:border-accent-blue/30 transition-all duration-200"
                >
                  <div className={`p-3 rounded-xl bg-muted inline-flex mb-3 ${useCaseColor}`}>
                    <UseCaseIcon className="size-6" />
                  </div>
                  <h4 className="text-[16px] font-semibold leading-[26px] tracking-[-0.4px] text-foreground mb-1">
                    {useCase.title}
                  </h4>
                  <p className="text-[14px] font-normal leading-[18px] tracking-[-0.3px] text-text-secondary">
                    {useCase.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Code Example */}
        <div className="space-y-4">
          <h2 className="text-[24px] font-semibold leading-[28px] tracking-[-0.25px] text-foreground">
            Usage Example
          </h2>
          <div className="p-6 border border-border rounded-xl bg-secondary">
            <pre className="text-[12px] font-mono leading-[16px] tracking-[-0.1px] text-foreground overflow-x-auto">
              {`<IconPickerModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  currentIconId={selectedIconId}
  currentColorId={selectedColorId}
  onSave={(iconId, colorId) => {
    setSelectedIconId(iconId);
    setSelectedColorId(colorId);
  }}
  projectName="My Awesome Project"
/>`}
            </pre>
          </div>
        </div>
      </div>

      {/* Modal */}
      <IconPickerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentIconId={selectedIconId}
        currentColorId={selectedColorId}
        onSave={handleSave}
        projectName="My Awesome Project"
      />
    </div>
  );
}
