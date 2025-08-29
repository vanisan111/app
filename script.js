/* === Игровые данные === */
let balance = 10;
let BR = 100;
let level = 0;
let playerID = Math.floor(Math.random()*90000 + 10000);
let referrals = {};
let lands = [true,false,false,false,false,false,false,false,false];

/* === Энергия === */
let maxEnergy = 100;
let energy = maxEnergy;
let clickBR = 0.01;
let clickCost = 2;
let energyRegenInterval = 5000; // каждые 5 секунд

/* === Управление экранами === */
function showForm(type){
  document.getElementById('auth-choice-screen').style.display='none';
  document.getElementById('login-screen').style.display='none';
  document.getElementById('register-screen').style.display='none';
  if(type==='login') document.getElementById('login-screen').style.display='flex';
  if(type==='register') document.getElementById('register-screen').style.display='flex';
}

function backToChoice(){
  document.getElementById('login-screen').style.display='none';
  document.getElementById('register-screen').style.display='none';
  document.getElementById('auth-choice-screen').style.display='flex';
}

/* === Уровень === */
function renderLevel(current,max=10){
  level = current;
  const bar = document.getElementById('level-bar');
  const progress = document.getElementById('level-progress');
  bar.innerHTML='';
  for(let i=1;i<=max;i++){
    const s = document.createElement('span');
    s.innerText='👤';
    if(i<=current) s.classList.add('active');
    bar.appendChild(s);
  }
  progress.innerText=current+' / '+max;
}

function updateBR(){ document.getElementById('navbar-br').innerText='⚔️ BR: '+BR.toFixed(2); }

/* === Логин / Регистрация === */
function login(){
  const username = document.getElementById('login-username').value || 'Игрок';
  document.getElementById('navbar-username').innerText='👤 '+username;
  document.getElementById('login-screen').style.display='none';
  document.getElementById('main-screen').style.display='flex';
  renderLevel(0,10);
  updateBR();
}

function register(){
  const username = document.getElementById('reg-username').value || 'Игрок';
  const alliance = document.getElementById('reg-alliance').value || '-';
  const urlParams = new URLSearchParams(window.location.search);
  const refID = urlParams.get('ref');
  if(refID) referrals[refID]=username;
  document.getElementById('navbar-username').innerText='👤 '+username+' ['+alliance+']';
  document.getElementById('register-screen').style.display='none';
  document.getElementById('main-screen').style.display='flex';
  renderLevel(0,10);
  updateBR();
}

/* === Контент === */
function showContent(type){
  const contentBox = document.getElementById('content-box');
  contentBox.innerHTML='<div id="main-text"></div>';
  const mainText = document.getElementById('main-text');

  if(type==='palace'){
    mainText.innerHTML=`ℹ️ <b>Дворец</b><br><br>
      👤 Имя: ${document.getElementById("navbar-username").innerText.replace("👤 ","")}<br>
      💰 Баланс (TON): ${balance}<br>
      ⚔️ BR: ${BR.toFixed(2)}<br>
      🆔 ID: #${playerID}`;

    // кнопка клика по дворцу
    let clickBtn = document.createElement('button');
    clickBtn.innerText=`Нажать на дворец (+${clickBR} BR, -${clickCost}⚡)`;
    clickBtn.style.marginTop='10px';
    clickBtn.onclick=palaceClick;
    mainText.appendChild(clickBtn);

    updateEnergyDisplay();
  }
  // остальной функционал вкладок оставляем без изменений
}

/* === Клик по дворцу === */
function palaceClick(){
  if(energy < clickCost){ alert('Недостаточно энергии!'); return; }
  energy -= clickCost;
  BR += clickBR;
  updateBR();
  updateEnergyDisplay();
}

/* === Энергия === */
function updateEnergyDisplay(){
  const contentBox = document.getElementById('content-box');
  let energyDiv = document.getElementById('energy-display');
  if(!energyDiv){
    energyDiv = document.createElement('div');
    energyDiv.id='energy-display';
    energyDiv.style.marginTop='10px';
    energyDiv.style.fontWeight='bold';
    contentBox.prepend(energyDiv);
  }
  energyDiv.innerText=`⚡ Энергия: ${energy} / ${maxEnergy}`;
}

function regenEnergy(){
  if(energy < maxEnergy){ energy++; updateEnergyDisplay(); }
}
setInterval(regenEnergy, energyRegenInterval);

/* === Инициализация === */
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('auth-choice-screen').style.display='flex';
});
