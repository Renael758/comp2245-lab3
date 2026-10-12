// COMP2245 Lab 3 - Memory Game

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

// Shuffle the cards into a random order
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

// Build the game board
function buildBoard() {
    deck = shuffle([...fruits, ...fruits]);

    deck.forEach((fruit, i) => {
        const card = document.createElement("button");

        card.type = "button";
        card.classList.add("card");
        card.setAttribute("aria-label", `Card ${i + 1}, face down`);
        card.dataset.index = i;

        board.appendChild(card);
    });
}

// Create the initial board
buildBoard();
// Handle clicks on the game board
board.addEventListener("click", function (event) {
    const card = event.target;

    // Ignore clicks that are not on a card
    if (!card.classList.contains("card")) {
        return;
    }

    // Ignore cards that are already turned over or matched
    if (card.classList.contains("flipped") ||
        card.classList.contains("matched")) {
        return;
    }

    // Ignore clicks while unmatched cards are waiting to turn back
    if (waiting) {
        return;
    }

    // Find the fruit belonging to this card
    const fruit = deck[Number(card.dataset.index)];

    // Turn the card over
    card.textContent = fruit.symbol;
    card.classList.add("flipped");
    card.setAttribute(
        "aria-label",
        `Card ${Number(card.dataset.index) + 1}, ${fruit.name}`
    );

    // Remember the card that was turned over
    turnedCards.push(card);

    // Continue when two cards have been turned over
    if (turnedCards.length === 2) {
        checkMatch();
    }
});
