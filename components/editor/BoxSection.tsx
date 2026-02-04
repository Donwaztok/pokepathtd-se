"use client";

import { pokemonSpriteUrl } from "@/lib/sprites";
import type { Pokemon, SaveData } from "@/types/save";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Switch } from "@heroui/switch";
import { useCallback, useState } from "react";
import { PokemonCard } from "./PokemonCard";

const DEFAULT_POKEMON: Pokemon = {
  specieKey: "pikachu",
  lvl: 1,
  targetMode: "first",
  favorite: false,
  item: null,
  isShiny: false,
  hideShiny: false,
  isMega: false,
};

interface BoxSectionProps {
  data: SaveData;
  onChange: (next: SaveData) => void;
}

export function BoxSection({ data, onChange }: BoxSectionProps) {
  const box = data.box ?? [];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newPokemon, setNewPokemon] = useState<Pokemon>({ ...DEFAULT_POKEMON });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const setBox = (next: Pokemon[]) => {
    onChange({ ...data, box: next });
    if (selectedIndex !== null && selectedIndex >= next.length) {
      setSelectedIndex(next.length > 0 ? next.length - 1 : null);
    }
  };

  const updatePokemon = (index: number, patch: Partial<Pokemon>) => {
    const next = [...box];

    next[index] = { ...next[index], ...patch };
    setBox(next);
  };

  const removePokemon = (index: number) => {
    setBox(box.filter((_, i) => i !== index));
    if (selectedIndex === index) setSelectedIndex(null);
    else if (selectedIndex !== null && selectedIndex > index)
      setSelectedIndex(selectedIndex - 1);
  };

  const openModal = useCallback(() => {
    setNewPokemon({ ...DEFAULT_POKEMON });
    onOpen();
  }, [onOpen]);

  const addPokemon = () => {
    const newBox = [...box, { ...newPokemon }];

    setBox(newBox);
    setSelectedIndex(newBox.length - 1);
    onClose();
  };

  const setAllLevel100 = () => {
    const newBox = box.map((p) => ({ ...p, lvl: 100 }));

    setBox(newBox);
  };

  const updateNew = (patch: Partial<Pokemon>) => {
    setNewPokemon((prev) => ({ ...prev, ...patch }));
  };

  const specieKey = newPokemon.specieKey ?? "";
  const isShiny = !!newPokemon.isShiny;
  const hideShiny = !!newPokemon.hideShiny;
  const spriteUrl = pokemonSpriteUrl(specieKey, isShiny, hideShiny);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-semibold">Box ({box.length})</h3>
          <div className="flex gap-2">
            {box.length > 0 && (
              <Button size="sm" variant="bordered" onPress={setAllLevel100}>
                All Lv.100
              </Button>
            )}
            <Button color="primary" size="sm" onPress={openModal}>
              Add Pokémon
            </Button>
          </div>
        </CardHeader>
        <CardBody className="gap-4">
          {box.length === 0 ? (
            <p className="text-default-500 text-sm">
              No Pokémon in box. Add one to get started.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1 sm:gap-2 p-2 rounded-xl bg-default-100 border-2 border-default-200">
                {box.map((p, i) => {
                  const sk = p.specieKey ?? "";
                  const sh = !!p.isShiny;
                  const hs = !!p.hideShiny;
                  const url = pokemonSpriteUrl(sk, sh, hs);
                  const isSelected = selectedIndex === i;

                  return (
                    <button
                      key={i}
                      className={`
                        flex flex-col items-center justify-center rounded-lg p-1 sm:p-2 min-h-[64px] sm:min-h-[72px]
                        border-2 transition-all
                        ${isSelected
                          ? "border-primary bg-primary/20 ring-2 ring-primary/40"
                          : "border-transparent hover:border-default-300 hover:bg-default-200"
                        }
                      `}
                      type="button"
                      onClick={() => setSelectedIndex(i)}
                    >
                      <img
                        alt={sk}
                        className="object-contain pointer-events-none"
                        height={48}
                        src={url}
                        width={48}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'/%3E";
                        }}
                      />
                      <span className="text-[10px] sm:text-xs text-default-600 mt-0.5 truncate w-full text-center">
                        {sh && "✨ "}
                        Lv.{p.lvl ?? 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedIndex !== null && box[selectedIndex] && (
                <div className="mt-4 pt-4 border-t border-default-200">
                  <p className="text-sm text-default-500 mb-2">
                    Click a Pokémon in the grid to edit. Selected: #
                    {selectedIndex + 1}
                  </p>
                  <PokemonCard
                    index={selectedIndex}
                    pokemon={box[selectedIndex]}
                    sourceLabel="Box"
                    onRemove={removePokemon}
                    onUpdate={updatePokemon}
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="2xl"
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader>New Pokémon in box</ModalHeader>
          <ModalBody className="gap-4">
            <div className="flex flex-wrap items-start gap-4 p-3 rounded-lg bg-default-100">
              <div className="flex flex-col items-center gap-1">
                <img
                  alt={specieKey}
                  className="object-contain rounded-lg bg-default-200"
                  height={96}
                  src={spriteUrl}
                  width={96}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'/%3E";
                  }}
                />
                <span className="text-xs text-default-500">Preview</span>
              </div>
              <div className="flex-1 min-w-[200px] space-y-3">
                <div className="flex gap-2 items-end flex-wrap">
                  <Input
                    className="flex-1 min-w-0"
                    label="Species (specieKey)"
                    placeholder="ex: pikachu, charizard"
                    size="sm"
                    value={specieKey}
                    onValueChange={(v) =>
                      updateNew({ specieKey: v || "pikachu" })
                    }
                  />
                  <Input
                    className="w-20 shrink-0"
                    label="Level"
                    max={100}
                    min={1}
                    size="sm"
                    type="number"
                    value={String(newPokemon.lvl ?? 1)}
                    onValueChange={(v) =>
                      updateNew({
                        lvl: Math.max(1, Math.min(100, parseInt(v, 10) || 1)),
                      })
                    }
                  />
                </div>
                <div className="flex gap-4 items-center flex-wrap">
                  <Switch
                    isSelected={!!newPokemon.isShiny}
                    onValueChange={(v) => updateNew({ isShiny: v })}
                  >
                    Shiny
                  </Switch>
                  <Switch
                    isSelected={!!newPokemon.hideShiny}
                    onValueChange={(v) => updateNew({ hideShiny: v })}
                  >
                    Hide Shiny (same sprite)
                  </Switch>
                  <Switch
                    isSelected={!!newPokemon.favorite}
                    onValueChange={(v) => updateNew({ favorite: v })}
                  >
                    Favorite
                  </Switch>
                  <Switch
                    isSelected={!!newPokemon.isMega}
                    onValueChange={(v) => updateNew({ isMega: v })}
                  >
                    Mega
                  </Switch>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={addPokemon}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
