import { AppsSDKBadge, AppsSDKButton, AppsSDKImage } from "@design-studio/ui";

import type { Album } from "../../../shared/data-types";

type AlbumCardProps = {
  album: Album;
  onSelect?: (album: Album) => void;
};

/**
 * Render a selectable album card.
 * @param props - Album card props.
 * @returns The album card element.
 */
function AlbumCard({ album, onSelect }: AlbumCardProps) {
  return (
    <AppsSDKButton
      type="button"
      variant="ghost"
      color="secondary"
      pill={false}
      className="group relative flex-shrink-0 w-[272px] bg-secondary dark:bg-secondary text-left p-0 h-auto min-h-0 rounded-none shadow-none gap-0 before:hidden text-foreground dark:text-foreground"
      onClick={() => onSelect?.(album)}
    >
      <div className="flex w-full flex-col gap-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg">
          <AppsSDKImage
            src={album.cover}
            alt={album.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <AppsSDKBadge
            variant="soft"
            color="secondary"
            size="sm"
            pill
            className="absolute left-3 top-3 bg-background/90 dark:bg-background/90 text-foreground dark:text-foreground backdrop-blur-sm"
          >
            Featured
          </AppsSDKBadge>
        </div>
        <div className="px-1.5">
          <div className="text-base font-medium truncate text-foreground dark:text-foreground">
            {album.title}
          </div>
          <div className="mt-0.5 text-sm font-normal text-text-secondary dark:text-text-secondary">
            {album.photos.length} photos
          </div>
        </div>
      </div>
    </AppsSDKButton>
  );
}

export default AlbumCard;
