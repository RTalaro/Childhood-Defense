class Game extends Phaser.Scene {
    // Class variable definitions -- these are all "undefined" to start
    graphics;
    curve;
    path;

    // don't forget to unnmute the site so you can fully test
    // today's goal: player shooting + enemy paths/shooting

    constructor() {
        super("game"); // enables scene access from other scenes
        this.my = {sprite: {}, bodyX: 700, bodyY: 125,
                    lives: 3, deaths: 0, score: 0,
                    walking: false, walk: "bodyWalk",
                    time: 0, deathtime: 0
                    };

        this.enemyGreen = {sprite: {}, bodyX: 700, bodyY: 100, lives: 1, deaths: 0, score: 0};
        this.enemyPink = {sprite: {}, bodyX: 700, bodyY: 100, lives: 3, deaths: 0, score: 0};
        this.enemyRhino = {sprite: {}, bodyX: 700, bodyY: 100, lives: 5, deaths: 0, score: 0};
        this.enemyRifle = {sprite: {}, bodyX: 700, bodyY: 100, lives: 9, deaths: 0, score: 0};
        
        this.UI = {sprite: {}};
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("bg", "papertexture.jpg");
        this.load.image("crosshair", "crosshair.png");
        this.load.image("gameover", "text_gameover.png");

        this.load.image("enemyGreen", "enemy1.png");
        this.load.image("enemyGreenHand", "enemy1hand.png");
        this.load.image("enemyGreenHelmet", "item_helmet.png");
        this.load.image("enemyGreenWeapon", "item_spear.png");

        this.load.image("enemyPinkStand", "pink_stand.png");
        this.load.image("enemyPinkWalk", "pink_walk.png");
        this.load.image("enemyPinkWeapon", "pink_weapon.png");

        this.load.image("enemyRhino", "rhino.png");
        
        this.load.image("enemyRifle", "rifle.png");
        this.load.image("enemyRifleRed", "rifle_red.png");

        this.load.image("enemyDeath", "death.png")

        this.load.image("snowman", "snowman.png");

        this.load.image("playerDie1", "die1.png");
        this.load.image("playerDie2", "die2.png");
        this.load.image("playerFront", "player_front.png");
        this.load.image("playerStand", "player_stand.png");
        this.load.image("playerWalk", "player_walk.png");

        this.load.image("eraser", "eraser.png");
        this.load.image("life1", "life1.png");
        this.load.image("life2", "life2.png");
        this.load.image("life3", "life3.png");

        this.load.image("0", "/score/0.png");
        this.load.image("1", "/score/1.png");
        this.load.image("2", "/score/2.png");
        this.load.image("3", "/score/3.png");
        this.load.image("4", "/score/4.png");
        this.load.image("5", "/score/5.png");
        this.load.image("6", "/score/6.png");
        this.load.image("7", "/score/7.png");
        this.load.image("8", "/score/8.png");
        this.load.image("9", "/score/9.png");
        this.load.image("deaths", "/score/deaths.png");

        this.load.image("gameover", "text_gameover.png");
        this.load.audio("bgm", "cityofsmoke.mp3")

        console.log("preload done");
    }

    create() {
        let player = this.my;
        let UI = this.UI.sprite;



        this.add.image(700, 400, "bg");
        UI.life1 = this.add.image(1200, 50, "life1");
        UI.life1.setScale(.8);
        UI.life2 = this.add.image(1275, 50, "life2");
        UI.life2.setScale(.8);
        UI.life3 = this.add.image(1350, 50, "life3");
        UI.life3.setScale(.8);
        UI.deaths = this.add.image(50, 60, "deaths");
        UI.deaths.setScale(8);
        UI.scoreDig10 = this.add.image(125, 60, "0");
        UI.scoreDig10.setScale(8);
        UI.scoreDig1 = this.add.image(175, 60, "0");
        UI.scoreDig1.setScale(8);

        player.sprite.bodyFront = this.add.sprite(player.bodyX, player.bodyY, "playerFront");
        player.sprite.bodyFront.setScale(8);
        player.sprite.bodyWalk = this.add.sprite(player.bodyX, player.bodyY, "playerWalk");
        player.sprite.bodyWalk.setScale(8);
        player.sprite.bodyWalk.visible = false;
        player.sprite.bodyStand = this.add.sprite(player.bodyX, player.bodyY, "playerStand");
        player.sprite.bodyStand.setScale(8);
        player.sprite.bodyStand.visible = false;

        player.sprite.crosshair = this.add.sprite(0, 0, "crosshair");
        
        this.sound.play("bgm", {loop: true});

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.pointer = this.input.activePointer;
    }

    update() {
        let player = this.my;
        let UI = this.UI.sprite;
        player.time++;

        player.sprite.crosshair.x = this.pointer.x;
        player.sprite.crosshair.y = this.pointer.y;

        if (this.keyA.isDown && !this.keyD.isDown && player.bodyX > 0 + player.sprite[player.walk].displayWidth/2) {
            console.log("move left");
            
            player.walking = true;
            for(const prop in player.sprite){
                player.sprite[prop].flipX = true;
                player.sprite[prop].x -= 3;
            }
            player.bodyX -= 3;
            player.sprite.bodyFront.visible = false;
            player.sprite[player.walk].visible = true;
        }
        else if (this.keyD.isDown && !this.keyA.isDown && player.bodyX < (1400 - player.sprite[player.walk].displayWidth/2)) {
            console.log("move right");
            
            player.walking = true;
            for(const prop in player.sprite){
                player.sprite[prop].flipX = false;
                player.sprite[prop].x += 3;
            }
            player.bodyX += 3;
            player.sprite.bodyFront.visible = false;
            player.sprite[player.walk].visible = true;
        }
        else  if(!this.keyD.isDown && !this.keyA.isDown && !player.deathtime){
            player.walking = false;
            player.sprite.bodyFront.visible = true;
            player.sprite.bodyStand.visible = false;
            player.sprite.bodyWalk.visible = false;
        }

        if(player.walking && player.time%10 == 0){
            switch(player.walk){
                case "bodyWalk":
                    player.walk = "bodyStand";
                    player.sprite.bodyWalk.visible = false;
                    player.sprite.bodyStand.visible = true;
                    break;
                case "bodyStand":
                    player.walk = "bodyWalk";
                    player.sprite.bodyWalk.visible = true;
                    player.sprite.bodyStand.visible = false;
                    break;
            }
            
        }

        // for testing death
        //if(player.time == 20){player.lives = 0;}

        if(!player.lives){
            if(!player.deathtime){
                console.log("death");
                player.deathtime = player.time;
                player.sprite.bodyWalk.visible = false;
                player.sprite.bodyStand.visible = false;
                player.sprite.bodyFront.visible = false;
                player.sprite.bodyDead = this.add.image(player.bodyX, player.bodyY, "playerDie1");
                player.sprite.bodyDead.setScale(8);
            }
            else if(player.time == 10 + player.deathtime){
                player.sprite.bodyDead.visible = false;
                player.sprite.bodyDead = this.add.image(player.bodyX, player.bodyY, "playerDie2");
                player.sprite.bodyDead.setScale(8);
            }
            else if(player.time == 20 + player.deathtime){
                player.sprite.bodyDead.visible = false;
            }
            else if(player.time == 40 + player.deathtime){
                this.add.image(700, 400, "gameover");
            }
        }

    }

}