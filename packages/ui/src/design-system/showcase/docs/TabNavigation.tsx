import { cn } from "../../../components/ui/utils";

import { tabs, type DocTab } from "./data";

interface TabNavigationProps {
  activeTab: DocTab;
  onTabChange: (tab: DocTab) => void;
}

/** Tab navigation component for DesignSystemDocs. */
export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="flex items-center gap-1 p-1 rounded-xl bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 mb-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue",
            activeTab === tab.id
              ? "bg-foundation-bg-light-3 dark:bg-foundation-bg-dark-3 text-foundation-text-light-primary dark:text-foundation-text-dark-primary shadow-sm"
              : "text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary hover:text-foundation-text-light-primary dark:hover:text-foundation-text-dark-primary hover:bg-foundation-bg-light-2 dark:hover:bg-foundation-bg-dark-3/50",
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
