// Game constants
const GRID_SIZE = 20; // Size of each grid cell in pixels
const GRID_WIDTH = 400 / GRID_SIZE; // Number of cells horizontally
const GRID_HEIGHT = 400 / GRID_SIZE; // Number of cells vertically
const GAME_SPEED = 100; // Milliseconds between game updates

// Game variables
let canvas;
let ctx;
let snake;
let food;
let direction;
let nextDirection;
let gameInterval;
let score;
let gameRunning;

// DOM elements
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// Initialize the game when the window loads
window.onload = function() {
    canvas = document.getElementById('game-board');
    ctx = canvas.getContext('2d');
    
    // Add event listeners for buttons
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    
    // Add keyboard event listeners
    document.addEventListener('keydown', handleKeyPress);
    
    // Initial setup
    setupGame();
};

// Set up the initial game state
function setupGame() {
    // Initialize snake in the middle of the board
    snake = [
        {x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2)},
        {x: Math.floor(GRID_WIDTH / 2) - 1, y: Math.floor(GRID_HEIGHT / 2)}
    ];
    
    // Set initial direction to right
    direction = 'right';
    nextDirection = 'right';
    
    // Generate initial food
    generateFood();
    
    // Reset score
    score = 0;
    scoreElement.textContent = score;
    
    // Game is not running initially
    gameRunning = false;
    
    // Draw the initial state
    draw();
}

// Start the game
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gameInterval = setInterval(gameLoop, GAME_SPEED);
        startButton.textContent = 'Pause';
    } else {
        gameRunning = false;
        clearInterval(gameInterval);
        startButton.textContent = 'Resume';
    }
}

// Restart the game
function restartGame() {
    clearInterval(gameInterval);
    setupGame();
    startButton.textContent = 'Start Game';
}

// Main game loop
function gameLoop() {
    // Update direction
    direction = nextDirection;
    
    // Move the snake
    moveSnake();
    
    // Check for collisions
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    // Check if snake ate food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        // Don't remove the tail, which makes the snake grow
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        // Remove the tail if no food was eaten
        snake.pop();
    }
    
    // Draw everything
    draw();
}

// Move the snake based on the current direction
function moveSnake() {
    const head = {x: snake[0].x, y: snake[0].y};
    
    switch (direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }
    
    // Add the new head to the beginning of the snake array
    snake.unshift(head);
}

// Generate food at a random position
function generateFood() {
    // Create a random position for food
    let newFood;
    let foodOnSnake;
    
    do {
        foodOnSnake = false;
        newFood = {
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: Math.floor(Math.random() * GRID_HEIGHT)
        };
        
        // Check if the food is on the snake
        for (let segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                foodOnSnake = true;
                break;
            }
        }
    } while (foodOnSnake);
    
    food = newFood;
}

// Check for collisions with walls or self
function checkCollision() {
    const head = snake[0];
    
    // Check wall collisions
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        return true;
    }
    
    // Check self collision (skip the head)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Handle keyboard input
function handleKeyPress(event) {
    // Prevent the default action (scrolling) when pressing arrow keys
    if ([37, 38, 39, 40].includes(event.keyCode)) {
        event.preventDefault();
    }
    
    // Update direction based on key press
    switch (event.keyCode) {
        case 38: // Up arrow
            if (direction !== 'down') {
                nextDirection = 'up';
            }
            break;
        case 40: // Down arrow
            if (direction !== 'up') {
                nextDirection = 'down';
            }
            break;
        case 37: // Left arrow
            if (direction !== 'right') {
                nextDirection = 'left';
            }
            break;
        case 39: // Right arrow
            if (direction !== 'left') {
                nextDirection = 'right';
            }
            break;
    }
}

// Game over function
function gameOver() {
    clearInterval(gameInterval);
    gameRunning = false;
    startButton.textContent = 'Start Game';
    
    // Display game over message
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 15);
    
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

// Draw everything on the canvas
function draw() {
    // Clear the canvas
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the snake
    snake.forEach((segment, index) => {
        // Head is a different color
        if (index === 0) {
            ctx.fillStyle = '#4CAF50'; // Green head
        } else {
            // Gradient from dark to light green for the body
            const greenValue = Math.floor(150 - (index * 3));
            ctx.fillStyle = `rgb(0, ${Math.max(greenValue, 100)}, 0)`;
        }
        
        ctx.fillRect(
            segment.x * GRID_SIZE,
            segment.y * GRID_SIZE,
            GRID_SIZE,
            GRID_SIZE
        );
        
        // Add a border to make segments more visible
        ctx.strokeStyle = '#111';
        ctx.strokeRect(
            segment.x * GRID_SIZE,
            segment.y * GRID_SIZE,
            GRID_SIZE,
            GRID_SIZE
        );
    });
    
    // Draw the food
    ctx.fillStyle = '#FF5252'; // Red food
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Draw grid lines (optional, for better visibility)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}