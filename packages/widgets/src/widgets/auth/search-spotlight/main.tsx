import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Flame, MapPin, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useWidgetProps } from "../../../shared/use-widget-props";
import { mountWidget, WidgetErrorBoundary } from "../../../shared/widget-base";
import "../../../styles.css";

interface Place {
  id: string;
  name: string;
  description: string;
  city: string;
  rating: number;
  price: string;
  thumbnail: string;
}

// Sample data - in production this comes from tool structuredContent
const defaultPlaces: Place[] = [
  {
    id: "nova-slice-lab",
    name: "Nova Slice Lab",
    description: "Award-winning Neapolitan pies",
    city: "North Beach",
    rating: 4.8,
    price: "$$",
    thumbnail: "https://persistent.oaistatic.com/pizzaz/pizzaz-1.png",
  },
  {
    id: "midnight-marinara",
    name: "Midnight Marinara",
    description: "Focaccia-style squares",
    city: "North Beach",
    rating: 4.6,
    price: "$",
    thumbnail: "https://persistent.oaistatic.com/pizzaz/pizzaz-2.png",
  },
  {
    id: "cinder-oven-co",
    name: "Cinder Oven Co.",
    description: "Thin-crust classics",
    city: "Mission",
    rating: 4.5,
    price: "$",
    thumbnail: "https://persistent.oaistatic.com/pizzaz/pizzaz-3.png",
  },
];

function SliceCard({ place, index }: { place: Place; index: number }) {
  return (
    <article className="min-w-[240px] sm:min-w-[270px] max-w-[270px] flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="relative h-36 w-full overflow-hidden">
        <img src={place.thumbnail} alt={place.name} className="h-full w-full object-cover" />
        <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-black shadow-sm">
          #{index + 1}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">{place.name}</div>
            <div className="mt-1 text-sm text-black/60">{place.description}</div>
          </div>
          <div className="rounded-full bg-black/5 px-2 py-1 text-xs text-black/70">{place.price}</div>
        </div>
        <div className="mt-auto flex items-center justify-between text-sm text-black/70">
          <div className="flex items-center gap-1">
            <Star strokeWidth={1.5} className="h-4 w-4 text-black" />
            <span>{place.rating?.toFixed ? place.rating.toFixed(1) : place.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin strokeWidth={1.5} className="h-4 w-4" />
            <span>{place.city}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function SearchSpotlightWidget() {
  const { pizzaTopping = "", places: propsPlaces } = useWidgetProps<{
    pizzaTopping?: string;
    places?: Place[];
  }>({ pizzaTopping: "", places: undefined });

  const places = propsPlaces ?? defaultPlaces;
  const toppingLabel = String(pizzaTopping || "").trim();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateButtons();
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);
    return () => {
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi, updateButtons]);

  return (
    <div className="antialiased relative w-full text-black rounded-2xl border border-black/10 bg-white overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F46C21]/15 text-[#F46C21]">
            <Flame strokeWidth={1.5} className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold">Spotlights</div>
            <div className="text-sm text-black/60">
              {toppingLabel ? `Topping focus: ${toppingLabel}` : "Trending near you"}
            </div>
          </div>
          <div className="ml-auto text-xs uppercase tracking-wide text-black/40">Updated 5m ago</div>
        </div>
        {toppingLabel && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#F46C21]/10 px-3 py-1 text-xs font-medium text-[#F46C21]">
            We saved your {toppingLabel} preference
          </div>
        )}
      </div>

      <div className="relative px-5 pb-6">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 items-stretch">
            {places.map((place, index) => (
              <SliceCard key={place.id} place={place} index={index} />
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 w-5 transition-opacity duration-200 ${
            canPrev ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="h-full w-full bg-gradient-to-r from-white via-white/70 to-transparent" />
        </div>
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 w-5 transition-opacity duration-200 ${
            canNext ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="h-full w-full bg-gradient-to-l from-white via-white/70 to-transparent" />
        </div>

        {/* Navigation buttons */}
        {canPrev && (
          <button
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white text-black shadow-lg ring ring-black/5 hover:bg-white"
            onClick={() => emblaApi?.scrollPrev()}
            type="button"
          >
            <ArrowLeft strokeWidth={1.5} className="h-4 w-4" />
          </button>
        )}
        {canNext && (
          <button
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white text-black shadow-lg ring ring-black/5 hover:bg-white"
            onClick={() => emblaApi?.scrollNext()}
            type="button"
          >
            <ArrowRight strokeWidth={1.5} className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <WidgetErrorBoundary>
      <SearchSpotlightWidget />
    </WidgetErrorBoundary>
  );
}

mountWidget(<App />);
