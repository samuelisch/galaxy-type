let alphabet = 'abcdefghijklmnopqrstuvwxyz';
let solvedChars = [];
let displayedChars = [];
let score = 0;
let gameTime; // variable for spawn timing
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

const checkKey = (e) => {
  const keyCode = e.keyCode;
  const char = String.fromCharCode(keyCode + 32);

  const instance = displayedChars.find(charInstance => charInstance.text === char)
  if (instance) {
    console.log('solved');
    score += 10;
    solvedChars.push(instance.id);
    document.querySelector('.score').textContent = score;
  }
}

const showMainMenu = () => {

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

const gameStart = () => {
  gameTime = setInterval(() => {
    newChar();
  }, 500);
}

drawCanvas();
document.querySelector('.test-word').addEventListener('click', newChar);
document.querySelector('.game-start-btn').addEventListener('click', gameStart);
window.addEventListener('resize', drawCanvas);
window.addEventListener('keydown', checkKey);