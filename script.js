document.addEventListener('DOMContentLoaded', () => {
    const gameMenu = document.getElementById('game-menu');
    const blackjackButton = document.getElementById('blackjack-button');
    const plinkoButton = document.getElementById('plinko-button');
    const message = document.getElementById('message');

    const blackjackGame = document.getElementById('blackjack-game');
    const blackjackBalanceDisplay = document.getElementById('blackjack-balance');
    const blackjackBetInput = document.getElementById('blackjack-bet');
    const blackjackDealButton = document.getElementById('blackjack-deal');
    const blackjackPlayerCardsDisplay = document.getElementById('blackjack-player-cards');
    const blackjackPlayerValueDisplay = document.getElementById('blackjack-player-value');
    const blackjackDealerCardsDisplay = document.getElementById('blackjack-dealer-cards');
    const blackjackDealerValueDisplay = document.getElementById('blackjack-dealer-value');
    const blackjackHitButton = document.getElementById('blackjack-hit');
    const blackjackStandButton = document.getElementById('blackjack-stand');
    const blackjackResultDisplay = document.getElementById('blackjack-result');

    let blackjackBalance = 100;
    let blackjackDeck = [];
    let playerHand = [];
    let dealerHand = [];
    let gameActive = false;

    const plinkoGame = document.getElementById('plinko-game');
    const plinkoBalanceDisplay = document.getElementById('plinko-balance');
    const plinkoBetInput = document.getElementById('plinko-bet');
    const plinkoDropButton = document.getElementById('plinko-drop');
    const plinkoResultDisplay = document.getElementById('plinko-result');

    let plinkoBalance = 100;

    // Function to show a specific game and hide the menu
    function showGame(gameSection) {
        gameMenu.classList.add('hidden');
        gameSection.classList.remove('hidden');
    }

    // Blackjack Functions
    function createDeck() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        blackjackDeck = [];
        for (let suit of suits) {
            for (let value of values) {
                blackjackDeck.push({ value: value, suit: suit });
            }
        }
    }

    function shuffleDeck() {
        for (let i = blackjackDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [blackjackDeck[i], blackjackDeck[j]] = [blackjackDeck[j], blackjackDeck[i]];
        }
    }

    function dealCard() {
        return blackjackDeck.pop();
    }

    function calculateHandValue(hand) {
        let hasAce = false;
        let total = 0;
        for (let card of hand) {
            let cardValue = parseInt(card.value);
            if (isNaN(cardValue)) {
                if (card.value === 'A') {
                    hasAce = true;
                    cardValue = 11;
                } else {
                    cardValue = 10;
                }
            }
            total += cardValue;
        }
        if (hasAce && total > 21) {
            total -= 10; // Convert Ace from 11 to 1 if busting
        }
        return total;
    }

    function displayHand(hand, element) {
        element.textContent = hand.map(card => `${card.value} ${card.suit}`).join(', ');
    }

    function blackjackDeal() {
        if (gameActive) return;
        const betAmount = parseInt(blackjackBetInput.value);
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > blackjackBalance) {
            message.textContent = 'Invalid bet amount.';
            return;
        }

        gameActive = true;
        blackjackBalance -= betAmount;
        blackjackBalanceDisplay.textContent = blackjackBalance;
        message.textContent = '';

        createDeck();
        shuffleDeck();
        playerHand = [dealCard(), dealCard()];
        dealerHand = [dealCard(), dealCard()];

        displayHand(playerHand, blackjackPlayerCardsDisplay);
        displayHand(dealerHand, blackjackDealerCardsDisplay);

        const playerValue = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue(dealerHand);

        blackjackPlayerValueDisplay.textContent = `Value: ${playerValue}`;
        blackjackDealerValueDisplay.textContent = `Value: ${dealerValue}`;

        if (playerValue === 21) {
            endBlackjackGame('Blackjack!');
        } else {
            blackjackHitButton.disabled = false;
            blackjackStandButton.disabled = false;
        }
    }

    function endBlackjackGame(result) {
        gameActive = false;
        blackjackHitButton.disabled = true;
        blackjackStandButton.disabled = true;
        blackjackResultDisplay.textContent = result;

        const playerValue = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue(dealerHand);
        const betAmount = parseInt(blackjackBetInput.value);

        if (result === 'Blackjack!' || (result === 'You win!' && playerValue <= 21 && (dealerValue > 21 || playerValue > dealerValue))) {
            blackjackBalance += betAmount * 2;
        } else if (result === 'Push!') {
            blackjackBalance += betAmount;
        }
        blackjackBalanceDisplay.textContent = blackjackBalance;
    }

    function blackjackHit() {
        playerHand.push(dealCard());
        displayHand(playerHand, blackjackPlayerCardsDisplay);
        const playerValue = calculateHandValue(playerHand);
        blackjackPlayerValueDisplay.textContent = `Value: ${playerValue}`;

        if (playerValue > 21) {
            endBlackjackGame('You bust!');
        }
    }

    function blackjackStand() {
        blackjackHitButton.disabled = true;
        blackjackStandButton.disabled = true;

        let dealerValue = calculateHandValue(dealerHand);
        let playerValue = calculateHandValue(playerHand);

        while (dealerValue < 17) {
            dealerHand.push(dealCard());
            displayHand(dealerHand, blackjackDealerCardsDisplay);
            dealerValue = calculateHandValue(dealerHand);
            blackjackDealerValueDisplay.textContent = `Value: ${dealerValue}`;
        }

        if (dealerValue > 21) {
            endBlackjackGame('You win!');
        } else if (dealerValue > playerValue) {
            endBlackjackGame('You lose!');
        } else if (dealerValue === playerValue) {
            endBlackjackGame('Push!');
        } else {
            endBlackjackGame('You win!');
        }
    }

    // Plinko Functions
    function plinkoDrop() {
        const betAmount = parseInt(plinkoBetInput.value);
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > plinkoBalance) {
            message.textContent = 'Invalid Plinko bet amount.';
            return;
        }

        plinkoBalance -= betAmount;
        plinkoBalanceDisplay.textContent = plinkoBalance;

        // Simplified Plinko - generate a random multiplier (e.g., based on a distribution)
        const multipliers = [0, 0.5, 1, 1.5, 2]; // Possible multipliers
        const randomIndex = Math.floor(Math.random() * multipliers.length);
        const multiplier = multipliers[randomIndex];
        const winnings = betAmount * multiplier;

        plinkoBalance += winnings;
        plinkoBalanceDisplay.textContent = plinkoBalance;

        plinkoResultDisplay.textContent = `Multiplier: ${multiplier}x, Winnings: $${winnings}`;
    }

    // Event Listeners
    blackjackButton.addEventListener('click', () => showGame(blackjackGame));
    plinkoButton.addEventListener('click', () => showGame(plinkoGame));

    blackjackDealButton.addEventListener('click', blackjackDeal);
    blackjackHitButton.addEventListener('click', blackjackHit);
    blackjackStandButton.addEventListener('click', blackjackStand);

    plinkoDropButton.addEventListener('click', plinkoDrop);
    blackjackBalanceDisplay.textContent = blackjackBalance;
    plinkoBalanceDisplay.textContent = plinkoBalance;

});
