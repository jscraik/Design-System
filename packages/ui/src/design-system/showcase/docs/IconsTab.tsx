import { useState } from "react";

import { IconSearch } from "../../../icons/ChatGPTIcons";
import { cn } from "../../../components/ui/utils";

import { Card } from "./Card";
import { Section } from "./Section";
import { iconCategories } from "./data";

/** Icons tab content for DesignSystemDocs. */
export function IconsTab() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter icons based on search
  const filteredIcons = searchQuery
    ? iconCategories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
        }))
        .filter((cat) => cat.items.length > 0)
    : iconCategories;

  return (
    <Section title="Icon Library" description="350+ production-ready icons across 9 categories">
      {/* Search */}
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search icons..."
          aria-label="Search icons"
          className={cn(
            "w-full pl-10 pr-4 py-3 rounded-xl text-sm",
            "bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2",
            "border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
            "text-foundation-text-light-primary dark:text-foundation-text-dark-primary",
            "placeholder:text-foundation-text-light-tertiary dark:placeholder:text-foundation-text-dark-tertiary",
            "focus:outline-none focus:ring-2 focus:ring-foundation-accent-blue",
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIcons.map((category) => (
          <Card key={category.title}>
            <h3 className="text-sm font-semibold text-foundation-text-light-primary dark:text-foundation-text-dark-primary mb-4">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-3">
              {category.items.map(({ name, Icon }) => (
                <div
                  key={name}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-3 hover:bg-foundation-bg-light-3 dark:hover:bg-foundation-bg-dark-4 transition-colors cursor-default"
                >
                  <Icon className="size-5 text-foundation-icon-light-primary dark:text-foundation-icon-dark-primary" />
                  <span className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {filteredIcons.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary">
            No icons found matching "{searchQuery}"
          </p>
        </Card>
      )}
    </Section>
  );
}
