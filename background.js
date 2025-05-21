let injectedTabs = {};

chrome.action.onClicked.addListener((tab) => {
  const tabId = tab.id;

  if (injectedTabs[tabId]) {
    // Quitar la ventanita
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const el = document.getElementById('floatingClicker');
        if (el) el.remove();
      }
    });
    delete injectedTabs[tabId];
  } else {
    // Inyectar script y estilo
    chrome.scripting.insertCSS({
      target: { tabId },
      files: ["styles.css"]
    });

    chrome.scripting.executeScript({
      target: { tabId },
      files: ["floating.js"]
    });

    injectedTabs[tabId] = true;
  }
});
