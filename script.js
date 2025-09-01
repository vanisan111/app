let playerData = null;
let lands = [true,false,false,false,false,false,false,false,false];
let energy = 100;
const maxEnergy = 100;
const SERVER = 'https://d72b5594823a.ngrok-free.app'; // твой ngrok публичный URL

function showForm(type){
  document.getElementById('auth-choice-screen').style.display='none';
  if(type === 'login') document.getElementById('login-screen').style.display='flex';
  else document.getElementById('register-screen').style.display='flex';
}

function backToChoice(){
  document.getElementById('login-screen').style.display='none';
  document.getElementById('register-screen').style.display='none';
  document.getElementById('auth-choice-screen').style.display='flex';
}

function renderLevel(current, max=10){
  const bar = document.getElementById('level-bar');
  const progress = document.getElementById('level-progress');
  bar.innerHTML = '';
  for(let i=1;i<=max;i++){
    const s = document.createElement('span');
    s.innerText = '👤';
    if(i <= current) s.classList.add('active');
    bar.appendChild(s);
  }
  progress.innerText = current + ' / ' + max;
}

function updateBR(){
  if(playerData) document.getElementById('navbar-br').innerText = '⚔️ BR: ' + playerData.BR.toFixed(1);
}

function login(){
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  fetch(`${SERVER}/api/login`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,password})
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.error) alert(data.error);
    else {
      playerData = data;
      lands = Array.isArray(playerData.lands) ? playerData.lands : JSON.parse(playerData.lands||'[]');
      playerData.referrals = Array.isArray(playerData.referrals) ? playerData.referrals : JSON.parse(playerData.referrals||'[]');
      document.getElementById('navbar-username').innerText = '👤 ' + playerData.username + ' [' + (playerData.alliance||'-') + ']';
      document.getElementById('login-screen').style.display='none';
      document.getElementById('main-screen').style.display='flex';
      renderLevel(playerData.level);
      updateBR();
    }
  })
  .catch(err=>alert('Ошибка сервера: '+err));
}

function register(){
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;
  const alliance = document.getElementById('reg-alliance').value;

  fetch(`${SERVER}/api/register`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,password,alliance})
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.error) alert(data.error);
    else {
      alert('Регистрация успешна! Теперь войдите.');
      backToChoice();
    }
  })
  .catch(err=>alert('Ошибка сервера: '+err));
}

function showContent(type){
  if(!playerData) return alert('Сначала войдите в игру!');
  const contentBox = document.getElementById('content-box');
  contentBox.innerHTML = '<div id="main-text"></div>';
  const mainText = document.getElementById('main-text');

  if(type === 'palace'){
    mainText.innerHTML = `ℹ️ <b>Дворец</b><br><br>
      👤 Имя: ${playerData.username}<br>
      🤝 Рефер мастер: - <br>
      💰 Баланс (TON): ${playerData.balance}<br>
      📅 Дата регистрации: ${new Date(playerData.created_at).toLocaleDateString()}<br>
      🆔 ID: #${playerData.id}<br>
      ⚔️ BR: ${playerData.BR.toFixed(1)}`;
  }
  else if(type === 'referrals'){
    mainText.innerHTML = `👥 <b>Рефералы</b><br><br>
      Ваш ID: <input type="text" id="player-id" value="${playerData.id}" readonly style="width:120px;">
      <button onclick="copyReferral()">Копировать ссылку</button>
      <div id="ref-list" style="margin-top:10px;"></div>`;
    updateReferralList();
  }
  else if(type === 'balance'){
    mainText.innerHTML = `💰 <b>Баланс</b><br><br> Ваш баланс: ${playerData.balance} TON.`;
    const sub = document.createElement('div');
    sub.className = 'sub-buttons';
    sub.innerHTML = `<button onclick="withdraw()">Вывод</button><button onclick="deposit()">Пополнение</button>`;
    contentBox.appendChild(sub);
  }
  else if(type === 'rating'){
    mainText.innerHTML = `🏆 <b>Рейтинг</b><br><br>`;
    const table = document.createElement('table');
    table.innerHTML = `<thead><tr><th>№</th><th>Имя</th><th>Боевая сила</th><th>Участники</th></tr></thead>
      <tbody>
      ${Array.from({length:10},(_,i)=>`<tr><td>${i+1}</td><td>Игрок${i+1}</td><td>${Math.floor(Math.random()*1000)+100}</td><td>${Math.floor(Math.random()*50)+1}</td></tr>`).join('')}
      </tbody>`;
    contentBox.appendChild(table);
  }
  else if(type === 'shop'){
    mainText.innerHTML = `🛒 <b>Магазин</b><br><br>`;
    const shopDiv = document.createElement('div');
    shopDiv.className = 'sub-buttons';
    shopDiv.innerHTML = `
      <button onclick="buyItem(1,0.5,'Укрепление дворца')">🏰 Укрепление дворца (1 TON → +0.5% BR)</button>
      <button onclick="buyItem(2,1.5,'Тренировка армии')">⚔️ Тренировка армии (2 TON → +1.5% BR)</button>
      <button onclick="buyItem(3,5,'Магическая защита')">🔮 Магическая защита (3 TON → +5% BR)</button>`;
    contentBox.appendChild(shopDiv);

    const grid = document.createElement('div');
    grid.className = 'shop-grid';
    for(let i=0;i<9;i++){
      const cell = document.createElement('div');
      cell.innerText = '🏡';
      if(lands[i]) cell.classList.add('owned');
      const ownedCount = lands.filter(x=>x).length;
      const nextCost = 5 * ownedCount;
      if(!lands[i]) cell.title = `Купить за ${nextCost} TON`;
      cell.onclick = ()=> { buyLand(i); };
      grid.appendChild(cell);
    }
    contentBox.appendChild(grid);
  }
  else if(type === 'rules'){
    mainText.innerHTML = `<b>Правила</b><br><br>
      Каждый игрок может войти в игру бесплатно.<br>
      При игре он получает феод в распоряжение.<br>
      Максимум 10 рефералов без возможности вывода средств TON.<br>
      Для вывода нужно стать бароном - донат 7 TON.<br>
      Также есть внутриигровые покупки и NFT торговля.`;
  }
}

function buyItem(cost, percent, name){
  if(playerData.balance < cost){ alert('Недостаточно TON'); return; }
  playerData.balance -= cost;
  playerData.BR += playerData.BR * (percent/100);
  updateBR();
  savePlayerData();
  alert('Куплено: ' + name);
  showContent('shop');
}

function copyReferral(){
  const link = `${window.location.origin}${window.location.pathname}?ref=${playerData.id}`;
  navigator.clipboard.writeText(link).then(()=>alert('Ссылка скопирована в буфер'));
}

function updateReferralList(){
  const div = document.getElementById('ref-list');
  if(!div) return;
  const keys = playerData.referrals || [];
  if(keys.length===0) div.innerText = 'Пока нет рефералов';
  else { div.innerHTML = '<ul>' + keys.map(k=>`<li>${k}</li>`).join('') + '</ul>'; }
}

function withdraw(){ alert('Вывод средств (демо)'); }
function deposit(){ playerData.balance += 5; alert('Пополнение +5 TON'); showContent('balance'); }
function buyLand(index){
  if(lands[index]) return;
  const ownedCount = lands.filter(x=>x).length;
  const cost = 5 * ownedCount;
  if(playerData.balance < cost){ alert('Недостаточно TON для покупки земли!'); return; }
  playerData.balance -= cost;
  lands[index] = true;
  savePlayerData();
  alert(`Куплено поле #${index+1} за ${cost} TON`);
  showContent('shop');
}

// Сохраняем данные игрока на сервере
function savePlayerData(){
  fetch(`${SERVER}/api/save/${playerData.id}`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({BR: playerData.BR, balance: playerData.balance, level: playerData.level, lands, referrals: playerData.referrals})
  });
}

// Энергия реген
document.addEventListener('DOMContentLoaded', ()=>{
  setInterval(()=>{ if(energy < maxEnergy){ energy++; updateEnergyDisplay(); } },5000);

  const palace = document.querySelector('.emoji-circle');
  const energyDisplay = document.createElement('div');
  energyDisplay.id = 'energy-display';
  energyDisplay.innerText = `⚡ Энергия: ${energy}`;
  palace.appendChild(energyDisplay);

  function updateEnergyDisplay(){ energyDisplay.innerText = `⚡ Энергия: ${energy}`; }

  palace.addEventListener('click', ()=>{
    if(energy < 2) { alert('Недостаточно энергии!'); return; }
    energy -= 2;
    playerData.BR += 0.05;
    updateEnergyDisplay();
    updateBR();
    showSwordAnimation();
    savePlayerData();
  });

  function showSwordAnimation(){
    const sword = document.createElement('div');
    sword.className = 'sword-tap';
    sword.innerText = '⚔️';
    sword.style.left = (50 + (Math.random()*40-20)) + '%';
    palace.appendChild(sword);
    setTimeout(()=>{ sword.remove(); },800);
  }
});

