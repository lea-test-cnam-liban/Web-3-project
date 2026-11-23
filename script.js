const user = { name: "Lea", streak: 12 };

const data = {
  tasks:    { current: 5,    goal: 8,    unit: "",      step: 1 },
  water:    { current: 1.5,  goal: 2,    unit: " L",    step: 0.25 },
  calories: { current: 1450, goal: 2000, unit: " kcal", step: 50 },
  workout:  { current: 30,   goal: 45,   unit: " min",  step: 5 },
  goals:    { current: 3,    goal: 4,    unit: "",      step: 1 }
};

const moods = [
  { label: "Sad",   score: 25 },
  { label: "Okay",  score: 50 },
  { label: "Good",  score: 70 },
  { label: "Happy", score: 85 }
];
let moodIndex = 3;

const quotes = [
  "Small steps every day lead to big change.",
  "Progress, not perfection.",
  "You are one habit away from a better day.",
  "Drink water, take a walk, breathe."
];

const $ = (id) => document.getElementById(id);
const fmt = (n) => n.toLocaleString("en-US");

function render() {
  for (const key in data) {
    const { current, goal, unit } = data[key];
    $(`${key}-value`).textContent = key === "calories"
      ? `${fmt(current)}${unit}`
      : `${fmt(current)} / ${fmt(goal)}${unit}`;
    $(`${key}-bar`).style.width = Math.min(100, (current / goal) * 100) + "%";
  }
  $("mood-value").textContent = moods[moodIndex].label;
  $("mood-bar").style.width = moods[moodIndex].score + "%";
  $("streak").textContent = `${user.streak} days`;
}

function setGreeting() {
  const h = new Date().getHours();
  const part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  $("greeting").textContent = `Good ${part}, ${user.name}`;
}

document.querySelectorAll(".stat").forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.dataset.key;
      if (key === "water") {
      window.location.href = "water.html";
      return;
    }
    if (key === "mood") {
      moodIndex = (moodIndex + 1) % moods.length;
    } else {
      const item = data[key];
      item.current = Math.min(item.goal, +(item.current + item.step).toFixed(2));
    }
    render();
  });
});

const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
$("quote").textContent = quotes[dayOfYear % quotes.length];


const modal = $("ai-modal");
$("ai-btn").addEventListener("click", () => { modal.hidden = false; $("ai-input").focus(); });
$("ai-close").addEventListener("click", () => { modal.hidden = true; });
modal.addEventListener("click", (e) => { if (e.target === modal) modal.hidden = true; });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") modal.hidden = true; });
$("ai-send").addEventListener("click", () => {
  $("ai-answer").textContent = $("ai-input").value.trim()
    ? "The AI connection isn't set up yet. Connect this to your backend."
    : "Type a question first.";
});


function fit() {
  const s = Math.min(1, (window.innerWidth - 32) / 1470);
  $("stage").style.width = 1470 * s + "px";
  $("stage").style.height = 868 * s + "px";
  $("app").style.transform = `scale(${s})`;
}
window.addEventListener("resize", fit);

async function loadWater() {
  try {
    const res = await fetch("water_api.php");
    const d = await res.json();
    data.water.current = d.total / 1000;
   data.water.goal = d.goal / 1000;
    render();
  } catch (err) {
    console.log("Could not load water data");
  }
}

setGreeting();
fit();
setTimeout(render, 100);
loadWater();