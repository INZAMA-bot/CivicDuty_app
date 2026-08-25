import sharp from 'sharp';
import fs from 'fs';

async function perfectExtraction() {
  const file = 'exact_traffic_lights_1787553504710.jpg';
  const imgPath = 'src/assets/images/' + file;
  
  const { data, info } = await sharp(imgPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's sample the background at multiple points around the bulbs
  // Background is around [14, 18, 24] to [8, 10, 14]
  // Centers:
  const cy = 390;
  const cx1 = 302; // Red
  const cx2 = 708; // Amber
  const cx3 = 1112; // Green
  const bulbRadius = 188; // Outer bezel radius

  // Let's create an RGBA output buffer
  const outBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * channels;
      const dstIdx = (y * width + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      const d1 = Math.hypot(x - cx1, y - cy);
      const d2 = Math.hypot(x - cx2, y - cy);
      const d3 = Math.hypot(x - cx3, y - cy);

      let alpha = 0;
      const feather = 2.0;

      // Red bulb inside
      if (d1 <= bulbRadius) {
        alpha = Math.max(alpha, 1.0);
      } else if (d1 <= bulbRadius + feather) {
        alpha = Math.max(alpha, 1.0 - (d1 - bulbRadius) / feather);
      }

      // Amber bulb inside
      if (d2 <= bulbRadius) {
        alpha = Math.max(alpha, 1.0);
      } else if (d2 <= bulbRadius + feather) {
        alpha = Math.max(alpha, 1.0 - (d2 - bulbRadius) / feather);
      }

      // Green bulb inside
      if (d3 <= bulbRadius) {
        alpha = Math.max(alpha, 1.0);
      } else if (d3 <= bulbRadius + feather) {
        alpha = Math.max(alpha, 1.0 - (d3 - bulbRadius) / feather);
      } else if (d3 <= bulbRadius + 90) {
        // Green radiant glow around green bulb
        // The green glow has strong green channel compared to r & b
        const excessG = Math.max(0, g - Math.max(r, b));
        if (excessG > 5) {
          const falloff = Math.max(0, 1.0 - (d3 - bulbRadius) / 90);
          const glowAlpha = Math.min(1.0, (excessG / 100) * falloff * 0.9);
          alpha = Math.max(alpha, glowAlpha);
        }
      }

      outBuffer[dstIdx] = r;
      outBuffer[dstIdx + 1] = g;
      outBuffer[dstIdx + 2] = b;
      outBuffer[dstIdx + 3] = Math.round(alpha * 255);
    }
  }

  // Symmetric bounding box around all 3 bulbs:
  // Left bulb center is cx1 = 302, right bulb center is cx3 = 1112.
  // Distance from center of group ((cx1 + cx3)/2 = 707) is (1112 - 302)/2 = 405.
  // Total span from left edge (cx1 - bulbRadius - 10 = 104) to right edge (cx3 + bulbRadius + 10 = 1310).
  const paddingX = 14;
  const paddingY = 14;
  const cropLeft = cx1 - bulbRadius - paddingX; // ~100
  const cropTop = cy - bulbRadius - paddingY;   // ~188
  const cropWidth = (cx3 + bulbRadius + paddingX) - cropLeft; // ~1224
  const cropHeight = (bulbRadius + paddingY) * 2; // ~404

  console.log('Crop box:', { cropLeft, cropTop, cropWidth, cropHeight });

  await sharp(outBuffer, {
    raw: { width, height, channels: 4 }
  })
  .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
  .png({ compressionLevel: 9 })
  .toFile('src/assets/images/exact_traffic_bulbs_nobg.png');

  fs.copyFileSync('src/assets/images/exact_traffic_bulbs_nobg.png', 'public/exact_traffic_bulbs_nobg.png');
  fs.copyFileSync('src/assets/images/exact_traffic_bulbs_nobg.png', 'public/civicduty-bulbs-transparent.png');
  fs.copyFileSync('src/assets/images/exact_traffic_bulbs_nobg.png', 'public/civicduty-logo-nobg.png');
  fs.copyFileSync('src/assets/images/exact_traffic_bulbs_nobg.png', 'public/civicduty-logo.png');

  console.log('Successfully generated transparent bulbs matching the exact PNG!');
}

perfectExtraction().catch(console.error);
