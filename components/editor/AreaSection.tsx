"use client";

import type { AreaData, SaveData } from "@/types/save";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";

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

interface AreaSectionProps {
  data: SaveData;
  onChange: (next: SaveData) => void;
}

export function AreaSection({ data, onChange }: AreaSectionProps) {
  const area: AreaData = data.area ?? {};
  const routeNumber = (area.routeNumber ?? 0) as number;
  const routeWaves = (area.routeWaves ?? []) as number[];

  const setArea = (patch: Partial<AreaData>) => {
    onChange({ ...data, area: { ...area, ...patch } });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Area</h3>
        </CardHeader>
        <CardBody className="gap-4">
          <Input
            label="Current route (routeNumber)"
            type="number"
            value={String(routeNumber)}
            onValueChange={(v) =>
              setArea({ routeNumber: parseInt(v, 10) || 0 })
            }
          />
          <div>
            <p className="text-sm text-default-500 mb-2">
              Waves per route (routeWaves)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {routeWaves.length === 0 ? (
                <p className="text-default-400 text-sm col-span-full">
                  No values. Add waves in JSON if needed.
                </p>
              ) : (
                routeWaves.map((val, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-16 text-sm truncate">
                      {ROUTE_NAMES[i] ?? `Route ${i + 1}`}
                    </span>
                    <Input
                      size="sm"
                      type="number"
                      value={String(val ?? 0)}
                      onValueChange={(v) => {
                        const n = Math.max(
                          0,
                          Math.min(MAX_WAVES, parseInt(v, 10) || 0),
                        );
                        const next = [...routeWaves];

                        next[i] = n;
                        setArea({ routeWaves: next });
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
