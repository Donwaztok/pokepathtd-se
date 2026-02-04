"use client";

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

import { pokemonSpriteUrl } from "@/lib/sprites";

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

interface TeamSectionProps {
  data: SaveData;
  onChange: (next: SaveData) => void;
}

export function TeamSection({ data, onChange }: TeamSectionProps) {
  const team = data.team ?? [];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newPokemon, setNewPokemon] = useState<Pokemon>({ ...DEFAULT_POKEMON });

  const setTeam = (next: Pokemon[]) => {
    onChange({ ...data, team: next });
  };

  const updatePokemon = (index: number, patch: Partial<Pokemon>) => {
    const next = [...team];

    next[index] = { ...next[index], ...patch };
    setTeam(next);
  };

  const removePokemon = (index: number) => {
    setTeam(team.filter((_, i) => i !== index));
  };

  const openModal = useCallback(() => {
    setNewPokemon({ ...DEFAULT_POKEMON });
    onOpen();
  }, [onOpen]);

  const addPokemon = () => {
    setTeam([...team, { ...newPokemon }]);
    onClose();
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
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold">Team ({team.length})</h3>
          <Button color="primary" size="sm" onPress={openModal}>
            Add Pokémon
          </Button>
        </CardHeader>
        <CardBody className="gap-4">
          {team.length === 0 ? (
            <p className="text-default-500 text-sm">
              No Pokémon on team. Add one to get started.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {team.map((p, i) => (
                <PokemonCard
                  key={i}
                  index={i}
                  pokemon={p}
                  sourceLabel="Team"
                  onRemove={removePokemon}
                  onUpdate={updatePokemon}
                />
              ))}
            </div>
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
          <ModalHeader>New Pokémon on team</ModalHeader>
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
