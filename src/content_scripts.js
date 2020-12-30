let target;
window.addEventListener("contextmenu", (e) => {
  target = e.target;
});

const copyCommand = (sendResponse) => {
  sendResponse({
    value: target.value,
  });
};

const pasteCommand = (value) => {
  target.value = value;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "copy") {
    copyCommand(sendResponse);
  }
  if (request.command === "paste") {
    pasteCommand(request.value);
  }
});
