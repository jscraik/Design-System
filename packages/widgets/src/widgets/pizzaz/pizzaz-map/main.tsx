/**
 * Pizzaz Map Widget
 *
 * Interactive map widget using Mapbox GL JS.
 * Requires VITE_MAPBOX_TOKEN environment variable.
 *
 * Dependencies: mapbox-gl, embla-carousel-react, framer-motion
 */
import { motion } from "framer-motion";
import { Star, X } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";


import "../../../styles.css";
import markersData from "./markers.json";

// Set your Mapbox token here or via environment variable
mapboxgl.accessToken =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  "pk.eyJ1IjoiZXJpY25pbmciLCJhIjoiY21icXlubWM1MDRiczJvb2xwM2p0amNyayJ9.n-3O6JI5nOp_Lw96ZO5vJQ";

interface Place {
  id: string;
  name: string;
  coords: [number, number];
  description: string;
  city: string;
  rating: number;
  price: string;
  thumbnail: string;
}

const places: Place[] = markersData.places as Place[];

// Inspector component - shows place details
function Inspector({ place, onClose }: { place: Place; onClose: () => void }) {
  return (
    <motion.div
      key={place.id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: "spring", bounce: 0, duration: 0.25 }}
      className="pizzaz-inspector absolute z-30 top-0 bottom-4 left-0 right-auto xl:left-auto xl:right-6 md:z-20 w-[340px] xl:w-[360px] xl:top-6 xl:bottom-8 pointer-events-auto"
    >
      <button
        aria-label="Close details"
        className="inline-flex absolute z-10 top-4 left-4 shadow-xl rounded-full p-2 bg-white ring ring-black/10 hover:bg-gray-50"
        onClick={onClose}
        type="button"
      >
        <X className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
      <div className="relative h-full overflow-y-auto rounded-none xl:rounded-3xl bg-white text-black xl:shadow-xl xl:ring ring-black/10">
        <div className="relative mt-2 xl:mt-0 px-2 xl:px-0">
          <img
            src={place.thumbnail}
            alt={place.name}
            className="w-full rounded-3xl xl:rounded-none h-80 object-cover xl:rounded-t-2xl"
          />
        </div>
        <div className="h-[calc(100%-11rem)] sm:h-[calc(100%-14rem)]">
          <div className="p-4 sm:p-5">
            <div className="text-2xl font-medium truncate">{place.name}</div>
            <div className="text-sm mt-1 opacity-70 flex items-center gap-1">
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
              {place.rating.toFixed(1)}
              {place.price ? <span>· {place.price}</span> : null}
              <span>· {place.city}</span>
            </div>
            <div className="mt-3 flex flex-row items-center gap-3 font-medium">
              <button className="px-4 py-2 bg-[#F46C21] text-white rounded-lg text-sm hover:bg-[#e05f1a]">
                Add to favorites
              </button>
              <button className="px-4 py-2 border border-[#F46C21]/50 text-[#F46C21] rounded-lg text-sm hover:bg-[#F46C21]/5">
                Contact
              </button>
            </div>
            <div className="text-sm mt-5">{place.description}</div>
          </div>
          <div className="px-4 sm:px-5 pb-4">
            <div className="text-lg font-medium mb-2">Reviews</div>
            <ul className="space-y-3 divide-y divide-black/5">
              {[
                { user: "Leo M.", text: "Fantastic crust and balanced toppings!" },
                { user: "Priya S.", text: "Cozy vibe and friendly staff." },
                { user: "Maya R.", text: "Great for sharing. Will come back!" },
              ].map((review, idx) => (
                <li key={idx} className="py-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                      {review.user[0]}
                    </div>
                    <div className="min-w-0 gap-1 flex flex-col">
                      <div className="text-xs font-medium text-black/70">{review.user}</div>
                      <div className="text-sm">{review.text}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


// Sidebar list item
function PlaceListItem({
  place,
  isSelected,
  onClick,
}: {
  place: Place;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div className={`rounded-2xl px-3 select-none hover:bg-black/5 cursor-pointer ${isSelected ? "bg-black/5" : ""}`}>
      <div className={`border-b ${isSelected ? "border-black/0" : "border-black/5"} hover:border-black/0`}>
        <button
          type="button"
          className="w-full text-left py-3 transition flex gap-3 items-center cursor-pointer"
          onClick={onClick}
        >
          <img src={place.thumbnail} alt={place.name} className="h-16 w-16 rounded-lg object-cover flex-none" />
          <div className="min-w-0 text-left">
            <div className="font-medium truncate">{place.name}</div>
            <div className="text-xs text-black/50 truncate">{place.description}</div>
            <div className="text-xs mt-1 text-black/50 flex items-center gap-1">
              <Star className="h-3 w-3" aria-hidden="true" />
              {place.rating.toFixed(1)}
              {place.price ? <span>· {place.price}</span> : null}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// Sidebar component
function Sidebar({
  places: placesList,
  selectedId,
  onSelect,
  displayMode,
}: {
  places: Place[];
  selectedId: string | null;
  onSelect: (place: Place) => void;
  displayMode: string;
}) {
  const [emblaRef] = useEmblaCarousel({ dragFree: true, loop: false });
  const forceMobile = displayMode !== "fullscreen";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const updateBottomFadeVisibility = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
    setShowBottomFade(!atBottom);
  }, []);

  useEffect(() => {
    updateBottomFadeVisibility();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateBottomFadeVisibility, { passive: true });
    window.addEventListener("resize", updateBottomFadeVisibility);
    return () => {
      el.removeEventListener("scroll", updateBottomFadeVisibility);
      window.removeEventListener("resize", updateBottomFadeVisibility);
    };
  }, [placesList, updateBottomFadeVisibility]);

  return (
    <>
      {/* Desktop sidebar */}
      <div className={`${forceMobile ? "hidden" : ""} absolute inset-y-0 bottom-4 left-0 z-20 w-[340px] max-w-[75%] pointer-events-auto`}>
        <div ref={scrollRef} className="relative px-2 h-full overflow-y-auto bg-white text-black">
          <div className="flex justify-between flex-row items-center px-3 sticky bg-white top-0 py-4 text-md font-medium">
            {placesList.length} results
            <button aria-label="Filter" className="p-2 hover:bg-black/5 rounded-lg" type="button">
              <Settings2 className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div>
            {placesList.map((place) => (
              <PlaceListItem
                key={place.id}
                place={place}
                isSelected={displayMode === "fullscreen" && selectedId === place.id}
                onClick={() => onSelect(place)}
              />
            ))}
          </div>
        </div>
        <AnimatePresence>
          {showBottomFade && (
            <motion.div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-9 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-full h-full bg-gradient-to-t from-black/15 to-black/0" aria-hidden />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile carousel */}
      <div className={`${forceMobile ? "" : "hidden"} absolute inset-x-0 bottom-0 z-20 pointer-events-auto`}>
        <div className="pt-2 text-black">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="px-3 py-3 flex gap-3">
              {placesList.map((place) => (
                <div key={place.id} className="ring ring-black/10 max-w-[330px] w-full shadow-xl rounded-2xl bg-white">
                  <PlaceListItem
                    place={place}
                    isSelected={displayMode === "fullscreen" && selectedId === place.id}
                    onClick={() => onSelect(place)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


// Main Map Widget
function PizzazMapWidget() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObj = useRef<mapboxgl.Map | null>(null);
  const markerObjs = useRef<mapboxgl.Marker[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewState, setViewState] = useState(() => ({
    center: places.length > 0 ? places[0].coords : ([0, 0] as [number, number]),
    zoom: places.length > 0 ? 12 : 2,
  }));

  const displayMode = useOpenAiGlobal("displayMode") || "inline";
  const allowInspector = displayMode === "fullscreen";
  const maxHeight = useMaxHeight() ?? 480;

  const selectedPlace = useMemo(() => places.find((p) => p.id === selectedId) || null, [selectedId]);
  const markerCoords = useMemo(() => places.map((p) => p.coords), []);

  // Fit map to markers
  const fitMapToMarkers = useCallback((map: mapboxgl.Map, coords: [number, number][]) => {
    if (!map || !coords.length) return;
    if (coords.length === 1) {
      map.flyTo({ center: coords[0], zoom: 12 });
      return;
    }
    const bounds = coords.reduce(
      (b, c) => b.extend(c),
      new mapboxgl.LngLatBounds(coords[0], coords[0])
    );
    map.fitBounds(bounds, { padding: 60, animate: true });
  }, []);

  // Pan to location
  const panTo = useCallback(
    (coord: [number, number], offsetForInspector = false) => {
      if (!mapObj.current) return;
      const inspectorOffset = offsetForInspector && displayMode === "fullscreen" ? -180 : 0;
      mapObj.current.flyTo({
        center: coord,
        zoom: 14,
        speed: 1.2,
        curve: 1.6,
        offset: inspectorOffset ? [inspectorOffset, 0] : undefined,
      });
    },
    [displayMode]
  );

  // Add markers to map
  const addAllMarkers = useCallback(
    (placesList: Place[]) => {
      if (!mapObj.current) return;
      markerObjs.current.forEach((m) => m.remove());
      markerObjs.current = [];

      placesList.forEach((place) => {
        const marker = new mapboxgl.Marker({ color: "#F46C21" })
          .setLngLat(place.coords)
          .addTo(mapObj.current!);

        const el = marker.getElement();
        if (el) {
          el.style.cursor = "pointer";
          el.addEventListener("click", () => {
            setSelectedId(place.id);
            panTo(place.coords, true);
          });
        }
        markerObjs.current.push(marker);
      });
    },
    [panTo]
  );

  // Initialize map
  useEffect(() => {
    if (mapObj.current || !mapRef.current) return;

    mapObj.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: markerCoords.length > 0 ? markerCoords[0] : [0, 0],
      zoom: markerCoords.length > 0 ? 12 : 2,
      attributionControl: false,
    });

    addAllMarkers(places);
    setTimeout(() => fitMapToMarkers(mapObj.current!, markerCoords), 0);
    requestAnimationFrame(() => mapObj.current?.resize());

    const handleResize = () => mapObj.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mapObj.current?.remove();
      mapObj.current = null;
    };
  }, [addAllMarkers, fitMapToMarkers, markerCoords]);

  // Track view state
  useEffect(() => {
    if (!mapObj.current) return;
    const handler = () => {
      const c = mapObj.current!.getCenter();
      setViewState({ center: [c.lng, c.lat], zoom: mapObj.current!.getZoom() });
    };
    mapObj.current.on("moveend", handler);
    return () => {
      mapObj.current?.off("moveend", handler);
    };
  }, []);

  // Pan when selection changes
  useEffect(() => {
    if (!mapObj.current || !selectedPlace) return;
    panTo(selectedPlace.coords, true);
  }, [selectedId, selectedPlace, panTo]);

  // Resize on display mode change
  useEffect(() => {
    mapObj.current?.resize();
  }, [maxHeight, displayMode]);

  // Sync state with OpenAI widget
  useEffect(() => {
    if (typeof window !== "undefined" && window.oai?.widget?.setState) {
      window.oai.widget.setState({
        center: viewState.center,
        zoom: viewState.zoom,
        markers: markerCoords,
      });
    }
  }, [viewState, markerCoords]);

  const handleSelect = useCallback(
    (place: Place) => {
      setSelectedId(place.id);
      panTo(place.coords, true);
    },
    [panTo]
  );

  const requestFullscreen = useCallback(() => {
    setSelectedId(null);
    if (window.webplus?.requestDisplayMode) {
      window.webplus.requestDisplayMode({ mode: "fullscreen" });
    }
  }, []);

  return (
    <div
      style={{
        maxHeight,
        height: displayMode === "fullscreen" ? maxHeight - 40 : 480,
      }}
      className={`relative antialiased w-full min-h-[480px] overflow-hidden ${
        displayMode === "fullscreen"
          ? "rounded-none border-0"
          : "border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl"
      }`}
    >
      {/* Fullscreen button */}
      {displayMode !== "fullscreen" && (
        <button
          aria-label="Enter fullscreen"
          className="absolute top-4 right-4 z-30 shadow-lg pointer-events-auto bg-white text-black p-2 rounded-lg hover:bg-gray-50"
          onClick={requestFullscreen}
          type="button"
        >
          <Maximize2 strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      {/* Sidebar */}
      <Sidebar places={places} selectedId={selectedId} onSelect={handleSelect} displayMode={displayMode} />

      {/* Inspector */}
      <AnimatePresence>
        {allowInspector && selectedPlace && (
          <Inspector key={selectedPlace.id} place={selectedPlace} onClose={() => setSelectedId(null)} />
        )}
      </AnimatePresence>

      {/* Map container */}
      <div
        className={`absolute inset-0 overflow-hidden ${
          displayMode === "fullscreen" ? "left-[340px] right-2 top-2 bottom-4 border border-black/10 rounded-3xl" : ""
        }`}
      >
        <div
          ref={mapRef}
          className="w-full h-full absolute bottom-0 left-0 right-0"
          style={{ maxHeight, height: displayMode === "fullscreen" ? maxHeight : undefined }}
        />
      </div>

      {/* Suggestion chips (fullscreen only) */}
      {displayMode === "fullscreen" && (
        <div className="hidden antialiased md:flex absolute inset-x-0 bottom-2 z-30 justify-center pointer-events-none">
          <div className="flex gap-3 pointer-events-auto">
            {["Open now", "Top rated", "Vegetarian friendly"].map((label) => (
              <button
                key={label}
                className="px-4 py-2 bg-white/90 text-black text-sm rounded-full shadow-lg hover:bg-white"
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Type declarations for window globals
declare global {
  interface Window {
    oai?: {
      widget?: {
        setState?: (state: unknown) => void;
      };
    };
    webplus?: {
      requestDisplayMode?: (options: { mode: string }) => void;
    };
  }
}

function App() {
  return (
    <WidgetErrorBoundary>
      <PizzazMapWidget />
    </WidgetErrorBoundary>
  );
}

mountWidget(<App />);
