import type { Product } from "../data/products";
import arabicProducts from "./products-ar.json";
import malayProducts from "./products-ms.json";
import type { LocalizedLocale } from "./config";

const localizedProducts: Record<LocalizedLocale, Product[]> = {
  ms: malayProducts as Product[],
  ar: arabicProducts as Product[],
};

export function getLocalizedProducts(locale: LocalizedLocale) {
  return localizedProducts[locale];
}

export function getLocalizedProduct(locale: LocalizedLocale, slug: string) {
  return localizedProducts[locale].find((product) => product.slug === slug);
}
