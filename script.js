const paddleA = document.getElementById('paddleA');
const paddleB = document.getElementById('paddleB');
const ball = document.getElementById('ball');

let paddleHeight = 70;
let paddleWidth = 20;
let ballSize = 15;
let boardWidth = 600;
let boardHeight = 400;
let directionX = 2;
let directionY = 2;
let paddleSpeed = 40;
let ballX = boardWidth / 2 - ballSize / 2;
let ballY = boardHeight / 2 - ballSize / 2;

function movePaddles(event) {
    const key = event.key;
    const paddleAY = paddleA.offsetTop;

    // Move paddle A with arrow keys
    if (key === 'ArrowUp' && paddleAY > 0) {
        paddleA.style.top = `${paddleAY - paddleSpeed}px`;
    } else if (key === 'ArrowDown' && (paddleAY + paddleHeight) < boardHeight) {
        paddleA.style.top = `${paddleAY + paddleSpeed}px`;
    }
}

function moveBall() {
    // ... existing ball movement logic ...

    // Move the computer paddle (paddleB) to follow the ball
    if (ballY + ballSize > paddleB.offsetTop + paddleHeight / 2) {
        paddleB.style.top = `${Math.min(boardHeight - paddleHeight, paddleB.offsetTop + paddleSpeed)}px`;
    } else if (ballY < paddleB.offsetTop + paddleHeight / 2) {
        paddleB.style.top = `${Math.max(0, paddleB.offsetTop - paddleSpeed)}px`;
    }

    // ... existing ball position updating logic ...
}


    // Paddle collision logic
    // If the ball hits the left paddle
    if (ballX <= paddleWidth && ballY + ballSize >= paddleA.offsetTop && ballY <= paddleA.offsetTop + paddleHeight) {
        directionX = Math.abs(directionX); // Change the horizontal direction to positive, moving right
    } 
    // If the ball hits the right paddle
    else if (ballX + ballSize >= boardWidth - paddleWidth && ballY + ballSize >= paddleB.offsetTop && ballY <= paddleB.offsetTop + paddleHeight) {
        directionX = -Math.abs(directionX); // Change the horizontal direction to negative, moving left
    }
    // If the ball goes beyond the left edge (missed by left paddle)
    else if (ballX < 0) {
        // You can add logic to handle the scoring here if the right player scores
        resetBall(); // Reset the ball to the center or serve from the left paddle
    }
    // If the ball goes beyond the right edge (missed by right paddle)
    else if (ballX + ballSize > boardWidth) {
        // You can add logic to handle the scoring here if the left player scores
        resetBall(); // Reset the ball to the center or serve from the right paddle
    }

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;


function resetBall() {
    // Assuming player B missed the ball
    scoreA++;
    updateScore();
    // ... rest of the resetBall logic ...
}



function updateScore() {
    document.getElementById('scoreA').textContent = scoreA;
    document.getElementById('scoreB').textContent = scoreB;
}

let scoreA = 0;
let scoreB = 0;


// Start the game loop
setInterval(moveBall, 10);


// Listen for keydown events for paddle movement
document.addEventListener('keydown', movePaddles);
