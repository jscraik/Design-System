/**
 * Copies a string to the system clipboard.
 *
 * This function is a no-op during server-side rendering.
 *
 * @param value - Text to copy.
 * @returns A promise that resolves when the copy attempt completes.
 * @throws DOMException when clipboard permissions are denied or unsupported.
 *
 * @example
 * ```ts
 * await copyToClipboard("Hello");
 * ```
 */
export async function copyToClipboard(value: string) {
  if (typeof navigator === "undefined") return;

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
