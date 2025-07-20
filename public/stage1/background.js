let bgSketch = (p) => {
  let particles = [];
  let numParticles = 500;

  let bezierAlpha = 0;
  let bezierTimer = 0;
  let bezierDuration = 200;
  let controlPointsList = [];

  p.setup = function () {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');
    canvas.style('pointer-events', 'none');

    p.angleMode(p.RADIANS);

    for (let i = 0; i < numParticles; i++) {
      let theta = p.random(p.TWO_PI);
      let phi = p.random(p.PI);
      let r = 80;
      let x = r * Math.sin(phi) * Math.cos(theta);
      let y = r * Math.sin(phi) * Math.sin(theta);
      let z = r * Math.cos(phi);
      particles.push(p.createVector(x, y, z));
    }

    generateBezier();
  };

  p.draw = function () {
    p.background(0);
    p.noStroke();
    p.fill(255, 150);
    p.lights();

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        p.push();
        let x = -p.width / 4 + j * p.width / 2;
        let y = -p.height / 4 + i * p.height / 2;
        p.translate(x, y, 0);
        let t = p.millis() * 0.001 + (i + j);
        p.rotateX(t * 0.6);
        p.rotateY(t * 0.3);
        for (let pt of particles) {
          p.push();
          p.translate(pt.x, pt.y, pt.z);
          p.sphere(2);
          p.pop();
        }
        p.pop();
      }
    }

    drawBezier();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  function generateBezier() {
    controlPointsList = [];
    for (let i = 0; i < 3; i++) {
      let points = [
        p.createVector(p.random(-200, 200), p.random(-200, 200)),
        p.createVector(p.random(-100, 100), p.random(-100, 100)),
        p.createVector(p.random(-100, 100), p.random(-100, 100)),
        p.createVector(p.random(-200, 200), p.random(-200, 200))
      ];
      controlPointsList.push(points);
    }
    bezierAlpha = 255;
    bezierTimer = 0;
  }

  function drawBezier() {
    p.push();
    p.translate(0, 0, 200);
    p.strokeWeight(2);
    p.noFill();

    for (let i = 0; i < controlPointsList.length; i++) {
      let cp = controlPointsList[i];
      p.stroke(255, bezierAlpha - i * 30);
      p.beginShape();
      for (let t = 0; t <= 1.01; t += 0.01) {
        let x = p.bezierPoint(cp[0].x, cp[1].x, cp[2].x, cp[3].x, t);
        let y = p.bezierPoint(cp[0].y, cp[1].y, cp[2].y, cp[3].y, t);
        p.vertex(x, y);
      }
      p.endShape();
    }

    bezierAlpha -= 2;
    bezierTimer++;

    if (bezierTimer > bezierDuration) {
      generateBezier();
    }
    p.pop();
  }
};

// インスタンスとして起動
new p5(bgSketch);
