import type { MetadataRoute } from "next";
import { products } from "./data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://wood.boreviax.com";
  const now = new Date();
  const pagePaths = ["", "/products", "/about", "/contact"];
  const productPaths = products.map((product) => `/products/${product.slug}`);
  const paths = [...pagePaths, ...productPaths];

  return paths.flatMap((path) => {
    const alternates = {
      languages: {
        en: `${baseUrl}${path}`,
        "ms-MY": `${baseUrl}/ms${path}`,
        ar: `${baseUrl}/ar${path}`,
      },
    };
    const priority = path === "" ? 1 : path === "/products" ? 0.9 : path.startsWith("/products/") ? 0.8 : path === "/contact" ? 0.7 : 0.6;
    const changeFrequency = path === "/about" || path === "/contact" ? "yearly" as const : "monthly" as const;

    return ["", "/ms", "/ar"].map((prefix) => ({
      url: `${baseUrl}${prefix}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates,
    }));
  });
}
