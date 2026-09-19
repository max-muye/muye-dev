const UNIQUE_METHOD_STRING = "muye.dev::misc-codec::e9fb7bdc4a9f6c81f38d2b01475af89c6d2c5a010e8b4c9d1a0376fdb22344af::quiet-window-317::paper-signal-884::never-shared-default";

const secretInput = document.querySelector("#secret");
const encodeInput = document.querySelector("#encode");
const decodeInput = document.querySelector("#decode");
const copyEncodeButton = document.querySelector("#copy-encode");
const copyDecodeButton = document.querySelector("#copy-decode");
const statusEl = document.querySelector("#status");
let updating = false;
let lastSource = "encode";

function secretValue() {
  return String(secretInput.value || "0");
}

function seedNumbers(secret) {
  const seed = `${UNIQUE_METHOD_STRING}::${secret}`;
  let a = 0x9e3779b9;
  let b = 0x243f6a88;
  let c = 0xb7e15162;
  let d = 0xdeadbeef;
  for (let index = 0; index < seed.length; index += 1) {
    const code = seed.charCodeAt(index);
    a = Math.imul(a ^ code, 2654435761);
    b = Math.imul(b + code + index, 1597334677);
    c = Math.imul(c ^ (code << (index % 16)), 3812015801);
    d = Math.imul(d + (code ^ a), 3266489917);
  }
  return [a >>> 0, b >>> 0, c >>> 0, d >>> 0];
}

function nextRandom(seed) {
  seed[0] >>>= 0;
  seed[1] >>>= 0;
  seed[2] >>>= 0;
  seed[3] >>>= 0;
  const result = (seed[0] + seed[1] + seed[3]) >>> 0;
  seed[3] = (seed[3] + 1) >>> 0;
  seed[0] = seed[1] ^ (seed[1] >>> 9);
  seed[1] = (seed[2] + (seed[2] << 3)) >>> 0;
  seed[2] = ((seed[2] << 21) | (seed[2] >>> 11)) >>> 0;
  seed[2] = (seed[2] + result) >>> 0;
  return result;
}

function randomMaskBytes(secret, length) {
  const seed = seedNumbers(secret);
  const mask = new Uint8Array(length);
  let random = 0;
  for (let index = 0; index < length; index += 1) {
    if (index % 4 === 0) random = nextRandom(seed);
    mask[index] = (random >>> ((index % 4) * 8)) & 255;
  }
  return mask;
}

function bytesKey(bytes) {
  let a = 0x85ebca6b;
  let b = 0xc2b2ae35;
  for (let index = 0; index < bytes.length; index += 1) {
    a = Math.imul(a ^ bytes[index] ^ index, 2246822507);
    b = Math.imul(b + bytes[index] + (a >>> 16), 3266489909);
  }
  return `${a >>> 0}:${b >>> 0}:${bytes.length}`;
}

function mixHalf(target, source, secret, round) {
  const mask = randomMaskBytes(`${secret}::round-${round}::${bytesKey(source)}`, target.length);
  const out = new Uint8Array(target.length);
  for (let index = 0; index < target.length; index += 1) {
    out[index] = target[index] ^ mask[index];
  }
  return out;
}

function feistel(bytes, secret, decrypt = false) {
  if (bytes.length < 2) return transformBytes(bytes, secret);
  let left = bytes.slice(0, Math.ceil(bytes.length / 2));
  let right = bytes.slice(left.length);
  const rounds = Array.from({ length: 12 }, (_, index) => index);
  if (decrypt) rounds.reverse();
  rounds.forEach((round) => {
    if (decrypt) {
      const oldRight = left;
      const oldLeft = mixHalf(right, oldRight, secret, round);
      left = oldLeft;
      right = oldRight;
    } else {
      const newLeft = right;
      const newRight = mixHalf(left, right, secret, round);
      left = newLeft;
      right = newRight;
    }
  });
  const out = new Uint8Array(left.length + right.length);
  out.set(left);
  out.set(right, left.length);
  return out;
}

function transformBytes(bytes, secret) {
  const mask = randomMaskBytes(`${secret}::edge-mask`, bytes.length);
  const out = new Uint8Array(bytes.length);
  for (let index = 0; index < bytes.length; index += 1) {
    out[index] = bytes[index] ^ mask[index];
  }
  return out;
}

function toBase64Url(bytes) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const cleaned = String(value || "").trim().replace(/-/g, "+").replace(/_/g, "/");
  const padded = cleaned + "===".slice((cleaned.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function encodeText(value) {
  const plain = new TextEncoder().encode(value);
  return toBase64Url(transformBytes(feistel(plain, secretValue(), false), secretValue()));
}

function decodeText(value) {
  if (!String(value || "").trim()) return "";
  const encoded = fromBase64Url(value);
  return new TextDecoder().decode(feistel(transformBytes(encoded, secretValue()), secretValue(), true));
}

function syncFromEncode() {
  if (updating) return;
  updating = true;
  lastSource = "encode";
  try {
    decodeInput.value = encodeText(encodeInput.value);
    statusEl.textContent = "Encoded.";
  } catch {
    statusEl.textContent = "Could not encode.";
  }
  updating = false;
}

function syncFromDecode() {
  if (updating) return;
  updating = true;
  lastSource = "decode";
  try {
    encodeInput.value = decodeText(decodeInput.value);
    statusEl.textContent = "Decoded.";
  } catch {
    statusEl.textContent = "Decode text is not valid for this secret thing.";
  }
  updating = false;
}

async function copyValue(input, label) {
  const value = input.value;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      input.focus();
      input.select();
      document.execCommand("copy");
      input.setSelectionRange(input.value.length, input.value.length);
    }
    statusEl.textContent = `${label} copied.`;
  } catch {
    statusEl.textContent = `Could not copy ${label.toLowerCase()}.`;
  }
}

encodeInput.addEventListener("input", syncFromEncode);
decodeInput.addEventListener("input", syncFromDecode);
copyEncodeButton.addEventListener("click", () => copyValue(encodeInput, "Encode"));
copyDecodeButton.addEventListener("click", () => copyValue(decodeInput, "Decode"));
secretInput.addEventListener("input", () => {
  if (lastSource === "decode") syncFromDecode();
  else syncFromEncode();
});

secretInput.value = "0";
syncFromEncode();
