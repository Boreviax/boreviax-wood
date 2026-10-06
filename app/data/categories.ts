import type { Locale } from "../i18n/config";

export const productCategories = [
  { id: "wood-panels", slugs: ["flexible-plywood", "birch-plywood", "duraply", "functional-plywood", "mdf", "particle-board", "fosb"] },
  { id: "decorative-surfaces", slugs: ["hpl", "pet-film", "pvc-film"] },
  { id: "exterior-wpc", slugs: ["wpc-products"] },
  { id: "acoustic-panels", slugs: ["acoustic-panels"] },
] as const;

type CategoryCopy = {
  navigation: string;
  categories: { title: string; intro: string }[];
};

export const categoryCopy: Record<Locale, CategoryCopy> = {
  en: {
    navigation: "Browse product categories",
    categories: [
      { title: "Plywood & core boards", intro: "Select the construction for forming, machining, laminating and performance-led panel projects." },
      { title: "Decorative surfaces", intro: "HPL laminate, PET film and PVC film, with a coordinated library of 103 catalogue décors." },
      { title: "Exterior WPC", intro: "Composite decking, cladding and profiles with the matching installation system." },
      { title: "Acoustic panels", intro: "Wooden slat panels for interior walls and ceilings, specified as a complete installed build." },
    ],
  },
  ms: {
    navigation: "Lihat kategori produk",
    categories: [
      { title: "Papan lapis & papan teras", intro: "Pilih binaan untuk pembentukan, pemesinan, laminasi dan projek panel berasaskan prestasi." },
      { title: "Permukaan hiasan", intro: "Laminat HPL, filem PET dan filem PVC dengan koleksi 103 corak katalog yang diselaraskan." },
      { title: "WPC luaran", intro: "Lantai dek, pelapisan dan profil komposit bersama sistem pemasangan yang sepadan." },
      { title: "Panel akustik", intro: "Panel bilah kayu untuk dinding dan siling dalaman, ditentukan sebagai binaan pemasangan lengkap." },
    ],
  },
  ar: {
    navigation: "تصفح فئات المنتجات",
    categories: [
      { title: "الخشب الرقائقي وألواح الأساس", intro: "اختر التركيب المناسب للتشكيل والتشغيل والتغليف ومشاريع الألواح ذات متطلبات الأداء المحددة." },
      { title: "الأسطح الزخرفية", intro: "لامينيت HPL وفيلم PET وفيلم PVC، مع مجموعة متناسقة تضم 103 تصاميم من الكتالوج." },
      { title: "WPC للاستخدام الخارجي", intro: "أرضيات وكسوات ومقاطع مركبة مع نظام التركيب المناسب." },
      { title: "الألواح الصوتية", intro: "ألواح بشرائح خشبية للجدران والأسقف الداخلية، تُحدد وفق تركيبها الكامل بعد التثبيت." },
    ],
  },
};
