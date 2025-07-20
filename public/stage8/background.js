let kaleidoSketch = (p) => {
  let angleStep = 3;
  let t = 0;

  p.setup = () => {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noStroke();
    p.frameRate(30);
    p.background(0); // 最初だけ完全な黒で背景クリア
  };

  p.draw = () => {
    // 黒で透明レイヤー（≒フェード）を重ねて背景を暗くしつつ、前フレームを少し残す
    p.noStroke();
    p.fill(0, 0, 0, 10); // HSBの黒（明度0）、透明度10 → 白くならない
    p.rect(0, 0, p.width, p.height);

    p.translate(p.width / 2, p.height / 2);
    let radius = p.min(p.width, p.height) * 0.45;

    for (let i = 0; i < 360; i += angleStep) {
      p.push();
      p.rotate(p.radians(i));

      let x = radius * p.sin(t + i * 0.1 + p.noise(i, t * 0.01) * 3);
      let y = radius * p.cos(t + i * 0.2 + p.noise(i + 999, t * 0.01) * 3);

      let hue = (t * 3 + i * 2 + p.noise(i * 2, t * 0.01) * 360) % 360;
      let sat = 90 + p.sin(t * 0.07 + i) * 10;
      let bright = 90 + p.cos(t * 0.05 + i) * 10;

      p.fill(hue, sat, bright, 90);
      p.ellipse(x, y, 6 + p.sin(t + i) * 2);

      p.pop();
    }

    t += 0.03;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(kaleidoSketch);
