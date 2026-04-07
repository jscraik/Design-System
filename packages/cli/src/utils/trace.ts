import { randomUUID } from "node:crypto";

export interface TraceContext {
  traceId: string;
  requestId: string;
  parentId?: string;
  sampled: boolean;
}

function generateTraceId(): string {
  // W3C trace context format: 32 hex chars
  return randomUUID().replace(/-/g, "").toLowerCase();
}

function generateRequestId(): string {
  // Shorter ID for request correlation (16 chars)
  return randomUUID().replace(/-/g, "").slice(0, 16).toLowerCase();
}

function shouldSample(): boolean {
  // Respect sampling from env or default to 100% for CLI
  const rate = parseFloat(process.env.ASTUDIO_TRACE_SAMPLE_RATE ?? "1.0");
  if (Number.isNaN(rate)) return true;
  return Math.random() < Math.max(0, Math.min(1, rate));
}

/**
 * Parse W3C traceparent header format
 * Format: 00-<trace-id>-<parent-id>-<flags>
 * Example: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
 */
export function parseTraceparent(traceparent: string): TraceContext | undefined {
  const parts = traceparent.trim().split("-");
  if (parts.length !== 4) return undefined;

  const [version, traceId, parentId, flags] = parts;

  // Validate version (should be 00 for now)
  if (version !== "00") return undefined;

  // Validate traceId (32 hex chars)
  if (!/^[0-9a-f]{32}$/i.test(traceId)) return undefined;

  // Validate parentId (16 hex chars)
  if (!/^[0-9a-f]{16}$/i.test(parentId)) return undefined;

  // Validate flags (2 hex chars)
  if (!/^[0-9a-f]{2}$/i.test(flags)) return undefined;

  // Check sampled bit (least significant bit of flags)
  const sampled = (parseInt(flags, 16) & 0x01) === 0x01;

  return {
    traceId: traceId.toLowerCase(),
    requestId: generateRequestId(),
    parentId: parentId.toLowerCase(),
    sampled,
  };
}

/**
 * Parse AWS X-Ray trace header format
 * Format: Root=<trace-id>;Parent=<parent-id>;Sampled=<0|1>
 * Example: Root=1-5759e988-bd862e3fe1be46a994272793;Parent=53995c3f42cd8ad8;Sampled=1
 */
export function parseXrayTrace(xrayHeader: string): TraceContext | undefined {
  const parts = xrayHeader.trim().split(";");
  const traceIdMatch = parts.find((p) => p.startsWith("Root="));
  const parentIdMatch = parts.find((p) => p.startsWith("Parent="));
  const sampledMatch = parts.find((p) => p.startsWith("Sampled="));

  if (!traceIdMatch) return undefined;

  const traceId = traceIdMatch.slice(5);
  const parentId = parentIdMatch?.slice(7);
  const sampled = sampledMatch?.slice(8) === "1";

  // Convert X-Ray trace ID format to W3C format if needed
  // X-Ray: 1-5759e988-bd862e3fe1be46a994272793
  // W3C: 5759e988bd862e3fe1be46a994272793 (without version and timestamp)
  const normalizedTraceId = traceId.replace(/-/g, "").slice(1).toLowerCase();

  if (normalizedTraceId.length !== 32) return undefined;

  return {
    traceId: normalizedTraceId,
    requestId: generateRequestId(),
    parentId: parentId?.toLowerCase(),
    sampled: sampled ?? shouldSample(),
  };
}

/**
 * Get trace context from environment variables or create new
 */
export function getTraceContext(): TraceContext | undefined {
  // Support W3C traceparent header format
  const traceparent = process.env.TRACEPARENT;
  if (traceparent) {
    const parsed = parseTraceparent(traceparent);
    if (parsed) return parsed;
  }

  // Support AWS X-Ray format
  const xray = process.env._X_AMZN_TRACE_ID;
  if (xray) {
    const parsed = parseXrayTrace(xray);
    if (parsed) return parsed;
  }

  // Support explicit trace ID injection
  const astudioTraceId = process.env.ASTUDIO_TRACE_ID;
  if (astudioTraceId) {
    const normalized = astudioTraceId.replace(/-/g, "").toLowerCase();
    if (/^[0-9a-f]{32}$/i.test(normalized)) {
      return {
        traceId: normalized,
        requestId: generateRequestId(),
        sampled: shouldSample(),
      };
    }
  }

  return undefined;
}

/**
 * Create a new trace context, optionally inheriting from a parent
 */
export function createTraceContext(parentContext?: TraceContext): TraceContext {
  if (parentContext) {
    return {
      traceId: parentContext.traceId,
      requestId: generateRequestId(),
      parentId: parentContext.requestId,
      sampled: parentContext.sampled,
    };
  }

  // Try to get from environment first
  const envContext = getTraceContext();
  if (envContext) {
    // Use the parsed context directly (already has generated requestId)
    return envContext;
  }

  // Create entirely new context
  return {
    traceId: generateTraceId(),
    requestId: generateRequestId(),
    sampled: shouldSample(),
  };
}

/**
 * Format trace context as W3C traceparent header
 */
export function formatTraceparent(context: TraceContext): string {
  const flags = context.sampled ? "01" : "00";
  // Use current span ID (requestId) as the parent-id for child processes
  // This establishes correct parent-child linkage in distributed traces
  const parentId = context.requestId.padStart(16, "0").slice(0, 16);
  return `00-${context.traceId}-${parentId}-${flags}`;
}
