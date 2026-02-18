export function logInfo(opts, message) {
    if (opts.json || opts.plain || opts.quiet)
        return;
    process.stderr.write(`${message}\n`);
}
export function logDebug(opts, message) {
    if (!opts.debug || opts.json || opts.plain || opts.quiet)
        return;
    process.stderr.write(`[debug] ${message}\n`);
}
export function logError(opts, message) {
    if (opts.json || opts.plain)
        return;
    process.stderr.write(`${message}\n`);
}
//# sourceMappingURL=logger.js.map