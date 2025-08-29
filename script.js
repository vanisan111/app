// =======================
// Глобальные переменные
// =======================
let currentUser = null;

// =======================
// Навигация между экранами
// =======================
function showForm(type) {
  document.getElementById("auth-choice-screen").style.display = "none";
  document.getElementById("login-screen").style.display = type === "login" ? "flex" : "none";
  document.getElementById("register-screen").style.display = type === "register" ? "flex" : "none";
}

function backToChoice() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("register-screen").style.display = "none";
  document.getElementById("auth-choice-screen").style.display = "flex";
}

// =======================
// Авторизация
// =======================
function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  if (!username || !password) {
    alert("Введите логин и пароль!");
    return;
  }

  // временно — фейковый юзер
  currentUser = {
    username: username,
    level: 1,
    xp: 0,
    maxXp: 10,
    referrals: 0,
    br: 100,
    balance: 0
  };

  updateNavbar();
  updateLevelBar();

  document.getElementById("login-screen").style.display = "none";
  document.getElementById("main-screen").style.display = "block";
}

function register() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  const alliance = document.getElementById("reg-alliance").value;

  if (!username || !password || !alliance) {
    alert("Заполните все поля!");
    return;
  }

  // временно — регистрация = сразу вход
  currentUser = {
    username: username,
    level: 1,
    xp: 0,
    maxXp: 10,
    referrals: 0,
    br: 100,
    balance: 0,
    alliance: alliance
  };

  updateNavbar();
  updateLevelBar();

  document.getElementById("register-screen").style.display = "none";
  document.getElementById("main-screen").style.display = "block";
}

// =======================
// Обновление интерфейса
// =======================
function updateNavbar() {
  document.getElementById("navbar-username").innerText = "👤 " + currentUser.username;
  document.getElementById("navbar-level").innerText = "🏆 Lv." + currentUser.level;
  document.getElementById("navbar-referrals").innerText = "👥 " + currentUser.referrals;
  document.getElementById("navbar-br").innerText = "⚔️ BR: " + currentUser.br;
}

function updateLevelBar() {
  const percent = (currentUser.xp / currentUser.maxXp) * 100;
  document.getElementById("level-bar").style.width = percent + "%";
  document.getElementById("level-progress").innerText = currentUser.xp + " / " + currentUser.maxXp;
}

// =======================
// Контент по кнопкам
// =======================
function showContent(type) {
  let content = "";

  switch(type) {
    case "palace":
      content = `
        <h3>🏰 Дворец</h3>
        <p>Здесь вы управляете своим альянсом.</p>
        <button onclick="gainXp()">💪 Тренироваться (+XP)</button>
      `;
      break;

    case "referrals":
      content = `
        <h3>👥 Рефералы</h3>
        <p>У вас ${currentUser.referrals} рефералов.</p>
        <button onclick="addReferral()">➕ Добавить реферала</button>
      `;
      break;

    case "balance":
      content = `
        <h3>💰 Баланс</h3>
        <p>Ваш баланс: ${currentUser.balance} монет.</p>
        <button onclick="earnCoins()">💵 Заработать 10 монет</button>
      `;
      break;

    case "rating":
      content = `
        <h3>🏆 Рейтинг</h3>
        <ol>
          <li>Игрок1 — Lv.10</li>
          <li>Игрок2 — Lv.8</li>
          <li>${currentUser.username} — Lv.${currentUser.level}</li>
        </ol>
      `;
      break;

    case "shop":
      content = `
        <h3>🛒 Магазин</h3>
        <p>Баланс: ${currentUser.balance} монет.</p>
        <button onclick="buyItem(50)">Купить Меч (50)</button>
        <button onclick="buyItem(100)">Купить Щит (100)</button>
      `;
      break;

    case "rules":
      content = `
        <h3>📜 Правила</h3>
        <ul>
          <li>1. Уважайте других игроков</li>
          <li>2. Не используйте читы</li>
          <li>3. Играйте честно</li>
        </ul>
      `;
      break;

    default:
      content = "❓ Неизвестный раздел";
  }

  document.getElementById("content-box").innerHTML = content;
}

// =======================
// Игровая логика
// =======================
function gainXp() {
  currentUser.xp++;
  if (currentUser.xp >= currentUser.maxXp) {
    currentUser.level++;
    currentUser.xp = 0;
    currentUser.maxXp = Math.floor(currentUser.maxXp * 1.5);
    currentUser.br += 50; // бонус силы
  }
  updateNavbar();
  updateLevelBar();
  showContent("palace");
}

function addReferral() {
  currentUser.referrals++;
  currentUser.balance += 20; // бонус за друга
  updateNavbar();
  showContent("referrals");
}

function earnCoins() {
  currentUser.balance += 10;
  showContent("balance");
}

function buyItem(cost) {
  if (currentUser.balance >= cost) {
    currentUser.balance -= cost;
    alert("Покупка успешна! 🛡️");
  } else {
    alert("Не хватает монет!");
  }
  showContent("shop");
}
