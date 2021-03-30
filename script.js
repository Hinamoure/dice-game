/* design du point du joueur en cours de tour */
const firstPlayerPoint = document.getElementById("first-player-point");
const secondPlayerPoint = document.getElementById("second-player-point");
let ctxPoint;

const players = [firstPlayerPoint, secondPlayerPoint];

players.forEach((player) => {
    if (firstPlayerPoint.getContext || secondPlayerPoint.getContext) {

        ctxPoint = player.getContext('2d');
        ctxPoint.beginPath();
        ctxPoint.fillStyle = 'rgb(226, 61, 61)';
        ctxPoint.arc(30, 15, 8, 0, Math.PI * 2);
        ctxPoint.fill();
    }
    else {
        console.log('Votre navigateur ne peut pas lire l\'image.');
    }
});

const roundPlayerOne = document.getElementById("first-player-round");
const roundPlayerTwo = document.getElementById("second-player-round");
const rollDiceButton = document.getElementById("roll-dice");

/* définition du tour */
let playerTurn = 1;
const playerOne = document.getElementById("first-player");
const playerTwo = document.getElementById("second-player");
/* modification de l'affichage selon le joueur */
const currentPlayerTurn = (playerTurn) => {
    playerOne.style.fontFamily = playerTurn === 1 ? "lato-light" : "lato-thin";
    playerTwo.style.fontFamily = playerTurn === 2 ? "lato-light" : "lato-thin";
    firstPlayerPoint.style.visibility = playerTurn === 1 ? "visible" : "hidden";
    secondPlayerPoint.style.visibility = playerTurn === 2 ? "visible" : "hidden";
}

currentPlayerTurn(playerTurn);


/* fonction qui génère un nombre au hasard */
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}
/* fonction du dé */
rollDiceButton.addEventListener('click', () => {

    let randomNumber = getRandomNumber(1, 7);
    pointDiceAppear(randomNumber);
    /* fonction d'affichage du dé pour le joueur 1 */
    if (playerTurn === 1) {
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
const globalPlayerOne = document.getElementById("first-player-global");
const globalPlayerTwo = document.getElementById("second-player-global");

/* récupère le score du dé du joueur pour le mettre dans le score total et passe la main à l'autre joueur */
holdDiceButton.addEventListener('click', () => {
    if (playerTurn === 1) {

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
    if (globalPlayerOne.textContent >= 20 || globalPlayerTwo.textContent >= 20) {
        rollDiceButton.disabled = true;
        holdDiceButton.disabled = true;
        playerOne.style.fontFamily = "lato-thin";
        playerTwo.style.fontFamily = "lato-thin";
    }
};

/* lance une nouvelle partie au clic sur le bouton */
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

if (diceCanvas.getContext) {
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

/* fonction qui efface les points du dé */
const canvasCleared = (ctxDice) => {
    ctxDice.clearRect(90, 90, 120, 120);
}

/* fonction d'affichage des points sur le dé selon le chiffre tiré */
const pointDiceAppear = (randomNumber) => {
    /* points du dé */

    const a = () => {
        ctxDice.moveTo(150, 150);
        ctxDice.arc(150, 150, 8, 0, Math.PI * 2);
    };

    const b = () => {
        ctxDice.moveTo(120, 120);
        ctxDice.arc(120, 120, 8, 0, Math.PI * 2);
        ctxDice.moveTo(180, 180);
        ctxDice.arc(180, 180, 8, 0, Math.PI * 2);
    };

    const c = () => {
        ctxDice.moveTo(180, 120);
        ctxDice.arc(180, 120, 8, 0, Math.PI * 2);
        ctxDice.moveTo(120, 180);
        ctxDice.arc(120, 180, 8, 0, Math.PI * 2);
    };

    const d = () => {
        ctxDice.moveTo(120, 150);
        ctxDice.arc(120, 150, 8, 0, Math.PI * 2);
        ctxDice.moveTo(180, 150);
        ctxDice.arc(180, 150, 8, 0, Math.PI * 2);
    };

    canvasCleared(ctxDice);

    ctxDice.beginPath();
    ctxDice.fillStyle = 'rgb(226, 61, 61)';

    /* construction du dé */
    switch (randomNumber) {
        case 1:
            a();
            break;
        case 2:
            b();
            break;
        case 3:
            a();
            b();
            break;
        case 4:
            b();
            c();
            break;
        case 5:
            a();
            b();
            c();
            break;
        case 6:
            b();
            c();
            d();
            break;
        default:
            console.error('canvas doesn/t worked');
    }
    ctxDice.fill();
}