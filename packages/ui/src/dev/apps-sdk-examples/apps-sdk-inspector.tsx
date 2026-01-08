import * as React from "react";

import { Button } from "../../components/ui";
import { IconStar, IconX } from "../../icons";

import { markers } from "./data/markers";
import type { Place } from "./components/PlaceCard";

function InspectorCard({ place, onClose }: { place: Place; onClose: (() => void) | null }) {
  return (
    <div className="absolute z-30 top-0 bottom-4 left-0 right-auto xl:left-auto xl:right-6 md:z-20 w-[340px] xl:w-[360px] pointer-events-auto">
      <Button
        aria-label="Close details"
        className="inline-flex absolute z-10 top-4 left-4 shadow-foundation-close bg-card"
        variant="secondary"
        size="icon"
        onClick={onClose ?? undefined}
      >
        <IconX className="h-[18px] w-[18px]" aria-hidden="true" />
      </Button>
      <div className="relative h-full overflow-y-auto rounded-none xl:rounded-24 bg-card text-foreground xl:shadow-foundation-card border border-border-strong">
        <div className="relative mt-2 xl:mt-0 px-2 xl:px-0">
          <img
            src={place.thumbnail}
            alt={place.name}
            className="w-full rounded-24 xl:rounded-none h-80 object-cover xl:rounded-t-24"
          />
        </div>

        <div className="h-[calc(100%-11rem)] sm:h-[calc(100%-14rem)]">
          <div className="p-4 sm:p-5">
            <div className="text-card-title truncate">{place.name}</div>
            <div className="text-sm mt-1 text-text-secondary flex items-center gap-1">
              <IconStar className="h-3.5 w-3.5" aria-hidden="true" />
              {place.rating?.toFixed ? place.rating.toFixed(1) : place.rating}
              {place.price ? <span>· {place.price}</span> : null}
              <span>· San Francisco</span>
            </div>
            <div className="mt-3 flex flex-row items-center gap-3">
              <Button size="sm">Add to favorites</Button>
              <Button variant="outline" size="sm">
                Contact
              </Button>
            </div>
            <div className="text-sm mt-5 text-text-secondary">
              {place.description} Enjoy a slice at one of SF's favorites. Fresh ingredients, great crust,
              and cozy vibes.
            </div>
          </div>

          <div className="px-4 sm:px-5 pb-4">
            <div className="text-list-title mb-2">Reviews</div>
            <ul className="space-y-3 divide-y divide-border-subtle">
              {[
                {
                  user: "Leo M.",
                  avatar: "https://persistent.oaistatic.com/pizzaz/user1.png",
                  text: "Fantastic crust and balanced toppings. The marinara is spot on!",
                },
                {
                  user: "Priya S.",
                  avatar: "https://persistent.oaistatic.com/pizzaz/user2.png",
                  text: "Cozy vibe and friendly staff. Quick service on a Friday night.",
                },
                {
                  user: "Maya R.",
                  avatar: "https://persistent.oaistatic.com/pizzaz/user3.png",
                  text: "Great for sharing. Will definitely come back with friends.",
                },
              ].map((review, idx) => (
                <li key={idx} className="py-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={review.avatar}
                      alt={`${review.user} avatar`}
                      className="h-8 w-8 border border-border-subtle rounded-full object-cover flex-none"
                      loading="lazy"
                    />
                    <div className="min-w-0 gap-1 flex flex-col">
                      <div className="text-xs font-medium text-text-secondary">{review.user}</div>
                      <div className="text-sm">{review.text}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppsSdkInspectorExample() {
  const places: Array<Place & { city?: string }> = markers.places.map((place) => ({ ...place }));
  const [isOpen, setIsOpen] = React.useState(true);
  const place = places[0];

  return (
    <div className="relative min-h-[520px] bg-muted rounded-24 border border-border-strong overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted to-secondary/40" />
      {place && isOpen && <InspectorCard place={place} onClose={() => setIsOpen(false)} />}
      {!isOpen && (
        <div className="relative z-10 p-6">
          <Button size="sm" onClick={() => setIsOpen(true)}>
            Reopen inspector
          </Button>
        </div>
      )}
    </div>
  );
}

export function AppsSdkInspectorExampleAlt() {
  const places: Array<Place & { city?: string }> = markers.places.map((place) => ({ ...place }));
  const place = places[1];

  return (
    <div className="relative min-h-[520px] bg-card rounded-24 border border-border-subtle overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted to-secondary/40" />
      {place && (
        <div className="relative z-10 p-6">
          <div className="text-card-title mb-3">Inspector preview (static)</div>
          <div className="relative min-h-[520px]">
            <InspectorCard place={place} onClose={null} />
          </div>
        </div>
      )}
    </div>
  );
}
