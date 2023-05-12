import Phaser from "phaser";

class Animal {
  constructor(o) {
    this.animal = o;
    this.failcountx = 0;
    this.failcounty = 0;
  }
  checkOverlap(x, y, layer) {
    var tile = layer.tilemap.getTileAtWorldXY(x + 8, y + 8);
    return tile !== null;
  }
  movingleft(layers) {
    if (this.checkOverlap(this.animal.x - 16, this.animal.y, layers)) {
      this.failcountx = this.failcountx + 1;
      if (this.failcountx >= 50) {
        this.movingdown(layers);
      }
    } else {
      this.animal.x = this.animal.x - 1;
      sleep(100);
      this.failcountx = 0;
    }
  }
  movingright(layers) {
    if (this.checkOverlap(this.animal.x + 16, this.animal.y, layers)) {
      this.failcountx = this.failcountx + 1;
      if (this.failcountx >= 50) {
        this.movingup(layers);
      }
    } else {
      this.animal.x = this.animal.x + 1;
      sleep(100);
      this.failcountx = 0;
    }
  }
  movingup(layers) {
    if (this.checkOverlap(this.animal.x, this.animal.y - 16, layers)) {
      this.failcounty = this.failcounty + 1;
      if (this.failcounty >= 50) {
        this.movingleft(layers);
      }
    } else {
      this.animal.y = this.animal.y - 1;
      sleep(100);
      this.failcounty = 0;
    }
  }

  movingdown(layers) {
    if (this.checkOverlap(this.animal.x, this.animal.y + 16, layers)) {
      this.failcounty = this.failcounty + 1;
      if (this.failcounty >= 1) {
        this.movingright(layers);
      }
    } else {
      this.animal.y = this.animal.y + 1;
      sleep(100);
      this.failcounty = 0;
    }
  }

  move(player, layers) {
    if (this.animal.x >= player.x) {
      this.movingleft(layers);
    } else {
      this.movingright(layers);
    }
    if (this.animal.y >= player.y) {
      this.movingup(layers);
    } else {
      this.movingdown(layers);
    }
    this.animal.setCollideWorldBounds(false);
  }
}

/*
function sleepByPromise(sec) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}
async function sleep(sec) {
  await sleepByPromise(sec);
}
*/

function sleep(sec) {
  (waitTime) => setTimeout(waitTime * 10);
}

export default Animal;
