/**
 * Colorful Snake Game
 * A modern implementation of the classic Snake game with visual enhancements
 * and improved game features.
 */

// Game state management
const GameState = {
    START: 'start',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

// Game class to manage the snake game
class SnakeGame {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        
        // Game settings
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        this.baseSpeed = 7;
        this.speed = this.baseSpeed;
        
        // Game state
        this.currentState = GameState.START;
        this.score = 0;
        this.highScore = this.getHighScore();
        
        // Snake properties
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 0;
        this.dy = 0;
        
        // Food properties
        this.food = this.generateFood();
        
        // Special effects
        this.particles = [];
        this.gridVisible = true;
        
        // Animation frame ID for game loop
        this.animationFrameId = null;
        
        // Bind event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Start the game
        this.showStartScreen();
    }
    
    /**
     * Initialize event listeners for keyboard and touch controls
     */
    initEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown);
        this.canvas.addEventListener('touchstart', this.handleTouchStart);
        this.canvas.addEventListener('touchmove', this.handleTouchMove);
        
        // Add event listeners for UI buttons
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('pauseButton').addEventListener('click', () => this.togglePause());
        document.getElementById('restartButton').addEventListener('click', () => this.restartGame());
    }
    
    /**
     * Handle keyboard input
     */
    handleKeyDown(event) {
        // Prevent default behavior for game control keys
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'p', 'P', 'Escape'].includes(event.key)) {
            event.preventDefault();
        }
        
        // Handle different keys based on game state
        switch(this.currentState) {
            case GameState.START:
                if(event.key === ' ' || event.key === 'Enter') {
                    this.startGame();
                }
                break;
                
            case GameState.PLAYING:
                this.handlePlayingStateKeys(event);
                break;
                
            case GameState.PAUSED:
                if(event.key === 'p' || event.key === 'P' || event.key === 'Escape') {
                    this.togglePause();
                }
                break;
                
            case GameState.GAME_OVER:
                if(event.key === ' ' || event.key === 'Enter') {
                    this.restartGame();
                }
                break;
        }
    }
    
    /**
     * Handle keys during gameplay
     */
    handlePlayingStateKeys(event) {
        switch(event.key) {
            case 'ArrowUp':
                if (this.dy !== 1) { // Prevent moving directly opposite direction
                    this.dx = 0;
                    this.dy = -1;
                }
                break;
            case 'ArrowDown':
                if (this.dy !== -1) {
                    this.dx = 0;
                    this.dy = 1;
                }
                break;
            case 'ArrowLeft':
                if (this.dx !== 1) {
                    this.dx = -1;
                    this.dy = 0;
                }
                break;
            case 'ArrowRight':
                if (this.dx !== -1) {
                    this.dx = 1;
                    this.dy = 0;
                }
                break;
            case 'p':
            case 'P':
            case 'Escape':
                this.togglePause();
                break;
            case 'g':
            case 'G':
                this.gridVisible = !this.gridVisible;
                break;
        }
    }
    
    /**
     * Handle touch start for mobile controls
     */
    handleTouchStart(event) {
        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
        event.preventDefault();
    }
    
    /**
     * Handle touch move for mobile controls
     */
    handleTouchMove(event) {
        if (!this.touchStartX || !this.touchStartY) return;
        
        const touchEndX = event.touches[0].clientX;
        const touchEndY = event.touches[0].clientY;
        
        const diffX = this.touchStartX - touchEndX;
        const diffY = this.touchStartY - touchEndY;
        
        // Determine swipe direction based on the greatest difference
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 0 && this.dx !== 1) {
                // Swipe left
                this.dx = -1;
                this.dy = 0;
            } else if (diffX < 0 && this.dx !== -1) {
                // Swipe right
                this.dx = 1;
                this.dy = 0;
            }
        } else {
            // Vertical swipe
            if (diffY > 0 && this.dy !== 1) {
                // Swipe up
                this.dx = 0;
                this.dy = -1;
            } else if (diffY < 0 && this.dy !== -1) {
                // Swipe down
                this.dx = 0;
                this.dy = 1;
            }
        }
        
        // Reset touch start position
        this.touchStartX = touchEndX;
        this.touchStartY = touchEndY;
        
        event.preventDefault();
    }
    
    /**
     * Show the start screen
     */
    showStartScreen() {
        this.clearScreen();
        
        // Draw title
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Snake Game', this.canvas.width / 2, this.canvas.height / 3);
        
        // Draw instructions
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Press ENTER or click START to begin', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Use arrow keys or swipe to control the snake', this.canvas.width / 2, this.canvas.height / 2 + 30);
        this.ctx.fillText('Press P to pause the game', this.canvas.width / 2, this.canvas.height / 2 + 60);
        this.ctx.fillText('Press G to toggle grid', this.canvas.width / 2, this.canvas.height / 2 + 90);
        
        // Show high score
        this.updateHighScoreDisplay();
        
        // Show UI elements
        document.getElementById('startScreen').style.display = 'flex';
        document.getElementById('gameControls').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
    }
    
    /**
     * Start the game
     */
    startGame() {
        this.currentState = GameState.PLAYING;
        
        // Hide start screen, show game controls
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameControls').style.display = 'flex';
        document.getElementById('gameOverScreen').style.display = 'none';
        
        // Start countdown
        this.showCountdown(() => {
            // Start game loop after countdown
            this.gameLoop();
        });
    }
    
    /**
     * Show countdown before starting the game
     */
    showCountdown(callback) {
        let count = 3;
        
        const countdownInterval = setInterval(() => {
            this.clearScreen();
            
            // Draw countdown number
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 100px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(count, this.canvas.width / 2, this.canvas.height / 2);
            
            count--;
            
            if (count < 0) {
                clearInterval(countdownInterval);
                callback();
            }
        }, 1000);
    }
    
    /**
     * Toggle pause state
     */
    togglePause() {
        if (this.currentState === GameState.PLAYING) {
            this.currentState = GameState.PAUSED;
            cancelAnimationFrame(this.animationFrameId);
            this.showPauseScreen();
        } else if (this.currentState === GameState.PAUSED) {
            this.currentState = GameState.PLAYING;
            this.gameLoop();
        }
    }
    
    /**
     * Show pause screen
     */
    showPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Press P to resume', this.canvas.width / 2, this.canvas.height / 2 + 40);
    }
    
    /**
     * Restart the game
     */
    restartGame() {
        // Reset game state
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.speed = this.baseSpeed;
        this.food = this.generateFood();
        this.particles = [];
        
        // Update score display
        this.updateScoreDisplay();
        
        // Start the game
        this.startGame();
    }
    
    /**
     * Main game loop
     */
    gameLoop() {
        if (this.currentState !== GameState.PLAYING) return;
        
        this.moveSnake();
        
        if (this.checkCollision()) {
            this.handleGameOver();
            return;
        }
        
        this.clearScreen();
        this.checkFoodCollision();
        this.updateParticles();
        
        if (this.gridVisible) {
            this.drawGrid();
        }
        
        this.drawFood();
        this.drawSnake();
        
        // Request next animation frame
        this.animationFrameId = requestAnimationFrame(() => {
            setTimeout(() => this.gameLoop(), 1000 / this.speed);
        });
    }
    
    /**
     * Move the snake
     */
    moveSnake() {
        // Create new head
        const head = { 
            x: this.snake[0].x + this.dx, 
            y: this.snake[0].y + this.dy 
        };
        
        // Add new head to the beginning of snake array
        this.snake.unshift(head);
        
        // Remove tail if no food was eaten
        if (!(this.food.x === this.snake[0].x && this.food.y === this.snake[0].y)) {
            this.snake.pop();
        }
    }
    
    /**
     * Check for collisions with walls or self
     */
    checkCollision() {
        const head = this.snake[0];
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        // Check self collision (skip the head)
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Handle game over state
     */
    handleGameOver() {
        this.currentState = GameState.GAME_OVER;
        
        // Check for high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore(this.highScore);
        }
        
        // Update high score display
        this.updateHighScoreDisplay();
        
        // Show game over screen
        this.showGameOverScreen();
        
        // Show game over UI
        document.getElementById('gameControls').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'flex';
    }
    
    /**
     * Show game over screen
     */
    showGameOverScreen() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Game over text
        this.ctx.fillStyle = 'red';
        this.ctx.font = 'bold 50px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 3);
        
        // Final score
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        
        // High score
        if (this.score === this.highScore && this.score > 0) {
            this.ctx.fillStyle = '#FFD700'; // Gold color
            this.ctx.fillText('NEW HIGH SCORE!', this.canvas.width / 2, this.canvas.height / 2 + 40);
        } else {
            this.ctx.fillText(`High Score: ${this.highScore}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
        
        // Restart instructions
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Press ENTER or click RESTART to play again', this.canvas.width / 2, this.canvas.height / 2 + 80);
    }
    
    /**
     * Clear the screen
     */
    clearScreen() {
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Draw grid lines
     */
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Check if snake eats food
     */
    checkFoodCollision() {
        if (this.food.x === this.snake[0].x && this.food.y === this.snake[0].y) {
            // Create particles at food location
            this.createFoodParticles();
            
            // Place new food
            this.food = this.generateFood();
            
            // Increase score
            this.score++;
            this.updateScoreDisplay();
            
            // Increase speed as score increases
            this.speed = this.baseSpeed + Math.floor(this.score / 5);
        }
    }
    
    /**
     * Generate new food at random position
     */
    generateFood() {
        let newFood;
        let foodOnSnake;
        
        // Make sure food doesn't appear on snake
        do {
            foodOnSnake = false;
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount),
                color: this.getRandomColor(),
                size: 1 // Normal size
            };
            
            // Check if food is on snake
            for (let i = 0; i < this.snake.length; i++) {
                if (this.snake[i].x === newFood.x && this.snake[i].y === newFood.y) {
                    foodOnSnake = true;
                    break;
                }
            }
        } while (foodOnSnake);
        
        return newFood;
    }
    
    /**
     * Create particles when food is eaten
     */
    createFoodParticles() {
        const foodX = this.food.x * this.gridSize + this.gridSize / 2;
        const foodY = this.food.y * this.gridSize + this.gridSize / 2;
        const foodColor = this.food.color;
        
        // Create multiple particles
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2; // Random angle
            const speed = 1 + Math.random() * 3; // Random speed
            
            this.particles.push({
                x: foodX,
                y: foodY,
                radius: 1 + Math.random() * 3,
                color: foodColor,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                life: 30 + Math.random() * 20
            });
        }
    }
    
    /**
     * Update and draw particles
     */
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Update life and alpha
            p.life--;
            p.alpha = p.life / 50;
            
            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // Draw particle
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }
    }
    
    /**
     * Draw food
     */
    drawFood() {
        const x = this.food.x * this.gridSize;
        const y = this.food.y * this.gridSize;
        const size = this.gridSize * this.food.size;
        
        // Create glow effect
        const glow = this.ctx.createRadialGradient(
            x + this.gridSize / 2, 
            y + this.gridSize / 2, 
            0, 
            x + this.gridSize / 2, 
            y + this.gridSize / 2, 
            this.gridSize
        );
        
        glow.addColorStop(0, this.food.color);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        
        // Draw glow
        this.ctx.fillStyle = glow;
        this.ctx.fillRect(x - 5, y - 5, size + 10, size + 10);
        
        // Draw food
        this.ctx.fillStyle = this.food.color;
        this.ctx.fillRect(x, y, size, size);
        
        // Add shine effect
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(x + size / 4, y + size / 4, size / 6, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Draw snake with gradient colors and effects
     */
    drawSnake() {
        this.snake.forEach((part, index) => {
            const x = part.x * this.gridSize;
            const y = part.y * this.gridSize;
            
            // Create gradient color for snake
            const hue = (index * 10) % 360;
            const lightness = 50 + Math.sin(Date.now() / 200) * 10; // Pulsating effect
            
            // Draw snake part with rounded corners for head
            this.ctx.fillStyle = `hsl(${hue}, 100%, ${lightness}%)`;
            
            if (index === 0) {
                // Draw head with eyes
                this.ctx.fillRect(x, y, this.gridSize - 1, this.gridSize - 1);
                
                // Draw eyes
                this.ctx.fillStyle = 'white';
                
                // Position eyes based on direction
                if (this.dx === 1) { // Right
                    this.ctx.fillRect(x + this.gridSize - 7, y + 4, 4, 4);
                    this.ctx.fillRect(x + this.gridSize - 7, y + this.gridSize - 8, 4, 4);
                } else if (this.dx === -1) { // Left
                    this.ctx.fillRect(x + 3, y + 4, 4, 4);
                    this.ctx.fillRect(x + 3, y + this.gridSize - 8, 4, 4);
                } else if (this.dy === -1) { // Up
                    this.ctx.fillRect(x + 4, y + 3, 4, 4);
                    this.ctx.fillRect(x + this.gridSize - 8, y + 3, 4, 4);
                } else if (this.dy === 1) { // Down
                    this.ctx.fillRect(x + 4, y + this.gridSize - 7, 4, 4);
                    this.ctx.fillRect(x + this.gridSize - 8, y + this.gridSize - 7, 4, 4);
                } else { // Default (not moving yet)
                    this.ctx.fillRect(x + this.gridSize - 7, y + 4, 4, 4);
                    this.ctx.fillRect(x + this.gridSize - 7, y + this.gridSize - 8, 4, 4);
                }
            } else {
                // Draw body parts
                this.ctx.fillRect(x, y, this.gridSize - 1, this.gridSize - 1);
            }
        });
    }
    
    /**
     * Update score display
     */
    updateScoreDisplay() {
        this.scoreElement.textContent = this.score;
    }
    
    /**
     * Update high score display
     */
    updateHighScoreDisplay() {
        this.highScoreElement.textContent = this.highScore;
    }
    
    /**
     * Get high score from local storage
     */
    getHighScore() {
        const storedScore = localStorage.getItem('snakeHighScore');
        return storedScore ? parseInt(storedScore) : 0;
    }
    
    /**
     * Save high score to local storage
     */
    saveHighScore(score) {
        localStorage.setItem('snakeHighScore', score);
    }
    
    /**
     * Generate random color for food
     */
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    const game = new SnakeGame();
});
