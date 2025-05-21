if (!document.getElementById('floatingClicker')) {
    const box = document.createElement('div');
    box.id = 'floatingClicker';
    box.innerHTML = `
      <div id="floatingHeader">🟢 Clicker (arrastrame)</div>
      <div>Clics totales: <span id="count">0</span></div>
      <button id="clickBtn">¡Click!</button>
    `;
    document.body.appendChild(box);
  
    // Posicionar en la esquina
    box.style.top = '50px';
    box.style.left = '50px';
  
    // Arrastrar la ventana
    const header = document.getElementById("floatingHeader");
    let isDragging = false, offsetX = 0, offsetY = 0;
  
    header.onmousedown = (e) => {
      isDragging = true;
      offsetX = e.clientX - box.offsetLeft;
      offsetY = e.clientY - box.offsetTop;
    };
  
    document.onmouseup = () => (isDragging = false);
    document.onmousemove = (e) => {
      if (isDragging) {
        box.style.left = `${e.clientX - offsetX}px`;
        box.style.top = `${e.clientY - offsetY}px`;
      }
    };
  
    // Actualizar contador al cargar
    chrome.storage.local.get(['totalClicks'], (result) => {
      document.getElementById('count').textContent = result.totalClicks || 0;
    });
  
    // Sumar clic
    document.getElementById('clickBtn').onclick = () => {
      chrome.storage.local.get(['totalClicks'], (result) => {
        const total = (result.totalClicks || 0) + 1;
        chrome.storage.local.set({ totalClicks: total }, () => {
          document.getElementById('count').textContent = total;
        });
      });
    };
  }
  