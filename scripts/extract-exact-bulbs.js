import sharp from 'sharp';
import fs from 'fs';

async function extractExactBulbs() {
  const file = 'exact_traffic_lights_1787553504710.jpg';
  const imgPath = 'src/assets/images/' + file;
  
  const { data, info } = await sharp(imgPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  console.log(`Original image: ${width}x${height}, channels: ${channels}`);

  // Let's locate the 3 circles by measuring where the metallic circular bezels are.
  // Visual inspection of 1376x768:
  // Height is 768, center y is around 384.
  // Bulb diameter is roughly 380px, radius ~190px.
  // Left center x is ~296.
  // Center center x is ~696.
  // Right center x is ~1096.

  // Let's refine the exact centers:
  // Center Y for all 3:
  const cy = 384;
  const radius = 190;
  const cx1 = 296;  // Red
  const cx2 = 696;  // Amber
  const cx3 = 1096; // Green

  console.log(`Centers: Red (${cx1}, ${cy}), Amber (${cx2}, ${cy}), Green (${cx3}, ${cy}), R=${radius}`);

  // Create an RGBA buffer for the 3 bulbs on transparent background
  // We want to keep everything inside the 3 bulb circles with smooth anti-aliased feathering on the outer edge,
  // PLUS keep the radiant green glow around the green bulb!
  
  const outputBuffer = Buffer.alloc(width * height * 4);

  // Background sample color: Dark brushed slate/charcoal (approx [15, 23, 30] to [25, 35, 45])
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * channels;
      const dstIdx = (y * width + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      // Distance to bulb 1 (Red)
      const d1 = Math.hypot(x - cx1, y - cy);
      // Distance to bulb 2 (Amber)
      const d2 = Math.hypot(x - cx2, y - cy);
      // Distance to bulb 3 (Green)
      const d3 = Math.hypot(x - cx3, y - cy);

      let alpha = 0;

      // Outer rim radius is ~188px
      const R_RIM = 188;
      const FEATHER = 3.5;

      // Inside or edge of Red bulb
      if (d1 <= R_RIM + FEATHER) {
        const a = d1 <= R_RIM ? 1 : Math.max(0, 1 - (d1 - R_RIM) / FEATHER);
        alpha = Math.max(alpha, a);
      }

      // Inside or edge of Amber bulb
      if (d2 <= R_RIM + FEATHER) {
        const a = d2 <= R_RIM ? 1 : Math.max(0, 1 - (d2 - R_RIM) / FEATHER);
        alpha = Math.max(alpha, a);
      }

      // Inside or edge of Green bulb (plus radiant emerald halo glow)
      if (d3 <= R_RIM + FEATHER) {
        const a = d3 <= R_RIM ? 1 : Math.max(0, 1 - (d3 - R_RIM) / FEATHER);
        alpha = Math.max(alpha, a);
      } else if (d3 <= R_RIM + 75) {
        // Green ambient glow: calculate intensity of green light in excess of background
        const excessGreen = Math.max(0, g - (r + b) / 2);
        if (excessGreen > 10) {
          const glowAlpha = Math.min(1, (excessGreen / 150) * Math.max(0, 1 - (d3 - R_RIM) / 75));
          alpha = Math.max(alpha, glowAlpha * 0.85);
        }
      }

      outputBuffer[dstIdx] = r;
      outputBuffer[dstIdx + 1] = g;
      outputBuffer[dstIdx + 2] = b;
      outputBuffer[dstIdx + 3] = Math.round(alpha * 255);
    }
  }

  // Save the full 3-bulb horizontal image with transparent background
  // Crop tightly around the 3 bulbs:
  // x: from (cx1 - radius - 20) to (cx3 + radius + 80)
  // y: from (cy - radius - 20) to (cy + radius + 20)
  const cropLeft = Math.max(0, cx1 - radius - 15);
  const cropTop = Math.max(0, cy - radius - 15);
  const cropWidth = Math.min(width - cropLeft, (cx3 + radius + 80) - cropLeft);
  const cropHeight = Math.min(height - cropTop, (radius * 2 + 30));

  await sharp(outputBuffer, {
    raw: { width, height, channels: 4 }
  })
  .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
  .png({ compressionLevel: 9 })
  .toFile('src/assets/images/exact_traffic_bulbs_nobg.png');

  // Copy to public directory as well
  fs.copyFileSync('src/assets/images/exact_traffic_bulbs_nobg.png', 'public/exact_traffic_bulbs_nobg.png');
  fs.copyFileSync('src/assets/images/exact_traffic_bulbs_nobg.png', 'public/civicduty-bulbs-transparent.png');
  fs.copyFileSync('src/assets/images/exact_traffic_bulbs_nobg.png', 'public/civicduty-logo-nobg.png');

  console.log(`Saved exact_traffic_bulbs_nobg.png (${cropWidth}x${cropHeight})`);

  // Also let's extract individual bulb PNGs
  const bulbRadius = 188;
  const padding = 10;
  const singleSize = (bulbRadius + padding) * 2;

  // 1. Red Bulb
  await sharp(outputBuffer, {
    raw: { width, height, channels: 4 }
  })
  .extract({
    left: cx1 - bulbRadius - padding,
    top: cy - bulbRadius - padding,
    width: singleSize,
    height: singleSize
  })
  .png()
  .toFile('src/assets/images/bulb_red_exact.png');

  // 2. Amber Bulb
  await sharp(outputBuffer, {
    raw: { width, height, channels: 4 }
  })
  .extract({
    left: cx2 - bulbRadius - padding,
    top: cy - bulbRadius - padding,
    width: singleSize,
    height: singleSize
  })
  .png()
  .toFile('src/assets/images/bulb_amber_exact.png');

  // 3. Green Bulb (with glow padding)
  const greenPadding = 60;
  await sharp(outputBuffer, {
    raw: { width, height, channels: 4 }
  })
  .extract({
    left: cx3 - bulbRadius - greenPadding,
    top: cy - bulbRadius - greenPadding,
    width: (bulbRadius + greenPadding) * 2,
    height: (bulbRadius + greenPadding) * 2
  })
  .png()
  .toFile('src/assets/images/bulb_green_exact.png');

  console.log('Individual bulbs extracted successfully!');
}

extractExactBulbs().catch(console.error);
