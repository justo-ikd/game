import Phaser from "phaser";
import Animal from "./animal.js";
import platformTileMap from "./assets/platforms-tilemap.json";
import terrainImg from "./assets/Terrain/Terrain (16x16).png";
import backgroundTile from "./assets/Background/Brown.png";
import playerRunning from "./assets/Main Characters/Ninja Frog/Run (32x32).png";
import playerIdle from "./assets/Main Characters/Ninja Frog/Idle (32x32).png";
import cherryImg from "./assets/Items/Fruits/Cherries.png";
import tresureBoxImg from "./assets/treasurebox.png";
import enemyIdle from "./assets/Enemies/AngryPig/Idle (36x30).png";
import enemyRunning from "./assets/Enemies/AngryPig/Idle (36x30).png";

class MyGame extends Phaser.Scene {
  preload() {
    console.log("start0");

    this.load.image("background", backgroundTile);
    this.load.image("terrain", terrainImg);
    this.load.tilemapTiledJSON("platform-tilemap", platformTileMap);
    this.load.spritesheet("player-run", playerRunning, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("player-idle", playerIdle, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("cherry-idle", cherryImg, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("treasurebox-idle", tresureBoxImg, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("enemy-run", enemyRunning, {
      frameWidth: 36,
      frameHeight: 30
    });
    this.load.spritesheet("enemy-idle", enemyIdle, {
      frameWidth: 36,
      frameHeight: 30
    });
  }

  create() {
    this.add.tileSprite(400, 300, 800, 600, "background");
    const map = this.make.tilemap({ key: "platform-tilemap" });
    const tiles = map.addTilesetImage("terrain", "terrain");
    this.layers = map.createStaticLayer("Tile Layer 1", tiles);
    map.setCollisionByExclusion(-1, true);
    this.gameOverText = this.add.text(200, 100, "", {
      fontSize: "64px",
      fill: "#f00"
    });
    this.gameOverText.setOrigin(0.5);
    this.restartText = this.add.text(400, 350, "", {
      fontSize: "32px",
      fill: "#fff"
    });
    this.restartText.setOrigin(0.5);

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player-run", {
        start: 0,
        end: 11
      }),
      repeat: -1
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player-idle", {
        start: 0,
        end: 11
      }),
      repeat: -1
    });

    this.anims.create({
      key: "cherry",
      frames: this.anims.generateFrameNumbers("cherry-idle", {
        start: 0,
        end: 16
      }),
      repeat: -1
    });

    const cherries = this.physics.add.group({
      key: "cherry-idle",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 120 }
    });

    this.anims.create({
      key: "treasurebox",
      frames: this.anims.generateFrameNumbers("treasurebox-idle", {
        start: 0,
        end: 16
      }),
      repeat: -1
    });

    this.anims.create({
      key: "enemy-running",
      frames: this.anims.generateFrameNumbers("enemy-run", {
        start: 0,
        end: 11
      }),
      repeat: -1
    });

    this.anims.create({
      key: "enemy-idle",
      frames: this.anims.generateFrameNumbers("enemy-idle", {
        start: 0,
        end: 8
      }),
      repeat: -1
    });

    cherries.children.iterate((child) => {
      child.play("cherry");
    });

    this.player = this.physics.add.sprite(300, 100, "player-run");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    this.player.setOffset(0, -1);
    this.physics.add.collider(this.player, this.layers);
    this.physics.add.collider(cherries, this.layers);
    this.physics.add.collider(
      this.player,
      cherries,
      this.eatCherries,
      null,
      this
    );

    this.cursors = this.input.keyboard.createCursorKeys();

    this.enemy = new Animal(this.physics.add.sprite(300, 200, "enemy-run"));
    this.physics.add.collider(this.enemy.animal, this.layers);
    //this.physics.arcade.enable(this.player);
    this.physics.add.overlap(
      this.player,
      this.enemy.animal,
      (p, c) => {
        this.physics.pause();
        this.gameOver = true;
        this.gameOverText.setText("Game Over");
        this.restartText.setText("Restart: Hit Space Key");
      },
      null,
      this
    );

    this.treasureboxes = new Array(12);
    for (var i = 0; i < 12; i++) {
      var x = 0;
      var y = 0;
      this.treasureboxes[i] = this.physics.add.sprite(x, y, "treasurebox-idle");

      while (true) {
        x = Math.floor(Math.random() * 800);
        y = Math.floor(Math.random() * 600);
        this.treasureboxes[i].x = x;
        this.treasureboxes[i].y = y;
        if (checkOverlap(this.treasureboxes[i], this.layers) === true) {
          x = Math.floor(Math.random() * 800);
          y = Math.floor(Math.random() * 600);
        } else {
          break;
        }
      }
    }
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-480);
      this.player.setFlipX(true);
      this.player.anims.play("right", true);
      this.player.setVelocityY(0);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(480);
      this.player.setFlipX(false);
      this.player.anims.play("right", true);
      this.player.setVelocityY(0);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-480);
      this.player.setFlipY(false);
      this.player.anims.play("right", true);
      this.player.setVelocityX(0);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(480);
      this.player.setFlipY(false);
      this.player.anims.play("right", true);
      this.player.setVelocityX(0);
    } else {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
      this.player.anims.play("idle", true);
    }
    this.enemy.move(this.player, this.layers);
  }

  eatCherries(player, cherry) {
    cherry.disableBody(true, true);
  }
}

function checkOverlap(spriteA, spriteB) {
  var boundsA = spriteA.getBounds();
  var boundsB = spriteB.getBounds();
  return !(
    Phaser.Geom.Intersects.GetRectangleIntersection(boundsA, boundsB) !==
    undefined
  );
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "phaser3-codealong",
  physics: {
    default: "arcade",
    arcade: {
      // debug: true
    }
  },
  width: 800,
  height: 600,
  scene: MyGame
});
