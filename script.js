// DOM elements
const paddleA = document.getElementById('paddleA');
const paddleB = document.getElementById('paddleB');
const ball = document.getElementById('ball');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const scoreAElement = document.getElementById('scoreA');
const scoreBElement = document.getElementById('scoreB');
const startButtonContainer = document.getElementById('startButtonContainer');
const restartButtonContainer = document.getElementById('restartButtonContainer');

// Game settings
const paddleHeight = 70;
const paddleWidth = 20;
const ballSize = 15;
const boardWidth = 600;
const boardHeight = 400;
const paddleSpeed = 40;
const maxScore = 2;

// Game state
let directionX = 2;
let directionY = 2;
let ballX = boardWidth / 2 - ballSize / 2;
let ballY = boardHeight / 2 - ballSize / 2;
let scoreA = 0;
let scoreB = 0;
let gameInterval = null;
let isPaused = false;
let isMultiplayer = false;




// Sounds
const hitSound = new Audio('hit.wav');

function movePaddleA(event) {
    const key = event.key;
    const paddleAY = paddleA.offsetTop;

    if (key === 'w' && paddleAY > 0) {
        paddleA.style.top = `${paddleAY - paddleSpeed}px`;
    } else if (key === 's' && (paddleAY + paddleHeight) < boardHeight) {
        paddleA.style.top = `${paddleAY + paddleSpeed}px`;
    } else if (isMultiplayer && key === 'ArrowUp' && paddleB.offsetTop > 0) {
        paddleB.style.top = `${paddleB.offsetTop - paddleSpeed}px`;
    } else if (isMultiplayer && key === 'ArrowDown' && (paddleB.offsetTop + paddleHeight) < boardHeight) {
        paddleB.style.top = `${paddleB.offsetTop + paddleSpeed}px`;
    }
}

function movePaddleB() {
    if (!isMultiplayer) {
        if (ballY + ballSize > paddleB.offsetTop + paddleHeight / 2) {
            paddleB.style.top = `${Math.min(boardHeight - paddleHeight, paddleB.offsetTop + paddleSpeed)}px`;
        } else if (ballY < paddleB.offsetTop + paddleHeight / 2) {
            paddleB.style.top = `${Math.max(0, paddleB.offsetTop - paddleSpeed)}px`;
        }
    }
}

function moveBall() {
    ballX += directionX;
    ballY += directionY;

    if (ballY < 0 || ballY + ballSize > boardHeight) {
        directionY *= -1;
    }

    movePaddleB();

    if (ballX <= paddleWidth && ballY + ballSize >= paddleA.offsetTop && ballY <= paddleA.offsetTop + paddleHeight) {
        directionX = Math.abs(directionX);
        hitSound.play();
    } else if (ballX + ballSize >= boardWidth - paddleWidth && ballY + ballSize >= paddleB.offsetTop && ballY <= paddleB.offsetTop + paddleHeight) {
        directionX = -Math.abs(directionX);
        hitSound.play();
    } else if (ballX < 0) {
        scoreB++;
        updateScore();
        resetBall();
        if (scoreB === maxScore) {
            gameOver('Player B');
        }
    } else if (ballX + ballSize > boardWidth) {
        scoreA++;
        updateScore();
        resetBall();
        if (scoreA === maxScore) {
            gameOver('Player A');
        }
    }

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

function resetBall() {
    ballX = boardWidth / 2 - ballSize / 2;
    ballY = boardHeight / 2 - ballSize / 2;
    directionX = 2;
    directionY = 2;
}

function updateScore() {
    scoreAElement.textContent = scoreA;
    scoreBElement.textContent = scoreB;
}

function startGame() {
    startButtonContainer.style.display = 'none';
    gameInterval = setInterval(moveBall, 10);
}

function gameOver(winner) {
    clearInterval(gameInterval);
    alert(`${winner} wins with a score of ${maxScore}!`);
    restartButtonContainer.style.display = 'block';
}

function togglePause() {
    if (isPaused) {
        gameInterval = setInterval(moveBall, 10);
        pauseButton.innerText = 'Pause Game';
        isPaused = false;
    } else {
        clearInterval(gameInterval);
        pauseButton.innerText = 'Resume Game';
        isPaused = true;
    }
}

document.addEventListener('keydown', movePaddleA);
startButton.addEventListener('click', function() {
    isMultiplayer = confirm('Do you want to play with another human? Click OK for Yes, Cancel for No.');
    startGame();
});
pauseButton.addEventListener('click', togglePause);

restartButton.addEventListener('click', function() {
    scoreA = 0;
    scoreB = 0;
    updateScore();
    resetBall();
    restartButtonContainer.style.display = 'none';
    startGame();
});