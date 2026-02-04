"use client";

import type { SaveData } from "@/types/save";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Progress } from "@heroui/progress";

import { SpriteImage } from "./SpriteImage";
import { StatsArrayEditor } from "./StatsArrayEditor";

const STATS_ARRAY_KEYS: Record<string, "number" | "string" | "pair"> = {
  defeatedSpecies: "string",
  maxGoldPerWave: "pair",
  maxGoldPerTime: "pair",
};

const STATS_ARRAY_PAIR_LABELS: Record<string, [string, string]> = {
  maxGoldPerWave: ["Gold", "Wave"],
  maxGoldPerTime: ["Gold", "Time"],
};

const ROUTE_NAMES = [
  "Route 1",
  "Route 2",
  "Route 3",
  "Route 4",
  "Route 5",
  "Route 6",
  "Route 7",
  "Route 8",
  "Route 9",
  "Route 10",
  "Route 11",
  "Route 12",
];

const MAX_WAVES = 100;

interface PlayerSectionProps {
  data: SaveData;
  onChange: (next: SaveData) => void;
}

export function PlayerSection({ data, onChange }: PlayerSectionProps) {
  const player = data.player ?? {};
  const gold = (data.gold ?? player.gold ?? 0) as number;
  const name = (player.name ?? "") as string;
  const portrait = (player.portrait ?? 0) as number;
  const records = (player.records ?? []) as number[];
  const stars = (player.stars ?? 0) as number;
  const teamSlots = (player.teamSlots ?? 10) as number;
  const extraGold = (player.extraGold ?? 0) as number;
  const ribbons = (player.ribbons ?? 0) as number;
  const achievements = (player.achievements ?? []) as Array<{
    description?: string[];
    status?: boolean;
    image?: string;
  }>;
  const achievementProgress = (player.achievementProgress ?? {}) as Record<
    string,
    number
  >;
  const stats = (player.stats ?? {}) as Record<string, unknown>;

  const maxStars = records.length * MAX_WAVES;
  const totalStars = records.reduce((s, v) => s + (v ?? 0), 0);

  const setPlayer = (patch: Record<string, unknown>) => {
    onChange({
      ...data,
      player: { ...player, ...patch },
    });
  };

  const setRoot = (key: string, value: unknown) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Player</h3>
        </CardHeader>
        <CardBody className="gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={name}
              onValueChange={(v) => setPlayer({ name: v })}
            />
            <Input
              label="Portrait"
              type="number"
              value={String(portrait)}
              onValueChange={(v) =>
                setPlayer({ portrait: parseInt(v, 10) || 0 })
              }
            />
            <Input
              label="Gold"
              type="number"
              value={String(gold)}
              onValueChange={(v) => {
                const n = parseInt(v, 10) || 0;

                setPlayer({ gold: n });
                setRoot("gold", n);
              }}
            />
            <Input
              label="Team slots"
              type="number"
              value={String(teamSlots)}
              onValueChange={(v) =>
                setPlayer({ teamSlots: parseInt(v, 10) || 1 })
              }
            />
            <Input
              label="Stars"
              type="number"
              value={String(stars)}
              onValueChange={(v) => setPlayer({ stars: parseInt(v, 10) || 0 })}
            />
            <Input
              label="Ribbons"
              type="number"
              value={String(ribbons)}
              onValueChange={(v) =>
                setPlayer({ ribbons: parseInt(v, 10) || 0 })
              }
            />
            <Input
              label="Extra gold"
              type="number"
              value={String(extraGold)}
              onValueChange={(v) =>
                setPlayer({ extraGold: parseInt(v, 10) || 0 })
              }
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Routes (records)</h3>
          <div className="flex gap-2 ml-auto">
            <Button
              color="success"
              size="sm"
              onPress={() => {
                const maxRecords = records.map(() => MAX_WAVES);

                setPlayer({ records: maxRecords, stars: maxStars });
              }}
            >
              Max all
            </Button>
            <Button
              size="sm"
              variant="bordered"
              onPress={() => {
                setPlayer({ records: records.map(() => 0), stars: 0 });
              }}
            >
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardBody className="gap-4">
          <p className="text-default-500 text-sm">
            ⭐ {totalStars} / {maxStars} stars
          </p>
          <Progress
            className="max-w-full"
            value={maxStars ? (totalStars / maxStars) * 100 : 0}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {records.map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-16 text-sm truncate">
                  {ROUTE_NAMES[i] ?? `Route ${i + 1}`}
                </span>
                <Input
                  max={MAX_WAVES}
                  min={0}
                  size="sm"
                  type="number"
                  value={String(val ?? 0)}
                  onValueChange={(v) => {
                    const n = Math.max(
                      0,
                      Math.min(MAX_WAVES, parseInt(v, 10) || 0),
                    );
                    const next = [...records];

                    next[i] = n;
                    setPlayer({
                      records: next,
                      stars: next.reduce((s, r) => s + r, 0),
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Achievements</h3>
        </CardHeader>
        <CardBody>
          {achievements.length === 0 ? (
            <p className="text-default-500 text-sm">
              No achievements in save. Use the &quot;JSON&quot; tab to add.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {achievements.map((a, i) => {
                const nextAchievements = [...achievements];
                const entry = nextAchievements[i] ?? {};
                const isUnlocked = !!entry.status;
                const description = Array.isArray(entry.description)
                  ? entry.description[0]
                  : "";

                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-default-100 min-h-[48px] w-full"
                  >
                    <SpriteImage
                      alt={`Badge ${i}`}
                      size={32}
                      src={entry.image}
                    />
                    <span
                      className="text-xs truncate min-w-0 flex-1"
                      title={description}
                    >
                      {description}
                    </span>
                    <Button
                      isIconOnly
                      aria-label={
                        isUnlocked
                          ? "Unlocked (click to mark pending)"
                          : "Pending (click to unlock)"
                      }
                      color={isUnlocked ? "success" : "default"}
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        nextAchievements[i] = { ...entry, status: !isUnlocked };
                        setPlayer({ achievements: nextAchievements });
                      }}
                    >
                      {isUnlocked ? "✓" : "✗"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Progress (achievementProgress)
          </h3>
        </CardHeader>
        <CardBody>
          {Object.keys(achievementProgress).length === 0 ? (
            <p className="text-default-500 text-sm">
              No achievement progress. Use the &quot;JSON&quot; tab to add.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(achievementProgress).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="text-sm truncate min-w-0 flex-1" title={k}>
                    {k}
                  </span>
                  <Input
                    className="w-24"
                    size="sm"
                    type="number"
                    value={String(v)}
                    onValueChange={(val) => {
                      const num = parseInt(val, 10);

                      if (Number.isNaN(num)) return;
                      setPlayer({
                        achievementProgress: {
                          ...achievementProgress,
                          [k]: num,
                        },
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Stats</h3>
        </CardHeader>
        <CardBody>
          {Object.keys(stats).length === 0 ? (
            <p className="text-default-500 text-sm">
              No stats in save. Use the &quot;JSON&quot; tab to add.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(stats).map(([k, v]) => {
                const numVal =
                  typeof v === "number"
                    ? v
                    : typeof v === "string"
                      ? parseInt(String(v), 10)
                      : 0;

                if (
                  typeof v !== "number" &&
                  typeof v !== "string" &&
                  !Array.isArray(v)
                )
                  return null;
                if (Array.isArray(v) && STATS_ARRAY_KEYS[k] !== undefined) {
                  return (
                    <StatsArrayEditor
                      key={k}
                      itemType={STATS_ARRAY_KEYS[k]}
                      label={k}
                      pairLabels={STATS_ARRAY_PAIR_LABELS[k]}
                      value={v}
                      onChange={(next) =>
                        setPlayer({ stats: { ...stats, [k]: next } })
                      }
                    />
                  );
                }
                if (Array.isArray(v))
                  return (
                    <div key={k} className="text-sm p-2 rounded bg-default-100">
                      <span className="truncate block" title={k}>
                        {k}
                      </span>
                      <span className="text-default-500 text-xs">
                        (array — edit in JSON)
                      </span>
                    </div>
                  );

                return (
                  <div key={k} className="flex items-center gap-2">
                    <span className="text-sm truncate min-w-0 flex-1" title={k}>
                      {k}
                    </span>
                    <Input
                      className="w-24"
                      size="sm"
                      type="number"
                      value={String(numVal)}
                      onValueChange={(val) => {
                        const num = parseInt(val, 10);

                        if (Number.isNaN(num)) return;
                        setPlayer({ stats: { ...stats, [k]: num } });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
