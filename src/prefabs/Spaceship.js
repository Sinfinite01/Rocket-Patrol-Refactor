//spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.direction = Math.random()*10 - 5;

    
    }

    update(){

        //move left
        if(this.direction<0){
            this.x -= this.moveSpeed;

            if(this.x <= 0 - this.width){
                this.x = game.config.width;
            }
        }

        //move right
        if(this.direction>=0){
            this.flipX = true;
            this.x += this.moveSpeed;

            if(this.x >= game.config.width + this.width){
                this.x = 0;
            }
        }
    }

    // position rest
    reset(){
        this.x = game.config.width;
    }
}