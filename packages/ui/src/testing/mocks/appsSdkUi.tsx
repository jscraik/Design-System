import type React from "react";

export const AppsSDKUIProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const Button = () => null;
export const Checkbox = () => null;
export const Image = () => null;
export const Input = () => null;
export const Badge = () => null;
export const CodeBlock = () => null;
export const Popover = () => null;
export const Textarea = () => null;
export const Download = ({ className }: { className?: string }) => (
  <span data-testid="download-icon" className={className} />
);
export const Sparkles = ({ className }: { className?: string }) => (
  <span data-testid="sparkles-icon" className={className} />
);
