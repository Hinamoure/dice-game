/* design du point du joueur en cours de tour */
const playerPointOne = document.getElementById("current-player-one-point");
const playerPointTwo = document.getElementById("current-player-two-point");
let ctxPoint;

if (playerPointOne.getContext) {
    ctxPoint = playerPointOne.getContext('2d');
    ctxPoint.beginPath();
    ctxPoint.fillStyle = 'rgb(226, 61, 61)';
    ctxPoint.arc(30, 15, 8, 0, Math.PI * 2);
    ctxPoint.fill();
}
else {
    console.log('Votre navigateur ne peut pas lire l\'image.');
}

if (playerPointTwo.getContext) {
    ctxPoint = playerPointTwo.getContext('2d');
    ctxPoint.beginPath();
    ctxPoint.fillStyle = 'rgb(226, 61, 61)';
    ctxPoint.arc(20, 15, 8, 0, Math.PI * 2);
    ctxPoint.fill();
}
else {
    console.log('Votre navigateur ne peut pas lire l\'image.');
}

let roundPlayerOne = document.getElementById("round-player-one");
let roundPlayerTwo = document.getElementById("round-player-two");
const rollDiceButton = document.getElementById("roll-dice");

/* fonction qui génère un nombre au hasard */
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

/* définition du tour */
let playerTurn = 1;
const playerOne = document.getElementById("player-one");
const playerTwo = document.getElementById("player-two");

/* modification de l'affichage selon le joueur */
const currentPlayerTurn = (playerTurn) => {
    if(playerTurn === 1) {
        playerOne.style.fontFamily = "lato-light";
        playerTwo.style.fontFamily = "lato-thin";
        playerPointOne.style.visibility = "visible";
        playerPointTwo.style.visibility = "hidden";
    }
    else {
        playerOne.style.fontFamily = "lato-thin";
        playerTwo.style.fontFamily = "lato-light";
        playerPointOne.style.visibility = "hidden";
        playerPointTwo.style.visibility = "visible";
    }
}

currentPlayerTurn(playerTurn);

/* fonction du dé */
rollDiceButton.addEventListener('click', () => {

    let randomNumber = getRandomNumber(1, 7);
    pointDiceAppear(randomNumber);
    /* fonction d'affichage du dé pour le joueur 1 */ 
    if ( playerTurn === 1) {
        /* récupère un nombre au hasard */ 
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
        /* fonction d'affichage du dé pour le joueur 2 */
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
            canvasCleared(ctxDice);
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
            canvasCleared(ctxDice);
        }
    }

    else {

        /* rentre le score pour la première fois dans current */
        if (globalPlayerTwo.textContent == 0 && roundPlayerTwo.textContent != 0) {
            globalPlayerTwo.textContent = roundPlayerTwo.textContent;
            roundPlayerTwo.textContent = 0;
            playerTurn = 1;
            currentPlayerTurn(playerTurn);
            canvasCleared(ctxDice);
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
            canvasCleared(ctxDice);
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

/* background du dé */
const diceCanvas = document.getElementById('dice');

let ctxDice;

if(diceCanvas.getContext) {
    ctxDice = diceCanvas.getContext('2d');
    ctxDice.beginPath();
    ctxDice.fillStyle = 'white';
    ctxDice.shadowOffsetX = -5;
    ctxDice.shadowOffsetY = 6;
    ctxDice.shadowBlur = 15;
    ctxDice.shadowColor = 'rgb(219,219,219)';
    ctxDice.fillRect(90, 90, 120, 120);
}
else {
    console.log('Votre navigateur ne peut pas lire l\'image.');
}

/* fonctions des points du dé */
const diceOnePoint = (ctxDice) => {
    ctxDice.beginPath();
    ctxDice.fillStyle = 'rgb(226, 61, 61)';
    ctxDice.arc(150, 150, 8, 0, Math.PI * 2);
    ctxDice.fill();
}

const diceTwoPoint = (ctxDice) => {
    ctxDice.beginPath();
    ctxDice.fillStyle = 'rgb(226, 61, 61)';
    ctxDice.arc(120, 180, 8, 0, Math.PI * 2);
    ctxDice.fill();

    ctxDice.beginPath();
    ctxDice.fillStyle = 'rgb(226, 61, 61)';
    ctxDice.arc(180, 120, 8, 0, Math.PI * 2);
    ctxDice.fill();
}

const diceFourPoint = (ctxDice) => {
    ctxDice.beginPath();
    ctxDice.fillStyle = 'rgb(226, 61, 61)';
    ctxDice.arc(120, 120, 8, 0, Math.PI * 2);
    ctxDice.fill();

    ctxDice.beginPath();
    ctxDice.fillStyle = 'rgb(226, 61, 61)';
    ctxDice.arc(180, 120, 8, 0, Math.PI * 2);
    ctxDice.fill();

    ctxDice.beginPath();
    ctxDice.fillStyle = 'rgb(226, 61, 61)';
    ctxDice.arc(120, 180, 8, 0, Math.PI * 2);
    ctxDice.fill();

    ctxDice.beginPath();
    ctxDice.fillStyle = 'rgb(226, 61, 61)';
    ctxDice.arc(180, 180, 8, 0, Math.PI * 2);
    ctxDice.fill();
}
/* fonction qui efface les points du dé */
const canvasCleared = (ctxDice) => {
    ctxDice.clearRect(90, 90, 120, 120);
}

/* fonction d'affichage des points sur le dé selon le chiffre tiré */
const pointDiceAppear = (randomNumber) => {
    canvasCleared(ctxDice);
    switch(randomNumber) {
        case 1:
            /* point du milieu */
            diceOnePoint(ctxDice);
            break;
        case 2:
            diceTwoPoint(ctxDice);
            break;
        case 3:
            diceOnePoint(ctxDice);
            diceTwoPoint(ctxDice);
            break;
        case 4:
            diceFourPoint(ctxDice);
            break;
        case 5:
            diceOnePoint(ctxDice);
            diceFourPoint(ctxDice);
            break;
        case 6:
            diceFourPoint(ctxDice);

            /* deux points du milieu */
            ctxDice.beginPath();
            ctxDice.fillStyle = 'rgb(226, 61, 61)';
            ctxDice.arc(120, 150, 8, 0, Math.PI * 2);
            ctxDice.fill();

            ctxDice.beginPath();
            ctxDice.fillStyle = 'rgb(226, 61, 61)';
            ctxDice.arc(180, 150, 8, 0, Math.PI * 2);
            ctxDice.fill();
            break;
        default:
            console.error('canvas doesn/t worked');
    }
}