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

const copyCommand = (tab) => {
  chrome.tabs.sendMessage(tab.id, { command: "copy" }, (response) => {
    const el = document.createElement("textarea");
    el.value = response.value;
    document.body.append(el);
    el.select();
    document.execCommand("copy");
    el.remove();
  });
};

const pasteCommand = (tab) => {
  const el = document.createElement("textarea");
  document.body.append(el);
  el.select();
  document.execCommand("paste");
  const value = el.value;
  el.remove();
  chrome.tabs.sendMessage(tab.id, { command: "paste", value: value });
};

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab) {
    return;
  }
  if (info.menuItemId === "copy") {
    copyCommand(tab);
  }
  if (info.menuItemId === "paste") {
    pasteCommand(tab);
  }
});
