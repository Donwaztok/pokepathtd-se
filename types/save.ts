/** Item do jogo (equipado em Pokémon). */
export interface GameItem {
  id?: string;
  name?: string[];
  sprite?: string;
  price?: number;
  description?: string[];
  restriction?: Record<string, unknown>;
  equipedBy?: number;
  [key: string]: unknown;
}

export interface Pokemon {
  specieKey: string;
  lvl?: number;
  isShiny?: boolean;
  targetMode?: string;
  favorite?: boolean;
  item?: GameItem | null;
  hideShiny?: boolean;
  isMega?: boolean;
  [key: string]: unknown;
}

export interface Player {
  update?: number;
  name?: string;
  portrait?: number;
  gold?: number;
  health?: number[];
  records?: number[];
  ribbons?: unknown[];
  stars?: number;
  teamSlots?: number;
  extraGold?: number;
  achievements?: unknown[];
  achievementProgress?: unknown;
  stats?: Record<string, unknown>;
  challenges?: unknown;
  sortedBox?: unknown;
  [key: string]: unknown;
}

export interface AreaData {
  routeNumber?: number;
  routeWaves?: number[];
  [key: string]: unknown;
}

/** Shop item with sprite, price and i18n name/description. */
export interface ShopItemStockEntry {
  id?: string;
  name?: string[];
  sprite?: string;
  price?: number;
  description?: string[];
  restriction?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ShopData {
  eggPrice?: number;
  eggList?: string[];
  itemList?: string[];
  itemStock?: (ShopItemStockEntry | null)[];
  [key: string]: unknown;
}

export interface SaveData {
  new?: boolean;
  player?: Player;
  team?: Pokemon[];
  box?: Pokemon[];
  area?: AreaData;
  shop?: ShopData;
  teamManager?: unknown;
  [key: string]: unknown;
}
