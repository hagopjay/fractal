let maxIterations = 100;
let zoomFactor = 1;
let offsetX = 0;
let offsetY = 0;
let colorOffset = 0;
let juliaMode = false;
let juliaCX = -0.7;
let juliaCY = 0.27015;
let colorPalette = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  createColorPalette();
}

function draw() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a, b, ca, cb;
      if (juliaMode) {
        a = map(
          x,
          0,
          width,
          -2 / zoomFactor + offsetX,
          2 / zoomFactor + offsetX
        );
        b = map(
          y,
          0,
          height,
          -2 / zoomFactor + offsetY,
          2 / zoomFactor + offsetY
        );
        ca = juliaCX;
        cb = juliaCY;
      } else {
        ca = map(
          x,
          0,
          width,
          -2.5 / zoomFactor + offsetX,
          1.5 / zoomFactor + offsetX
        );
        cb = map(
          y,
          0,
          height,
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

      let colorIndex = Math.floor((n + colorOffset) % colorPalette.length);
      let col = colorPalette[colorIndex];
      let pix = (x + y * width) * 4;
      pixels[pix + 0] = red(col);
      pixels[pix + 1] = green(col);
      pixels[pix + 2] = blue(col);
      pixels[pix + 3] = 255;
    }
  }

  updatePixels();
  colorOffset += 0.5;
}

function mouseWheel(event) {
  zoomFactor *= event.delta > 0 ? 0.9 : 1.1;
  redraw();
  return false;
}

function mouseDragged() {
  offsetX -= (mouseX - pmouseX) / (width / (3 / zoomFactor));
  offsetY -= (mouseY - pmouseY) / (height / (3 / zoomFactor));
  redraw();
}

function createColorPalette() {
  for (let i = 0; i < 360; i++) {
    colorPalette.push(color(i, 100, 100));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
