export interface CanvasData {
  w: number;
  h: number;
  dpi: number;
  ctx: CanvasRenderingContext2D;
  cursor: string;
  canvasRef: HTMLCanvasElement;
  lastSentence: string;
  backgroundColor: string;
}
