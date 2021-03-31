class Player {
    constructor(name) {
        this.name = name;
        this.roundScore = 0;
        this.globalScore = 0;
        this.turn = 0;
    }
    playerDataReboot = () => {
        this.roundScore = 0;
        this.globalScore = 0;
        this. turn = 0;
    }
}

class Party {
    constructor() {
        this.turn = 1;
        this.winScore = 20;
    }
    partyDataReboot = () => {
        this.turn = 1;
    }
}

const party = new Party();
const firstPlayer = new Player('Player1');
const secondPlayer = new Player('Player2');

const firstPlayerName = document.getElementById("first-player");
const secondPlayerName = document.getElementById("second-player");

/* design du point du joueur en cours de tour */
const firstPlayerPoint = document.getElementById("first-player-point");
const secondPlayerPoint = document.getElementById("second-player-point");

if (firstPlayerPoint.getContext || secondPlayerPoint.getContext) {
    const players = [firstPlayerPoint, secondPlayerPoint];

    players.forEach((player) => {
        const ctxPoint = player.getContext('2d');
        ctxPoint.beginPath();
        ctxPoint.fillStyle = 'rgb(226, 61, 61)';
        ctxPoint.arc(30, 15, 8, 0, Math.PI * 2);
        ctxPoint.fill();
    });
}
else {
    console.log('Votre navigateur ne peut pas lire l\'image.');
}

/* fonction de modification du style selon le joueur */
const currentPlayerStyle = (currentPlayer) => {
    const playerActive = !currentPlayer || firstPlayer.turn < party.turn;

    firstPlayerName.style.fontFamily = playerActive ? "lato-light" : "lato-thin";
    firstPlayerPoint.style.visibility = playerActive ? "visible" : "hidden";
    secondPlayerName.style.fontFamily = !playerActive ? "lato-light" : "lato-thin";
    secondPlayerPoint.style.visibility = !playerActive ? "visible" : "hidden";
};
currentPlayerStyle();

/* fonction pour tirer un nombre au hasard */
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

const rollDiceButton = document.getElementById("roll-dice");
const firstPlayerRound = document.getElementById('first-player-round');
const secondPlayerRound = document.getElementById('second-player-round');

const insertRoundScoreData = (randomNumber, currentPlayer) => {
    if (currentPlayer.name === firstPlayer.name) {
        firstPlayerRound.textContent = randomNumber === 1 ? 0 : parseInt(firstPlayerRound.textContent) + randomNumber;
    }
    else {
        secondPlayerRound.textContent = randomNumber === 1 ? 0 : parseInt(secondPlayerRound.textContent) + randomNumber;
    }
};

/* détermine celui qui doit jouer */
const currentPlayerTurn = () => {
    const currentPlayer = (firstPlayer.turn < party.turn) ? firstPlayer : secondPlayer;
    return currentPlayer;
};

/* change le tour lorsque le joueur perd */
const changePlayer = (currentPlayer) => {
    currentPlayer.turn++;
    currentPlayer.roundScore = 0;
    if (firstPlayer.turn === secondPlayer.turn) {
        party.turn++;
    }
    currentPlayerStyle(currentPlayer);
};

/* fonction qui lance le dé */
rollDiceButton.addEventListener('click', () => {

    const currentPlayer = currentPlayerTurn();
    /** score du joueur */
    const randomNumber = getRandomNumber(1, 7);
    currentPlayer.roundScore += randomNumber;
    /** affichage du dé */
    pointDiceAppear(randomNumber);
    /** changement de joueur si il fait 1 */
    if (randomNumber === 1) {
        changePlayer(currentPlayer);
    }
    /** insère le score du round du joueur */
    insertRoundScoreData(randomNumber, currentPlayer);
    playerCanSaveRound();
    if (randomNumber + currentPlayer.globalScore >= party.winScore) {
        winGame(currentPlayer);
    }
    
});

/** sauvegarde le score du joueur et passe au joueur suivant */
const holdDiceButton = document.getElementById("hold-dice");
const firstPlayerGlobal = document.getElementById("first-player-global");
const secondPlayerGlobal = document.getElementById("second-player-global");

holdDiceButton.addEventListener('click', () => {

    const currentPlayer = currentPlayerTurn();
    currentPlayer.globalScore += currentPlayer.roundScore;
    currentPlayer.roundScore = 0;

    if (currentPlayer.name === firstPlayer.name) {
        firstPlayerGlobal.textContent = currentPlayer.globalScore;
    }
    else {
        secondPlayerGlobal.textContent = currentPlayer.globalScore;
    }
    
    firstPlayerRound.textContent = 0;
    secondPlayerRound.textContent = 0;

    changePlayer(currentPlayer);
    playerCanSaveRound();
    if(firstPlayerGlobal.textContent >= party.winScore || secondPlayerGlobal.textContent >= party.winScore) {
    winGame(currentPlayer);
    }
    canvasCleared(ctxDice);

});

/** active le bouton hold si le joueur a lancé le dé */
const playerCanSaveRound = () => {
    const currentPlayer = currentPlayerTurn();
    holdDiceButton.disabled = currentPlayer.roundScore != 0 ? false : true;
};

/* désactive les boutons en cas de victoire */
const winGame = (currentPlayer) => {
        rollDiceButton.disabled = true;
        holdDiceButton.disabled = true;
        firstPlayerName.style.fontFamily = "lato-thin";
        firstPlayerPoint.style.visibility = "hidden";
        secondPlayerName.style.fontFamily = "lato-thin";
        secondPlayerPoint.style.visibility = "hidden";
        setTimeout(alert, 500, `${currentPlayer.name} a gagné`);
    };

/** Lance une nouvelle partie, remet tous les scores à zéro */
const newGameButton = document.getElementById('new-game');
newGameButton.addEventListener('click', () => {
    firstPlayerGlobal.textContent = 0;
    secondPlayerGlobal.textContent = 0;
    firstPlayerRound.textContent = 0;
    secondPlayerRound.textContent = 0;
    holdDiceButton.disabled = false;
    rollDiceButton.disabled = false;
    firstPlayer.playerDataReboot();
    secondPlayer.playerDataReboot();
    party.partyDataReboot();
    canvasCleared(ctxDice);
    console.log(firstPlayer)
});

/** DESIGN DU DÉ ----------------*/
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
    ctxDice.shadowColor = 'rgb(219, 219, 219)';
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
