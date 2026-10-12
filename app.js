
const fruits = [
    { name: "apple", symbol: "🍎" },
    { name: "banana", symbol: "🍌" },
    { name: "cherry", symbol: "🍒" },
    { name: "coconut", symbol: "🥥" },
    { name: "grapes", symbol: "🍇" },
    { name: "mango", symbol: "🥭" },
    { name: "pineapple", symbol: "🍍" },
    { name: "watermelon", symbol: "🍉" }
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const board = document.querySelector("#board");
const movesDisplay = document.querySelector("#moves");
const statusDisplay = document.querySelector("#status");
const newGameButton = document.querySelector("#new-game");

let deck = [];
let turnedCards = [];
let moves = 0;
let waiting = false;
let timer = null;
let matchedPairs = 0;

function buildBoard() {
    deck = shuffle([...fruits, ...fruits]);

    deck.forEach(function (fruit, i) {
        const card = document.createElement("button");

        card.type = "button";
        card.classList.add("card");
        card.setAttribute("aria-label", `Card ${i + 1}, face down`);
        card.dataset.index = i;

        board.appendChild(card);
    });
}

function checkMatch() {
    moves++;
    movesDisplay.textContent = moves;

    const firstCard = turnedCards[0];
    const secondCard = turnedCards[1];

    const firstFruit = deck[Number(firstCard.dataset.index)];
    const secondFruit = deck[Number(secondCard.dataset.index)];

    if (firstFruit.name === secondFruit.name) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.disabled = true;
        secondCard.disabled = true;

        matchedPairs++;
        statusDisplay.textContent = "That's a pair!";

        turnedCards = [];

        if (matchedPairs === 8) {
            statusDisplay.textContent =
                `You found all the pairs in ${moves} moves!`;

            statusDisplay.classList.add("you-won");
        }
    } else {
        statusDisplay.textContent = "Not a pair. Try again.";
        waiting = true;

        timer = setTimeout(function () {
            turnedCards.forEach(function (card) {
                card.textContent = "";
                card.classList.remove("flipped");

                card.setAttribute(
                    "aria-label",
                    `Card ${Number(card.dataset.index) + 1}, face down`
                );
            });

            turnedCards = [];
            waiting = false;
            timer = null;
        }, 1000);
    }
}

function startNewGame() {
    if (timer !== null) {
        clearTimeout(timer);
        timer = null;
    }

    waiting = false;
    turnedCards = [];
    moves = 0;
    matchedPairs = 0;

    movesDisplay.textContent = moves;
    statusDisplay.textContent =
        "Turn over two cards to find a matching pair.";

    statusDisplay.classList.remove("you-won");

    board.replaceChildren();
    buildBoard();
}

board.addEventListener("click", function (event) {
    const card = event.target;

    if (!card.classList.contains("card")) {
        return;
    }

    if (card.classList.contains("flipped") ||
        card.classList.contains("matched")) {
        return;
    }

    if (waiting) {
        return;
    }

    const fruit = deck[Number(card.dataset.index)];

    card.textContent = fruit.symbol;
    card.classList.add("flipped");

    card.setAttribute(
        "aria-label",
        `Card ${Number(card.dataset.index) + 1}, ${fruit.name}`
    );

    turnedCards.push(card);

    if (turnedCards.length === 2) {
        checkMatch();
    }
});

newGameButton.addEventListener("click", startNewGame);

buildBoard();
