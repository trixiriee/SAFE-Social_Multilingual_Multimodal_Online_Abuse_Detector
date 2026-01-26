chrome.runtime.onMessage.addListener((req, sender) => {
  if (req.type === "SEND_TO_BACKEND") {
    console.log(req.images);

    fetch("http://localhost:8000/analyze_page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: req.messages || [],
        images: req.images || []
      })
    })
      .then(res => res.json())
      .then(data => {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: "APPLY_DECISIONS",
          decisions: data.decisions
        });
      })
      .catch(err => console.error("Backend error:", err));
  }
});
