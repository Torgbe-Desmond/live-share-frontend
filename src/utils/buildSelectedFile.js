export async function buildSelectedFile(file, options = {}) {
  const { viewOnce = false } = options;

  const roomName = localStorage.getItem("roomName");

  // 1️⃣ Get file buffer
  const arrayBuffer = await file.arrayBuffer();

  // 2️⃣ Hash file (SHA-256)
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const publicId = `${roomName}/${hashHex}`;

  return {
    file,
    type: file.type,
    originalname: file.name,
    name: file.name,
    size: file.size,
    local: true,
    isSuccess: false,
    isFailed: false,
    publicId,
    viewOnce,
    viewed: false,
    buffer: arrayBuffer,
  };
}