console.log("Cyberbullying content script injected");

/* ---------- GLOBAL GUARD ---------- */
if (!window.__cyberbullyingInjected) {
  window.__cyberbullyingInjected = true;
  window.originalStyles = new Map();
}

/* ---------- UTILS ---------- */
function getOrCreateId(el, prefix) {
  if (!el.dataset.cyberUid) {
    el.dataset.cyberUid = prefix + "_" + crypto.randomUUID();
  }
  return el.dataset.cyberUid;
}

/* ---------- TEXT EXTRACTION ---------- */
function extractTextNodes() {
  const elements = document.querySelectorAll("p, div, span");
  const messages = [];

  elements.forEach(el => {
    const text = el.innerText?.trim();
    if (!text || text.length < 4) return;

    const id = getOrCreateId(el, "text");

    if (!window.originalStyles.has(id)) {
      window.originalStyles.set(id, {
        display: el.style.display,
        filter: el.style.filter,
        background: el.style.background,
        border: el.style.border
      });
    }

    messages.push({ id, text });
  });

  return messages;
}

/* ---------- IMAGE EXTRACTION ---------- */
function extractImages() {
  const imgs = document.querySelectorAll("img");
  const images = [];

  imgs.forEach(img => {
    if (!img.src) return;

    const id = getOrCreateId(img, "img");

    if (!window.originalStyles.has(id)) {
      window.originalStyles.set(id, {
        display: img.style.display,
        filter: img.style.filter,
        border: img.style.border
      });
    }

    images.push({ id, src: img.src });
  });

  return images;
}

/* ---------- APPLY ACTIONS ---------- */
function applyTextAction(el, action) {
  if (action === "block") el.style.display = "none";
  if (action === "blur") el.style.filter = "blur(6px)";
  if (action === "warn") el.style.background = "rgba(255,0,0,0.25)";
}

function applyImageAction(img, action) {
  if (action === "block") img.style.display = "none";
  if (action === "blur") img.style.filter = "blur(12px)";
  if (action === "warn") img.style.border = "4px solid red";
}

/* ---------- MESSAGE HANDLER ---------- */
chrome.runtime.onMessage.addListener((msg) => {

  if (msg.type === "SCAN_PAGE") {
    chrome.runtime.sendMessage({
      type: "SEND_TO_BACKEND",
      messages: extractTextNodes(),
      images: extractImages()
    });
  }

  if (msg.type === "APPLY_DECISIONS") {
    msg.decisions.forEach(d => {

      const el = document.querySelector(`[data-cyber-uid="${d.id}"]`);
      if (!el) return;

      if (d.item_type === "text") applyTextAction(el, d.action);
      if (d.item_type === "image") applyImageAction(el, d.action);
    });
  }

  if (msg.type === "RESET_PAGE") {
    window.originalStyles.forEach((styles, id) => {
      const el = document.querySelector(`[data-cyber-uid="${id}"]`);
      if (!el) return;

      el.style.display = styles.display;
      el.style.filter = styles.filter;
      el.style.background = styles.background || "";
      el.style.border = styles.border || "";
    });
  }
});
