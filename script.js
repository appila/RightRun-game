// RightRun Game Script
let timeLeft = 60, fallSpeed = 4, score = 0, playerSize, gameRunning = false, paused = false, floatingText = null;
let gameInterval, spawnInterval, timerInterval, leftPressed = false, rightPressed = false;
let spawnRate = 1000, spawnDecreaseRate = 90;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const gameOverScreen = document.getElementById("game-over-screen");
const scoreDisplay = document.getElementById("score-display");
const finalScore = document.getElementById("final-score");
const shareLink = document.querySelector(".game-link");
const timerDisplay = document.getElementById("timer-display");

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  playerSize = canvas.height * 0.08 * 1.1;
  player = { x: canvas.width / 2 - playerSize / 2, y: canvas.height - playerSize - 10, width: playerSize, height: playerSize };
}

window.addEventListener("resize", resizeCanvas);
setTimeout(resizeCanvas, 50);

canvas.addEventListener("touchstart", handleTouch);
canvas.addEventListener("touchmove", handleTouch);

function handleTouch(e) {
  const touch = e.touches[0];
  player.x = touch.clientX - player.width / 2;
}

document.addEventListener("keydown", e => { 
  if (e.code === "ArrowLeft") leftPressed = true; 
  if (e.code === "ArrowRight") rightPressed = true; 
  if (e.code === "KeyP") paused = !paused; 
});
document.addEventListener("keyup", e => { 
  if (e.code === "ArrowLeft") leftPressed = false; 
  if (e.code === "ArrowRight") rightPressed = false; 
});

function drawPlayer() { 
  ctx.font = `${playerSize}px Arial`; 
  ctx.fillText("🧑‍💼", player.x, player.y + player.height); 
}

function drawObjects() {
  ctx.font = `${playerSize * 0.70}px Arial`;
  fallingObjects.forEach(obj => {
    ctx.fillStyle = obj.color;
    ctx.fillText(obj.icon, obj.x, obj.y);
  });
}

function updateObjects() {
  for (let i = 0; i < fallingObjects.length;) {
    const obj = fallingObjects[i];
    obj.y += fallSpeed;
    if (obj.y > canvas.height) { fallingObjects.splice(i, 1); continue; }

    const emojiHeight = playerSize, emojiY = obj.y - emojiHeight;
    const emojiLeft = obj.x, emojiRight = obj.x + playerSize, emojiTop = emojiY, emojiBottom = emojiY + playerSize;
    const playerLeft = player.x, playerRight = player.x + player.width, playerTop = player.y, playerBottom = player.y + player.height;

    if (emojiRight > playerLeft && emojiLeft < playerRight && emojiBottom > playerTop && emojiTop < playerBottom) {
      let floatingMsg;
      if (obj.timeBonus) { timeLeft += obj.timeBonus; floatingMsg = `+${obj.timeBonus}s`; }
      else if (obj.timePenalty) { timeLeft += obj.timePenalty; floatingMsg = `${obj.timePenalty}s`; }
      else { score += obj.value; floatingMsg = obj.value > 0 ? `+${obj.value}` : `${obj.value}`; }

      floatingText = { text: floatingMsg, color: obj.value > 0 || obj.timeBonus ? "#4DC614" : "#FF0000", alpha: 1, scale: 0, x: canvas.width / 2, y: canvas.height / 2, timer: 30 };
      fallingObjects.splice(i, 1);
      continue;
    }
    i++;
  }
}

function drawFloatingPoints() {
  if (floatingText && floatingText.timer > 0) {
    const scaleFactor = 1 + (1 - floatingText.alpha) * 1.5;
    ctx.font = `${Math.round(48 * scaleFactor)}px Arial`;
    const textWidth = ctx.measureText(floatingText.text).width;
    const xPos = (canvas.width - textWidth) / 2;
    ctx.globalAlpha = floatingText.alpha;
    ctx.fillStyle = floatingText.color;
    ctx.fillText(floatingText.text, xPos, floatingText.y);
    ctx.globalAlpha = 1;

    floatingText.timer--;
    floatingText.alpha -= 0.03;
    if (floatingText.timer <= 0) floatingText = null;
  }
}

function drawScore() { 
  scoreDisplay.textContent = `Wynik: ${score}`; 
}

function gameLoop() {
  if (!gameRunning || paused) return;
  if (leftPressed) player.x = Math.max(0, player.x - 15);
  if (rightPressed) player.x = Math.min(canvas.width - player.width, player.x + 15);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateObjects();
  drawPlayer();
  drawObjects();
  drawScore();
  drawFloatingPoints();
}

function spawnObject() {
  const items = [
    { icon: "💰", value: 2, color: "#4DC614" },
    { icon: "🎯", value: 1, color: "#4DC614" },
    { icon: "🤝", value: 3, color: "#4DC614" },
    { icon: "🕑", value: 0, color: "#4DC614", timeBonus: 2 },
    { icon: "🔥", value: 0, color: "#FF0000", timePenalty: -2 },
    { icon: "📛", value: -2, color: "#FF0000" },
    { icon: "💣", value: -4, color: "#FF0000" }
  ];
  const obj = items[Math.floor(Math.random() * items.length)];
  obj.x = Math.random() * (canvas.width - playerSize);
  obj.y = 0;
  fallingObjects.push(obj);
}

function endGame() {
  clearInterval(timerInterval);
  clearInterval(spawnInterval);
  clearInterval(gameInterval);
  gameRunning = false;
  gameOverScreen.classList.add("active");
  finalScore.textContent = `Twój wynik: ${score} punktów!`;
  shareLink.href = `https://www.linkedin.com/shareArticle?mini=true&url=https://rightcode.pl/game&title=Zagraj w RightRun!&summary=Zebrałem ${score} punktów. A Ty?`;

  spawnRate = 600;
  spawnDecreaseRate = 30;
}

function startGame() {
  // Resetowanie zmiennych do wartości początkowych
  setTimeout(resizeCanvas, 50);
  score = 0;
  timeLeft = 60;
  fallSpeed = 4;
  fallingObjects = []; // Opróżniamy tablicę obiektów spadających
  gameRunning = true;
  paused = false;

  // Resetowanie ekranów
  startScreen.classList.remove("active");
  gameOverScreen.classList.remove("active");
  canvas.style.display = scoreDisplay.style.display = "block";

  spawnRate = 1000;  
  spawnDecreaseRate = 90;

  gameInterval = setInterval(gameLoop, 50);
  spawnInterval = setInterval(spawnObject, spawnRate);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Czas: ${timeLeft}`;
    if (timeLeft <= 0) endGame();

    if (timeLeft % 10 === 0 && spawnRate > 300) {
      spawnRate -= spawnDecreaseRate;
      clearInterval(spawnInterval);
      spawnInterval = setInterval(spawnObject, spawnRate);
    }
  }, 1000);

  setInterval(() => { 
    if (fallSpeed < 18) fallSpeed += 0.20; 
  }, 1000);
}

startBtn.onclick = startGame;

document.getElementById("restart-btn").addEventListener("click", () => {
  startGame();
  gameOverScreen.classList.remove("active");
  startScreen.classList.remove("active");
});
