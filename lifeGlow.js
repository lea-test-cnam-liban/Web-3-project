<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LifeGlow – Dashboard</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="stage" id="stage">
    <div class="app" id="app">

      <aside class="sidebar">
        <div class="logo"><i class="ico"></i><span>LifeGlow</span></div>
        <nav>
          <a href="#" class="nav-link active"><i class="ico"></i><span>Dashboard</span></a>
          <a href="#" class="nav-link"><i class="ico"></i><span>Tasks</span></a>
          <a href="#" class="nav-link"><i class="ico"></i><span>Calendar</span></a>
          <a href="#" class="nav-link"><i class="ico"></i><span>Mood</span></a>
          <a href="#" class="nav-link"><i class="ico"></i><span>Food</span></a>
          <a href="#" class="nav-link"><i class="ico"></i><span>Water</span></a>
          <a href="#" class="nav-link"><i class="ico"></i><span>Workout</span></a>
          <a href="#" class="nav-link"><i class="ico"></i><span>Goals</span></a>
        </nav>
      </aside>

      <main class="main">
        <header>
          <h1 id="greeting">Good morning, Lea</h1>
          <p>Here is your day at a glance</p>
        </header>

        <section class="top-row">
          <div class="card streak">
            <div class="label"><i class="ico"></i><span>Current streak</span></div>
            <div class="big" id="streak">12 days</div>
            <div class="sub">Keep it glowing</div>
          </div>
          <div class="card quote">
            <div class="label"><i class="ico c-yellow"></i><span>Daily quote</span></div>
            <p id="quote">Small steps every day lead to big change.</p>
          </div>
        </section>

        <section class="stats">
          <div class="card stat" data-key="tasks">
            <div class="label"><i class="ico c-purple"></i><span>Tasks</span></div>
            <div class="value" id="tasks-value">5 / 8</div>
            <div class="bar"><div class="fill purple" id="tasks-bar"></div></div>
          </div>
          <div class="card stat" data-key="water">
            <div class="label"><i class="ico c-cyan"></i><span>Hydration</span></div>
            <div class="value" id="water-value">1.5 / 2 L</div>
            <div class="bar"><div class="fill blue" id="water-bar"></div></div>
          </div>
          <div class="card stat" data-key="calories">
            <div class="label"><i class="ico c-orange"></i><span>Calories</span></div>
            <div class="value" id="calories-value">1,450 kcal</div>
            <div class="bar"><div class="fill orange" id="calories-bar"></div></div>
          </div>
          <div class="card stat" data-key="workout">
            <div class="label"><i class="ico c-red"></i><span>Workout</span></div>
            <div class="value" id="workout-value">30 / 45 min</div>
            <div class="bar"><div class="fill red" id="workout-bar"></div></div>
          </div>
          <div class="card stat" data-key="mood">
            <div class="label"><i class="ico c-pink"></i><span>Mood</span></div>
            <div class="value" id="mood-value">Happy</div>
            <div class="bar"><div class="fill pink" id="mood-bar"></div></div>
          </div>
          <div class="card stat" data-key="goals">
            <div class="label"><i class="ico c-teal"></i><span>Goals</span></div>
            <div class="value" id="goals-value">3 / 4</div>
            <div class="bar"><div class="fill green" id="goals-bar"></div></div>
          </div>
        </section>

        <button class="ai-btn" id="ai-btn"><i class="ico"></i><span>Ask LifeGlow AI</span></button>
      </main>
    </div>
  </div>

  <div class="modal" id="ai-modal" hidden>
    <div class="modal-box">
      <h2>Ask LifeGlow AI</h2>
      <input type="text" id="ai-input" placeholder="e.g. How can I drink more water?">
      <p id="ai-answer"></p>
      <div class="modal-actions">
        <button id="ai-send" class="btn primary">Send</button>
        <button id="ai-close" class="btn">Close</button>
      </div>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
