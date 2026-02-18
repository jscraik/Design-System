/**
 * JSON Render Catalog - Defines what components AI can generate.
 *
 * This catalog constrains AI output to only use approved components
 * with validated props. AI generates JSON, not code.
 *
 * @see https://github.com/vercel-labs/json-render
 * @see docs/json-render/CATALOG.md for component documentation
 */
import { createCatalog } from "@json-render/core";
import { z } from "zod";

export const astudioCatalog = createCatalog({
  components: {
    // ============================================================================
    // LAYOUT COMPONENTS
    // ============================================================================

    /**
     * Card - Container with optional header
     * Maps to @design-studio/ui Card compound component
     */
    Card: {
      props: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        variant: z.enum(["default", "outline", "ghost"]).optional(),
      }),
      hasChildren: true,
    },

    /**
     * Stack - Flexbox layout (vertical or horizontal)
     */
    Stack: {
      props: z.object({
        direction: z.enum(["horizontal", "vertical"]).optional(),
        gap: z.enum(["xs", "sm", "md", "lg", "xl"]).optional(),
        align: z.enum(["start", "center", "end", "stretch"]).optional(),
        justify: z.enum(["start", "center", "end", "between", "around"]).optional(),
      }),
      hasChildren: true,
    },

    /**
     * Grid - CSS Grid layout
     */
    Grid: {
      props: z.object({
        columns: z.enum(["1", "2", "3", "4", "auto"]).optional(),
        gap: z.enum(["xs", "sm", "md", "lg", "xl"]).optional(),
        responsive: z.boolean().optional(),
      }),
      hasChildren: true,
    },

    /**
     * Tabs - Tabbed interface
     */
    Tabs: {
      props: z.object({
        defaultTab: z.string().optional(),
        tabs: z.array(
          z.object({
            id: z.string(),
            label: z.string(),
            icon: z.string().optional(),
          }),
        ),
      }),
      hasChildren: true,
    },

    /**
     * Accordion - Collapsible sections
     */
    Accordion: {
      props: z.object({
        title: z.string(),
        defaultOpen: z.boolean().optional(),
      }),
      hasChildren: true,
    },

    // ============================================================================
    // DATA DISPLAY COMPONENTS
    // ============================================================================

    /**
     * Metric - Display a single metric with optional change indicator
     */
    Metric: {
      props: z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()]),
        change: z.string().optional(),
        trend: z.enum(["up", "down", "neutral"]).optional(),
        format: z.enum(["currency", "percent", "number", "duration"]).optional(),
        icon: z.string().optional(),
      }),
    },

    /**
     * StatusBadge - Status indicator with color coding
     */
    StatusBadge: {
      props: z.object({
        status: z.enum(["success", "warning", "error", "info", "neutral"]),
        label: z.string(),
        size: z.enum(["sm", "md", "lg"]).optional(),
      }),
    },

    /**
     * ProgressBar - Progress indicator
     */
    ProgressBar: {
      props: z.object({
        value: z.number().min(0).max(100),
        label: z.string().optional(),
        showValue: z.boolean().optional(),
        variant: z.enum(["default", "success", "warning", "error"]).optional(),
      }),
    },

    /**
     * Table - Data table with sortable columns
     */
    Table: {
      props: z.object({
        columns: z.array(
          z.object({
            key: z.string(),
            label: z.string(),
            sortable: z.boolean().optional(),
          }),
        ),
        rows: z.array(z.record(z.string(), z.any())),
        striped: z.boolean().optional(),
      }),
    },

    /**
     * List - Simple list with optional icons
     */
    List: {
      props: z.object({
        items: z.array(
          z.object({
            id: z.string(),
            label: z.string(),
            icon: z.string().optional(),
            description: z.string().optional(),
          }),
        ),
        variant: z.enum(["default", "compact", "detailed"]).optional(),
      }),
    },

    /**
     * KeyValue - Key-value pair display
     */
    KeyValue: {
      props: z.object({
        label: z.string(),
        value: z.string(),
        variant: z.enum(["horizontal", "vertical"]).optional(),
      }),
    },

    // ============================================================================
    // INTERACTIVE COMPONENTS
    // ============================================================================

    /**
     * Button - Action button
     * Maps to @design-studio/ui Button
     */
    Button: {
      props: z.object({
        label: z.string(),
        variant: z
          .enum(["default", "destructive", "outline", "secondary", "ghost", "link"])
          .optional(),
        size: z.enum(["default", "sm", "lg", "icon"]).optional(),
        action: z.string(),
        icon: z.string().optional(),
        disabled: z.boolean().optional(),
      }),
    },

    /**
     * ButtonGroup - Group of related buttons
     */
    ButtonGroup: {
      props: z.object({
        orientation: z.enum(["horizontal", "vertical"]).optional(),
      }),
      hasChildren: true,
    },

    /**
     * Link - Hyperlink
     */
    Link: {
      props: z.object({
        label: z.string(),
        href: z.string(),
        external: z.boolean().optional(),
      }),
    },

    // ============================================================================
    // CONTENT COMPONENTS
    // ============================================================================

    /**
     * Text - Text display with variants
     */
    Text: {
      props: z.object({
        content: z.string(),
        variant: z.enum(["heading", "subheading", "body", "caption", "code", "muted"]).optional(),
        align: z.enum(["left", "center", "right"]).optional(),
      }),
    },

    /**
     * Alert - Alert/notification message
     */
    Alert: {
      props: z.object({
        title: z.string().optional(),
        message: z.string(),
        variant: z.enum(["info", "success", "warning", "error"]).optional(),
        dismissible: z.boolean().optional(),
      }),
    },

    /**
     * Code - Code block with syntax highlighting
     */
    Code: {
      props: z.object({
        code: z.string(),
        language: z.string().optional(),
        showLineNumbers: z.boolean().optional(),
      }),
    },

    /**
     * Image - Image display
     */
    Image: {
      props: z.object({
        src: z.string(),
        alt: z.string(),
        width: z.string().optional(),
        height: z.string().optional(),
        rounded: z.boolean().optional(),
      }),
    },

    /**
     * Divider - Visual separator
     */
    Divider: {
      props: z.object({
        orientation: z.enum(["horizontal", "vertical"]).optional(),
        label: z.string().optional(),
      }),
    },

    /**
     * Spacer - Empty space for layout
     */
    Spacer: {
      props: z.object({
        size: z.enum(["xs", "sm", "md", "lg", "xl"]).optional(),
      }),
    },

    // ============================================================================
    // SPECIALIZED COMPONENTS (CortexDx, Monitoring, etc.)
    // ============================================================================

    /**
     * LogEntry - Single log entry display
     */
    LogEntry: {
      props: z.object({
        level: z.enum(["debug", "info", "warn", "error"]),
        timestamp: z.string(),
        message: z.string(),
        metadata: z.record(z.string(), z.any()).optional(),
      }),
    },

    /**
     * TraceSpan - Distributed trace span
     */
    TraceSpan: {
      props: z.object({
        name: z.string(),
        traceId: z.string(),
        spanId: z.string(),
        duration: z.number().optional(),
        status: z.enum(["ok", "error"]).optional(),
      }),
    },

    /**
     * AgentRunCard - Agent execution run display
     */
    AgentRunCard: {
      props: z.object({
        runId: z.string(),
        workflow: z.string(),
        status: z.enum(["running", "paused", "completed", "failed"]),
        progress: z.number().min(0).max(100).optional(),
        startTime: z.string(),
      }),
    },

    /**
     * HealthIndicator - System health indicator
     */
    HealthIndicator: {
      props: z.object({
        component: z.string(),
        status: z.enum(["healthy", "degraded", "unhealthy"]),
        message: z.string().optional(),
        lastCheck: z.string().optional(),
      }),
    },
  },

  actions: {
    // Data actions
    refresh_data: { description: "Refresh the widget data" },
    export_data: { description: "Export data to CSV or JSON" },
    load_more: { description: "Load more items" },

    // Navigation actions
    view_details: { description: "View detailed information" },
    go_back: { description: "Navigate back" },
    open_link: { description: "Open external link" },

    // Communication actions
    send_message: { description: "Send a follow-up message to ChatGPT" },
    share: { description: "Share content" },

    // Control actions (CortexDx)
    pause_run: { description: "Pause an agent run" },
    resume_run: { description: "Resume a paused agent run" },
    cancel_run: { description: "Cancel an agent run" },
    restart_component: { description: "Restart a system component" },

    // Filter/Search actions
    apply_filter: { description: "Apply filter criteria" },
    clear_filter: { description: "Clear all filters" },
    search: { description: "Perform search" },

    // CRUD actions
    create: { description: "Create new item" },
    update: { description: "Update existing item" },
    delete: { description: "Delete item" },
  },
});

export type AStudioCatalog = typeof astudioCatalog;
