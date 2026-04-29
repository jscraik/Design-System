export function parsePlaywrightHost(
  value: string | undefined,
  fallback: string,
  label: string,
): string {
  const hostValue = (value ?? fallback).trim();
  if (!/^[A-Za-z0-9.-]+$/.test(hostValue)) {
    throw new Error(`Invalid Playwright ${label} host: ${hostValue}`);
  }
  return hostValue;
}

export function parsePlaywrightPort(
  value: string | undefined,
  fallback: number,
  label: string,
): number {
  const rawValue = value ?? String(fallback);
  const port = Number(rawValue);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`Invalid Playwright ${label} port: ${rawValue}`);
  }
  return port;
}
