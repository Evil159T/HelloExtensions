document.getElementById('clickMe').addEventListener('click', () => {
    chrome.storage.local.get(['totalClicks'], (result) => {
      let current = result.totalClicks || 0;
      chrome.storage.local.set({ totalClicks: current + 1 }, () => {
        document.getElementById('clickCount').textContent = current + 1;
      });
    });
  });
  
  // Al abrir el popup, mostramos el número actual
  chrome.storage.local.get(['totalClicks'], (result) => {
    document.getElementById('clickCount').textContent = result.totalClicks || 0;
  });