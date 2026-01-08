import { Button } from "../../components/ui";
import { IconPlusCircle, IconStar } from "../../icons";

import { markers } from "./data/markers";
import type { Place } from "./components/PlaceCard";

export function AppsSdkInlineExample() {
  const places: Array<Place & { city?: string }> = markers.places.map((place) => ({ ...place }));

  return (
    <div className="antialiased w-full text-foreground px-4 pb-2 border border-border-strong rounded-24 overflow-hidden bg-card shadow-foundation-card">
      <div className="max-w-full">
        <div className="flex flex-row items-center gap-4 border-b border-border-subtle py-4">
          <div
            className="sm:w-18 w-16 aspect-square rounded-12 bg-cover bg-center border border-border-subtle"
            style={{
              backgroundImage: "url(https://persistent.oaistatic.com/pizzaz/title.png)",
            }}
          />
          <div>
            <div className="text-card-title">National Best Pizza List</div>
            <div className="text-list-subtitle text-text-secondary">
              A ranking of the best pizzerias in the world
            </div>
          </div>
          <div className="flex-auto hidden sm:flex justify-end pr-2">
            <Button size="sm">Save List</Button>
          </div>
        </div>
        <div className="min-w-full text-sm flex flex-col">
          {places.slice(0, 7).map((place, i) => (
            <div key={place.id} className="px-3 -mx-2 rounded-24 hover:bg-secondary/40">
              <div
                style={{
                  borderBottom: i === 7 - 1 ? "none" : "1px solid var(--foundation-border-light)",
                }}
                className="flex w-full items-center gap-2"
              >
                <div className="py-3 pr-3 min-w-0 w-full sm:w-3/5">
                  <div className="flex items-center gap-3">
                    <img
                      src={place.thumbnail}
                      alt={place.name}
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-10 object-cover border border-border-subtle"
                      loading="lazy"
                    />
                    <div className="w-3 text-end sm:block hidden text-sm text-text-secondary/70">
                      {i + 1}
                    </div>
                    <div className="min-w-0 sm:pl-1 flex flex-col items-start h-full">
                      <div className="text-list-title truncate max-w-[40ch]">{place.name}</div>
                      <div className="mt-1 flex items-center gap-3 text-text-secondary text-sm">
                        <div className="flex items-center gap-1">
                          <IconStar className="h-3 w-3 text-foreground" />
                          <span>
                            {place.rating?.toFixed ? place.rating.toFixed(1) : place.rating}
                          </span>
                        </div>
                        <div className="whitespace-nowrap sm:hidden">{place.city || "–"}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block text-end py-2 px-3 text-sm text-text-secondary whitespace-nowrap flex-auto">
                  {place.city || "–"}
                </div>
                <div className="py-2 whitespace-nowrap flex justify-end">
                  <Button
                    aria-label={`Add ${place.name}`}
                    variant="ghost"
                    size="sm"
                    className="h-[var(--foundation-size-control-height)] w-[var(--foundation-size-control-height)] p-0"
                  >
                    <IconPlusCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {places.length === 0 && (
            <div className="py-6 text-center text-text-secondary">No pizzerias found.</div>
          )}
        </div>
        <div className="sm:hidden px-0 pt-2 pb-2">
          <Button className="w-full">Save List</Button>
        </div>
      </div>
    </div>
  );
}

export function AppsSdkInlineExampleAlt() {
  const places: Array<Place & { city?: string }> = markers.places
    .slice(0, 4)
    .map((place) => ({ ...place }));

  return (
    <div className="antialiased w-full text-foreground px-4 pb-4 border border-border-subtle rounded-16 bg-card">
      <div className="flex items-center justify-between border-b border-border-subtle py-3">
        <div>
          <div className="text-card-title">Local favorites</div>
          <div className="text-list-subtitle text-text-secondary">Shortlist for tonight.</div>
        </div>
        <Button size="sm" variant="outline">
          View all
        </Button>
      </div>
      <div className="divide-y divide-border-subtle">
        {places.map((place, index) => (
          <div key={place.id} className="py-3 flex items-center gap-3">
            <div className="text-sm text-text-secondary w-4 text-right">{index + 1}</div>
            <img
              src={place.thumbnail}
              alt={place.name}
              className="h-10 w-10 rounded-10 object-cover border border-border-subtle"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <div className="text-list-title truncate">{place.name}</div>
              <div className="text-list-subtitle text-text-secondary truncate">{place.city}</div>
            </div>
            <Button size="sm">Save</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
