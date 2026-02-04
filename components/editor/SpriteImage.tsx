"use client";

import { useState } from "react";

import { resolveSpriteUrl } from "@/lib/sprites";

interface SpriteImageProps {
  /** Caminho do JSON (ex: "./src/assets/images/items/amulet-coin.png") ou URL. */
  src: string | undefined | null;
  alt: string;
  size?: number;
  className?: string;
}

export function SpriteImage({
  src,
  alt,
  size = 48,
  className = "",
}: SpriteImageProps) {
  const [failed, setFailed] = useState(false);
  const url = src?.startsWith("http") ? src : resolveSpriteUrl(src ?? "");

  if (!url || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-default-200 text-default-400 ${className}`}
        style={{ width: size, height: size }}
      >
        ?
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className={`object-contain rounded-lg bg-default-100 ${className}`}
      height={size}
      src={url}
      style={{ width: size, height: size }}
      width={size}
      onError={() => setFailed(true)}
    />
  );
}
