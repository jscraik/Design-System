import { AppsSDKButton, AppsSDKImage } from "@design-studio/ui";
import { Star } from "lucide-react";

type Place = {
  id: string;
  name: string;
  thumbnail: string;
  rating?: number;
  price?: string;
  description?: string;
};

type PlaceCardProps = {
  place: Place;
};

/**
 * Render a single place card within the carousel.
 * @param props - Card props.
 * @returns The place card element.
 */
export default function PlaceCard({ place }: PlaceCardProps) {
  if (!place) return null;
  return (
    <div className="min-w-[220px] select-none max-w-[220px] w-[65vw] sm:w-[220px] self-stretch flex flex-col text-foreground dark:text-foreground">
      <div className="w-full">
        <AppsSDKImage
          src={place.thumbnail}
          alt={place.name}
          className="w-full aspect-square rounded-2xl object-cover ring-1 ring-accent-blue/40 dark:ring-accent-blue/60 shadow-[0px_2px_6px_rgba(0,0,0,0.2)]"
        />
      </div>
      <div className="mt-3 flex flex-col flex-1">
        <div className="text-base font-medium truncate line-clamp-1 text-foreground dark:text-foreground">
          {place.name}
        </div>
        <div className="text-xs mt-1 text-text-secondary dark:text-text-secondary flex items-center gap-1">
          <Star className="h-3 w-3" aria-hidden="true" />
          {place.rating?.toFixed ? place.rating.toFixed(1) : place.rating}
          {place.price ? <span>- {place.price}</span> : null}
          <span>- San Francisco</span>
        </div>
        {place.description ? (
          <div className="text-sm mt-2 text-text-secondary dark:text-text-secondary flex-auto">
            {place.description}
          </div>
        ) : null}
        <div className="mt-5">
          <AppsSDKButton color="primary" size="sm" variant="solid">
            Learn more
          </AppsSDKButton>
        </div>
      </div>
    </div>
  );
}
