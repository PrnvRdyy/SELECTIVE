/**
 * Script to generate PNG icons from the SVG source.
 * Run with: npx tsx scripts/generate-icons.ts
 */
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { deflateSync } from "zlib";

// Since we can't easily render SVG to PNG without a browser/canvas in Node,
// we'll create simple 1-color PNG icons using raw PNG encoding.
// For a production release, proper icon design tools should be used.

const sizes = [16, 48, 128];
const outDir = resolve(import.meta.dirname, "../public/icons");

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

// Create minimal valid PNG files (solid indigo squares with rounded feel)
for (const size of sizes) {
  const png = createSimplePNG(size, [124, 92, 255]); // #7C5CFF
  writeFileSync(resolve(outDir, `icon-${size}.png`), png);
  console.log(`Created icon-${size}.png`);
}

function createSimplePNG(size: number, rgb: [number, number, number]): Buffer {
  // Minimal PNG with IHDR, IDAT (uncompressed), IEND
  const width = size;
  const height = size;
  
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createChunk("IHDR", ihdrData);
  
  // Raw image data: each row has a filter byte (0) + RGB pixels
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    rawData[y * rowSize] = 0; // no filter
    for (let x = 0; x < width; x++) {
      const offset = y * rowSize + 1 + x * 3;
      rawData[offset] = rgb[0];
      rawData[offset + 1] = rgb[1];
      rawData[offset + 2] = rgb[2];
    }
  }
  
  // Compress with zlib (deflate)
  const compressed = deflateSync(rawData);
  const idat = createChunk("IDAT", compressed);
  
  // IEND chunk
  const iend = createChunk("IEND", Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, "ascii");
  const crcData = Buffer.concat([typeBuffer, data]);
  
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);
  
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(data: Buffer): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
