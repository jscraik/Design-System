import * as React from "react";

import { Button } from "../../components/ui";

import { albums as albumsData } from "./data/albums";
import type { Album } from "./components/AlbumCard";
import { AlbumCard } from "./components/AlbumCard";
import { FilmStrip } from "./components/FilmStrip";
import { useMaxHeight } from "./use-max-height";

const normalizeAlbums = (items: typeof albumsData.albums): Album[] =>
  items.map((album) => ({
    ...album,
    photos: album.photos.map((photo) => ({ ...photo })),
  })) as Album[];

function FullscreenViewer({ album }: { album: Album }) {
  const maxHeight = useMaxHeight() ?? 560;
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    setIndex(0);
  }, [album?.id]);

  const photo = album?.photos?.[index];

  return (
    <div
      className="relative w-full h-full bg-card rounded-24 border border-border-strong shadow-foundation-card"
      style={{ maxHeight, height: maxHeight }}
    >
      <div className="absolute inset-0 flex flex-row overflow-hidden">
        <div className="hidden md:block absolute pointer-events-none z-10 left-0 top-0 bottom-0 w-40">
          <FilmStrip album={album} selectedIndex={index} onSelect={setIndex} />
        </div>
        <div className="flex-1 min-w-0 px-10 md:px-40 py-10 relative flex items-center justify-center">
          <div className="relative w-full h-full">
            {photo ? (
              <img
                src={photo.url}
                alt={photo.title || album.title}
                className="absolute inset-0 m-auto rounded-24 border border-border-subtle max-w-full max-h-full object-contain"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function AlbumsCarousel({ onSelect }: { onSelect: (album: Album) => void }) {
  const albums = normalizeAlbums(albumsData.albums);

  return (
    <div className="antialiased relative w-full text-foreground py-5 select-none">
      <div className="overflow-hidden max-sm:mx-5">
        <div className="flex gap-5 items-stretch">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AppsSdkFullscreenExample() {
  const albumsList = normalizeAlbums(albumsData.albums);
  const [selectedAlbum, setSelectedAlbum] = React.useState<Album | null>(albumsList[0] ?? null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  return (
    <div className="relative antialiased w-full">
      {!isFullscreen && (
        <AlbumsCarousel
          onSelect={(album) => {
            setSelectedAlbum(album);
            setIsFullscreen(true);
          }}
        />
      )}

      {isFullscreen && selectedAlbum && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-text-secondary underline"
              onClick={() => setIsFullscreen(false)}
            >
              Back to carousel
            </button>
          </div>
          <FullscreenViewer album={selectedAlbum} />
        </div>
      )}
    </div>
  );
}

export function AppsSdkFullscreenExampleAlt() {
  const albumsList = normalizeAlbums(albumsData.albums);
  const [selectedAlbum, setSelectedAlbum] = React.useState<Album | null>(albumsList[1] ?? null);

  return (
    <div className="relative antialiased w-full space-y-4">
      <div className="text-card-title">Fullscreen viewer (always open)</div>
      {selectedAlbum && <FullscreenViewer album={selectedAlbum} />}
      <div className="flex gap-2">
        {albumsList.slice(0, 3).map((album) => (
          <Button key={album.id} size="sm" variant="secondary" onClick={() => setSelectedAlbum(album)}>
            {album.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
