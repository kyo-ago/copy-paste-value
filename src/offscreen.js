const textEl = document.querySelector("#text");

chrome.runtime.onMessage.addListener(
  async ({ target, type, data }, sender, sendResponse) => {
    try {
      if (target !== "offscreen-doc") {
        return;
      }
      if (type === "copy") {
        console.log("data", data);
        textEl.value = data;
        textEl.select();
        document.execCommand("copy");
        textEl.remove();
      }
      if (type === "paste") {
        textEl.select();
        document.execCommand("paste");
        sendResponse({
          value: textEl.value,
        });
        textEl.remove();
      }
    } finally {
      window.close();
    }
  },
);
