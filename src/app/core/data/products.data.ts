import { CategoryInfo, FeaturedProduct, Product } from '../models/product.model';

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'dormitorio',
    title: 'DORMITORIO',
    breadcrumb: 'Categorías > Dormitorio > Colección Mystery & Craft',
    lookbookImage: '/assets/eldormitorio.png',
  },
  {
    slug: 'salon',
    title: 'SALON',
    breadcrumb: 'Categorías > Salón > Colección Mystery & Craft',
    lookbookImage: '/assets/elsalon.png',
  },
  {
    slug: 'estudio',
    title: 'ESTUDIO',
    breadcrumb: 'Categorías > Estudio > Colección Mystery & Craft',
    lookbookImage: '/assets/elestudio.png',
  },
  {
    slug: 'rincon',
    title: 'RINCON',
    breadcrumb: 'Categorías > Rincon > Colección Mystery & Craft',
    lookbookImage: '/assets/elrincon.png',
  },
];

export const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    nombre: 'LÁMPARA DE GEODA Y AMATISTA CRISTALINA',
    precio: '$39.990',
    imagen: '/assets/lampara de geoda.png',
    categorySlug: 'dormitorio',
  },
  {
    nombre: 'VELAS AROMÁTICAS DE SCULK',
    precio: '$19.990',
    imagen: '/assets/velas.png',
    categorySlug: 'rincon',
  },
  {
    nombre: 'RELOJ INTEGRADO CON SCULK',
    precio: '$28.990',
    imagen: '/assets/catalizador de tiempo integrado con sculk.png',
    categorySlug: 'salon',
  },
  {
    nombre: 'TEXTIL COLGANTE DE CABEZA DEL WARDEN',
    precio: '$59.990',
    imagen: '/assets/textil de Cuerno del warden.png',
    categorySlug: 'estudio',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'dorm-1',
    nombre: 'ALFOMBRA "VENAS DE SCULK”',
    categoria: 'Dormitorio',
    categoriaSlug: 'dormitorio',
    descripcion:
      'Alfombra de diseño orgánico y místico inspirada en el ecosistema del Warden, con textura en diferentes niveles y flecos artesanales en los extremos laterales.',
    oldPrice: '$99.990',
    precio: '$69.990',
    imagen: '/assets/alfombradormitorio.png',
    stock: 10,
  },
  {
    id: 'dorm-2',
    nombre: 'LÁMPARA DE GEODA Y AMATISTA CRISTALINA',
    categoria: 'Dormitorio',
    categoriaSlug: 'dormitorio',
    descripcion:
      'Lámpara decorativa con cristales luminosos en tonos azules y morados con una base oscura inspirada en la corteza de Pizarra profunda.',
    precio: '$39.990',
    imagen: '/assets/lampara de geoda.png',
    stock: 12,
  },
  {
    id: 'dorm-3',
    nombre: 'CAMA "RESGUARDO DEL WARDEN"',
    categoria: 'Dormitorio',
    categoriaSlug: 'dormitorio',
    descripcion:
      'Cama matrimonial con una estructura Monolítica de pizarra y venas de Sculk Bioluminiscentes incrustadas.Incluye cobertor de terciopelo esmeralda y sábanas negras.',
    oldPrice: '$3.799.990',
    precio: '$3.299.990',
    imagen: '/assets/camadormitorio.png',
    stock: 3,
  },
  {
    id: 'dorm-4',
    nombre: 'CORTINAS "VELO DEL ABISMO"',
    categoria: 'Dormitorio',
    categoriaSlug: 'dormitorio',
    descripcion:
      'Cortinas de diseño conceptual que simulan la vegetación de la DEEP DARK,contiene un bordado tridimencional de Sculk, detalles de minerales suspendidos y una tela Blackout de alta densidad.',
    precio: '$229.990',
    imagen: '/assets/cortinasdormitorio.png',
    stock: 7,
  },
  {
    id: 'salon-1',
    nombre: 'MESA “ECO DE SCULK”',
    categoria: 'Salon',
    categoriaSlug: 'salon',
    descripcion:
      'Esta innovadora mesa de centro, de diseño conceptual y geométrico, contiene bloques de piedra oscura, geometría en niveles, superficie de cristal e iluminación en tonos turquesa.',
    oldPrice: '$899.990',
    precio: '$799.990',
    imagen: '/assets/mesabajasalon.png',
    stock: 5,
  },
  {
    id: 'salon-2',
    nombre: 'SILLÓN “ABISMO VELVET”',
    categoria: 'Salon',
    categoriaSlug: 'salon',
    descripcion:
      'Sillón esmeralda con estética maximalista y lujosa, con una silueta cúbica, tapiz de terciopelo y un acolchado capitoné.',
    precio: '$369.990',
    imagen: '/assets/sillonsalon.png',
    stock: 8,
  },
  {
    id: 'salon-3',
    nombre: 'RELOJ INTEGRADO CON SCULK',
    categoria: 'Salon',
    categoriaSlug: 'salon',
    descripcion:
      'Reloj de pared con diseño minimalista, una “infección” de sculk asimétrica, efecto de eclipse y retroiluminación cian.',
    oldPrice: '$28.990',
    precio: '$18.990',
    imagen: '/assets/catalizador de tiempo integrado con sculk.png',
    stock: 8,
  },
  {
    id: 'salon-4',
    nombre: 'MESA “PEDESTAL DE LA CIUDAD ANTIGUA”',
    categoria: 'Salon',
    categoriaSlug: 'salon',
    descripcion:
      'Mesa alta de cóctel con una silueta monolítica y esbelta, textura de pizarra profunda y diseño de pilares huecos.',
    precio: '$89.999',
    imagen: '/assets/mesaaltasalon.png',
    stock: 9,
  },
  {
    id: 'est-1',
    nombre: 'PANELES ACÚSTICOS DE SENSOR DE SCULK',
    categoria: 'Estudio',
    categoriaSlug: 'estudio',
    descripcion:
      'Paneles decoractivos tipo cuadros,diseñados con una matriz simétrica una textura de pizarra profunda pulida y patrones en bajo relieve.',
    oldPrice: '$229.990',
    precio: '$199.990',
    imagen: '/assets/panelesestudio.png',
    stock: 11,
  },
  {
    id: 'est-2',
    nombre: 'TEXTIL COLGANTE DE LA CABEZA DEL WARDEN',
    categoria: 'Estudio',
    categoriaSlug: 'estudio',
    descripcion:
      'Este tapiz textil colgante es una pieza rústica y artesanal de nuestra colección DEEP DARK,tejido en telar y con Macramé.Diseñada especialmente para decorar la pared de tu estudio.',
    precio: '$59.990',
    imagen: '/assets/textil de Cuerno del warden.png',
    stock: 6,
  },
  {
    id: 'est-3',
    nombre: 'SILLA "TRONO DEL ARCHIVERO ANCESTRAL"',
    categoria: 'Estudio',
    categoriaSlug: 'estudio',
    descripcion:
      'Silla presidencial de escritorio que fusiona la sostificación de una biblioteca clásica con la atmósfera profunda y ejecutiva del universo del Warden.Contiene una base de madera de roble y un acolchado Capitoné profundo.',
    oldPrice: '$289.990',
    precio: '$229.990',
    imagen: '/assets/sillaestudio.png',
    stock: 5,
  },
  {
    id: 'est-4',
    nombre: 'ESCRITORIO "RAÍZ ANCENTRAL"',
    categoria: 'Estudio',
    categoriaSlug: 'estudio',
    descripcion:
      'Escritorio ejecutivo con un diseño de doble pedestal Monolítico.Su madera es de Raíz de roble Vateada diseñado para ser una superficie de trabajo espaciosa.',
    precio: '$1.859.990',
    imagen: '/assets/escritorioestudio.png',
    stock: 4,
  },
  {
    id: 'rin-1',
    nombre: 'JARRÓN "RELIQUIA DE LA CIUDAD ANTIGUA”',
    categoria: 'Rincon',
    categoriaSlug: 'rincon',
    descripcion:
      'Jarrón ornamental de diseño arqueológico con corrisión por Sculk Bioliminiscente y crecimiento de Amatista. Contiene iluminación cian y musgo sintético.',
    oldPrice: '$89.990',
    precio: '$79.990',
    imagen: '/assets/jarronrincon.png',
    stock: 10,
  },
  {
    id: 'rin-2',
    nombre: 'VELAS AROMÁTICAS DE SCULK',
    categoria: 'Rincon',
    categoriaSlug: 'rincon',
    descripcion:
      'Set de velas aromáticas con olor BLUEBERRY y notas de eucalipto frío.El cuerpo de las velas tienen un acabado rugoso,poroso y de color gris oscuro mate.',
    precio: '$19.990',
    imagen: '/assets/velas.png',
    stock: 24,
  },
  {
    id: 'rin-3',
    nombre: 'LÁMPARARA "SENSORES DEL GUARDIÁN"',
    categoria: 'Rincon',
    categoriaSlug: 'rincon',
    descripcion:
      'Lámpara de rincón estilo Tótem.Contiene un ojo central de Sculk, una corona de cuernos del Warden y brotes de cristales de amatista, con una iluminación ideal para rincones.',
    oldPrice: '$189.990',
    precio: '$149.990',
    imagen: '/assets/lampararincon.png',
    stock: 8,
  },
  {
    id: 'rin-4',
    nombre: 'FUENTE "MANANTIAL DEL ECO OSCURO"',
    categoria: 'Rincon',
    categoriaSlug: 'rincon',
    descripcion:
      'Fuente de agua para sobremesa ideal para los rincones de tu hogar con una arquitectura basada en los templos subterráneos de la DEEP DARK.',
    precio: '$169.990',
    imagen: '/assets/fuenterincon.png',
    stock: 6,
  },
];
