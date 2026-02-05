import { IconBarChart, IconCheckCircle, IconLightBulb } from "../../../../icons/ChatGPTIcons";
import { SettingToggle } from "../../../settings";

interface SuggestionsSectionProps {
  autocomplete: boolean;
  trendingSearches: boolean;
  followUpSuggestions: boolean;
  onToggle: (key: string) => void;
}

/** SuggestionsSection renders suggestion-related settings. */
export function SuggestionsSection({
  autocomplete,
  trendingSearches,
  followUpSuggestions,
  onToggle,
}: SuggestionsSectionProps) {
  return (
    <div className="mb-5">
      <h3 className="text-body-small font-semibold text-foreground mb-2">Suggestions</h3>
      <div className="space-y-0.5">
        <SettingToggle
          icon={<IconCheckCircle className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Autocomplete"
          checked={autocomplete}
          onCheckedChange={() => onToggle("autocomplete")}
        />

        <SettingToggle
          icon={<IconBarChart className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Trending searches"
          checked={trendingSearches}
          onCheckedChange={() => onToggle("trendingSearches")}
        />

        <SettingToggle
          icon={<IconLightBulb className="size-4 text-text-secondary dark:text-text-secondary" />}
          label="Follow-up suggestions"
          checked={followUpSuggestions}
          onCheckedChange={() => onToggle("followUpSuggestions")}
        />
      </div>
    </div>
  );
}
