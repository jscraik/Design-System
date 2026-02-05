import { AppsSDKButton } from "@design-studio/ui";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import { createRoot } from "react-dom/client";

import "../../../styles/widget.css";

import markers from "./markers.json";
import PlaceCard from "./PlaceCard";

/**
 * Render the Pizzaz carousel widget.
 */
function App() {
  const places = markers?.places || [];
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    containScroll: "trimSnaps",
    slidesToScroll: "auto",
    dragFree: false,
  });
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  React.useEffect(() => {
    if (!emblaApi) return;
    const updateButtons = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    updateButtons();
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);
    return () => {
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!emblaApi) return;
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        emblaApi.scrollPrev();
        break;
      case "ArrowRight":
        event.preventDefault();
        emblaApi.scrollNext();
        break;
      case "Home":
        event.preventDefault();
        emblaApi.scrollTo(0);
        break;
      case "End":
        event.preventDefault();
        emblaApi.scrollTo(Math.max(places.length - 1, 0));
        break;
      default:
        break;
    }
  };

  return (
    <div className="antialiased relative w-full text-foreground dark:text-foreground py-5 bg-background dark:bg-background">
      <h1 className="sr-only">Pizzaz Carousel</h1>
      <div className="sr-only" aria-live="polite">
        Carousel updated.
      </div>
      <div
        className="overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50"
        ref={emblaRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured pizza places"
        onKeyDown={handleKeyDown}
      >
        <div className="flex gap-4 max-sm:mx-5 items-stretch">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>
      {/* Edge gradients */}
      <div
        aria-hidden
        className={
          "pointer-events-none absolute inset-y-0 left-0 w-3 z-[5] transition-opacity duration-200 " +
          (canPrev ? "opacity-100" : "opacity-0")
        }
      >
        <div
          className="h-full w-full border-l border-border dark:border-border bg-gradient-to-r from-[var(--background)] dark:from-[var(--background)] to-transparent opacity-70"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, white 30%, white 70%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, white 30%, white 70%, transparent 100%)",
          }}
        />
      </div>
      <div
        aria-hidden
        className={
          "pointer-events-none absolute inset-y-0 right-0 w-3 z-[5] transition-opacity duration-200 " +
          (canNext ? "opacity-100" : "opacity-0")
        }
      >
        <div
          className="h-full w-full border-r border-border dark:border-border bg-gradient-to-l from-[var(--background)] dark:from-[var(--background)] to-transparent opacity-70"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, white 30%, white 70%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, white 30%, white 70%, transparent 100%)",
          }}
        />
      </div>
      <AppsSDKButton
        aria-label="Previous"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 shadow-lg"
        color="secondary"
        size="sm"
        variant="soft"
        uniform
        type="button"
        disabled={!canPrev}
        onClick={() => {
          if (!canPrev) return;
          emblaApi?.scrollPrev();
        }}
      >
        <ArrowLeft strokeWidth={1.5} className="h-4.5 w-4.5" aria-hidden="true" />
      </AppsSDKButton>
      <AppsSDKButton
        aria-label="Next"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 shadow-lg"
        color="secondary"
        size="sm"
        variant="soft"
        uniform
        type="button"
        disabled={!canNext}
        onClick={() => {
          if (!canNext) return;
          emblaApi?.scrollNext();
        }}
      >
        <ArrowRight strokeWidth={1.5} className="h-4.5 w-4.5" aria-hidden="true" />
      </AppsSDKButton>
    </div>
  );
}

const root = document.getElementById("pizzaz-carousel-root");

if (root) {
  createRoot(root).render(<App />);
}
