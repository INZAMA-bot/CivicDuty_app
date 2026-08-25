import sharp from 'sharp';
import fs from 'fs';

async function main() {
  const file = 'exact_traffic_lights_1787553504710.jpg';
  const imgPath = 'src/assets/images/' + file;
  const image = sharp(imgPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  console.log('Image dimensions:', width, height);

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  // Let's find centers of the three circles:
  // Red bulb (left), Amber bulb (middle), Green bulb (right)
  // Let's compute average intensity in columns
  const colScores = new Array(width).fill(0);
  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.8); y++) {
      const idx = (y * width + x) * info.channels;
      sum += (data[idx] + data[idx+1] + data[idx+2]) / 3;
    }
    colScores[x] = sum;
  }

  // Find centers around left (x: 100-500), middle (x: 500-900), right (x: 900-1300)
  console.log('Finished basic scan');
}
main();
