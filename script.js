  /************************************************\
  **                                              **
  ** Description: Proof of Concept                **
  ** Author: Varad Rasalkar                       **
  ** Date: 29-JUL-2024                            **
  ** Template used:                               **
  **                                              **
  ** Modification History:                        **
  **                                              **
  \************************************************/

// image paths
const cardArray = [
    { name: 'hand-sanitizer', img: 'images/sanitizer.png' },
    { name: 'hand-sanitizer', img: 'images/sanitizer.png' },
    { name: 'disinfectant-wipes', img: 'images/disinfectant-wipes.png' },
    { name: 'disinfectant-wipes', img: 'images/disinfectant-wipes.png' },
    { name: 'mask', img: 'images/mask.png' },
    { name: 'mask', img: 'images/mask.png' },
    { name: 'gloves', img: 'images/gloves.png' },
    { name: 'gloves', img: 'images/gloves.png' },
    { name: 'handwash', img: 'images/soap-hands.png' },
    { name: 'handwash', img: 'images/soap-hands.png' },
    { name: 'spray-bottle', img: 'images/spray-bottle.png' },
    { name: 'spray-bottle', img: 'images/spray-bottle.png' },
    { name: 'tissue-box', img: 'images/tissue-box.png' },
    { name: 'tissue-box', img: 'images/tissue-box.png' },
    { name: 'thermometer', img: 'images/thermometer.png' },
    { name: 'thermometer', img: 'images/thermometer.png' }
    //{ name: 'item', img: 'images/item.png' },
    //{ name: 'item', img: 'images/item.png' }
];

let cardsChosen = [];
let cardsChosenId = [];
let cardsWon = [];
let attempts = 15; //set the number of attempts to give player. this can also be 0 if you want to display attempts so far
let cardsMatched = [];
//resetGame();
function shuffleCards() {
    cardArray.sort(() => 0.5 - Math.random());
}

function createBoard() {
    shuffleCards();
    preloadImages(); 
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = ''; 

    cardArray.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-id', index);

        const cardImage = document.createElement('img');
        cardImage.setAttribute('src', 'images/back-card.jpg');
        cardImage.setAttribute('data-name', card.name);
        cardImage.addEventListener('click', flipCard); 
        cardElement.appendChild(cardImage);

        gridContainer.appendChild(cardElement);
    });

    resetGame();
}

function flipCard() {
    let cardElement = this.parentElement; 
    let cardId = cardElement.getAttribute('data-id');
    let cardImage = cardElement.querySelector('img'); 

    if (cardElement.classList.contains('matched') || cardsChosen.length == 2) {
        return;
    }

    if (!cardElement.classList.contains('flipped')) {
        cardElement.classList.add('flipped'); 

        let frontImage = cardArray[cardId].img;
        cardElement.querySelector('img').setAttribute('src', frontImage);

        cardsChosen.push(cardArray[cardId]);
        cardsChosenId.push(cardId);

        if (cardsChosen.length === 2) {
            setTimeout(checkForMatch, 300);
        }
    }
}

function preloadImages() {
    cardArray.forEach(card => {
        const img = new Image();
        img.src = card.img;
    });
}

// Check if the flipped cards match
function checkForMatch() {
    const cards = document.querySelectorAll('.card');
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];

    if (cardsChosen[0].name === cardsChosen[1].name) {
        cards[optionOneId].classList.add('matched');
        cards[optionTwoId].classList.add('matched');
        cardsWon.push(cardsChosen[0], cardsChosen[1]); 
        cardsMatched.push(cardsChosen[0].name); 
        updateMatchedDisplay(); // Update matched count display
    } else {
        setTimeout(() => {
            cards[optionOneId].classList.remove('flipped');
            cards[optionTwoId].classList.remove('flipped');
            cards[optionOneId].querySelector('img').setAttribute('src', 'images/back-card.jpg');
            cards[optionTwoId].querySelector('img').setAttribute('src', 'images/back-card.jpg');
        }, 400); // Delay before flipping back unmatched cards
    }

    cardsChosen = [];
    cardsChosenId = [];
    attempts--;
    //displayMessage(attempts);
    if (attempts < 0) {
        displayMessage('Game Over. You have no attempts left.');
    }
    updateAttemptDisplay();
    if (cardsWon.length === cardArray.length) {
        displayMessage('Congratulations! You found all the matches.');
        displayPromoCode(); 
    } 
    /*else if (attempts >= cardArray.length) {
        displayMessage('Game over. You have exhausted all attempts.');
    }
    */
}

function updateMatchedDisplay() {
    const matchedCountElement = document.getElementById('matched-count');
    matchedCountElement.textContent = `Matches found: ${cardsMatched.length}`;
}

function updateAttemptDisplay() {
    const attemptCountElement = document.getElementById('attempt-count');
    if (attempts < 0) {
        displayMessage("No more attempts");
    }
    else {
        attemptCountElement.textContent = `Attempts left: ${attempts}`;
    }
}

function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
}

// Generate and display a promo code
function displayPromoCode() {
    const promoCode = generatePromoCode();
    const promoMessage = document.createElement('p');
    promoMessage.textContent = `Your promo code: ${promoCode}`;
    const messageElement = document.getElementById('message');
    messageElement.appendChild(promoMessage);
}

// Generate a random promo code (dummy implementation)
function generatePromoCode() {
    // This function can be further developed to directly pull a promo code from a database
    return 'DUMMYCODE'; 
}

// Reset game state
function resetGame() {
    cardsChosen = [];
    cardsChosenId = [];
    cardsWon = [];
    attempts = 15;
    cardsMatched = [];
    updateMatchedDisplay(); 
    updateAttemptDisplay();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('flipped', 'matched');
        card.querySelector('img').setAttribute('src', 'images/back-card.jpg');
        card.addEventListener('click', flipCard); 
    });

    const messageElement = document.getElementById('message');
    messageElement.textContent = '';
}


const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', resetGame);

document.addEventListener('DOMContentLoaded', createBoard);
