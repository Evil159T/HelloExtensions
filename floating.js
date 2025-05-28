if (!document.getElementById('floatingClicker')) {
  const box = document.createElement('div');
  box.id = 'floatingClicker';
  box.innerHTML = `
    <div id="floatingHeader">🟢 Clicker (arrastrame)</div>
    <div id="clickerContent">
      <div>Clics totales: <span id="count">0</span></div>
      <img src="${chrome.runtime.getURL('clicker.png')}" id="clickImg" />
      <button id="shopToggle">SHOP</button>
    </div>
    <div id="shopPanel" style="display:none;">
      <h3>Tienda de mejoras</h3>
      <ul id="upgradeList"></ul>
      <div id="errorMsg">¡No tienes suficientes clics!</div>
    </div>
  `;
  document.body.appendChild(box);

  const upgrades = [
    {
      id: 'betterMouse',
      name: 'Better Mouse',
      baseCost: 25,
      effect: 'click',
      amount: 1,
      description: '+1 clic por clic'
    },
    {
      id: 'cryptoMiner',
      name: 'Crypto Miner',
      baseCost: 50,
      effect: 'auto',
      amount: 1,
      description: '+1 clic automático por segundo'
    },
    {
      id: 'optimizationPC',
      name: 'Optimization PC',
      baseCost: 250,
      effect: 'multiplier',
      amount: 2,
      description: 'Duplica la eficacia de las mejoras'
    }
  ];


  const state = {
    totalClicks: 0,
    clickPower: 1,
    autoClick: 0,
    multiplier: 1,
    upgradeLevels: {}
  };

  chrome.storage.local.get(null, (data) => {
    state.totalClicks = data.totalClicks || 0;
    state.upgradeLevels = data.upgradeLevels || {};
    state.clickPower = data.clickPower || 1;
    state.autoClick = data.autoClick || 0;
    state.multiplier = data.multiplier || 1;

    document.getElementById('count').textContent = Math.floor(state.totalClicks);
    renderUpgrades();
    autoClickLoop();
  });

  function save() {
    chrome.storage.local.set({
      totalClicks: state.totalClicks,
      upgradeLevels: state.upgradeLevels,
      clickPower: state.clickPower,
      autoClick: state.autoClick,
      multiplier: state.multiplier
    });
  }

  const clickImg = document.getElementById('clickImg');
  clickImg.addEventListener('click', () => {
    clickImg.classList.add('clicked');
    const gain = state.clickPower * state.multiplier;
    state.totalClicks += gain;
    document.getElementById('count').textContent = Math.floor(state.totalClicks);
    save();
    setTimeout(() => clickImg.classList.remove('clicked'), 150);
  });

  function autoClickLoop() {
    setInterval(() => {
      if (state.autoClick > 0) {
        const gain = state.autoClick * state.multiplier;
        state.totalClicks += gain;
        document.getElementById('count').textContent = Math.floor(state.totalClicks);
        save();
      }
    }, 1000);
  }

  function renderUpgrades() {
    const list = document.getElementById('upgradeList');
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.style.display = 'none';
    list.innerHTML = '';

    upgrades.forEach(upg => {
      const level = state.upgradeLevels[upg.id] || 0;
      const cost = upg.baseCost * Math.pow(2, level);

      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${upg.name}</strong> - ${cost} clics<br>
        <div class="upgrade-tooltip">${upg.description}</div>
        <button data-id="${upg.id}">Comprar</button>
      `;
      list.appendChild(li);

      const btn = li.querySelector('button');
      btn.addEventListener('click', () => {
        if (state.totalClicks >= cost) {
          state.totalClicks -= cost;
          state.upgradeLevels[upg.id] = level + 1;

          if (upg.effect === 'click') state.clickPower += upg.amount;
          else if (upg.effect === 'auto') state.autoClick += upg.amount;
          else if (upg.effect === 'multiplier') state.multiplier *= upg.amount;

          document.getElementById('count').textContent = Math.floor(state.totalClicks);
          errorMsg.style.display = 'none';
          renderUpgrades();
          save();
        } else {
          errorMsg.style.display = 'block';
          btn.classList.add('shake');
          setTimeout(() => btn.classList.remove('shake'), 400);
        }
      });
    });
  }

  document.getElementById('shopToggle').addEventListener('click', () => {
    const shop = document.getElementById('shopPanel');
    shop.style.display = shop.style.display === 'none' ? 'block' : 'none';
  });

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
}
