let gameStart = false;
let gameEnd = false;
let score = 0;
let letterToMatch;

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const getRandomChar = () => {
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

const showRandomChar = () => {
  letterToMatch = getRandomChar()
  console.log(`Match this: ${letterToMatch}`)
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

  if (char === letterToMatch) {
    score += 100;
    showRandomChar();
  } else {
    gameEnd = true;
    console.log(`You entered a wrong key! Final score: ${score}`);
  }

}

showRandomChar();
window.addEventListener('keydown', checkKey)