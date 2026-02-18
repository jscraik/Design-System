import type { Album } from "../../../shared/data-types";

type FilmStripProps = {
  album: Album;
  selectedIndex: number;
  onSelect?: (index: number) => void;
};

/**
 * Render a vertical film strip for album navigation.
 * @param props - Film strip props.
 * @returns The film strip element.
 */
export default function FilmStrip({ album, selectedIndex, onSelect }: FilmStripProps) {
  return (
    <div className="h-full w-full overflow-auto flex flex-col items-center justify-center p-5 space-y-5">
      {album.photos.map((photo, idx) => (
        <button
          key={photo.id}
          type="button"
          aria-current={idx === selectedIndex ? "true" : undefined}
          onClick={() => onSelect?.(idx)}
          className={
            "block w-full p-[1px] pointer-events-auto rounded-[10px] cursor-pointer border transition-[colors,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
            (idx === selectedIndex
              ? "border-accent-blue"
              : "border-transparent hover:border-border dark:hover:border-border opacity-70 hover:opacity-100")
          }
        >
          <div className="aspect-[5/3] rounded-lg overflow-hidden w-full">
            <img
              src={photo.url}
              alt={photo.title || `Photo ${idx + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </button>
      ))}
    </div>
  );
}
