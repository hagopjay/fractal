//import p5 from 'p5';

const sketch = (p5) => {
  let maxIterations = 100;
  let zoomFactor = 1;
  let offsetX = 0;
  let offsetY = 0;
  let colorOffset = 0;
  let juliaMode = false; // Toggle Julia set mode
  let juliaCX = -0.7; // Initial Julia set parameter
  let juliaCY = 0.27015;
  let colorPalette = []; // Array to store color palette

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.pixelDensity(1);
    p5.createColorPalette(); // Initialize color palette
  };

  p5.draw = () => {
    p5.loadPixels();
    for (let x = 0; x < p5.width; x++) {
      for (let y = 0; y < p5.height; y++) {
        let a, b, ca, cb;
        if (juliaMode) {
          a = p5.map(
            x,
            0,
            p5.width,
            -2 / zoomFactor + offsetX,
            2 / zoomFactor + offsetX
          );
          b = p5.map(
            y,
            0,
            p5.height,
            -2 / zoomFactor + offsetY,
            2 / zoomFactor + offsetY
          );
          ca = juliaCX;
          cb = juliaCY;
        } else {
          ca = p5.map(
            x,
            0,
            p5.width,
            -2.5 / zoomFactor + offsetX,
            1.5 / zoomFactor + offsetX
          );
          cb = p5.map(
            y,
            0,
            p5.height,
            -1.5 / zoomFactor + offsetY,
            1.5 / zoomFactor + offsetY
          );
          a = ca;
          b = cb;
        }

        let n = 0;
        while (n < maxIterations) {
          let aa = a * a - b * b;
          let bb = 2 * a * b;
          a = aa + ca;
          b = bb + cb;
          if (a * a + b * b > 16) {
            break;
          }
          n++;
        }

        let colorIndex = (n + colorOffset) % colorPalette.length;
        let col = colorPalette[colorIndex];
        let pix = (x + y * p5.width) * 4;
        p5.pixels[pix + 0] = p5.red(col);
        p5.pixels[pix + 1] = p5.green(col);
        p5.pixels[pix + 2] = p5.blue(col);
        p5.pixels[pix + 3] = 255;
      }
    }

    p5.updatePixels();
    colorOffset += 0.5; // Smooth color cycling
  };

  function mouseWheel(event) {
    zoomFactor *= event.delta > 0 ? 0.9 : 1.1;
    redraw();
  }

  function mouseDragged() {
    offsetX -= (mouseX - pmouseX) / (width / (3 / zoomFactor));
    offsetY -= (mouseY - pmouseY) / (height / (3 / zoomFactor));
    redraw();
  }
};

new p5(sketch);
