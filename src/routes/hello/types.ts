import { Ref } from 'preact';

export interface CanvasData {
  w: number;
  h: number;
  ctx: CanvasRenderingContext2D;
  cursor: string;
  canvasRef: Ref<HTMLCanvasElement>;
  lastSentence: string;
  backgroundColor: string;
}
