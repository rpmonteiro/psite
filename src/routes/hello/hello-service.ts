import { CanvasData } from './types';

export async function printSentence(
  canvasData: CanvasData,
  sentence: string
): Promise<void> {
  canvasData.lastSentence = sentence;
  for (let i = 0; i < sentence.length + canvasData.cursor.length; i++) {
    const text = sentence.slice(0, i);
    await new Promise((resolve) => {
      window.setTimeout(() => {
        drawText(canvasData, text);
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
  const { lastSentence } = canvasData;
  const len = lastSentence.length;
  for (let i = 0; i < len; i++) {
    const text = lastSentence.slice(0, len - i - 1);
    await new Promise((resolve) => {
      window.setTimeout(() => {
        drawText(canvasData, text);
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
  ctx.font = `normal ${28 * dpi}px monospace`;
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
  const { ctx, cursor, dpi } = canvasData;
  drawBackground(canvasData);
  ctx.fillStyle = 'white';
  ctx.shadowBlur = 9;
  ctx.fillText(text + cursor, (10 * dpi), (window.innerHeight / 3) * dpi);
  ctx.shadowBlur = 0;
  renderLines(canvasData);
}

export function drawBackground(canvasData: CanvasData): void {
  const { ctx, backgroundColor, w, h, dpi } = canvasData;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, (w * dpi), (h * dpi));
}
