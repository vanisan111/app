let currentUser = null;

function showForm(type){
  document.getElementById("auth-choice-screen").style.display = "none";
  document.getElementById("login-screen").style.display = type === "login" ? "flex" : "none";
  document.getElementById("register-screen").style.display = type === "register" ? "flex" : "none";
}

function backToChoice(){
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("register-screen").style.display = "none";
  document.getElementById("auth-choice-screen").style.display = "flex";
}

function login() {
  const username = document.getElementById("login-username").value || "Игрок";
  currentUser = { username, level:1, xp:0, maxXp:10, referrals:0, br:100, balance:0 };
  updateNavbar();
  updateLevelBar();
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("main-screen").style.display = "flex";
}

function register() {
  const username = document.getElementById("reg-username").value || "Игрок";
  const alliance = document.getElementById("reg-alliance").value || "-";
  currentUser = { username, alliance, level:1, xp:0, maxXp:10, referrals:0, br:100, balance:0 };
  updateNavbar();
  updateLevelBar();
  document.getElementById("register-screen").style.display = "none";
  document.getElementById("main-screen").style.display = "flex";
}

function updateNavbar(){
  document.getElementById("navbar-username").innerText = "👤 " + currentUser.username;
  document.getElementById("navbar-level").innerText = "🏆 Lv." + currentUser.level;
  document.getElementById("navbar-referrals").innerText = "👥 " + currentUser.referrals;
  document.getElementById("navbar-br").innerText = "⚔️ BR: " + currentUser.br;
}

function updateLevelBar(){
  const percent = (currentUser.xp/currentUser.maxXp)*100;
  document.getElementById("level-bar").innerHTML = '';
  for(let i=1;i<=10;i++){
    const span = document.createElement('span');
    span.innerText = '👤';
    if(i <= currentUser.level) span.classList.add('active');
    document.getElementById("level-bar").appendChild(span);
  }
  document.getElementById("level-progress").innerText = currentUser.xp + " / " + currentUser.maxXp;
}

function showContent(type){
  const contentBox = document.getElementById("content-box");
  if(type==="palace"){
    contentBox.innerHTML = `<h3>🏰 Дворец</h3>
      <p>Здесь вы управляете своим альянсом.</p>
      <button onclick="gainXp()">💪 Тренироваться (+XP)</button>`;
  }
  else if(type==="referrals"){
    contentBox.innerHTML = `<h3>👥 Рефералы</h3>
      <p>У вас ${currentUser.referrals} рефералов.</p>
      <button onclick="addReferral()">➕ Добавить реферала</button>`;
  }
  else if(type==="balance"){
    contentBox.innerHTML = `<h3>💰 Баланс</h3>
      <p>Ваш баланс: ${currentUser.balance} монет.</p>
      <button onclick="earnCoins()">💵 Заработать 10 монет</button>`;
  }
  else if(type==="rating"){
    contentBox.innerHTML = `<h3>🏆 Рейтинг</h3>
      <table>
        <thead><tr><th>№</th><th>Игрок</th><th>Lv</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Игрок1</td><td>10</td></tr>
          <tr><td>2</td><td>Игрок2</td><td>8</td></tr>
          <tr><td>3</td><td>${currentUser.username}</td><td>${currentUser.level}</td></tr>
        </tbody>
      </table>`;
  }
  else if(type==="shop"){
    contentBox.innerHTML = `<h3>🛒 Магазин</h3>
      <p>Баланс: ${currentUser.balance} монет</p>
      <button onclick="buyItem(50)">Купить Меч (50)</button>
      <button onclick="buyItem(100)">Купить Щит (100)</button>`;
  }
  else if(type==="rules"){
    contentBox.innerHTML = `<h3>📜 Правила</h3>
      <ul>
        <li>1. Уважайте других игроков</li>
        <li>2. Не используйте читы</li>
        <li>3. Играйте честно</li>
      </ul>`;
  }
}

function gainXp(){ currentUser.xp++; if(currentUser.xp>=currentUser.maxXp){ currentUser.level++; currentUser.xp=0; currentUser.maxXp=Math.floor(currentUser.maxXp*1.5); currentUser.br+=50;} updateNavbar(); updateLevelBar(); showContent("palace"); }
function addReferral(){ currentUser.referrals++; currentUser.balance+=20; updateNavbar(); showContent("referrals"); }
function earnCoins(){ currentUser.balance+=10; showContent("balance"); }
function buyItem(cost){ if(currentUser.balance>=cost){ currentUser.balance-=cost; alert("Покупка успешна!"); } else alert("Не хватает монет!"); showContent("shop"); }
