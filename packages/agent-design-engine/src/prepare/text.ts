export function renderList(items: string[], emptyText = "None"): string[] {
  return items.length > 0 ? items.map((item) => `- ${item}`) : [`- ${emptyText}`];
}

export function renderPrepareStatus(safeForAutomaticImplementation: boolean): string {
  return safeForAutomaticImplementation ? "SAFE_TO_IMPLEMENT" : "STOP";
}
