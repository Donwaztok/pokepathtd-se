/**
 * Base URL for Poké Path assets (sprites, icons, items).
 * All assets are loaded from this external site — this project has no local sprites.
 */
export const ASSETS_BASE_URL = "https://pokepath-game.pages.dev";

/**
 * Converte um caminho relativo do JSON (ex: "./src/assets/images/pokemon/shiny/persian.png")
 * na URL completa do asset.
 */
export function resolveSpriteUrl(
  path: string | undefined | null,
): string | null {
  if (!path || typeof path !== "string") return null;
  const normalized = path.replace(/^\.\//, "");

  if (!normalized) return null;

  return `${ASSETS_BASE_URL}/${normalized}`;
}

/**
 * URL do sprite de um Pokémon (normal ou shiny).
 * Respeita hideShiny: quando true, o jogo usa o mesmo sprite para ambos → sempre "normal".
 * @param hideShiny se true, ignora isShiny e usa pasta "normal" (ex.: Pikachu no jogo)
 */
export function pokemonSpriteUrl(
  specieKey: string,
  isShiny: boolean,
  hideShiny?: boolean,
): string {
  const useShinyFolder = isShiny && !hideShiny;
  const folder = useShinyFolder ? "shiny" : "normal";

  return `${ASSETS_BASE_URL}/src/assets/images/pokemon/${folder}/${specieKey}.png`;
}
