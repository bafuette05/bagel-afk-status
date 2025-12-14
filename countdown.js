const STORAGE_KEY = "bagel-afk-users";
const HOURS = 12; // 🔥 SET YOUR TIMER LENGTH HERE

const DEFAULT_USERS = [
  "Chi******ai",
  "E*********3",
  "A*********4",
  "St****V"
];

const grid = document.getElementById("grid");

/* ---------- Initialize timers ONCE ---------- */
function initTimers() {
  if (localStorage.getItem(STORAGE_KEY)) return;

  const now = Date.now();
  const users = DEFAULT_USERS.map(name => ({
    name,
    endTime: now + HOURS * 60 * 60 * 1000
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/* ---------- Load timers ---------- */
function loadUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

/* ---------- Helpers ---------- */
function format(ms) {
  if (ms <= 0) return "00:00:00";

  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  return (
    String(h).padStart(2, "0") + ":" +
    String(m).padStart(2, "0") + ":" +
    String(sec).padStart(2, "0")
  );
}

/* ---------- Render cards once ---------- */
function render() {
  grid.innerHTML = "";
  loadUsers().forEach(user => {
    const card = document.createElement("div");
    card.className = "card";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = user.name;

    const time = document.createElement("div");
    time.className = "time";
    time.dataset.end = user.endTime;

    card.appendChild(name);
    card.appendChild(time);
    grid.appendChild(card);
  });
}

/* ---------- Update timers ---------- */
function tick() {
  document.querySelectorAll(".time").forEach(el => {
    const remaining = el.dataset.end - Date.now();
    el.textContent = format(remaining);

    const card = el.closest(".card");
    card.classList.toggle("active", remaining > 0);
    card.classList.toggle("inactive", remaining <= 0);
  });
}

/* ---------- RUN ---------- */
initTimers();   // 👈 only sets timers if none exist
render();
tick();
setInterval(tick, 1000);
