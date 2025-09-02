let playerData = null;
let lands = [true,false,false,false,false,false,false,false,false];
let energy = 100;
const maxEnergy = 100;
const SERVER = 'https://c3a269c94b76.ngrok-free.app'; // твой актуальный ngrok URL

// === UI ===
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

// === Уровень ===
function renderLevel(current, max=10){
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

// === BR ===
function updateBR(){
  if(!playerData) return;
  const br = typeof playerData.BR === 'number' ? playerData.BR.toFixed(1) : 100;
  document.getElementById('navbar-br').innerText='⚔️ BR: '+br;
}

// === Login ===
function login(){
  const username=document.getElementById('login-username').value.trim();
  const password=document.getElementById('login-password').value.trim();
  if(!username || !password){ alert('Заполните все поля'); return; }

  fetch(`${SERVER}/api/login`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,password})
  })
  .then(async res=>{
    if(!res.ok) throw new Error(`Сервер вернул ${res.status}`);
    return res.json();
  })
  .then(data=>{
    if(data.error) alert(data.error);
    else{
      playerData=data;
      lands = playerData.lands || lands;
      playerData.referrals = playerData.referrals || [];
      document.getElementById('navbar-username').innerText='👤 '+playerData.username+' ['+(playerData.alliance||'-')+']';
      document.getElementById('login-screen').style.display='none';
      document.getElementById('main-screen').style.display='flex';
      renderLevel(playerData.level||1);
      updateBR();
    }
  })
  .catch(err=>alert('Ошибка соединения с сервером: '+err.message));
}

// === Регистрация ===
function register(){
  const username=document.getElementById('reg-username').value.trim();
  const password=document.getElementById('reg-password').value.trim();
  const alliance=document.getElementById('reg-alliance').value.trim();
  if(!username || !password){ alert('Заполните все поля'); return; }

  fetch(`${SERVER}/api/register`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,password,alliance})
  })
  .then(async res=>{
    if(!res.ok) throw new Error(`Сервер вернул ${res.status}`);
    return res.json();
  })
  .then(data=>{
    if(data.error) alert(data.error);
    else{
      alert('Регистрация успешна! Войдите.');
      backToChoice();
    }
  })
  .catch(err=>alert('Ошибка соединения с сервером: '+err.message));
}

// === Сохраняем данные на сервер ===
function savePlayerData(){
  if(!playerData || !playerData.id) return;
  fetch(`${SERVER}/api/save/${playerData.id}`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      BR:Number(playerData.BR || 100),
      balance:Number(playerData.balance || 0),
      level:Number(playerData.level || 1),
      lands,
      referrals:playerData.referrals || []
    })
  })
  .then(async res=>{
    if(!res.ok) throw new Error(`Сервер вернул ${res.status}`);
    return res.json();
  })
  .then(data=>{
    if(data.error) console.error('Ошибка сохранения',data.error);
  })
  .catch(err=>console.error('Ошибка fetch',err));
}

// === Контент ===
function showContent(type){
  if(!playerData) return alert('Сначала войдите!');
  const contentBox=document.getElementById('content-box');
  contentBox.innerHTML='<div id="main-text"></div>';
  const mainText=document.getElementById('main-text');

  if(type==='palace'){
    mainText.innerHTML=`ℹ️ Дворец<br><br>
      👤 Имя: ${playerData.username}<br>
      🤝 Рефер мастер: -<br>
      💰 Баланс: ${playerData.balance || 0}<br>
      📅 Дата регистрации: ${playerData.created_at ? new Date(playerData.created_at).toLocaleDateString() : '-'}<br>
      🆔 ID: #${playerData.id}<br>
      ⚔️ BR: ${(playerData.BR||100).toFixed(1)}`;
  } else if(type==='referrals'){
    mainText.innerHTML=`👥 Рефералы<br><br>
      Ваш ID: <input type="text" value="${playerData.id}" readonly style="width:120px;">
      <button onclick="copyReferral()">Копировать ссылку</button>
      <div id="ref-list" style="margin-top:10px;"></div>`;
    updateReferralList();
  } else if(type==='balance'){
    mainText.innerHTML=`💰 Баланс<br><br>Ваш баланс: ${playerData.balance || 0} TON.`;
    const sub = document.createElement('div');
    sub.className='sub-buttons';
    sub.innerHTML=`<button onclick="withdraw()">Вывод</button><button onclick="deposit()">Пополнение</button>`;
    contentBox.appendChild(sub);
  } else if(type==='rating'){
    mainText.innerHTML=`🏆 Рейтинг<br><br>`;
    fetch(`${SERVER}/api/rating`)
      .then(res=>{
        if(!res.ok) throw new Error(`Сервер вернул ${res.status}`);
        const contentType = res.headers.get("content-type");
        if(!contentType || !contentType.includes("application/json")){
          throw new Error("Ответ сервера не JSON");
        }
        return res.json();
      })
      .then(users=>{
        const table=document.createElement('table');
        table.innerHTML=`<thead><tr><th>№</th><th>Имя</th><th>BR</th><th>Баланс</th></tr></thead>
          <tbody>${users.map((u,i)=>`<tr><td>${i+1}</td><td>${u.username}</td><td>${(u.BR||0).toFixed(1)}</td><td>${u.balance||0}</td></tr>`).join('')}</tbody>`;
        contentBox.appendChild(table);
      })
      .catch(err=>{
        mainText.innerText=`Ошибка загрузки рейтинга: ${err.message}`;
      });
  } else if(type==='shop'){
    mainText.innerHTML=`🛒 Магазин<br><br>`;
    const shopDiv=document.createElement('div');
    shopDiv.className='sub-buttons';
    shopDiv.innerHTML=`
      <button onclick="buyItem(1,0.5,'Укрепление дворца')">🏰 Укрепление дворца (1 TON → +0.5% BR)</button>
      <button onclick="buyItem(2,1.5,'Тренировка армии')">⚔️ Тренировка армии (2 TON → +1.5% BR)</button>
      <button onclick="buyItem(3,5,'Магическая защита')">🔮 Магическая защита (3 TON → +5% BR)</button>`;
    contentBox.appendChild(shopDiv);

    const grid=document.createElement('div');
    grid.className='shop-grid';
    for(let i=0;i<9;i++){
      const cell=document.createElement('div');
      cell.innerText='🏡';
      if(lands[i]) cell.classList.add('owned');
      const ownedCount=lands.filter(x=>x).length;
      const nextCost=5*ownedCount;
      if(!lands[i]) cell.title=`Купить за ${nextCost} TON`;
      cell.onclick=()=>buyLand(i);
      grid.appendChild(cell);
    }
    contentBox.appendChild(grid);
  } else if(type==='rules'){
    mainText.innerHTML=`<b>Правила</b><br><br>
      Каждый игрок может войти в игру бесплатно.<br>
      Максимум 10 рефералов без возможности вывода средств TON.<br>
      Донат 7 TON для вывода.<br>
      Внутриигровые покупки и NFT торговля.`;
  }
}

// === Рефералы ===
function copyReferral(){
  navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?ref=${playerData.id}`)
    .then(()=>alert('Ссылка скопирована'));
}

function updateReferralList(){
  const div=document.getElementById('ref-list');
  if(!div) return;
  const keys=playerData.referrals||[];
  if(keys.length===0) div.innerText='Пока нет рефералов';
  else div.innerHTML='<ul>'+keys.map(k=>`<li>${k}</li>`).join('')+'</ul>';
}

// === Пополнение/вывод ===
function withdraw(){ alert('Вывод (демо)'); }
function deposit(){ playerData.balance=(playerData.balance||0)+5; alert('Пополнение +5 TON'); showContent('balance'); }

// === Покупки ===
function buyItem(cost, percent, name){
  if(playerData.balance<cost){ alert('Недостаточно TON'); return; }
  playerData.balance-=cost;
  playerData.BR+=(playerData.BR || 100)*(percent/100);
  updateBR();
  savePlayerData();
  alert('Куплено: '+name);
  showContent('shop');
}

function buyLand(index){
  if(lands[index]) return;
  const ownedCount = lands.filter(x=>x).length;
  const cost = 5 * ownedCount;
  if(playerData.balance<cost){ alert('Недостаточно TON'); return; }
  playerData.balance-=cost;
  lands[index]=true;
  savePlayerData();
  alert(`Куплено поле #${index+1} за ${cost} TON`);
  showContent('shop');
}

// === Энергия и клики по дворцу ===
document.addEventListener('DOMContentLoaded',()=>{
  setInterval(()=>{ if(energy<maxEnergy){ energy++; updateEnergyDisplay(); } },5000);

  const palace=document.querySelector('.emoji-circle');
  const energyDisplay=document.createElement('div');
  energyDisplay.id='energy-display';
  energyDisplay.innerText=`⚡ Энергия: ${energy}`;
  palace.appendChild(energyDisplay);

  function updateEnergyDisplay(){ energyDisplay.innerText=`⚡ Энергия: ${energy}`; }

  palace.addEventListener('click',()=>{
    if(energy<2){ alert('Недостаточно энергии!'); return; }
    energy-=2;
    playerData.BR=(playerData.BR||100)+0.05;
    updateEnergyDisplay();
    updateBR();
    showSwordAnimation();
    savePlayerData();
  });

  function showSwordAnimation(){
    const sword=document.createElement('div');
    sword.className='sword-tap';
    sword.innerText='⚔️';
    sword.style.left=(50 + (Math.random()*40-20))+'%';
    palace.appendChild(sword);
    setTimeout(()=>sword.remove(),800);
  }
});
