let crazyRippleSketch = (p) => {
  let ripples = [];

  p.setup = function () {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');
    canvas.style('pointer-events', 'none');

    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noFill();
    p.frameRate(60);
  };

  p.draw = function () {
    p.background(0, 0, 0, 15); // 少し薄くして残像も優しめに

    if (p.random() < 0.017) {
      createRipple();
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      let r = ripples[i];

      p.push();
      p.translate(r.x, r.y);
      p.strokeWeight(1.2);
      for (let j = 0; j < 6; j++) {
        let noisyRadius = r.radius + p.sin(j + p.frameCount * 0.3) * 5;
        // 彩度・明度を低めに、透明度も控えめに
        p.stroke(
          (r.hue + j * 60 + p.frameCount * 10) % 360,
          30,  // 彩度30%に抑える
          70,  // 明度70%
          r.alpha * 0.4  // αを40%に減らす
        );
        p.beginShape();
        for (let a = 0; a < p.TWO_PI; a += 0.1) {
          let offset = p.noise(j * 10 + p.cos(a), j * 10 + p.sin(a)) * 5;
          let x = p.cos(a) * (noisyRadius + offset);
          let y = p.sin(a) * (noisyRadius + offset);
          p.vertex(x, y);
        }
        p.endShape(p.CLOSE);
      }
      p.pop();

      // パーティクルの色も抑えめに＆透明度控えめ
      for (let part of r.particles) {
        p.fill(
          part.hue,
          30,  // 彩度抑えめ
          70,  // 明度抑えめ
          p.random(20, 50)  // 透明度控えめに
        );
        p.noStroke();
        p.ellipse(part.x, part.y, 3);  // 少し小さめに
        part.x += part.vx;
        part.y += part.vy;
      }

      r.radius += 1 + p.sin(p.frameCount * 0.1);
      r.alpha -= 1.2;
      r.particles = r.particles.filter(
        (part) =>
          part.x >= 0 && part.x <= p.width && part.y >= 0 && part.y <= p.height
      );

      if (r.alpha <= 0 && r.particles.length === 0) {
        ripples.splice(i, 1);
      }
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  function createRipple() {
    let x = p.random(p.width);
    let y = p.random(p.height);
    let hue = p.random(360);

    let particles = [];
    for (let i = 0; i < 15; i++) {
      let angle = p.random(p.TWO_PI);
      let speed = p.random(2, 5);
      particles.push({
        x: x,
        y: y,
        vx: p.cos(angle) * speed,
        vy: p.sin(angle) * speed,
        hue: (hue + p.random(-80, 80)) % 360,
      });
    }

    ripples.push({
      x: x,
      y: y,
      radius: 0,
      alpha: 100,
      hue: hue,
      particles: particles,
    });
  }
};

new p5(crazyRippleSketch);
