const games = {
  "mc-2d": { title: "MC 2D", type: "Action", description: "Mine, build, explore, and save your own world.", how: ["Move through a generated block world.", "Mine blocks and place them from your hotbar.", "Your world saves automatically for this user on this browser."] },
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
  "reaction-tap": { title: "Reaction Tap", type: "Challenge", description: "Wait for green, then tap as fast as you can.", how: ["Press Start.", "Do not tap while it says wait.", "Tap as soon as the panel turns green."], render: renderReactionTap },
  "aim-trainer": { title: "Aim Trainer", type: "Action", description: "Tap small targets before the timer ends.", how: ["Tap Start.", "Hit every target that appears.", "Misses do not hurt, but the clock keeps moving."], render: renderAimTrainer },
  whack: { title: "Whack", type: "Action", description: "Hit the lit square before it jumps away.", how: ["Tap Start.", "Tap the glowing square.", "Try to build the highest score before time ends."], render: renderWhack },
  "maze-runner": { title: "Maze Runner", type: "Puzzle", description: "Move through a compact maze to the exit.", how: ["Use arrows, WASD, or tap the move buttons.", "Walls block movement.", "Reach E to win."], render: renderMazeRunner },
  "color-match": { title: "Color Match", type: "Puzzle", description: "Pick the word that matches the shown color.", how: ["Look at the large color card.", "Tap the matching color name.", "Try to keep your streak alive."], render: renderColorMatch },
  "math-rush": { title: "Math Rush", type: "Challenge", description: "Solve quick arithmetic before the rounds run out.", how: ["Choose the answer to each problem.", "Correct answers build your score.", "Ten rounds make one game."], render: renderMathRush },
  "pattern-grid": { title: "Pattern Grid", type: "Memory", description: "Remember the highlighted squares.", how: ["Tap Start to flash a small pattern.", "After it hides, tap the same squares.", "Each clear round adds one more square."], render: renderPatternGrid },
  "word-scramble": { title: "Word Scramble", type: "Word", description: "Unscramble a tiny word puzzle.", how: ["Look at the shuffled letters.", "Type the original word.", "Use New game for another word."], render: renderWordScramble },
  "tile-stack": { title: "Tile Stack", type: "Puzzle", description: "Stack matching tiles into calm columns.", how: ["Tap two tiles to swap them.", "Group matching symbols into columns.", "The board is saved after every swap."], render: renderTileStack },
  "safe-cracker": { title: "Safe Cracker", type: "Puzzle", description: "Find the three-digit code from hints.", how: ["Enter three digits.", "Green dots mean exact matches.", "Gold dots mean right digit, wrong place."], render: renderSafeCracker },
  "odd-one-out": { title: "Odd One Out", type: "Puzzle", description: "Spot the one symbol that is different.", how: ["Scan the grid.", "Tap the symbol that appears only once.", "A fresh board appears after each choice."], render: renderOddOne },
  "path-builder": { title: "Path Builder", type: "Puzzle", description: "Draw a path from start to exit.", how: ["Tap neighboring cells to extend the path.", "Reach the exit without jumping.", "Tap New game to clear the route."], render: renderPathBuilder },
  "emoji-sequence": { title: "Emoji Sequence", type: "Memory", description: "Repeat a growing emoji order.", how: ["Tap Start sequence.", "Read the shown emojis.", "Tap them back in the same order."], render: renderEmojiSequence },
  "balance-scale": { title: "Balance Scale", type: "Puzzle", description: "Balance two sides with tiny weights.", how: ["Tap weights to move them left or right.", "Try to make both sides equal.", "Your current scale is saved."], render: renderBalanceScale },
  "mini-piano": { title: "Mini Piano", type: "Memory", description: "Play back a short melody.", how: ["Tap Start melody.", "Watch the notes light up.", "Tap the same notes back."], render: renderMiniPiano },
  "shape-sort": { title: "Shape Sort", type: "Puzzle", description: "Sort shapes into the matching bins.", how: ["Tap a shape to pick it up.", "Tap the matching bin.", "Clear every shape at your own pace."], render: renderShapeSort },
};

const gameText = {
  en: {
    games: "Games", home: "Home", game: "Game", play: "Play", intro: "Touch-friendly classics, puzzles, memory games, and board games. Each play page explains the rules and saves progress for the current user on this browser.", featured: "Featured", snakeTitle: "Snake Lab", snakeDescription: "Classic snake with extra controls", snakeDetail: "Full configurable snake mode", action: "Action", strategy: "Strategy", puzzle: "Puzzle", word: "Word", classic: "Classic", memory: "Memory", challenge: "Challenge", allGames: "All games", newGame: "New game", howToPlay: "How to play", savedAccount: "Saved to your account on this browser", savedDevice: "Saved on this device",
    playing: "Playing", matched: "Matched", cleared: "Cleared", solved: "Solved", missed: "Missed", guessing: "Guessing", chooseOne: "Choose one", instantRound: "Instant round", personalRecord: "New personal record", globalRecord: "New all-user record", rock: "Rock", paper: "Paper", scissors: "Scissors", rpsResult: "{result}. You chose {you}; the game chose {them}.", youWin: "You win", youLose: "You lose", draw: "Draw", yourTurn: "Your turn", dealerWins: "Dealer wins", closest21: "Closest to 21", dealer: "Dealer", you: "You", hit: "Hit", stand: "Stand", filling: "Filling", tapCell: "Tap a cell", twoPlayers: "Two players", findPairs: "Find pairs", turnLightsOff: "Turn all lights off", fiveLetters: "Five letters", try: "Try", findFleet: "Find the fleet", compactBoard: "Compact board", simplifiedBoard: "Simplified {game} board from the secret games collection, sized for phones and tablets.", blackTurn: "Black's turn", whiteTurn: "White's turn", sliding: "Sliding", order15: "Put 1 to 15 in order", ready: "Ready", correct: "Correct", keepGoing: "Keep going", round: "Round {count}", startPattern: "Start a pattern", pattern: "Pattern: {count}", higher: "Higher", lower: "Lower", foundIt: "Found it", guesses: "{count} guesses", guessesList: "Guesses: {list}", noGuesses: "No guesses yet.", chance: "Chance", quickPicker: "Quick picker", flipCoin: "Flip Coin", rollDice: "Roll Dice", heads: "Heads", tails: "Tails", noBest: "No best yet", bestMs: "Best {best}ms", tap: "TAP", wait: "Wait...", start: "Start", waitGreen: "Wait for green", tapNow: "Tap now", tooEarly: "Too early", running: "Running", scoreBest: "Score {score} · Best {best}", whacking: "Whacking", findExit: "Find the exit", escaped: "Escaped", moves: "{count} moves", choose: "Choose", streakBest: "Streak {streak} · Best {best}", itWas: "It was {answer}", score10: "Score {score}/10", answerIs: "Answer: {answer}", gameOver: "Game over", finished: "Finished", boom: "Boom", noMoves: "No moves left", reached2048: "You reached 2048", swipeArrows: "Swipe or tap arrows", revealFlag: "Tap reveal, right-click or hold flag", redTurn: "Red's turn", yellowTurn: "Yellow's turn", redWins: "Red wins", yellowWins: "Yellow wins", xTurn: "X's turn", oTurn: "O's turn", wins: "{mark} wins", missesLeft: "{count} misses left",
  },
  zh: {
    "mc-2d": { title: "MC 2D", type: "动作", description: "挖掘、建造、探索并保存你自己的世界。", how: ["在生成的方块世界里移动。", "挖掘方块，再从快捷栏放置。", "世界会自动为这个浏览器中的当前用户保存。"] },
    games: "游戏", home: "主页", game: "游戏", play: "开玩", intro: "适合触屏的经典、益智、记忆和棋盘小游戏。每个游戏页都会说明规则，并为当前用户在这个浏览器保存进度。", featured: "推荐", snakeTitle: "贪吃蛇实验室", snakeDescription: "带更多控制的经典贪吃蛇", snakeDetail: "可配置的完整贪吃蛇模式", action: "动作", strategy: "策略", puzzle: "益智", word: "文字", classic: "经典", memory: "记忆", challenge: "挑战", allGames: "所有游戏", newGame: "新游戏", howToPlay: "怎么玩", savedAccount: "已为你的账户保存在这个浏览器", savedDevice: "已保存在这个设备", playing: "进行中", matched: "已配对", cleared: "已清空", solved: "已解出", missed: "失败了", guessing: "猜测中", chooseOne: "选一个", instantRound: "即时一局", personalRecord: "新的个人记录", globalRecord: "新的全站记录", rock: "石头", paper: "布", scissors: "剪刀", rpsResult: "{result}。你选了 {you}；游戏选了 {them}。", youWin: "你赢了", youLose: "你输了", draw: "平局", yourTurn: "你的回合", dealerWins: "庄家赢了", closest21: "尽量接近 21", dealer: "庄家", you: "你", hit: "要牌", stand: "停牌", filling: "填写中", tapCell: "点格子", twoPlayers: "双人游戏", findPairs: "找对子", turnLightsOff: "关掉所有灯", fiveLetters: "五个字母", try: "试试", findFleet: "找到舰队", compactBoard: "小棋盘", simplifiedBoard: "来自秘密游戏合集的简化 {game} 棋盘，适合手机和平板。", blackTurn: "黑方回合", whiteTurn: "白方回合", sliding: "滑动中", order15: "把 1 到 15 排回顺序", ready: "准备好了", correct: "正确", keepGoing: "继续", round: "第 {count} 轮", startPattern: "开始一个序列", pattern: "序列：{count}", higher: "更大", lower: "更小", foundIt: "找到了", guesses: "已猜 {count} 次", guessesList: "猜过：{list}", noGuesses: "还没有猜。", chance: "机会", quickPicker: "快速随机", flipCoin: "抛硬币", rollDice: "掷骰子", heads: "正面", tails: "反面", noBest: "还没有最佳", bestMs: "最佳 {best}ms", tap: "点！", wait: "等待...", start: "开始", waitGreen: "等绿色", tapNow: "现在点", tooEarly: "太早了", running: "运行中", scoreBest: "分数 {score} · 最佳 {best}", whacking: "敲打中", findExit: "找到出口", escaped: "逃出去了", moves: "{count} 步", choose: "选择", streakBest: "连对 {streak} · 最佳 {best}", itWas: "答案是 {answer}", score10: "分数 {score}/10", answerIs: "答案：{answer}", gameOver: "游戏结束", finished: "完成", boom: "爆了", noMoves: "没有可走步数", reached2048: "到达 2048", swipeArrows: "滑动或点箭头", revealFlag: "点开，右键或长按插旗", redTurn: "红方回合", yellowTurn: "黄方回合", redWins: "红方赢了", yellowWins: "黄方赢了", xTurn: "X 回合", oTurn: "O 回合", wins: "{mark} 赢了", missesLeft: "还可错 {count} 次",
  },
  ja: {
    "mc-2d": { title: "MC 2D", type: "アクション", description: "掘って、作って、探検して、自分の世界を保存。", how: ["生成されたブロック世界を移動します。", "ブロックを掘り、ホットバーから置きます。", "このブラウザのユーザーごとに自動保存されます。"] },
    "pattern-grid": { title: "パターングリッド", type: "記憶", description: "光ったマスを覚えます。", how: ["スタートで小さなパターンを表示します。", "隠れたら同じマスをタップします。", "クリアするたびにマスが1つ増えます。"] },
    "word-scramble": { title: "文字ならべ", type: "単語", description: "短い単語を元に戻します。", how: ["シャッフルされた文字を見ます。", "元の単語を入力します。", "新しいゲームで別の単語にできます。"] },
    "tile-stack": { title: "タイル整列", type: "パズル", description: "同じ記号を落ち着いてそろえます。", how: ["2つのタイルをタップして交換します。", "同じ記号を列にまとめます。", "交換するたびに保存されます。"] },
    "safe-cracker": { title: "金庫コード", type: "パズル", description: "ヒントから3桁のコードを探します。", how: ["3つの数字を入力します。", "緑は数字も場所も正解です。", "金は数字は正しく場所が違います。"] },
    "odd-one-out": { title: "ひとつだけ違う", type: "パズル", description: "1つだけ違う記号を見つけます。", how: ["グリッドを見ます。", "1回だけ出る記号をタップします。", "選ぶたびに新しい盤面になります。"] },
    "path-builder": { title: "道づくり", type: "パズル", description: "スタートから出口まで道をつなぎます。", how: ["隣のマスをタップして道を伸ばします。", "飛び越えず出口へ進みます。", "新しいゲームで道を消せます。"] },
    "emoji-sequence": { title: "絵文字シーケンス", type: "記憶", description: "長くなる絵文字の順番を繰り返します。", how: ["シーケンスを開始します。", "表示された絵文字を覚えます。", "同じ順番でタップします。"] },
    "balance-scale": { title: "バランスはかり", type: "パズル", description: "小さなおもりで左右を同じ重さにします。", how: ["おもりをタップして左右へ動かします。", "両側を同じ重さにします。", "今の状態は保存されます。"] },
    "mini-piano": { title: "ミニピアノ", type: "記憶", description: "短いメロディを弾き返します。", how: ["メロディを開始します。", "光る音を見ます。", "同じ順番でタップします。"] },
    "shape-sort": { title: "形分け", type: "パズル", description: "形を合う箱に分けます。", how: ["形をタップして選びます。", "合う箱をタップします。", "自分のペースで全部片付けます。"] },
  },
  ko: {
    "mc-2d": { title: "MC 2D", type: "액션", description: "캐고, 짓고, 탐험하며 나만의 월드를 저장하세요.", how: ["생성된 블록 월드를 이동하세요.", "블록을 캐고 단축바에서 다시 놓으세요.", "이 브라우저의 현재 사용자별로 자동 저장됩니다."] },
    "pattern-grid": { title: "패턴 그리드", type: "기억", description: "빛난 칸을 기억하세요.", how: ["시작을 눌러 작은 패턴을 봅니다.", "사라진 뒤 같은 칸을 누릅니다.", "성공할 때마다 칸이 하나 늘어납니다."] },
    "word-scramble": { title: "단어 섞기", type: "단어", description: "짧은 단어를 다시 맞춥니다.", how: ["섞인 글자를 봅니다.", "원래 단어를 입력합니다.", "새 게임으로 다른 단어를 받습니다."] },
    "tile-stack": { title: "타일 쌓기", type: "퍼즐", description: "같은 기호를 차분히 모읍니다.", how: ["타일 두 개를 눌러 바꿉니다.", "같은 기호를 줄로 모읍니다.", "바꿀 때마다 저장됩니다."] },
    "safe-cracker": { title: "금고 암호", type: "퍼즐", description: "힌트로 세 자리 암호를 찾습니다.", how: ["숫자 세 개를 입력합니다.", "초록 점은 숫자와 위치가 맞습니다.", "금색 점은 숫자는 맞고 위치가 다릅니다."] },
    "odd-one-out": { title: "다른 하나 찾기", type: "퍼즐", description: "하나만 다른 기호를 찾습니다.", how: ["격자를 살펴봅니다.", "한 번만 나온 기호를 누릅니다.", "선택하면 새 판이 나옵니다."] },
    "path-builder": { title: "길 만들기", type: "퍼즐", description: "시작에서 출구까지 길을 그립니다.", how: ["이웃한 칸을 눌러 길을 늘립니다.", "건너뛰지 말고 출구에 닿으세요.", "새 게임으로 길을 지웁니다."] },
    "emoji-sequence": { title: "이모지 순서", type: "기억", description: "길어지는 이모지 순서를 반복합니다.", how: ["순서 시작을 누릅니다.", "보이는 이모지를 기억합니다.", "같은 순서로 다시 누릅니다."] },
    "balance-scale": { title: "저울 맞추기", type: "퍼즐", description: "작은 추로 양쪽을 맞춥니다.", how: ["추를 눌러 왼쪽이나 오른쪽으로 옮깁니다.", "양쪽 무게를 같게 만듭니다.", "현재 저울은 저장됩니다."] },
    "mini-piano": { title: "미니 피아노", type: "기억", description: "짧은 멜로디를 다시 연주합니다.", how: ["멜로디 시작을 누릅니다.", "빛나는 음을 봅니다.", "같은 순서로 누릅니다."] },
    "shape-sort": { title: "도형 분류", type: "퍼즐", description: "도형을 맞는 상자에 넣습니다.", how: ["도형을 눌러 선택합니다.", "맞는 상자를 누릅니다.", "천천히 모두 정리합니다."] },
  },
  es: {
    "mc-2d": { title: "MC 2D", type: "Acción", description: "Mina, construye, explora y guarda tu propio mundo.", how: ["Recorre un mundo de bloques generado.", "Mina bloques y colócalos desde la barra rápida.", "El mundo se guarda para este usuario en el navegador."] },
    "pattern-grid": { title: "Cuadrícula de patrones", type: "Memoria", description: "Recuerda las casillas iluminadas.", how: ["Pulsa Inicio para ver un patrón.", "Cuando se oculte, toca las mismas casillas.", "Cada ronda añade una casilla."] },
    "word-scramble": { title: "Palabra mezclada", type: "Palabras", description: "Ordena una palabra pequeña.", how: ["Mira las letras mezcladas.", "Escribe la palabra original.", "Usa Nuevo juego para otra palabra."] },
    "tile-stack": { title: "Pila de fichas", type: "Puzzle", description: "Agrupa fichas iguales en columnas tranquilas.", how: ["Toca dos fichas para cambiarlas.", "Agrupa símbolos iguales en columnas.", "El tablero se guarda tras cada cambio."] },
    "safe-cracker": { title: "Caja fuerte", type: "Puzzle", description: "Encuentra el código de tres dígitos con pistas.", how: ["Escribe tres dígitos.", "Los puntos verdes son aciertos exactos.", "Los dorados son dígitos correctos en otro lugar."] },
    "odd-one-out": { title: "El diferente", type: "Puzzle", description: "Encuentra el símbolo que es distinto.", how: ["Revisa la cuadrícula.", "Toca el símbolo que aparece una vez.", "Sale un tablero nuevo tras elegir."] },
    "path-builder": { title: "Constructor de caminos", type: "Puzzle", description: "Dibuja un camino desde inicio hasta salida.", how: ["Toca casillas vecinas para extender el camino.", "Llega a la salida sin saltar.", "Nuevo juego limpia la ruta."] },
    "emoji-sequence": { title: "Secuencia emoji", type: "Memoria", description: "Repite un orden de emojis cada vez mayor.", how: ["Pulsa Iniciar secuencia.", "Lee los emojis mostrados.", "Tócalos en el mismo orden."] },
    "balance-scale": { title: "Balanza", type: "Puzzle", description: "Equilibra dos lados con pesas pequeñas.", how: ["Toca pesas para moverlas a izquierda o derecha.", "Haz que ambos lados pesen igual.", "La balanza actual se guarda."] },
    "mini-piano": { title: "Mini piano", type: "Memoria", description: "Repite una melodía corta.", how: ["Pulsa Iniciar melodía.", "Mira las notas iluminadas.", "Toca las mismas notas."] },
    "shape-sort": { title: "Ordenar formas", type: "Puzzle", description: "Pon cada forma en su caja.", how: ["Toca una forma para tomarla.", "Toca la caja correcta.", "Limpia todas a tu ritmo."] },
  },
  fr: {
    "mc-2d": { title: "MC 2D", type: "Action", description: "Mine, construis, explore et sauvegarde ton monde.", how: ["Parcours un monde de blocs généré.", "Mine des blocs et replace-les depuis la barre.", "Le monde est sauvegardé pour cet utilisateur."] },
    "pattern-grid": { title: "Grille de motifs", type: "Mémoire", description: "Mémorise les cases allumées.", how: ["Appuie sur Démarrer pour voir un motif.", "Quand il disparaît, touche les mêmes cases.", "Chaque réussite ajoute une case."] },
    "word-scramble": { title: "Mot mélangé", type: "Mots", description: "Remets un petit mot dans l'ordre.", how: ["Regarde les lettres mélangées.", "Tape le mot d'origine.", "Nouveau jeu donne un autre mot."] },
    "tile-stack": { title: "Pile de tuiles", type: "Puzzle", description: "Range les tuiles identiques en colonnes.", how: ["Touche deux tuiles pour les échanger.", "Regroupe les mêmes symboles.", "Le plateau est sauvegardé après chaque échange."] },
    "safe-cracker": { title: "Coffre-fort", type: "Puzzle", description: "Trouve le code à trois chiffres avec des indices.", how: ["Entre trois chiffres.", "Les points verts sont au bon endroit.", "Les points dorés sont les bons chiffres ailleurs."] },
    "odd-one-out": { title: "L'intrus", type: "Puzzle", description: "Repère le symbole différent.", how: ["Observe la grille.", "Touche le symbole qui apparaît une seule fois.", "Un nouveau plateau apparaît après chaque choix."] },
    "path-builder": { title: "Traceur de chemin", type: "Puzzle", description: "Trace un chemin du départ à la sortie.", how: ["Touche des cases voisines pour avancer.", "Atteins la sortie sans sauter.", "Nouveau jeu efface le trajet."] },
    "emoji-sequence": { title: "Suite d'emojis", type: "Mémoire", description: "Répète une suite d'emojis qui grandit.", how: ["Lance la séquence.", "Lis les emojis affichés.", "Retouche-les dans le même ordre."] },
    "balance-scale": { title: "Balance", type: "Puzzle", description: "Équilibre deux côtés avec de petits poids.", how: ["Touche les poids pour les déplacer.", "Fais peser les deux côtés pareil.", "La balance actuelle est sauvegardée."] },
    "mini-piano": { title: "Mini piano", type: "Mémoire", description: "Rejoue une courte mélodie.", how: ["Lance la mélodie.", "Regarde les notes allumées.", "Touche les mêmes notes."] },
    "shape-sort": { title: "Tri de formes", type: "Puzzle", description: "Range les formes dans les bons bacs.", how: ["Touche une forme pour la choisir.", "Touche le bac correspondant.", "Vide tout à ton rythme."] },
  },
  de: {
    "mc-2d": { title: "MC 2D", type: "Action", description: "Grabe, baue, erkunde und speichere deine Welt.", how: ["Bewege dich durch eine erzeugte Blockwelt.", "Baue Blöcke ab und setze sie aus der Leiste.", "Die Welt wird für diesen Benutzer gespeichert."] },
    "pattern-grid": { title: "Mustergitter", type: "Gedächtnis", description: "Merke dir die leuchtenden Felder.", how: ["Tippe Start, um ein Muster zu sehen.", "Wenn es verschwindet, tippe dieselben Felder.", "Jede Runde kommt ein Feld dazu."] },
    "word-scramble": { title: "Wortsalat", type: "Wörter", description: "Setze ein kurzes Wort zusammen.", how: ["Sieh dir die gemischten Buchstaben an.", "Gib das ursprüngliche Wort ein.", "Neues Spiel bringt ein anderes Wort."] },
    "tile-stack": { title: "Kacheln stapeln", type: "Puzzle", description: "Ordne gleiche Kacheln in ruhige Spalten.", how: ["Tippe zwei Kacheln zum Tauschen.", "Gruppiere gleiche Symbole in Spalten.", "Nach jedem Tausch wird gespeichert."] },
    "safe-cracker": { title: "Tresorknacker", type: "Puzzle", description: "Finde den dreistelligen Code mit Hinweisen.", how: ["Gib drei Ziffern ein.", "Grüne Punkte sind exakt richtig.", "Goldene Punkte sind richtige Ziffern am falschen Platz."] },
    "odd-one-out": { title: "Der Ausreißer", type: "Puzzle", description: "Finde das eine andere Symbol.", how: ["Scanne das Gitter.", "Tippe das Symbol, das nur einmal erscheint.", "Nach jeder Wahl kommt ein neues Feld."] },
    "path-builder": { title: "Pfadbauer", type: "Puzzle", description: "Zeichne einen Weg vom Start zum Ausgang.", how: ["Tippe Nachbarfelder, um den Weg zu verlängern.", "Erreiche den Ausgang ohne Sprünge.", "Neues Spiel löscht die Route."] },
    "emoji-sequence": { title: "Emoji-Folge", type: "Gedächtnis", description: "Wiederhole eine wachsende Emoji-Reihenfolge.", how: ["Starte die Folge.", "Merke dir die gezeigten Emojis.", "Tippe sie in derselben Reihenfolge."] },
    "balance-scale": { title: "Waage", type: "Puzzle", description: "Bringe beide Seiten mit kleinen Gewichten ins Gleichgewicht.", how: ["Tippe Gewichte, um sie links oder rechts zu bewegen.", "Mache beide Seiten gleich schwer.", "Die aktuelle Waage wird gespeichert."] },
    "mini-piano": { title: "Mini-Klavier", type: "Gedächtnis", description: "Spiele eine kurze Melodie nach.", how: ["Starte die Melodie.", "Achte auf die leuchtenden Noten.", "Tippe dieselben Noten zurück."] },
    "shape-sort": { title: "Formen sortieren", type: "Puzzle", description: "Sortiere Formen in passende Behälter.", how: ["Tippe eine Form, um sie zu nehmen.", "Tippe den passenden Behälter.", "Räume alles in deinem Tempo auf."] },
  },
  pt: {
    "mc-2d": { title: "MC 2D", type: "Ação", description: "Minere, construa, explore e salve seu próprio mundo.", how: ["Ande por um mundo de blocos gerado.", "Minere blocos e coloque-os pela barra rápida.", "O mundo salva para este usuário no navegador."] },
    "pattern-grid": { title: "Grade de padrões", type: "Memória", description: "Memorize os quadrados acesos.", how: ["Toque em Iniciar para ver um padrão.", "Quando sumir, toque nos mesmos quadrados.", "Cada rodada adiciona mais um quadrado."] },
    "word-scramble": { title: "Palavra embaralhada", type: "Palavras", description: "Desembaralhe uma palavra pequena.", how: ["Veja as letras misturadas.", "Digite a palavra original.", "Use Novo jogo para outra palavra."] },
    "tile-stack": { title: "Pilha de peças", type: "Puzzle", description: "Junte peças iguais em colunas.", how: ["Toque em duas peças para trocar.", "Agrupe símbolos iguais em colunas.", "O tabuleiro salva após cada troca."] },
    "safe-cracker": { title: "Cofre", type: "Puzzle", description: "Ache o código de três dígitos com pistas.", how: ["Digite três dígitos.", "Pontos verdes são acertos exatos.", "Pontos dourados são dígitos certos no lugar errado."] },
    "odd-one-out": { title: "O diferente", type: "Puzzle", description: "Encontre o único símbolo diferente.", how: ["Observe a grade.", "Toque no símbolo que aparece uma vez.", "Um novo tabuleiro surge após escolher."] },
    "path-builder": { title: "Construtor de caminho", type: "Puzzle", description: "Desenhe um caminho do início à saída.", how: ["Toque em células vizinhas para estender o caminho.", "Chegue à saída sem pular.", "Novo jogo limpa a rota."] },
    "emoji-sequence": { title: "Sequência de emojis", type: "Memória", description: "Repita uma ordem de emojis que cresce.", how: ["Inicie a sequência.", "Leia os emojis mostrados.", "Toque neles na mesma ordem."] },
    "balance-scale": { title: "Balança", type: "Puzzle", description: "Equilibre os dois lados com pesos pequenos.", how: ["Toque nos pesos para mover à esquerda ou direita.", "Deixe os dois lados iguais.", "A balança atual é salva."] },
    "mini-piano": { title: "Mini piano", type: "Memória", description: "Repita uma melodia curta.", how: ["Inicie a melodia.", "Veja as notas acesas.", "Toque as mesmas notas."] },
    "shape-sort": { title: "Separar formas", type: "Puzzle", description: "Coloque formas nas caixas certas.", how: ["Toque numa forma para pegar.", "Toque na caixa correspondente.", "Limpe tudo no seu ritmo."] },
  },
  ru: {
    "mc-2d": { title: "MC 2D", type: "Экшен", description: "Добывай, строй, исследуй и сохраняй свой мир.", how: ["Исследуй созданный блочный мир.", "Добывай блоки и ставь их с панели.", "Мир сохраняется для этого пользователя в браузере."] },
    "pattern-grid": { title: "Сетка узора", type: "Память", description: "Запомни подсвеченные клетки.", how: ["Нажми Старт, чтобы увидеть узор.", "Когда он исчезнет, нажми те же клетки.", "Каждый раунд добавляет одну клетку."] },
    "word-scramble": { title: "Слово вперемешку", type: "Слова", description: "Собери короткое слово.", how: ["Посмотри на перемешанные буквы.", "Введи исходное слово.", "Новая игра даст другое слово."] },
    "tile-stack": { title: "Стопка плиток", type: "Головоломка", description: "Собери одинаковые плитки в спокойные столбцы.", how: ["Нажми две плитки, чтобы поменять их.", "Собери одинаковые символы в столбцы.", "Доска сохраняется после каждого обмена."] },
    "safe-cracker": { title: "Взлом сейфа", type: "Головоломка", description: "Найди трехзначный код по подсказкам.", how: ["Введи три цифры.", "Зеленые точки — точное совпадение.", "Золотые точки — цифра верная, место нет."] },
    "odd-one-out": { title: "Лишний символ", type: "Головоломка", description: "Найди единственный другой символ.", how: ["Осмотри сетку.", "Нажми символ, который встречается один раз.", "После выбора появится новая доска."] },
    "path-builder": { title: "Строитель пути", type: "Головоломка", description: "Проведи путь от старта к выходу.", how: ["Нажимай соседние клетки, чтобы продолжить путь.", "Дойди до выхода без прыжков.", "Новая игра очистит маршрут."] },
    "emoji-sequence": { title: "Цепочка эмодзи", type: "Память", description: "Повтори растущую последовательность эмодзи.", how: ["Запусти последовательность.", "Запомни показанные эмодзи.", "Нажми их в том же порядке."] },
    "balance-scale": { title: "Весы", type: "Головоломка", description: "Уравновесь две стороны маленькими грузами.", how: ["Нажимай грузы, чтобы двигать их влево или вправо.", "Сделай стороны равными.", "Текущие весы сохраняются."] },
    "mini-piano": { title: "Мини-пианино", type: "Память", description: "Повтори короткую мелодию.", how: ["Запусти мелодию.", "Следи за светящимися нотами.", "Нажми те же ноты."] },
    "shape-sort": { title: "Сортировка фигур", type: "Головоломка", description: "Разложи фигуры по подходящим ящикам.", how: ["Нажми фигуру, чтобы взять ее.", "Нажми подходящий ящик.", "Очисти все в своем темпе."] },
  },
  ar: {
    "mc-2d": { title: "MC 2D", type: "حركة", description: "احفر وابن واستكشف واحفظ عالمك الخاص.", how: ["تحرك في عالم مكعبات مولد.", "احفر الكتل وضعها من الشريط.", "يحفظ العالم لهذا المستخدم في المتصفح."] },
    "pattern-grid": { title: "شبكة النمط", type: "ذاكرة", description: "تذكر المربعات المضيئة.", how: ["اضغط بدء لعرض نمط صغير.", "بعد اختفائه، اضغط المربعات نفسها.", "كل جولة ناجحة تضيف مربعا."] },
    "word-scramble": { title: "كلمة مبعثرة", type: "كلمات", description: "رتب كلمة صغيرة من جديد.", how: ["انظر إلى الحروف المبعثرة.", "اكتب الكلمة الأصلية.", "استخدم لعبة جديدة لكلمة أخرى."] },
    "tile-stack": { title: "رص البلاطات", type: "لغز", description: "اجمع الرموز المتشابهة في أعمدة هادئة.", how: ["اضغط بلاطتين لتبديلهما.", "اجمع الرموز المتشابهة في أعمدة.", "يتم حفظ اللوحة بعد كل تبديل."] },
    "safe-cracker": { title: "فاتح الخزنة", type: "لغز", description: "اعثر على رمز من ثلاثة أرقام بالتلميحات.", how: ["أدخل ثلاثة أرقام.", "النقاط الخضراء تعني رقما ومكانا صحيحين.", "النقاط الذهبية تعني رقما صحيحا في مكان خاطئ."] },
    "odd-one-out": { title: "المختلف", type: "لغز", description: "اعثر على الرمز المختلف الوحيد.", how: ["افحص الشبكة.", "اضغط الرمز الذي يظهر مرة واحدة فقط.", "تظهر لوحة جديدة بعد كل اختيار."] },
    "path-builder": { title: "باني الطريق", type: "لغز", description: "ارسم طريقا من البداية إلى المخرج.", how: ["اضغط الخلايا المجاورة لتمديد الطريق.", "صل إلى المخرج بلا قفز.", "لعبة جديدة تمسح الطريق."] },
    "emoji-sequence": { title: "تسلسل الرموز", type: "ذاكرة", description: "كرر ترتيب رموز يزداد طولا.", how: ["ابدأ التسلسل.", "تذكر الرموز المعروضة.", "اضغطها بالترتيب نفسه."] },
    "balance-scale": { title: "ميزان", type: "لغز", description: "وازن الجانبين بأوزان صغيرة.", how: ["اضغط الأوزان لنقلها يمينا أو يسارا.", "اجعل الجانبين متساويين.", "يتم حفظ الميزان الحالي."] },
    "mini-piano": { title: "بيانو صغير", type: "ذاكرة", description: "أعد عزف لحن قصير.", how: ["ابدأ اللحن.", "راقب النغمات المضيئة.", "اضغط النغمات نفسها."] },
    "shape-sort": { title: "فرز الأشكال", type: "لغز", description: "ضع الأشكال في الصناديق المناسبة.", how: ["اضغط شكلا لاختياره.", "اضغط الصندوق المطابق.", "أنهِ كل الأشكال على مهلك."] },
  },
};
["ja", "ko", "es", "fr", "de", "pt", "ru", "ar"].forEach((code) => {
  gameText[code] = { ...gameText.en, ...(gameText[code] || {}) };
});

const gameTranslations = {
  zh: {
    "2048": { type: "动作", description: "滑动相同数字，合成 2048。", how: ["滑动或按箭头移动所有方块。", "相同数字会合成更大的数字。", "每一步都会为当前用户保存棋盘。"] },
    minesweeper: { title: "扫雷", type: "动作", description: "避开地雷，清空棋盘。", how: ["点击格子打开。", "右键、长按或按住可以插旗。", "数字表示旁边有多少颗雷。"] },
    "connect-four": { title: "四子棋", type: "策略", description: "先连成四颗棋子。", how: ["点击一列落子。", "红黄双方轮流下。", "横、竖或斜连四个就赢。"] },
    "tic-tac-toe": { title: "井字棋", type: "策略", description: "快速点击的三连棋。", how: ["点击空格。", "X 和 O 轮流下。", "三个相同标记连成一线就赢。"] },
    chess: { title: "国际象棋", type: "策略", description: "给两人玩的紧凑棋盘。", how: ["点击格子查看或标记。", "适合手机上的实体对局摆盘。", "选中的格子会为你的用户保存。"] },
    go: { title: "围棋", type: "策略", description: "带吃子规则的紧凑围棋盘。", how: ["黑白双方轮流落子。", "点击空点落子。", "这个小棋盘适合平板快速玩。"] },
    checkers: { title: "跳棋", type: "策略", description: "斜走、跳吃、升王。", how: ["点击棋子和目标格来计划走法。", "用斜向跳跃吃子。", "棋盘会为你的用户保存。"] },
    reversi: { title: "黑白棋", type: "策略", description: "落子翻转对方一整线棋子。", how: ["点击空格标记一步。", "夹住对方棋子后翻转。", "简单棋盘适合触屏。"] },
    battleship: { title: "战舰", type: "策略", description: "找到隐藏舰队。", how: ["点击海面格子搜索。", "标记的格子会保存。", "当作快速隐藏舰队棋盘。"] },
    "memory-match": { title: "记忆配对", type: "益智", description: "翻牌并找出每一对。", how: ["点击两张牌翻开。", "配对成功的牌会保持打开。", "找完所有对子就通关。"] },
    hangman: { title: "猜词", type: "文字", description: "在错误次数用完前猜出单词。", how: ["点击字母猜单词。", "错一个字母会用掉一次机会。", "六次错误前解出。"] },
    "rock-paper-scissors": { title: "石头剪刀布", type: "经典", description: "快速决定的小手势游戏。", how: ["点击石头、剪刀或布。", "石头胜剪刀，剪刀胜布，布胜石头。", "最新一局会保存。"] },
    sudoku: { title: "数独", type: "挑战", description: "用 1 到 9 填满棋盘。", how: ["点击空格，再点数字。", "原始题目数字不能改。", "每行、每列、每宫填入 1 到 9。"] },
    blackjack: { title: "二十一点", type: "挑战", description: "尽量接近 21 但不要爆。", how: ["点要牌抽一张。", "觉得够接近时点停牌。", "A 会自动按 11 或 1 计算。"] },
    wordle: { title: "Wordle", type: "挑战", description: "猜五个字母的单词。", how: ["输入五字母单词后点试试。", "绿色是位置正确，金色是字母存在但位置不同。", "一共有六次机会。"] },
    "lights-out": { title: "关灯", type: "挑战", description: "关掉所有灯。", how: ["点一盏灯会翻转它和邻居。", "把所有灯关掉就过关。", "每次点击都会保存图案。"] },
    "fifteen-puzzle": { title: "十五拼图", type: "益智", description: "把数字滑回顺序。", how: ["点击空格旁边的方块。", "滑到数字按 1 到 15 排列。", "每一步都会保存。"] },
    simon: { title: "西蒙记忆", type: "记忆", description: "重复越来越长的颜色序列。", how: ["点开始序列。", "看闪烁颜色，然后重复。", "每轮正确都会多一个颜色。"] },
    "number-guess": { title: "猜数字", type: "益智", description: "根据提示找到隐藏数字。", how: ["输入 1 到 100 的数字。", "游戏会提示更大或更小。", "慢慢缩小范围。"] },
    "coin-dice": { title: "硬币和骰子", type: "经典", description: "快速随机做决定。", how: ["点抛硬币或掷骰子。", "用来做快速选择。", "最新结果会保存在你的存档里。"] },
    "reaction-tap": { title: "反应点击", type: "挑战", description: "等绿色出现，然后尽快点击。", how: ["按开始。", "显示等待时不要点。", "面板变绿时立刻点。"] },
    "aim-trainer": { title: "瞄准训练", type: "动作", description: "在计时结束前点击小目标。", how: ["点开始。", "点击每个出现的目标。", "点空不会扣分，但时间会继续走。"] },
    whack: { title: "快打", type: "动作", description: "在亮格跳走前点中它。", how: ["点开始。", "点击发光格子。", "时间结束前尽量打得更多。"] },
    "maze-runner": { title: "迷宫", type: "益智", description: "穿过小迷宫到出口。", how: ["用箭头、WASD 或移动按钮。", "墙会挡住移动。", "到达 E 就赢。"] },
    "color-match": { title: "颜色匹配", type: "益智", description: "选择和色块匹配的颜色名。", how: ["看大的颜色卡片。", "点击匹配的颜色名。", "尽量保持连胜。"] },
    "math-rush": { title: "数学冲刺", type: "挑战", description: "在回合结束前做快速算术。", how: ["选择每题答案。", "答对会增加分数。", "十题是一局。"] },
    "pattern-grid": { title: "图案记忆", type: "记忆", description: "记住亮起的格子。", how: ["点开始闪出图案。", "图案隐藏后点回相同格子。", "每过一轮会多一个格子。"] },
    "word-scramble": { title: "单词重排", type: "文字", description: "把打乱的小单词拼回去。", how: ["看打乱的字母。", "输入原本的单词。", "点新游戏换一个词。"] },
    "tile-stack": { title: "方块堆叠", type: "益智", description: "把相同符号整理成列。", how: ["点两个方块交换。", "把相同符号排成列。", "每次交换都会保存。"] },
    "safe-cracker": { title: "保险箱密码", type: "益智", description: "根据提示猜三位密码。", how: ["输入三位数字。", "绿点表示数字和位置都对。", "金点表示数字对但位置不对。"] },
    "odd-one-out": { title: "找不同", type: "益智", description: "找出唯一不同的符号。", how: ["扫一眼格子。", "点击只出现一次的符号。", "每次选择后会刷新。"] },
    "path-builder": { title: "路径搭建", type: "益智", description: "从起点连到出口。", how: ["点击相邻格子延长路径。", "不能跳格。", "点新游戏清空路线。"] },
    "emoji-sequence": { title: "表情序列", type: "记忆", description: "重复越来越长的表情顺序。", how: ["点开始序列。", "记住显示的表情。", "按同样顺序点回去。"] },
    "balance-scale": { title: "平衡秤", type: "益智", description: "用小砝码让两边一样重。", how: ["点击砝码移动到左右两边。", "让两边重量相等。", "当前状态会保存。"] },
    "mini-piano": { title: "小钢琴", type: "记忆", description: "弹回一段短旋律。", how: ["点开始旋律。", "看亮起的音符。", "按同样顺序弹回。"] },
    "shape-sort": { title: "形状分类", type: "益智", description: "把形状放进对应盒子。", how: ["点击一个形状拿起。", "点击对应的盒子。", "慢慢清空所有形状。"] },
  },
};

function currentLang() {
  const saved = localStorage.getItem("muye-lang") || localStorage.getItem("localtalk-lang") || "en";
  return gameText[saved] ? saved : "en";
}

function gt(key, data = {}) {
  const text = gameText[currentLang()]?.[key] || gameText.en[key] || key;
  return Object.entries(data).reduce((value, [name, replacement]) => value.replace(`{${name}}`, replacement), text);
}

function localGame(slugValue) {
  return { ...games[slugValue], ...(gameText[currentLang()]?.[slugValue] || {}), ...(gameTranslations[currentLang()]?.[slugValue] || {}) };
}

function translateGamesHome() {
  document.documentElement.lang = currentLang();
  document.documentElement.dir = currentLang() === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = gt(node.dataset.i18n); });
  document.querySelectorAll(".game-links a[data-game], .game-links a[href*='/games/play/?game=']").forEach((link) => {
    const gameSlug = link.dataset.game || new URL(link.href, location.href).searchParams.get("game");
    const data = localGame(gameSlug);
    if (!data) return;
    link.querySelector("span").textContent = data.title;
    link.querySelector("small").textContent = data.description;
  });
}

let gameId = "";
let game = null;
let playerKey = "";
let recordNotice = "";
let panel = null;
let resetButton = null;

if (document.documentElement.dataset.gamesHome !== undefined) {
  translateGamesHome();
  window.addEventListener("muye-language-change", translateGamesHome);
} else {
panel = document.querySelector("#play-panel");
resetButton = document.querySelector("#reset-game");
const params = new URLSearchParams(location.search);
const slug = params.get("game") || "2048";
gameId = games[slug] ? slug : "2048";
game = localGame(gameId);
playerKey = getDevicePlayerKey();
document.documentElement.lang = currentLang();
document.documentElement.dir = currentLang() === "ar" ? "rtl" : "ltr";
document.querySelector(".arcade-brand").textContent = gt("games");
document.querySelector(".arcade-home").textContent = gt("home");
document.querySelector("#game-title").textContent = game.title;
document.querySelector("#game-type").textContent = game.type;
document.querySelector("#game-description").textContent = game.description;
document.querySelector(".play-actions a").textContent = gt("allGames");
resetButton.textContent = gt("newGame");
resetButton.addEventListener("click", () => { clearGameSave(); game.render(true); });
bootGame();
}

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
  return `muye-game:${playerKey}:${gameId}`;
}

function loadGameSave() {
  try { return JSON.parse(localStorage.getItem(saveKey()) || "null"); } catch { return null; }
}

function saveGame(data) {
  localStorage.setItem(saveKey(), JSON.stringify({ ...data, savedAt: Date.now() }));
}

function recordStoreKey() {
  return `muye-game-records:${playerKey || getDevicePlayerKey()}`;
}

function loadGameRecords() {
  try { return JSON.parse(localStorage.getItem(recordStoreKey()) || "[]"); } catch { return []; }
}

function saveGameRecords(records) {
  localStorage.setItem(recordStoreKey(), JSON.stringify(records.slice(0, 80)));
}

function beatsRecord(value, oldValue, higher = true) {
  return oldValue == null || (higher ? value > oldValue : value < oldValue);
}

async function submitRecord(metric, value, higherIsBetter, label) {
  const records = loadGameRecords();
  const title = localGame(gameId).title;
  const existing = records.find((record) => record.gameId === gameId && record.metric === metric);
  const brokePersonal = beatsRecord(value, existing?.value, higherIsBetter);
  if (brokePersonal) {
    const next = { gameId, gameTitle: title, metric, value, higherIsBetter, label, updatedAt: Date.now() };
    saveGameRecords([next, ...records.filter((record) => !(record.gameId === gameId && record.metric === metric))]);
  }
  let brokeGlobal = false;
  try {
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      const response = await fetch("/api/talk/game-records", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ gameId, metric, value, higherIsBetter, label, displayName: window.Clerk.user?.fullName || window.Clerk.user?.username || "" }),
      });
      if (response.ok) {
        const result = await response.json();
        brokeGlobal = Boolean(result.brokeGlobal);
      }
    }
  } catch {}
  const notes = [];
  if (brokePersonal) notes.push(gt("personalRecord"));
  if (brokeGlobal) notes.push(gt("globalRecord"));
  return notes.join(" / ");
}

function clearGameSave() {
  localStorage.removeItem(saveKey());
}

function status(text, detail = "") {
  return `<div class="game-status"><span>${text}</span>${detail ? `<strong>${detail}</strong>` : ""}${recordNotice ? `<strong>${recordNotice}</strong>` : ""}<small>${playerKey.startsWith("user:") ? gt("savedAccount") : gt("savedDevice")}</small></div>`;
}

function noteRecord(metric, value, higherIsBetter, label, redraw) {
  submitRecord(metric, Math.round(value), higherIsBetter, label).then((notice) => {
    if (!notice) return;
    recordNotice = notice;
    redraw();
  }).catch(() => {});
}

function howToPlay() {
  game = localGame(gameId);
  return `<aside class="how-card"><h2>${gt("howToPlay")}</h2><ul>${game.how.map((item) => `<li>${item}</li>`).join("")}</ul></aside>`;
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
    if (won) noteRecord("max-tile", 2048, true, "2048", draw);
    setPanel(`${howToPlay()}${status(won ? gt("reached2048") : stuck ? gt("noMoves") : gt("playing"), gt("swipeArrows"))}
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
  let text = saved?.text || "playing";
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
    if (cell.open || cell.flag || text !== "playing") return;
    cell.open = true;
    if (cell.mine) { text = "boom"; cells.forEach((item) => { if (item.mine) item.open = true; }); }
    else if (cell.count === 0) neighbors(index, size).forEach(open);
    if (cells.every((item) => item.mine || item.open)) text = "cleared";
    draw();
  };
  const flag = (index) => { if (!cells[index].open && text === "playing") cells[index].flag = !cells[index].flag; draw(); };
  const draw = () => {
    saveGame({ cells, text });
    if (text === "cleared") noteRecord("win", 1, true, "Cleared", draw);
    setPanel(`${howToPlay()}${status(gt(text), gt("revealFlag"))}<div class="grid mine-grid">${cells.map((cell, index) => `<button class="cell mine-cell ${cell.open ? "open" : ""} ${cell.open && cell.mine ? "mine" : ""} ${cell.flag ? "flag" : ""}" data-i="${index}">${cell.open ? cell.mine ? "x" : cell.count || "" : cell.flag ? "!" : ""}</button>`).join("")}</div>`);
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
  let turn = saved?.turn || "red", text = saved?.text || "redTurn";
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
    if (text.endsWith("Wins") || text === "draw") return;
    for (let r = rows - 1; r >= 0; r -= 1) {
      const i = r * cols + col;
      if (!board[i]) {
        board[i] = turn;
        text = win(i) ? `${turn}Wins` : board.every(Boolean) ? "draw" : `${turn === "red" ? "yellow" : "red"}Turn`;
        turn = turn === "red" ? "yellow" : "red";
        draw();
        return;
      }
    }
  };
  const draw = () => {
    saveGame({ board, turn, text });
    if (text.endsWith("Wins")) noteRecord("wins", 1, true, gt(text), draw);
    setPanel(`${howToPlay()}${status(gt(text), gt("twoPlayers"))}<div class="grid connect-grid">${board.map((value, index) => `<button class="connect-cell" data-c="${index % cols}"><span class="disc ${value}"></span></button>`).join("")}</div>`);
    panel.querySelectorAll(".connect-cell").forEach((button) => button.addEventListener("click", () => drop(Number(button.dataset.c))));
  };
  draw();
}

function renderTicTacToe(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let board = saved?.board || Array(9).fill("");
  let turn = saved?.turn || "X", text = saved?.text || "xTurn";
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const draw = () => {
    saveGame({ board, turn, text });
    if (text.endsWith("Wins")) noteRecord("wins", 1, true, text[0], draw);
    setPanel(`${howToPlay()}${status(text.endsWith("Wins") ? gt("wins", { mark: text[0] }) : gt(text), gt("twoPlayers"))}<div class="grid tac-grid">${board.map((value, index) => `<button class="cell tac-cell" data-i="${index}">${value}</button>`).join("")}</div>`);
    panel.querySelectorAll(".tac-cell").forEach((button) => button.addEventListener("click", () => {
      const i = Number(button.dataset.i);
      if (board[i] || text.endsWith("Wins") || text === "draw") return;
      board[i] = turn;
      text = lines.some((line) => line.every((n) => board[n] === turn)) ? `${turn}Wins` : board.every(Boolean) ? "draw" : `${turn === "X" ? "o" : "x"}Turn`;
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
    if (done.size === icons.length) noteRecord("win", 1, true, "Matched", draw);
    setPanel(`${howToPlay()}${status(done.size === icons.length ? gt("matched") : gt("playing"), gt("findPairs"))}<div class="grid memory-grid">${icons.map((value, index) => `<button class="cell memory-cell" data-i="${index}">${open.has(index) || done.has(index) ? value : ""}</button>`).join("")}</div>`);
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
    if (!lights.some(Boolean)) noteRecord("win", 1, true, "Cleared", draw);
    setPanel(`${howToPlay()}${status(lights.some(Boolean) ? gt("playing") : gt("cleared"), gt("turnLightsOff"))}<div class="grid lights-grid">${lights.map((on, i) => `<button class="cell ${on ? "light-on" : ""}" data-i="${i}"></button>`).join("")}</div>`);
    panel.querySelectorAll(".cell").forEach((button) => button.addEventListener("click", () => flip(Number(button.dataset.i))));
  };
  draw();
}

function renderRps(fresh = false) {
  const items = ["Rock", "Paper", "Scissors"];
  const choiceLabels = { Rock: gt("rock"), Paper: gt("paper"), Scissors: gt("scissors") };
  const saved = fresh ? null : loadGameSave();
  setPanel(`${howToPlay()}${status(gt("chooseOne"), gt("instantRound"))}<div class="choices">${items.map((item) => `<button class="choice-button" data-choice="${item}">${choiceLabels[item]}</button>`).join("")}</div><p class="board-note" id="rps-result">${saved?.result || ""}</p>`);
  panel.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
    const you = button.dataset.choice, them = items[Math.floor(Math.random() * items.length)];
    const result = you === them ? gt("draw") : (you === "Rock" && them === "Scissors") || (you === "Paper" && them === "Rock") || (you === "Scissors" && them === "Paper") ? gt("youWin") : gt("youLose");
    const text = gt("rpsResult", { result, you: choiceLabels[you], them: choiceLabels[them] });
    panel.querySelector("#rps-result").textContent = text;
    saveGame({ result: text });
    if (result === gt("youWin")) noteRecord("wins", 1, true, text, renderRps);
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
    if (complete) noteRecord("win", 1, true, "Solved", draw);
    setPanel(`${howToPlay()}${status(complete ? gt("solved") : misses >= 6 ? gt("missed") : gt("guessing"), gt("missesLeft", { count: 6 - misses }))}<div class="hangman-word">${shown.split(" ").map((letter) => `<span class="card">${letter}</span>`).join("")}</div><div class="keyboard">${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => `<button class="key-button" data-letter="${letter}" ${guessed.has(letter) ? "disabled" : ""}>${letter}</button>`).join("")}</div>`);
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
    if (guesses.includes(answer)) noteRecord("guesses-to-solve", guesses.length, false, `${guesses.length}`, draw);
    setPanel(`${howToPlay()}${status(guesses.includes(answer) ? gt("solved") : guesses.length >= 6 ? answer : gt("guessing"), gt("fiveLetters"))}
      ${Array.from({ length: 6 }, (_, row) => `<div class="word-row">${Array.from({ length: 5 }, (_, col) => {
        const letter = guesses[row]?.[col] || "";
        const cls = !letter ? "" : answer[col] === letter ? "hit" : answer.includes(letter) ? "near" : "miss";
        return `<span class="letter-box ${cls}">${letter}</span>`;
      }).join("")}</div>`).join("")}
      <div class="word-input"><input id="word-guess" maxlength="5" autocomplete="off"><button class="arcade-button" id="word-submit">${gt("try")}</button></div>`);
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
  let you = saved?.you || [card(), card()], dealer = saved?.dealer || [card(), card()], text = saved?.text || "yourTurn";
  const finish = () => {
    while (total(dealer) < 17) dealer.push(card());
    const y = total(you), d = total(dealer);
    text = y > 21 ? "dealerWins" : d > 21 || y > d ? "youWin" : d > y ? "dealerWins" : "draw";
    draw();
  };
  const draw = () => {
    saveGame({ you, dealer, text });
    if (text === "youWin") noteRecord("wins", 1, true, "Blackjack", draw);
    setPanel(`${howToPlay()}${status(gt(text), gt("closest21"))}<small>${gt("dealer")}: ${total(dealer)}</small><div class="blackjack-hand">${dealer.map((n) => `<span class="card">${n === 11 ? "A" : n}</span>`).join("")}</div><small>${gt("you")}: ${total(you)}</small><div class="blackjack-hand">${you.map((n) => `<span class="card">${n === 11 ? "A" : n}</span>`).join("")}</div><div class="choices"><button class="choice-button" id="hit">${gt("hit")}</button><button class="choice-button" id="stand">${gt("stand")}</button></div>`);
    panel.querySelector("#hit").addEventListener("click", () => { if (text !== "yourTurn") return; you.push(card()); if (total(you) > 21) text = "dealerWins"; draw(); });
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
    setPanel(`${howToPlay()}${status(gt("filling"), gt("tapCell"))}<div class="board sudoku-board">${values.map((value, i) => `<button class="board-cell ${selected === i ? "selected" : ""}" data-i="${i}">${value === "0" ? "" : value}</button>`).join("")}</div><div class="numbers">${[1,2,3,4,5,6,7,8,9].map((n) => `<button class="number-button" data-n="${n}">${n}</button>`).join("")}</div>`);
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
    setPanel(`${howToPlay()}${status(gt("playing"), kind === "battleship" ? gt("findFleet") : gt("twoPlayers"))}<div class="board ${kind === "battleship" ? "sea-board" : ""}" style="grid-template-columns:repeat(${size},minmax(0,1fr))">${Array.from({ length: size * size }, (_, i) => `<button class="board-cell ${((Math.floor(i / size) + i) % 2) ? "dark" : "light"} ${selected === i ? "selected" : ""}" data-i="${i}">${pieceFor(kind, i, selected)}</button>`).join("")}</div><p class="board-note">${gt("simplifiedBoard", { game: localGame(kind).title })}</p>`);
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
    setPanel(`${howToPlay()}${status(gt(`${turn}Turn`), gt("compactBoard"))}<div class="board go-board">${stones.map((stone, i) => `<button class="board-cell" data-i="${i}">${stone ? `<span class="stone ${stone}"></span>` : ""}</button>`).join("")}</div>`);
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
    if (solved) noteRecord("win", 1, true, "Solved", draw);
    setPanel(`${howToPlay()}${status(solved ? gt("solved") : gt("sliding"), gt("order15"))}<div class="grid puzzle-grid">${tiles.map((value, index) => `<button class="cell puzzle-cell ${value ? "" : "blank"}" data-i="${index}">${value || ""}</button>`).join("")}</div>`);
    panel.querySelectorAll("[data-i]").forEach((button) => button.addEventListener("click", () => move(Number(button.dataset.i))));
  };
  draw();
}

function renderSimon(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  const colors = ["teal", "coral", "gold", "blue"];
  let pattern = saved?.pattern || [];
  let input = saved?.input || [];
  let text = saved?.text || "ready";
  const addStep = () => {
    pattern = [...pattern, colors[Math.floor(Math.random() * colors.length)]];
    input = [];
    text = gt("round", { count: pattern.length });
    draw();
  };
  const press = (color) => {
    if (!pattern.length) return;
    input.push(color);
    const ok = pattern[input.length - 1] === color;
    text = ok ? input.length === pattern.length ? "correct" : "keepGoing" : "missed";
    if (!ok) pattern = [];
    if (ok && input.length === pattern.length) setTimeout(addStep, 500);
    draw();
  };
  const draw = () => {
    saveGame({ pattern, input, text });
    if (pattern.length > 1) noteRecord("pattern", pattern.length, true, gt("pattern", { count: pattern.length }), draw);
    setPanel(`${howToPlay()}${status(gt(text), pattern.length ? gt("pattern", { count: pattern.length }) : gt("startPattern"))}<div class="simon-grid">${colors.map((color) => `<button class="simon-button ${color}" data-color="${color}">${color}</button>`).join("")}</div><div class="choices"><button class="choice-button" id="simon-start">${gt("startPattern")}</button></div>`);
    panel.querySelector("#simon-start").addEventListener("click", addStep);
    panel.querySelectorAll("[data-color]").forEach((button) => button.addEventListener("click", () => press(button.dataset.color)));
  };
  draw();
}

function renderNumberGuess(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let answer = saved?.answer || Math.floor(Math.random() * 100) + 1;
  let guesses = saved?.guesses || [];
  let text = saved?.text || "guessing";
  const submit = () => {
    const value = Number(panel.querySelector("#number-guess-input").value);
    if (!Number.isInteger(value) || value < 1 || value > 100) return;
    guesses = [...guesses, value];
    text = value === answer ? "foundIt" : value < answer ? "higher" : "lower";
    draw();
  };
  const draw = () => {
    saveGame({ answer, guesses, text });
    if (text === "foundIt") noteRecord("guesses-to-find", guesses.length, false, gt("guesses", { count: guesses.length }), draw);
    setPanel(`${howToPlay()}${status(gt(text), gt("guesses", { count: guesses.length }))}<div class="word-input"><input id="number-guess-input" type="number" min="1" max="100" inputmode="numeric" placeholder="1-100"><button class="arcade-button" id="number-guess-submit">${gt("try")}</button></div><p class="board-note">${guesses.length ? gt("guessesList", { list: guesses.join(", ") }) : gt("noGuesses")}</p>`);
    panel.querySelector("#number-guess-submit").addEventListener("click", submit);
    panel.querySelector("#number-guess-input").addEventListener("keydown", (event) => { if (event.key === "Enter") submit(); });
  };
  draw();
}

function renderCoinDice(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let result = saved?.result || "ready";
  const draw = () => {
    saveGame({ result });
    setPanel(`${howToPlay()}${status(gt("chance"), gt("quickPicker"))}<div class="chance-result">${gt(result)}</div><div class="choices"><button class="choice-button" id="coin">${gt("flipCoin")}</button><button class="choice-button" id="dice">${gt("rollDice")}</button></div>`);
    panel.querySelector("#coin").addEventListener("click", () => { result = Math.random() < 0.5 ? "heads" : "tails"; draw(); });
    panel.querySelector("#dice").addEventListener("click", () => { result = String(Math.floor(Math.random() * 6) + 1); draw(); });
  };
  draw();
}

function renderReactionTap(fresh = false) {
  let timer = 0;
  let startedAt = 0;
  let waiting = false;
  const saved = fresh ? null : loadGameSave();
  let best = saved?.best || 0;
  let text = saved?.text || "ready";
  const draw = (state = "idle") => {
    saveGame({ best, text });
    setPanel(`${howToPlay()}${status(gt(text), best ? gt("bestMs", { best }) : gt("noBest"))}
      <button class="reaction-pad ${state}" id="reaction-pad" type="button">${state === "go" ? gt("tap") : state === "wait" ? gt("wait") : gt("start")}</button>`);
    panel.querySelector("#reaction-pad").addEventListener("click", () => {
      if (state === "idle") {
        text = "waitGreen";
        waiting = true;
        draw("wait");
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (!waiting) return;
          startedAt = performance.now();
          text = "tapNow";
          draw("go");
        }, 900 + Math.random() * 2400);
        return;
      }
      if (state === "wait") {
        waiting = false;
        clearTimeout(timer);
        text = "tooEarly";
        draw("idle");
        return;
      }
      const ms = Math.round(performance.now() - startedAt);
      best = best ? Math.min(best, ms) : ms;
      waiting = false;
      text = `${ms}ms`;
      noteRecord("reaction-ms", ms, false, `${ms}ms`, () => draw("idle"));
      draw("idle");
    });
  };
  draw();
}

function renderAimTrainer(fresh = false) {
  let timer = 0;
  const saved = fresh ? null : loadGameSave();
  let score = fresh ? 0 : saved?.score || 0;
  let best = saved?.best || 0;
  let running = false;
  let endsAt = 0;
  let target = { x: 50, y: 50 };
  const moveTarget = () => { target = { x: 8 + Math.random() * 84, y: 10 + Math.random() * 78 }; };
  const finish = () => {
    running = false;
    best = Math.max(best, score);
    saveGame({ score, best });
    noteRecord("score", score, true, String(score), draw);
    draw();
  };
  const tick = () => {
    if (!running) return;
    if (Date.now() >= endsAt) { finish(); return; }
    panel.querySelector("#aim-time").textContent = `${Math.ceil((endsAt - Date.now()) / 1000)}s`;
    timer = setTimeout(tick, 160);
  };
  const draw = () => {
    clearTimeout(timer);
    saveGame({ score, best });
    setPanel(`${howToPlay()}${status(running ? gt("running") : gt("ready"), gt("scoreBest", { score, best }))}
      <div class="target-arena"><button class="target-dot" id="target-dot" type="button" style="left:${target.x}%;top:${target.y}%"></button><span id="aim-time">${running ? `${Math.ceil((endsAt - Date.now()) / 1000)}s` : "15s"}</span></div>
      <div class="choices"><button class="choice-button" id="aim-start" type="button">${running ? gt("running") : gt("start")}</button></div>`);
    panel.querySelector("#aim-start").addEventListener("click", () => {
      score = 0;
      running = true;
      endsAt = Date.now() + 15000;
      moveTarget();
      draw();
      tick();
    });
    panel.querySelector("#target-dot").addEventListener("click", () => {
      if (!running) return;
      score += 1;
      moveTarget();
      draw();
      tick();
    });
    if (running) tick();
  };
  draw();
}

function renderWhack(fresh = false) {
  let timer = 0;
  const saved = fresh ? null : loadGameSave();
  let score = fresh ? 0 : saved?.score || 0;
  let best = saved?.best || 0;
  let active = saved?.active ?? 12;
  let running = false;
  let endsAt = 0;
  const jump = () => { active = Math.floor(Math.random() * 16); };
  const finish = () => {
    running = false;
    best = Math.max(best, score);
    saveGame({ score, best, active });
    noteRecord("score", score, true, String(score), draw);
    draw();
  };
  const tick = () => {
    if (!running) return;
    if (Date.now() >= endsAt) { finish(); return; }
    jump();
    draw();
    timer = setTimeout(tick, 700);
  };
  const draw = () => {
    clearTimeout(timer);
    saveGame({ score, best, active });
    setPanel(`${howToPlay()}${status(running ? gt("whacking") : gt("ready"), gt("scoreBest", { score, best }))}
      <div class="grid whack-grid">${Array.from({ length: 16 }, (_, i) => `<button class="cell whack-cell ${running && i === active ? "active" : ""}" data-i="${i}" type="button">${running && i === active ? "!" : ""}</button>`).join("")}</div>
      <div class="choices"><button class="choice-button" id="whack-start" type="button">${gt("start")}</button></div>`);
    panel.querySelector("#whack-start").addEventListener("click", () => {
      score = 0;
      running = true;
      endsAt = Date.now() + 15000;
      jump();
      draw();
      timer = setTimeout(tick, 700);
    });
    panel.querySelectorAll(".whack-cell").forEach((button) => button.addEventListener("click", () => {
      if (!running || Number(button.dataset.i) !== active) return;
      score += 1;
      jump();
      draw();
      timer = setTimeout(tick, 700);
    }));
    if (running) timer = setTimeout(tick, 700);
  };
  draw();
}

function renderMazeRunner(fresh = false) {
  const rows = [
    "#########",
    "#S  #   #",
    "# # # # #",
    "# #   # #",
    "# ### # #",
    "#     #E#",
    "#########",
  ];
  const saved = fresh ? null : loadGameSave();
  let player = saved?.player || { r: 1, c: 1 };
  let moves = saved?.moves || 0;
  let text = saved?.text || "findExit";
  const move = (dr, dc) => {
    const next = { r: player.r + dr, c: player.c + dc };
    const cell = rows[next.r]?.[next.c];
    if (!cell || cell === "#") return;
    player = next;
    moves += 1;
    if (cell === "E") {
      text = "escaped";
      noteRecord("moves-to-escape", moves, false, gt("moves", { count: moves }), draw);
    }
    draw();
  };
  const draw = () => {
    saveGame({ player, moves, text });
    setPanel(`${howToPlay()}${status(gt(text), gt("moves", { count: moves }))}
      <div class="maze-board" style="grid-template-columns:repeat(${rows[0].length},minmax(0,1fr))">${rows.flatMap((row, r) => row.split("").map((cell, c) => `<span class="maze-cell ${cell === "#" ? "wall" : ""} ${cell === "E" ? "exit" : ""}">${player.r === r && player.c === c ? "P" : cell === "S" ? "" : cell}</span>`)).join("")}</div>
      <div class="pad"><button class="cell" data-move="-1,0">↑</button><button class="cell" data-move="0,-1">←</button><button class="cell" data-move="1,0">↓</button><button class="cell" data-move="0,1">→</button></div>`);
    panel.querySelectorAll("[data-move]").forEach((button) => button.addEventListener("click", () => {
      const [dr, dc] = button.dataset.move.split(",").map(Number);
      move(dr, dc);
    }));
  };
  window.onkeydown = (event) => {
    const keys = { ArrowUp: [-1, 0], w: [-1, 0], ArrowDown: [1, 0], s: [1, 0], ArrowLeft: [0, -1], a: [0, -1], ArrowRight: [0, 1], d: [0, 1] };
    if (!keys[event.key]) return;
    event.preventDefault();
    move(...keys[event.key]);
  };
  draw();
}

function renderColorMatch(fresh = false) {
  const colors = [
    ["Teal", "#009c9a"],
    ["Coral", "#ff6b62"],
    ["Gold", "#e4b34c"],
    ["Green", "#60c47c"],
    ["Blue", "#6c9cff"],
  ];
  const saved = fresh ? null : loadGameSave();
  let streak = saved?.streak || 0;
  let best = saved?.best || 0;
  let answer = saved?.answer || colors[Math.floor(Math.random() * colors.length)][0];
  let text = saved?.text || "choose";
  const next = () => { answer = colors[Math.floor(Math.random() * colors.length)][0]; };
  const choose = (value) => {
    if (value === answer) {
      streak += 1;
      best = Math.max(best, streak);
      text = "correct";
    } else {
      streak = 0;
      text = gt("itWas", { answer });
    }
    next();
    draw();
  };
  const draw = () => {
    saveGame({ streak, best, answer, text });
    if (streak > 0) noteRecord("streak", streak, true, gt("streakBest", { streak, best }), draw);
    const swatch = colors.find(([name]) => name === answer)?.[1] || "#fff";
    setPanel(`${howToPlay()}${status(gt(text), gt("streakBest", { streak, best }))}
      <div class="color-card" style="background:${swatch}"></div>
      <div class="choices">${colors.map(([name]) => `<button class="choice-button" data-color="${name}" type="button">${name}</button>`).join("")}</div>`);
    panel.querySelectorAll("[data-color]").forEach((button) => button.addEventListener("click", () => choose(button.dataset.color)));
  };
  draw();
}

function renderMathRush(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let score = fresh ? 0 : saved?.score || 0;
  let round = fresh ? 1 : saved?.round || 1;
  let problem = saved?.problem || makeMathProblem();
  let text = saved?.text || "choose";
  const answer = (value) => {
    if (round > 10) return;
    if (Number(value) === problem.answer) {
      score += 1;
      text = "correct";
    } else {
      text = gt("answerIs", { answer: problem.answer });
    }
    round += 1;
    problem = makeMathProblem();
    draw();
  };
  const draw = () => {
    saveGame({ score, round, problem, text });
    if (round > 10) noteRecord("score", score, true, gt("score10", { score }), draw);
    setPanel(`${howToPlay()}${status(round > 10 ? gt("finished") : gt(text), gt("score10", { score }))}
      <div class="math-problem">${round > 10 ? gt("gameOver") : problem.text}</div>
      <div class="choices">${problem.choices.map((choice) => `<button class="choice-button" data-answer="${choice}" type="button" ${round > 10 ? "disabled" : ""}>${choice}</button>`).join("")}</div>`);
    panel.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => answer(button.dataset.answer)));
  };
  draw();
}

function makeMathProblem() {
  const a = Math.floor(Math.random() * 12) + 1;
  const b = Math.floor(Math.random() * 12) + 1;
  const op = Math.random() < 0.5 ? "+" : "x";
  const answer = op === "+" ? a + b : a * b;
  const choices = new Set([answer]);
  while (choices.size < 4) choices.add(Math.max(1, answer + Math.floor(Math.random() * 15) - 7));
  return { text: `${a} ${op} ${b}`, answer, choices: [...choices].sort(() => Math.random() - 0.5) };
}

function renderPatternGrid(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let round = saved?.round || 3;
  let pattern = saved?.pattern || makePattern(round);
  let picked = saved?.picked || [];
  let showing = false;
  let text = saved?.text || "ready";
  const start = () => {
    pattern = makePattern(round);
    picked = [];
    showing = true;
    text = "pattern";
    draw();
    setTimeout(() => { showing = false; text = "choose"; draw(); }, 900);
  };
  const choose = (index) => {
    if (showing || picked.includes(index)) return;
    picked.push(index);
    const ok = pattern[picked.length - 1] === index;
    if (!ok) { text = "missed"; round = 3; picked = []; }
    else if (picked.length === pattern.length) { text = "correct"; round = Math.min(9, round + 1); noteRecord("round", round, true, gt("round", { count: round }), draw); }
    draw();
  };
  const draw = () => {
    saveGame({ round, pattern, picked, text });
    setPanel(`${howToPlay()}${status(gt(text), gt("round", { count: round }))}
      <div class="grid pattern-grid">${Array.from({ length: 16 }, (_, i) => `<button class="cell pattern-cell ${showing && pattern.includes(i) ? "active" : ""} ${picked.includes(i) ? "picked" : ""}" data-i="${i}" type="button"></button>`).join("")}</div>
      <div class="choices"><button class="choice-button" id="pattern-start" type="button">${gt("start")}</button></div>`);
    panel.querySelector("#pattern-start").addEventListener("click", start);
    panel.querySelectorAll("[data-i]").forEach((button) => button.addEventListener("click", () => choose(Number(button.dataset.i))));
  };
  draw();
}

function makePattern(length) {
  const pool = Array.from({ length: 16 }, (_, i) => i).sort(() => Math.random() - 0.5);
  return pool.slice(0, length);
}

function renderWordScramble(fresh = false) {
  const words = ["CLOUD", "PIXEL", "LOCAL", "QUIET", "PLANT", "LIGHT", "BRAVE", "STACK"];
  const saved = fresh ? null : loadGameSave();
  let word = saved?.word || words[Math.floor(Math.random() * words.length)];
  let text = saved?.text || "guessing";
  const shuffled = word.split("").sort(() => Math.random() - 0.5).join("");
  const submit = () => {
    const value = panel.querySelector("#scramble-input").value.toUpperCase().replace(/[^A-Z]/g, "");
    text = value === word ? "solved" : "missed";
    if (text === "solved") noteRecord("word", 1, true, word, draw);
    draw();
  };
  const draw = () => {
    saveGame({ word, text });
    setPanel(`${howToPlay()}${status(gt(text), gt("fiveLetters"))}<div class="scramble-word">${shuffled.split("").map((letter) => `<span class="letter-box">${letter}</span>`).join("")}</div><div class="word-input"><input id="scramble-input" maxlength="8" autocomplete="off"><button class="arcade-button" id="scramble-submit">${gt("try")}</button></div><p class="board-note">${text === "solved" ? word : ""}</p>`);
    panel.querySelector("#scramble-submit").addEventListener("click", submit);
    panel.querySelector("#scramble-input").addEventListener("keydown", (event) => { if (event.key === "Enter") submit(); });
  };
  draw();
}

function renderTileStack(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let tiles = saved?.tiles || "AAAABBBBCCCCDDDD".split("").sort(() => Math.random() - 0.5);
  let selected = saved?.selected ?? -1;
  const solved = () => [0, 4, 8, 12].every((start) => tiles.slice(start, start + 4).every((value) => value === tiles[start]));
  const pick = (index) => {
    if (selected < 0) selected = index;
    else {
      [tiles[selected], tiles[index]] = [tiles[index], tiles[selected]];
      selected = -1;
    }
    draw();
  };
  const draw = () => {
    saveGame({ tiles, selected });
    if (solved()) noteRecord("sorted", 1, true, "Sorted", draw);
    setPanel(`${howToPlay()}${status(solved() ? gt("solved") : gt("playing"), gt("compactBoard"))}<div class="grid tile-stack-grid">${tiles.map((value, index) => `<button class="cell stack-tile ${selected === index ? "selected" : ""}" data-i="${index}">${value}</button>`).join("")}</div>`);
    panel.querySelectorAll("[data-i]").forEach((button) => button.addEventListener("click", () => pick(Number(button.dataset.i))));
  };
  draw();
}

function renderSafeCracker(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let code = saved?.code || String(Math.floor(Math.random() * 900) + 100);
  let guesses = saved?.guesses || [];
  const submit = () => {
    const value = panel.querySelector("#safe-input").value.replace(/\D/g, "").slice(0, 3);
    if (value.length !== 3) return;
    guesses = [{ value, hints: safeHints(code, value) }, ...guesses].slice(0, 6);
    if (value === code) noteRecord("guesses", guesses.length, false, gt("guesses", { count: guesses.length }), draw);
    draw();
  };
  const draw = () => {
    saveGame({ code, guesses });
    const solved = guesses[0]?.value === code;
    setPanel(`${howToPlay()}${status(solved ? gt("solved") : gt("guessing"), gt("guesses", { count: guesses.length }))}
      <div class="word-input"><input id="safe-input" maxlength="3" inputmode="numeric" autocomplete="off" placeholder="000"><button class="arcade-button" id="safe-submit">${gt("try")}</button></div>
      <div class="guess-list">${guesses.map((guess) => `<div><strong>${guess.value}</strong><span>${guess.hints}</span></div>`).join("")}</div>`);
    panel.querySelector("#safe-submit").addEventListener("click", submit);
    panel.querySelector("#safe-input").addEventListener("keydown", (event) => { if (event.key === "Enter") submit(); });
  };
  draw();
}

function safeHints(code, value) {
  const exact = value.split("").filter((digit, i) => digit === code[i]).length;
  const loose = value.split("").filter((digit, i) => digit !== code[i] && code.includes(digit)).length;
  return `${"●".repeat(exact)}${"○".repeat(loose) || " -"}`;
}

function renderOddOne(fresh = false) {
  const symbols = ["◆", "●", "■", "▲", "★", "✦"];
  const saved = fresh ? null : loadGameSave();
  let base = saved?.base || symbols[Math.floor(Math.random() * symbols.length)];
  let odd = saved?.odd || symbols.find((symbol) => symbol !== base);
  let oddIndex = saved?.oddIndex ?? Math.floor(Math.random() * 25);
  let streak = saved?.streak || 0;
  const next = () => {
    base = symbols[Math.floor(Math.random() * symbols.length)];
    odd = symbols.filter((symbol) => symbol !== base).sort(() => Math.random() - 0.5)[0];
    oddIndex = Math.floor(Math.random() * 25);
  };
  const choose = (index) => {
    streak = index === oddIndex ? streak + 1 : 0;
    if (streak) noteRecord("streak", streak, true, gt("streakBest", { streak, best: streak }), draw);
    next();
    draw();
  };
  const draw = () => {
    saveGame({ base, odd, oddIndex, streak });
    setPanel(`${howToPlay()}${status(gt("choose"), gt("streakBest", { streak, best: streak }))}<div class="grid odd-grid">${Array.from({ length: 25 }, (_, i) => `<button class="cell odd-cell" data-i="${i}">${i === oddIndex ? odd : base}</button>`).join("")}</div>`);
    panel.querySelectorAll("[data-i]").forEach((button) => button.addEventListener("click", () => choose(Number(button.dataset.i))));
  };
  draw();
}

function renderPathBuilder(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let path = saved?.path || [0];
  const end = 24;
  const choose = (index) => {
    const last = path[path.length - 1];
    const near = Math.abs(index - last) === 5 || (Math.floor(index / 5) === Math.floor(last / 5) && Math.abs(index - last) === 1);
    if (!near || path.includes(index)) return;
    path.push(index);
    if (index === end) noteRecord("steps", path.length, false, gt("moves", { count: path.length }), draw);
    draw();
  };
  const draw = () => {
    saveGame({ path });
    setPanel(`${howToPlay()}${status(path.includes(end) ? gt("escaped") : gt("playing"), gt("moves", { count: path.length }))}
      <div class="grid path-grid">${Array.from({ length: 25 }, (_, i) => `<button class="cell path-cell ${path.includes(i) ? "active" : ""} ${i === 0 ? "start" : ""} ${i === end ? "exit" : ""}" data-i="${i}">${i === 0 ? "S" : i === end ? "E" : ""}</button>`).join("")}</div>`);
    panel.querySelectorAll("[data-i]").forEach((button) => button.addEventListener("click", () => choose(Number(button.dataset.i))));
  };
  draw();
}

function renderEmojiSequence(fresh = false) {
  const emojis = ["☀", "☁", "★", "♥", "♦"];
  const saved = fresh ? null : loadGameSave();
  let sequence = saved?.sequence || [];
  let input = saved?.input || [];
  let showing = false;
  let text = saved?.text || "ready";
  const start = () => {
    sequence = [...sequence, emojis[Math.floor(Math.random() * emojis.length)]];
    input = [];
    showing = true;
    text = "pattern";
    draw();
    setTimeout(() => { showing = false; text = "choose"; draw(); }, 900);
  };
  const press = (emoji) => {
    if (showing || !sequence.length) return;
    input.push(emoji);
    const ok = sequence[input.length - 1] === emoji;
    if (!ok) { text = "missed"; sequence = []; input = []; }
    else if (input.length === sequence.length) { text = "correct"; noteRecord("sequence", sequence.length, true, gt("pattern", { count: sequence.length }), draw); }
    draw();
  };
  const draw = () => {
    saveGame({ sequence, input, text });
    setPanel(`${howToPlay()}${status(gt(text), gt("pattern", { count: sequence.length }))}
      <div class="emoji-display">${showing ? sequence.join(" ") : input.join(" ") || "..."}</div>
      <div class="choices">${emojis.map((emoji) => `<button class="choice-button emoji-button" data-emoji="${emoji}">${emoji}</button>`).join("")}</div>
      <div class="choices"><button class="choice-button" id="emoji-start">${gt("startPattern")}</button></div>`);
    panel.querySelector("#emoji-start").addEventListener("click", start);
    panel.querySelectorAll("[data-emoji]").forEach((button) => button.addEventListener("click", () => press(button.dataset.emoji)));
  };
  draw();
}

function renderBalanceScale(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let weights = saved?.weights || [{ n: 1, side: "" }, { n: 2, side: "" }, { n: 3, side: "" }, { n: 4, side: "" }, { n: 5, side: "" }];
  const totals = () => weights.reduce((sum, item) => ({ ...sum, [item.side || "off"]: (sum[item.side || "off"] || 0) + item.n }), {});
  const move = (index) => {
    weights[index].side = weights[index].side === "" ? "left" : weights[index].side === "left" ? "right" : "";
    draw();
  };
  const draw = () => {
    const total = totals();
    const balanced = total.left && total.left === total.right;
    saveGame({ weights });
    if (balanced) noteRecord("balanced", total.left, true, String(total.left), draw);
    setPanel(`${howToPlay()}${status(balanced ? gt("solved") : gt("playing"), `${total.left || 0} = ${total.right || 0}`)}
      <div class="scale"><div><strong>${total.left || 0}</strong><span>Left</span></div><div><strong>${total.right || 0}</strong><span>Right</span></div></div>
      <div class="choices">${weights.map((item, index) => `<button class="choice-button" data-i="${index}">${item.n} ${item.side || "-"}</button>`).join("")}</div>`);
    panel.querySelectorAll("[data-i]").forEach((button) => button.addEventListener("click", () => move(Number(button.dataset.i))));
  };
  draw();
}

function renderMiniPiano(fresh = false) {
  const notes = ["C", "D", "E", "G", "A"];
  const saved = fresh ? null : loadGameSave();
  let melody = saved?.melody || [];
  let input = saved?.input || [];
  let text = saved?.text || "ready";
  const start = () => {
    melody = [...melody, notes[Math.floor(Math.random() * notes.length)]];
    input = [];
    text = "pattern";
    draw();
  };
  const press = (note) => {
    if (!melody.length) return;
    input.push(note);
    const ok = melody[input.length - 1] === note;
    if (!ok) { text = "missed"; melody = []; input = []; }
    else if (input.length === melody.length) { text = "correct"; noteRecord("melody", melody.length, true, gt("pattern", { count: melody.length }), draw); }
    else text = "keepGoing";
    draw();
  };
  const draw = () => {
    saveGame({ melody, input, text });
    setPanel(`${howToPlay()}${status(gt(text), gt("pattern", { count: melody.length }))}
      <div class="piano-display">${melody.join(" ") || "..."}</div>
      <div class="piano-keys">${notes.map((note) => `<button class="piano-key" data-note="${note}">${note}</button>`).join("")}</div>
      <div class="choices"><button class="choice-button" id="piano-start">${gt("startPattern")}</button></div>`);
    panel.querySelector("#piano-start").addEventListener("click", start);
    panel.querySelectorAll("[data-note]").forEach((button) => button.addEventListener("click", () => press(button.dataset.note)));
  };
  draw();
}

function renderShapeSort(fresh = false) {
  const saved = fresh ? null : loadGameSave();
  let shapes = saved?.shapes || ["○", "□", "△", "○", "□", "△"].sort(() => Math.random() - 0.5).map((shape, id) => ({ id, shape, done: false }));
  let selected = saved?.selected ?? -1;
  const chooseShape = (id) => { selected = selected === id ? -1 : id; draw(); };
  const chooseBin = (shape) => {
    const item = shapes.find((entry) => entry.id === selected);
    if (!item) return;
    if (item.shape === shape) item.done = true;
    selected = -1;
    draw();
  };
  const draw = () => {
    const cleared = shapes.every((shape) => shape.done);
    saveGame({ shapes, selected });
    if (cleared) noteRecord("sorted", 1, true, "Sorted", draw);
    setPanel(`${howToPlay()}${status(cleared ? gt("cleared") : gt("playing"), gt("choose"))}
      <div class="shape-row">${shapes.filter((item) => !item.done).map((item) => `<button class="shape-piece ${selected === item.id ? "selected" : ""}" data-id="${item.id}">${item.shape}</button>`).join("") || `<span>${gt("cleared")}</span>`}</div>
      <div class="shape-bins">${["○", "□", "△"].map((shape) => `<button class="shape-bin" data-shape="${shape}">${shape}</button>`).join("")}</div>`);
    panel.querySelectorAll("[data-id]").forEach((button) => button.addEventListener("click", () => chooseShape(Number(button.dataset.id))));
    panel.querySelectorAll("[data-shape]").forEach((button) => button.addEventListener("click", () => chooseBin(button.dataset.shape)));
  };
  draw();
}
