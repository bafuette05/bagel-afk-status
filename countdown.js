const STORAGE_KEY = "bagel-afk-users";

const DEFAULT_USERS = [
  { name: "Chi******ai", hours: 11 },
  { name: "E*********3", hours: 11 },
  { name: "A*********4", hours: 11 },
  { name: "St****V", hours: 0 }
];

const grid = document.getElementById("grid");

/* ---------- Load or initialize users ---------- */
function loadUsers() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  const now = Date.now();
  const users = DEFAULT_USERS.map(u => ({
    name: u.name,
    endTime: u.hours > 0 ? now + u.hours * 3600 * 1000 : now
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return users;
}

const users = loadUsers();

/* ---------- Helpers ---------- */
function format(ms) {
  if (ms <= 0) return "00:00:00";

  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return (
    String(h).padStart(2, "0") + ":" +
    String(m).padStart(2, "0") + ":" +
    String(s).padStart(2, "0")
  );
}

/* ---------- Render cards ONCE ---------- */
users.forEach(user => {
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

/* ---------- Update timers ---------- */
function updateTimers() {
  document.querySelectorAll(".time").forEach(el => {
    const end = Number(el.dataset.end);
    const remaining = end - Date.now();

    el.textContent = format(remaining);

    const card = el.closest(".card");
    card.classList.toggle("active", remaining > 0);
    card.classList.toggle("inactive", remaining <= 0);
  });
}

updateTimers();
setInterval(updateTimers, 1000);
