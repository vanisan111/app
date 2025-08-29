let balance = 10;
let BR = 100;
let level = 0;
let playerID = Math.floor(Math.random()*90000 + 10000);
let referrals = {};
let lands = [true,false,false,false,false,false,false,false,false];

function showForm(type){
  document.getElementById('auth-choice-screen').style.display='none';
  if(type==='login') document.getElementById('login-screen').style.display='flex';
  else document.getElementById('register-screen').style.display='flex';
}
function backToChoice(){
  document.getElementById('login-screen').style.display='none';
  document.getElementById('register-screen').style.display='none';
  document.getElementById('auth-choice-screen').style.display='flex';
}
function renderLevel(current,max=10){
  level=current;
  const bar = document.getElementById('level-bar');
  const progress = document.getElementById('level-progress');
  bar.innerHTML='';
  for(let i=1;i<=max;i++){
    const s=document.createElement('span');
    s.innerText='👤';
    if(i<=current) s.classList.add('active');
    bar.appendChild(s);
  }
  progress.innerText=current+' / '+max;
}
function updateBR(){ document.getElementById('navbar-br').innerText='⚔️ BR: '+BR.toFixed(1); }
function login(){
  const username=document.getElementById('login-username').value || 'Игрок';
  document.getElementById('navbar-username').innerText='👤 '+username;
  document.getElementById('login-screen').style.display='none';
  document.getElementById('main-screen').style.display='flex';
  renderLevel(0,10);
  updateBR();
}
function register(){
  const username=document.getElementById('reg-username').value || 'Игрок';
  const alliance=document.getElementById('reg-alliance').value || '-';
  const urlParams=new URLSearchParams(window.location.search);
  const refID=urlParams.get('ref');
  if(refID) referrals[refID]=username;
  document.getElementById('navbar-username').innerText='👤 '+username+' ['+alliance+']';
  document.getElementById('register-screen').style.display='none';
  document.getElementById('main-screen').style.display='flex';
  renderLevel(0,10);
  updateBR();
}

function showContent(type){
  const contentBox=document.getElementById('content-box');
  contentBox.innerHTML='<div id="main-text"></div>';
  const mainText=document.getElementById('main-text');

  if(type==='palace'){
    mainText.innerHTML=`ℹ️ <b>Дворец</b><br><br>
      👤 Имя: ${document.getElementById("navbar-username").innerText.replace("👤 ","")}<br>
      💰 Баланс (TON): ${balance}<br>
      ⚔️ BR: ${BR.toFixed(1)}`;
  }
  else if(type==='referrals'){ mainText.innerHTML='Рефералы'; }
  else if(type==='balance'){ mainText.innerHTML='Баланс'; }
  else if(type==='rating'){ mainText.innerHTML='Рейтинг'; }
  else if(type==='shop'){ mainText.innerHTML='Магазин'; }
  else if(type==='rules'){ mainText.innerHTML='Правила'; }
}
