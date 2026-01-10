"use client";

import * as React from "react";

import { IconImage } from "../../../../icons";
import { cn } from "../../utils";
import { ShimmerInline } from "../../base/ShimmerText";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  aspectRatio?: "square" | "video" | "auto";
  objectFit?: "cover" | "contain" | "fill" | "none";
  showLoadingState?: boolean;
}

function Image({
  className,
  src,
  alt,
  fallback,
  aspectRatio = "auto",
  objectFit = "cover",
  showLoadingState = true,
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(src);

  React.useEffect(() => {
    setImageSrc(src);
    setLoading(true);
    setError(false);
  }, [src]);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setLoading(false);
    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setLoading(false);
    setError(true);
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

  if (error) {
    return (
      <div
        data-slot="image-error"
        className={cn(
          "flex items-center justify-center rounded-md bg-muted text-muted-foreground",
          aspectRatioClasses[aspectRatio],
          className,
        )}
      >
        {fallback || (
          <div className="flex flex-col items-center gap-2 p-4">
            <IconImage className="size-8" />
            <span className="text-sm">Failed to load image</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      data-slot="image"
      className={cn("relative overflow-hidden", className)}
    >
      {loading && showLoadingState && (
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
          loading ? "opacity-0" : "opacity-100",
          aspectRatioClasses[aspectRatio],
          objectFitClasses[objectFit],
        )}
        {...props}
      />
    </div>
  );
}

export { Image };
