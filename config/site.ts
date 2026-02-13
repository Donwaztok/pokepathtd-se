export interface NavItem {
  label: string;
  href: string;
}

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Poké Path Save Editor",
  description: "Edit your Poké Path TD save — decode, modify and encode again.",
  /**
   * Base URL do site. Use NEXT_PUBLIC_SITE_URL ou defina manualmente para produção.
   * Ex: https://pokepathtd-se.vercel.app
   */
  baseUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://pokepathtd-se.vercel.app",
  navItems: [] as NavItem[],
  navMenuItems: [] as NavItem[],
  links: {
    github: "https://github.com/Donwaztok/pokepathtd-se",
    docs: "https://heroui.com",
  },
  /** SEO: palavras-chave para indexação */
  keywords: [
    "Poké Path",
    "Poké Path TD",
    "save editor",
    "game save",
    "Base64",
    "Pokémon",
    "tower defense",
  ],
};
