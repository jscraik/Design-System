import { Badge, Button, Image } from "@chatui/ui";

type Photo = {
  id: string;
  title: string;
  url: string;
};

type Album = {
  id: string;
  title: string;
  cover: string;
  photos: Photo[];
};

type AlbumCardProps = {
  album: Album;
  onSelect?: (album: Album) => void;
};

function AlbumCard({ album, onSelect }: AlbumCardProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      color="secondary"
      pill={false}
      className="group relative flex-shrink-0 w-[272px] bg-white text-left p-0 h-auto min-h-0 rounded-none shadow-none gap-0 before:hidden"
      onClick={() => onSelect?.(album)}
    >
      <div className="flex w-full flex-col gap-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={album.cover}
            alt={album.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <Badge
            variant="soft"
            color="secondary"
            size="sm"
            pill
            className="absolute left-3 top-3 bg-white/50 backdrop-blur-sm"
          >
            Featured
          </Badge>
        </div>
        <div className="px-1.5">
          <div className="text-base font-medium truncate">{album.title}</div>
          <div className="mt-0.5 text-sm font-normal text-black/60">
            {album.photos.length} photos
          </div>
        </div>
      </div>
    </Button>
  );
}

export default AlbumCard;
