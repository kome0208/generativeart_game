let bubbleSketch = (p) => {
  let bubbles = [];

  class Bubble {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = p.random(-p.width / 2, p.width / 2);
      this.y = p.random(-p.height / 2, p.height / 2);
      this.z = p.random(-1000, -100);
      this.size = p.random(2, 10);
    }

    update() {
      this.x += p.random(-1, 1);
      this.y += p.random(-1, 1);
      this.z += 5;

      if (this.z > 0) {
        this.reset();
      }
    }

    display() {
      p.push();
      p.translate(this.x, this.y, this.z);
      p.noStroke();
      p.fill(255, 255, 255, 100);
      p.sphere(this.size);
      p.pop();
    }
  }

  p.setup = () => {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');
    canvas.style('pointer-events', 'none');

    for (let i = 0; i < 200; i++) {
      bubbles.push(new Bubble());
    }
  };

  p.draw = () => {
    p.background(10, 30, 60); // 深海っぽい色

    for (let b of bubbles) {
      b.update();
      b.display();
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

// インスタンスとして起動
new p5(bubbleSketch);
