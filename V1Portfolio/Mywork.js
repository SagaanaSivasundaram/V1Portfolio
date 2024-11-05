const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Background movement variables
let backgroundX = 0;
const backgroundSpeed = 5;
const backgroundImage = new Image();
backgroundImage.src = 'Njbg.jpg';

// Variable to track if the background image has loaded
let backgroundLoaded = false;
backgroundImage.onload = () => {
    backgroundLoaded = true;
};

// Character selection
let selectedCharacter = null;
const characters = {
    hanni: 'Hanni.png',
    danielle: 'Danielle.png',
    haerin: 'Haerin.png',
    minji: 'Minji.png',
    hyein: 'Hyein.png'
};

// Character object
const character = {
    x: 0,
    y: 0,
    width: 250,
    height: 250,
    jump: false,
    velocity: 0,
    gravity: 1.5,  // Adjust gravity for better jump physics
    image: new Image()
};

// Variables for bunnies
const bunnies = [];
const bunnyImage = new Image();
bunnyImage.src = 'bunny.png';
const bunnyWidth = 200;
const bunnyHeight = 200;
const bunnySpeed = 6;

// Variable for counting collected bunnies
let collectedBunnies = 0;

// Map-related variables
const mapImage = new Image();
mapImage.src = 'Map.png';
let mapAppeared = false;
const map = {
    x: 0,
    y: 0,
    width: 150,
    height: 150
};

// Reference to the start screen elements
const startScreen = document.getElementById('startScreen');
const startLogo = document.getElementById('startLogo');
const characterSelectionImages = document.querySelectorAll('#characterSelection img');

// Track if the game has started
let gameStarted = false;

// Initialize game settings
function initializeGame() {
    setupCharacterSelection();
    setupStartGame();
}

// Setup character selection event listeners
function setupCharacterSelection() {
    characterSelectionImages.forEach(img => {
        img.addEventListener('click', (e) => {
            characterSelectionImages.forEach(img => img.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedCharacter = e.target.id;
            character.image.src = characters[selectedCharacter];
            character.image.onload = () => {
                character.y = canvas.height - character.height - 100;
            };
        });
    });
}

// Start game logic
function setupStartGame() {
    startLogo.addEventListener('click', () => {
        if (selectedCharacter) {
            startScreen.style.display = 'none';
            document.getElementById('gameScreen').style.display = 'block';
            canvas.style.display = 'block';
            gameStarted = true;
            setupCanvas();
            gameLoop();
        } else {
            alert("Please select a character to start the game!");
        }
    });
}

// Set up canvas size
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    character.x = canvas.width / 20;
    character.y = canvas.height - character.height - 100;
}

// Generate a bunny one by one with some distance
function generateBunny() {
    if (!mapAppeared && bunnies.length < 10) {  
        const bunny = {
            x: canvas.width + (bunnies.length * 250),  // Add distance between each bunny
            y: canvas.height - bunnyHeight - 100,
            width: bunnyWidth,
            height: bunnyHeight
        };
        bunnies.push(bunny);

        setTimeout(generateBunny, 2000);  // Delay the appearance of each bunny
    }
}

// Draw the moving background
function drawBackground() {
    if (backgroundLoaded) {
        backgroundX -= backgroundSpeed;
        if (backgroundX <= -canvas.width) {
            backgroundX = 0;
        }
        ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);
    }
}

// Draw the selected character
function drawCharacter() {
    if (selectedCharacter) {
        ctx.drawImage(character.image, character.x, character.y, character.width, character.height);
    }
}

// Draw bunnies and move them
function drawBunnies() {
    for (let i = 0; i < bunnies.length; i++) {
        const bunny = bunnies[i];
        bunny.x -= bunnySpeed;
        ctx.drawImage(bunnyImage, bunny.x, bunny.y, bunny.width, bunny.height);

        if (bunny.x + bunny.width < 0) {
            bunnies.splice(i, 1);  // Remove bunny once off-screen
            i--;  // Adjust index due to removal
        }
    }
}

// Check for collisions between character and bunnies
function checkBunnyCollision() {
    bunnies.forEach((bunny, index) => {
        if (
            character.x < bunny.x + bunny.width &&
            character.x + character.width > bunny.x &&
            character.y < bunny.y + bunny.height &&
            character.height + character.y > bunny.y
        ) {
            collectedBunnies++;
            console.log("Bunny collected!");
            bunnies.splice(index, 1);  // Remove bunny on collection
        }
    });
}

// Draw the map
function drawMap() {
    if (mapAppeared) {
        map.x -= bunnySpeed;
        ctx.drawImage(mapImage, map.x, map.y, map.width, map.height);
    }
}

// Check for character touching the map
function checkMapTouch() {
    if (mapAppeared &&
        character.x < map.x + map.width &&
        character.x + character.width > map.x &&
        character.y < map.y + map.height &&
        character.height + character.y > map.y) {

        displayPopup();
    }
}

// Display the popup
function displayPopup() {
    gameStarted = false;

    canvas.style.filter = 'blur(8px)';

    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.zIndex = '1000';
    popup.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.5)';

    // Add three links
    const link1 = document.createElement('a');
    link1.href = '#';
    link1.textContent = 'Link 1';
    link1.style.display = 'block';
    link1.style.marginBottom = '10px';

    const link2 = document.createElement('a');
    link2.href = '#';
    link2.textContent = 'Link 2';
    link2.style.display = 'block';
    link2.style.marginBottom = '10px';

    const link3 = document.createElement('a');
    link3.href = '#';
    link3.textContent = 'Link 3';
    link3.style.display = 'block';

    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => {
        popup.remove();
        canvas.style.filter = 'none';
        gameStarted = true;
        gameLoop();
    };

    popup.appendChild(link1);
    popup.appendChild(link2);
    popup.appendChild(link3);
    popup.appendChild(closeButton);
    document.body.appendChild(popup);
}

// Main game loop
function gameLoop() {
    if (gameStarted) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        if (collectedBunnies < 10) {
            generateBunny();
        } else if (!mapAppeared) {
            const lastBunny = bunnies[bunnies.length - 1];
            map.x = lastBunny.x + lastBunny.width + 20;
            map.y = lastBunny.y;
            mapAppeared = true;
        }
        drawBunnies();
        drawCharacter();
        drawMap();
        checkBunnyCollision();
        checkMapTouch();
        handleJump();
        requestAnimationFrame(gameLoop);
    }
}

// Event listener for jumping when spacebar is pressed
document.addEventListener('keydown', (e) => {
    if (gameStarted && e.code === 'Space' && character.y >= canvas.height - character.height - 100) {
        character.jump = true;
        character.velocity = -20;
    }
});

// Handle character jump
function handleJump() {
    if (character.jump) {
        character.velocity += character.gravity;
        character.y += character.velocity;

        if (character.y >= canvas.height - character.height - 100) {
            character.y = canvas.height - character.height - 100;
            character.jump = false;
            character.velocity = 0;
        }
    }
}

// Initialize the game
initializeGame();
