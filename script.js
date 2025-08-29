let balance = 10;
let BR = 100;
let level = 0;
let playerID = Math.floor(Math.random()*90000 + 10000);
let referrals = {};
let lands = [true,false,false,false,false,false,false,false,false];

/* Энергия и клик по дворцу */
let energy = 100;
const maxEnergy = 100;
const clickCost = 2;
const brPerClick = 0.01;

function palaceClick(){
    if(energy < clickCost){ alert("Недостаточно энергии!"); return; }
    energy -= clickCost;
    BR += brPerClick;
    updateBR();
    updateEnergyDisplay();
}

setInterval(()=>{
    if(energy < maxEnergy){
        energy += 1;
        if(energy > maxEnergy) energy = maxEnergy;
        updateEnergyDisplay();
    }
},5000);

function updateEnergyDisplay(){
    const navbar = document.querySelector('.user-info');
    let el = document.getElementById('navbar-energy');
    if(!el){
        el = document.createElement('div');
        el.id = 'navbar-energy';
        el.style.fontWeight = 'bold';
        navbar.appendChild(el);
    }
    el.innerText = `⚡ Энергия: ${energy}`;
}

/* === UI === */
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
function renderLevel(current,max=10){
  level = current;
  const bar = document.getElementById('level-bar');
  const progress = document.getElementById('level-progress');
  bar.innerHTML='';
  for(let i=1;i<=max;i++){
    const s=document.createElement('span');
    s.innerText='👤';
    if(i<=current) s.classList.add('active');
    bar.appendChild(s);
  }
  progress.innerText = current+' / '+max;
}
function updateBR(){ document.getElementById('navbar-br').innerText='⚔️ BR: '+BR.toFixed(1); }

function login(){
  const username = document.getElementById('login-username').value || 'Игрок';
  document.getElementById('navbar-username').innerText='👤 '+username;
  document.getElementById('login-screen').style.display='none';
  document.getElementById('main-screen').style.display='flex';
  renderLevel(0,10);
  updateBR();
  updateEnergyDisplay();
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
  updateEnergyDisplay();
}

/* Вкладки */
function showContent(type){
  const contentBox = document.getElementById('content-box');
  contentBox.innerHTML='<div id="main-text"></div>';
  const mainText = document.getElementById('main-text');
  if(type==='palace'){
    mainText.innerHTML=`ℹ️ <b>Дворец</b><br><br>
      👤 Имя: ${document.getElementById("navbar-username").innerText.replace("👤 ","")}<br>
      🤝 Рефер мастер: - <br>
      💰 Баланс (TON): ${balance}<br>
      📅 Дата регистрации: ${new Date().toLocaleDateString()}<br>
      🆔 Telegram ID: #${playerID}<br>
      ⚔️ BR: ${BR.toFixed(1)}`;
  }
  else if(type==='referrals'){ mainText.innerHTML=`...`; }
  else if(type==='balance'){ mainText.innerHTML=`...`; }
  else if(type==='rating'){ mainText.innerHTML=`...`; }
  else if(type==='shop'){ mainText.innerHTML=`...`; }
  else if(type==='rules'){ mainText.innerHTML=`...`; }
}

/* Магазин, Рефералы, Баланс, Земли — оставляем как есть (код с предыдущего) */

/* === Привязка клика по дворцу === */
document.addEventListener('DOMContentLoaded', ()=>{
  const castle = document.querySelector('.emoji-circle img');
  if(castle) castle.addEventListener('click', palaceClick);
});
