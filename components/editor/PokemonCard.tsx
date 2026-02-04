"use client";

import type { GameItem, Pokemon } from "@/types/save";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";

import { SpriteImage } from "./SpriteImage";

import { pokemonSpriteUrl } from "@/lib/sprites";

function itemDisplayName(item: GameItem): string {
  const names = item.name;

  if (Array.isArray(names) && names[0]) return String(names[0]);

  return item.id ?? "?";
}

interface PokemonCardProps {
  pokemon: Pokemon;
  index: number;
  onUpdate: (index: number, patch: Partial<Pokemon>) => void;
  onRemove: (index: number) => void;
  /** "team" | "box" para label */
  sourceLabel: string;
}

export function PokemonCard({
  pokemon,
  index,
  onUpdate,
  onRemove,
  sourceLabel,
}: PokemonCardProps) {
  const specieKey = pokemon.specieKey ?? "";
  const isShiny = !!pokemon.isShiny;
  const hideShiny = !!pokemon.hideShiny;
  const spriteUrl = pokemonSpriteUrl(specieKey, isShiny, hideShiny);
  const name = specieKey.charAt(0).toUpperCase() + specieKey.slice(1);

  return (
    <Card className="overflow-visible">
      <CardBody className="gap-3">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex flex-col items-center gap-1">
            <img
              alt={name}
              className="object-contain rounded-lg bg-default-100"
              height={96}
              src={spriteUrl}
              width={96}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'/%3E";
              }}
            />
            <span className="text-xs text-default-500">
              {sourceLabel} #{index + 1}
            </span>
          </div>
          <div className="flex-1 min-w-[200px] space-y-2">
            <div className="flex gap-2 items-end flex-wrap">
              <Input
                className="flex-1 min-w-0"
                label="Species (specieKey)"
                size="sm"
                value={specieKey}
                onValueChange={(v) =>
                  onUpdate(index, { ...pokemon, specieKey: v || "pikachu" })
                }
              />
              <Input
                className="w-20 shrink-0"
                label="Level"
                max={100}
                min={1}
                size="sm"
                type="number"
                value={String(pokemon.lvl ?? 1)}
                onValueChange={(v) =>
                  onUpdate(index, {
                    ...pokemon,
                    lvl: Math.max(1, Math.min(100, parseInt(v, 10) || 1)),
                  })
                }
              />
            </div>
            <div className="flex gap-4 items-center flex-wrap">
              <Switch
                isSelected={!!pokemon.isShiny}
                onValueChange={(v) =>
                  onUpdate(index, { ...pokemon, isShiny: v })
                }
              >
                Shiny
              </Switch>
              <Switch
                isSelected={!!pokemon.hideShiny}
                onValueChange={(v) =>
                  onUpdate(index, { ...pokemon, hideShiny: v })
                }
              >
                Hide Shiny (same sprite)
              </Switch>
              <Switch
                isSelected={!!pokemon.favorite}
                onValueChange={(v) =>
                  onUpdate(index, { ...pokemon, favorite: v })
                }
              >
                Favorite
              </Switch>
              <Switch
                isSelected={!!pokemon.isMega}
                onValueChange={(v) =>
                  onUpdate(index, { ...pokemon, isMega: v })
                }
              >
                Mega
              </Switch>
            </div>
            {pokemon.item && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-default-100">
                <SpriteImage
                  alt={itemDisplayName(pokemon.item)}
                  size={32}
                  src={pokemon.item.sprite}
                />
                <span className="text-sm">{itemDisplayName(pokemon.item)}</span>
                <span className="text-xs text-default-500">
                  (id: {pokemon.item.id})
                </span>
              </div>
            )}
            {!pokemon.item && (
              <p className="text-xs text-default-500">No item equipped</p>
            )}
          </div>
          <Button
            color="danger"
            size="sm"
            variant="flat"
            onPress={() => onRemove(index)}
          >
            Remove
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
