import { h, Component, Ref } from 'preact';
import { CanvasData } from './types';
import { printSentence, setScene, clearSentence } from './hello-service';
import { pause } from '../../utils/time-utils';

export class Hello extends Component {
  private canvasData: CanvasData = {
    w: window.innerWidth,
    h: window.innerHeight,
    dpi: window.devicePixelRatio,
    ctx: null,
    cursor: '█',
    canvasRef: null,
    lastSentence: '',
    backgroundColor: '#101010'
  };

  async componentDidMount() {
    // TODO: Redirect users or go to next page, etc.
    if (!this.canvasData.canvasRef) {
      return;
    }
    setScene(this.canvasData);
    // await pause(2000);
    await printSentence(this.canvasData, 'Welcome...');
    await pause(500);
    await clearSentence(this.canvasData);
    await pause(500);
    await printSentence(this.canvasData, 'Hello, Sam. :))');
  }

  setCanvasRef = (el: HTMLCanvasElement) => {
    if (!el) {
      return;
    }
    this.canvasData.canvasRef = el;
    this.canvasData.ctx = el.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
  }

  render() {
    return (
      <div class="hello__page">
        <canvas class="hello__canvas" ref={this.setCanvasRef} />
      </div>
    );
  }
}
