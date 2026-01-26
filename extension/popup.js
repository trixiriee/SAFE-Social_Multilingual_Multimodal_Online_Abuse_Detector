document.getElementById("scanBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    // Inject content script explicitly
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    // Send message AFTER injection
    chrome.tabs.sendMessage(tab.id, { type: "SCAN_PAGE" });
  } catch (err) {
    console.error("Injection failed:", err);
  }
});


document.getElementById("resetBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "RESET_PAGE" });
  });
});
