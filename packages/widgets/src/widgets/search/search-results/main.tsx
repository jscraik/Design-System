import {
  createEmbeddedHost,
  ensureMockOpenAI,
  HostProvider,
  useToolOutput,
} from "@design-studio/runtime";
import { AppsSDKBadge, AppsSDKUIProvider } from "@design-studio/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../../styles.css";

// Mock for standalone development
if (import.meta.env.DEV) {
  ensureMockOpenAI({
    toolOutput: {
      query: "React components",
      results: [
        {
          id: 1,
          title: "Building Reusable React Components",
          description: "Learn how to create modular, reusable React components with TypeScript",
          url: "https://example.com/react-components",
          tags: ["React", "TypeScript", "Components"],
        },
        {
          id: 2,
          title: "React Component Patterns",
          description: "Advanced patterns for building scalable React applications",
          url: "https://example.com/react-patterns",
          tags: ["React", "Patterns", "Architecture"],
        },
        {
          id: 3,
          title: "Testing React Components",
          description: "Best practices for testing React components with Jest and Testing Library",
          url: "https://example.com/react-testing",
          tags: ["React", "Testing", "Jest"],
        },
      ],
    },
  });
}

/**
 * Render search results using tool output data.
 */
function SearchResultsWidget() {
  type SearchResult = {
    id: string | number;
    title: string;
    description?: string;
    url?: string;
    tags?: string[];
  };

  type SearchOutput = {
    query?: string;
    results?: SearchResult[];
  };

  const toolOutput = useToolOutput() as SearchOutput | null;
  const results = toolOutput?.results ?? [];
  const query = toolOutput?.query ?? "";

  return (
    <div className="p-4 space-y-4 bg-surface text-primary">
      <div className="border-b border-subtle pb-3">
        <h1 className="text-[16px] font-semibold leading-[22px] tracking-[-0.32px]">
          Search Results
        </h1>
        {query && (
          <p className="text-[13px] text-secondary mt-1 leading-[18px] tracking-[-0.3px]">
            Results for: <span className="text-primary">"{query}"</span>
          </p>
        )}
      </div>

      <div className="space-y-3">
        {results.map((result) => (
          <div
            key={result.id}
            className="border border-subtle rounded-lg p-4 bg-surface-secondary hover:bg-surface-tertiary transition-colors"
          >
            <h3 className="font-semibold text-[14px] leading-[20px] tracking-[-0.3px] text-primary hover:text-primary-soft">
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                {result.title}
              </a>
            </h3>
            <p className="text-[13px] text-secondary mt-1 line-clamp-2 leading-[18px] tracking-[-0.3px]">
              {result.description}
            </p>
            {result.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {result.tags.map((tag) => (
                  <AppsSDKBadge key={tag} variant="secondary" className="text-[11px]">
                    {tag}
                  </AppsSDKBadge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-8 text-tertiary text-[13px]">
          <p>No results found</p>
        </div>
      )}
    </div>
  );
}

/**
 * Provide host context and theming for the search results widget.
 */
function SearchResultsApp() {
  const host = createEmbeddedHost();

  return (
    <HostProvider host={host}>
      <AppsSDKUIProvider linkComponent="a">
        <SearchResultsWidget />
      </AppsSDKUIProvider>
    </HostProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SearchResultsApp />
  </StrictMode>,
);
