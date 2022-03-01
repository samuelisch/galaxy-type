let alphabet = 'abcdefghijklmnopqrstuvwxyz';
let solvedChars = [];
let displayedChars = [];
let score = 0, streak = 0;
let gameTime, speed = 1; // variable for spawn timing
let gameOver = false;

const canvas = document.querySelector('.display');
const context = canvas.getContext('2d');

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
  let y = 20;
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

const addScore = () => {
  const bonus = Math.floor(streak / 10) + 1;
  score = score + (10 * speed) + (10 * bonus);
  streak += 1;
  document.querySelector('.score').textContent = score;
}

// function to check score to level and increase speed
const checkIncreaseSpeed = () => {
  if (speed === 6 || score <= 200) {
    return;
  }

  if (score <= 500) {
    if (speed === 2) return;
    console.log('changing speed to 2')
    speed = 2;
    clearInterval(gameTime);
    spawnChars(900);
  } else if (score <= 2000) {
    if (speed === 3) return;
    console.log('changing speed to 3')
    speed = 3;
    clearInterval(gameTime);
    spawnChars(750);
  } else if (score <= 5000) {
    if (speed === 4) return;
    console.log('changing speed to 4')
    speed = 4;
    clearInterval(gameTime);
    spawnChars(550);
  } else if (score <= 10000) {
    if (speed === 5) return;
    console.log('changing speed to 5')
    speed = 5;
    clearInterval(gameTime);
    spawnChars(450);
  } else {
    speed = 6;
    clearInterval(gameTime);
    spawnChars(300);
  }
}

const checkKey = (e) => {
  const keyCode = e.keyCode;
  const char = String.fromCharCode(keyCode + 32);

  const instance = displayedChars.find(charInstance => charInstance.text === char)
  if (instance) {
    console.log('solved');
    solvedChars.push(instance.id);

    addScore()
    checkIncreaseSpeed();
  } else {
    streak = 0;
  }
}

const hideMainMenu = () => {
  document.querySelector('.menu-container').style.opacity = '0%';
}

const drawCanvas = () => {
  const container = document.querySelector('.canvas-container');
  const canvas = document.querySelector('.display')
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
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
      removeFromDisplayArray(char.id);
      return;
    }
    if (addedHeight > canvas.height) {
      // minus health
      // remove word instance from display array
      removeFromDisplayArray(char.id);
      console.log("word missed! minus 1 health.");
      console.log('Game over! for now.')
      gameOver = true;
      clearInterval(gameTime);
      return;
    }
    // continue with loop, create new position
    char.drawChar(accumulateY);
    accumulateY += 2;

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
  hideMainMenu()
  spawnChars()
}

drawCanvas();
// document.querySelector('.test-word').addEventListener('click', newChar);
document.querySelector('.game-start-btn').addEventListener('click', gameStart);
window.addEventListener('resize', drawCanvas);
window.addEventListener('keydown', checkKey);