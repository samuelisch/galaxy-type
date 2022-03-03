const alphabet = 'abcdefghijklmnopqrstuvwxyz';
let solvedChars = [];
let displayedChars = [];
let score = 0, streak = 0;
let gameTime, speed = 1; // variable for spawn timing
let gameOver = false;
let gameStarted = false;
let health = 10;
let matchCounter = 0;
let totalCounter = 0;
let scoreStorage = [];

const canvas = document.querySelector('.display');
const context = canvas.getContext('2d');

// check if localStorage exists, fill up store if it exists
const getFromLocalStorage = () => {
  if (localStorage.getItem('store')) {
    scoreStorage = JSON.parse(localStorage.getItem('store'));
  }
}

const setToLocalStorage = () => {
  localStorage.setItem('store', JSON.stringify(scoreStorage));
}

const generateRandomId = () => {
  return Math.floor(Math.random() * 100000000);
}

const getRandomChar = () => {
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

const getRandomWidth = () => {
  const maxWidth = document.querySelector('.game-container').clientWidth - 20; //prevent overflowX
  return Math.floor(Math.random() * maxWidth) + 10;
}

const CharFactory = function() {
  let id = generateRandomId();
  let text = getRandomChar();
  let x = getRandomWidth();
  let y = -5;
  const metrics = context.measureText(text);

  const drawChar = (addHeight) => {
    context.beginPath();
    context.fillStyle = "white";
    context.font = '25px Helvetica';
    context.textAlign = 'center';
    context.fillText(text, x, y + addHeight);
  }

  return {
    id,
    text,
    x, 
    y,
    metrics,
    drawChar
  }
}

const drawCanvas = () => {
  const container = document.querySelector('.canvas-container');
  const canvas = document.querySelector('.display')
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}

// function to check score to level and increase speed
const checkIncreaseSpeed = () => {
  if (speed === 6 || score <= 200) {
    return;
  }

  if (score <= 500) {
    if (speed === 2) return;
    speed = 2;
    clearInterval(gameTime);
    spawnChars(900);
  } else if (score <= 2000) {
    if (speed === 3) return;
    speed = 3;
    clearInterval(gameTime);
    spawnChars(750);
  } else if (score <= 5000) {
    if (speed === 4) return;
    speed = 4;
    clearInterval(gameTime);
    spawnChars(550);
  } else if (score <= 10000) {
    if (speed === 5) return;
    speed = 5;
    clearInterval(gameTime);
    spawnChars(450);
  } else {
    speed = 6;
    clearInterval(gameTime);
    spawnChars(300);
  }

  // update level in DOM
  const level = document.querySelector('.level');
  if (parseInt(level.textContent) !== speed) {
    level.textContent = speed;
  }
}

const addScore = () => {
  const bonus = Math.floor(streak / 10) + 1;
  score = score + (10 * speed) + (10 * bonus);
  streak += 1;
  document.querySelector('.score-tracker').textContent = score;
}

const checkKey = (e) => {
  if (!gameStarted) {
    return;
  }
  const keyCode = e.keyCode;
  const char = String.fromCharCode(keyCode + 32);
  totalCounter++;

  const instance = displayedChars.find(charInstance => charInstance.text === char)
  if (instance) {
    matchCounter++;
    solvedChars.push(instance.id);

    addScore()
    checkIncreaseSpeed();
  } else {
    streak = 0;
  }
}

const backToMainMenu = () => {
  resetGame();
  document.querySelectorAll('.menu').forEach(menu => menu.style.display = 'none');
  document.querySelector('.main').style.display = 'flex';
}

const hideMainMenu = () => {
  document.querySelector('.menu-container').style.opacity = '0%';
  document.querySelector('.menu').style.display = 'none';
}

const viewLeaderboard = () => {
  // clear current list for leaderboard
  document.querySelectorAll('.leaderboard-score').forEach(score => score.remove());
  // create and append new list elements to leaderboard
  scoreStorage.forEach(score => {
    const listElement = document.createElement('li');
    listElement.className = 'leaderboard-score';
    const listScore = document.createElement('span');
    listScore.className = 'left';
    listScore.textContent = score.score;
    const listAccuracy = document.createElement('span');
    listAccuracy.className = 'right';
    listAccuracy.textContent = score.accuracy + '%';

    listElement.append(listScore, listAccuracy);
    document.querySelector('.score-list').appendChild(listElement);
  })

  // hide main menu, view leaderboard
  document.querySelector('.leaderboard').style.display = 'flex';
  document.querySelector('.main').style.display = 'none';
}

const resetGame = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  score = 0;
  streak = 0;
  speed = 1;
  gameOver = false;
  gameStarted = false;
  health = 10;
  matchStore = {};
  matchCounter = 0;
  totalCounter = 0;
  document.querySelector('.level').textContent = 1;
  document.querySelector('.health').textContent = 10;
  document.querySelector('.score-tracker').textContent = 0;
  document.querySelector('.score').textContent = 0;
  document.querySelector('.accuracy').textContent = 0;
}

const arrangeScores = () => {
  scoreStorage.sort((a, b) => b.score - a.score);
}

const saveScore = (playerScore, playerAccuracy) => {
  if (playerScore <= 0 ) return;
  const storeObj = { score: playerScore, accuracy: playerAccuracy }
  scoreStorage.push(storeObj);
  arrangeScores();
  setToLocalStorage();
}

const displayGameover = () => {
  if (score !== 0) {
    i = 0
    const scoreInterval = setInterval(() => {
      if (i >= score) clearInterval(scoreInterval);
      document.querySelector('.score').textContent = i;
      i += 10;
    }, 1)
  }
  // calculate accuracy
  const accuracy = totalCounter ? parseInt((matchCounter / totalCounter) * 100) : 0;
  document.querySelector('.accuracy').textContent = accuracy || 0;
  document.querySelector('.menu-container').style.opacity = '100%';
  document.querySelector('.gameover').style.display = 'flex';
  saveScore(score, accuracy);
}

const setGameOver = () => {
  gameOver = true;
  gameStarted = false;
  // reset all
  solvedChars = [];
  displayedChars = [];
  // display gameover 
  displayGameover();
}

const damageHealth = () => {
  health -= 1;
  document.querySelector('.health').textContent = health;
  // activate damange DOM
  const dmgContainer = document.querySelector('.damage-container')
  dmgContainer.classList.add('damaged');
  setTimeout(() => {
    dmgContainer.classList.remove('damaged');
  }, 50);
}

const removeFromDisplayArray = (charId) => {
  displayedChars = displayedChars.filter(charInstance => charInstance.id !== charId);
}

const newChar = () => {
  const char = CharFactory();
  displayedChars.push(char);
  const actualHeight = char.metrics.actualBoundingBoxAscent + char.metrics.actualBoundingBoxDescent;
  let accumulateY = 0;

  const loop = () => {
    if (gameOver) {
      return;
    }
    // clear previous position
    const addedHeight = char.y + actualHeight + accumulateY;
    context.clearRect(char.x - 10, 0, char.x + char.metrics.width, addedHeight);

    if (solvedChars.includes(char.id)) {
      // char solved
      // remove from solvedChar to avoid clogging it up
      solvedChars = solvedChars.filter(id => id !== char.id);
      // remove from displayChars
      removeFromDisplayArray(char.id)
      return;
    }
    if (addedHeight > canvas.height) {
      // remove word instance from display array
      removeFromDisplayArray(char.id);
      damageHealth();
      // game over if not enough health
      if (health <= 0) {
        clearInterval(gameTime);
        setGameOver();
      }
      return;
    }
    // continue with loop, create new position
    char.drawChar(accumulateY);
    accumulateY += 1.9;

    requestAnimationFrame(loop); 
  }

  loop();
}

const spawnChars = (time=1000) => {
  gameTime = setInterval(() => {
    newChar();
  }, time);
}

const gameStart = () => {
  resetGame();
  gameStarted = true;
  hideMainMenu();
  spawnChars();
}

getFromLocalStorage();
drawCanvas();
document.querySelector('.game-start-btn').addEventListener('click', gameStart);
document.querySelector('.game-restart-btn').addEventListener('click', gameStart);
document.querySelectorAll('.main-menu-btn').forEach(btn => btn.addEventListener('click', backToMainMenu));
document.querySelector('.leaderboard-btn').addEventListener('click', viewLeaderboard)
window.addEventListener('resize', drawCanvas);
window.addEventListener('keydown', checkKey);