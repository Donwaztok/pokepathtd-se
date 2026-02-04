"use client";

import type { Pokemon } from "@/types/save";

import { pokemonSpriteUrl } from "@/lib/sprites";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'/%3E";

interface PokemonSpriteProps {
  /** Pokémon ou { specieKey, isShiny?, hideShiny? } */
  pokemon: Pick<Pokemon, "specieKey" | "isShiny" | "hideShiny">;
  width?: number;
  height?: number;
  className?: string;
}

function handleSpriteError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.target as HTMLImageElement;

  img.src = PLACEHOLDER_SVG;
}

export function PokemonSprite({
  pokemon,
  width = 48,
  height = 48,
  className = "",
}: PokemonSpriteProps) {
  const specieKey = pokemon.specieKey ?? "";
  const isShiny = !!pokemon.isShiny;
  const hideShiny = !!pokemon.hideShiny;
  const src = pokemonSpriteUrl(specieKey, isShiny, hideShiny);

  return (
    <img
      alt={specieKey}
      className={className}
      height={height}
      src={src}
      width={width}
      onError={handleSpriteError}
    />
  );
}
