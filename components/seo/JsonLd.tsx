import { siteConfig } from "@/config/site";

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.baseUrl,
  applicationCategory: "UtilitiesApplication",
  author: {
    "@type": "Person",
    name: "Donwaztok",
    url: siteConfig.links.github,
  },
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(webApplicationSchema),
      }}
    />
  );
}
