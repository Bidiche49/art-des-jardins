import sharp from 'sharp';
import { readdir, mkdir, writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');
const IMAGES_SRC = path.join(ROOT, 'Images');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'realisations');
const OG_DIR = path.join(__dirname, '..', 'public', 'images');
const FAVICON_DIR = path.join(__dirname, '..', 'public');
const MANIFEST_PATH = path.join(__dirname, '..', 'src', 'lib', 'images-manifest.ts');

const WIDTHS = [480, 800, 1200, 1920];
const WEBP_QUALITY = 80;
const BLUR_SIZE = 20;

// Image catalog with SEO alt texts and categories
// Order matters: first 8 images = homepage gallery (maxItems=8, no filter)
// Curated for variety and visual impact
const IMAGE_CATALOG = [
  { file: 'Creation_6.jpg', slug: 'creation-6', category: 'creation', alt: 'Allee paysagere en gravier dans un parc arbore - paysagiste Angers', tags: ['creation', 'allee', 'gravier', 'parc'] },
  { file: 'Entretien_2.JPG', slug: 'entretien-2', category: 'entretien', alt: 'Jardin paysager avec piscine et topiaires parfaitement entretenus', tags: ['entretien', 'piscine', 'topiaires', 'jardin'] },
  { file: 'Creation_7.jpg', slug: 'creation-7', category: 'creation', alt: 'Terrasse en gravier stabilise avec muret en acier corten et massifs fleuris - paysagiste Angers', tags: ['creation', 'terrasse', 'corten', 'massifs'] },
  { file: 'Elagage_2.jpg', slug: 'elagage-2', category: 'elagage', alt: 'Elagueur professionnel en action dans un arbre a Angers', tags: ['elagage', 'professionnel', 'intervention'] },
  { file: 'Terrasse_2.jpeg', slug: 'terrasse-2', category: 'terrasse', alt: 'Terrasse en pierre naturelle avec amenagement paysager complet', tags: ['terrasse', 'pierre', 'amenagement'] },
  { file: 'Creation_4.jpg', slug: 'creation-4', category: 'creation', alt: 'Escalier en ardoise et pas japonais avec paillage bois - amenagement jardin Angers', tags: ['creation', 'escalier', 'ardoise', 'pas-japonais'] },
  { file: 'Cloture_1.jpeg', slug: 'cloture-1', category: 'cloture', alt: 'Pose de cloture en bois pour delimitation de jardin pres d\'Angers', tags: ['cloture', 'bois', 'delimitation'] },
  { file: 'Arrosage_1.jpg', slug: 'arrosage-1', category: 'arrosage', alt: 'Systeme d\'arrosage automatique installe dans un jardin paysager a Angers', tags: ['arrosage', 'automatique', 'jardin'] },
  // Rest of catalog
  { file: 'Creation_9.jpg', slug: 'creation-9', category: 'creation', alt: 'Parc paysager amenage avec allee en gravier et espace reception - creation paysagere Angers', tags: ['creation', 'parc', 'allee', 'reception'] },
  { file: 'Creation_8.jpg', slug: 'creation-8', category: 'creation', alt: 'Muret en acier corten avec escalier et plantations paysageres pres d\'Angers', tags: ['creation', 'corten', 'escalier', 'plantations'] },
  { file: 'Creation_5.jpg', slug: 'creation-5', category: 'creation', alt: 'Pergola en bois et allee en pas japonais dans un jardin paysager a Angers', tags: ['creation', 'pergola', 'bois', 'allee'] },
  { file: 'Creation_1.JPG', slug: 'creation-1', category: 'creation', alt: 'Creation de massifs floraux et allee paysagere a Angers', tags: ['creation', 'massifs', 'allee'], extraRotation: -90 },
  { file: 'Creation_2.jpeg', slug: 'creation-2', category: 'creation', alt: 'Amenagement paysager complet avec allee en gravillon et massifs vegetaux', tags: ['creation', 'allee', 'gravillon', 'massifs'] },
  { file: 'Creation_3.jpeg', slug: 'creation-3', category: 'creation', alt: 'Realisation d\'un jardin contemporain avec plantations variees', tags: ['creation', 'contemporain', 'plantations'] },
  { file: 'Entretien_1.jpeg', slug: 'entretien-1', category: 'entretien', alt: 'Haie taillee impeccablement par les jardiniers d\'Art des Jardins', tags: ['entretien', 'haie', 'taille'] },
  { file: 'Entretien_3.jpg', slug: 'entretien-3', category: 'entretien', alt: 'Pelouse parfaitement entretenue au coucher de soleil - entretien jardin Angers', tags: ['entretien', 'pelouse', 'coucher-soleil'] },
  { file: 'Elagage_1.JPG', slug: 'elagage-1', category: 'elagage', alt: 'Grands arbres vus en contre-plongee avant intervention d\'elagage', tags: ['elagage', 'grands-arbres', 'hauteur'] },
  { file: 'Elagage_3.jpeg', slug: 'elagage-3', category: 'elagage', alt: 'Resultat de taille d\'arbres soignee par Art des Jardins', tags: ['elagage', 'taille', 'resultat'] },
  { file: 'Elagage_4.jpeg', slug: 'elagage-4', category: 'elagage', alt: 'Taille de formation sur arbre ornemental dans le Maine-et-Loire', tags: ['elagage', 'formation', 'ornemental'] },
  { file: 'Elagage_5.jpeg', slug: 'elagage-5', category: 'elagage', alt: 'Elagage de securisation sur un arbre mature pres d\'habitation', tags: ['elagage', 'securisation', 'arbre-mature'] },
  { file: 'Terrasse_3.jpeg', slug: 'terrasse-3', category: 'terrasse', alt: 'Creation de terrasse et espace de vie exterieur a Angers', tags: ['terrasse', 'espace-vie', 'exterieur'] },
  { file: 'Terasse_1.jpeg', slug: 'terrasse-1', category: 'terrasse', alt: 'Terrasse en bois composite amenagee dans un jardin paysager', tags: ['terrasse', 'bois', 'composite'] },
  { file: 'Cloture_2.jpeg', slug: 'cloture-2', category: 'cloture', alt: 'Cloture decorative en panneaux rigides installee par Art des Jardins', tags: ['cloture', 'panneaux', 'rigides'] },
  { file: 'Cloture_3.jpeg', slug: 'cloture-3', category: 'cloture', alt: 'Amenagement de cloture et portillon pour entree de propriete', tags: ['cloture', 'portillon', 'entree'] },
  { file: 'Cloture_4.jpeg', slug: 'cloture-4', category: 'cloture', alt: 'Installation de cloture composite moderne dans le Maine-et-Loire', tags: ['cloture', 'composite', 'moderne'] },
  // Before/After pairs
  { file: 'Chantier_avant_1.jpg', slug: 'chantier-avant-1', category: 'entretien', alt: 'Jardin envahi par la vegetation avant intervention de debroussaillage a Angers', tags: ['entretien', 'debroussaillage', 'avant'] },
  { file: 'Chantier_avant_3.jpg', slug: 'chantier-apres-1', category: 'entretien', alt: 'Jardin defriche et remis au propre apres debroussaillage par Art des Jardins', tags: ['entretien', 'debroussaillage', 'apres'] },
  { file: 'Creation_8_avant.JPG', slug: 'creation-8-avant', category: 'creation', alt: 'Parc non amenage avec pelouse brute avant creation paysagere a Angers', tags: ['creation', 'avant', 'parc'] },
  { file: 'Creation_9_avant.jpeg', slug: 'creation-9-avant', category: 'creation', alt: 'Jardin en friche avec vegetation desordonnee avant amenagement paysager', tags: ['creation', 'avant', 'friche'] },
  { file: 'Terasse_1_avant.jpeg', slug: 'terrasse-1-avant', category: 'terrasse', alt: 'Spa pose sur herbe sans amenagement avant construction terrasse bois', tags: ['terrasse', 'avant', 'spa'] },
];

// OG image mappings
const OG_IMAGES = [
  { source: 'Entretien_2.JPG', output: 'og-image.jpg', alt: 'Art des Jardins - Paysagiste Angers' },
  { source: 'Creation_9.jpg', output: 'og-paysagisme.jpg', alt: 'Paysagisme Angers - Art des Jardins' },
  { source: 'Elagage_3.jpeg', output: 'og-elagage.jpg', alt: 'Elagage Angers - Art des Jardins' },
  { source: 'Entretien_3.jpg', output: 'og-entretien.jpg', alt: 'Entretien Jardin Angers - Art des Jardins' },
  { source: 'Elagage_1.JPG', output: 'og-abattage.jpg', alt: 'Abattage Arbres Angers - Art des Jardins' },
];

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function generateBlurDataURI(inputPath, extraRotation = 0) {
  let pipeline = sharp(inputPath).rotate(); // Auto-rotate based on EXIF
  if (extraRotation) pipeline = pipeline.rotate(extraRotation);
  const buffer = await pipeline
    .resize(BLUR_SIZE, BLUR_SIZE, { fit: 'cover' })
    .webp({ quality: 20 })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString('base64')}`;
}

async function getImageDimensions(inputPath, extraRotation = 0) {
  let pipeline = sharp(inputPath).rotate();
  if (extraRotation) pipeline = pipeline.rotate(extraRotation);
  const buffer = await pipeline.toBuffer();
  const metadata = await sharp(buffer).metadata();
  return { width: metadata.width, height: metadata.height };
}

async function processImage(entry) {
  const inputPath = path.join(IMAGES_SRC, entry.file);
  const extraRotation = entry.extraRotation || 0;

  if (!existsSync(inputPath)) {
    console.warn(`  SKIP: ${entry.file} not found`);
    return null;
  }

  console.log(`  Processing ${entry.file} -> ${entry.slug}${extraRotation ? ` (rotation: ${extraRotation}°)` : ''}`);

  const dimensions = await getImageDimensions(inputPath, extraRotation);
  const blurDataURI = await generateBlurDataURI(inputPath, extraRotation);
  const sizes = {};

  for (const width of WIDTHS) {
    // Skip sizes larger than original
    if (width > dimensions.width * 1.2) continue;

    const outputFilename = `${entry.slug}-${width}w.webp`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    let pipeline = sharp(inputPath).rotate(); // Auto-rotate EXIF
    if (extraRotation) pipeline = pipeline.rotate(extraRotation);
    await pipeline
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .withMetadata({ exif: undefined }) // Strip EXIF metadata (GPS, etc.)
      .toFile(outputPath);

    const stats = await sharp(outputPath).metadata();
    sizes[width] = {
      path: `/images/realisations/${outputFilename}`,
      width: stats.width,
      height: stats.height,
    };
  }

  return {
    slug: entry.slug,
    category: entry.category,
    alt: entry.alt,
    tags: entry.tags,
    originalWidth: dimensions.width,
    originalHeight: dimensions.height,
    blurDataURI,
    sizes,
  };
}

async function generateOGImages() {
  console.log('\nGenerating OG images...');
  await ensureDir(OG_DIR);

  for (const og of OG_IMAGES) {
    const inputPath = path.join(IMAGES_SRC, og.source);
    if (!existsSync(inputPath)) {
      console.warn(`  SKIP OG: ${og.source} not found`);
      continue;
    }

    const outputPath = path.join(OG_DIR, og.output);
    await sharp(inputPath)
      .rotate()
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85 })
      .withMetadata({ exif: undefined })
      .toFile(outputPath);

    console.log(`  OG: ${og.output}`);
  }
}

async function generateFavicon() {
  console.log('\nGenerating favicon...');

  // SVG leaf favicon
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#22c55e"/>
      <stop offset="100%" style="stop-color:#15803d"/>
    </linearGradient>
  </defs>
  <path d="M16 2C10 2 4 8 4 16c0 2 .5 4 1.5 5.5C7 18 10 14 16 12c-4 4-6 8-6.5 12.5C11 27 13.5 28 16 28c8 0 12-8 12-16C28 6 22 2 16 2z" fill="url(#g)"/>
  <path d="M16 12c-6 2-9 6-10.5 9.5" stroke="#dcfce7" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M16 12c-2 4-3 8-3.5 12" stroke="#dcfce7" stroke-width="1" fill="none" stroke-linecap="round"/>
</svg>`;

  await writeFile(path.join(FAVICON_DIR, 'favicon.svg'), svgContent);

  // Generate ICO (32x32)
  const svgBuffer = Buffer.from(svgContent);
  await sharp(svgBuffer, { density: 300 })
    .resize(32, 32)
    .png()
    .toFile(path.join(FAVICON_DIR, 'favicon.ico'));

  // Apple touch icon (180x180)
  await sharp(svgBuffer, { density: 300 })
    .resize(180, 180)
    .png()
    .toFile(path.join(FAVICON_DIR, 'apple-touch-icon.png'));

  console.log('  Favicons generated');
}

function generateManifest(results) {
  const entries = results
    .filter(Boolean)
    .map((r) => {
      const sizesEntries = Object.entries(r.sizes)
        .map(([w, s]) => `    ${w}: { path: '${s.path}', width: ${s.width}, height: ${s.height} }`)
        .join(',\n');

      return `  '${r.slug}': {
    slug: '${r.slug}',
    category: '${r.category}',
    alt: '${r.alt.replace(/'/g, "\\'")}',
    tags: [${r.tags.map((t) => `'${t}'`).join(', ')}],
    originalWidth: ${r.originalWidth},
    originalHeight: ${r.originalHeight},
    blurDataURI: '${r.blurDataURI}',
    sizes: {
${sizesEntries}
    },
  }`;
    })
    .join(',\n');

  return `// Auto-generated by scripts/optimize-images.mjs - DO NOT EDIT
export interface ImageSize {
  path: string;
  width: number;
  height: number;
}

export interface ImageEntry {
  slug: string;
  category: string;
  alt: string;
  tags: string[];
  originalWidth: number;
  originalHeight: number;
  blurDataURI: string;
  sizes: Record<number, ImageSize>;
}

export const images: Record<string, ImageEntry> = {
${entries}
};

export const categories = ['creation', 'elagage', 'entretien', 'terrasse', 'cloture', 'arrosage'] as const;
export type ImageCategory = typeof categories[number];

export function getImagesByCategory(category: ImageCategory): ImageEntry[] {
  return Object.values(images).filter((img) => img.category === category);
}

export function getImage(slug: string): ImageEntry | undefined {
  return images[slug];
}

export function getSrcSet(entry: ImageEntry): string {
  return Object.entries(entry.sizes)
    .map(([, size]) => \`\${size.path} \${size.width}w\`)
    .join(', ');
}

export function getDefaultSrc(entry: ImageEntry, preferredWidth = 800): string {
  const widths = Object.keys(entry.sizes).map(Number).sort((a, b) => a - b);
  const closest = widths.reduce((prev, curr) =>
    Math.abs(curr - preferredWidth) < Math.abs(prev - preferredWidth) ? curr : prev
  );
  return entry.sizes[closest].path;
}

// Hero image mappings per page
export const heroImages = {
  homepage: 'entretien-2',
  'paysagiste-angers': 'creation-9',
  'elagage-angers': 'elagage-3',
  'entretien-jardin-angers': 'entretien-3',
  'abattage-angers': 'elagage-1',
  contact: 'terrasse-2',
} as const;

// Service card image mappings
export const serviceCardImages = {
  paysagisme: 'creation-9',
  'entretien-jardin': 'entretien-3',
  elagage: 'elagage-2',
  abattage: 'elagage-1',
  terrasse: 'terrasse-2',
  cloture: 'cloture-1',
  'taille-haies': 'entretien-1',
  debroussaillage: 'chantier-avant-1',
  'arrosage-automatique': 'arrosage-1',
} as const;

// Service hero mappings for dynamic [serviceCity] pages
export const serviceHeroImages: Record<string, string> = {
  paysagiste: 'creation-9',
  'entretien-jardin': 'entretien-3',
  elagage: 'elagage-3',
  abattage: 'elagage-1',
  terrasse: 'terrasse-2',
  cloture: 'cloture-1',
  'taille-haies': 'entretien-1',
  debroussaillage: 'chantier-avant-1',
  'arrosage-automatique': 'arrosage-1',
};

// OG image paths per service
export const ogImages = {
  default: '/images/og-image.jpg',
  paysagisme: '/images/og-paysagisme.jpg',
  elagage: '/images/og-elagage.jpg',
  entretien: '/images/og-entretien.jpg',
  abattage: '/images/og-abattage.jpg',
} as const;
`;
}

async function main() {
  console.log('=== Art des Jardins Image Optimization ===\n');

  // Ensure output directories
  await ensureDir(OUTPUT_DIR);
  await ensureDir(OG_DIR);

  // Check source images
  const sourceFiles = await readdir(IMAGES_SRC).catch(() => []);
  console.log(`Found ${sourceFiles.filter((f) => !f.startsWith('.')).length} source images\n`);

  // Process all images
  console.log('Processing responsive images...');
  const results = [];
  for (const entry of IMAGE_CATALOG) {
    const result = await processImage(entry);
    results.push(result);
  }

  // Generate OG images
  await generateOGImages();

  // Generate favicon
  await generateFavicon();

  // Generate manifest
  console.log('\nGenerating images manifest...');
  const manifestContent = generateManifest(results);
  await ensureDir(path.dirname(MANIFEST_PATH));
  await writeFile(MANIFEST_PATH, manifestContent, 'utf-8');
  console.log(`  Manifest written to ${path.relative(ROOT, MANIFEST_PATH)}`);

  // Summary
  const processed = results.filter(Boolean);
  const totalFiles = processed.reduce((acc, r) => acc + Object.keys(r.sizes).length, 0);
  console.log(`\n=== Done! ===`);
  console.log(`  ${processed.length} images processed`);
  console.log(`  ${totalFiles} responsive variants generated`);
  console.log(`  ${OG_IMAGES.length} OG images generated`);
  console.log(`  3 favicon files generated`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
