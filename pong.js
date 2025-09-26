const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const playerScoreElem = document.getElementById('player-score');
const computerScoreElem = document.getElementById('computer-score');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const PLAYER_X = 10;
const COMPUTER_X = CANVAS_WIDTH - PADDLE_WIDTH - 10;
const PADDLE_SPEED = 6;

// Ball settings
const BALL_SIZE = 12;
const BALL_SPEED_INIT = 5;

// Game state
let playerY = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let computerY = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let ballX = CANVAS_WIDTH / 2 - BALL_SIZE / 2;
let ballY = CANVAS_HEIGHT / 2 - BALL_SIZE / 2;
let ballSpeedX = BALL_SPEED_INIT * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = BALL_SPEED_INIT * (Math.random() * 2 - 1);

let playerScore = 0;
let computerScore = 0;

let upPressed = false;
let downPressed = false;

// Paddle controls: Keyboard
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowUp') upPressed = true;
  if (e.key === 'ArrowDown') downPressed = true;
});
document.addEventListener('keyup', function(e) {
  if (e.key === 'ArrowUp') upPressed = false;
  if (e.key === 'ArrowDown') downPressed = false;
});

// Paddle controls: Mouse
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  if (playerY < 0) playerY = 0;
  if (playerY > CANVAS_HEIGHT - PADDLE_HEIGHT) playerY = CANVAS_HEIGHT - PADDLE_HEIGHT;
});

function drawRect(x, y, w, h, color = "#fff") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color = "#fff") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + size/2, y + size/2, size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function resetBall() {
  ballX = CANVAS_WIDTH / 2 - BALL_SIZE / 2;
  ballY = CANVAS_HEIGHT / 2 - BALL_SIZE / 2;
  ballSpeedX = BALL_SPEED_INIT * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = BALL_SPEED_INIT * (Math.random() * 2 - 1);
}

function update() {
  // Keyboard paddle move
  if (upPressed) {
    playerY -= PADDLE_SPEED;
    if (playerY < 0) playerY = 0;
  }
  if (downPressed) {
    playerY += PADDLE_SPEED;
    if (playerY > CANVAS_HEIGHT - PADDLE_HEIGHT) playerY = CANVAS_HEIGHT - PADDLE_HEIGHT;
  }

  // Computer AI paddle move
  let computerCenter = computerY + PADDLE_HEIGHT / 2;
  if (computerCenter < ballY + BALL_SIZE / 2 - 10) {
    computerY += PADDLE_SPEED * 0.7;
  } else if (computerCenter > ballY + BALL_SIZE / 2 + 10) {
    computerY -= PADDLE_SPEED * 0.7;
  }
  if (computerY < 0) computerY = 0;
  if (computerY > CANVAS_HEIGHT - PADDLE_HEIGHT) computerY = CANVAS_HEIGHT - PADDLE_HEIGHT;

  // Ball move
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Wall collision
  if (ballY < 0) {
    ballY = 0;
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > CANVAS_HEIGHT - BALL_SIZE) {
    ballY = CANVAS_HEIGHT - BALL_SIZE;
    ballSpeedY = -ballSpeedY;
  }

  // Paddle collision (player)
  if (
    ballX < PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH;
    ballSpeedX = -ballSpeedX;
    // Add spin
    let hitPoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
    ballSpeedY = hitPoint * 0.25;
  }

  // Paddle collision (computer)
  if (
    ballX + BALL_SIZE > COMPUTER_X &&
    ballY + BALL_SIZE > computerY &&
    ballY < computerY + PADDLE_HEIGHT
  ) {
    ballX = COMPUTER_X - BALL_SIZE;
    ballSpeedX = -ballSpeedX;
    // Add spin
    let hitPoint = (ballY + BALL_SIZE / 2) - (computerY + PADDLE_HEIGHT / 2);
    ballSpeedY = hitPoint * 0.25;
  }

  // Score
  if (ballX < 0) {
    computerScore++;
    updateScore();
    resetBall();
  }
  if (ballX > CANVAS_WIDTH - BALL_SIZE) {
    playerScore++;
    updateScore();
    resetBall();
  }
}

function updateScore() {
  playerScoreElem.textContent = playerScore;
  computerScoreElem.textContent = computerScore;
}

function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw middle line
  ctx.save();
  ctx.strokeStyle = "#fff7";
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2, 0);
  ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
  ctx.stroke();
  ctx.restore();

  drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
  drawRect(COMPUTER_X, computerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
  drawBall(ballX, ballY, BALL_SIZE, "#fff");
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game
resetBall();
gameLoop();
