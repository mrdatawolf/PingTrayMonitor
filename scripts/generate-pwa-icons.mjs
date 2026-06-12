import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

// Generates PWA icon PNGs from Examples/PingMonitorLogo.png using a small
// self-contained PNG decoder/encoder (no native or npm image deps), mirroring
// the manual PNG encoding approach already used in electron/icons.js.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'Examples', 'PingMonitorLogo.png');
const OUT_DIR = path.join(ROOT, 'public', 'icons');

// ─── PNG decode (8-bit RGB/RGBA, non-interlaced) ──────────────────────────────

function readChunks(buf) {
  const chunks = [];
  let offset = 8; // skip signature
  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + length);
    chunks.push({ type, data });
    offset += 12 + length;
  }
  return chunks;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function decodePNG(buf) {
  const chunks = readChunks(buf);
  const ihdr = chunks.find((c) => c.type === 'IHDR').data;
  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const bitDepth = ihdr[8];
  const colorType = ihdr[9];
  const interlace = ihdr[12];

  if (bitDepth !== 8 || interlace !== 0 || (colorType !== 2 && colorType !== 6)) {
    throw new Error(`Unsupported PNG format (bitDepth=${bitDepth}, colorType=${colorType}, interlace=${interlace})`);
  }
  const channels = colorType === 6 ? 4 : 3;

  const idat = Buffer.concat(chunks.filter((c) => c.type === 'IDAT').map((c) => c.data));
  const raw = zlib.inflateSync(idat);

  const stride = width * channels;
  const out = new Uint8Array(width * height * channels);
  let pos = 0;

  for (let y = 0; y < height; y++) {
    const filter = raw[pos++];
    const rowStart = y * stride;
    const prevRowStart = (y - 1) * stride;

    for (let x = 0; x < stride; x++) {
      const rawByte = raw[pos++];
      const left = x >= channels ? out[rowStart + x - channels] : 0;
      const up = y > 0 ? out[prevRowStart + x] : 0;
      const upLeft = y > 0 && x >= channels ? out[prevRowStart + x - channels] : 0;

      let value;
      switch (filter) {
        case 0: value = rawByte; break;
        case 1: value = rawByte + left; break;
        case 2: value = rawByte + up; break;
        case 3: value = rawByte + Math.floor((left + up) / 2); break;
        case 4: value = rawByte + paeth(left, up, upLeft); break;
        default: throw new Error(`Unsupported filter type ${filter}`);
      }
      out[rowStart + x] = value & 0xff;
    }
  }

  return { width, height, channels, pixels: out };
}

// ─── Resize (box filter average, RGB/RGBA -> RGBA) ────────────────────────────

function resizeToRGBA(src, targetSize) {
  const { width: W, height: H, channels, pixels } = src;
  const scaleX = W / targetSize;
  const scaleY = H / targetSize;
  const result = new Uint8Array(targetSize * targetSize * 4);

  for (let oy = 0; oy < targetSize; oy++) {
    const y0 = Math.floor(oy * scaleY);
    const y1 = Math.max(y0 + 1, Math.min(H, Math.floor((oy + 1) * scaleY)));
    for (let ox = 0; ox < targetSize; ox++) {
      const x0 = Math.floor(ox * scaleX);
      const x1 = Math.max(x0 + 1, Math.min(W, Math.floor((ox + 1) * scaleX)));

      let r = 0, g = 0, b = 0, a = 0, count = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * W + x) * channels;
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
          a += channels === 4 ? pixels[i + 3] : 255;
          count++;
        }
      }

      const o = (oy * targetSize + ox) * 4;
      result[o] = Math.round(r / count);
      result[o + 1] = Math.round(g / count);
      result[o + 2] = Math.round(b / count);
      result[o + 3] = Math.round(a / count);
    }
  }

  return result;
}

// ─── PNG encode (8-bit RGBA, filter type 0) ───────────────────────────────────

function crc32(data) {
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < data.length; i++) crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  return crc ^ -1;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.allocUnsafe(4);
  len.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeInt32BE(crc32(crcInput));
  return Buffer.concat([len, typeBytes, data, crcBuf]);
}

function encodePNG(size, rgba) {
  const stride = size * 4 + 1;
  const raw = Buffer.alloc(size * stride);
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0; // filter: none
    rgba.subarray(y * size * 4, (y + 1) * size * 4).forEach((byte, i) => {
      raw[y * stride + 1 + i] = byte;
    });
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });

  const ihdrData = Buffer.allocUnsafe(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // color type: RGBA
  ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdrData),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ─── Main ──────────────────────────────────────────────────────────────────

const source = decodePNG(fs.readFileSync(SOURCE));
console.log(`Decoded ${SOURCE}: ${source.width}x${source.height}, ${source.channels} channels`);

const cornerIdx = 0;
console.log(
  `Corner pixel (background): rgb(${source.pixels[cornerIdx]}, ${source.pixels[cornerIdx + 1]}, ${source.pixels[cornerIdx + 2]})`
);

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const size of [512, 192]) {
  const rgba = resizeToRGBA(source, size);
  const png = encodePNG(size, rgba);
  const outPath = path.join(OUT_DIR, `icon-${size}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`Wrote ${outPath} (${png.length} bytes)`);
}
