"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

type ArrayItem = number | string;

/** Par [número, texto] — ex.: [gold, "R1-1 W29"] */
export type StatsPair = [number, string];

interface StatsArrayEditorProps {
  label: string;
  value: unknown;
  onChange: (next: ArrayItem[]) => void;
  /** "number" | "string" | "pair" — pair = array flat [gold, wave, gold, wave, ...] */
  itemType?: "number" | "string" | "pair";
  /** Só para pair: rótulos dos dois campos (ex. ["Gold", "Wave"]) */
  pairLabels?: [string, string];
}

function toArray(value: unknown): ArrayItem[] {
  if (!Array.isArray(value)) return [];

  return value.map((v) =>
    typeof v === "number" ? v : typeof v === "string" ? v : String(v ?? ""),
  );
}

function inferItemType(arr: ArrayItem[]): "number" | "string" {
  if (arr.length === 0) return "number";
  const first = arr[0];

  return typeof first === "number" ? "number" : "string";
}

/** Converte array flat [g1, w1, g2, w2, ...] em pares [[g1,w1], [g2,w2], ...] */
function flatToPairs(arr: ArrayItem[]): StatsPair[] {
  const pairs: StatsPair[] = [];

  for (let i = 0; i + 1 < arr.length; i += 2) {
    const a = arr[i];
    const b = arr[i + 1];
    const num = typeof a === "number" ? a : parseInt(String(a), 10) || 0;
    const str = typeof b === "string" ? b : String(b ?? "");

    pairs.push([num, str]);
  }

  return pairs;
}

function pairsToFlat(pairs: StatsPair[]): ArrayItem[] {
  const out: ArrayItem[] = [];

  for (const [g, w] of pairs) {
    out.push(g, w);
  }

  return out;
}

export function StatsArrayEditor({
  label,
  value,
  onChange,
  itemType: itemTypeProp,
  pairLabels = ["Gold", "Wave"],
}: StatsArrayEditorProps) {
  const arr = toArray(value);
  const isPair = itemTypeProp === "pair";
  const itemType = itemTypeProp ?? (isPair ? "pair" : inferItemType(arr));

  if (itemType === "pair") {
    const pairs = flatToPairs(arr);
    const setPairAt = (index: number, nextPair: StatsPair) => {
      const nextPairs = [...pairs];

      nextPairs[index] = nextPair;
      onChange(pairsToFlat(nextPairs));
    };
    const removePairAt = (index: number) => {
      const nextPairs = pairs.filter((_, i) => i !== index);

      onChange(pairsToFlat(nextPairs));
    };
    const appendPair = () => {
      onChange(pairsToFlat([...pairs, [0, ""]]));
    };

    return (
      <div className="col-span-full sm:col-span-2 lg:col-span-3 rounded-lg bg-default-100 p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium truncate" title={label}>
            {label}
          </span>
          <Button size="sm" variant="flat" onPress={appendPair}>
            + Add
          </Button>
        </div>
        <div className="space-y-2">
          {pairs.map(([gold, wave], i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <Input
                className="w-32"
                label={pairLabels[0]}
                labelPlacement="outside"
                size="sm"
                type="number"
                value={String(gold)}
                onValueChange={(v) => {
                  const n = parseInt(v, 10);

                  setPairAt(i, [Number.isNaN(n) ? 0 : n, wave]);
                }}
              />
              <Input
                className="min-w-[120px] flex-1"
                label={pairLabels[1]}
                labelPlacement="outside"
                size="sm"
                value={wave}
                onValueChange={(v) => setPairAt(i, [gold, v])}
              />
              <Button
                isIconOnly
                aria-label="Remove"
                className="self-end"
                color="danger"
                size="sm"
                variant="light"
                onPress={() => removePairAt(i)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const setAt = (index: number, newVal: ArrayItem) => {
    const next = [...arr];

    next[index] = newVal;
    onChange(next);
  };

  const removeAt = (index: number) => {
    const next = arr.filter((_, i) => i !== index);

    onChange(next);
  };

  const append = () => {
    onChange([...arr, itemType === "number" ? 0 : ""]);
  };

  return (
    <div className="col-span-full sm:col-span-2 lg:col-span-3 rounded-lg bg-default-100 p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium truncate" title={label}>
          {label}
        </span>
        <Button size="sm" variant="flat" onPress={append}>
          + Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {arr.map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            {itemType === "number" ? (
              <Input
                className="w-24"
                size="sm"
                type="number"
                value={String(item)}
                onValueChange={(v) => {
                  const n = parseInt(v, 10);

                  setAt(i, Number.isNaN(n) ? 0 : n);
                }}
              />
            ) : (
              <Input
                className="w-32"
                size="sm"
                value={String(item)}
                onValueChange={(v) => setAt(i, v)}
              />
            )}
            <Button
              isIconOnly
              aria-label="Remove"
              color="danger"
              size="sm"
              variant="light"
              onPress={() => removeAt(i)}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
