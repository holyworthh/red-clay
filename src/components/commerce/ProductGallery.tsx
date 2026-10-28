"use client";

import { type ReactNode, useState } from "react";

export type GalleryView = { label: string; main: ReactNode; thumb: ReactNode };

export function ProductGallery({ views, name }: Readonly<{ views: GalleryView[]; name: string }>) {
  const [active, setActive] = useState(0);
  return (
    <div className="gallery">
      <div className="gallery-main" aria-live="polite">
        {views.map((view, index) => <div key={view.label} className="gallery-frame" hidden={index !== active}>{view.main}</div>)}
      </div>
      {views.length > 1 && (
        <div className="gallery-thumbs" role="group" aria-label={`${name} images`}>
          {views.map((view, index) => (
            <button key={view.label} type="button" className="gallery-thumb" aria-pressed={index === active} aria-label={view.label} onClick={() => setActive(index)}>
              <span className="gallery-thumb-media">{view.thumb}</span>
              <span className="gallery-thumb-label"><span className="mono">0{index + 1}</span>{view.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
