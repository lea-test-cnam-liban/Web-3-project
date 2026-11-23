const API = "water_api.php";
let goalMl = 2000;

const $ = (id) => document.getElementById(id);
const fmt = (n) => n.toLocaleString("en-US");

async function loadWater() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    goalMl = data.goal;
    $("goal-input").value = goalMl;
    render(data.total, data.logs);
    renderWeek(data.week);
  } catch (err) {
    $("water-msg").textContent = "Could not load your water data.";
  }
}

function render(total, logs) {
  $("water-total").textContent = `${fmt(total)} / ${fmt(goalMl)} ml`;
  $("water-bar").style.width = Math.min(100, (total / goalMl) * 100) + "%";

  const pct = total / goalMl;
  $("water-msg").textContent =
    pct >= 1   ? "Goal reached! Great job." :
    pct >= 0.5 ? "Over halfway there, keep going!" :
    pct > 0    ? "Good start, keep sipping." :
                 "Let's start drinking!";

  const list = $("water-list");
  list.innerHTML = "";

  if (!logs.length) {
    const p = document.createElement("li");
    p.className = "empty-msg";
    p.textContent = "No drinks logged yet today.";
    list.appendChild(p);
    return;
  }

  logs.forEach((log) => {
    const li = document.createElement("li");

    const amount = document.createElement("span");
    amount.textContent = `${fmt(Number(log.amount_ml))} ml`;

    const time = document.createElement("span");
    time.className = "time";
    time.textContent = log.created_at.slice(11, 16);

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "Delete";
    del.addEventListener("click", () => removeLog(log.id));

    li.append(amount, time, del);
    list.appendChild(li);
  });
}

function renderWeek(week) {
  const chart = $("week-chart");
  chart.innerHTML = "";

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 10);
    const ml = Number(week[key] || 0);

    const col = document.createElement("div");
    col.className = "week-col";

    const val = document.createElement("span");
    val.className = "week-val";
    val.textContent = ml ? (ml / 1000).toFixed(1) + " L" : "";

    const bar = document.createElement("div");
    bar.className = "week-bar" + (ml === 0 ? " empty" : ml >= goalMl ? " reached" : "");
    bar.style.height = Math.min(100, (ml / goalMl) * 100) * 0.8 + "%";

    const day = document.createElement("span");
    day.className = "week-day";
    day.textContent = d.toLocaleDateString("en", { weekday: "short" });

    col.append(val, bar, day);
    chart.appendChild(col);
  }
}

async function addWater(ml) {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount_ml: ml })
    });
    if (!res.ok) throw new Error();
    loadWater();
  } catch (err) {
    $("water-msg").textContent = "Could not save. Try again.";
  }
}

async function removeLog(id) {
  await fetch(`${API}?id=${id}`, { method: "DELETE" });
  loadWater();
}

async function saveGoal() {
  const goal = Number($("goal-input").value);
  if (!goal || goal < 500 || goal > 6000) {
    $("water-msg").textContent = "Goal must be between 500 and 6000 ml.";
    return;
  }
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal_ml: goal })
    });
    if (!res.ok) throw new Error();
    loadWater();
  } catch (err) {
    $("water-msg").textContent = "Could not save the goal.";
  }
}

document.querySelectorAll(".quick-btns .btn").forEach((btn) => {
  btn.addEventListener("click", () => addWater(Number(btn.dataset.ml)));
});

$("custom-add").addEventListener("click", () => {
  const ml = Number($("custom-ml").value);
  if (!ml || ml < 1 || ml > 2000) {
    $("water-msg").textContent = "Enter an amount between 1 and 2000 ml.";
    return;
  }
  addWater(ml);
  $("custom-ml").value = "";
});

$("goal-save").addEventListener("click", saveGoal);

function fit() {
  const s = Math.min(1, (window.innerWidth - 32) / 1470);
  $("stage").style.width = 1470 * s + "px";
  $("stage").style.height = 868 * s + "px";
  $("app").style.transform = `scale(${s})`;
}
window.addEventListener("resize", fit);

fit();
loadWater();