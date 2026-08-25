import sharp from 'sharp';
import fs from 'fs';

async function extractCleanBulbs() {
  const file = 'src/assets/images/exact_traffic_lights_1787553504710.jpg';
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // The 3 bulbs:
  // Red: (296, 384), outer metallic bezel radius = 143.5
  // Amber: (696, 384), outer metallic bezel radius = 144.5
  // Green: (1096, 384), outer metallic bezel radius = 144.5

  const bulbs = [
    { name: 'red', cx: 296, cy: 384, r: 143.5 },
    { name: 'amber', cx: 696, cy: 384, r: 144.5 },
    { name: 'green', cx: 1096, cy: 384, r: 144.5 }
  ];

  const outBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * channels;
      const dstIdx = (y * width + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      let alpha = 0;

      for (let i = 0; i < bulbs.length; i++) {
        const bInfo = bulbs[i];
        const dist = Math.hypot(x - bInfo.cx, y - bInfo.cy);
        const radius = bInfo.r;
        const feather = 1.8;

        if (dist <= radius) {
          alpha = Math.max(alpha, 1.0);
        } else if (dist <= radius + feather) {
          const a = 1.0 - (dist - radius) / feather;
          alpha = Math.max(alpha, a);
        }
      }

      outBuffer[dstIdx] = r;
      outBuffer[dstIdx + 1] = g;
      outBuffer[dstIdx + 2] = b;
      outBuffer[dstIdx + 3] = Math.round(alpha * 255);
    }
  }

  // Tight crop box around the 3 bulbs
  const left = Math.round(296 - 143.5 - 6);
  const top = Math.round(384 - 144.5 - 6);
  const cropW = Math.round((1096 + 144.5 + 6) - left);
  const cropH = Math.round((144.5 + 6) * 2);

  await sharp(outBuffer, { raw: { width, height, channels: 4 } })
    .extract({ left, top, width: cropW, height: cropH })
    .png({ compressionLevel: 9 })
    .toFile('src/assets/images/exact_traffic_bulbs_nobg.png');

  // Copy to public directory
  fs.copyFileSync('src/assets/images/exact_traffic_bulbs_nobg.png', 'public/exact_traffic_bulbs_nobg.png');
  fs.copyFileSync('src/assets/images/exact_traffic_bulbs_nobg.png', 'public/civicduty-bulbs-transparent.png');
  fs.copyFileSync('src/assets/images/exact_traffic_bulbs_nobg.png', 'public/civicduty-logo-nobg.png');
  fs.copyFileSync('src/assets/images/exact_traffic_bulbs_nobg.png', 'public/civicduty-logo.png');

  console.log('Successfully saved exact transparent bulbs! Dimensions:', cropW, 'x', cropH);

  // Also extract individual transparent bulb assets
  for (const bInfo of bulbs) {
    const singleSize = Math.round((bInfo.r + 6) * 2);
    const sLeft = Math.round(bInfo.cx - bInfo.r - 6);
    const sTop = Math.round(bInfo.cy - bInfo.r - 6);

    await sharp(outBuffer, { raw: { width, height, channels: 4 } })
      .extract({ left: sLeft, top: sTop, width: singleSize, height: singleSize })
      .png({ compressionLevel: 9 })
      .toFile(`src/assets/images/bulb_${bInfo.name}_exact.png`);

    fs.copyFileSync(`src/assets/images/bulb_${bInfo.name}_exact.png`, `public/bulb_${bInfo.name}_exact.png`);
  }

  console.log('Individual bulbs extracted successfully!');
}

extractCleanBulbs().catch(console.error);
