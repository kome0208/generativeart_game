let bgSketch = (p) => {
  const numCurves = 20;

  p.setup = () => {
    let c = p.createCanvas(p.windowWidth, p.windowHeight);
    c.style('position', 'fixed')
     .style('top', '0')
     .style('left', '0')
     .style('z-index', '-1')
     .style('pointer-events', 'none');
    p.noFill();
  };

  p.draw = () => {
    p.background(0, 20);

    const w = p.width, h = p.height;
    const f = p.frameCount * 0.01;

    for (let i = 0; i < numCurves; i++) {
      let base = i * 0.1 + f;

      let y1 = p.noise(base) * h;
      let y2 = p.noise(base + 10) * h;
      let y3 = p.noise(base + 20) * h;
      let y4 = p.noise(base + 30) * h;

      let r = p.noise(base + 100) * 80;
      let g = p.noise(base + 200) * 80;
      let b = p.noise(base + 300) * 255;

      p.stroke(r, g, b, 120);
      p.bezier(0, y1, w * 0.33, y2, w * 0.66, y3, w, y4);
    }
  };

  p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
};

new p5(bgSketch);
