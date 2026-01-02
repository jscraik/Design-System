import React from "react";

import { useMaxHeight } from "../../../shared/use-max-height";
import type { Album } from "../../../shared/data-types";

import FilmStrip from "./FilmStrip";

type FullscreenViewerProps = {
  album: Album;
};

/**
 * Render the full-screen album viewer.
 * @param props - Viewer props.
 * @returns The viewer element.
 */
export default function FullscreenViewer({ album }: FullscreenViewerProps) {
  const maxHeight = useMaxHeight() ?? undefined;
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    setIndex(0);
  }, [album?.id]);

  const photo = album?.photos?.[index];

  return (
    <div
      className="relative w-full h-full bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-1"
      style={{
        maxHeight,
        height: maxHeight,
      }}
    >
      <div className="absolute inset-0 flex flex-row overflow-hidden">
        {/* Film strip */}
        <div className="hidden md:block absolute pointer-events-none z-10 left-0 top-0 bottom-0 w-40">
          <FilmStrip album={album} selectedIndex={index} onSelect={setIndex} />
        </div>
        {/* Main photo */}
        <div className="flex-1 min-w-0 px-40 py-10 relative flex items-center justify-center">
          <div className="relative w-full h-full">
            {photo ? (
              <img
                src={photo.url}
                alt={photo.title || album.title}
                className="absolute inset-0 m-auto rounded-3xl shadow-sm border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3 max-w-full max-h-full object-contain"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
