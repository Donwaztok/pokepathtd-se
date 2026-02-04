export interface NavItem {
  label: string;
  href: string;
}

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Poké Path Save Editor",
  description: "Edit your Poké Path TD save — decode, modify and encode again.",
  navItems: [] as NavItem[],
  navMenuItems: [] as NavItem[],
  links: {
    github: "https://github.com/Donwaztok/pokepathtd-se",
    docs: "https://heroui.com",
  },
};
