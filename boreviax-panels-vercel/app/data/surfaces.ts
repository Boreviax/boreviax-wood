import type { Product } from "./products";
import type { Locale } from "../i18n/config";
import decorData from "./surface-decors.json";

export const surfaceSlugs = ["hpl", "pet-film", "pvc-film"] as const;
export type SurfaceSlug = (typeof surfaceSlugs)[number];
export type SurfaceDecor = {
  id: string;
  name: string;
  group: string;
  image: string;
  page: number;
  width: number;
  height: number;
};

type SurfaceContent = {
  name: string;
  short: string;
  description: string;
  focus: string;
  detailTitle: string;
  detailIntro: string;
  points: { title: string; text: string }[];
  applications: string[];
  checks: string[];
  note: string;
};

export const surfaceCopy = {
  en: {
    category: "Decorative surfaces",
    homeTitle: "Choose the surface. Then choose the décor.",
    homeIntro: "HPL for high-contact interiors, PET for refined flat furniture fronts, and PVC for profiled and wrapped components.",
    collection: "Surface collection",
    browse: "Explore the surface collection",
    allProducts: "All products",
    sample: "Request a sample",
    viewDecors: "Browse décors",
    download: "Download the full catalogue · PDF, 28 MB",
    material: "Material & application",
    applications: "Typical applications",
    applicationsTitle: "Match the surface to the component.",
    decorEyebrow: "Décor library",
    decorTitle: "Find your finish.",
    decorIntro: "Browse the original catalogue swatches by finish or search by name. Décor names stay the same across languages for accurate sample requests.",
    all: "All finishes",
    search: "Search a décor name",
    searchPlaceholder: "e.g. Honey Amber Oak",
    showing: "Showing",
    of: "of",
    decors: "décors",
    more: "Show more décors",
    noResults: "No matching décor. Try another name or finish.",
    reset: "Clear filters",
    open: "View larger swatch",
    close: "Close preview",
    page: "Catalogue page",
    swatchNote: "Digital swatches are a visual reference. Confirm colour, texture and gloss on a physical sample before production.",
    quoteEyebrow: "Samples & specifications",
    quoteTitle: "Bring the finish into your project.",
    quoteIntro: "Include the décor name, material, substrate, size, quantity and destination. We will confirm the supply form, technical details and sample route.",
    beforeOrder: "Confirm before ordering",
    sampleSubject: "Surface sample request",
    sampleGreeting: "Hello Boreviax, I would like a sample of:",
    sampleDetails: "Please advise sample availability and the material specification.",
    groupLabels: {
      woodgrain: "Woodgrain", "textured-wood": "Textured wood", stone: "Stone", linear: "Linear", fabric: "Fabric", metallic: "Metallic", "solid-colors": "Solid colours", solid: "Solid colours", "high-gloss": "High gloss", "super-matte": "Super matte", pearlescent: "Pearlescent",
    },
  },
  ms: {
    category: "Permukaan hiasan",
    homeTitle: "Pilih bahan permukaan. Kemudian pilih coraknya.",
    homeIntro: "HPL untuk ruang dalaman yang kerap digunakan, PET untuk muka perabot rata dengan kemasan halus, dan PVC untuk komponen berprofil serta berbalut.",
    collection: "Koleksi permukaan",
    browse: "Terokai koleksi permukaan",
    allProducts: "Semua produk",
    sample: "Minta sampel",
    viewDecors: "Lihat corak",
    download: "Muat turun katalog penuh · PDF, 28 MB",
    material: "Bahan & aplikasi",
    applications: "Aplikasi lazim",
    applicationsTitle: "Padankan bahan permukaan dengan komponen.",
    decorEyebrow: "Koleksi corak",
    decorTitle: "Cari kemasan anda.",
    decorIntro: "Lihat swatch asal katalog mengikut kemasan atau cari berdasarkan nama. Nama corak dikekalkan dalam semua bahasa untuk permintaan sampel yang tepat.",
    all: "Semua kemasan",
    search: "Cari nama corak",
    searchPlaceholder: "cth. Honey Amber Oak",
    showing: "Memaparkan",
    of: "daripada",
    decors: "corak",
    more: "Lihat lebih banyak corak",
    noResults: "Tiada corak sepadan. Cuba nama atau kemasan lain.",
    reset: "Kosongkan penapis",
    open: "Lihat swatch lebih besar",
    close: "Tutup pratonton",
    page: "Halaman katalog",
    swatchNote: "Swatch digital ialah rujukan visual. Sahkan warna, tekstur dan kilauan pada sampel fizikal sebelum pengeluaran.",
    quoteEyebrow: "Sampel & spesifikasi",
    quoteTitle: "Gunakan kemasan ini dalam projek anda.",
    quoteIntro: "Sertakan nama corak, bahan, substrat, saiz, kuantiti dan destinasi. Kami akan mengesahkan bentuk bekalan, butiran teknikal dan kaedah mendapatkan sampel.",
    beforeOrder: "Sahkan sebelum membuat pesanan",
    sampleSubject: "Permintaan sampel permukaan",
    sampleGreeting: "Helo Boreviax, saya ingin meminta sampel:",
    sampleDetails: "Sila maklumkan ketersediaan sampel dan spesifikasi bahan.",
    groupLabels: {
      woodgrain: "Urat kayu", "textured-wood": "Kayu bertekstur", stone: "Batu", linear: "Corak linear", fabric: "Fabrik", metallic: "Metalik", "solid-colors": "Warna polos", solid: "Warna polos", "high-gloss": "Kilauan tinggi", "super-matte": "Super matte", pearlescent: "Kilauan mutiara",
    },
  },
  ar: {
    category: "الأسطح الزخرفية",
    homeTitle: "اختر مادة السطح، ثم اختر التصميم.",
    homeIntro: "HPL للمساحات الداخلية كثيرة الاستخدام، وPET لواجهات الأثاث المسطحة بتشطيبات راقية، وPVC للأجزاء ذات الأشكال المحددة والمغلفة.",
    collection: "مجموعة الأسطح",
    browse: "استكشف مجموعة الأسطح",
    allProducts: "جميع المنتجات",
    sample: "اطلب عينة",
    viewDecors: "تصفح التصاميم",
    download: "تنزيل الكتالوج الكامل · PDF، 28 ميغابايت",
    material: "المادة والاستخدام",
    applications: "الاستخدامات الشائعة",
    applicationsTitle: "طابق مادة السطح مع القطعة.",
    decorEyebrow: "مكتبة التصاميم",
    decorTitle: "اعثر على التشطيب المناسب.",
    decorIntro: "تصفح عينات الكتالوج الأصلية حسب التشطيب أو ابحث بالاسم. تبقى أسماء التصاميم موحدة في جميع اللغات لتحديد طلب العينة بدقة.",
    all: "جميع التشطيبات",
    search: "ابحث باسم التصميم",
    searchPlaceholder: "مثال: Honey Amber Oak",
    showing: "عرض",
    of: "من",
    decors: "تصميمًا",
    more: "عرض المزيد من التصاميم",
    noResults: "لا يوجد تصميم مطابق. جرّب اسمًا أو تشطيبًا آخر.",
    reset: "مسح عوامل التصفية",
    open: "عرض العينة بحجم أكبر",
    close: "إغلاق المعاينة",
    page: "صفحة الكتالوج",
    swatchNote: "العينات الرقمية مرجع بصري. اعتمد اللون والملمس واللمعان على عينة فعلية قبل الإنتاج.",
    quoteEyebrow: "العينات والمواصفات",
    quoteTitle: "اختر التشطيب لمشروعك.",
    quoteIntro: "اذكر اسم التصميم والمادة واللوح الأساسي والمقاس والكمية والوجهة. سنؤكد شكل التوريد والتفاصيل الفنية وطريقة الحصول على العينة.",
    beforeOrder: "تحقق قبل الطلب",
    sampleSubject: "طلب عينة سطح زخرفي",
    sampleGreeting: "مرحبًا Boreviax، أود طلب عينة من:",
    sampleDetails: "يرجى إفادتي بتوفر العينة ومواصفات المادة.",
    groupLabels: {
      woodgrain: "عروق خشبية", "textured-wood": "خشب ذو ملمس", stone: "حجر", linear: "تصاميم خطية", fabric: "قماش", metallic: "معدني", "solid-colors": "ألوان موحدة", solid: "ألوان موحدة", "high-gloss": "عالي اللمعان", "super-matte": "فائق المطفي", pearlescent: "لؤلؤي",
    },
  },
} as const;

export const surfaceContent: Record<Locale, Record<SurfaceSlug, SurfaceContent>> = {
  en: {
    hpl: {
      name: "HPL Decorative Laminate",
      short: "A durable high-pressure laminate surface with wood, stone, fabric, metal and solid-colour designs.",
      description: "High-pressure laminate combines resin-impregnated kraft paper and decorative paper under heat and pressure to create a dense surface sheet. The Boreviax collection brings coordinated décors to furniture, cabinetry and high-contact interiors.",
      focus: "Best suited to interiors where repeated contact, cleaning and a consistent decorative surface matter.",
      detailTitle: "A dense surface for everyday contact.",
      detailIntro: "Choose the décor alongside the laminate grade, substrate and complete panel build.",
      points: [
        { title: "Wear & scratch resistance", text: "A dense surface designed for repeated contact, cleaning and everyday furniture use." },
        { title: "Stain resistance & easy care", text: "A practical decorative finish for cabinets, wall panels and frequently used furniture surfaces." },
        { title: "Heat & fire performance", text: "Surface performance is specified by grade. Final fire classification depends on the complete panel assembly and its test evidence." },
      ],
      applications: ["Cabinetry & wardrobes", "Retail & hospitality furniture", "Office & healthcare interiors", "Interior wall panels"],
      checks: ["Laminate grade, thickness and sheet format", "Décor, texture, gloss and approved sample", "Substrate, adhesive and balancing construction", "Performance evidence for the intended panel assembly"],
      note: "HPL is a decorative surface sheet. Supply form and complete panel construction are confirmed with the quotation; the décor image does not specify the substrate or a fire rating.",
    },
    "pet-film": {
      name: "PET Decorative Film",
      short: "High-gloss, super-matte, metallic and pearlescent finishes for flat furniture panels.",
      description: "PET decorative film gives flat-laminated cabinetry and furniture fronts a clean, refined appearance. The collection includes high-gloss, super-matte, metallic and pearlescent finishes for coordinated interior design.",
      focus: "Best suited to flat decorative panels where visual refinement and finish consistency are priorities.",
      detailTitle: "Refined finish. Controlled flat lamination.",
      detailIntro: "The surface result depends on the selected film, substrate preparation and lamination conditions.",
      points: [
        { title: "Clean visual depth", text: "Uniform decorative surfaces for contemporary cabinet doors, furniture fronts and feature panels." },
        { title: "Four finish directions", text: "Choose high gloss, super matte, metallic or pearlescent effects from the original collection." },
        { title: "Prepared for flat panels", text: "Confirm substrate preparation, adhesive and lamination conditions on the actual production sample." },
      ],
      applications: ["Premium flat cabinet doors", "Wardrobes & vanity fronts", "Modern furniture fronts", "Interior feature panels"],
      checks: ["Film grade, thickness, width and supply form", "Décor and required gloss or matte finish", "Substrate preparation and adhesive system", "Lamination conditions and approved production sample"],
      note: "PET film is presented here for flat decorative panels. Confirm the exact grade and process before specifying a particular component or service environment.",
    },
    "pvc-film": {
      name: "PVC Decorative Film",
      short: "Flexible wood, stone, solid and fabric-inspired finishes for profiled, wrapped and shaped components.",
      description: "PVC decorative film follows profiled doors, wrapped components and selected three-dimensional furniture surfaces. Woodgrain, stone, concrete, solid-colour and fabric-inspired designs coordinate the finish across interior components.",
      focus: "Best suited to shaped parts where the decorative surface must follow edges, profiles and routed details.",
      detailTitle: "A decorative finish that follows the form.",
      detailIntro: "Match the film grade and forming process to the actual component geometry.",
      points: [
        { title: "Vacuum pressing", text: "Decorative coverage across routed profiles and shaped cabinet door faces, subject to the approved film and process." },
        { title: "Profile wrapping", text: "Coordinated finishing for mouldings, frames and linear interior components." },
        { title: "A broad décor palette", text: "Wood, stone, concrete, solid and textile looks for furniture and interior wall panels." },
      ],
      applications: ["Vacuum-pressed cabinet doors", "Wrapped profiles & frames", "Wall panels & furniture", "Selected curved components"],
      checks: ["Film grade, thickness, width and supply form", "Décor, texture and approved physical sample", "Substrate geometry, edge radius and adhesive", "Forming temperature and production conditions"],
      note: "Formability depends on the film grade, forming temperature, adhesive and substrate geometry. Confirm these together before production.",
    },
  },
  ms: {
    hpl: {
      name: "Laminat Hiasan HPL",
      short: "Permukaan laminat tekanan tinggi yang tahan lasak, dengan corak kayu, batu, fabrik, logam dan warna polos.",
      description: "Laminat tekanan tinggi menggabungkan kertas kraft yang diresapi resin dan kertas hiasan melalui haba serta tekanan untuk membentuk helaian permukaan padat. Koleksi Boreviax menyelaraskan corak untuk perabot, kabinet dan ruang dalaman yang kerap digunakan.",
      focus: "Sesuai untuk ruang dalaman yang memerlukan ketahanan terhadap sentuhan berulang, pembersihan dan konsistensi permukaan hiasan.",
      detailTitle: "Permukaan padat untuk kegunaan harian.",
      detailIntro: "Pilih corak bersama gred laminat, substrat dan binaan panel lengkap.",
      points: [
        { title: "Ketahanan haus & calar", text: "Permukaan padat yang direka untuk sentuhan berulang, pembersihan dan kegunaan perabot harian." },
        { title: "Ketahanan kotoran & penjagaan mudah", text: "Kemasan hiasan praktikal untuk kabinet, panel dinding dan permukaan perabot yang kerap digunakan." },
        { title: "Prestasi haba & kebakaran", text: "Prestasi permukaan ditentukan mengikut gred. Klasifikasi kebakaran akhir bergantung pada binaan panel lengkap dan bukti ujiannya." },
      ],
      applications: ["Kabinet & almari pakaian", "Perabot runcit & hospitaliti", "Ruang pejabat & penjagaan kesihatan", "Panel dinding dalaman"],
      checks: ["Gred laminat, ketebalan dan format helaian", "Corak, tekstur, kilauan dan sampel diluluskan", "Substrat, pelekat dan binaan pengimbang", "Bukti prestasi untuk binaan panel yang dicadangkan"],
      note: "HPL ialah helaian permukaan hiasan. Bentuk bekalan dan binaan panel lengkap disahkan dalam sebut harga; imej corak tidak menentukan substrat atau kelas kebakaran.",
    },
    "pet-film": {
      name: "Filem Hiasan PET",
      short: "Kemasan kilauan tinggi, super matte, metalik dan kilauan mutiara untuk panel perabot rata.",
      description: "Filem hiasan PET memberikan rupa bersih dan halus pada kabinet berlaminasi rata serta muka perabot. Koleksi ini merangkumi kilauan tinggi, super matte, metalik dan kilauan mutiara untuk reka bentuk dalaman yang selaras.",
      focus: "Sesuai untuk panel hiasan rata yang mengutamakan penampilan halus dan kemasan konsisten.",
      detailTitle: "Kemasan halus. Laminasi rata terkawal.",
      detailIntro: "Hasil permukaan bergantung pada filem yang dipilih, penyediaan substrat dan keadaan laminasi.",
      points: [
        { title: "Penampilan visual yang kemas", text: "Permukaan hiasan seragam untuk pintu kabinet moden, muka perabot dan panel ciri dalaman." },
        { title: "Empat pilihan kemasan", text: "Pilih kilauan tinggi, super matte, metalik atau kilauan mutiara daripada koleksi asal." },
        { title: "Untuk panel rata", text: "Sahkan penyediaan substrat, pelekat dan keadaan laminasi pada sampel pengeluaran sebenar." },
      ],
      applications: ["Pintu kabinet rata premium", "Muka almari & kabinet bilik mandi", "Muka perabot moden", "Panel ciri dalaman"],
      checks: ["Gred filem, ketebalan, lebar dan bentuk bekalan", "Corak serta tahap kilauan atau matte", "Penyediaan substrat dan sistem pelekat", "Keadaan laminasi dan sampel pengeluaran diluluskan"],
      note: "Filem PET di sini ditujukan untuk panel hiasan rata. Sahkan gred dan proses sebenar sebelum menetapkan komponen atau persekitaran penggunaan tertentu.",
    },
    "pvc-film": {
      name: "Filem Hiasan PVC",
      short: "Kemasan fleksibel bercorak kayu, batu, warna polos dan fabrik untuk komponen berprofil, berbalut serta berbentuk.",
      description: "Filem hiasan PVC mengikut bentuk pintu berprofil, komponen berbalut dan permukaan perabot tiga dimensi terpilih. Corak urat kayu, batu, konkrit, warna polos dan fabrik menyelaraskan kemasan pada komponen dalaman.",
      focus: "Sesuai untuk bahagian berbentuk apabila permukaan hiasan perlu mengikut tepi, profil dan butiran beralur.",
      detailTitle: "Kemasan hiasan yang mengikut bentuk.",
      detailIntro: "Padankan gred filem dan proses pembentukan dengan geometri komponen sebenar.",
      points: [
        { title: "Penekanan vakum", text: "Liputan hiasan pada profil beralur dan muka pintu kabinet berbentuk, mengikut filem serta proses yang diluluskan." },
        { title: "Pembalutan profil", text: "Kemasan selaras untuk acuan, bingkai dan komponen dalaman linear." },
        { title: "Pilihan corak yang luas", text: "Rupa kayu, batu, konkrit, warna polos dan tekstil untuk perabot serta panel dinding dalaman." },
      ],
      applications: ["Pintu kabinet ditekan vakum", "Profil & bingkai berbalut", "Panel dinding & perabot", "Komponen melengkung terpilih"],
      checks: ["Gred filem, ketebalan, lebar dan bentuk bekalan", "Corak, tekstur dan sampel fizikal diluluskan", "Geometri substrat, jejari tepi dan pelekat", "Suhu pembentukan dan keadaan pengeluaran"],
      note: "Kebolehbentukan bergantung pada gred filem, suhu pembentukan, pelekat dan geometri substrat. Sahkan semua ini bersama sebelum pengeluaran.",
    },
  },
  ar: {
    hpl: {
      name: "لامينيت زخرفي HPL",
      short: "سطح لامينيت متين مضغوط بضغط عالٍ، بتصاميم خشبية وحجرية وقماشية ومعدنية وألوان موحدة.",
      description: "يجمع اللامينيت المضغوط بضغط عالٍ بين ورق الكرافت المشبع بالراتنج والورق الزخرفي تحت الحرارة والضغط لإنتاج شريحة سطح كثيفة. تقدم مجموعة Boreviax تصاميم متناسقة للأثاث والخزائن والمساحات الداخلية كثيرة الاستخدام.",
      focus: "مناسب للمساحات الداخلية التي تتطلب تحمل التلامس المتكرر والتنظيف واتساق السطح الزخرفي.",
      detailTitle: "سطح كثيف للاستخدام اليومي.",
      detailIntro: "اختر التصميم مع درجة اللامينيت واللوح الأساسي وتركيب اللوح الكامل.",
      points: [
        { title: "مقاومة التآكل والخدش", text: "سطح كثيف مصمم للتلامس المتكرر والتنظيف والاستخدام اليومي للأثاث." },
        { title: "مقاومة البقع وسهولة العناية", text: "تشطيب زخرفي عملي للخزائن وألواح الجدران وأسطح الأثاث كثيرة الاستخدام." },
        { title: "أداء الحرارة والحريق", text: "يُحدد أداء السطح حسب الدرجة. ويعتمد تصنيف الحريق النهائي على تركيب اللوح الكامل ونتائج اختباره." },
      ],
      applications: ["خزائن المطبخ والملابس", "أثاث المتاجر والضيافة", "المكاتب ومرافق الرعاية الصحية", "ألواح الجدران الداخلية"],
      checks: ["درجة اللامينيت والسماكة ومقاس الشريحة", "التصميم والملمس واللمعان والعينة المعتمدة", "اللوح الأساسي واللاصق وتركيب طبقة الموازنة", "أدلة الأداء لتركيب اللوح المطلوب"],
      note: "HPL شريحة سطح زخرفي. يُعتمد شكل التوريد وتركيب اللوح الكامل في عرض السعر؛ ولا تحدد صورة التصميم نوع اللوح الأساسي أو تصنيف الحريق.",
    },
    "pet-film": {
      name: "فيلم زخرفي PET",
      short: "تشطيبات عالية اللمعان وفائقة المطفي ومعدنية ولؤلؤية لألواح الأثاث المسطحة.",
      description: "يمنح فيلم PET الزخرفي الخزائن المغلفة تغليفًا مسطحًا وواجهات الأثاث مظهرًا نظيفًا وراقيًا. تشمل المجموعة تشطيبات عالية اللمعان وفائقة المطفي ومعدنية ولؤلؤية لتصميم داخلي متناسق.",
      focus: "مناسب للألواح الزخرفية المسطحة التي تتطلب مظهرًا راقيًا وتشطيبًا متسقًا.",
      detailTitle: "تشطيب راقٍ وتغليف مسطح مضبوط.",
      detailIntro: "تعتمد النتيجة على الفيلم المختار وتجهيز اللوح الأساسي وظروف التغليف.",
      points: [
        { title: "عمق بصري نظيف", text: "أسطح زخرفية موحدة لأبواب الخزائن الحديثة وواجهات الأثاث والألواح الداخلية المميزة." },
        { title: "أربعة اتجاهات للتشطيب", text: "اختر اللمعان العالي أو المطفي الفائق أو التأثير المعدني أو اللؤلؤي من المجموعة الأصلية." },
        { title: "للألواح المسطحة", text: "تحقق من تجهيز اللوح الأساسي واللاصق وظروف التغليف على عينة الإنتاج الفعلية." },
      ],
      applications: ["أبواب خزائن مسطحة فاخرة", "واجهات خزائن الملابس والحمامات", "واجهات الأثاث الحديثة", "ألواح داخلية مميزة"],
      checks: ["درجة الفيلم والسماكة والعرض وشكل التوريد", "التصميم ومستوى اللمعان أو التشطيب المطفي", "تجهيز اللوح الأساسي ونظام اللاصق", "ظروف التغليف وعينة الإنتاج المعتمدة"],
      note: "يُعرض فيلم PET هنا للألواح الزخرفية المسطحة. تحقق من الدرجة وطريقة الإنتاج قبل تحديد قطعة أو بيئة استخدام بعينها.",
    },
    "pvc-film": {
      name: "فيلم زخرفي PVC",
      short: "تشطيبات مرنة بتصاميم خشبية وحجرية وألوان موحدة ومظهر قماشي للأجزاء المشكلة والمغلفة.",
      description: "يتبع فيلم PVC الزخرفي شكل الأبواب ذات التفاصيل البارزة والأجزاء المغلفة وبعض أسطح الأثاث ثلاثية الأبعاد. تنسق تصاميم الخشب والحجر والخرسانة والألوان الموحدة والقماش التشطيب عبر المكونات الداخلية.",
      focus: "مناسب للأجزاء المشكلة التي يحتاج سطحها الزخرفي إلى اتباع الحواف والتفاصيل المحفورة.",
      detailTitle: "تشطيب زخرفي يتبع الشكل.",
      detailIntro: "طابق درجة الفيلم وطريقة التشكيل مع هندسة القطعة الفعلية.",
      points: [
        { title: "الكبس بالتفريغ", text: "تغطية زخرفية للتفاصيل المحفورة وواجهات أبواب الخزائن المشكلة، بحسب الفيلم وطريقة الإنتاج المعتمدين." },
        { title: "تغليف المقاطع", text: "تشطيب متناسق للقوالب والإطارات والمكونات الداخلية الطولية." },
        { title: "مجموعة واسعة من التصاميم", text: "مظهر خشبي وحجري وخرساني وقماشي وألوان موحدة للأثاث وألواح الجدران الداخلية." },
      ],
      applications: ["أبواب خزائن مكبوسة بالتفريغ", "مقاطع وإطارات مغلفة", "ألواح جدران وأثاث", "مكونات منحنية مختارة"],
      checks: ["درجة الفيلم والسماكة والعرض وشكل التوريد", "التصميم والملمس والعينة الفعلية المعتمدة", "هندسة اللوح الأساسي ونصف قطر الحافة واللاصق", "درجة حرارة التشكيل وظروف الإنتاج"],
      note: "تعتمد قابلية التشكيل على درجة الفيلم وحرارة التشكيل واللاصق وهندسة اللوح الأساسي. تحقق منها معًا قبل الإنتاج.",
    },
  },
};

export function isSurfaceSlug(slug: string): slug is SurfaceSlug {
  return surfaceSlugs.includes(slug as SurfaceSlug);
}

export function getSurfaceDecors(slug: SurfaceSlug): SurfaceDecor[] {
  return decorData[slug];
}

export function getDecorativeProducts(locale: Locale): Product[] {
  return surfaceSlugs.map((slug) => {
    const content = surfaceContent[locale][slug];
    return {
      slug,
      name: content.name,
      category: surfaceCopy[locale].category,
      short: content.short,
      description: content.description,
      hero: `/assets/surfaces/${slug}-hero.webp`,
      detailImage: getSurfaceDecors(slug)[0].image,
      specs: [],
      features: content.points.map((point) => point.title),
      applications: content.applications,
      buyerChecklist: content.checks,
      note: content.note,
    };
  });
}
