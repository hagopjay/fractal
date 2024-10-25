let maxIterations = 100;
let zoomFactor = 1;
let offsetX = 0;
let offsetY = 0;
let colorOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noLoop();
}

function draw() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = map(
        x,
        0,
        width,
        -2.5 / zoomFactor + offsetX,
        1.5 / zoomFactor + offsetX
      );
      let b = map(
        y,
        0,
        height,
        -1.5 / zoomFactor + offsetY,
        1.5 / zoomFactor + offsetY
      );

      let ca = a;
      let cb = b;
      let n = 0;

      while (n < maxIterations) {
        let aa = a * a - b * b;
        let bb = 2 * a * b;
        a = aa + ca;
        b = bb + cb;
        if (abs(a + b) > 16) {
          break;
        }
        n++;
      }

      let bright = map(n, 0, maxIterations, 0, 1);
      bright = map(sqrt(bright), 0, 1, 0, 255);

      let hue = (n + colorOffset) % 256;
      let col = color(hue, 255, bright);
      let pix = (x + y * width) * 4;
      pixels[pix + 0] = red(col);
      pixels[pix + 1] = green(col);
      pixels[pix + 2] = blue(col);
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
  colorOffset++;
  requestAnimationFrame(draw);
}

function mouseWheel(event) {
  zoomFactor *= event.delta > 0 ? 0.9 : 1.1;
  redraw();
}

function mouseDragged() {
  offsetX -= (mouseX - pmouseX) / (width / (3 / zoomFactor));
  offsetY -= (mouseY - pmouseY) / (height / (3 / zoomFactor));
  redraw();
}
