import { Button } from "../../../components/ui";
import { IconStar } from "../../../icons";

export type Place = {
  id: string;
  name: string;
  description?: string;
  rating?: number;
  price?: string;
  thumbnail: string;
};

export function PlaceCard({ place }: { place: Place }) {
  if (!place) return null;

  return (
    <div className="min-w-[220px] select-none max-w-[220px] w-[65vw] sm:w-[220px] self-stretch flex flex-col">
      <div className="w-full">
        <img
          src={place.thumbnail}
          alt={place.name}
          className="w-full aspect-square rounded-16 object-cover border border-border-subtle shadow-foundation-card"
          loading="lazy"
        />
      </div>
      <div className="mt-3 flex flex-col flex-1">
        <div className="text-list-title text-foreground truncate line-clamp-1">{place.name}</div>
        <div className="text-xs mt-1 text-text-secondary flex items-center gap-1">
          <IconStar className="h-3 w-3" aria-hidden="true" />
          {place.rating?.toFixed ? place.rating.toFixed(1) : place.rating}
          {place.price ? <span>· {place.price}</span> : null}
          <span>· San Francisco</span>
        </div>
        {place.description ? (
          <div className="text-sm mt-2 text-text-secondary flex-auto">{place.description}</div>
        ) : null}
        <div className="mt-5">
          <Button size="sm">Learn more</Button>
        </div>
      </div>
    </div>
  );
}
