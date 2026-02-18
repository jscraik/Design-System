import { AppsSDKButton, AppsSDKInput } from "@design-studio/ui";
import { IconSearch, IconX } from "@design-studio/ui/icons";

type TemplateSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
  resultsCount: number;
  totalCount: number;
};

export function TemplateSearch({
  query,
  onQueryChange,
  resultsCount,
  totalCount,
}: TemplateSearchProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 rounded-xl border border-foundation-bg-light-3 bg-foundation-bg-light-1 px-3 py-2 shadow-sm dark:border-foundation-bg-dark-3 dark:bg-foundation-bg-dark-1">
        <IconSearch className="h-4 w-4 text-foundation-text-light-tertiary dark:text-foundation-text-dark-tertiary" />
        <AppsSDKInput
          aria-label="Search templates"
          className="border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:ring-0"
          placeholder="Search templates"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {query.length > 0 ? (
          <AppsSDKButton
            size="sm"
            variant="ghost"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
          >
            <IconX className="h-4 w-4" />
          </AppsSDKButton>
        ) : null}
      </div>
      <p className="text-xs text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
        Showing {resultsCount} of {totalCount} templates
      </p>
    </div>
  );
}
