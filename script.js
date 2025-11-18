// RightRun Game Script

let timeLeft = 60;
let fallSpeed = 4;
let score = 0;
let playerSize;
let gameRunning = false;
let paused = false;
let floatingText = null;

let gameInterval;
let spawnInterval;
let timerInterval;
let speedInterval;

let leftPressed = false;
let rightPressed = false;

let spawnRate = 1000;
let spawnDecreaseRate = 90;

let player = null;
let fallingObjects = [];

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const gameOverScreen = document.getElementById("game-over-screen");
const scoreDisplay = document.getElementById("score-display");
const finalScore = document.getElementById("final-score");
const shareLink = document.querySelector(".game-link");
const timerDisplay = document.getElementById("timer-display");
const restartBtn = document.getElementById("restart-btn");

// --- Rozmiar canvasa i gracza ---

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  playerSize = canvas.height * 0.08 * 1.1;
  player = {
    x: canvas.width / 2 - playerSize / 2,
    y: canvas.height - playerSize - 10,
    width: playerSize,
    height: playerSize
  };
}

window.addEventListener("resize", resizeCanvas);
setTimeout(resizeCanvas, 50);

// --- Sterowanie dotykiem ---

canvas.addEventListener("touchstart", handleTouch, { passive: false });
canvas.addEventListener("touchmove", handleTouch, { passive: false });

function handleTouch(e) {
  e.preventDefault();
  if (!player) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  player.x = x - player.width / 2;
}

// --- Sterowanie klawiaturą ---

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") leftPressed = true;
  if (e.code === "ArrowRight") rightPressed = true;
  if (e.code === "KeyP") paused = !paused;
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") leftPressed = false;
  if (e.code === "ArrowRight") rightPressed = false;
});

// --- Rysowanie gracza i obiektów ---

function drawPlayer() {
  if (!player) return;
  ctx.font = `${playerSize}px Arial`;
  ctx.fillText("🧑‍💼", player.x, player.y + player.height);
}

function drawObjects() {
  ctx.font = `${playerSize * 0.7}px Arial`;
  fallingObjects.forEach((obj) => {
    ctx.fillStyle = obj.color;
    ctx.fillText(obj.icon, obj.x, obj.y);
  });
}

// --- Aktualizacja obiektów i kolizje ---

function updateObjects() {
  for (let i = 0; i < fallingObjects.length; ) {
    const obj = fallingObjects[i];
    obj.y += fallSpeed;

    if (obj.y > canvas.height) {
      fallingObjects.splice(i, 1);
      continue;
    }

    const emojiHeight = playerSize;
    const emojiY = obj.y - emojiHeight;
    const emojiLeft = obj.x;
    const emojiRight = obj.x + playerSize;
    const emojiTop = emojiY;
    const emojiBottom = emojiY + playerSize;

    const playerLeft = player.x;
    const playerRight = player.x + player.width;
    const playerTop = player.y;
    const playerBottom = player.y + player.height;

    const collided =
      emojiRight > playerLeft &&
      emojiLeft < playerRight &&
      emojiBottom > playerTop &&
      emojiTop < playerBottom;

    if (collided) {
      let floatingMsg;

      if (obj.timeBonus) {
        timeLeft += obj.timeBonus;
        floatingMsg = `+${obj.timeBonus}s`;
      } else if (obj.timePenalty) {
        timeLeft += obj.timePenalty;
        floatingMsg = `${obj.timePenalty}s`;
      } else {
        score += obj.value;
        floatingMsg = obj.value > 0 ? `+${obj.value}` : `${obj.value}`;
      }

      const isPositive = (obj.value && obj.value > 0) || obj.timeBonus;

      floatingText = {
        text: floatingMsg,
        color: isPositive ? "#4DC614" : "#FF0000",
        alpha: 1,
        y: canvas.height / 2,
        timer: 30
      };

      fallingObjects.splice(i, 1);
      continue;
    }

    i++;
  }
}

// --- Efekt "floating points" ---

function drawFloatingPoints() {
  if (floatingText && floatingText.timer > 0) {
    const baseSize = 48;
    const scaleFactor = 1 + (1 - floatingText.alpha) * 1.5;

    ctx.font = `${Math.round(baseSize * scaleFactor)}px Arial`;
    const textWidth = ctx.measureText(floatingText.text).width;
    const xPos = (canvas.width - textWidth) / 2;

    ctx.globalAlpha = floatingText.alpha;
    ctx.fillStyle = floatingText.color;
    ctx.fillText(floatingText.text, xPos, floatingText.y);
    ctx.globalAlpha = 1;

    floatingText.timer--;
    floatingText.alpha -= 0.03;

    if (floatingText.timer <= 0) {
      floatingText = null;
    }
  }
}

// --- Wynik ---

function drawScore() {
  scoreDisplay.textContent = `Wynik: ${score}`;
}

// --- Główna pętla gry ---

function gameLoop() {
  if (!gameRunning || paused) return;
  if (!player) return;

  if (leftPressed) {
    player.x = Math.max(0, player.x - 15);
  }
  if (rightPressed) {
    player.x = Math.min(canvas.width - player.width, player.x + 15);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateObjects();
  drawPlayer();
  drawObjects();
  drawScore();
  drawFloatingPoints();
}

// --- Spawnowanie obiektów ---

function spawnObject() {
  if (!player) return;

  const items = [
    { icon: "💰", value: 2, color: "#4DC614" },
    { icon: "🎯", value: 1, color: "#4DC614" },
    { icon: "🤝", value: 3, color: "#4DC614" },
    { icon: "🕑", value: 0, color: "#4DC614", timeBonus: 2 },
    { icon: "🔥", value: 0, color: "#FF0000", timePenalty: -2 },
    { icon: "📛", value: -2, color: "#FF0000" },
    { icon: "💣", value: -4, color: "#FF0000" }
  ];

  const base = items[Math.floor(Math.random() * items.length)];
  const obj = {
    ...base,
    x: Math.random() * (canvas.width - playerSize),
    y: 0
  };

  fallingObjects.push(obj);
}

// --- Koniec gry ---

function endGame() {
  clearInterval(timerInterval);
  clearInterval(spawnInterval);
  clearInterval(gameInterval);
  clearInterval(speedInterval);

  gameRunning = false;

  gameOverScreen.classList.add("active");
  finalScore.textContent = `Twój wynik: ${score} punktów!`;

  shareLink.href = `https://www.linkedin.com/shareArticle?mini=true&url=https://rightcode.pl/game&title=Zagraj w RightRun!&summary=Zebrałem ${score} punktów. A Ty?`;

  spawnRate = 600;
  spawnDecreaseRate = 30;
}

// --- Start gry ---

function startGame() {
  setTimeout(resizeCanvas, 50);

  score = 0;
  timeLeft = 60;
  fallSpeed = 4;
  floatingText = null;
  fallingObjects = [];
  gameRunning = true;
  paused = false;

  timerDisplay.textContent = `Czas: ${timeLeft}`;
  scoreDisplay.textContent = `Wynik: ${score}`;

  startScreen.classList.remove("active");
  gameOverScreen.classList.remove("active");

  canvas.style.display = "block";

  spawnRate = 1000;
  spawnDecreaseRate = 90;

  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  clearInterval(speedInterval);

  gameInterval = setInterval(gameLoop, 50);
  spawnInterval = setInterval(spawnObject, spawnRate);

  timerInterval = setInterval(() => {
    if (paused) return;

    timeLeft--;
    timerDisplay.textContent = `Czas: ${timeLeft}`;

    if (timeLeft <= 0) {
      timeLeft = 0;
      timerDisplay.textContent = `Czas: 0`;
      endGame();
    }

    if (timeLeft % 10 === 0 && spawnRate > 300) {
      spawnRate -= spawnDecreaseRate;
      clearInterval(spawnInterval);
      spawnInterval = setInterval(spawnObject, spawnRate);
    }
  }, 1000);

  speedInterval = setInterval(() => {
    if (fallSpeed < 18) {
      fallSpeed += 0.2;
    }
  }, 1000);
}

// --- Handlery przycisków ---

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", () => {
  startGame();
});
