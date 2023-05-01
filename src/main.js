let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve some keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;

// variable outside to keep track of highscore 
let highScore = 0;
