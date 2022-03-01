let randomWords = [];

const canvas = document.querySelector('.display');
const context = canvas.getContext('2d');

const fetchRandomWords = async () => {
  const response = await fetch('https://random-word-api.herokuapp.com/word?number=10000&swear=0')
  const words = await response.json();
  randomWords = words;
  console.log('done');
}

const getRandomWord = () => {
  return randomWords[Math.floor(Math.random() * 1000)];
}

const getRandomWidth = () => {
  const maxWidth = document.querySelector('.game-container').clientWidth - 200; //prevent overflowX
  return Math.floor(Math.random() * maxWidth) + 5;
}

const WordFactory = function() {
  let text = getRandomWord();
  let x = getRandomWidth();
  let y = 20;
  const width = context.measureText(text).width;
  let metrics = context.measureText(text);

  const drawWord = () => {
    context.beginPath();
    context.fillStyle = "white";
    context.font = '25px Helvetica';
    context.fillText(text, x, y);
  }

  const update = () => {
    y += 2;
  }

  return {
    text,
    x, 
    y,
    metrics,
    width,
    drawWord,
    update
  }
}

const checkKey = (e) => {
  if (gameEnd) {
    console.log('Game ended! restart the game');
    return;
  }
  if (!gameStart) {
    gameStart = true;
  }
  const keyCode = e.keyCode;
  const char = String.fromCharCode(keyCode + 32);

  if (char === lettersToMatch[0]) {
    removeChar();
    createRandomChars();
    updateScore(10);
  } else {
    gameEnd = true;
    console.log(`You entered a wrong key! Final score: ${score}`);
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

const newWord = () => {
  console.log('creating word');
  const word = WordFactory();
  const actualHeight = word.metrics.actualBoundingBoxAscent + word.metrics.actualBoundingBoxDescent;
  let accumulateY = 0;

  const loop = () => {
    context.clearRect(word.x, 0, word.x + word.width, word.y + actualHeight + accumulateY);

    word.drawWord();
    word.update();
    accumulateY += 2;

    requestAnimationFrame(loop);
  }

  loop();
}

fetchRandomWords();

document.querySelector('.test-word').addEventListener('click', newWord)
drawCanvas();
window.addEventListener('resize', drawCanvas);
// createRandomChars();
// window.addEventListener('keydown', checkKey)