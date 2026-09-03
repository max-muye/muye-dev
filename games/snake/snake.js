const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const form = document.querySelector("#settings");
const scoreEl = document.querySelector("#score");
const statusEl = document.querySelector("#status");
const overlay = document.querySelector("#overlay");
const pauseButton = document.querySelector("#pause");

const dirs = {
  ArrowUp: { x: 0, y: -1 },
  KeyW: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  KeyS: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  KeyA: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  KeyD: { x: 1, y: 0 },
};

let state;
let timer = 0;
let swipeStart = null;

function intValue(data, name, fallback, min) {
  const raw = Number(data.get(name));
  if (!Number.isInteger(raw) || raw < min) return fallback;
  return raw;
}

function key(point) {
  return `${point.x},${point.y}`;
}

function same(a, b) {
  return a.x === b.x && a.y === b.y;
}

function randomCell(width, height, blocked) {
  if (width <= 0 || height <= 0 || blocked.size >= width * height) return null;
  for (let tries = 0; tries < 2000; tries += 1) {
    const cell = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
    if (!blocked.has(key(cell))) return cell;
  }
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cell = { x, y };
      if (!blocked.has(key(cell))) return cell;
    }
  }
  return null;
}

function occupied(includeTails = true) {
  const blocked = new Set(state.bombs.map(key));
  for (const snake of [state.player, ...state.ais]) {
    const body = includeTails ? snake.body : snake.body.slice(0, -1);
    body.forEach((part) => blocked.add(key(part)));
  }
  return blocked;
}

function fillItems(items, max, blocked) {
  while (items.length < max) {
    const cell = randomCell(state.width, state.height, blocked);
    if (!cell) return;
    items.push(cell);
    blocked.add(key(cell));
  }
}

function makeSnake(id, start, color, ai = false, width = 1) {
  const tail = width > 1
    ? (start.x > 0 ? { x: start.x - 1, y: start.y } : { x: start.x + 1, y: start.y })
    : null;
  return {
    id,
    ai,
    alive: true,
    color,
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    body: tail ? [start, tail] : [start],
  };
}

function startGame() {
  const data = new FormData(form);
  const width = intValue(data, "width", 30, 1);
  const height = intValue(data, "height", 30, 1);
  const appleMax = intValue(data, "apples", 10, 0);
  const bombMax = intValue(data, "bombs", 10, 0);
  const aiMax = intValue(data, "ais", 5, 0);
  const ticks = intValue(data, "ticks", 95, 1);
  const playerAi = data.get("playerAi") === "on";
  const playerStart = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
  state = {
    width,
    height,
    appleMax,
    bombMax,
    ticks,
    score: 0,
    paused: false,
    over: false,
    announcedPlayerLoss: false,
    apples: [],
    bombs: [],
    player: makeSnake("you", playerStart, "#f2bd79", playerAi, width),
    ais: [],
  };
  let blocked = occupied();
  for (let i = 0; i < aiMax; i += 1) {
    const start = randomCell(width, height, blocked);
    if (!start) break;
    const snake = makeSnake(`ai-${i}`, start, `hsl(${(i * 67 + 160) % 360} 68% 62%)`, true, width);
    snake.dir = chooseSafeDirection(snake) || snake.dir;
    snake.nextDir = snake.dir;
    state.ais.push(snake);
    blocked = occupied();
  }
  fillItems(state.bombs, bombMax, occupied());
  fillItems(state.apples, appleMax, occupied());
  scoreEl.textContent = "0";
  overlay.hidden = true;
  statusEl.textContent = playerAi ? "AI mode playing." : "Playing.";
  draw();
  clearInterval(timer);
  timer = setInterval(tick, ticks);
}

function inBounds(cell) {
  return cell.x >= 0 && cell.y >= 0 && cell.x < state.width && cell.y < state.height;
}

function nextHead(snake, dir = snake.nextDir) {
  return { x: snake.body[0].x + dir.x, y: snake.body[0].y + dir.y };
}

function isOpposite(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0;
}

function setPlayerDirection(dir) {
  if (!dir || !state || !state.player.alive || state.player.ai) return;
  if (!isOpposite(dir, state.player.dir)) state.player.nextDir = dir;
}

function chooseSafeDirection(snake) {
  const blocked = occupied(false);
  return Object.values(dirs).find((dir) => {
    if (isOpposite(dir, snake.dir)) return false;
    const head = nextHead(snake, dir);
    return inBounds(head) && !blocked.has(key(head));
  });
}

function shortestDirection(snake) {
  const blocked = occupied(false);
  const start = snake.body[0];
  const targets = new Set(state.apples.map(key));
  if (!targets.size) return chooseSafeDirection(snake);
  const queue = [{ cell: start, first: null }];
  const seen = new Set([key(start)]);
  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index];
    if (current.first && targets.has(key(current.cell))) return current.first;
    const options = Object.values(dirs)
      .filter((dir) => !(current.cell === start && isOpposite(dir, snake.dir)))
      .map((dir) => ({ dir, cell: { x: current.cell.x + dir.x, y: current.cell.y + dir.y } }))
      .sort((a, b) => nearestAppleDistance(a.cell) - nearestAppleDistance(b.cell));
    for (const option of options) {
      const cellKey = key(option.cell);
      if (!inBounds(option.cell) || blocked.has(cellKey) || seen.has(cellKey)) continue;
      seen.add(cellKey);
      queue.push({ cell: option.cell, first: current.first || option.dir });
    }
  }
  return chooseSafeDirection(snake);
}

function nearestAppleDistance(cell) {
  if (!state.apples.length) return 0;
  return Math.min(...state.apples.map((apple) => Math.abs(apple.x - cell.x) + Math.abs(apple.y - cell.y)));
}

function openAreaScore(cell, blocked) {
  const queue = [cell];
  const seen = new Set([key(cell)]);
  for (let index = 0; index < queue.length && seen.size < 80; index += 1) {
    for (const dir of Object.values(dirs)) {
      const next = { x: queue[index].x + dir.x, y: queue[index].y + dir.y };
      const id = key(next);
      if (!inBounds(next) || blocked.has(id) || seen.has(id)) continue;
      seen.add(id);
      queue.push(next);
    }
  }
  return seen.size;
}

function smartDirection(snake) {
  const blocked = occupied(false);
  const options = Object.values(dirs)
    .filter((dir) => !isOpposite(dir, snake.dir))
    .map((dir) => ({ dir, head: nextHead(snake, dir) }))
    .filter((option) => inBounds(option.head) && !blocked.has(key(option.head)));
  if (!options.length) return snake.dir;
  const appleTargets = state.apples.length ? state.apples : [{ x: Math.floor(state.width / 2), y: Math.floor(state.height / 2) }];
  return options
    .map((option) => {
      const appleDistance = Math.min(...appleTargets.map((apple) => Math.abs(apple.x - option.head.x) + Math.abs(apple.y - option.head.y)));
      const wallDistance = Math.min(option.head.x, option.head.y, state.width - 1 - option.head.x, state.height - 1 - option.head.y);
      const space = openAreaScore(option.head, blocked);
      return { ...option, score: space * 8 + wallDistance * 2 - appleDistance * 3 };
    })
    .sort((a, b) => b.score - a.score)[0].dir;
}

function moveSnake(snake) {
  if (!snake.alive) return;
  if (snake.ai) snake.nextDir = snake.id === "you" ? smartDirection(snake) : (shortestDirection(snake) || snake.dir);
  if (!isOpposite(snake.nextDir, snake.dir)) snake.dir = snake.nextDir;
  const head = nextHead(snake, snake.dir);
  const blocked = occupied(false);
  if (!inBounds(head) || blocked.has(key(head))) {
    snake.alive = false;
    return;
  }
  snake.body.unshift(head);
  const appleIndex = state.apples.findIndex((apple) => same(apple, head));
  if (appleIndex >= 0) {
    state.apples.splice(appleIndex, 1);
    if (!snake.ai) {
      state.score += 1;
      scoreEl.textContent = String(state.score);
    }
  } else {
    snake.body.pop();
  }
}

function tick() {
  if (!state || state.paused) return;
  for (const snake of [state.player, ...state.ais]) moveSnake(snake);
  const blocked = occupied();
  fillItems(state.apples, state.appleMax, blocked);
  fillItems(state.bombs, state.bombMax, blocked);
  if (!state.player.alive && !state.announcedPlayerLoss) {
    state.announcedPlayerLoss = true;
    overlay.hidden = false;
    overlay.querySelector("strong").textContent = "Game over";
    overlay.querySelector("span").textContent = "AI snakes keep playing. Press Start to try again.";
    statusEl.textContent = "Game over. AI snakes still playing.";
  }
  draw();
}

function draw() {
  if (!state) return;
  const size = Math.floor(Math.min(canvas.width / state.width, canvas.height / state.height));
  const offsetX = Math.floor((canvas.width - size * state.width) / 2);
  const offsetY = Math.floor((canvas.height - size * state.height) / 2);
  ctx.fillStyle = "#08100d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(248,244,234,.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= state.width; x += 1) {
    ctx.beginPath();
    ctx.moveTo(offsetX + x * size, offsetY);
    ctx.lineTo(offsetX + x * size, offsetY + state.height * size);
    ctx.stroke();
  }
  for (let y = 0; y <= state.height; y += 1) {
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY + y * size);
    ctx.lineTo(offsetX + state.width * size, offsetY + y * size);
    ctx.stroke();
  }
  for (const apple of state.apples) drawCell(apple, size, offsetX, offsetY, "#6fb69a", true);
  for (const bomb of state.bombs) drawCell(bomb, size, offsetX, offsetY, "#e15f54", true);
  for (const snake of state.ais) drawSnake(snake, size, offsetX, offsetY);
  drawSnake(state.player, size, offsetX, offsetY);
}

function drawCell(cell, size, offsetX, offsetY, color, round = false) {
  const pad = Math.max(1, Math.floor(size * 0.14));
  ctx.fillStyle = color;
  if (round) {
    ctx.beginPath();
    ctx.arc(offsetX + cell.x * size + size / 2, offsetY + cell.y * size + size / 2, Math.max(2, size / 2 - pad), 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(offsetX + cell.x * size + pad, offsetY + cell.y * size + pad, size - pad * 2, size - pad * 2);
  }
}

function drawSnake(snake, size, offsetX, offsetY) {
  snake.body.forEach((part, index) => drawCell(part, size, offsetX, offsetY, index === 0 ? snake.color : shade(snake.color), false));
}

function shade(color) {
  if (color.startsWith("hsl")) return color.replace("62%", "46%");
  return "#d89b55";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  startGame();
});

pauseButton.addEventListener("click", () => {
  if (!state || state.over) return;
  state.paused = !state.paused;
  pauseButton.textContent = state.paused ? "Resume" : "Pause";
  overlay.hidden = !state.paused;
  overlay.querySelector("strong").textContent = "Paused";
  overlay.querySelector("span").textContent = "Press Resume to continue.";
  statusEl.textContent = state.paused ? "Paused." : "Playing.";
});

window.addEventListener("keydown", (event) => {
  const dir = dirs[event.code];
  if (!dir || !state || !state.player.alive) return;
  event.preventDefault();
  setPlayerDirection(dir);
});

canvas.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  swipeStart = { x: event.clientX, y: event.clientY };
});

canvas.addEventListener("pointermove", (event) => {
  if (!swipeStart || (event.pointerType !== "touch" && event.pointerType !== "pen")) return;
  event.preventDefault();
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
  setPlayerDirection(Math.abs(dx) > Math.abs(dy)
    ? (dx > 0 ? dirs.ArrowRight : dirs.ArrowLeft)
    : (dy > 0 ? dirs.ArrowDown : dirs.ArrowUp));
  swipeStart = { x: event.clientX, y: event.clientY };
});

canvas.addEventListener("pointerup", (event) => {
  if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
  event.preventDefault();
  swipeStart = null;
});

canvas.addEventListener("pointercancel", () => {
  swipeStart = null;
});

draw();
