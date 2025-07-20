let deepSeaSketch = (p) => {
  let bubbles = [];
  let numBubbles = 60;

  let lastSpinTime = 0;
  let spinning = false;
  let spinDuration = 300; // スピン演出時間(ms)
  let spinSpeed = 0.15;

  let showOrbitEffect = false;
  let orbitEffectAlpha = 0;
  let orbitRings = 6;

  p.setup = function () {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');
    canvas.style('pointer-events', 'none');

    for (let i = 0; i < numBubbles; i++) {
      bubbles.push(new Bubble(p.random(p.TWO_PI), p.random(0, 1)));
    }
  };

  p.draw = function () {
    p.background(5, 10, 20);
    let currentTime = p.millis();

    // 5秒毎にスピン演出開始
    if (!spinning && currentTime - lastSpinTime > 5000) {
      spinning = true;
      lastSpinTime = currentTime;
      showOrbitEffect = true;
      orbitEffectAlpha = 255; // 表示開始は不透明に
    }

    // スピン演出終了判定
    if (spinning && currentTime - lastSpinTime > spinDuration) {
      spinning = false;
    }

    // エフェクト表示・フェードアウト処理
    if (showOrbitEffect) {
      orbitEffectAlpha -= 8; // フェードアウト速め
      if (orbitEffectAlpha <= 0) {
        orbitEffectAlpha = 0;
        showOrbitEffect = false;
      }
    }

    // 泡描画
    for (let b of bubbles) {
      b.update(spinning);
      b.display();
    }

    // エフェクト描画（スピン中またはフェードアウト中のみ）
    if (showOrbitEffect || spinning) {
      p.push();
      p.rotateZ(currentTime * 0.01); // ゆっくり回転させる
      p.noFill();
      p.stroke(255, orbitEffectAlpha * 0.12); // 薄め（12%の透明度）
      p.strokeWeight(6);

      let minRadius = p.min(p.width, p.height) * 0.4;
      let widthRadius = p.min(p.width, p.height) * 0.5;

      for (let i = 0; i < orbitRings; i++) {
        let radius = minRadius + (widthRadius / (orbitRings - 1)) * i;
        let angleOffset = (currentTime * 0.01) + i * p.TWO_PI / orbitRings;
        let offsetX = p.cos(angleOffset) * 5;
        let offsetY = p.sin(angleOffset) * 5;

        p.push();
        p.translate(offsetX, offsetY);
        p.ellipse(0, 0, radius * 2);
        p.pop();
      }
      p.pop();
    }

    // 目の出現（10秒に1秒）
    let eyeCycle = currentTime % 10000;
    if (eyeCycle < 1000) {
      let fadeAlpha = p.map(p.sin((eyeCycle / 1000) * p.PI), 0, 1, 0, 255);
      drawEyes(currentTime, fadeAlpha, eyeCycle / 1000);
    }
  };

  class Bubble {
    constructor(angle, t) {
      this.angle = angle; // 角度(rad)
      this.t = t; // 螺旋進行量(0〜1)
      this.size = p.random(3, 8);
      this.z = p.random(-1000, -100);
      this.baseX = p.random(-p.width / 3, p.width / 3);
      this.baseY = p.random(-p.height / 3, p.height / 3);
    }

    update(spinning) {
      if (spinning) {
        // スピン中：スパイラル運動（XY）、Zは普通に近づく
        const maxRadius = p.min(p.width, p.height) / 2;
        this.angle += spinSpeed;
        this.t += 0.02;
        if (this.t > 1) this.t = 0;
        this.radius = this.t * maxRadius;

        this.x = this.radius * p.cos(this.angle);
        this.y = this.radius * p.sin(this.angle);
        this.z += 3;
      } else {
        // 普通の動き
        this.x = this.baseX + p.random(-0.5, 0.5);
        this.y = this.baseY + p.random(-0.5, 0.5);
        this.z += 2;
      }

      if (this.z > 0) {
        this.z = p.random(-1000, -100);
        this.t = p.random(0, 1);
        this.angle = p.random(p.TWO_PI);
        this.baseX = p.random(-p.width / 3, p.width / 3);
        this.baseY = p.random(-p.height / 3, p.height / 3);
      }
    }

    display() {
      p.push();
      p.translate(this.x, this.y, this.z);
      p.noStroke();
      p.fill(180, 180);
      p.sphere(this.size);
      p.pop();
    }
  }

  function drawEyes(t, alpha, phase) {
    let pulse = p.sin(t * 0.01) * 3;
    let eyeSize = 20 + pulse;
    let pupilOffsetX = p.map(p.mouseX, 0, p.width, -eyeSize / 4, eyeSize / 4);
    let pupilOffsetY = p.map(p.mouseY, 0, p.height, -eyeSize / 4, eyeSize / 4);
    let blink = p.abs(p.sin(phase * p.PI));
    let eyelidOffset = p.map(blink, 0, 1, eyeSize * 2, 0);

    p.push();
    p.translate(0, 0, -800);
    drawOneEye(-30, eyeSize, pupilOffsetX, pupilOffsetY, eyelidOffset, alpha);
    drawOneEye(30, eyeSize, pupilOffsetX, pupilOffsetY, eyelidOffset, alpha);
    p.pop();
  }

  function drawOneEye(xOffset, eyeSize, pupilOffsetX, pupilOffsetY, eyelidOffset, alpha) {
    p.push();
    p.translate(xOffset, 0, 0);

    p.ambientLight(100);
    p.directionalLight(255, 255, 255, 0, 0, -1);
    p.noStroke();
    p.fill(255, 100, 50, alpha);
    p.sphere(eyeSize);

    p.push();
    p.translate(pupilOffsetX, pupilOffsetY, eyeSize);
    p.rotateX(p.HALF_PI);
    p.fill(0, alpha);
    p.cylinder(eyeSize * 0.05, eyeSize * 1.2);
    p.pop();

    p.push();
    p.translate(0, -eyelidOffset, eyeSize / 2 + 2);
    p.rotateX(p.PI / 2);
    p.fill(5, 10, 20, alpha);
    p.plane(eyeSize * 2.2, eyeSize * 1.5);
    p.pop();

    p.push();
    p.translate(0, eyelidOffset, eyeSize / 2 + 2);
    p.rotateX(p.PI / 2);
    p.fill(5, 10, 20, alpha);
    p.plane(eyeSize * 2.2, eyeSize * 1.5);
    p.pop();

    p.pop();
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(deepSeaSketch);
