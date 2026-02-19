import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC = resolve(ROOT, 'apps/vitrine/public');
const LOGO = resolve(ROOT, 'Logo.png');

async function main() {
  // 1. Extract leaf area from logo (top portion with leaf + decorative branches)
  // Logo is 500x500, leaf is in the top ~50%, centered
  const leafCrop = await sharp(LOGO)
    .extract({ top: 0, left: 70, width: 360, height: 255 })
    .png()
    .toBuffer();

  // 2. Trim transparent/white space around the leaf
  const leafBuffer = await sharp(leafCrop)
    .trim({ threshold: 20 })
    .png()
    .toBuffer();

  // 3. Make it square with transparent padding (10% margin)
  const { width: lw, height: lh } = await sharp(leafBuffer).metadata();
  const maxDim = Math.max(lw, lh);
  const padding = Math.round(maxDim * 0.1);
  const canvasSize = maxDim + padding * 2;

  const leafSquare = await sharp(leafBuffer)
    .resize(maxDim, maxDim, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize(512, 512)
    .png()
    .toBuffer();

  // 4. Generate favicon sizes from leaf
  const sizes = [16, 32, 48, 180, 192, 512];
  const generated = {};

  for (const size of sizes) {
    const path = resolve(PUBLIC, `icon-${size}.png`);
    await sharp(leafSquare)
      .resize(size, size)
      .png()
      .toFile(path);
    generated[size] = path;
    console.log(`Generated icon-${size}.png`);
  }

  // 5. Apple touch icon (180x180, with slight padding and white bg for iOS)
  await sharp(leafSquare)
    .resize(180, 180)
    .flatten({ background: '#ffffff' })
    .png()
    .toFile(resolve(PUBLIC, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // 6. Favicon.ico (multi-size: 16, 32, 48)
  const ico16 = await sharp(leafSquare).resize(16, 16).png().toBuffer();
  const ico32 = await sharp(leafSquare).resize(32, 32).png().toBuffer();
  const ico48 = await sharp(leafSquare).resize(48, 48).png().toBuffer();
  const icoBuffer = await pngToIco([ico16, ico32, ico48]);
  writeFileSync(resolve(PUBLIC, 'favicon.ico'), icoBuffer);
  console.log('Generated favicon.ico');

  // 7. Full logo optimized for header (resize to reasonable height)
  mkdirSync(resolve(PUBLIC, 'images'), { recursive: true });
  await sharp(LOGO)
    .resize(null, 200)  // 200px height, auto width
    .png({ quality: 90 })
    .toFile(resolve(PUBLIC, 'images/logo.png'));
  console.log('Generated images/logo.png (header)');

  // 8. Leaf only for header icon (trimmed, used alongside CSS text)
  await sharp(leafBuffer)
    .resize(null, 120)
    .png()
    .toFile(resolve(PUBLIC, 'images/logo-leaf.png'));
  console.log('Generated images/logo-leaf.png (header icon)');

  console.log('\nAll logos generated successfully!');
}

main().catch(console.error);
