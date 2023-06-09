class Play extends Phaser.Scene {
    constructor() {
        super('playScene'); 
    }

    preload() {
        //load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('mySpaceship', './assets/mySpaceship2.png');
        this.load.image('myStarfield1', './assets/myStarfield1.png');
        this.load.image('myStarfield2', './assets/myStarfield2.png');
        this.load.image('myStarfield3', './assets/myStarfield3.png');
        
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create(){
        // place tile sprite
        this.myStarfield1 = this.add.tileSprite(0, 0, 640, 240, 'myStarfield1').setOrigin(0, 0);
        this.myStarfield2 = this.add.tileSprite(0, 230, 640, 120, 'myStarfield2').setOrigin(0, 0);
        this.myStarfield3 = this.add.tileSprite(0, 340, 640, 120, 'myStarfield3').setOrigin(0, 0);
        

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);    
        
        // addrocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5,0);
        
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width - borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width - borderUISize*3, borderUISize*5 + borderPadding*5, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*6, 'spaceship', 0, 10).setOrigin(0,0);
        
        //make smaller faster ship
        this.ship04 = new Spaceship(this, game.config.width - borderUISize*4, borderUISize*5 + borderPadding*2, 'mySpaceship', 0, 50).setOrigin(0,0);
        this.ship04.moveSpeed *= 1.5;

        //define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    
        // animation config
        this.anims.create({
                key: 'explode',
                frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
                frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        //game score
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        /*this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ↑ for Menu', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64*2, 'High Score: ' + highScore, scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);*/

        this.clock = this.time.delayedCall(30000, () => {
            this.ship01.moveSpeed *= 1.5;
            this.ship02.moveSpeed *= 1.5;
            this.ship03.moveSpeed *= 1.5;
            this.ship04.moveSpeed *= 1.5;
        }, null, this);

        //clock
        this.clockRightCounter = Math.floor(game.settings.gameTimer/1000);
        this.addedTime = 0;
        this.scoreRight = this.add.text(game.config.width/2 + borderUISize*4 + borderPadding*4, borderUISize + borderPadding*2, this.clockRightCounter, scoreConfig);
        this.scoreRight.fixedWidth = 0;
        this.scoreRight.align = 'right';

        // display "FIRE" text
        let fireConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'middle',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        } 
        this.fireText = this.add.text(game.config.width/2 - borderUISize, borderUISize + borderPadding*2, 'FIRE', fireConfig);
        this.fireText.alpha = 0;

        this.backgroundMusic = this.sound.add('sfx_background');
        if(!this.backgroundMusic.isPlaying){
            this.backgroundMusic.play();
        }

        this.initTime = this.time.now;

        this.speedUpText = this.add.text(game.config.width/2, game.config.height/2, 'SPEED UP!!!', scoreConfig).setOrigin(0.5);
        this.speedUpText.alpha = 0;

        this.endScreen1 = this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.endScreen2 = this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ↑ for Menu', scoreConfig).setOrigin(0.5);
        this.endScreen3 = this.add.text(game.config.width/2, game.config.height/2 + 64*2, 'High Score: ' + highScore, scoreConfig).setOrigin(0.5);
        this.endScreen1.alpha = 0;
        this.endScreen2.alpha = 0;
        this.endScreen3.alpha = 0;
    }

    update() {

        //check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.backgroundMusic.stop();
            this.scene.restart();
            //this.backgroundMusic.play();
            this.initTime = this.time.now;
        }

        //is time up?
        if(!this.gameOver){
            if(this.clockRightCounter <= 0){
                this.endScreen1.alpha = 1;
                this.endScreen2.alpha = 1;
                this.endScreen3.alpha = 1;
                this.endScreen3.text = 'High Score: ' + highScore;
                this.gameOver = true;
            }
        }

        if(!this.backgroundMusic.isPlaying){
            this.backgroundMusic.play();
        }

        //clock
        if(!this.gameOver){
            this.clockRightCounter = Math.floor(game.settings.gameTimer/1000) - Math.floor((this.time.now-this.initTime)/1000) + Math.floor(this.addedTime);
            this.scoreRight.text = this.clockRightCounter;
            if(Math.floor((this.time.now-this.initTime)/1000) == 30){
                this.speedUpText.alpha = 1;
            }
            else{
                this.speedUpText.alpha = 0;
            }
        }


        this.myStarfield1.tilePositionX -= 5;
        this.myStarfield2.tilePositionX -= 7;
        this.myStarfield3.tilePositionX -= 9;

        if(!this.gameOver){
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.backgroundMusic.stop();
            this.scene.start("menuScene");
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            this.addedTime += 0.5;
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            this.addedTime += 1;
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            this.addedTime += 2;
        }

        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
            this.addedTime += 2;
        }

        if(this.p1Rocket.isFiring){
            this.fireText.alpha = 1;
        }
        else{
            this.fireText.alpha = 0;
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true;
        } else {
          return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        //this.scoreConfig.color = '#3BB143';
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });  
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        
        //update high score
        if(this.p1Score > highScore){
            highScore = this.p1Score;
        }

        this.explosionNum =  Math.floor(Math.random()*4); 
        if(this.explosionNum == 0){
            this.sound.play('sfx_explosion1');
        }
        else if(this.explosionNum == 1){
            this.sound.play('sfx_explosion2');
        }    
        else if(this.explosionNum == 2){
            this.sound.play('sfx_explosion3');
        }
        else if(this.explosionNum == 3){
            this.sound.play('sfx_explosion4');
        }
        
        //this.scoreRight.color = '#3BB143'
        /*this.clock = this.time.delayedCall(1000, () => {
            this.scoreRight.color = '#843605'
        }, null, this);*/
    }
}

