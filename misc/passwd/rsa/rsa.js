const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64(bytes) {
  let text = "";
  bytes.forEach((byte) => { text += String.fromCharCode(byte); });
  return btoa(text);
}

document.querySelector("#rsa-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = document.querySelector("#rsa-status");
  const message = document.querySelector("#rsa-message").value;
  try {
    const keys = await crypto.subtle.generateKey(
      { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
      true,
      ["encrypt", "decrypt"],
    );
    const encrypted = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, keys.publicKey, encoder.encode(message));
    const decrypted = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, keys.privateKey, encrypted);
    document.querySelector("#rsa-encrypted").value = toBase64(new Uint8Array(encrypted));
    document.querySelector("#rsa-decrypted").value = decoder.decode(decrypted);
    status.className = "codec-status is-good";
    status.textContent = "The private key successfully decrypted the message.";
  } catch (error) {
    status.className = "codec-status is-bad";
    status.textContent = error.message || "RSA demo failed.";
  }
});
