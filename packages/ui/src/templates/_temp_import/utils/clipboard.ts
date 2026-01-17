/**
 * Utility function to copy text to clipboard with fallback for environments
 * where the Clipboard API is blocked by permissions policy
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || typeof document === "undefined") {
    return false;
  }
  // Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fall through to legacy method
      console.warn("Clipboard API failed, using fallback method:", err);
    }
  }

  // Fallback: use the older document.execCommand method
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Make the textarea invisible and non-interactive
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    textArea.style.opacity = "0";
    textArea.setAttribute("readonly", "");

    document.body.appendChild(textArea);

    // Select the text
    textArea.select();
    textArea.setSelectionRange(0, text.length);

    // Copy using execCommand
    const success = document.execCommand("copy");

    // Clean up
    document.body.removeChild(textArea);

    return success;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}
