export const triggerDownload = (url: string, filename: string): void => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Embedded browsers may schedule the download after the click handler returns.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadText = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
};

export const sanitizeFilenamePart = (value: string): string => {
  const sanitized = value
    .normalize("NFKC")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return sanitized || "empty";
};

export const svgDataUri = (svg: string): string =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export const downloadSvg = (svg: string, filename: string): void =>
  downloadText(svg, filename, "image/svg+xml");

export interface ZipFile {
  readonly filename: string;
  readonly content: string | Uint8Array;
}

const ZIP_LOCAL_FILE_SIGNATURE = 0x04034b50;
const ZIP_CENTRAL_DIRECTORY_SIGNATURE = 0x02014b50;
const ZIP_END_SIGNATURE = 0x06054b50;
const ZIP_UTF8_FLAG = 0x0800;
const ZIP_VERSION = 20;
const zipTextEncoder = new TextEncoder();

const crc32Table = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < table.length; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) === 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

const crc32 = (bytes: Uint8Array): number => {
  let checksum = 0xffffffff;
  for (const byte of bytes) {
    checksum = crc32Table[(checksum ^ byte) & 0xff] ^ (checksum >>> 8);
  }
  return (checksum ^ 0xffffffff) >>> 0;
};

const normalizeZipFilename = (filename: string): string => {
  const normalized = filename
    .replaceAll("\\", "/")
    .split("/")
    .filter((part) => part && part !== "." && part !== "..")
    .join("-");
  return normalized || "barcode.svg";
};

const dosTimestamp = (date = new Date()): { readonly time: number; readonly date: number } => ({
  time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
  date: ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
});

/** Build a small, standards-compliant ZIP using the store method for browser downloads. */
export const buildZipBlob = (files: readonly ZipFile[]): Blob => {
  const timestamp = dosTimestamp();
  const entries = files.map((file) => {
    const filename = normalizeZipFilename(file.filename);
    const nameBytes = zipTextEncoder.encode(filename);
    const data = typeof file.content === "string" ? zipTextEncoder.encode(file.content) : file.content;
    return { filename, nameBytes, data, checksum: crc32(data) };
  });

  const localSize = entries.reduce((total, entry) => total + 30 + entry.nameBytes.length + entry.data.length, 0);
  const centralSize = entries.reduce((total, entry) => total + 46 + entry.nameBytes.length, 0);
  const totalSize = localSize + centralSize + 22;
  if (totalSize > 0xffffffff) {
    throw new Error("批量文件过大，无法创建 ZIP");
  }

  const archive = new Uint8Array(totalSize);
  const view = new DataView(archive.buffer);
  let offset = 0;
  const localOffsets: number[] = [];

  for (const entry of entries) {
    localOffsets.push(offset);
    view.setUint32(offset, ZIP_LOCAL_FILE_SIGNATURE, true);
    view.setUint16(offset + 4, ZIP_VERSION, true);
    view.setUint16(offset + 6, ZIP_UTF8_FLAG, true);
    view.setUint16(offset + 8, 0, true);
    view.setUint16(offset + 10, timestamp.time, true);
    view.setUint16(offset + 12, timestamp.date, true);
    view.setUint32(offset + 14, entry.checksum, true);
    view.setUint32(offset + 18, entry.data.length, true);
    view.setUint32(offset + 22, entry.data.length, true);
    view.setUint16(offset + 26, entry.nameBytes.length, true);
    view.setUint16(offset + 28, 0, true);
    archive.set(entry.nameBytes, offset + 30);
    archive.set(entry.data, offset + 30 + entry.nameBytes.length);
    offset += 30 + entry.nameBytes.length + entry.data.length;
  }

  const centralOffset = offset;
  entries.forEach((entry, index) => {
    view.setUint32(offset, ZIP_CENTRAL_DIRECTORY_SIGNATURE, true);
    view.setUint16(offset + 4, ZIP_VERSION, true);
    view.setUint16(offset + 6, ZIP_VERSION, true);
    view.setUint16(offset + 8, ZIP_UTF8_FLAG, true);
    view.setUint16(offset + 10, 0, true);
    view.setUint16(offset + 12, timestamp.time, true);
    view.setUint16(offset + 14, timestamp.date, true);
    view.setUint32(offset + 16, entry.checksum, true);
    view.setUint32(offset + 20, entry.data.length, true);
    view.setUint32(offset + 24, entry.data.length, true);
    view.setUint16(offset + 28, entry.nameBytes.length, true);
    view.setUint16(offset + 30, 0, true);
    view.setUint16(offset + 32, 0, true);
    view.setUint16(offset + 34, 0, true);
    view.setUint16(offset + 36, 0, true);
    view.setUint32(offset + 38, 0, true);
    view.setUint32(offset + 42, localOffsets[index], true);
    archive.set(entry.nameBytes, offset + 46);
    offset += 46 + entry.nameBytes.length;
  });

  view.setUint32(offset, ZIP_END_SIGNATURE, true);
  view.setUint16(offset + 4, 0, true);
  view.setUint16(offset + 6, 0, true);
  view.setUint16(offset + 8, entries.length, true);
  view.setUint16(offset + 10, entries.length, true);
  view.setUint32(offset + 12, centralSize, true);
  view.setUint32(offset + 16, centralOffset, true);
  view.setUint16(offset + 20, 0, true);

  return new Blob([archive], { type: "application/zip" });
};

export const downloadZip = (files: readonly ZipFile[], filename: string): void => {
  if (files.length === 0) return;
  const blob = buildZipBlob(files);
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename.endsWith(".zip") ? filename : `${filename}.zip`);
};
