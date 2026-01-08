import * as React from "react";
import { ImageOff } from "lucide-react";

import { cn } from "./utils";
import { ShimmerInline } from "./shimmer-text";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  aspectRatio?: "square" | "video" | "auto";
  objectFit?: "cover" | "contain" | "fill" | "none";
  showLoadingState?: boolean;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
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
    },
    ref
  ) => {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [imageSrc, setImageSrc] = React.useState(src);

    React.useEffect(() => {
      setImageSrc(src);
      setLoading(true);
      setError(false);
    }, [src]);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setLoading(false);
      onLoad?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setLoading(false);
      setError(true);
      onError?.(e);
    };

    const aspectRatioClasses = {
      square: "aspect-square",
      video: "aspect-video",
      auto: "",
    };

    const objectFitClasses = {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      none: "object-none",
    };

    // Show error state
    if (error) {
      return (
        <div
          className={cn(
            "flex items-center justify-center bg-foundation-bg-dark-2 text-foundation-text-dark-tertiary",
            aspectRatioClasses[aspectRatio],
            className
          )}
        >
          {fallback || (
            <div className="flex flex-col items-center gap-2 p-4">
              <ImageOff className="size-8" />
              <span className="text-sm">Failed to load image</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={cn("relative overflow-hidden", className)}>
        {/* Loading state */}
        {loading && showLoadingState && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-foundation-bg-dark-2",
              aspectRatioClasses[aspectRatio]
            )}
          >
            <ShimmerInline width="100%" height="100%" />
          </div>
        )}

        {/* Actual image */}
        <img
          ref={ref}
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            loading ? "opacity-0" : "opacity-100",
            aspectRatioClasses[aspectRatio],
            objectFitClasses[objectFit],
            "w-full h-full"
          )}
          {...props}
        />
      </div>
    );
  }
);
Image.displayName = "Image";

// Avatar variant with fallback initials
export interface AvatarImageProps extends Omit<ImageProps, "fallback"> {
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ name, size = "md", className, ...props }, ref) => {
    const sizeClasses = {
      sm: "size-8 text-xs",
      md: "size-10 text-sm",
      lg: "size-12 text-base",
      xl: "size-16 text-lg",
    };

    const initials = name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const fallback = (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-foundation-accent-blue text-white font-medium",
          sizeClasses[size]
        )}
      >
        {initials || "?"}
      </div>
    );

    return (
      <Image
        ref={ref}
        fallback={fallback}
        aspectRatio="square"
        objectFit="cover"
        className={cn("rounded-full", sizeClasses[size], className)}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

export { Image, AvatarImage };
