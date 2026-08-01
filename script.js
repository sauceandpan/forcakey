// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const letterWindow = document.querySelector(".letter-window");
const letterContent = document.querySelector(".letter-content");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

// Click Envelope

envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    letter.style.display = "flex";

    setTimeout( () => {
        letterWindow.classList.add("open");
    },50);
});

// Logic to move the NO btn

// Current offset in the button's own (untransformed) pixels, so it can be
// kept inside the letter on small screens
let noX = 0;
let noY = 0;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function moveNoButton() {
    const areaRect = letterContent.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // The letter is scaled while it opens. Rects are in screen pixels but a
    // translate() is applied before that scale, so convert between the two or
    // every hop overshoots by the scale factor.
    const scale = letterWindow.offsetWidth
        ? letterWindow.getBoundingClientRect().width / letterWindow.offsetWidth
        : 1;
    if (!scale) return;

    // Strip the current translate to find where the button actually sits in the layout
    const baseLeft = btnRect.left - noX * scale;
    const baseTop = btnRect.top - noY * scale;
    const margin = btnRect.width * 0.1;

    // How far it may travel before leaving the letter's transparent panel
    const minX = (areaRect.left + margin - baseLeft) / scale;
    const maxX = (areaRect.right - margin - (baseLeft + btnRect.width)) / scale;
    const minY = (areaRect.top + margin - baseTop) / scale;
    const maxY = (areaRect.bottom - margin - (baseTop + btnRect.height)) / scale;

    // Panel too tight to dodge in — leave the button where it is
    if (maxX < minX || maxY < minY) return;

    const reach = (Math.min(areaRect.width, areaRect.height) / scale) * 0.55;

    // Try a handful of random hops and keep the one that runs away the furthest,
    // so clamping near an edge can't leave the button barely moving
    let bestX = noX;
    let bestY = noY;
    let bestDistance = -1;

    for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = reach * (0.45 + Math.random() * 0.55);

        const x = clamp(noX + Math.cos(angle) * distance, minX, maxX);
        const y = clamp(noY + Math.sin(angle) * distance, minY, maxY);
        const travelled = Math.hypot(x - noX, y - noY);

        if (travelled > bestDistance) {
            bestDistance = travelled;
            bestX = x;
            bestY = y;
        }
    }

    noX = bestX;
    noY = bestY;

    noBtn.style.transition = "transform 0.3s ease";
    noBtn.style.transform = `translate(${noX}px, ${noY}px)`;
}

noBtn.addEventListener("pointerenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton);
noBtn.addEventListener("touchstart", (event) => {
    event.preventDefault();
    moveNoButton();
});

// Bounds change with the viewport, so send the button home on resize/rotate
window.addEventListener("resize", () => {
    noX = 0;
    noY = 0;
    noBtn.style.transition = "none";
    noBtn.style.transform = "";
});

// YES is clicked

yesBtn.addEventListener("click", () => {
    title.textContent = "Yippeeee!";

    catImg.src = "cat_dance.gif";
    catImg.alt = "Dancing cat";

    letterWindow.classList.add("final");

    buttons.style.display = "none";

    finalText.style.display = "block";
});
