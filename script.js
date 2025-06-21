let currentPlayer = 0;
let money = {
  red: 100,
  blue: 100,
  yellow: 100,
  green: 100
};
let players = ['red', 'blue', 'yellow', 'green'];

function rollDice() {
  let roll = Math.floor(Math.random() * 6) + 1;
  let color = players[currentPlayer];
  let soundOn = document.getElementById('sound').checked;

  let diceImg = document.getElementById('dice');
  diceImg.src = 'dice' + roll + '.png';
  diceImg.style.transform = 'rotate(' + (roll * 60) + 'deg)';

  document.getElementById("dice-result").innerText = color.toUpperCase() + " rolled a " + roll;

  if ([2, 4, 6].includes(roll)) {
    money[color] += 5;
    updateMoney(color);
  }

  if (roll === 5 && money[color] >= 25) {
    money[color] -= 25;
    updateMoney(color);
    alert(color.toUpperCase() + " entered home! 🏠");
    triggerFireworks();
  } else if (roll === 5 && money[color] < 25) {
    alert(color.toUpperCase() + " needs $25 to enter home. Earn more!");
  }

  playSoundEffect(color, roll, soundOn);
  saveToFirebase();
  currentPlayer = (currentPlayer + 1) % 4;
}

function updateMoney(color) {
  document.getElementById("money-" + color).innerText = "$" + money[color];
}

function playSoundEffect(color, roll, soundOn) {
  if (!soundOn || roll !== 6) return;
  let audio = new Audio();
  switch (color) {
    case 'red': audio.src = 'bat.mp3'; break;
    case 'blue': audio.src = 'whale.mp3'; break;
    case 'yellow': audio.src = 'lion.mp3'; break;
    case 'green': audio.src = 'hulk.mp3'; break;
  }
  audio.play();
}

function triggerFireworks() {
  let canvas = document.getElementById('fireworks');
  canvas.style.display = 'block';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let ctx = canvas.getContext('2d');

  for (let i = 0; i < 200; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let radius = Math.random() * 3 + 1;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'hsl(' + Math.random() * 360 + ', 100%, 50%)';
    ctx.fill();
  }

  setTimeout(() => { canvas.style.display = 'none'; }, 2000);
}

function saveToFirebase() {
  if (!firebase || !firebase.firestore) return;
  db.collection("wallets").doc("game1").set(money)
    .then(() => console.log("Wallet data saved"))
    .catch(err => console.error("Firebase save error:", err));
}
