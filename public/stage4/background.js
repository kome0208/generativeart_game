let bgSketch = (p) => {
  let cols = 7;
  let rows = 5;
  let spacing = 60;
  let baseRadius = 20;
  let heightMin = 50;
  let heightMax = 150;
  let pastelColors = [];
  let particles = [];

  p.setup = () => {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');
    canvas.style('pointer-events', 'none');

    p.angleMode(p.DEGREES);
    p.noStroke();

    for (let i = 0; i < cols * rows; i++) {
      pastelColors.push(p.color(
        p.random(150, 255),
        p.random(150, 255),
        p.random(150, 255),
        240
      ));
    }

    for (let i = 0; i < 60; i++) {
      particles.push(new Particle());
    }
  };

  p.draw = () => {
    p.background(0);

    p.rotateX(80);
    p.rotateZ(p.frameCount * 0.1);

    p.ambientLight(180);
    p.directionalLight(255, 255, 255, 0, -1, -1);

    drawTriangles();
    drawParticles();
  };

  function drawTriangles() {
    let i = 0;
    for (let x = -cols / 2; x < cols / 2; x++) {
      for (let z = -rows / 2; z < rows / 2; z++) {
        let posX = x * spacing;
        let posZ = z * spacing;
        let h = p.map(p.noise(x * 0.2, z * 0.2), 0, 1, heightMin, heightMax);
        p.push();
        p.translate(posX, -h / 2, posZ);
        p.fill(pastelColors[i % pastelColors.length]);
        drawPrism(baseRadius, h);
        p.pop();
        i++;
      }
    }
  }

  // ノイズなしの普通の三角柱
  function drawPrism(radius, height) {
    let detail = 3;
    p.beginShape(p.TRIANGLES);
    for (let i = 0; i < detail; i++) {
      let angle1 = (i / detail) * 360;
      let angle2 = ((i + 1) / detail) * 360;

      let x1 = p.cos(angle1) * radius;
      let z1 = p.sin(angle1) * radius;
      let x2 = p.cos(angle2) * radius;
      let z2 = p.sin(angle2) * radius;

      // 下底
      p.vertex(x1, height / 2, z1);
      p.vertex(x2, height / 2, z2);
      p.vertex(0, height / 2, 0);

      // 上底
      p.vertex(x1, -height / 2, z1);
      p.vertex(x2, -height / 2, z2);
      p.vertex(0, -height / 2, 0);

      // 側面
      p.vertex(x1, height / 2, z1);
      p.vertex(x2, height / 2, z2);
      p.vertex(x1, -height / 2, z1);

      p.vertex(x1, -height / 2, z1);
      p.vertex(x2, -height / 2, z2);
      p.vertex(x2, height / 2, z2);
    }
    p.endShape();
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = p.random(-p.width / 2, p.width / 2);
      this.y = p.random(-p.height / 2, p.height / 2);
      this.z = p.random(-500, 500);
      this.speed = p.random(0.3, 1);
      this.size = p.random(1, 3);
    }

    update() {
      this.y += this.speed;
      if (this.y > p.height / 2) {
        this.reset();
        this.y = -p.height / 2;
      }
    }

    display() {
      p.push();
      p.translate(this.x, this.y, this.z);
      p.fill(255, 200);
      p.sphere(this.size);
      p.pop();
    }
  }

  function drawParticles() {
    for (let particle of particles) {
      particle.update();
      particle.display();
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(bgSketch);
