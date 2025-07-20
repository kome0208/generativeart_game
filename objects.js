let lanes = [50, 150, 250, 350];

let bagSprite, canSprite, spannerSprite;
let bagFrames = [], canFrames = [], spannerFrames = [];

let frameInterval = 6;

function preloadAssets() {
  bagSprite = loadImage('images/bag-sprite.png');
  canSprite = loadImage('images/kan.png');
  spannerSprite = loadImage('images/supana.png');
}

function setupFrames(spriteSheet, frameArray) {
  let totalCols = 2;
  let totalRows = 2;
  let frameWidth = spriteSheet.width / totalCols;
  let frameHeight = spriteSheet.height / totalRows;

  for (let row = 0; row < totalRows; row++) {
    for (let col = 0; col < totalCols; col++) {
      let frame = spriteSheet.get(
        col * frameWidth,
        row * frameHeight,
        frameWidth,
        frameHeight
      );
      frameArray.push(frame);
    }
  }
}

// プレイヤー（レジ袋）
class Player {
  constructor() {
    this.lane = 1;
    this.y = 550;
    this.frameIndex = 0;
    this.frameCounter = 0;
  }

  moveLeft() {
    if (this.lane > 0) this.lane--;
  }

  moveRight() {
    if (this.lane < 3) this.lane++;
  }

  updateFrame() {
    this.frameCounter++;
    if (this.frameCounter >= frameInterval) {
      this.frameIndex = (this.frameIndex + 1) % bagFrames.length;
      this.frameCounter = 0;
    }
  }

  show() {
    imageMode(CENTER);
    image(bagFrames[this.frameIndex], lanes[this.lane], this.y);
    this.updateFrame();
  }
}

// 敵（スパナ or カン）
class Enemy {
  constructor(type, speed) {
    this.laneIndex = floor(random(4));
    this.x = lanes[this.laneIndex];
    this.y = 0;
    this.type = type;
    this.speed = speed; // ← ★ ここでスピードを受け取る
    this.frameIndex = 0;
    this.frameCounter = 0;
  }

  update() {
    this.y += this.speed * deltaTime / 1000; // ← ★ フレームに依存しない安定した落下

    this.frameCounter++;
    if (this.frameCounter >= frameInterval) {
      if (this.type === "can") {
        this.frameIndex = (this.frameIndex + 1) % canFrames.length;
      } else {
        this.frameIndex = (this.frameIndex + 1) % spannerFrames.length;
      }
      this.frameCounter = 0;
    }
  }

  show() {
    imageMode(CENTER);
    if (this.type === "can") {
      image(canFrames[this.frameIndex], this.x, this.y);
    } else {
      image(spannerFrames[this.frameIndex], this.x, this.y);
    }
  }

  isColliding(player) {
    return dist(this.x, this.y, lanes[player.lane], player.y) < 30;
  }
}
