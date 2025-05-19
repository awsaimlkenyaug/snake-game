/**
 * Obstacles system for Snake Game
 */

// Obstacle types
const ObstacleType = {
    WALL: 'wall',
    MOVING: 'moving'
};

// Obstacle class
class Obstacle {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.color = this.getColor();
        this.direction = Math.random() < 0.5 ? 1 : -1; // For moving obstacles
        this.moveCounter = 0;
    }
    
    getColor() {
        switch(this.type) {
            case ObstacleType.WALL:
                return '#8B4513'; // Brown
            case ObstacleType.MOVING:
                return '#FF4500'; // Orange-Red
            default:
                return '#808080'; // Gray
        }
    }
    
    update(game) {
        if (this.type === ObstacleType.MOVING) {
            this.moveCounter++;
            
            // Move every 10 frames
            if (this.moveCounter >= 10) {
                this.moveCounter = 0;
                
                // Try to move in current direction
                const newX = this.x + this.direction;
                
                // Check if we hit a wall or another obstacle
                if (newX <= 0 || newX >= game.tileCount - 1 || game.isObstacleAt(newX, this.y)) {
                    // Change direction
                    this.direction *= -1;
                } else {
                    // Move
                    this.x = newX;
                }
            }
        }
    }
    
    draw(ctx, gridSize) {
        ctx.fillStyle = this.color;
        
        if (this.type === ObstacleType.WALL) {
            // Draw a brick-like pattern
            ctx.fillRect(this.x * gridSize, this.y * gridSize, gridSize, gridSize);
            
            // Add brick details
            ctx.strokeStyle = '#5D2906';
            ctx.lineWidth = 1;
            ctx.beginPath();
            
            // Horizontal lines
            const third = gridSize / 3;
            ctx.moveTo(this.x * gridSize, this.y * gridSize + third);
            ctx.lineTo(this.x * gridSize + gridSize, this.y * gridSize + third);
            ctx.moveTo(this.x * gridSize, this.y * gridSize + 2 * third);
            ctx.lineTo(this.x * gridSize + gridSize, this.y * gridSize + 2 * third);
            
            // Vertical lines
            ctx.moveTo(this.x * gridSize + gridSize / 2, this.y * gridSize);
            ctx.lineTo(this.x * gridSize + gridSize / 2, this.y * gridSize + third);
            ctx.moveTo(this.x * gridSize + gridSize / 4, this.y * gridSize + third);
            ctx.lineTo(this.x * gridSize + gridSize / 4, this.y * gridSize + 2 * third);
            ctx.moveTo(this.x * gridSize + 3 * gridSize / 4, this.y * gridSize + third);
            ctx.lineTo(this.x * gridSize + 3 * gridSize / 4, this.y * gridSize + 2 * third);
            ctx.moveTo(this.x * gridSize + gridSize / 2, this.y * gridSize + 2 * third);
            ctx.lineTo(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize);
            
            ctx.stroke();
        } else if (this.type === ObstacleType.MOVING) {
            // Draw a spiky ball
            const centerX = this.x * gridSize + gridSize / 2;
            const centerY = this.y * gridSize + gridSize / 2;
            const radius = gridSize / 2 - 2;
            
            // Draw the main circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw spikes
            ctx.fillStyle = '#FF8C00'; // Darker orange for spikes
            const spikeCount = 8;
            const spikeLength = gridSize / 4;
            
            for (let i = 0; i < spikeCount; i++) {
                const angle = (i / spikeCount) * Math.PI * 2;
                const spikeX = centerX + Math.cos(angle) * radius;
                const spikeY = centerY + Math.sin(angle) * radius;
                const tipX = centerX + Math.cos(angle) * (radius + spikeLength);
                const tipY = centerY + Math.sin(angle) * (radius + spikeLength);
                
                ctx.beginPath();
                ctx.moveTo(spikeX, spikeY);
                ctx.lineTo(tipX, tipY);
                ctx.lineTo(
                    centerX + Math.cos(angle + 0.2) * radius,
                    centerY + Math.sin(angle + 0.2) * radius
                );
                ctx.fill();
            }
        }
    }
}

// Export the Obstacle class and types
if (typeof module !== 'undefined') {
    module.exports = {
        Obstacle,
        ObstacleType
    };
}
