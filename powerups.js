/**
 * Power-ups system for Snake Game
 */

// Power-up types
const PowerUpType = {
    SPEED_BOOST: 'speedBoost',
    SLOW_MOTION: 'slowMotion',
    GHOST_MODE: 'ghostMode',
    DOUBLE_POINTS: 'doublePoints',
    SHRINK: 'shrink'
};

// Power-up class
class PowerUp {
    constructor(type, x, y, duration) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.duration = duration; // in seconds
        this.active = false;
        this.color = this.getColor();
        this.startTime = 0;
    }
    
    getColor() {
        switch(this.type) {
            case PowerUpType.SPEED_BOOST:
                return '#ff5733'; // Orange
            case PowerUpType.SLOW_MOTION:
                return '#33a1ff'; // Light blue
            case PowerUpType.GHOST_MODE:
                return '#a64dff'; // Purple
            case PowerUpType.DOUBLE_POINTS:
                return '#ffdd33'; // Yellow
            case PowerUpType.SHRINK:
                return '#33ff57'; // Green
            default:
                return '#ffffff'; // White
        }
    }
    
    activate(game) {
        this.active = true;
        this.startTime = Date.now();
        
        // Apply power-up effect
        switch(this.type) {
            case PowerUpType.SPEED_BOOST:
                game.speed = game.baseSpeed * 1.5;
                game.showPowerUpIndicator('Speed Boost!');
                break;
            case PowerUpType.SLOW_MOTION:
                game.speed = game.baseSpeed * 0.5;
                game.showPowerUpIndicator('Slow Motion!');
                break;
            case PowerUpType.GHOST_MODE:
                game.ghostMode = true;
                game.showPowerUpIndicator('Ghost Mode!');
                break;
            case PowerUpType.DOUBLE_POINTS:
                game.pointMultiplier = 2;
                game.showPowerUpIndicator('Double Points!');
                break;
            case PowerUpType.SHRINK:
                if (game.snake.length > 3) {
                    game.snake = game.snake.slice(0, Math.max(3, game.snake.length - 3));
                }
                game.showPowerUpIndicator('Shrink!');
                break;
        }
    }
    
    deactivate(game) {
        this.active = false;
        
        // Remove power-up effect
        switch(this.type) {
            case PowerUpType.SPEED_BOOST:
            case PowerUpType.SLOW_MOTION:
                game.speed = game.baseSpeed;
                break;
            case PowerUpType.GHOST_MODE:
                game.ghostMode = false;
                break;
            case PowerUpType.DOUBLE_POINTS:
                game.pointMultiplier = 1;
                break;
            case PowerUpType.SHRINK:
                // No need to do anything, the snake is already shrunk
                break;
        }
        
        game.hidePowerUpIndicator();
    }
    
    update(game) {
        if (this.active) {
            const elapsedTime = (Date.now() - this.startTime) / 1000;
            if (elapsedTime >= this.duration) {
                this.deactivate(game);
                return false; // Power-up expired
            }
            return true; // Power-up still active
        }
        return false;
    }
    
    draw(ctx, gridSize) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
            this.x * gridSize + gridSize / 2,
            this.y * gridSize + gridSize / 2,
            gridSize / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw a star or symbol inside
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        const centerX = this.x * gridSize + gridSize / 2;
        const centerY = this.y * gridSize + gridSize / 2;
        const size = gridSize / 4;
        
        // Draw a simple star shape
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const x = centerX + size * Math.cos(angle);
            const y = centerY + size * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
    }
}

// Export the PowerUp class and types
if (typeof module !== 'undefined') {
    module.exports = {
        PowerUp,
        PowerUpType
    };
}
