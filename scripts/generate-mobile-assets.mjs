import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LOGO = resolve(ROOT, 'Logo.png');
const ASSETS = resolve(ROOT, 'apps/mobile/assets');

async function main() {
  // 1. Extract leaf from logo (top portion with leaf + decorative branches)
  const leafCrop = await sharp(LOGO)
    .extract({ top: 0, left: 70, width: 360, height: 255 })
    .png()
    .toBuffer();

  const leafBuffer = await sharp(leafCrop)
    .trim({ threshold: 20 })
    .png()
    .toBuffer();

  // 2. APP ICON - Leaf on white background, 1024x1024
  const { width: lw, height: lh } = await sharp(leafBuffer).metadata();
  const maxDim = Math.max(lw, lh);

  // Center leaf in square with generous padding, white background
  const leafSquare = await sharp(leafBuffer)
    .resize(maxDim, maxDim, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: Math.round(maxDim * 0.2),
      bottom: Math.round(maxDim * 0.25),
      left: Math.round(maxDim * 0.15),
      right: Math.round(maxDim * 0.15),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  // iOS icon: white background, 1024x1024
  await sharp(leafSquare)
    .resize(1024, 1024)
    .flatten({ background: '#ffffff' })
    .png()
    .toFile(resolve(ASSETS, 'app-icon.png'));
  console.log('Generated app-icon.png (1024x1024, white bg)');

  // Android adaptive foreground: transparent bg, 1024x1024
  await sharp(leafSquare)
    .resize(1024, 1024)
    .png()
    .toFile(resolve(ASSETS, 'app-icon-foreground.png'));
  console.log('Generated app-icon-foreground.png (1024x1024, transparent)');

  // 3. SPLASH SCREEN - Full logo centered, white background
  // Use the full Logo.png, add padding, resize to 512 width (splash doesn't need 1024)
  const fullLogo = await sharp(LOGO)
    .trim({ threshold: 20 })
    .png()
    .toBuffer();

  const { width: fw, height: fh } = await sharp(fullLogo).metadata();
  const splashPad = Math.round(Math.max(fw, fh) * 0.15);

  await sharp(fullLogo)
    .extend({
      top: splashPad,
      bottom: splashPad,
      left: splashPad,
      right: splashPad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize(512, null, { withoutEnlargement: false })
    .png()
    .toFile(resolve(ASSETS, 'splash-logo.png'));
  console.log('Generated splash-logo.png');

  // 4. Splash logo for dark mode (same logo, works on dark bg since logo has transparency)
  await sharp(fullLogo)
    .extend({
      top: splashPad,
      bottom: splashPad,
      left: splashPad,
      right: splashPad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize(512, null, { withoutEnlargement: false })
    .png()
    .toFile(resolve(ASSETS, 'splash-logo-dark.png'));
  console.log('Generated splash-logo-dark.png');

  console.log('\nAll mobile assets generated!');
}

main().catch(console.error);
