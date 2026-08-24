export type ProductSpec = {
  label: string;
  value: string;
};

export type ConstructionPoint = {
  label: string;
  title: string;
  copy: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
};

export type ProductVariantDetail = {
  name: string;
  positioning: string;
  construction: string;
  image?: string;
  imageAlt?: string;
  bestFor: string[];
  buyerChecks: string[];
};

export type ProductGalleryItem = {
  src: string;
  alt: string;
  caption: string;
};

export type ProductStructureSpotlight = {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  intro: string;
  layers: ConstructionPoint[];
  buyerValue: string[];
  note?: string;
};

export type Product = {
  slug: string;
  name: string;
  fullName?: string;
  category: string;
  short: string;
  description: string;
  hero: string;
  heroCaption?: string;
  detailImage: string;
  detailCaption?: string;
  specs: ProductSpec[];
  features: string[];
  applications: string[];
  variants?: string[];
  referenceTitle?: string;
  referenceItems?: string[];
  note?: string;
  procurementFocus?: string;
  constructionTitle?: string;
  constructionIntro?: string;
  construction?: ConstructionPoint[];
  structureSpotlight?: ProductStructureSpotlight;
  variantDetails?: ProductVariantDetail[];
  variantEyebrow?: string;
  variantTitle?: string;
  variantIntro?: string;
  buyerChecklist?: string[];
  gallery?: ProductGalleryItem[];
  galleryLayout?: "grid" | "rail";
  galleryEyebrow?: string;
  galleryTitle?: string;
  galleryIntro?: string;
};

export const products: Product[] = [
  {
    slug: "flexible-plywood",
    name: "Flexible Plywood",
    category: "Plywood & curved solutions",
    short:
      "A lightweight plywood substrate engineered to form clean, controlled curves without kerf cuts.",
    description:
      "Thin veneers are arranged around a controlled grain direction so the sheet forms a clean curve without repeated kerf cuts. The buyer first defines bend direction, finished radius and surface system; we then match thickness, orientation and sample construction before volume production.",
    procurementFocus:
      "Flexible Plywood reduces labour and joint lines on curved work, but only when bend direction, minimum radius, fixing method and final laminate are specified together. A wrong orientation or an untested surface can turn a simple curve into cracking, spring-back and site rework.",
    hero: "/assets/flexible-hero.webp",
    detailImage: "/assets/flexible-stock.webp",
    specs: [
      { label: "Supplier density reference", value: "580–600 kg/m³" },
      { label: "Moisture reference", value: "6–8%" },
      { label: "Common formats", value: "4 × 8 ft / 4 × 9 ft" },
      { label: "Use class", value: "Interior, non-structural" },
    ],
    features: [
      "Clean, continuous curves",
      "Low panel weight",
      "Long-grain and cross-grain configurations",
      "Compatible with veneers or laminates after forming",
    ],
    constructionTitle: "From veneer direction to the finished curve.",
    constructionIntro:
      "The sheet is only one part of a curved assembly. Radius, grain direction, adhesive, support spacing and decorative finish determine whether the completed component stays smooth and stable.",
    construction: [
      {
        label: "01",
        title: "Direction-controlled lay-up",
        copy:
          "Thin veneers are arranged so most of the flexibility works in one defined direction. Long-grain and cross-grain panels are therefore not interchangeable.",
        image: "/assets/flexible-roll-test.webp",
        imageAlt: "Flexible plywood rolled into a tight cylinder during a bend test",
        imageCaption:
          "The roll test shows bend direction and surface continuity on the actual panel construction.",
      },
      {
        label: "02",
        title: "Thickness matched to radius",
        copy:
          "Thinner panels form tighter curves; thicker panels need a larger radius or more forming force. The specified radius should be tested on the actual production construction.",
        image: "/assets/flexible-radius-check.webp",
        imageAlt: "Flexible plywood bend radius being measured",
        imageCaption:
          "Measure the radius on the exact thickness, grain direction and sample build being quoted.",
      },
      {
        label: "03",
        title: "Dry-form and sample approval",
        copy:
          "A sample is formed on the intended jig to check cracking, spring-back, face quality and dimensional recovery before a production order is released.",
        image: "/assets/flexible-hand-forming.webp",
        imageAlt: "Operator manually forming a flexible plywood sample",
        imageCaption:
          "Manual forming is an early check; the approved test should still use the intended jig and fixing method.",
      },
      {
        label: "04",
        title: "Finish after forming",
        copy:
          "Veneer, paper-backed veneer or laminate is normally applied after the substrate is held to shape. Adhesive and backing choice must suit the curve and service environment.",
        image: "/assets/flexible-cylinder-demo.webp",
        imageAlt: "Flexible plywood formed into a large full-width cylinder",
        imageCaption:
          "A full-width formed sample exposes joints, surface checks and spring-back before finishing.",
      },
    ],
    applications: [
      "Curved feature walls",
      "Column cladding",
      "Reception desks",
      "Cabinet ends and arches",
      "Custom furniture forms",
    ],
    referenceTitle: "Minimum bend radius — along grain",
    referenceItems: [
      "3 mm panel: 150 mm radius",
      "5 mm panel: 220–250 mm radius",
      "6 mm panel: 300 mm radius",
      "8 mm panel: 400 mm radius",
      "9 mm panel: 450 mm radius",
    ],
    buyerChecklist: [
      "Inside or outside radius, and the tightest finished radius",
      "Long-grain or cross-grain bend direction",
      "Finished component thickness and support or jig design",
      "Decorative surface, adhesive and lamination sequence",
      "Permitted face checks, core gaps and thickness tolerance",
      "Approved formed sample before volume production",
    ],
    note:
      "Bend direction, face construction and finish affect the achievable radius. Confirm the exact sample build before production.",
  },
  {
    slug: "birch-plywood",
    name: "Birch Plywood",
    category: "Plywood & joinery",
    short:
      "Cross-laminated birch veneers provide clean edges, stable machining and dependable fixing performance.",
    description:
      "Dense, even plies create a stiff and dimensionally stable panel. Birch plywood machines cleanly, holds fixings well and can leave its layered edge visible as part of the finished design.",
    hero: "/assets/birch-hero.webp",
    detailImage: "/assets/birch-structure-diagram.webp",
    specs: [
      { label: "Thickness", value: "3–30 mm" },
      { label: "Density reference", value: "Approx. 680 kg/m³" },
      { label: "Moisture reference", value: "6–8%" },
      { label: "Common formats", value: "1220 × 2440 / 2745 mm" },
      { label: "Grade references", value: "E0, CARB P2, ENF" },
    ],
    features: [
      "High strength-to-weight performance",
      "Clean, usable layered edges",
      "Good screw-holding and machining",
      "Stable cross-laminated construction",
    ],
    constructionTitle: "Inspect the structure at the point it matters.",
    constructionIntro:
      "Birch plywood should be judged as a repeatable panel system: veneer lay-up, full-sheet face, batch consistency and finished machining each need their own approval reference.",
    construction: [
      {
        label: "01",
        title: "Cross-laminated veneer build",
        copy:
          "Alternating veneer direction spreads loads and limits movement. Confirm whether the order is full birch or combi core, then define ply count, permitted gaps, overlaps and bond-line quality.",
        image: "/assets/birch-supplied-edge-stacks.webp",
        imageAlt: "Stacked birch plywood edges showing repeated cross-laminated veneers",
        imageCaption:
          "Edge evidence makes ply count, veneer repetition and visible core defects easier to compare across sheets.",
      },
      {
        label: "02",
        title: "Face grade across the full sheet",
        copy:
          "A small sample cannot show colour range, patches, repairs or grain continuity across a production sheet. Agree the face and back grade together with the final visible-surface expectation.",
        image: "/assets/birch-face-inspection-1.webp",
        imageAlt: "Full birch plywood sheet being inspected on a production table",
        imageCaption:
          "Full-sheet inspection reveals face variation that a cropped product image can hide.",
      },
      {
        label: "03",
        title: "Batch and edge consistency",
        copy:
          "Repeated sheets should hold the same lay-up, moisture range and thickness tolerance. Stack inspection helps expose drifting ply counts, uneven edges and isolated core gaps before machining starts.",
        image: "/assets/birch-stacked-plies.webp",
        imageAlt: "Dense stack of birch plywood edges prepared for batch comparison",
        imageCaption:
          "Compare several edges from the batch rather than approving one unusually clean sample.",
      },
      {
        label: "04",
        title: "Machining and finish approval",
        copy:
          "CNC routing, exposed edges, screw holding and coating can reveal defects that are not obvious in a raw board. Approve a finished component or machining sample before volume production.",
        image: "/assets/birch-finished-panels.webp",
        imageAlt: "Finished birch plywood panels with clean faces and exposed layered edges",
        imageCaption:
          "Approve the face, exposed edge and finished machining as one commercial reference.",
      },
    ],
    applications: [
      "Furniture and drawer systems",
      "Shelving and high-load joinery",
      "CNC-routed components",
      "Interior fit-out",
      "Protective packaging",
    ],
    buyerChecklist: [
      "Full-birch or combi core and required ply count",
      "Face and back grade, patch rules and visible-edge expectation",
      "Bonding class, emission class and destination-market evidence",
      "Permitted core gaps, overlaps and thickness tolerance",
      "Machining, screw-holding and finished-surface sample",
    ],
    gallery: [
      {
        src: "/assets/birch-production-stack.webp",
        alt: "Full-size birch plywood panels stacked during production",
        caption: "Production-stack evidence supports checks on edge alignment, sheet condition and batch consistency.",
      },
      {
        src: "/assets/birch-face-inspection-2.webp",
        alt: "Large birch plywood sheet laid out for face inspection",
        caption: "Full-sheet inspection reveals face continuity that a small hand sample cannot show.",
      },
    ],
    galleryLayout: "grid",
    galleryEyebrow: "Supplied birch references",
    galleryTitle: "Inspect face, edge and batch—not one hero image.",
    galleryIntro:
      "These two supplementary views complete the production and full-face checks. Edge, construction and finished-panel evidence now sit beside the technical points they explain.",
    note:
      "Specify full-birch or combi core, ply count, face grade, bonding class, permitted core gaps and thickness tolerance in the RFQ.",
  },
  {
    slug: "duraply",
    name: "Duraply",
    fullName: "Durable Plywood",
    category: "Plywood & lamination bases",
    short:
      "A smooth, hard plywood base developed for demanding decorative lamination and precision finishing.",
    description:
      "Duraply combines a eucalyptus plywood core with balanced high-density New Zealand pine particle surface layers. The hybrid construction is precision-sanded to create a hard, uniform base for deep embossing, mirror PET, UV and decorative-paper finishing on repeat furniture-production lines.",
    procurementFocus:
      "Duraply is designed for buyers who need plywood fixing performance without accepting an uneven lamination base. Its value is fewer surface defects, more predictable pressing and less line stoppage caused by thickness variation or veneer telegraphing.",
    hero: "/assets/duraply-product-edge-2.webp",
    detailImage: "/assets/duraply-standing-sample.webp",
    specs: [
      { label: "Thickness", value: "9–25 mm" },
      { label: "Core density reference", value: "Approx. 680 kg/m³" },
      { label: "Surface-layer density", value: "980 kg/m³" },
      { label: "Four-corner tolerance", value: "Within 0.1 mm" },
      { label: "Moisture reference", value: "6–8%" },
      { label: "Common formats", value: "1220 × 2440 / 2800 mm" },
      { label: "Grade references", value: "E0, CARB P2, ENF, F★★★★" },
    ],
    features: [
      "Smooth, hard surface",
      "Stable base for deep embossing",
      "Suitable for mirror PET and UV finishing",
      "Supplier-reported 99.7% qualification rate",
    ],
    constructionTitle: "A plywood core with engineered finishing faces.",
    constructionIntro:
      "The structure separates two jobs: the plywood core carries fixing and panel duties, while dense balanced surface layers create a consistent finishing platform.",
    construction: [
      {
        label: "Core",
        title: "Eucalyptus plywood body",
        copy:
          "Cross-laminated eucalyptus veneers provide the main panel thickness, fixing base and load distribution. Veneer moisture and lay-up balance influence flatness.",
        image: "/assets/duraply-closeup-stack-1.webp",
        imageAlt: "Close Duraply stack showing the plywood core beneath dense surface layers",
        imageCaption:
          "The veneer body carries the core duties; gaps, overlaps and moisture remain order-critical checks.",
      },
      {
        label: "Faces",
        title: "980 kg/m³ surface layers",
        copy:
          "High-density New Zealand pine particle layers are applied to both faces as a balanced construction, helping mask veneer texture and create a harder finishing surface.",
        image: "/assets/duraply-closeup-stack-2.webp",
        imageAlt: "Duraply samples showing balanced dense surface layers on both faces",
        imageCaption:
          "Both faces use the engineered surface layer so the finishing base remains balanced.",
      },
      {
        label: "Calibration",
        title: "Precision sanding",
        copy:
          "The board is sanded to control thickness across the sheet. The supplier reference is a four-corner tolerance within 0.1 mm, subject to order confirmation.",
        image: "/assets/duraply-product-edge-1.webp",
        imageAlt: "Duraply edge close-up showing calibrated faces and plywood core",
        imageCaption:
          "Measure the finished board at agreed points; the quoted tolerance must match the actual order.",
      },
      {
        label: "Finishing",
        title: "Matched to the press line",
        copy:
          "Mirror PET, UV, deep embossing and decorative paper each require the actual adhesive, temperature, pressure and surface preparation to be sample-tested.",
        image: "/assets/duraply-routed-profile.webp",
        imageAlt: "Duraply sample routed into repeated rounded channels",
        imageCaption:
          "A machined sample checks whether the surface and core remain clean through the buyer's process.",
      },
    ],
    structureSpotlight: {
      image: "/assets/duraply-structure-supplied.webp",
      imageAlt:
        "Exploded Duraply structure identifying pine super-flat layers above and below a full eucalyptus plywood core",
      eyebrow: "Duraply structure analysis",
      title: "Two surface layers. One plywood core. Different jobs.",
      intro:
        "Duraply is a hybrid panel rather than ordinary faced plywood. Its calibrated pine-particle surfaces are engineered for finishing consistency, while the cross-laminated eucalyptus core provides the plywood body, fixing base and load distribution.",
      layers: [
        {
          label: "01",
          title: "High-density pine particle surface",
          copy:
            "Fine New Zealand pine particles form a smooth, hard outer layer. The supplier reference is approximately 980 kg/m³, creating a more uniform base for PET, UV, decorative paper and deep embossing than an exposed veneer face.",
        },
        {
          label: "02",
          title: "Balanced on both faces",
          copy:
            "The particle layer is applied to both sides rather than one face only. This balanced build helps manage pressing stress, flatness and surface consistency; the two faces should still use compatible finishing systems.",
        },
        {
          label: "03",
          title: "Cross-laminated eucalyptus core",
          copy:
            "Alternating eucalyptus veneers form the main panel body. The core carries thickness, fixing and stiffness duties, while veneer moisture, lay-up balance, gaps and overlaps remain order-critical checks.",
        },
        {
          label: "04",
          title: "Calibrated and precision-sanded",
          copy:
            "After pressing, the faces are sanded to control thickness and create an even lamination base. The supplier reference is a four-corner tolerance within 0.1 mm, subject to confirmation for the actual order.",
        },
      ],
      buyerValue: [
        "Less veneer telegraphing beneath high-gloss finishes",
        "More predictable glue spread and press-line contact",
        "Sharper, more repeatable deep-embossing transfer",
        "Lower risk of surface rework caused by uneven plywood faces",
      ],
      note:
        "Supplied structure illustration. It explains layer order but is not a manufacturing-scale drawing. Confirm actual surface-layer thickness, eucalyptus lay-up, tolerance and finish trial against the approved order sample.",
    },
    variantDetails: [
      {
        name: "Mirror PET lamination base",
        positioning: "For high-gloss surfaces where small substrate defects remain visible.",
        construction:
          "The dense, calibrated faces reduce veneer telegraphing and provide a more uniform bonding surface than a conventional unsurfaced plywood face.",
        bestFor: ["Mirror PET cabinet fronts", "High-gloss wardrobes", "Repeat press-line production"],
        buyerChecks: ["Surface sanding quality", "Adhesive compatibility", "Press-line trial", "Protective-film handling"],
      },
      {
        name: "Deep-embossing base",
        positioning: "For pressed textures that demand a hard, consistent face.",
        construction:
          "The high-density surface layers support sharper pattern transfer while the plywood body provides a robust panel core.",
        bestFor: ["Embossed furniture panels", "Decorative door fronts", "Textured wall panels"],
        buyerChecks: ["Embossing depth", "Surface density", "Press temperature and pressure", "Pattern repeatability"],
      },
      {
        name: "UV and coated-panel base",
        positioning: "For smooth coated surfaces and controlled industrial finishing.",
        construction:
          "Calibrated faces provide a predictable base for primer, coating or UV-curing systems after the required sanding and surface preparation.",
        bestFor: ["UV-coated panels", "Painted components", "Decorative interior panels"],
        buyerChecks: ["Coating adhesion trial", "Surface moisture", "Sanding sequence", "Finished tolerance"],
      },
      {
        name: "Decorative-paper base",
        positioning: "For furniture panels requiring plywood performance beneath a uniform decorative face.",
        construction:
          "Balanced dense faces provide a consistent paper-lamination base on both sides, reducing visual variation and helping panel flatness.",
        bestFor: ["Cabinet carcasses", "Full-height doors", "Contract furniture"],
        buyerChecks: ["Two-side balance", "Paper and resin system", "Finished thickness", "Edge treatment"],
      },
    ],
    applications: [
      "Cabinet and full-height door panels",
      "PET and decorative-paper lamination",
      "Furniture production",
      "Flooring substrates",
      "Schools, hospitals and nurseries",
    ],
    buyerChecklist: [
      "Finished surface route: PET, UV, embossing, paint or decorative paper",
      "Target finished thickness and four-corner tolerance",
      "Plywood core lay-up, veneer quality and permitted core gaps",
      "Surface-layer density and sanding quality",
      "Emission class and current order-matching report",
      "Trial on the buyer's actual adhesive and press-line settings",
      "Golden sample and batch inspection criteria",
    ],
    gallery: [
      {
        src: "/assets/duraply-structure-clean.webp",
        alt: "Assembled Duraply slab showing balanced dense particle faces and eucalyptus plywood core",
        caption: "Assembled construction reference: thin balanced finishing faces surround the load-carrying eucalyptus plywood core.",
      },
      {
        src: "/assets/duraply-stacked-sample.webp",
        alt: "Compact stack of Duraply samples on a neutral background",
        caption: "Sample-stack reference for thickness, flatness and two-face balance.",
      },
    ],
    galleryLayout: "grid",
    galleryEyebrow: "Corrected Duraply material set",
    galleryTitle: "See the hybrid construction from diagram to machined sample.",
    galleryIntro:
      "These two supplementary views complete the assembled-structure and sample-stack checks. Core, face, calibration and machining images now sit beside the points they explain.",
    note:
      "Surface finish, adhesive system, emission class and tolerance must be confirmed against the exact production source and order specification.",
  },
  {
    slug: "functional-plywood",
    name: "Functional Plywood",
    category: "Performance plywood",
    short:
      "An integrated performance plywood combining moisture resistance, fire-retardant performance and termite resistance in the same panel.",
    description:
      "Functional Plywood uses a coordinated veneer lay-up, adhesive system and functional treatment so the same ordered panel provides moisture-resistant, fire-retardant and termite-resistant performance together. It is also designed around low-emission and anti-deformation requirements, with relevant test certificates available for buyer review.",
    procurementFocus:
      "These are not three optional upgrades: moisture resistance, fire-retardant performance and termite resistance are integrated into the same Functional Plywood product. Buyers should still confirm the exact classifications, test standards, thickness and production scope covered by the supplied certificates.",
    hero: "/assets/functional-supplied-finished.webp",
    detailImage: "/assets/functional-overview-infographic.webp",
    detailCaption:
      "Integrated-performance overview. Relevant test certificates can be provided; exact classifications and coverage follow the current reports for the ordered thickness, finish and production source.",
    specs: [
      { label: "MOR supplier reference", value: "> 30 MPa" },
      { label: "Density reference", value: "580–600 kg/m³" },
      { label: "Moisture reference", value: "6–8%" },
      { label: "Common formats", value: "4 × 8 ft / 4 × 9 ft" },
      { label: "Grade references", value: "E0, CARB P2" },
    ],
    features: [
      "Integrated moisture-resistant performance",
      "Integrated fire-retardant performance",
      "Integrated termite-resistant treatment",
      "Low-emission construction",
      "Balanced lay-up for improved dimensional stability",
    ],
    constructionTitle: "Five functions engineered into one panel.",
    constructionIntro:
      "Moisture, fire-retardant and termite-resistant performance are built into the same Functional Plywood product rather than selected as separate options. Veneer lay-up, adhesive, treatment and process control must therefore work as one verified system.",
    construction: [
      {
        label: "01",
        title: "Integrated performance brief",
        copy:
          "The same ordered panel is designed to address humidity, improved reaction-to-fire requirements and termite exposure together, while supporting low-emission and anti-deformation targets.",
        image: "/assets/functional-performance-configurations.webp",
        imageAlt:
          "Functional plywood visual showing integrated moisture, fire and termite performance",
        imageCaption:
          "Moisture resistance, fire-retardant performance and termite resistance are integrated in the same product; exact classifications follow the matching certificates.",
      },
      {
        label: "02",
        title: "Coordinate the construction",
        copy:
          "Balanced veneer lay-up, the adhesive system and functional treatment are coordinated as one construction. Controlled veneer moisture and two-face balance also support dimensional stability.",
        image: "/assets/functional-supplied-stack.webp",
        imageAlt: "Stacked Functional Plywood panels showing repeated veneer lay-up",
        imageCaption:
          "A production stack helps compare lay-up, edge condition and batch consistency.",
      },
      {
        label: "03",
        title: "Match the certificates",
        copy:
          "Relevant test certificates can be supplied for buyer review. Their standards, classifications and scope should match the production source, panel thickness and finish supplied to the project.",
        image: "/assets/functional-product.webp",
        imageAlt: "Finished plywood panels shown in an interior-use setting",
        imageCaption:
          "Evidence should match the finished construction—not only the untreated core panel.",
      },
      {
        label: "04",
        title: "Control the order",
        copy:
          "Approved samples, batch records, production checks and packing conditions reduce the gap between the tested panel and the delivered panel.",
        image: "/assets/functional-supplied-machined.webp",
        imageAlt: "Machined Functional Plywood components showing repeated rounded edges",
        imageCaption:
          "Machined samples expose internal gaps, edge integrity and repeatability before production release.",
      },
    ],
    variantEyebrow: "Integrated performance profile",
    variantTitle: "Five functions in one verified panel.",
    variantIntro:
      "The functions below form one product profile, not five separate grades. Moisture, fire-retardant and termite-resistant performance are supplied together; certificate classifications remain report-specific.",
    variantDetails: [
      {
        name: "Low-emission performance",
        positioning: "Part of the integrated panel profile for furniture and interior applications.",
        construction:
          "The resin system, veneer moisture and pressing process are controlled to support the stated emission requirement while maintaining the combined functional performance.",
        bestFor: ["Schools and nurseries", "Healthcare interiors", "Residential cabinetry"],
        buyerChecks: ["Named test method", "Exact emission class", "Current source-matching report", "Finished-panel components"],
      },
      {
        name: "Anti-deformation performance",
        positioning: "Supports tall doors, wardrobes and components where bow and twist create installation claims.",
        construction:
          "Balanced veneer lay-up, controlled veneer moisture, symmetric surface treatment and calibrated pressing work together to improve dimensional stability.",
        bestFor: ["4 × 9 ft full-height doors", "Wardrobe panels", "Long furniture components"],
        buyerChecks: ["Panel orientation", "Initial flatness tolerance", "Moisture at packing", "Two-side finishing balance"],
      },
      {
        name: "Moisture-resistant performance",
        positioning: "Integrated into the same panel for humid interiors and occasional moisture exposure.",
        construction:
          "The coordinated bond system and controlled veneer quality improve moisture resistance while retaining the panel's fire-retardant and termite-resistant functions. Faces and edges still require suitable finishing and sealing.",
        bestFor: ["Humid-area cabinetry", "Hotel and dormitory fit-out", "Kitchen and utility furniture"],
        buyerChecks: ["Bond class or test method", "Thickness swelling", "Edge sealing", "Actual exposure conditions"],
      },
      {
        name: "Termite-resistant performance",
        positioning: "Integrated into the same panel for markets where termite damage is a documented risk.",
        construction:
          "The termite-resistant treatment is incorporated into the Functional Plywood system alongside its moisture-resistant and fire-retardant performance.",
        bestFor: ["Warm-climate furniture", "Dormitories and accommodation", "Long-life interior joinery"],
        buyerChecks: ["Treatment chemistry", "Retention or dose", "Test report", "Destination-market restrictions"],
      },
      {
        name: "Fire-retardant performance",
        positioning: "Integrated into the same panel for projects requiring improved reaction-to-fire performance.",
        construction:
          "Fire-retardant treatment forms part of the same Functional Plywood construction and is verified together with the relevant thickness and finish system.",
        bestFor: ["Hotels", "Hospitals", "Dormitories and public interiors"],
        buyerChecks: ["Required standard and classification", "Exact thickness and finish", "Report validity", "Assembly-level requirements"],
      },
    ],
    applications: [
      "4 × 9 ft full-height doors",
      "Cabinet and wardrobe panels",
      "Humid-area interiors",
      "Hotels, hospitals and dormitories",
      "Commercial projects with defined test criteria",
    ],
    referenceTitle: "Five integrated functions",
    referenceItems: [
      "Low emissions",
      "Anti-deformation performance",
      "Moisture resistance",
      "Termite resistance",
      "Fire-retardant performance",
    ],
    buyerChecklist: [
      "The required service environment and finished application",
      "Panel size, thickness, load, fixing pattern and finished construction",
      "Required moisture, termite and fire standards and classifications",
      "Certificate set matching the exact source, thickness and surface system",
      "Initial flatness, moisture and dimensional tolerances",
      "Approved sample and order-specific inspection plan",
      "Claims evidence and replacement route agreed before shipment",
    ],
    note:
      "Moisture resistance, fire-retardant performance and termite resistance are integrated in this product, and relevant test certificates can be provided. Exact classifications and coverage follow the current reports; moisture-resistant does not mean waterproof, and fire-retardant does not mean fireproof.",
  },
  {
    slug: "mdf",
    name: "MDF",
    fullName: "Medium & High-Density Fibreboard",
    category: "Fibre panels",
    short:
      "A uniform fibre core for clean machining, painting, routing and decorative lamination.",
    description:
      "Refined wood fibres are blended with resin, formed into a mat, hot-pressed and precision-sanded into a smooth panel. The correct grade depends on machining depth, component thickness, humidity, fire requirement, surface finish and the evidence demanded by the project.",
    procurementFocus:
      "MDF should not be bought as one generic board. Medium-density, high-density, moisture-resistant and fire-retardant grades solve different problems; substituting one for another can create weak routed edges, swelling, coating defects or failed project compliance.",
    hero: "/assets/mdf-hero.webp",
    detailImage: "/assets/mdf-structure-diagram.webp",
    specs: [
      { label: "Thickness", value: "2.5–30 mm" },
      { label: "Density reference", value: "660–810 kg/m³" },
      { label: "Moisture reference", value: "6–8%" },
      { label: "Common formats", value: "1220 × 2440 / 2745 / 3050 mm" },
      { label: "Regular thicknesses", value: "8 / 9 / 12 / 15 / 18 / 19 / 25 mm" },
    ],
    variants: [
      "Medium-Density MDF",
      "High-Density MDF",
      "Moisture-Resistant MDF",
      "Fire-Retardant MDF",
    ],
    features: [
      "Smooth, uniform surface",
      "Clean routing and carving",
      "Consistent painting and lamination base",
      "Density and performance options by application",
    ],
    constructionTitle: "One fibreboard process, four purchasing decisions.",
    constructionIntro:
      "Fibre refining, resin selection, mat forming, press control and sanding create the density profile and surface quality. Specialty performance comes from a deliberately changed formulation—not simply a different board colour.",
    construction: [
      {
        label: "01",
        title: "Fibre preparation",
        copy:
          "Wood is refined into consistent fibres. Fibre quality and contamination control affect surface smoothness, machining and finished-panel appearance.",
      },
      {
        label: "02",
        title: "Resin and additives",
        copy:
          "The binder system is selected for standard, moisture-resistant or fire-retardant duty. Emission and specialty performance must be documented for the exact recipe.",
      },
      {
        label: "03",
        title: "Mat forming and hot pressing",
        copy:
          "The fibre mat is pressed under controlled heat and pressure. The resulting density profile influences edge strength, routing quality and panel weight.",
      },
      {
        label: "04",
        title: "Conditioning and sanding",
        copy:
          "Panels are conditioned and sanded to the target thickness and surface quality before painting, veneering, paper lamination or CNC machining.",
      },
    ],
    variantDetails: [
      {
        name: "Medium-Density MDF",
        positioning: "The balanced option for general interior furniture and repeat machining.",
        construction:
          "A controlled fibre and resin system provides a uniform core, smooth faces and predictable edges without the additional weight or specialty additives of other grades.",
        image: "/assets/mdf-grade-medium.webp",
        imageAlt:
          "Natural light-beige medium-density MDF slab with a uniform fine-fibre cut edge",
        bestFor: ["Cabinet carcasses", "Painted furniture", "Wardrobes and shelving", "Interior mouldings"],
        buyerChecks: ["Average and profile density", "Thickness tolerance", "Internal bond", "Emission class", "Paint or laminate trial"],
      },
      {
        name: "High-Density MDF",
        positioning: "For thinner, harder-wearing or deeply machined components requiring a denser edge.",
        construction:
          "A higher target density and controlled press profile improve compactness and edge definition. Routable HDF can be selected when deep CNC patterns or crisp moulded details are required.",
        image: "/assets/mdf-grade-high.webp",
        imageAlt:
          "Warm-tan high-density MDF slab with a tightly compacted fine-fibre edge",
        bestFor: ["CNC-routed fronts", "Deep-carved panels", "Thin furniture components", "High-use door and display parts"],
        buyerChecks: ["Density profile, not only average density", "Routing depth and tool trial", "Edge finish", "Panel weight", "Finished-component strength"],
      },
      {
        name: "Moisture-Resistant MDF",
        positioning: "For humid interior conditions and components exposed to occasional moisture.",
        construction:
          "The resin system is upgraded or replaced to improve resistance to humidity and thickness swelling. Green colour is a common identifier, but it is not proof of performance.",
        image: "/assets/mdf-grade-moisture-resistant.webp",
        imageAlt:
          "Green moisture-resistant MDF slab with colour extending through its fine-fibre core",
        bestFor: ["Kitchen and utility cabinetry", "Bathroom furniture outside direct wet zones", "Humid-climate interiors", "Pre-installation building conditions"],
        buyerChecks: ["Required MR standard", "Thickness-swelling result", "Edge sealing", "Surface finish", "Confirmation that the use is interior—not submerged or permanently wet"],
      },
      {
        name: "Fire-Retardant MDF",
        positioning: "For contract interiors that specify improved reaction-to-fire performance.",
        construction:
          "Fire-retardant additives are integrated into the fibre and resin system. The valid performance depends on the exact thickness, density, finish and tested assembly.",
        image: "/assets/mdf-grade-fire-retardant.webp",
        imageAlt:
          "Orange-red fire-retardant MDF slab with colour extending through its fine-fibre core",
        bestFor: ["Hotels and public interiors", "Healthcare and education fit-out", "Wall and display systems", "Specified contract furniture"],
        buyerChecks: ["Named standard and required classification", "Report matching thickness and finish", "Validity and production source", "Edge and fixing details", "Fire-retardant—not fireproof"],
      },
    ],
    applications: [
      "Furniture and cabinet production",
      "Routed and painted fronts",
      "Wardrobes and interior fit-out",
      "Door panels and mouldings",
      "Commercial wall and display panels",
    ],
    buyerChecklist: [
      "Exact MDF grade and intended finished component",
      "Density profile, internal bond and routing requirement",
      "Thickness, tolerance, sheet size and sanding quality",
      "Emission class and destination-market test method",
      "Moisture or fire report matching the exact construction",
      "Paint, veneer, paper or laminate trial on the supplied face",
      "Packing moisture protection and batch identification",
    ],
    note:
      "Confirm density profile, emission class, moisture or fire requirement, surface quality and thickness tolerance before quotation.",
  },
  {
    slug: "particle-board",
    name: "Particle Board",
    category: "Furniture-base panels",
    short:
      "A cost-efficient, uniformly thick core for laminated furniture components and repeat production.",
    description:
      "Controlled wood particles are bonded under heat and pressure into a flat panel. Particle Board is optimized for stable furniture components, decorative laminates and high-volume manufacturing.",
    hero: "/assets/particle-hero.webp",
    detailImage: "/assets/particle-cutaway-clean.webp",
    specs: [
      { label: "Thickness", value: "9–25 mm" },
      { label: "Density reference", value: "600–750 kg/m³" },
      { label: "Moisture reference", value: "6–8%" },
      { label: "Common formats", value: "1220 × 2440 / 2745 / 3050 mm" },
      { label: "Grade references", value: "E0, CARB P2, ENF" },
    ],
    features: [
      "Flat, consistent furniture core",
      "Efficient for high-volume production",
      "Suitable for melamine and decorative laminates",
      "Configurable density and moisture grades",
    ],
    applications: [
      "Flat-pack furniture",
      "Cabinet carcasses",
      "Wardrobes",
      "Supported shelving",
      "Decorative laminated panels",
    ],
    buyerChecklist: [
      "Average and surface density for the finished component",
      "Edge density and screw-holding requirement",
      "Thickness tolerance and sheet flatness",
      "Emission and moisture grade",
      "Melamine, veneer or laminate pressing trial",
      "Support span and edge-banding route",
    ],
    note:
      "Confirm surface density, edge density, screw holding, emission class, moisture grade, thickness tolerance and intended lamination.",
  },
  {
    slug: "fosb",
    name: "FOSB",
    fullName: "Fine Surface Oriented Strand Board",
    category: "Strand panels",
    short:
      "Directional strand strength with smoother outer layers for furniture and finish-ready applications.",
    description:
      "FOSB combines directional strand layers in the core with finer, smoother face layers. The construction targets fixing strength and furniture performance while providing a more suitable base for decorative finishing than conventional rough-surface OSB.",
    hero: "/assets/fosb-hero.webp",
    detailImage: "/assets/fosb-hero.webp",
    specs: [
      { label: "Thickness reference", value: "9–25 mm" },
      { label: "Density reference", value: "600–750 kg/m³" },
      { label: "Moisture reference", value: "6–8%" },
      { label: "Common formats", value: "1220 × 2440 / 2745 / 3050 mm" },
      { label: "Grade references", value: "E0, CARB P2, ENF" },
    ],
    features: [
      "Directional strand core",
      "Strong fixing and screw-holding performance",
      "Smoother, finish-ready face",
      "Suitable for PET, veneer, UV and other laminations",
    ],
    applications: [
      "Cabinet carcasses and shelving",
      "Furniture frames and wardrobes",
      "Decorative laminated panels",
      "Integrated seating and work surfaces",
      "Interior wall applications",
    ],
    buyerChecklist: [
      "Exact FOSB construction and intended structural or furniture duty",
      "Face smoothness and finishing route",
      "Density, internal bond and screw-holding requirement",
      "Moisture and emission class",
      "Thickness tolerance, edge quality and approved laminate sample",
    ],
    note:
      "Specify the required construction, surface quality, structural duty, adhesive, emission class and finishing route.",
  },
  {
    slug: "wpc-products",
    name: "WPC Products",
    fullName: "Wood-Plastic Composite Systems",
    category: "Outdoor composite products",
    short:
      "Outdoor decking, wall, fence and profile systems combining wood fibres with recycled plastic.",
    description:
      "WPC profiles combine wood fibre, thermoplastic and performance additives in an extruded system. The purchase decision is not only colour and price: profile geometry, wall thickness, cap construction, span, expansion, substructure and accessory completeness determine how the installed project performs.",
    procurementFocus:
      "A WPC order fails when the visible board is purchased without the system around it. Boreviax coordinates the profile, matching batch colour, joists, clips, fasteners, pedestals, installation data and replacement plan so the buyer receives a buildable package rather than loose lengths.",
    hero: "/assets/wpc-hero.webp",
    detailImage: "/assets/wpc-products.webp",
    specs: [
      { label: "Product forms", value: "Hollow, round-hole and solid profiles" },
      { label: "Surface options", value: "Wood grain, brushed, embossed and sanded" },
      { label: "Colour options", value: "Project-specific palette" },
      { label: "Dimensions", value: "Profile-dependent; custom options available" },
    ],
    variants: [
      "Traditional Decking",
      "Co-Extrusion Decking",
      "DIY Decking Tiles",
      "Outdoor Wall Panels",
      "Square Tubes",
      "WPC Fences",
      "Clips, joists and pedestals",
    ],
    features: [
      "Designed for exterior applications",
      "Traditional and capped co-extrusion options",
      "Coordinated profiles and accessories",
      "Multiple colours and surface treatments",
    ],
    constructionTitle: "The profile and installation system are one product.",
    constructionIntro:
      "Material formulation is only the beginning. Geometry, cap coverage, extrusion consistency, cooling, surface treatment and installation allowances all affect dimensional stability and service performance.",
    construction: [
      {
        label: "Mix",
        title: "Controlled raw-material blend",
        copy:
          "Wood fibre, thermoplastic and additives are blended for process stability, colour and outdoor performance. The exact formulation is source- and grade-specific.",
        image: "/assets/wpc-profile-2.webp",
        imageAlt: "WPC decking profiles displayed in several project colours",
        imageCaption:
          "Colour approval must stay tied to the exact formulation, grade and production lot.",
      },
      {
        label: "Form",
        title: "Profile extrusion",
        copy:
          "The blend is extruded through a profile die. Hollow chambers, round holes or solid sections balance weight, stiffness, span and cost.",
        image: "/assets/wpc-profile-4.webp",
        imageAlt: "WPC decking profiles showing hollow chamber geometry",
        imageCaption:
          "Section views expose chamber layout, wall thickness and usable face before approval.",
      },
      {
        label: "Finish",
        title: "Surface and cap system",
        copy:
          "Traditional profiles may be brushed, sanded or embossed; co-extrusion grades add a protective cap layer whose coverage and adhesion must be controlled.",
        image: "/assets/wpc-profile-5.webp",
        imageAlt: "Close view of grey wood-grain WPC decking surfaces and profile ends",
        imageCaption:
          "Review surface embossing, cap coverage and core geometry as one quoted profile.",
      },
      {
        label: "Install",
        title: "Matched accessories and gaps",
        copy:
          "Joist spacing, clips, fasteners, ventilation, drainage and expansion gaps follow the exact profile and local project conditions—not a universal WPC rule.",
        image: "/assets/wpc-profile-1.webp",
        imageAlt: "Stacked hollow WPC decking boards ready for system selection",
        imageCaption:
          "Profile approval is incomplete until the matching joists, clips, fasteners and movement gaps are defined.",
      },
    ],
    variantDetails: [
      {
        name: "Traditional WPC Decking",
        positioning: "A practical value option for terraces, walkways and landscape projects.",
        construction:
          "The wood-plastic blend forms the complete profile and receives a brushed, sanded or embossed surface. Hollow, round-hole and solid options balance span, weight and budget.",
        bestFor: ["Residential terraces", "Garden paths", "Balconies", "General landscape decking"],
        buyerChecks: ["Profile wall thickness", "Unit weight or density", "Span table", "Water absorption and dimensional change", "Colour-lot control"],
      },
      {
        name: "Co-Extrusion Decking",
        positioning: "For projects prioritising stain resistance, colour retention and a more protected surface.",
        construction:
          "A protective cap is co-extruded around the WPC core. Full or partial cap coverage, cap thickness and core-to-cap adhesion must match the quoted grade.",
        bestFor: ["Pool surrounds", "Hospitality terraces", "High-use outdoor areas", "Premium residential projects"],
        buyerChecks: ["Cap coverage and thickness", "Cap adhesion", "Slip and weathering evidence", "Colour consistency", "Approved surface sample"],
      },
      {
        name: "DIY Decking Tiles",
        positioning: "A modular option for smaller retrofit areas and removable floor finishes.",
        construction:
          "Short WPC slats are fixed to an interlocking base that creates repeat modules. The base, lock and drainage path are as important as the visible slat.",
        bestFor: ["Balconies", "Rooftop leisure areas", "Small patios", "Temporary or replaceable zones"],
        buyerChecks: ["Module size", "Lock compatibility", "Base material", "Drainage clearance", "Perimeter and cut-piece plan"],
      },
      {
        name: "Outdoor Wall Panels",
        positioning: "For ventilated decorative cladding and architectural exterior surfaces.",
        construction:
          "Extruded wall profiles are installed over a compatible subframe with controlled fixing points, ventilation and movement allowances.",
        bestFor: ["Exterior feature walls", "Hospitality facades", "Garden buildings", "Screened service areas"],
        buyerChecks: ["Profile orientation", "Subframe material", "Wind and fixing design", "Drainage and ventilation", "Required fire evidence"],
      },
      {
        name: "WPC Square Tubes",
        positioning: "For decorative battens, screens and landscape features.",
        construction:
          "Hollow square or rectangular profiles create a timber-like linear element. They are decorative unless the project separately engineers internal reinforcement and support.",
        bestFor: ["Privacy screens", "Pergola features", "Facade battens", "Landscape partitions"],
        buyerChecks: ["Profile size and wall thickness", "Support span", "Internal reinforcement", "Wind exposure", "End caps and fixing method"],
      },
      {
        name: "WPC Fence Systems",
        positioning: "A coordinated board, post, rail and cap system for outdoor boundaries and screens.",
        construction:
          "Fence boards work with matched posts, rails, brackets and caps. Gate areas and high-wind zones require separate structural consideration.",
        bestFor: ["Garden boundaries", "Hospitality screens", "Residential privacy", "Landscape enclosures"],
        buyerChecks: ["Complete bill of materials", "Post centres", "Wind load", "Gate hardware", "Spare-board and colour-lot plan"],
      },
      {
        name: "Joists, Clips & Pedestals",
        positioning: "The hidden components that make the visible WPC system installable.",
        construction:
          "Joists create the support grid; clips control board fixing and gaps; pedestals set finished level and drainage where required.",
        bestFor: ["Complete decking packages", "Raised terraces", "Commercial installation kits", "Replacement and maintenance stock"],
        buyerChecks: ["Profile-specific spacing", "Fastener material", "Corrosion environment", "Expansion detail", "Accessory quantity with installation allowance"],
      },
    ],
    applications: [
      "Terraces and pool surrounds",
      "Balconies and walkways",
      "Outdoor wall cladding",
      "Garden fences and screens",
      "Landscape and hospitality projects",
    ],
    buyerChecklist: [
      "Traditional or co-extrusion grade and exact cap construction",
      "Profile drawing, wall thickness, unit weight and usable face",
      "Project load, support span and installation orientation",
      "Colour, surface treatment and approved lot sample",
      "Substructure, clips, fasteners, pedestals and complete bill of materials",
      "Expansion, drainage and ventilation requirements for the project climate",
      "Packing length, container loading plan and replacement-stock strategy",
    ],
    gallery: [
      {
        src: "/assets/wpc-profile-3.webp",
        alt: "Fan display of round-hole WPC decking boards",
        caption: "Round-hole profiles balance weight and stiffness; span data remains profile-specific.",
      },
      {
        src: "/assets/wpc-profile-6.webp",
        alt: "Dark grey WPC decking profile on a white background",
        caption: "A clean reference profile for colour, surface and edge-detail approval.",
      },
    ],
    galleryLayout: "grid",
    galleryEyebrow: "Profile evidence",
    galleryTitle: "Inspect geometry before approving colour.",
    galleryIntro:
      "These two supplementary profiles complete the geometry check. Formulation, extrusion, surface and installation images now sit beside the technical points they explain.",
    note:
      "Profile, span, substructure, colour, surface treatment and installation system must be selected together for a comparable quotation.",
  },
  {
    slug: "acoustic-panels",
    name: "Acoustic Panels",
    fullName: "Wooden Slat Acoustic Panels",
    category: "Interior acoustic surfaces",
    short:
      "Decorative wooden slats over PET felt for wall and ceiling applications requiring improved sound absorption.",
    description:
      "Wooden slat acoustic panels combine finished MDF slats with PET acoustic felt. Slat width, spacing, felt density, mounting method and any rear air gap form one tested build; the visible finish alone does not determine acoustic or fire performance.",
    procurementFocus:
      "For contract projects, Boreviax aligns the decorative sample with the exact acoustic build, fire evidence, panel dimensions and installation method so the approved appearance does not arrive with the wrong technical construction.",
    hero: "/assets/acoustic-hero.webp",
    detailImage: "/assets/acoustic-product.webp",
    specs: [
      { label: "Material", value: "MDF slats and PET fibre felt" },
      { label: "Length reference", value: "2440 / 2900 mm" },
      { label: "Width reference", value: "605 mm or customized" },
      { label: "Thickness reference", value: "21 mm or customized" },
      { label: "NRC supplier reference", value: "0.8" },
      { label: "Installation", value: "Screws or mounting adhesive" },
    ],
    variants: [
      "Natural wood veneer",
      "PVC finish",
      "Finish foil paper",
      "Custom slat spacing and patterns",
    ],
    features: [
      "Decorative linear appearance",
      "PET acoustic felt backing",
      "Wall and ceiling installation",
      "Finish and pattern customization",
    ],
    applications: [
      "Offices and meeting rooms",
      "Restaurants and hotels",
      "Residential living spaces",
      "Media and entertainment rooms",
      "Feature walls and ceilings",
    ],
    buyerChecklist: [
      "Exact slat width, spacing, core and decorative finish",
      "PET felt thickness, density and colour",
      "NRC or absorption evidence for the tested installation build",
      "Fire report matching the slat, felt, finish and panel thickness",
      "Wall or ceiling substrate, air gap and fixing method",
      "Panel-joint layout, edge finish and order-matching colour sample",
    ],
    note:
      "Acoustic and fire references depend on the exact panel build. Request current EN 13501-1, ASTM E84 or acoustic evidence when the project specifies a rating.",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
