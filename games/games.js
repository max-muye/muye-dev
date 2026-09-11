const games = {
  "2048": { title: "2048", type: "Action", description: "Slide matching tiles together and reach 2048.", how: ["Swipe or press the arrow buttons to move every tile.", "Matching numbers merge into one larger tile.", "Your board is saved for your user after every move."], render: render2048 },
  minesweeper: { title: "Minesweeper", type: "Action", description: "Clear the field without hitting a mine.", how: ["Tap a square to reveal it.", "Right-click, long-press, or hold to place a flag.", "Numbers show how many mines touch that square."], render: renderMinesweeper },
  "connect-four": { title: "Connect Four", type: "Strategy", description: "Drop four discs in a row first.", how: ["Tap a column to drop your disc.", "Red and yellow take turns.", "Four in a row wins: across, down, or diagonal."], render: renderConnectFour },
  "tic-tac-toe": { title: "Tic-Tac-Toe", type: "Strategy", description: "Three in a row, built for quick taps.", how: ["Tap an empty square.", "X and O take turns.", "Three matching marks in a row wins."], render: renderTicTacToe },
  chess: { title: "Chess", type: "Strategy", description: "A compact chess board for two players.", how: ["Tap a square to inspect or mark it.", "Use the board as a phone-sized setup for over-the-board play.", "The selected square is saved for your user."], render: (fresh) => renderBoardGame("chess", fresh) },
  go: { title: "Go", type: "Strategy", description: "A compact Go board with capture rules.", how: ["Black and white take turns placing stones.", "Tap any open point to play.", "This compact board is made for quick tablet play."], render: (fresh) => renderGo(fresh) },
  checkers: { title: "Checkers", type: "Strategy", description: "Move diagonally, jump pieces, and crown kings.", how: ["Tap pieces and destination squares to plan moves.", "Use diagonal jumps to capture.", "The board stays saved for your user."], render: (fresh) => renderBoardGame("checkers", fresh) },
  reversi: { title: "Reversi", type: "Strategy", description: "Place discs to flip lines of your opponent's pieces.", how: ["Tap an empty square to mark a move.", "Surround opponent discs in a line to flip them.", "The simple board is sized for touch play."], render: (fresh) => renderBoardGame("reversi", fresh) },
  battleship: { title: "Battleship", type: "Strategy", description: "Find the hidden fleet.", how: ["Tap squares to search the sea.", "Marked squares stay saved.", "Use it as a quick hidden-fleet board."], render: (fresh) => renderBoardGame("battleship", fresh) },
  "memory-match": { title: "Memory Match", type: "Puzzle", description: "Flip cards and find every pair.", how: ["Tap two cards to reveal them.", "Matching cards stay open.", "Find every pair to clear the board."], render: renderMemory },
  hangman: { title: "Hangman", type: "Word", description: "Guess the hidden word before the misses run out.", how: ["Tap letters to guess the word.", "Wrong letters use one miss.", "Solve before six misses."], render: renderHangman },
  "rock-paper-scissors": { title: "Rock Paper Scissors", type: "Classic", description: "Fast hand game for quick decisions.", how: ["Tap rock, paper, or scissors.", "Rock beats scissors, scissors beats paper, paper beats rock.", "The latest round is saved for your user."], render: renderRps },
  sudoku: { title: "Sudoku", type: "Challenge", description: "Fill the board with digits 1 through 9.", how: ["Tap an empty cell, then tap a number.", "Original puzzle numbers cannot be changed.", "Fill rows, columns, and boxes with 1 to 9."], render: renderSudoku },
  blackjack: { title: "Blackjack", type: "Challenge", description: "Get close to 21 without going over.", how: ["Tap Hit to draw another card.", "Tap Stand when your hand feels close enough.", "Aces count as 11 or 1 automatically."], render: renderBlackjack },
  wordle: { title: "Wordle", type: "Challenge", description: "Guess the five-letter word.", how: ["Type a five-letter guess and press Try.", "Green means correct spot; gold means the letter exists elsewhere.", "You get six guesses."], render: renderWordle },
  "lights-out": { title: "Lights Out", type: "Challenge", description: "Turn off every light.", how: ["Tap a light to flip it and its neighbors.", "Clear the board by turning every light off.", "Your pattern is saved after every tap."], render: renderLightsOut },
  "fifteen-puzzle": { title: "Fifteen Puzzle", type: "Puzzle", description: "Slide numbered tiles back into order.", how: ["Tap a tile next to the empty space.", "Slide tiles until the numbers read 1 to 15.", "The puzzle is saved after each move."], render: renderFifteen },
  simon: { title: "Simon", type: "Memory", description: "Repeat the growing color pattern.", how: ["Tap Start Pattern.", "Watch the flashed colors, then repeat them.", "Each correct round adds one more color."], render: renderSimon },
  "number-guess": { title: "Number Guess", type: "Puzzle", description: "Find the hidden number from hints.", how: ["Enter a number from 1 to 100.", "The game tells you higher or lower.", "Try to pin it down calmly."], render: renderNumberGuess },
  "coin-dice": { title: "Coin & Dice", type: "Classic", description: "A tiny picker for quick chance decisions.", how: ["Tap Flip Coin or Roll Dice.", "Use it for quick choices.", "Your latest result is kept in your save slot."], render: renderCoinDice },
};

const panel = document.querySelector("#play-panel");
const resetButton = document.querySelector("#reset-game");
const params = new URLSearchParams(location.search);
const slug = params.get("game") || "2048";
const game = games[slug] || games["2048"];
let playerKey = getDevicePlayerKey();
document.querySelector("#game-title").textContent = game.title;
document.querySelector("#game-type").textContent = game.type;
document.querySelector("#game-description").textContent = game.description;
resetButton.addEventListener("click", () => { clearGameSave(); game.render(true); });
bootGame();

async function bootGame() {
  await loadPlayerKey();
  game.render();
}

function setPanel(html) {
  panel.innerHTML = html;
}

function getDevicePlayerKey() {
  let id = localStorage.getItem("muye-games-device-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("muye-games-device-id", id);
  }
  return `device:${id}`;
}

async function loadPlayerKey() {
  try {
    for (let attempt = 0; attempt < 20 && !window.Clerk; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!window.Clerk) return;
    await window.Clerk.load();
    if (window.Clerk.user?.id) playerKey = `user:${window.Clerk.user.id}`;
  } catch {}
}

function saveKey() {
  return `muye-game:${playerKey}:${slug}`;
}

function loadGameSave() {
  try { return JSON.parse(localStorage.getItem(saveKey()) || "null"); } catch { return null; }
}

function saveGame(data) {
  localStorage.setItem(saveKey(), JSON.stringify({ ...data, savedAt: Date.now() }));
}

function clearGameSave() {
  localStorage.removeItem(saveKey());
}

function status(text, detail = "") {
  return `<div class="game-status"><span>${text}</span>${detail ? `<strong>${detail}</strong>` : ""}<small>${playerKey.startsWith("user:") ? "Saved to your account on this browser" : "Saved on this device"}</small></div>`;
}

function howToPlay() {
  return `<aside class="how-card"><h2>How to play</h2><ul>${game.how.map((item) => `<li>${item}</li>`).join("")}</ul></aside>`;
}

function render2048(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let board = saved?.board || Array(16).fill(0);
  if (!saved) { board[5] = 2; board[10] = 2; }
  const addTile = () => {
    const open = board.map((value, index) => value ? -1 : index).filter((index) => index >= 0);
    if (open.length) board[open[Math.floor(Math.random() * open.length)]] = Math.random() < 0.9 ? 2 : 4;
  };
  const slide = (line) => {
    const compact = line.filter(Boolean);
    const merged = [];
    for (let i = 0; i < compact.length; i += 1) {
      if (compact[i] === compact[i + 1]) { merged.push(compact[i] * 2); i += 1; }
      else merged.push(compact[i]);
    }
    return [...merged, ...Array(4 - merged.length).fill(0)];
  };
  const move = (direction) => {
    const next = Array(16).fill(0);
    for (let line = 0; line < 4; line += 1) {
      const indexes = direction === "left" ? [0, 1, 2, 3].map((n) => line * 4 + n)
        : direction === "right" ? [3, 2, 1, 0].map((n) => line * 4 + n)
        : direction === "up" ? [line, line + 4, line + 8, line + 12]
        : [line + 12, line + 8, line + 4, line];
      slide(indexes.map((i) => board[i])).forEach((value, offset) => { next[indexes[offset]] = value; });
    }
    if (next.every((value, index) => value === board[index])) return;
    board = next;
    addTile();
    saveGame({ board });
    draw();
  };
  const draw = () => {
    const won = board.includes(2048);
    const stuck = !board.includes(0) && ["left", "right", "up", "down"].every((direction) => {
      const old = board;
      let changed = false;
      const probe = Array(16).fill(0);
      for (let line = 0; line < 4; line += 1) {
        const indexes = direction === "left" ? [0, 1, 2, 3].map((n) => line * 4 + n) : direction === "right" ? [3, 2, 1, 0].map((n) => line * 4 + n) : direction === "up" ? [line, line + 4, line + 8, line + 12] : [line + 12, line + 8, line + 4, line];
        slide(indexes.map((i) => old[i])).forEach((value, offset) => { probe[indexes[offset]] = value; });
      }
      changed = !probe.every((value, index) => value === old[index]);
      return !changed;
    });
    saveGame({ board });
    setPanel(`${howToPlay()}${status(won ? "You reached 2048" : stuck ? "No moves left" : "Playing", "Swipe or tap arrows")}
      <div class="grid" style="grid-template-columns:repeat(4,minmax(0,1fr))">${board.map((value) => `<div class="tile tile-${value}">${value || ""}</div>`).join("")}</div>
      <div class="pad"><button class="cell" data-dir="up">↑</button><button class="cell" data-dir="left">←</button><button class="cell" data-dir="down">↓</button><button class="cell" data-dir="right">→</button></div>`);
    panel.querySelectorAll("[data-dir]").forEach((button) => button.addEventListener("click", () => move(button.dataset.dir)));
    installSwipe(panel.querySelector(".grid"), move);
  };
  window.onkeydown = (event) => {
    const keys = { ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right", ArrowUp: "up", w: "up", ArrowDown: "down", s: "down" };
    if (keys[event.key]) { event.preventDefault(); move(keys[event.key]); }
  };
  draw();
}

function installSwipe(node, callback) {
  let startX = 0;
  let startY = 0;
  node.addEventListener("pointerdown", (event) => { startX = event.clientX; startY = event.clientY; node.setPointerCapture(event.pointerId); });
  node.addEventListener("pointerup", (event) => {
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    callback(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? "right" : "left" : dy > 0 ? "down" : "up");
  });
}

function renderMinesweeper(fresh = false) {
  const size = 10;
  const saved = fresh ? null : loadGameSave();
  let cells = saved?.cells;
  let text = saved?.text || "Playing";
  if (!cells) {
    const mines = new Set();
    while (mines.size < 14) mines.add(Math.floor(Math.random() * size * size));
    cells = Array.from({ length: size * size }, (_, index) => ({ mine: mines.has(index), open: false, flag: false, count: 0 }));
    cells.forEach((cell, index) => {
      const r = Math.floor(index / size), c = index % size;
      for (let rr = Math.max(0, r - 1); rr <= Math.min(size - 1, r + 1); rr += 1) for (let cc = Math.max(0, c - 1); cc <= Math.min(size - 1, c + 1); cc += 1) if (cells[rr * size + cc].mine) cell.count += 1;
    });
  }
  const open = (index) => {
    const cell = cells[index];
    if (cell.open || cell.flag || text !== "Playing") return;
    cell.open = true;
    if (cell.mine) { text = "Boom"; cells.forEach((item) => { if (item.mine) item.open = true; }); }
    else if (cell.count === 0) neighbors(index, size).forEach(open);
    if (cells.every((item) => item.mine || item.open)) text = "Cleared";
    draw();
  };
  const flag = (index) => { if (!cells[index].open && text === "Playing") cells[index].flag = !cells[index].flag; draw(); };
  const draw = () => {
    saveGame({ cells, text });
    setPanel(`${howToPlay()}${status(text, "Tap reveal, right-click or hold flag")}<div class="grid mine-grid">${cells.map((cell, index) => `<button class="cell mine-cell ${cell.open ? "open" : ""} ${cell.open && cell.mine ? "mine" : ""} ${cell.flag ? "flag" : ""}" data-i="${index}">${cell.open ? cell.mine ? "x" : cell.count || "" : cell.flag ? "!" : ""}</button>`).join("")}</div>`);
    panel.querySelectorAll(".mine-cell").forEach((button) => {
      let hold;
      let held = false;
      button.addEventListener("pointerdown", (event) => {
        if (event.button === 2) return;
        held = false;
        hold = setTimeout(() => {
          held = true;
          flag(Number(button.dataset.i));
        }, 420);
      });
      button.addEventListener("pointerup", (event) => {
        clearTimeout(hold);
        if (event.button === 2 || held) return;
        open(Number(button.dataset.i));
      });
      button.addEventListener("contextmenu", (event) => { event.preventDefault(); flag(Number(button.dataset.i)); });
    });
  };
  draw();
}

function neighbors(index, size) {
  const r = Math.floor(index / size), c = index % size, out = [];
  for (let rr = Math.max(0, r - 1); rr <= Math.min(size - 1, r + 1); rr += 1) for (let cc = Math.max(0, c - 1); cc <= Math.min(size - 1, c + 1); cc += 1) if (rr !== r || cc !== c) out.push(rr * size + cc);
  return out;
}

function renderConnectFour(fresh = false) {
  const rows = 6, cols = 7;
  const saved = fresh ? null : loadGameSave();
  let board = saved?.board || Array(rows * cols).fill("");
  let turn = saved?.turn || "red", text = saved?.text || "Red's turn";
  const win = (i) => [[1, 0], [0, 1], [1, 1], [1, -1]].some(([dr, dc]) => {
    const r = Math.floor(i / cols), c = i % cols, color = board[i];
    let count = 1;
    for (const sign of [-1, 1]) {
      let rr = r + dr * sign, cc = c + dc * sign;
      while (rr >= 0 && rr < rows && cc >= 0 && cc < cols && board[rr * cols + cc] === color) { count += 1; rr += dr * sign; cc += dc * sign; }
    }
    return count >= 4;
  });
  const drop = (col) => {
    if (text.includes("wins") || text === "Draw") return;
    for (let r = rows - 1; r >= 0; r -= 1) {
      const i = r * cols + col;
      if (!board[i]) {
        board[i] = turn;
        text = win(i) ? `${turn === "red" ? "Red" : "Yellow"} wins` : board.every(Boolean) ? "Draw" : `${turn === "red" ? "Yellow" : "Red"}'s turn`;
        turn = turn === "red" ? "yellow" : "red";
        draw();
        return;
      }
    }
  };
  const draw = () => {
    saveGame({ board, turn, text });
    setPanel(`${howToPlay()}${status(text, "Two players")}<div class="grid connect-grid">${board.map((value, index) => `<button class="connect-cell" data-c="${index % cols}"><span class="disc ${value}"></span></button>`).join("")}</div>`);
    panel.querySelectorAll(".connect-cell").forEach((button) => button.addEventListener("click", () => drop(Number(button.dataset.c))));
  };
  draw();
}

function renderTicTacToe(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let board = saved?.board || Array(9).fill("");
  let turn = saved?.turn || "X", text = saved?.text || "X's turn";
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const draw = () => {
    saveGame({ board, turn, text });
    setPanel(`${howToPlay()}${status(text, "Two players")}<div class="grid tac-grid">${board.map((value, index) => `<button class="cell tac-cell" data-i="${index}">${value}</button>`).join("")}</div>`);
    panel.querySelectorAll(".tac-cell").forEach((button) => button.addEventListener("click", () => {
      const i = Number(button.dataset.i);
      if (board[i] || text.includes("wins") || text === "Draw") return;
      board[i] = turn;
      text = lines.some((line) => line.every((n) => board[n] === turn)) ? `${turn} wins` : board.every(Boolean) ? "Draw" : `${turn === "X" ? "O" : "X"}'s turn`;
      turn = turn === "X" ? "O" : "X";
      draw();
    }));
  };
  draw();
}

function renderMemory(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  const icons = saved?.icons || "AABBCCDDEEFFGGHH".split("").sort(() => Math.random() - 0.5);
  const open = new Set(saved?.open || []), done = new Set(saved?.done || []);
  let pick = saved?.pick || [];
  const choose = (i) => {
    if (done.has(i) || open.has(i) || pick.length >= 2) return;
    open.add(i); pick.push(i); draw();
    if (pick.length === 2) setTimeout(() => {
      if (icons[pick[0]] === icons[pick[1]]) pick.forEach((n) => done.add(n));
      pick.forEach((n) => open.delete(n));
      pick = []; draw();
    }, 650);
  };
  const draw = () => {
    saveGame({ icons, open: [...open], done: [...done], pick });
    setPanel(`${howToPlay()}${status(done.size === icons.length ? "Matched" : "Playing", "Find pairs")}<div class="grid memory-grid">${icons.map((value, index) => `<button class="cell memory-cell" data-i="${index}">${open.has(index) || done.has(index) ? value : ""}</button>`).join("")}</div>`);
    panel.querySelectorAll(".memory-cell").forEach((button) => button.addEventListener("click", () => choose(Number(button.dataset.i))));
  };
  draw();
}

function renderLightsOut(fresh = false) {
  const size = 5;
  let lights = (fresh ? null : loadGameSave())?.lights || Array.from({ length: size * size }, () => Math.random() > 0.45);
  const flip = (i) => {
    [i, i - size, i + size, i % size ? i - 1 : -1, i % size < size - 1 ? i + 1 : -1].forEach((n) => { if (n >= 0 && n < lights.length) lights[n] = !lights[n]; });
    draw();
  };
  const draw = () => {
    saveGame({ lights });
    setPanel(`${howToPlay()}${status(lights.some(Boolean) ? "Playing" : "Cleared", "Turn all lights off")}<div class="grid lights-grid">${lights.map((on, i) => `<button class="cell ${on ? "light-on" : ""}" data-i="${i}"></button>`).join("")}</div>`);
    panel.querySelectorAll(".cell").forEach((button) => button.addEventListener("click", () => flip(Number(button.dataset.i))));
  };
  draw();
}

function renderRps(fresh = false) {
  const items = ["Rock", "Paper", "Scissors"];
  const saved = fresh ? null : loadGameSave();
  setPanel(`${howToPlay()}${status("Choose one", "Instant round")}<div class="choices">${items.map((item) => `<button class="choice-button" data-choice="${item}">${item}</button>`).join("")}</div><p class="board-note" id="rps-result">${saved?.result || ""}</p>`);
  panel.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
    const you = button.dataset.choice, them = items[Math.floor(Math.random() * items.length)];
    const result = you === them ? "Draw" : (you === "Rock" && them === "Scissors") || (you === "Paper" && them === "Rock") || (you === "Scissors" && them === "Paper") ? "You win" : "You lose";
    const text = `${result}. You chose ${you}; the game chose ${them}.`;
    panel.querySelector("#rps-result").textContent = text;
    saveGame({ result: text });
  }));
}

function renderHangman(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  const word = saved?.word || "PUZZLE";
  const guessed = new Set(saved?.guessed || []);
  let misses = saved?.misses || 0;
  const draw = () => {
    const shown = word.split("").map((letter) => guessed.has(letter) ? letter : "_").join(" ");
    const complete = !shown.includes("_");
    saveGame({ word, guessed: [...guessed], misses });
    setPanel(`${howToPlay()}${status(complete ? "Solved" : misses >= 6 ? "Missed" : "Guessing", `${6 - misses} misses left`)}<div class="hangman-word">${shown.split(" ").map((letter) => `<span class="card">${letter}</span>`).join("")}</div><div class="keyboard">${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => `<button class="key-button" data-letter="${letter}" ${guessed.has(letter) ? "disabled" : ""}>${letter}</button>`).join("")}</div>`);
    panel.querySelectorAll("[data-letter]").forEach((button) => button.addEventListener("click", () => { const letter = button.dataset.letter; guessed.add(letter); if (!word.includes(letter)) misses += 1; draw(); }));
  };
  draw();
}

function renderWordle(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  const answer = saved?.answer || "PLANT";
  const guesses = saved?.guesses || [];
  const submit = () => {
    const input = panel.querySelector("#word-guess");
    const guess = input.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5);
    if (guess.length === 5 && guesses.length < 6) guesses.push(guess);
    draw();
  };
  const draw = () => {
    saveGame({ answer, guesses });
    setPanel(`${howToPlay()}${status(guesses.includes(answer) ? "Solved" : guesses.length >= 6 ? answer : "Guessing", "Five letters")}
      ${Array.from({ length: 6 }, (_, row) => `<div class="word-row">${Array.from({ length: 5 }, (_, col) => {
        const letter = guesses[row]?.[col] || "";
        const cls = !letter ? "" : answer[col] === letter ? "hit" : answer.includes(letter) ? "near" : "miss";
        return `<span class="letter-box ${cls}">${letter}</span>`;
      }).join("")}</div>`).join("")}
      <div class="word-input"><input id="word-guess" maxlength="5" autocomplete="off"><button class="arcade-button" id="word-submit">Try</button></div>`);
    panel.querySelector("#word-submit").addEventListener("click", submit);
    panel.querySelector("#word-guess").addEventListener("keydown", (event) => { if (event.key === "Enter") submit(); });
  };
  draw();
}

function renderBlackjack(fresh = false) {
  const deck = [2,3,4,5,6,7,8,9,10,10,10,11];
  const card = () => deck[Math.floor(Math.random() * deck.length)];
  const total = (hand) => { let sum = hand.reduce((a, b) => a + b, 0), aces = hand.filter((n) => n === 11).length; while (sum > 21 && aces) { sum -= 10; aces -= 1; } return sum; };
  const saved = fresh ? null : loadGameSave();
  let you = saved?.you || [card(), card()], dealer = saved?.dealer || [card(), card()], text = saved?.text || "Your turn";
  const finish = () => {
    while (total(dealer) < 17) dealer.push(card());
    const y = total(you), d = total(dealer);
    text = y > 21 ? "Dealer wins" : d > 21 || y > d ? "You win" : d > y ? "Dealer wins" : "Draw";
    draw();
  };
  const draw = () => {
    saveGame({ you, dealer, text });
    setPanel(`${howToPlay()}${status(text, "Closest to 21")}<small>Dealer: ${total(dealer)}</small><div class="blackjack-hand">${dealer.map((n) => `<span class="card">${n === 11 ? "A" : n}</span>`).join("")}</div><small>You: ${total(you)}</small><div class="blackjack-hand">${you.map((n) => `<span class="card">${n === 11 ? "A" : n}</span>`).join("")}</div><div class="choices"><button class="choice-button" id="hit">Hit</button><button class="choice-button" id="stand">Stand</button></div>`);
    panel.querySelector("#hit").addEventListener("click", () => { if (text !== "Your turn") return; you.push(card()); if (total(you) > 21) text = "Dealer wins"; draw(); });
    panel.querySelector("#stand").addEventListener("click", finish);
  };
  draw();
}

function renderSudoku(fresh = false) {
  const puzzle = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
  const saved = fresh ? null : loadGameSave();
  const values = saved?.values || puzzle.split("");
  let selected = saved?.selected ?? -1;
  const draw = () => {
    saveGame({ values, selected });
    setPanel(`${howToPlay()}${status("Filling", "Tap a cell")}<div class="board sudoku-board">${values.map((value, i) => `<button class="board-cell ${selected === i ? "selected" : ""}" data-i="${i}">${value === "0" ? "" : value}</button>`).join("")}</div><div class="numbers">${[1,2,3,4,5,6,7,8,9].map((n) => `<button class="number-button" data-n="${n}">${n}</button>`).join("")}</div>`);
    panel.querySelectorAll("[data-i]").forEach((button) => button.addEventListener("click", () => { selected = Number(button.dataset.i); draw(); }));
    panel.querySelectorAll("[data-n]").forEach((button) => button.addEventListener("click", () => { if (selected >= 0 && puzzle[selected] === "0") values[selected] = button.dataset.n; draw(); }));
  };
  draw();
}

function renderBoardGame(kind, fresh = false) {
  if (kind === "go") return renderGo();
  const sizes = { chess: 8, checkers: 8, reversi: 8, battleship: 6 };
  const size = sizes[kind];
  let selected = (fresh ? null : loadGameSave())?.selected ?? -1;
  const draw = () => {
    saveGame({ selected });
    setPanel(`${howToPlay()}${status("Playing", kind === "battleship" ? "Find the fleet" : "Two players")}<div class="board ${kind === "battleship" ? "sea-board" : ""}" style="grid-template-columns:repeat(${size},minmax(0,1fr))">${Array.from({ length: size * size }, (_, i) => `<button class="board-cell ${((Math.floor(i / size) + i) % 2) ? "dark" : "light"} ${selected === i ? "selected" : ""}" data-i="${i}">${pieceFor(kind, i, selected)}</button>`).join("")}</div><p class="board-note">Simplified ${games[kind].title} board from the secret games collection, sized for phones and tablets.</p>`);
    panel.querySelectorAll("[data-i]").forEach((button) => button.addEventListener("click", () => { selected = Number(button.dataset.i); draw(); }));
  };
  draw();
}

function pieceFor(kind, i, selected) {
  if (kind === "chess") return [0,7,56,63].includes(i) ? "R" : [1,6,57,62].includes(i) ? "N" : [2,5,58,61].includes(i) ? "B" : [3,59].includes(i) ? "Q" : [4,60].includes(i) ? "K" : i >= 8 && i < 16 || i >= 48 && i < 56 ? "P" : "";
  if (kind === "checkers") return (Math.floor(i / 8) < 3 || Math.floor(i / 8) > 4) && (Math.floor(i / 8) + i) % 2 ? "●" : "";
  if (kind === "reversi") return [27,36].includes(i) ? '<span class="disc white"></span>' : [28,35].includes(i) ? '<span class="disc black"></span>' : "";
  if (kind === "battleship") return selected === i ? "x" : "";
  return "";
}

function renderGo(fresh = false) {
  const size = 9;
  const saved = fresh ? null : loadGameSave();
  let turn = saved?.turn || "black";
  const stones = saved?.stones || Array(size * size).fill("");
  const draw = () => {
    saveGame({ turn, stones });
    setPanel(`${howToPlay()}${status(`${turn[0].toUpperCase()}${turn.slice(1)}'s turn`, "Compact board")}<div class="board go-board">${stones.map((stone, i) => `<button class="board-cell" data-i="${i}">${stone ? `<span class="stone ${stone}"></span>` : ""}</button>`).join("")}</div>`);
    panel.querySelectorAll("[data-i]").forEach((button) => button.addEventListener("click", () => { const i = Number(button.dataset.i); if (!stones[i]) { stones[i] = turn; turn = turn === "black" ? "white" : "black"; draw(); } }));
  };
  draw();
}

function renderFifteen(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let tiles = saved?.tiles || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15];
  const move = (index) => {
    const blank = tiles.indexOf(0);
    const sameRow = Math.floor(index / 4) === Math.floor(blank / 4);
    const near = Math.abs(index - blank) === 4 || (sameRow && Math.abs(index - blank) === 1);
    if (!near) return;
    [tiles[index], tiles[blank]] = [tiles[blank], tiles[index]];
    draw();
  };
  const draw = () => {
    const solved = tiles.every((value, index) => index === 15 ? value === 0 : value === index + 1);
    saveGame({ tiles });
    setPanel(`${howToPlay()}${status(solved ? "Solved" : "Sliding", "Put 1 to 15 in order")}<div class="grid puzzle-grid">${tiles.map((value, index) => `<button class="cell puzzle-cell ${value ? "" : "blank"}" data-i="${index}">${value || ""}</button>`).join("")}</div>`);
    panel.querySelectorAll("[data-i]").forEach((button) => button.addEventListener("click", () => move(Number(button.dataset.i))));
  };
  draw();
}

function renderSimon(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  const colors = ["teal", "coral", "gold", "blue"];
  let pattern = saved?.pattern || [];
  let input = saved?.input || [];
  let text = saved?.text || "Ready";
  const addStep = () => {
    pattern = [...pattern, colors[Math.floor(Math.random() * colors.length)]];
    input = [];
    text = `Round ${pattern.length}`;
    draw();
  };
  const press = (color) => {
    if (!pattern.length) return;
    input.push(color);
    const ok = pattern[input.length - 1] === color;
    text = ok ? input.length === pattern.length ? "Correct" : "Keep going" : "Missed";
    if (!ok) pattern = [];
    if (ok && input.length === pattern.length) setTimeout(addStep, 500);
    draw();
  };
  const draw = () => {
    saveGame({ pattern, input, text });
    setPanel(`${howToPlay()}${status(text, pattern.length ? `Pattern: ${pattern.length}` : "Start a pattern")}<div class="simon-grid">${colors.map((color) => `<button class="simon-button ${color}" data-color="${color}">${color}</button>`).join("")}</div><div class="choices"><button class="choice-button" id="simon-start">Start Pattern</button></div>`);
    panel.querySelector("#simon-start").addEventListener("click", addStep);
    panel.querySelectorAll("[data-color]").forEach((button) => button.addEventListener("click", () => press(button.dataset.color)));
  };
  draw();
}

function renderNumberGuess(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let answer = saved?.answer || Math.floor(Math.random() * 100) + 1;
  let guesses = saved?.guesses || [];
  let text = saved?.text || "Guessing";
  const submit = () => {
    const value = Number(panel.querySelector("#number-guess-input").value);
    if (!Number.isInteger(value) || value < 1 || value > 100) return;
    guesses = [...guesses, value];
    text = value === answer ? "Found it" : value < answer ? "Higher" : "Lower";
    draw();
  };
  const draw = () => {
    saveGame({ answer, guesses, text });
    setPanel(`${howToPlay()}${status(text, `${guesses.length} guesses`)}<div class="word-input"><input id="number-guess-input" type="number" min="1" max="100" inputmode="numeric" placeholder="1-100"><button class="arcade-button" id="number-guess-submit">Try</button></div><p class="board-note">${guesses.length ? `Guesses: ${guesses.join(", ")}` : "No guesses yet."}</p>`);
    panel.querySelector("#number-guess-submit").addEventListener("click", submit);
    panel.querySelector("#number-guess-input").addEventListener("keydown", (event) => { if (event.key === "Enter") submit(); });
  };
  draw();
}

function renderCoinDice(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let result = saved?.result || "Ready";
  const draw = () => {
    saveGame({ result });
    setPanel(`${howToPlay()}${status("Chance", "Quick picker")}<div class="chance-result">${result}</div><div class="choices"><button class="choice-button" id="coin">Flip Coin</button><button class="choice-button" id="dice">Roll Dice</button></div>`);
    panel.querySelector("#coin").addEventListener("click", () => { result = Math.random() < 0.5 ? "Heads" : "Tails"; draw(); });
    panel.querySelector("#dice").addEventListener("click", () => { result = String(Math.floor(Math.random() * 6) + 1); draw(); });
  };
  draw();
}
