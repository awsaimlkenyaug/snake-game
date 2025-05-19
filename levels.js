/**
 * Level system for Snake Game
 */

// Level configurations
const levels = [
    // Level 1 - No obstacles
    {
        name: "Beginner",
        speed: 7,
        obstacles: [],
        powerUpChance: 0.1,
        description: "Get started with the basics!"
    },
    // Level 2 - Few obstacles
    {
        name: "Novice",
        speed: 8,
        obstacles: [
            { type: 'wall', x: 5, y: 5 },
            { type: 'wall', x: 6, y: 5 },
            { type: 'wall', x: 7, y: 5 },
            { type: 'wall', x: 15, y: 15 },
            { type: 'wall', x: 15, y: 16 },
            { type: 'wall', x: 15, y: 17 }
        ],
        powerUpChance: 0.15,
        description: "Watch out for walls!"
    },
    // Level 3 - More obstacles and a moving obstacle
    {
        name: "Intermediate",
        speed: 9,
        obstacles: [
            { type: 'wall', x: 3, y: 3 },
            { type: 'wall', x: 3, y: 4 },
            { type: 'wall', x: 3, y: 5 },
            { type: 'wall', x: 3, y: 6 },
            { type: 'wall', x: 16, y: 13 },
            { type: 'wall', x: 16, y: 14 },
            { type: 'wall', x: 16, y: 15 },
            { type: 'wall', x: 16, y: 16 },
            { type: 'moving', x: 10, y: 10 }
        ],
        powerUpChance: 0.2,
        description: "Things are getting tricky!"
    },
    // Level 4 - Maze-like pattern
    {
        name: "Advanced",
        speed: 10,
        obstacles: [
            // Top border
            { type: 'wall', x: 5, y: 5 },
            { type: 'wall', x: 6, y: 5 },
            { type: 'wall', x: 7, y: 5 },
            { type: 'wall', x: 8, y: 5 },
            { type: 'wall', x: 9, y: 5 },
            { type: 'wall', x: 10, y: 5 },
            { type: 'wall', x: 11, y: 5 },
            { type: 'wall', x: 12, y: 5 },
            { type: 'wall', x: 13, y: 5 },
            { type: 'wall', x: 14, y: 5 },
            { type: 'wall', x: 15, y: 5 },
            
            // Right border
            { type: 'wall', x: 15, y: 6 },
            { type: 'wall', x: 15, y: 7 },
            { type: 'wall', x: 15, y: 8 },
            { type: 'wall', x: 15, y: 9 },
            { type: 'wall', x: 15, y: 10 },
            { type: 'wall', x: 15, y: 11 },
            { type: 'wall', x: 15, y: 12 },
            { type: 'wall', x: 15, y: 13 },
            { type: 'wall', x: 15, y: 14 },
            { type: 'wall', x: 15, y: 15 },
            
            // Bottom border
            { type: 'wall', x: 5, y: 15 },
            { type: 'wall', x: 6, y: 15 },
            { type: 'wall', x: 7, y: 15 },
            { type: 'wall', x: 8, y: 15 },
            { type: 'wall', x: 9, y: 15 },
            { type: 'wall', x: 10, y: 15 },
            { type: 'wall', x: 11, y: 15 },
            { type: 'wall', x: 12, y: 15 },
            { type: 'wall', x: 13, y: 15 },
            { type: 'wall', x: 14, y: 15 },
            
            // Left border
            { type: 'wall', x: 5, y: 6 },
            { type: 'wall', x: 5, y: 7 },
            { type: 'wall', x: 5, y: 8 },
            { type: 'wall', x: 5, y: 9 },
            { type: 'wall', x: 5, y: 10 },
            { type: 'wall', x: 5, y: 11 },
            { type: 'wall', x: 5, y: 12 },
            { type: 'wall', x: 5, y: 13 },
            { type: 'wall', x: 5, y: 14 },
            
            // Inner obstacles
            { type: 'wall', x: 10, y: 8 },
            { type: 'wall', x: 10, y: 9 },
            { type: 'wall', x: 10, y: 10 },
            { type: 'wall', x: 10, y: 11 },
            { type: 'wall', x: 10, y: 12 },
            
            // Moving obstacles
            { type: 'moving', x: 7, y: 7 },
            { type: 'moving', x: 13, y: 13 }
        ],
        powerUpChance: 0.25,
        description: "Navigate the maze!"
    },
    // Level 5 - Expert level with complex pattern
    {
        name: "Expert",
        speed: 11,
        obstacles: [
            // Zigzag pattern
            { type: 'wall', x: 3, y: 3 },
            { type: 'wall', x: 4, y: 3 },
            { type: 'wall', x: 5, y: 3 },
            { type: 'wall', x: 6, y: 3 },
            { type: 'wall', x: 7, y: 3 },
            
            { type: 'wall', x: 7, y: 4 },
            { type: 'wall', x: 7, y: 5 },
            { type: 'wall', x: 7, y: 6 },
            { type: 'wall', x: 7, y: 7 },
            
            { type: 'wall', x: 8, y: 7 },
            { type: 'wall', x: 9, y: 7 },
            { type: 'wall', x: 10, y: 7 },
            { type: 'wall', x: 11, y: 7 },
            { type: 'wall', x: 12, y: 7 },
            
            { type: 'wall', x: 12, y: 8 },
            { type: 'wall', x: 12, y: 9 },
            { type: 'wall', x: 12, y: 10 },
            { type: 'wall', x: 12, y: 11 },
            
            { type: 'wall', x: 13, y: 11 },
            { type: 'wall', x: 14, y: 11 },
            { type: 'wall', x: 15, y: 11 },
            { type: 'wall', x: 16, y: 11 },
            { type: 'wall', x: 17, y: 11 },
            
            // Moving obstacles
            { type: 'moving', x: 5, y: 10 },
            { type: 'moving', x: 10, y: 15 },
            { type: 'moving', x: 15, y: 5 }
        ],
        powerUpChance: 0.3,
        description: "For snake masters only!"
    }
];

// Function to get level configuration
function getLevel(levelNumber) {
    // Ensure level number is valid
    const index = Math.min(Math.max(0, levelNumber - 1), levels.length - 1);
    return levels[index];
}

// Export the level functions
if (typeof module !== 'undefined') {
    module.exports = {
        getLevel,
        levels
    };
}
