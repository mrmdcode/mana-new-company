export function parseDataUrl(dataUrl: string): Blob | null {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  return new Blob([Buffer.from(match[2], "base64")], { type: match[1] });
}
