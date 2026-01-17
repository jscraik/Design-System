import { Badge } from "../../../components/ui";

export type Album = {
  id: string;
  title: string;
  cover: string;
  photos: Array<{ id: string; title?: string; url: string }>;
};

export function AlbumCard({
  album,
  onSelect,
}: {
  album: Album;
  onSelect?: (album: Album) => void;
}) {
  return (
    <button
      type="button"
      className="group relative flex-shrink-0 w-[272px] text-left p-0 h-auto min-h-0 gap-0 bg-transparent"
      onClick={() => onSelect?.(album)}
      aria-label={`Open album ${album.title}`}
    >
      <div className="flex w-full flex-col gap-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-16 shadow-foundation-card border border-border-subtle">
          <img
            src={album.cover}
            alt={album.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 bg-card/70 text-foreground backdrop-blur"
          >
            Featured
          </Badge>
        </div>
        <div className="px-1.5">
          <div className="text-list-title text-foreground truncate">{album.title}</div>
          <div className="mt-0.5 text-sm text-text-secondary">{album.photos.length} photos</div>
        </div>
      </div>
    </button>
  );
}
