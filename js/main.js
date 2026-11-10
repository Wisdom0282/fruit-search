const input = document.getElementById("fruit");
const list = document.getElementById("results");
const liveRegion = document.getElementById("status");
const picked = document.getElementById("picked");
const state = { matches: [], active: -1, query: "" };

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const rank = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const starts = (name) => name.toLowerCase().startsWith(q);
  return FRUITS
    .filter((name) => name.toLowerCase().includes(q))
    .sort((a, b) => starts(b) - starts(a) || a.localeCompare(b));
};

function highlight(name, query) {
  const frag = document.createDocumentFragment();
  const match = new RegExp(escapeRegExp(query.trim()), "i").exec(name);
  if (!match) return frag.append(name), frag;
  const mark = document.createElement("mark");
  mark.textContent = match[0];
  frag.append(
    name.slice(0, match.index),
    mark,
    name.slice(match.index + match[0].length)
  );
  return frag;
}

function render() {
  const { matches, active, query } = state;
  const open = query.trim().length > 0;
  list.replaceChildren();

  if (open && matches.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No fruit matches that.";
    list.append(li);
  }

  matches.forEach((name, i) => {
    const li = document.createElement("li");
    li.id = `opt-${i}`;
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", String(i === active));
    li.dataset.index = i;
    li.append(highlight(name, query));
    list.append(li);
  });

  list.hidden = !open;
  input.setAttribute("aria-expanded", String(open));
  if (active >= 0) {
    input.setAttribute("aria-activedescendant", `opt-${active}`);
    list.children[active].scrollIntoView({ block: "nearest" });
  } else {
    input.removeAttribute("aria-activedescendant");
  }
  liveRegion.textContent = open
    ? `${matches.length} ${matches.length === 1 ? "suggestion" : "suggestions"} available`
    : "";
}

function update() {
  state.query = input.value;
  state.matches = rank(state.query);
  state.active = -1;
  render();
}

function choose(index) {
  const name = state.matches[index];
  if (!name) return;
  input.value = name;
  picked.textContent = `You picked ${name}.`;
  state.query = "";
  state.matches = [];
  state.active = -1;
  render();
}

input.addEventListener("input", update);

input.addEventListener("keydown", (e) => {
  const count = state.matches.length;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    if (!count) return;
    e.preventDefault();
    const step = e.key === "ArrowDown" ? 1 : -1;
    state.active = (state.active + step + count) % count;
    render();
  } else if (e.key === "Enter" && state.active >= 0) {
    e.preventDefault();
    choose(state.active);
  } else if (e.key === "Escape") {
    state.query = "";
    state.matches = [];
    render();
  }
});

list.addEventListener("mousedown", (e) => e.preventDefault()); // keep focus in the input
list.addEventListener("click", (e) => {
  const item = e.target.closest("[role=option]");
  if (item) choose(Number(item.dataset.index));
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".field") && state.query) {
    state.query = "";
    state.matches = [];
    render();
  }
});

// Theme toggle
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
} catch (_) { /* storage unavailable */ }

document.getElementById("theme").addEventListener("click", () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (_) {}
});
