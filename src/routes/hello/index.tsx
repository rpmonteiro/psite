import { h, Component, Ref } from 'preact';
import { pause, promise } from '../../utils/time-utils';
import { CanvasData } from './types';

export class Hello extends Component {
  private canvasData: CanvasData = {
    w: window.innerWidth,
    h: window.innerHeight / 2,
    ctx: CanvasRenderingContext2D,
    cursor: '█',
    canvasRef: HTMLCanvasElement,
    lastSentence: '',
    backgroundColor: '#101010'
  };

  async componentDidMount() {
    // TODO: Redirect users or go to next page, etc.
    if (!this.canvasData.canvasRef) {
      return;
    }
    setSceneProps();
    drawBackground();
    await this.printSentence('Hello, Sam. :))');
    console.log('promised resolve');
    await pause(2000);
    await this.clearSentence();
    console.log('promised resolve');
  }

  clearSentence = () => {
    const operations: Promise<void>[] = [];
    const len = this.lastSentence.length;
    for (let i = 0; i < len; i++) {
      const text = this.lastSentence.slice(0, len - i - 1);
      operations.push(promise(() => {
        setTimeout(() => this.drawText(text), i * 35);
      }));
    }
    return Promise.resolve();
  }

  printSentence = (sentence: string): Promise<void[]> => {
    const operations: Promise<void>[] = [];
    this.lastSentence = sentence;
    for (let i = 0; i < sentence.length; i++) {
      const text = sentence.slice(0, i);
      operations.push(promise(() => {
        setTimeout(() => this.drawText(text), i * 85);
      }));
    }
    return Promise.all(operations);
  }

  setCanvasRef = (el: HTMLCanvasElement) => {
    if (!el) {
      return;
    }
    this.canvas = el;
    this.ctx = el.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
  }

  render() {
    return (
      <div class="hello__page">
        <canvas class="hello__canvas" ref={this.setCanvasRef} />
      </div>
    );
  }
}
