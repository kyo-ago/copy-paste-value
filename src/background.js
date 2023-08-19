(async () => {
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: "copy",
    title: "copy",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "paste",
    title: "paste",
    contexts: ["all"],
  });
})();

const copyCommand = async (tab, frameId) => {
  const response = await chrome.tabs.sendMessage(
    tab.id,
    { command: "copy" },
    {
      frameId,
    },
  );
  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification: "Write text to the clipboard.",
  });
  chrome.runtime.sendMessage({
    type: "copy",
    target: "offscreen-doc",
    data: response.value,
  });
};

const pasteCommand = async (tab, frameId) => {
  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification: "Copy text from the clipboard.",
  });
  const response = await chrome.runtime.sendMessage({
    type: "paste",
    target: "offscreen-doc",
  });
  chrome.tabs.sendMessage(
    tab.id,
    { command: "paste", value: response.value },
    {
      frameId,
    },
  );
};

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab) {
    return;
  }
  if (info.menuItemId === "copy") {
    copyCommand(tab, info.frameId);
  }
  if (info.menuItemId === "paste") {
    pasteCommand(tab, info.frameId);
  }
});
