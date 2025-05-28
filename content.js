document.addEventListener('click', () => {
  chrome.storage.local.get(['totalClicks'], (result) => {
    chrome.storage.local.set({ totalClicks: (result.totalClicks || 0) + 1 });
    
  });
});
