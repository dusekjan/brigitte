import "./popup.js";

let dom = {
    menu: document.querySelector("#menu"),
    nav: document.querySelector("nav"),
    brigitte1y: {
        node: document.querySelector("#brigitte-1y"),
        toMenu: document.querySelector("#brigitte-1y .back-to-menu"),
        prev: document.querySelector("#brigitte-1y .previous"),
        next: document.querySelector("#brigitte-1y .next"),
        container: document.querySelector("#brigitte-1y .prayer-container"),
        prayerCards: document.querySelectorAll("#brigitte-1y .prayer-card")
    },
    brigitte12y: {
        node: document.querySelector("#brigitte-12y"),
        toMenu: document.querySelector("#brigitte-12y .back-to-menu"),
        prev: document.querySelector("#brigitte-12y .previous"),
        next: document.querySelector("#brigitte-12y .next"),
        container: document.querySelector("#brigitte-12y .prayer-container"),
        prayerCards: document.querySelectorAll("#brigitte-12y .prayer-card")
    }
}

let index = 1;
let mode = "";  // "1y" or "12y"
let leftHeld = false;
let rightHeld = false;

function showSlides(n) {
    if (document.body.classList.contains("has-popup")) return;

    const { container, prayerCards, prev, next } = dom[`brigitte${mode}`];
    if (n < 1 || n > prayerCards.length - 2) return;

    const isIncreasing = n > index;
    index = n;

    prev.hidden = next.hidden = false;
    if (n >= prayerCards.length - 2) next.hidden = true;
    if (n <= 1) prev.hidden = true;

    container.style.setProperty("--current-index", index);
    prayerCards.forEach((card, i) => card.classList.toggle("active", i == index));

    buttonClick(isIncreasing ? next : prev);
}

function buttonClick(button) {
    button.classList.add("active-button");
    setTimeout(() => button.classList.remove("active-button"), 75);
}

// klikaci posuvniky
document.querySelector("#brigitte-1y .previous").addEventListener("click", () => showSlides(index - 1));
document.querySelector("#brigitte-1y .next").addEventListener("click", () => showSlides(index + 1));

document.querySelector("#brigitte-12y .previous").addEventListener("click", () => showSlides(index - 1));
document.querySelector("#brigitte-12y .next").addEventListener("click", () => showSlides(index + 1));

// posouvani klavesnici
document.addEventListener("keydown", (event) => {
    // klavesa nesmi byt drzena
    if (event.key === "ArrowLeft" && leftHeld) return;
    if (event.key === "ArrowRight" && rightHeld) return;

    if (event.key === "ArrowLeft") {
        showSlides(index - 1);
        leftHeld = true;
    } else if (event.key === "ArrowRight") {
        showSlides(index + 1);
        rightHeld = true;
    };
});

document.addEventListener("keyup", (event) => {
    if (event.key == "ArrowLeft") { leftHeld = false }
    else if (event.key == "ArrowRight") { rightHeld = false };
});

// posouvani slajdem - hammer.min.js
const element1y = document.querySelector("#brigitte-1y .prayer-wrapper");
const hammer1y = new Hammer(element1y);
hammer1y.on('swipeleft', () => showSlides(index + 1));
hammer1y.on('swiperight', () => showSlides(index - 1));

const element12y = document.querySelector("#brigitte-12y .prayer-wrapper");
const hammer12y = new Hammer(element12y);
hammer12y.on('swipeleft', () => showSlides(index + 1));
hammer12y.on('swiperight', () => showSlides(index - 1));

// vyber poboznosti v menu
dom.nav.addEventListener("click", (event) => {
    const target = event.target.closest("[data-mode]");
    if (!target) return;

    mode = target.dataset.mode;
    dom.menu.hidden = true;
    switch (mode) {
        case "1y":
            document.querySelector("#brigitte-1y").hidden = false;
            break;
        case "12y":
            document.querySelector("#brigitte-12y").hidden = false;
            break;
    }

    localStorage.setItem("selected", mode);
    showSlides(1);
});

// vratit se do menu
dom.brigitte1y.toMenu.addEventListener("click", () => {
    dom.brigitte1y.node.hidden = true;
    dom.menu.hidden = false;
    localStorage.removeItem("selected");
});

dom.brigitte12y.toMenu.addEventListener("click", () => {
    dom.brigitte12y.node.hidden = true;
    dom.menu.hidden = false;
    localStorage.removeItem("selected");
});

function app() {
    let isDark = localStorage.getItem("dark-mode") == "1";
    document.body.classList.toggle("dark", isDark);
    isDark && document.querySelector("meta[name='theme-color']").setAttribute("content", "#121212")

    const selected = localStorage.getItem("selected");
    if (selected) {
        dom[`brigitte${selected}`].node.hidden = false;
        dom.menu.hidden = true;
        mode = selected;
        showSlides(1);
    } else {
        dom.menu.hidden = false;
        dom.brigitte1y.node.hidden = true;
        dom.brigitte12y.node.hidden = true;
    }
}
app();
