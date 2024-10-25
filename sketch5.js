let maxIterations = 100;
let zoomFactor = 1;
let targetZoom = 1;
let offsetX = 0;
let offsetY = 0;
let targetOffsetX = 0;
let targetOffsetY = 0;
let colorOffset = 0;
let juliaMode = false;
let juliaCX = -0.7;
let juliaCY = 0.27015;
let colorPalette = [];
let autoZoom = true;
let autoZoomSpeed = 0.005;
let autoMoveSpeed = 0.0005;
let hueShift = 0;
let psychedelicMode = false;
let colorRotationSpeed = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  colorMode(HSB, 360, 100, 100);
  createColorPalette();

  // Add event listeners for buttons
  document
    .getElementById('psychedelicMode')
    .addEventListener('click', togglePsychedelicMode);
  document
    .getElementById('resetFractal')
    .addEventListener('click', resetFractal);
}

function draw() {
  if (autoZoom) {
    targetZoom *= 1 + autoZoomSpeed;
    targetOffsetX += ((random(-1, 1) * width) / 4 - offsetX) * autoMoveSpeed;
    targetOffsetY += ((random(-1, 1) * height) / 4 - offsetY) * autoMoveSpeed;
  }

  zoomFactor = lerp(zoomFactor, targetZoom, 0.05);
  offsetX = lerp(offsetX, targetOffsetX, 0.05);
  offsetY = lerp(offsetY, targetOffsetY, 0.05);

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
  colorOffset += colorRotationSpeed;
  hueShift += colorRotationSpeed;
  updateColorPalette();

  // Update stats
  updateStats();
}

function mouseWheel(event) {
  if (!autoZoom) {
    targetZoom *= event.delta > 0 ? 0.9 : 1.1;
  }
  return false;
}

function mouseDragged() {
  if (!autoZoom) {
    targetOffsetX -= (mouseX - pmouseX) / (width / (3 / zoomFactor));
    targetOffsetY -= (mouseY - pmouseY) / (height / (3 / zoomFactor));
  }
}

function createColorPalette() {
  for (let i = 0; i < 360; i++) {
    colorPalette.push(color(i, 100, 100));
  }
}

function updateColorPalette() {
  for (let i = 0; i < 360; i++) {
    let hue = (i + hueShift) % 360;
    colorPalette[i] = color(hue, 100, 100);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === ' ') {
    autoZoom = !autoZoom;
    if (!autoZoom) {
      targetZoom = zoomFactor;
      targetOffsetX = offsetX;
      targetOffsetY = offsetY;
    }
  } else if (key === 'j' || key === 'J') {
    juliaMode = !juliaMode;
  }
}

function mousePressed() {
  if (autoZoom) {
    juliaCX = map(mouseX, 0, width, -2, 2);
    juliaCY = map(mouseY, 0, height, -2, 2);
  }
}

function togglePsychedelicMode() {
  psychedelicMode = !psychedelicMode;
  colorRotationSpeed = psychedelicMode ? 0.1 : 0.01;
  document.getElementById('systemMessage').textContent = psychedelicMode
    ? 'Psychedelic mode activated!'
    : 'Normal mode';
}

function resetFractal() {
  zoomFactor = 1;
  targetZoom = 1;
  offsetX = 0;
  offsetY = 0;
  targetOffsetX = 0;
  targetOffsetY = 0;
  colorOffset = 0;
  hueShift = 0;
  juliaMode = false;
  autoZoom = true;
  document.getElementById('systemMessage').textContent = 'Fractal reset';
}

function updateStats() {
  document.getElementById('cpuUsage').textContent = (
    (frameRate() / 60) *
    100
  ).toFixed(2);
  document.getElementById('fps').textContent = frameRate().toFixed(2);
}
