"use client";
import { useState } from "react";
import Image from "next/image";

interface GalleryProps {
  images: string[];
  alt: string;
}

export function Gallery({ images, alt }: GalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-sand" style={{ aspectRatio: "4/5" }}>
        <Image
          key={images[activeIdx]}
          src={images[activeIdx]}
          alt={`${alt} — صورة ${activeIdx + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={activeIdx === 0}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActiveIdx(i)}
            className={`relative rounded-xl overflow-hidden border-2 transition-all shrink-0 w-16 h-20 ${
              i === activeIdx ? "border-brand" : "border-transparent"
            }`}
            aria-label={`صورة ${i + 1}`}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="64px" />
          </button>
        ))}
      </div>
    </div>
  );
}
