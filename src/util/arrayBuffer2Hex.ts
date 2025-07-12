export default function arrayBuffer2Hex(buffer: ArrayBuffer) {
    const byteArray = new Uint8Array(buffer);
    return Array.from(byteArray, (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  }