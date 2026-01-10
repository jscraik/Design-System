import React from "react";
import { createRoot } from "react-dom/client";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { HostProvider, createEmbeddedHost, ensureMockOpenAI, useHost } from "@astudio/runtime";
import { AppsSDKButton, AppsSDKUIProvider } from "@astudio/ui";

import "../../../styles/widget.css";

import { useMaxHeight } from "../../../shared/use-max-height";
import { useOpenAiGlobal } from "../../../shared/use-openai-global";
import type { Album } from "../../../shared/data-types";

import albumsData from "./albums.json";
import FullscreenViewer from "./FullscreenViewer";
import AlbumCard from "./AlbumCard";

type AlbumsCarouselProps = {
  onSelect: (album: Album) => void;
};

/**
 * Render the horizontal album carousel.
 * @param props - Carousel props.
 * @returns The carousel element.
 */
function AlbumsCarousel({ onSelect }: AlbumsCarouselProps) {
  const albums = (albumsData?.albums || []) as Album[];
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
        emblaApi.scrollPrev();
        break;
      case "ArrowRight":
        emblaApi.scrollNext();
        break;
      case "Home":
        emblaApi.scrollTo(0);
        break;
      case "End":
        emblaApi.scrollTo(Math.max(albums.length - 1, 0));
        break;
      default:
        break;
    }
  };

  return (
    <div className="antialiased relative w-full text-foundation-text-light-primary dark:text-foundation-text-dark-primary py-5 select-none bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1">
      <div
        className="overflow-hidden max-sm:mx-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foundation-accent-blue/50"
        ref={emblaRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured pizza albums"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="flex gap-5 items-stretch">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} onSelect={onSelect} />
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
          className="h-full w-full border-l border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-gradient-to-r from-[var(--foundation-bg-light-1)] dark:from-[var(--foundation-bg-dark-1)] to-transparent opacity-70"
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
          className="h-full w-full border-r border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 bg-gradient-to-l from-[var(--foundation-bg-light-1)] dark:from-[var(--foundation-bg-dark-1)] to-transparent opacity-70"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, white 30%, white 70%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, white 30%, white 70%, transparent 100%)",
          }}
        />
      </div>
      {canPrev && (
        <AppsSDKButton
          aria-label="Previous"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 shadow-lg"
          color="secondary"
          size="sm"
          variant="soft"
          uniform
          onClick={() => emblaApi && emblaApi.scrollPrev()}
          type="button"
        >
          <ArrowLeft strokeWidth={1.5} className="h-4.5 w-4.5" aria-hidden="true" />
        </AppsSDKButton>
      )}
      {canNext && (
        <AppsSDKButton
          aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 shadow-lg"
          color="secondary"
          size="sm"
          variant="soft"
          uniform
          onClick={() => emblaApi && emblaApi.scrollNext()}
          type="button"
        >
          <ArrowRight strokeWidth={1.5} className="h-4.5 w-4.5" aria-hidden="true" />
        </AppsSDKButton>
      )}
    </div>
  );
}

/**
 * Render the Pizzaz gallery widget.
 */
function App() {
  const displayMode = useOpenAiGlobal("displayMode");
  const host = useHost();
  const [selectedAlbum, setSelectedAlbum] = React.useState<Album | null>(null);
  const maxHeight = useMaxHeight() ?? undefined;

  const handleSelectAlbum = (album: Album) => {
    setSelectedAlbum(album);
    void host.requestDisplayMode?.({ mode: "fullscreen" });
  };

  return (
    <div
      className="relative antialiased w-full"
      style={{
        maxHeight,
        height: displayMode === "fullscreen" ? maxHeight : undefined,
      }}
    >
      <h1 className="sr-only">Pizzaz Gallery</h1>
      <div className="sr-only" aria-live="polite">
        Gallery updated.
      </div>
      {displayMode !== "fullscreen" && <AlbumsCarousel onSelect={handleSelectAlbum} />}

      {displayMode === "fullscreen" && selectedAlbum && <FullscreenViewer album={selectedAlbum} />}
    </div>
  );
}

const root = document.getElementById("pizzaz-albums-root");

if (root) {
  if (import.meta.env.DEV) {
    ensureMockOpenAI();
  }

  const host = createEmbeddedHost();

  createRoot(root).render(
    <HostProvider host={host}>
      <AppsSDKUIProvider linkComponent="a">
        <App />
      </AppsSDKUIProvider>
    </HostProvider>,
  );
}
