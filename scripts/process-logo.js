const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC =
  'C:/Users/Shriyam/.cursor/projects/e-projects-Astro-Darshi/assets/c__Users_Shriyam_AppData_Roaming_Cursor_User_workspaceStorage_a0e6074b0798c69b13a6d7104b6b6b25_images_ChatGPT_Image_Sep_20__2026__11_04_14_PM-b3c2236c-2b5e-4d00-8747-21d1a912d301.jpg';
const PUBLIC = path.join(__dirname, '..', 'public');
const APP = path.join(__dirname, '..', 'app');
const NAVY = { r: 15, g: 23, b: 42, alpha: 1 };

async function makeTransparent(inputPath) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const threshold = 245;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0;
    } else if (r >= 230 && g >= 230 && b >= 230) {
      const whiteness = Math.min(r, g, b);
      data[i + 3] = Math.max(0, Math.round(255 * (1 - (whiteness - 230) / 25)));
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png().toBuffer();
}

async function makeAppIcon(iconSquare, size, outPath, { bg = NAVY, padding = 0.14 } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const resized = await sharp(iconSquare)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: resized, gravity: 'centre' }])
    .png()
    .toFile(outPath);
}

async function makeTransparentIcon(iconSquare, size, outPath, padding = 0.08) {
  const inner = Math.round(size * (1 - padding * 2));
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: await sharp(iconSquare)
          .resize(inner, inner, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png()
          .toBuffer(),
        gravity: 'centre',
      },
    ])
    .png()
    .toFile(outPath);
}

async function main() {
  const rawTransparent = await makeTransparent(SRC);
  const trimmedFull = await sharp(rawTransparent).trim({ threshold: 10 }).png().toBuffer();
  const trimmedMeta = await sharp(trimmedFull).metadata();
  console.log('Full trimmed:', trimmedMeta.width, 'x', trimmedMeta.height);

  await sharp(trimmedFull).png().toFile(path.join(PUBLIC, 'logo.png'));
  await sharp(trimmedFull).png().toFile(path.join(PUBLIC, 'logo-full.png'));

  // Crop icon mark from the trimmed full logo (left ~40%)
  const cropW = Math.min(Math.round(trimmedMeta.width * 0.4), trimmedMeta.width);
  console.log('Cropping icon from trimmed logo, cropW', cropW);

  const iconLeft = await sharp(trimmedFull)
    .extract({ left: 0, top: 0, width: cropW, height: trimmedMeta.height })
    .trim({ threshold: 10 })
    .png()
    .toBuffer();

  const iconMeta = await sharp(iconLeft).metadata();
  console.log('Icon mark trimmed:', iconMeta.width, 'x', iconMeta.height);

  const side = Math.max(iconMeta.width, iconMeta.height);
  const iconSquare = await sharp(iconLeft)
    .resize({
      width: side,
      height: side,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp(iconSquare).png().toFile(path.join(PUBLIC, 'logo-mark.png'));

  await makeTransparentIcon(iconSquare, 192, path.join(PUBLIC, 'icon-192.png'));
  await makeTransparentIcon(iconSquare, 512, path.join(PUBLIC, 'icon-512.png'));
  await makeAppIcon(iconSquare, 512, path.join(PUBLIC, 'icon-512-maskable.png'), { padding: 0.18 });
  await makeAppIcon(iconSquare, 180, path.join(APP, 'apple-icon.png'), { padding: 0.14 });
  await makeTransparentIcon(iconSquare, 32, path.join(APP, 'icon.png'), 0.06);
  await makeTransparentIcon(iconSquare, 32, path.join(PUBLIC, 'favicon-32.png'), 0.06);
  await makeTransparentIcon(iconSquare, 16, path.join(PUBLIC, 'favicon-16.png'), 0.06);
  await makeAppIcon(iconSquare, 180, path.join(PUBLIC, 'apple-touch-icon.png'), { padding: 0.14 });

  await sharp(iconSquare)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC, 'favicon.ico'));

  const logoForOg = await sharp(trimmedFull)
    .resize({ width: 900, height: 400, fit: 'inside' })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 3,
      background: { r: 250, g: 250, b: 249 },
    },
  })
    .composite([{ input: logoForOg, gravity: 'centre' }])
    .png()
    .toFile(path.join(PUBLIC, 'og-image.png'));

  console.log('Done.');
  for (const f of [
    'logo.png',
    'logo-full.png',
    'logo-mark.png',
    'icon-192.png',
    'icon-512.png',
    'icon-512-maskable.png',
    'apple-touch-icon.png',
    'og-image.png',
    'favicon.ico',
  ]) {
    console.log(f, fs.statSync(path.join(PUBLIC, f)).size);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
