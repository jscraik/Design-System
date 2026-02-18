import type { GlobalOptions } from "../types.js";

export function logInfo(opts: GlobalOptions, message: string): void {
  if (opts.json || opts.plain || opts.quiet) return;
  process.stderr.write(`${message}\n`);
}

export function logDebug(opts: GlobalOptions, message: string): void {
  if (!opts.debug || opts.json || opts.plain || opts.quiet) return;
  process.stderr.write(`[debug] ${message}\n`);
}

export function logError(opts: GlobalOptions, message: string): void {
  if (opts.json || opts.plain) return;
  process.stderr.write(`${message}\n`);
}
