document.addEventListener('click', () => {
    chrome.storage.local.get(['totalClicks'], (result) => {
      let current = result.totalClicks || 0;
      chrome.storage.local.set({ totalClicks: current + 1 });
    });
  });
  