import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";

import { Button } from "../../components/ui";
import { IconArrowLeftSm, IconArrowRightSm } from "../../icons";

import { markers } from "./data/markers";
import { PlaceCard, type Place } from "./components/PlaceCard";

export function AppsSdkCarouselExample() {
  const places = markers.places.map((place) => ({ ...place })) as Place[];
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

  return (
    <div className="antialiased relative w-full py-5 bg-card text-foreground rounded-24 border border-border-strong shadow-foundation-card">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 max-sm:mx-5 items-stretch">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>
      <div
        aria-hidden
        className={
          "pointer-events-none absolute inset-y-0 left-0 w-3 z-[5] transition-opacity duration-200 " +
          (canPrev ? "opacity-100" : "opacity-0")
        }
      >
        <div
          className="h-full w-full border-l border-border-subtle bg-gradient-to-r from-black/10 to-transparent"
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
          className="h-full w-full border-r border-border-subtle bg-gradient-to-l from-black/10 to-transparent"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, white 30%, white 70%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, white 30%, white 70%, transparent 100%)",
          }}
        />
      </div>
      {canPrev && (
        <Button
          aria-label="Previous"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 shadow-foundation-close"
          size="sm"
          variant="secondary"
          onClick={() => emblaApi && emblaApi.scrollPrev()}
          type="button"
        >
          <IconArrowLeftSm className="h-4.5 w-4.5" aria-hidden="true" />
        </Button>
      )}
      {canNext && (
        <Button
          aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 shadow-foundation-close"
          size="sm"
          variant="secondary"
          onClick={() => emblaApi && emblaApi.scrollNext()}
          type="button"
        >
          <IconArrowRightSm className="h-4.5 w-4.5" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

export function AppsSdkCarouselExampleAlt() {
  const places = markers.places.slice(0, 5).map((place) => ({ ...place })) as Place[];

  return (
    <div className="antialiased relative w-full py-5 bg-muted text-foreground rounded-24 border border-border-subtle">
      <div className="px-4 pb-4">
        <div className="text-card-title">Top picks near you</div>
        <div className="text-list-subtitle text-text-secondary">Curated spots for this week.</div>
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-4 max-sm:mx-5 items-stretch px-4 pb-4">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>
    </div>
  );
}
