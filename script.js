let roundPlayerOne = document.getElementById("round-player-one");
let roundPlayerTwo = document.getElementById("round-player-two");
const rollDiceButton = document.getElementById("roll-dice");

/* fonction qui génère un nombre au hasard */
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}


/* modification de l'affichage selon le joueur */
const currentPlayerTurn = (playerTurn) => {
    if(playerTurn === 1) {
        playerOne.style.fontFamily = "lato-light";
        playerTwo.style.fontFamily = "lato-thin";
    }
    else {
        playerOne.style.fontFamily = "lato-thin";
        playerTwo.style.fontFamily = "lato-light";
    }
}

/* définition du tour */
let playerTurn = 1;
const playerOne = document.getElementById("player-one");
const playerTwo = document.getElementById("player-two");
currentPlayerTurn(playerTurn);

/* fonction du dé */
rollDiceButton.addEventListener('click', () => {

    /* fonction d'affichage du dé pour le joueur 1 */ 
    if ( playerTurn === 1) {
        /* récupère un nombre au hasard */ 
        let randomNumber = getRandomNumber(1, 7);
        if (randomNumber !== 1) {

            /* affiche le score du dé actuel pour la première fois */
            if (roundPlayerOne.textContent == 0) {
                roundPlayerOne.textContent = randomNumber;
            }

            /* affiche le score du dé actuel si ce n'est pas la première fois */
            else {
                const roundPlayerOneScore = roundPlayerOne.textContent;
                const newRoundPlayerOneScore = parseInt(roundPlayerOneScore) + randomNumber;
                roundPlayerOne.textContent = newRoundPlayerOneScore;
            }
        }
        else {

            /* annonce la fin de la partie du joueur car il a fait 1 */
            roundPlayerOne.textContent = 0;
            playerTurn = 2;
            currentPlayerTurn(playerTurn);

            /* désactive le bouton pendant 1,5 seconde pour laisser le temps à l'autre joueur de prendre la main */
            rollDiceButton.disabled = true
            setTimeout(() => {
                rollDiceButton.disabled = false;
            }, 1500);
        }
    }

    /* fonction d'affichage du dé pour le joueur 2 */
    else {
        /* récupère un nombre au hasard */
        let randomNumber = getRandomNumber(1, 7);
        if (randomNumber !== 1) {

            /* affiche le total des lancés de dé pour la première fois */
            if (roundPlayerTwo.textContent == 0) {
                roundPlayerTwo.textContent = randomNumber;
            }
            else {

            /* affiche le score du dé actuel si ce n'est pas la première fois */
                const roundPlayerTwoScore = roundPlayerTwo.textContent;
                const newRoundPlayerTwoScore = parseInt(roundPlayerTwoScore) + randomNumber;
                roundPlayerTwo.textContent = newRoundPlayerTwoScore;
            }
        }
        else {

            /* annonce la fin de la partie du joueur car il a fait 1 */
            roundPlayerTwo.textContent = 0;
            playerTurn = 1;
            currentPlayerTurn(playerTurn);

            /* désactive le bouton pendant 1,5 seconde pour laisser le temps à l'autre joueur de prendre la main */
            rollDiceButton.disabled = true
            setTimeout(() => {
                rollDiceButton.disabled = false;
            }, 1500);
        }
    }
})

const holdDiceButton = document.getElementById("hold-dice");
let globalPlayerOne = document.getElementById("global-player-one");
let globalPlayerTwo = document.getElementById("global-player-two");

/* récupère le score du dé du joueur pour le mettre dans le score total et passe la main à l'autre joueur */
holdDiceButton.addEventListener('click', () => {
    if( playerTurn === 1) {

        /* rentre le score pour la première fois dans current */
        if (globalPlayerOne.textContent == 0 && roundPlayerOne.textContent != 0) {
            globalPlayerOne.textContent = roundPlayerOne.textContent;
            roundPlayerOne.textContent = 0;
            playerTurn = 2;
            currentPlayerTurn(playerTurn);
            return;
        }

        /* empêche d'enregistrer le score si le dé n'a pas été lancé */
        if (roundPlayerOne.textContent == 0) {
            playerTurn = 1;
        }

        /* rentre le score dans current si ce n'est pas la première fois */
        else {
            const globalPlayerOneScore = globalPlayerOne.textContent;
            const roundPlayerOneScore = roundPlayerOne.textContent;
            const newglobalPlayerOneScore = parseInt(globalPlayerOneScore) + parseInt(roundPlayerOneScore);
            globalPlayerOne.textContent = newglobalPlayerOneScore;
            roundPlayerOne.textContent = 0;
            playerTurn = 2;
            currentPlayerTurn(playerTurn);
            winGame();
        }
    }

    else {

        /* rentre le score pour la première fois dans current */
        if (globalPlayerTwo.textContent == 0 && roundPlayerTwo != 0) {
            globalPlayerTwo.textContent = roundPlayerTwo.textContent;
            roundPlayerTwo.textContent = 0;
            playerTurn = 1;
            currentPlayerTurn(playerTurn);
            return;
        }

        /* empêche d'enregistrer le score si le dé n'a pas été lancé */
        if (roundPlayerTwo.textContent == 0) {
            playerTurn = 2;
        }

            /* rentre le score dans current si ce n'est pas la première fois */
        else {
            const globalPlayerTwoScore = globalPlayerTwo.textContent;
            const roundPlayerTwoScore = roundPlayerTwo.textContent;
            const newglobalPlayerTwoScore = parseInt(globalPlayerTwoScore) + parseInt(roundPlayerTwoScore);
            globalPlayerTwo.textContent = newglobalPlayerTwoScore;
            roundPlayerTwo.textContent = 0;
            playerTurn = 1;
            currentPlayerTurn(playerTurn);
            winGame();
        }
    }
})

/* désactive le bouton holdDice en cas de victoire */
const winGame = () => {
    if (globalPlayerOne.textContent >= 100 || globalPlayerTwo.textContent >= 100) {
        rollDiceButton.disabled = true;
        holdDiceButton.disabled = true;
        playerOne.style.fontFamily = "lato-thin";
        playerTwo.style.fontFamily = "lato-thin";
    }
};

/* lance une nouvelle game au clic sur le bouton */
const newGameButton = document.getElementById('new-game');
newGameButton.addEventListener('click', () => {
    globalPlayerTwo.textContent = 0;
    globalPlayerOne.textContent = 0;
    roundPlayerOne.textContent = 0;
    roundPlayerTwo.textContent = 0;
    holdDiceButton.disabled = false;
    rollDiceButton.disabled = false;
    currentPlayerTurn(playerTurn);
});

/* design du dé */
const diceCanvas = document.getElementById('dice');
let ctx;

if(diceCanvas.getContext) {
    ctx = diceCanvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.shadowOffsetX = -5;
    ctx.shadowOffsetY = 6;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgb(219,219,219)';
    ctx.fillRect(90, 90, 120, 120);

    /* deux points de gauche */
    ctx.beginPath();
    ctx.fillStyle ='rgb(226, 61, 61)';
    ctx.arc(120, 120, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'rgb(226, 61, 61)';
    ctx.arc(180, 120, 8, 0, Math.PI * 2);
    ctx.fill();

    /* deux points de droite */
    ctx.beginPath();
    ctx.fillStyle = 'rgb(226, 61, 61)';
    ctx.arc(120, 180, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'rgb(226, 61, 61)';
    ctx.arc(180, 180, 8, 0, Math.PI * 2);
    ctx.fill();

    /* point du milieu */
    ctx.beginPath();
    ctx.fillStyle = 'rgb(226, 61, 61)';
    ctx.arc(150, 150, 8, 0, Math.PI * 2);
    ctx.fill();

}
else {
    console.log('Votre navigateur ne peut pas lire l\'image.');
}

