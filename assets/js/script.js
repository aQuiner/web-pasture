const introScreen = document.querySelector("#introScreen");
const introMessage = document.querySelector("#introMessage");
const introAudio = document.querySelector("#introAudio");
const devilFlight = document.querySelector("#devilFlight");
const chatWidget = document.querySelector("#chatWidget");
const isPhone = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
introMessage.textContent = `${isPhone ? "Сайт открыт с телефона" : "Сайт открыт с ПК"}.`;
introAudio.volume = 0.2;
introScreen.addEventListener("click", () => {
  introAudio.volume = 0.2;
  introAudio.play().catch(() => {});
}, { once: true });
window.setTimeout(() => introScreen.classList.add("is-hidden"), 4300);
window.setTimeout(() => devilFlight.classList.add("is-flying"), 4300);
window.setTimeout(() => devilFlight.classList.remove("is-flying"), 5700);
window.setTimeout(() => chatWidget.classList.add("is-visible"), 15000);
window.setTimeout(() => chatWidget.classList.add("bubble-visible"), 17000);

const bot = navigator.webdriver
  || /HeadlessChrome|PhantomJS|爬虫|bot|crawler|spider/i.test(navigator.userAgent)
  || !navigator.languages?.length;
if (bot) {
  document.documentElement.classList.add("automation");
}

document.addEventListener("contextmenu", (event) => event.preventDefault());
document.addEventListener("copy", (event) => {
  const target = event.target;
  if (!target.closest("input, textarea, .copy-btn")) {
    event.preventDefault();
  }
});
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c") {
    const target = event.target;
    if (!target.closest("input, textarea, .copy-btn")) {
      event.preventDefault();
    }
  }
});

const cursorGlow = document.querySelector(".cursor-glow");
let pointerFrame = 0;
let pointerEvent;
document.addEventListener("pointermove", (event) => {
  pointerEvent = event;
  if (pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    cursorGlow.style.left = `${pointerEvent.clientX}px`;
    cursorGlow.style.top = `${pointerEvent.clientY}px`;
    const card = pointerEvent.target.closest(".command-card");
    if (card) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${pointerEvent.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${pointerEvent.clientY - rect.top}px`);
    }
    pointerFrame = 0;
  });
});
document.addEventListener("pointerover", (event) => {
  if (event.target.closest("a, button, input")) {
    cursorGlow.style.width = "42px";
    cursorGlow.style.height = "42px";
    cursorGlow.style.background = "rgba(255, 51, 71, .12)";
  }
});
document.addEventListener("pointerout", (event) => {
  if (event.target.closest("a, button, input")) {
    cursorGlow.style.width = "20px";
    cursorGlow.style.height = "20px";
    cursorGlow.style.background = "transparent";
  }
});
const grid = document.querySelector("#commandsGrid");
const search = document.querySelector("#searchInput");
const count = document.querySelector("#commandCount");
const empty = document.querySelector("#emptyState");
let activeFilter = "all";

function render() {
  const query = search.value.trim().toLowerCase();
  const filtered = commands.filter(([name, description, example, aliases, category]) => {
    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const matchesQuery = [name, description, example, aliases].join(" ").toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });
  count.textContent = filtered.length;
  empty.hidden = filtered.length !== 0;
  grid.innerHTML = filtered.map(([name, description, example, aliases], index) => `
    <article class="command-card" style="animation-delay: ${Math.min(index * 0.025, 0.5)}s">
      <div class="command-top">
        <span class="command-name">.${name}</span>
        <button class="copy-btn" data-command=".${name}">копировать</button>
      </div>
      <div class="command-description">${description}</div>
      <div class="command-example">${example}</div>
      ${aliases ? `<div class="aliases">алиасы: .${aliases.replaceAll(", ", " · .")}</div>` : ""}
    </article>
  `).join("");
}

document.querySelector("#filters").addEventListener("click", (event) => {
  const button = event.target.closest(".filter");
  if (!button) return;
  document.querySelector(".filter.active").classList.remove("active");
  button.classList.add("active");
  activeFilter = button.dataset.filter;
  render();
});
search.addEventListener("input", render);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== search) {
    event.preventDefault();
    search.focus();
  }
});
const toast = document.querySelector("#toast");
grid.addEventListener("click", async (event) => {
  const button = event.target.closest(".copy-btn");
  if (!button) return;
  await navigator.clipboard.writeText(button.dataset.command);
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 1600);
});
render();
