import * as React from "react";

import { IconImage } from "../../../../icons";
import { cn } from "../../utils";
import { ShimmerInline } from "../../base/ShimmerText";
import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement>, StatefulComponentProps {
  fallback?: React.ReactNode;
  aspectRatio?: "square" | "video" | "auto";
  objectFit?: "cover" | "contain" | "fill" | "none";
  showLoadingState?: boolean;
}

/**
 * Renders an image with loading states, error handling, and aspect ratio support.
 *
 * Supports stateful props for loading, error, and disabled states.
 * Internal state management for image loading is preserved.
 * External state props can override or be used alongside internal state.
 *
 * @param props - Image props and stateful options.
 * @returns The image element or placeholder.
 *
 * @example
 * ```tsx
 * <Image src="/photo.jpg" alt="Photo" aspectRatio="square" />
 * <Image src="..." loading />
 * <Image src="..." error="Failed to load" />
 * ```
 */
function Image({
  className,
  src,
  alt,
  fallback,
  aspectRatio = "auto",
  objectFit = "cover",
  showLoadingState = true,
  loading: externalLoading = false,
  error: externalError,
  disabled = false,
  required,
  onStateChange,
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const [internalLoading, setInternalLoading] = React.useState(true);
  const [internalError, setInternalError] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(src);

  // Determine effective state (external takes priority over internal)
  const effectiveState: ComponentState = externalLoading
    ? "loading"
    : externalError
      ? "error"
      : internalError
        ? "error"
        : internalLoading
          ? "loading"
          : disabled
            ? "disabled"
            : "default";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Effective disabled state
  const isDisabled = disabled || externalLoading;
  const isLoading = externalLoading || internalLoading;
  const hasError = externalError || internalError;

  React.useEffect(() => {
    setImageSrc(src);
    setInternalLoading(true);
    setInternalError(false);
  }, [src]);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setInternalLoading(false);
    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setInternalLoading(false);
    setInternalError(true);
    onError?.(event);
  };

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "",
  } as const;

  const objectFitClasses = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
  } as const;

  if (hasError) {
    return (
      <div
        data-slot="image-error"
        data-state={effectiveState}
        data-error={hasError ? "true" : undefined}
        data-required={required ? "true" : undefined}
        aria-disabled={isDisabled || undefined}
        aria-invalid={hasError ? "true" : required ? "false" : undefined}
        aria-required={required || undefined}
        aria-busy={isLoading || undefined}
        className={cn(
          "flex items-center justify-center rounded-md bg-muted text-muted-foreground",
          aspectRatioClasses[aspectRatio],
          isDisabled && "opacity-50 pointer-events-none",
          className,
        )}
      >
        {fallback || (
          <div className="flex flex-col items-center gap-2 p-4">
            <IconImage className="size-8" />
            <span className="text-sm">{externalError || "Failed to load image"}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      data-slot="image"
      data-state={effectiveState}
      data-error={hasError ? "true" : undefined}
      data-required={required ? "true" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-invalid={hasError ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      aria-busy={isLoading || undefined}
      className={cn("relative overflow-hidden", isDisabled && "opacity-50 pointer-events-none", className)}
    >
      {isLoading && showLoadingState && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-muted",
            aspectRatioClasses[aspectRatio],
          )}
        >
          <ShimmerInline width="100%" height="100%" />
        </div>
      )}

      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "h-full w-full transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          aspectRatioClasses[aspectRatio],
          objectFitClasses[objectFit],
        )}
        {...props}
      />
    </div>
  );
}

export { Image };
