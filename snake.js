// Game canvas setup
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Game settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let speed = 7;

// Snake initial properties
let snake = [
    { x: 10, y: 10 }
];
let dx = 0;
let dy = 0;
let score = 0;

// Food initial position
let food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
    color: getRandomColor()
};

// Game loop
function gameLoop() {
    changeSnakePosition();
    if (isGameOver()) {
        displayGameOver();
        return;
    }
    clearScreen();
    checkFoodCollision();
    drawFood();
    drawSnake();
    updateScore();
    
    // Increase speed as score increases
    speed = 7 + Math.floor(score / 5);
    
    setTimeout(gameLoop, 1000 / speed);
}

// Move the snake
function changeSnakePosition() {
    // Create new head
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    
    // Remove tail if no food was eaten
    if (!(food.x === snake[0].x && food.y === snake[0].y)) {
        snake.pop();
    }
}

// Check if game is over
function isGameOver() {
    // Hit wall
    if (snake[0].x < 0 || snake[0].x >= tileCount || 
        snake[0].y < 0 || snake[0].y >= tileCount) {
        return true;
    }
    
    // Hit self
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    
    return false;
}

// Display game over message
function displayGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText('Game Over!', canvas.width / 6, canvas.height / 2);
    
    ctx.font = '20px Arial';
    ctx.fillText('Press Space to Restart', canvas.width / 4, canvas.height / 2 + 40);
}

// Clear the screen
function clearScreen() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Check if snake eats food
function checkFoodCollision() {
    if (food.x === snake[0].x && food.y === snake[0].y) {
        // Place new food
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        food.color = getRandomColor();
        
        // Increase score
        score++;
    }
}

// Draw food
function drawFood() {
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Draw snake
function drawSnake() {
    snake.forEach((part, index) => {
        // Create gradient color for snake
        const hue = (index * 10) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
    });
}

// Update score display
function updateScore() {
    scoreElement.textContent = score;
}

// Generate random color for food
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    // Prevent arrow keys from scrolling the page
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
    }
    
    // Change direction based on key press
    switch(event.key) {
        case 'ArrowUp':
            if (dy !== 1) { // Prevent moving directly opposite direction
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
        case ' ':
            // Restart game if game over
            if (isGameOver()) {
                snake = [{ x: 10, y: 10 }];
                dx = 0;
                dy = 0;
                score = 0;
                food = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount),
                    color: getRandomColor()
                };
                gameLoop();
            }
            break;
    }
});

// Start the game
gameLoop();
