import { AppsSDKBadge, AppsSDKButton, AppsSDKImage } from "@astudio/ui";

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
      className="group relative flex-shrink-0 w-[272px] bg-foundation-bg-light-2 dark:bg-foundation-bg-dark-2 text-left p-0 h-auto min-h-0 rounded-none shadow-none gap-0 before:hidden text-foundation-text-light-primary dark:text-foundation-text-dark-primary"
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
            className="absolute left-3 top-3 bg-foundation-bg-light-1/90 dark:bg-foundation-bg-dark-1/90 text-foundation-text-light-primary dark:text-foundation-text-dark-primary backdrop-blur-sm"
          >
            Featured
          </AppsSDKBadge>
        </div>
        <div className="px-1.5">
          <div className="text-base font-medium truncate text-foundation-text-light-primary dark:text-foundation-text-dark-primary">
            {album.title}
          </div>
          <div className="mt-0.5 text-sm font-normal text-foundation-text-light-secondary dark:text-foundation-text-dark-secondary">
            {album.photos.length} photos
          </div>
        </div>
      </div>
    </AppsSDKButton>
  );
}

export default AlbumCard;
