import type { Album } from "./AlbumCard";

export function FilmStrip({
  album,
  selectedIndex,
  onSelect,
}: {
  album: Album;
  selectedIndex: number;
  onSelect?: (index: number) => void;
}) {
  return (
    <div className="h-full w-full overflow-auto flex flex-col items-center justify-center p-5 space-y-5">
      {album.photos.map((photo, idx) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => onSelect?.(idx)}
          className={
            "block w-full p-[1px] pointer-events-auto rounded-10 cursor-pointer border transition-[colors,opacity] " +
            (idx === selectedIndex
              ? "border-border-strong"
              : "border-transparent hover:border-border-subtle opacity-60 hover:opacity-100")
          }
        >
          <div className="aspect-[5/3] rounded-10 overflow-hidden w-full">
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
