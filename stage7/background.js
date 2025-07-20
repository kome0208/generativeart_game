let deepSkySketch = (p) => {
  let path = [];
  let pathLength = 100;
  let t = 0;

  let numStars = 150;
  let stars = [];

  p.setup = function () {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');
    canvas.style('pointer-events', 'none');

    p.colorMode(p.HSB, 360, 100, 100, 255);
    p.noStroke();

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: p.random(p.width),
        y: p.random(p.height / 2),
        size: p.random(1, 3),
        brightness: p.random(150, 255)
      });
    }
  };

  p.draw = function () {
    p.background(0);

    drawStars();

    let centerX = p.width / 2 + p.sin(t * 0.02) * 100;

    path.push({
      x: centerX,
      hue: (t * 8) % 360
    });
    if (path.length > pathLength) path.shift();

    for (let i = path.length - 1; i > 0; i--) {
      let prev = path[i];
      let curr = path[i - 1];

      let hueVal = curr.hue;

      let y1 = p.map(i, 0, path.length, p.height, p.height / 2);
      let y2 = p.map(i - 1, 0, path.length, p.height, p.height / 2);

      let w1 = p.map(i, 0, path.length, p.width, 2);
      let w2 = p.map(i - 1, 0, path.length, p.width, 2);

      p.fill(hueVal, 80, 100, 150);
      p.beginShape();
      p.vertex(prev.x - w1 / 2, y1);
      p.vertex(prev.x + w1 / 2, y1);
      p.vertex(curr.x + w2 / 2, y2);
      p.vertex(curr.x - w2 / 2, y2);
      p.endShape(p.CLOSE);
    }

    // 中央の水平線
    p.stroke(255, 150);
    p.strokeWeight(1);
    p.line(0, p.height / 2, p.width, p.height / 2);
    p.noStroke();

    t++;
  };

  function drawStars() {
    for (let star of stars) {
      p.fill(0, 0, 100, star.brightness);
      p.circle(star.x, star.y, star.size);
    }
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(deepSkySketch);
