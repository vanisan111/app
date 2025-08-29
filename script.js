let balance = 10;
let BR = 100;
let level = 0;
let playerID = Math.floor(Math.random()*90000 + 10000);
let referrals = {};
let lands = [true,false,false,false,false,false,false,false,false];

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
  level = current;
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
  document.getElementById('navbar-br').innerText = '⚔️ BR: ' + BR.toFixed(1);
}

function login(){
  const username = document.getElementById('login-username').value || 'Игрок';
  document.getElementById('navbar-username').innerText = '👤 ' + username;
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('main-screen').style.display = 'flex';
  renderLevel(0,10);
  updateBR();
}

function register(){
  const username = document.getElementById('reg-username').value || 'Игрок';
  const alliance = document.getElementById('reg-alliance').value || '-';
  const urlParams = new URLSearchParams(window.location.search);
  const refID = urlParams.get('ref');
  if(refID){ referrals[refID] = username; }
  document.getElementById('navbar-username').innerText = '👤 ' + username + ' [' + alliance + ']';
  document.getElementById('register-screen').style.display = 'none';
  document.getElementById('main-screen').style.display = 'flex';
  renderLevel(0,10);
  updateBR();
}

function showContent(type){
  const contentBox = document.getElementById('content-box');
  contentBox.innerHTML = '<div id="main-text"></div>';
  const mainText = document.getElementById('main-text');

  if(type === 'palace'){
    mainText.innerHTML = `ℹ️ <b>Дворец</b><br><br>
      👤 Имя: ${document.getElementById("navbar-username").innerText.replace("👤 ","")}<br>
      🤝 Рефер мастер: - <br>
      💰 Баланс (TON): ${balance}<br>
      📅 Дата регистрации: ${new Date().toLocaleDateString()}<br>
      🆔 Telegram ID: #${playerID}<br>
      ⚔️ BR: ${BR.toFixed(1)}`;
  }
  else if(type === 'referrals'){
    mainText.innerHTML = `👥 <b>Рефералы</b><br><br>
      Ваш ID: <input type="text" id="player-id" value="${playerID}" readonly style="width:120px;">
      <button onclick="copyReferral()">Копировать ссылку</button>
      <div id="ref-list" style="margin-top:10px;"></div>`;
    updateReferralList();
  }
  else if(type === 'balance'){
    mainText.innerHTML = `💰 <b>Баланс</b><br><br> Ваш баланс: ${balance} TON.`;
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
      <button onclick="buyItem(3,5,'Магическая защита')">🔮 Магическая защита (3 TON → +5% BR)</button>
    `;
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
      Так же есть внутриигровые покупки и NFT торговля.`;
  }
}

function buyItem(cost, percent, name){
  if(balance < cost){ alert('Недостаточно TON'); return; }
  balance -= cost;
  BR += BR * (percent/100);
  updateBR();
  alert('Куплено: ' + name);
  showContent('shop');
}

function copyReferral(){
  const link = `${window.location.origin}${window.location.pathname}?ref=${playerID}`;
  navigator.clipboard.writeText(link).then(()=>alert('Ссылка скопирована в буфер'));
}
function updateReferralList(){
  const div = document.getElementById('ref-list');
  if(!div) return;
  const keys = Object.keys(referrals);
  if(keys.length===0) div.innerText = 'Пока нет рефералов';
  else { div.innerHTML = '<ul>' + keys.map(k=>`<li>${k} → ${referrals[k]}</li>`).join('') + '</ul>'; }
}

function withdraw(){ alert('Вывод средств (демо)'); }
function deposit(){ balance += 5; alert('Пополнение +5 TON'); showContent('balance'); }

function buyLand(index){
  if(lands[index]) return;
  const ownedCount = lands.filter(x=>x).length;
  const cost = 5 * ownedCount;
  if(balance < cost){ alert('Недостаточно TON для покупки земли!'); return; }
  balance -= cost;
  lands[index] = true;
  alert(`Куплено поле #${index+1} за ${cost} TON`);
  showContent('shop');
}

document.addEventListener('DOMContentLoaded', ()=>{
  const urlParams = new URLSearchParams(window.location.search);
  const refID = urlParams.get('ref');
  if(refID){
    if(referrals[refID]){ console.log('Ref param', refID, 'is known:', referrals[refID]); }
    else { console.log('Ref param present but unknown:', refID); }
  }

let energy = 100;
const maxEnergy = 100;

// Энергия реген
setInterval(()=>{
  if(energy < maxEnergy) {
    energy++;
    updateEnergyDisplay();
  }
}, 5000);

// Создаем элемент для отображения энергии
const palace = document.querySelector('.emoji-circle');
const energyDisplay = document.createElement('div');
energyDisplay.id = 'energy-display';
energyDisplay.innerText = `⚡ Энергия: ${energy}`;
palace.appendChild(energyDisplay);

function updateEnergyDisplay(){
  energyDisplay.innerText = `⚡ Энергия: ${energy}`;
}

// Функция тапа по дворцу
palace.addEventListener('click', ()=>{
  if(energy < 2) { alert('Недостаточно энергии!'); return; }
  energy -= 2;
  BR += 0.05;
  updateEnergyDisplay();
  updateBR();
  showSwordAnimation();
});

// Анимация мечей
function showSwordAnimation(){
  const sword = document.createElement('div');
  sword.className = 'sword-tap';
  sword.innerText = '⚔️';
  sword.style.left = (50 + (Math.random()*40-20)) + '%'; // немного рандомим позицию
  palace.appendChild(sword);
  setTimeout(()=>{ sword.remove(); }, 800);
}

});

