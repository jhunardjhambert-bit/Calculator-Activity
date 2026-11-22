let unpaidAnswer = null; // answer waiting to be paid for
let isPaid = false; // true after paying, until new numbers are typed
let paidAnswer = null; // the answer that was paid for
let messageTimer = null; // timer for the short message
let danceTimer = null; // timer for the character dance

function insert(num) {
    const screen = document.form1.textview;
    const isOperator = ["+", "−", "×", "÷"].includes(num);

    // after a paid answer: operator continues with the answer, anything else starts fresh
    if (isPaid) {
        if (isOperator) {
            screen.value = String(paidAnswer);
        } else {
            screen.value = "";
        }

        isPaid = false;
        paidAnswer = null;
    }

    if (screen.value === "Error") {
        screen.value = "";
    }

    screen.value += num;
    unpaidAnswer = null;
    setResult("");
    checkEasterEgg();
}

function clearScreen() {
    document.form1.textview.value = "";
    unpaidAnswer = null;
    isPaid = false;
    paidAnswer = null;
    setResult("");
    checkEasterEgg();
}

function backspace() {
    const screen = document.form1.textview;

    // after a paid answer, backspace edits the expression and starts a new one
    isPaid = false;
    paidAnswer = null;

    screen.value = screen.value.slice(0, -1);
    unpaidAnswer = null;
    setResult("");
    checkEasterEgg();
}

function equal() {
    const screen = document.form1.textview;

    // already paid: can't press = again until new numbers are entered
    if (isPaid) {
        showMessage("Enter new numbers first!");
        return;
    }

    if (!screen.value || screen.value === "Error") return;

    // convert the pretty symbols to real math symbols
    const expression = screen.value
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-");

    // only allow numbers, operators, dots and brackets
    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
        setResult("Error");
        return;
    }

    try {
        const result = eval(expression);

        if (!Number.isFinite(result)) {
            setResult("Error");
            return;
        }

        unpaidAnswer = parseFloat(result.toFixed(10));
        setResult("Press PAY", true); // answer stays hidden until you pay

    } catch (error) {
        setResult("Error");
    }

    checkEasterEgg();
}

function payNow() {
    // already paid: can't pay again until a new answer is made
    if (isPaid) {
        showMessage("Enter new numbers first!");
        return;
    }

    if (unpaidAnswer === null) {
        setResult("Press = first"); // nothing to pay for yet
        return;
    }

    openModal();
}

/* ---------- FAKE PAYMENT ---------- */

function openModal() {
    document.getElementById("payChoose").style.display = "block";
    document.getElementById("payProcessing").style.display = "none";
    document.getElementById("modal").classList.add("show");
}

function closeModal(event) {
    // when clicking the dark background, only close if the overlay itself was clicked
    if (event && event.target.id !== "modal") return;

    document.getElementById("modal").classList.remove("show");
}

function pay(method) {
    document.getElementById("payChoose").style.display = "none";
    document.getElementById("payProcessing").style.display = "block";
    document.getElementById("payMethod").textContent = "Paying with " + method + "...";

    // fake loading, no real payment happens
    setTimeout(function () {
        document.getElementById("modal").classList.remove("show");
        revealAnswer();
    }, 1400);
}

function revealAnswer() {
    if (unpaidAnswer === null) return;

    paidAnswer = unpaidAnswer;
    setResult(String(paidAnswer));
    isPaid = true;
    unpaidAnswer = null;

    showToast();
    launchConfetti();
    playPaySound();
    celebrate();
}

/* ---------- SOUND + CHARACTER DANCE ---------- */

function playPaySound() {
    const sound = document.getElementById("paySound");

    sound.currentTime = 0; // restart from the beginning every time
    sound.play().catch(function () {
        // browser blocked the sound, ignore
    });
}

function celebrate() {
    const box = document.querySelector(".characters");

    box.classList.add("celebrate");
    clearTimeout(danceTimer);

    danceTimer = setTimeout(function () {
        box.classList.remove("celebrate");
    }, 3000);
}

function setResult(text, isAlert) {
    clearTimeout(messageTimer); // a new result cancels any message that is showing

    const box = document.getElementById("result");

    box.textContent = text || "\u00A0";
    box.classList.toggle("alert", !!isAlert);
}

// shows a short message, then brings the answer back
function showMessage(message) {
    setResult(message, true);

    messageTimer = setTimeout(function () {
        if (isPaid && paidAnswer !== null) {
            setResult(String(paidAnswer));
        }
    }, 1500);
}

function showToast() {
    const toast = document.getElementById("toast");

    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 2800);
}

function launchConfetti() {
    const box = document.getElementById("confetti");
    const pieces = ["🫧", "🐚", "⭐", "🫧", "🍍", "✨"];

    for (let i = 0; i < 40; i++) {
        const piece = document.createElement("span");

        piece.textContent = pieces[Math.floor(Math.random() * pieces.length)];
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.fontSize = 14 + Math.random() * 18 + "px";
        piece.style.animationDuration = 2 + Math.random() * 2.5 + "s";
        piece.style.animationDelay = Math.random() * 0.5 + "s";

        box.appendChild(piece);

        setTimeout(function () {
            piece.remove();
        }, 5500);
    }
}

function checkEasterEgg() {
    const calculator = document.querySelector(".calculator");
    const screen = document.form1.textview;

    if (screen.value === "5318008") {
        calculator.classList.add("upside-down");
    } else {
        calculator.classList.remove("upside-down");
    }
}