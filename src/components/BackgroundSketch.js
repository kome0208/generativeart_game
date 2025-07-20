import React, { useEffect, useRef } from "react";
import p5 from "p5";

const BackgroundSketch = ({ changeCount }) => {
  const canvasRef = useRef();

  useEffect(() => {
    let particles = [];
    let numParticles = 500;
    let colorVal = 0;
    let increasing = true;

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
        p.angleMode(p.RADIANS);
        let r = 150;
        for (let i = 0; i < numParticles; i++) {
          let theta = p.random(p.TWO_PI);
          let phi = p.random(p.PI);
          let x = r * p.sin(phi) * p.cos(theta);
          let y = r * p.sin(phi) * p.sin(theta);
          let z = r * p.cos(phi);
          particles.push(p.createVector(x, y, z));
        }
      };

      p.draw = () => {
        p.background(255); // 背景は白

        // changeCount に応じて色を20ずつ変化
        if (changeCount > 0) {
          if (increasing) {
            colorVal += 20;
            if (colorVal >= 255) {
              colorVal = 255;
              increasing = false;
            }
          } else {
            colorVal -= 20;
            if (colorVal <= 0) {
              colorVal = 0;
              increasing = true;
            }
          }
        }

        p.noStroke();
        p.lights();
        p.rotateY(p.frameCount * 0.005); // ゆっくり回転

        p.fill(colorVal, 100, 200, 180); // RGBの色味

        for (let v of particles) {
          p.push();
          p.translate(v.x, v.y, v.z);
          p.sphere(2);
          p.pop();
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };
    };

    const myP5 = new p5(sketch, canvasRef.current);
    return () => myP5.remove();
  }, [changeCount]);

  return (
    <div
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
    />
  );
};

export default BackgroundSketch;
