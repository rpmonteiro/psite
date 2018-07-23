import { CanvasData } from './types';
import { pause } from '../../utils/time-utils';

// tslint:disable-next-line:max-line-length
const CHAR_SIZE = 13;
// tslint:disable-next-line:max-line-length
const CHARACTERS = '日アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
const CHARS_LENGTH = CHARACTERS.length;
const FILL_STYLES = [
  'rgba(255,255,255,1)',
  'rgba(179,178,179,1)',
  'rgba(112,111,112,1)',
  'rgba(88,106,94,1)',
  'rgba(29,98,32,1)',
  'rgba(29,98,32,0.8)',
  'rgba(29,98,32,0.6)',
  'rgba(29,98,32,0.4)',
  'rgba(29,98,32,0.2)',
  'rgba(29,98,32,0)',
];

export async function printSentence(
  canvasData: CanvasData,
  sentence: string
): Promise<void> {
  canvasData.lastSentence = sentence;
  for (let i = 0; i < sentence.length + canvasData.cursor.length; i++) {
    const text = sentence.slice(0, i);
    await new Promise((resolve) => {
      window.setTimeout(() => {
        drawText(canvasData, text + canvasData.cursor);
        resolve();
      }, getKeystrokeDuration());
    });
  }

  return Promise.resolve();
}

function getKeystrokeDuration() {
  const min = 80;
  const max = 115;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderLines(canvasData: CanvasData) {
  const { h, ctx, w, dpi } = canvasData;
  ctx.beginPath();
  for (let i = 0; i < (h * dpi) / 2; i += 1) {
    ctx.moveTo(0, (i * 2) + .5);
    ctx.lineTo((w * dpi), (i * 2) + .5);
  }
  ctx.stroke();
}

export async function clearSentence(canvasData: CanvasData): Promise<void> {
  const { lastSentence, cursor } = canvasData;
  const len = lastSentence.length;
  for (let i = 0; i < len; i++) {
    const text = lastSentence.slice(0, len - i - 1);
    await new Promise((resolve) => {
      window.setTimeout(() => {
        drawText(canvasData, text + cursor);
        resolve();
        // simulate the standard behaviour of deleting text, where
        // there's a delay between the 1st and the other chars being deleted
      }, i === 1 ? 300 : 60);
    });
  }
  return Promise.resolve();
}

function fixDpi(canvasData: CanvasData): void {
  const { canvasRef, w, h, dpi } = canvasData;
  canvasRef.width = w * dpi;
  canvasRef.height = h * dpi;
}

export function setScene(canvasData: CanvasData): void {
  const { ctx, dpi } = canvasData;
  fixDpi(canvasData);
  ctx.font = `normal ${20 * dpi}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = 'rgba(0, 0, 0, .3)';
  ctx.shadowColor = '#3f3';
}

export function drawText(
  canvasData: CanvasData,
  text: string
): void {
  const { ctx, dpi } = canvasData;
  drawBackground(canvasData);
  ctx.fillStyle = 'white';
  ctx.shadowBlur = 9;
  ctx.fillText(text, (10 * dpi), (window.innerHeight / 5) * dpi);
  ctx.shadowBlur = 0;
  renderLines(canvasData);
}

export function drawBackground(canvasData: CanvasData): void {
  const { ctx, backgroundColor, w, h, dpi } = canvasData;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, (w * dpi), (h * dpi));
}

export function startCursorBlink(canvasData: CanvasData): void {
  canvasData.cursorInterval = window.setInterval(async () => {
    drawText(canvasData, canvasData.cursor);
    await pause(500);
    drawBackground(canvasData);
  }, 1000);
}

export function stopCursorBlink(canvasData: CanvasData): void {
  window.clearInterval(canvasData.cursorInterval);
}

interface Drop {
  dropLength: number;
  dropChars: Char[];
  fadeIndex: number;
  numToFade: number;
  initDropYPos: number;
  dropXPos: number;
}

export function startRainAnimation(canvasData: CanvasData): void {
  const { canvasRef, dpi, h, w } = canvasData;
  const canvasHeight = h * dpi;
  const canvasWidth = w * dpi;
  const takenXPos: number[] = [];
  const drops: Drop[] = [];
  const numXPos = Math.ceil((canvasWidth) / CHAR_SIZE);
  const numYPos = Math.ceil(((canvasHeight) * 3) / CHAR_SIZE);
  const minNumDrops = Math.ceil(0.8 * numXPos);
  const maxNumDrops = numXPos;
  const numDrops = Math.floor(Math.random() * ((maxNumDrops - minNumDrops) + 1)) + minNumDrops;

  function isXTaken(x: number): boolean {
    return takenXPos.indexOf(x) > -1;
  }

  function createDrop(): Drop {
    const drop: Drop = {
      dropLength: Math.floor(
        Math.random()
        * ((((canvasHeight / CHAR_SIZE) * 3)
          - (canvasHeight / CHAR_SIZE)) + 1)
      ) + (canvasHeight / CHAR_SIZE),
      dropChars: [],
      fadeIndex: 0,
      numToFade: 1,
      initDropYPos: 0 - (Math.round(Math.random() * numYPos) * CHAR_SIZE),
      dropXPos: Math.round(Math.random() * numXPos) * CHAR_SIZE
    };

    while (isXTaken(drop.dropXPos)) {
      drop.dropXPos = Math.round(Math.random() * numXPos) * CHAR_SIZE;
    }

    takenXPos.push(drop.dropXPos);
    return drop;
  }

  for (let i = 0; i < numDrops; i++) {
    drops[i] = createDrop();
  }

  drawChars(canvasData, drops);

  // Interval for randomly changing a random character
  // in all drops
  const changeInterval = window.setInterval(() => {
    const indexToChange = [];
    const randomChar = [];
    const charsLength = CHARACTERS.length;

    for (let i = 0; i < drops.length; i++) {
      if (drops[i].dropChars.length === 0) {
        break;
      }
      indexToChange[i] = Math.floor(Math.random() * drops[i].dropChars.length);
      randomChar[i] = CHARACTERS.charAt(Math.floor(Math.random() * charsLength));

      drops[i].dropChars[indexToChange[i]].char = randomChar[i];
    }
  }, 30);
}

interface Char {
  x: number;
  y: number;
  i: number;
  char: string;
  fillStyle: string;
  fillStyleIndex: number;
}

// Constructor for a single character
// tslint:disable-next-line:function-name
function makeChar(x: number, y: number, i: number): Char {
  return {
    x,
    y,
    i,
    char: CHARACTERS.charAt(Math.floor(Math.random() * CHARS_LENGTH)),
    fillStyle: FILL_STYLES[0],
    fillStyleIndex: 0,
  };
}

// Draws all drop characters
function drawChars(canvasData: CanvasData, drops: Drop[]) {
  const { dpi, h, w, ctx } = canvasData;
  const canvasHeight = h * dpi;
  const canvasWidth = w * dpi;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Iterate through each drop. At each iteration
  // add a new character to the drop. Change the style
  // to add white to green effect in the front, and
  // fading to black tail. Draw all characters then reset
  // every drop whose tail reaches the bottom of the screen
  for (let n = 0; n < drops.length; n++) {
    const drop = drops[n];

    // Add new character
    if (drop.dropChars.length === 0) {
      drop.dropChars[0] = makeChar(drop.dropXPos, drop.initDropYPos, 0);
    } else {
      const previousChar = drop.dropChars[drop.dropChars.length - 1];
      drop.dropChars[previousChar.i + 1] = makeChar(
        drop.dropXPos,
        previousChar.y + CHAR_SIZE,
        previousChar.i + 1
      );
    }

    // Create white fading to green front
    if (drop.dropChars.length > 1) {
      let currentChar;
      let currentFillStyle;
      for (
        currentChar = drop.dropChars.length - 1,
        currentFillStyle = 0; currentChar >= 0 && currentFillStyle < 5;
        currentFillStyle++ ,
        currentChar--
      ) {
        drop.dropChars[currentChar].fillStyleIndex = currentFillStyle;
        drop.dropChars[currentChar].fillStyle = FILL_STYLES[currentFillStyle];
      }
    }

    // Fade tail
    if (drop.dropChars.length > drop.dropLength) {
      if (drop.dropChars[drop.fadeIndex].fillStyleIndex > 8) {
        drop.fadeIndex++;
      }

      for (let f = 0; f < drop.numToFade && drop.fadeIndex + f < drop.dropChars.length; f++) {
        drop.dropChars[drop.fadeIndex + f].fillStyleIndex++;
        drop.dropChars[drop.fadeIndex + f].fillStyle =
          FILL_STYLES[drop.dropChars[drop.fadeIndex + f].fillStyleIndex];
      }
      drop.numToFade++;
    }

    // Draw all chars
    for (let c = 0; c < drop.dropChars.length; c++) {
      ctx.fillStyle = drop.dropChars[c].fillStyle;
      ctx.fillText(drop.dropChars[c].char, drop.dropChars[c].xPos, drop.dropChars[c].yPos);
    }

    // Reset drop
    // Remove from taken x pos when done
    // if (drop.fadeIndex > (canvas.height/ charSize)) {
    if (drop.dropChars[drop.fadeIndex].yPos > canvas.height) {
      const indexOfXPos = takenXPos.indexOf(drop.dropXPos);
      takenXPos.splice(indexOfXPos, 1);

      drops[n] = new Drop();
    }
  }

  // Animate drops
  setTimeout(function () {
    requestAnimationFrame(function () {
      drawChars(drops);
    });
  }, 50);
}
