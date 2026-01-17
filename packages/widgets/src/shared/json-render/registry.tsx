/**
 * JSON Render Registry - Maps catalog component names to React components.
 *
 * Each entry receives the element definition and renders using @astudio/ui
 * components or custom widget components matching existing patterns.
 *
 * @see https://github.com/vercel-labs/json-render
 * @see docs/json-render/REGISTRY.md for implementation guide
 */
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@astudio/ui";
import type { ComponentRegistry, ComponentRenderProps } from "@json-render/react";
import { useState } from "react";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format a numeric value based on format type.
 */
function formatValue(value: string | number, format?: string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);

  switch (format) {
    case "currency":
      return `$${num.toLocaleString()}`;
    case "percent":
      return `${num}%`;
    case "duration":
      return formatDuration(num);
    case "number":
    default:
      return num.toLocaleString();
  }
}

/**
 * Format duration in milliseconds to human readable.
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

/**
 * Get status color classes.
 */
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    success: "bg-green-500/20 text-green-400 border-green-500/30",
    healthy: "bg-green-500/20 text-green-400 border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    degraded: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
    unhealthy: "bg-red-500/20 text-red-400 border-red-500/30",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    neutral: "bg-white/10 text-white/60 border-white/20",
  };
  return colors[status] || colors.neutral;
}

// ============================================================================
// COMPONENT REGISTRY
// ============================================================================

/**
 * Component registry mapping catalog names to React implementations.
 */
export const astudioRegistry: ComponentRegistry = {
  // ==========================================================================
  // LAYOUT COMPONENTS
  // ==========================================================================

  Card: ({ element, children }: ComponentRenderProps) => {
    const {
      title,
      description,
      variant = "default",
    } = element.props as {
      title?: string;
      description?: string;
      variant?: "default" | "outline" | "ghost";
    };

    const variantClasses = {
      default: "bg-white/5 border-white/10",
      outline: "bg-transparent border-white/20",
      ghost: "bg-transparent border-transparent",
    };

    return (
      <Card className={variantClasses[variant]}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle className="text-white">{title}</CardTitle>}
            {description && (
              <CardDescription className="text-white/60">{description}</CardDescription>
            )}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    );
  },

  Stack: ({ element, children }: ComponentRenderProps) => {
    const {
      direction = "vertical",
      gap = "md",
      align = "stretch",
      justify = "start",
    } = element.props as {
      direction?: "horizontal" | "vertical";
      gap?: "xs" | "sm" | "md" | "lg" | "xl";
      align?: "start" | "center" | "end" | "stretch";
      justify?: "start" | "center" | "end" | "between" | "around";
    };

    const gapClasses = { xs: "gap-1", sm: "gap-2", md: "gap-3", lg: "gap-4", xl: "gap-6" };
    const alignClasses = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };
    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    };
    const directionClass = direction === "horizontal" ? "flex-row" : "flex-col";

    return (
      <div
        className={`flex ${directionClass} ${gapClasses[gap]} ${alignClasses[align]} ${justifyClasses[justify]}`}
      >
        {children}
      </div>
    );
  },

  Grid: ({ element, children }: ComponentRenderProps) => {
    const {
      columns = "2",
      gap = "md",
      responsive = true,
    } = element.props as {
      columns?: "1" | "2" | "3" | "4" | "auto";
      gap?: "xs" | "sm" | "md" | "lg" | "xl";
      responsive?: boolean;
    };

    const gapClasses = { xs: "gap-1", sm: "gap-2", md: "gap-3", lg: "gap-4", xl: "gap-6" };
    const colClasses = responsive
      ? {
          "1": "grid-cols-1",
          "2": "grid-cols-1 sm:grid-cols-2",
          "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
          auto: "grid-cols-auto-fit",
        }
      : {
          "1": "grid-cols-1",
          "2": "grid-cols-2",
          "3": "grid-cols-3",
          "4": "grid-cols-4",
          auto: "grid-cols-auto-fit",
        };

    return <div className={`grid ${colClasses[columns]} ${gapClasses[gap]}`}>{children}</div>;
  },

  Tabs: ({ element, children }: ComponentRenderProps) => {
    const { defaultTab, tabs } = element.props as {
      defaultTab?: string;
      tabs: Array<{ id: string; label: string; icon?: string }>;
    };

    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-white/80">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {children}
      </Tabs>
    );
  },

  Accordion: ({ element, children }: ComponentRenderProps) => {
    const { title, defaultOpen = false } = element.props as {
      title: string;
      defaultOpen?: boolean;
    };

    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
      <div className="border border-white/10 rounded-lg">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-white/5"
        >
          <span className="font-medium">{title}</span>
          <span className="text-white/60">{isOpen ? "−" : "+"}</span>
        </button>
        {isOpen && <div className="px-4 py-3 border-t border-white/10">{children}</div>}
      </div>
    );
  },

  // ==========================================================================
  // DATA DISPLAY COMPONENTS
  // ==========================================================================

  Metric: ({ element }: ComponentRenderProps) => {
    const { label, value, change, trend, format, icon } = element.props as {
      label: string;
      value: string | number;
      change?: string;
      trend?: "up" | "down" | "neutral";
      format?: "currency" | "percent" | "number" | "duration";
      icon?: string;
    };

    const trendColors = {
      up: "text-green-400",
      down: "text-red-400",
      neutral: "text-white/60",
    };

    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-2 text-xs text-white/60 mb-1">
          {icon && <span>{icon}</span>}
          <span>{label}</span>
        </div>
        <div className="text-base font-semibold text-white">{formatValue(value, format)}</div>
        {change && (
          <div className={`text-xs ${trend ? trendColors[trend] : "text-white/70"}`}>{change}</div>
        )}
      </div>
    );
  },

  StatusBadge: ({ element }: ComponentRenderProps) => {
    const {
      status,
      label,
      size = "md",
    } = element.props as {
      status: "success" | "warning" | "error" | "info" | "neutral";
      label: string;
      size?: "sm" | "md" | "lg";
    };

    const sizeClasses = {
      sm: "text-xs px-2 py-0.5",
      md: "text-sm px-2.5 py-1",
      lg: "text-base px-3 py-1.5",
    };

    return (
      <Badge
        className={`${getStatusColor(status)} ${sizeClasses[size]} font-medium rounded-full border`}
      >
        {label}
      </Badge>
    );
  },

  ProgressBar: ({ element }: ComponentRenderProps) => {
    const {
      value,
      label,
      showValue = true,
      variant = "default",
    } = element.props as {
      value: number;
      label?: string;
      showValue?: boolean;
      variant?: "default" | "success" | "warning" | "error";
    };

    const variantColors = {
      default: "bg-blue-500",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500",
    };

    return (
      <div className="space-y-1">
        {(label || showValue) && (
          <div className="flex items-center justify-between text-xs text-white/60">
            {label && <span>{label}</span>}
            {showValue && <span>{value}%</span>}
          </div>
        )}
        <Progress value={value} className="h-2" indicatorClassName={variantColors[variant]} />
      </div>
    );
  },

  Table: ({ element }: ComponentRenderProps) => {
    const {
      columns,
      rows,
      striped = false,
    } = element.props as {
      columns: Array<{ key: string; label: string; sortable?: boolean }>;
      rows: Array<Record<string, unknown>>;
      striped?: boolean;
    };

    return (
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              {columns.map((col) => (
                <TableHead key={col.key} className="text-white/80">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow
                key={idx}
                className={`border-white/10 ${striped && idx % 2 === 1 ? "bg-white/5" : ""}`}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className="text-white/90">
                    {String(row[col.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },

  List: ({ element }: ComponentRenderProps) => {
    const { items, variant = "default" } = element.props as {
      items: Array<{ id: string; label: string; icon?: string; description?: string }>;
      variant?: "default" | "compact" | "detailed";
    };

    const variantClasses = {
      default: "py-2",
      compact: "py-1",
      detailed: "py-3",
    };

    return (
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-2 px-3 ${variantClasses[variant]} rounded hover:bg-white/5`}
          >
            {item.icon && <span className="text-white/60">{item.icon}</span>}
            <div className="flex-1">
              <div className="text-sm text-white">{item.label}</div>
              {item.description && variant === "detailed" && (
                <div className="text-xs text-white/60">{item.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  },

  KeyValue: ({ element }: ComponentRenderProps) => {
    const {
      label,
      value,
      variant = "horizontal",
    } = element.props as {
      label: string;
      value: string;
      variant?: "horizontal" | "vertical";
    };

    if (variant === "vertical") {
      return (
        <div className="space-y-1">
          <div className="text-xs text-white/60">{label}</div>
          <div className="text-sm text-white font-medium">{value}</div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-white/60">{label}</span>
        <span className="text-sm text-white font-medium">{value}</span>
      </div>
    );
  },

  // ==========================================================================
  // INTERACTIVE COMPONENTS
  // ==========================================================================

  Button: ({ element, onAction }: ComponentRenderProps) => {
    const {
      label,
      variant,
      size,
      action,
      icon,
      disabled = false,
    } = element.props as {
      label: string;
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
      size?: "default" | "sm" | "lg" | "icon";
      action: string;
      icon?: string;
      disabled?: boolean;
    };

    return (
      <Button
        variant={variant ?? "secondary"}
        size={size ?? "default"}
        onClick={() => onAction?.({ name: action, params: {} })}
        disabled={disabled}
        className="text-white"
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </Button>
    );
  },

  ButtonGroup: ({ element, children }: ComponentRenderProps) => {
    const { orientation = "horizontal" } = element.props as {
      orientation?: "horizontal" | "vertical";
    };

    return (
      <div className={`flex ${orientation === "vertical" ? "flex-col" : "flex-row"} gap-2`}>
        {children}
      </div>
    );
  },

  Link: ({ element }: ComponentRenderProps) => {
    const {
      label,
      href,
      external = false,
    } = element.props as {
      label: string;
      href: string;
      external?: boolean;
    };

    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="text-blue-400 hover:text-blue-300 underline"
      >
        {label}
        {external && <span className="ml-1">↗</span>}
      </a>
    );
  },

  // ==========================================================================
  // CONTENT COMPONENTS
  // ==========================================================================

  Text: ({ element }: ComponentRenderProps) => {
    const {
      content,
      variant = "body",
      align = "left",
    } = element.props as {
      content: string;
      variant?: "heading" | "subheading" | "body" | "caption" | "code" | "muted";
      align?: "left" | "center" | "right";
    };

    const variantClasses = {
      heading: "text-lg font-semibold text-white",
      subheading: "text-base font-medium text-white/90",
      body: "text-sm text-white/80",
      caption: "text-xs text-white/60",
      code: "text-sm font-mono bg-black/30 px-1 py-0.5 rounded text-white/90",
      muted: "text-sm text-white/50",
    };

    const alignClasses = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    return <div className={`${variantClasses[variant]} ${alignClasses[align]}`}>{content}</div>;
  },

  Alert: ({ element }: ComponentRenderProps) => {
    const {
      title,
      message,
      variant = "info",
      dismissible = false,
    } = element.props as {
      title?: string;
      message: string;
      variant?: "info" | "success" | "warning" | "error";
      dismissible?: boolean;
    };

    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
      <Alert variant={variant as "default" | "destructive"}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>{message}</AlertDescription>
          </div>
          {dismissible && (
            <button onClick={() => setVisible(false)} className="text-white/60 hover:text-white">
              ×
            </button>
          )}
        </div>
      </Alert>
    );
  },

  Code: ({ element }: ComponentRenderProps) => {
    const {
      code,
      language,
      showLineNumbers = false,
    } = element.props as {
      code: string;
      language?: string;
      showLineNumbers?: boolean;
    };

    const lines = code.split("\n");

    return (
      <pre className="rounded-lg bg-black/30 p-3 overflow-x-auto">
        <code className="text-xs text-white/80 font-mono">
          {showLineNumbers
            ? lines.map((line, i) => (
                <div key={i}>
                  <span className="text-white/40 mr-4">{i + 1}</span>
                  {line}
                </div>
              ))
            : code}
        </code>
      </pre>
    );
  },

  Image: ({ element }: ComponentRenderProps) => {
    const {
      src,
      alt,
      width,
      height,
      rounded = false,
    } = element.props as {
      src: string;
      alt: string;
      width?: string;
      height?: string;
      rounded?: boolean;
    };

    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={rounded ? "rounded-lg" : ""}
      />
    );
  },

  Divider: ({ element }: ComponentRenderProps) => {
    const { orientation = "horizontal", label } = element.props as {
      orientation?: "horizontal" | "vertical";
      label?: string;
    };

    if (label) {
      return (
        <div className="flex items-center gap-3 my-4">
          <Separator className="flex-1 bg-white/10" />
          <span className="text-xs text-white/60">{label}</span>
          <Separator className="flex-1 bg-white/10" />
        </div>
      );
    }

    return (
      <Separator
        orientation={orientation}
        className={`bg-white/10 ${orientation === "vertical" ? "h-full w-px" : "my-2"}`}
      />
    );
  },

  Spacer: ({ element }: ComponentRenderProps) => {
    const { size = "md" } = element.props as {
      size?: "xs" | "sm" | "md" | "lg" | "xl";
    };

    const sizeClasses = {
      xs: "h-1",
      sm: "h-2",
      md: "h-4",
      lg: "h-6",
      xl: "h-8",
    };

    return <div className={sizeClasses[size]} />;
  },

  // ==========================================================================
  // SPECIALIZED COMPONENTS (CortexDx, Monitoring, etc.)
  // ==========================================================================

  LogEntry: ({ element }: ComponentRenderProps) => {
    const { level, timestamp, message, metadata } = element.props as {
      level: "debug" | "info" | "warn" | "error";
      timestamp: string;
      message: string;
      metadata?: Record<string, unknown>;
    };

    const levelColors = {
      debug: "text-white/60",
      info: "text-blue-400",
      warn: "text-yellow-400",
      error: "text-red-400",
    };

    return (
      <div className="flex items-start gap-3 py-2 px-3 hover:bg-white/5 rounded font-mono text-xs">
        <span className={`${levelColors[level]} font-semibold uppercase w-12`}>{level}</span>
        <span className="text-white/40">{new Date(timestamp).toLocaleTimeString()}</span>
        <span className="text-white/80 flex-1">{message}</span>
        {metadata && (
          <span className="text-white/40 text-xs">{JSON.stringify(metadata).slice(0, 50)}</span>
        )}
      </div>
    );
  },

  TraceSpan: ({ element }: ComponentRenderProps) => {
    const {
      name,
      traceId,
      spanId,
      duration,
      status = "ok",
    } = element.props as {
      name: string;
      traceId: string;
      spanId: string;
      duration?: number;
      status?: "ok" | "error";
    };

    return (
      <div className="border border-white/10 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">{name}</span>
          <div className="flex items-center gap-2">
            {duration && <span className="text-xs text-white/60">{formatDuration(duration)}</span>}
            <Badge className={getStatusColor(status)}>{status}</Badge>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-white/40 font-mono">
          <span>trace: {traceId.slice(0, 8)}...</span>
          <span>span: {spanId.slice(0, 8)}...</span>
        </div>
      </div>
    );
  },

  AgentRunCard: ({ element }: ComponentRenderProps) => {
    const { runId, workflow, status, progress, startTime } = element.props as {
      runId: string;
      workflow: string;
      status: "running" | "paused" | "completed" | "failed";
      progress?: number;
      startTime: string;
    };

    const statusColors = {
      running: "success",
      paused: "warning",
      completed: "info",
      failed: "error",
    };

    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm">{workflow}</CardTitle>
            <Badge className={getStatusColor(statusColors[status])}>{status}</Badge>
          </div>
          <CardDescription className="text-white/60 text-xs font-mono">
            {runId.slice(0, 12)}...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {progress !== undefined && <Progress value={progress} className="h-2" />}
          <div className="text-xs text-white/60">
            Started: {new Date(startTime).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    );
  },

  HealthIndicator: ({ element }: ComponentRenderProps) => {
    const { component, status, message, lastCheck } = element.props as {
      component: string;
      status: "healthy" | "degraded" | "unhealthy";
      message?: string;
      lastCheck?: string;
    };

    return (
      <div className="flex items-center justify-between py-2 px-3 rounded hover:bg-white/5">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${
              status === "healthy"
                ? "bg-green-500"
                : status === "degraded"
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          />
          <div>
            <div className="text-sm text-white font-medium">{component}</div>
            {message && <div className="text-xs text-white/60">{message}</div>}
          </div>
        </div>
        {lastCheck && (
          <div className="text-xs text-white/40">{new Date(lastCheck).toLocaleTimeString()}</div>
        )}
      </div>
    );
  },
};
