import { promise } from '../../utils/time-utils';
import { CanvasData } from './types';

export function printSentence(
  canvasData: CanvasData,
  sentence: string
): Promise<void[]> {
  const operations: Promise<void>[] = [];
  for (let i = 0; i < sentence.length; i++) {
    const text = sentence.slice(0, i);
    operations.push(promise(() => {
      setTimeout(() => drawText(canvasData, text), i * 85);
    }));
  }
  return Promise.all(operations);
}

export function clearSentence(canvasData: CanvasData): Promise<void[]> {
  const { lastSentence } = canvasData;
  const operations: Promise<void>[] = [];
  const len = lastSentence.length;
  for (let i = 0; i < len; i++) {
    const text = lastSentence.slice(0, len - i - 1);
    operations.push(promise(() => {
      setTimeout(() => drawText(canvasData, text), i * 35);
    }));
  }
  return Promise.all(operations);
}

export function setScene() {

}

export function drawText(
  canvasData: CanvasData,
  text: string
): void {
  const { ctx, cursor } = canvasData;
  drawBackground(canvasData);
  console.log('drawing', text);
  ctx.fillStyle = 'white';
  ctx.fillText(text + cursor, 10, 10);
}

export function drawBackground(canvasData: CanvasData): void {
  const { ctx, backgroundColor, w, h } = canvasData;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, w, h);
}
