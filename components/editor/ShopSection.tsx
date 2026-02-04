"use client";

import { pokemonSpriteUrl } from "@/lib/sprites";
import type { SaveData, ShopData, ShopItemStockEntry } from "@/types/save";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { useCallback, useState } from "react";
import { SpriteImage } from "./SpriteImage";

function itemDisplayName(item: ShopItemStockEntry): string {
  const names = item.name;
  if (Array.isArray(names) && names[0]) return String(names[0]);
  return item.id ?? "?";
}

function formatPrice(n: number): string {
  return "$" + n.toLocaleString();
}

interface ShopSectionProps {
  data: SaveData;
  onChange: (next: SaveData) => void;
}

const SHOP_BORDER = "#6B1A00";
const PRICE_TAG_BG = "#8B2500";
const PRICE_TAG_BORDER = "#4a4a4a";
const SHOP_BODY_BG = "rgba(40, 40, 40, 0.95)";

export function ShopSection({ data, onChange }: ShopSectionProps) {
  const shop: ShopData = data.shop ?? {};
  const eggPrice = (shop.eggPrice ?? 0) as number;
  const eggList = (shop.eggList ?? []) as string[];
  const itemList = (shop.itemList ?? []) as string[];
  const itemStock = (shop.itemStock ?? []) as (ShopItemStockEntry | null)[];
  const [newEggSpecies, setNewEggSpecies] = useState("");
  const [newItemId, setNewItemId] = useState("");
  const [editingPriceIndex, setEditingPriceIndex] = useState<number | null>(
    null,
  );

  const setShop = useCallback(
    (patch: Partial<ShopData>) => {
      onChange({ ...data, shop: { ...shop, ...patch } });
    },
    [data, shop, onChange],
  );

  const setEggPrice = (v: number) => setShop({ eggPrice: v });
  const setEggList = (next: string[]) => setShop({ eggList: next });
  const setItemList = (next: string[]) => setShop({ itemList: next });
  const setItemStock = (next: (ShopItemStockEntry | null)[]) =>
    setShop({ itemStock: next });

  const updateItemStockEntry = (
    index: number,
    patch: Partial<ShopItemStockEntry>,
  ) => {
    const entry = itemStock[index];

    if (entry && typeof entry === "object") {
      const next = [...itemStock];

      next[index] = { ...entry, ...patch };
      setItemStock(next);
    }
  };

  const removeFromEggList = (index: number) => {
    setEggList(eggList.filter((_, i) => i !== index));
  };
  const addToEggList = () => {
    if (newEggSpecies.trim()) {
      setEggList([...eggList, newEggSpecies.trim()]);
      setNewEggSpecies("");
    }
  };

  const removeFromItemList = (index: number) => {
    setItemList(itemList.filter((_, i) => i !== index));
  };
  const addToItemList = () => {
    if (newItemId.trim()) {
      setItemList([...itemList, newItemId.trim()]);
      setNewItemId("");
    }
  };

  const eggSpritePath = "./src/assets/images/icons/egg.png";

  /** Grid slots: first = Egg, then itemStock. 3 columns like the game. */
  const gridSlots: (
    | { type: "egg"; price: number }
    | { type: "item"; index: number; item: ShopItemStockEntry }
  )[] = [
      { type: "egg", price: eggPrice },
      ...itemStock
        .map((item, i) =>
          item && typeof item === "object"
            ? { type: "item" as const, index: i, item }
            : null,
        )
        .filter(
          (x): x is { type: "item"; index: number; item: ShopItemStockEntry } =>
            x !== null,
        ),
    ];

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl overflow-hidden shadow-xl border-2"
        style={{
          borderColor: SHOP_BORDER,
          background: SHOP_BODY_BG,
        }}
      >
        <div
          className="p-4 min-h-[200px]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 8px,
              rgba(0,0,0,0.08) 8px,
              rgba(0,0,0,0.08) 16px
            )`,
          }}
        >
          <div className="grid grid-cols-3 gap-4">
            {gridSlots.map((slot) => {
              if (slot.type === "egg") {
                return (
                  <div key="egg" className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-black/30">
                      <SpriteImage
                        alt="Egg"
                        className="bg-transparent"
                        size={56}
                        src={eggSpritePath}
                      />
                    </div>
                    {editingPriceIndex === -1 ? (
                      <div
                        className="min-w-[72px] px-3 py-1 rounded border flex items-center justify-center"
                        style={{
                          backgroundColor: PRICE_TAG_BG,
                          borderColor: PRICE_TAG_BORDER,
                        }}
                      >
                        <input
                          className="w-14 bg-transparent text-white text-center font-bold text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          type="number"
                          value={eggPrice}
                          onBlur={() => setEditingPriceIndex(null)}
                          onChange={(e) =>
                            setEggPrice(parseInt(e.target.value, 10) || 0)
                          }
                        />
                      </div>
                    ) : (
                      <button
                        className="min-w-[72px] px-3 py-1.5 rounded text-white font-bold text-sm border"
                        style={{
                          backgroundColor: PRICE_TAG_BG,
                          borderColor: PRICE_TAG_BORDER,
                        }}
                        type="button"
                        onClick={() => setEditingPriceIndex(-1)}
                      >
                        {formatPrice(eggPrice)}
                      </button>
                    )}
                  </div>
                );
              }
              const { index, item } = slot;
              const name = itemDisplayName(item);
              const price = typeof item.price === "number" ? item.price : 0;
              const isEditing = editingPriceIndex === index;

              return (
                <div
                  key={`${item.id ?? index}-${index}`}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-black/30">
                    <SpriteImage
                      alt={name}
                      className="bg-transparent"
                      size={56}
                      src={item.sprite}
                    />
                  </div>
                  {isEditing ? (
                    <div
                      className="min-w-[72px] px-3 py-1 rounded border flex items-center justify-center"
                      style={{
                        backgroundColor: PRICE_TAG_BG,
                        borderColor: PRICE_TAG_BORDER,
                      }}
                    >
                      <input
                        className="w-14 bg-transparent text-white text-center font-bold text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        type="number"
                        value={price}
                        onBlur={() => setEditingPriceIndex(null)}
                        onChange={(e) =>
                          updateItemStockEntry(index, {
                            price: parseInt(e.target.value, 10) || 0,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <button
                      className="min-w-[72px] px-3 py-1.5 rounded text-white font-bold text-sm border"
                      style={{
                        backgroundColor: PRICE_TAG_BG,
                        borderColor: PRICE_TAG_BORDER,
                      }}
                      type="button"
                      onClick={() => setEditingPriceIndex(index)}
                    >
                      {formatPrice(price)}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {gridSlots.length === 0 && (
            <p className="text-center text-default-400 text-sm py-6">
              No items. Decode a save with shop data or edit via JSON.
            </p>
          )}
        </div>
      </div>

      {/* Editor controls below the shop window */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Shop editor</h3>
        </CardHeader>
        <CardBody className="gap-6">
          <p className="text-default-500 text-sm">
            Click a price tag above to edit. Egg pool and item list below.
          </p>

          {/* Egg pool (eggList) */}
          <div>
            <p className="text-sm font-medium text-default-700 mb-2">
              Egg pool (eggList)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-2">
              {eggList.map((species, i) => (
                <div
                  key={`${species}-${i}`}
                  className="flex items-center gap-2 p-2 rounded-lg bg-default-100 border border-default-200 min-h-[48px] w-full"
                >
                  <img
                    alt={species}
                    className="object-contain rounded shrink-0"
                    height={32}
                    src={pokemonSpriteUrl(species, false, false)}
                    width={32}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span
                    className="text-sm truncate min-w-0 flex-1"
                    title={species}
                  >
                    {species}
                  </span>
                  <Button
                    isIconOnly
                    aria-label="Remove"
                    className="min-w-6 w-6 h-6 shrink-0"
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => removeFromEggList(i)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                className="max-w-[200px]"
                placeholder="Add species (e.g. pikachu)"
                size="sm"
                value={newEggSpecies}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addToEggList())
                }
                onValueChange={setNewEggSpecies}
              />
              <Button size="sm" variant="bordered" onPress={addToEggList}>
                Add species
              </Button>
            </div>
          </div>

          {/* Item list (itemList) */}
          <div>
            <p className="text-sm font-medium text-default-700 mb-2">
              Item list (itemList)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-2">
              {itemList.map((id, i) => {
                const entry = itemStock.find(
                  (e): e is ShopItemStockEntry =>
                    e != null && typeof e === "object" && e.id === id,
                );
                return (
                  <div
                    key={`${id}-${i}`}
                    className="flex items-center gap-2 p-2 rounded-lg bg-default-100 border border-default-200 min-h-[48px] w-full"
                  >
                    <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded bg-default-200">
                      {entry?.sprite ? (
                        <SpriteImage
                          alt={itemDisplayName(entry)}
                          size={32}
                          src={entry.sprite}
                        />
                      ) : (
                        <span className="text-xs text-default-400">?</span>
                      )}
                    </div>
                    <span
                      className="text-sm font-mono truncate min-w-0 flex-1"
                      title={id}
                    >
                      {id}
                    </span>
                    <Button
                      isIconOnly
                      aria-label="Remove"
                      className="min-w-6 w-6 h-6 shrink-0"
                      color="danger"
                      size="sm"
                      variant="light"
                      onPress={() => removeFromItemList(i)}
                    >
                      ×
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Input
                className="max-w-[220px]"
                placeholder="Add item ID (e.g. amuletCoin)"
                size="sm"
                value={newItemId}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addToItemList())
                }
                onValueChange={setNewItemId}
              />
              <Button size="sm" variant="bordered" onPress={addToItemList}>
                Add item ID
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
