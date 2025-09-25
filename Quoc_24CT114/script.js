const faces = ["bau","cua","tom","ca","ga","nai"];
const emojis = {bau:"🍐", cua:"🦀", tom:"🦐", ca:"🐟", ga:"🐓", nai:"🦌"};

let balance = 5000000;
const balanceEl = document.getElementById("balance");
const resultText = document.getElementById("resultText");
const diceEls = [document.getElementById("dice1"), document.getElementById("dice2"), document.getElementById("dice3")];

function updateBalance() {
  balanceEl.textContent = balance.toLocaleString("vi-VN");
}

function getBets() {
  let bets = {};
  document.querySelectorAll(".bet-input").forEach(input => {
    bets[input.dataset.face] = Number(input.value) || 0;
  });
  return bets;
}

function totalBet(bets) {
  return Object.values(bets).reduce((sum, v) => sum + v, 0);
}

function rollOnce() {
  return faces[Math.floor(Math.random() * faces.length)];
}

async function rollDice() {
  const bets = getBets();
  const total = totalBet(bets);
  if (total <= 0) {
    resultText.textContent = "❌ Bạn chưa đặt cược!";
    return;
  }
  if (total > balance) {
    resultText.textContent = "⚠️ Số dư không đủ!";
    return;
  }

  balance -= total;
  updateBalance();

  resultText.textContent = "🎲 Đang quay...";
  diceEls.forEach(d => d.classList.add("rolling"));

  await new Promise(r => setTimeout(r, 1200));
  diceEls.forEach(d => d.classList.remove("rolling"));

  const result = [rollOnce(), rollOnce(), rollOnce()];
  diceEls.forEach((d, i) => d.textContent = emojis[result[i]]);

  let win = 0;
  result.forEach(face => {
    if (bets[face]) win += bets[face];
  });

  balance += win;
  updateBalance();

  const net = win - total;
  resultText.textContent = `Kết quả: ${result.map(f => emojis[f]).join(" ")} → ${net >= 0 ? "Lãi" : "Lỗ"} ${net.toLocaleString("vi-VN")}₫`;
}

document.getElementById("rollBtn").addEventListener("click", rollDice);
document.getElementById("clearBtn").addEventListener("click", () => {
  document.querySelectorAll(".bet-input").forEach(input => input.value = 0);
});

updateBalance();
