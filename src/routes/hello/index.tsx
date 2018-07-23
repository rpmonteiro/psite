import { h, Component } from 'preact';
import { CanvasData } from './types';
import { printSentence, setScene, clearSentence, startCursorBlink, stopCursorBlink } from './hello-service';
import { pause } from '../../utils/time-utils';
import classnames from 'classnames';

interface State {
  showNextButton: boolean;
}

export class Hello extends Component<{}, State> {
  private root: HTMLDivElement;
  private canvasData: CanvasData = {
    w: window.innerWidth,
    h: window.innerHeight,
    dpi: window.devicePixelRatio,
    ctx: null,
    cursor: '█',
    canvasRef: null,
    lastSentence: '',
    cursorInterval: undefined,
    backgroundColor: '#101010'
  };

  state = {
    showNextButton: false
  };

  componentDidMount() {
    this.setupCanvas();
    this.startInitialSequence();
  }

  setupCanvas() {
    const canvas = document.createElement('canvas');
    this.canvasData.canvasRef = canvas;
    this.canvasData.ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
    this.root.appendChild(canvas);
    setScene(this.canvasData);
  }

  startInitialSequence = async () => {
    const c = this.canvasData;
    await printSentence(c, 'Wake up, internet person...');
    await pause(500);
    await clearSentence(c);
    await pause(300);
    await printSentence(c, 'The journey will begin...');
    await pause(800);
    await clearSentence(c);
    await pause(500);
    await printSentence(c, 'Or not... depends on you.');
    await pause(500);
    await clearSentence(c);
    startCursorBlink(c);
    this.setState({ showNextButton: true });
  }

  startFinalSequence = async () => {
    this.setState({ showNextButton: false });
    const c = this.canvasData;
    stopCursorBlink(c);
    await printSentence(c, 'Very well.');
    await pause(500);
  }

  setRootRef = (el: HTMLDivElement) => {
    this.root = el;
  }

  render() {
    const { showNextButton } = this.state;

    const nextButton = (
      <button
        class={classnames('hello__button', {
          'hello__button-active': showNextButton
        })}
        onClick={this.startFinalSequence}
      >
        Yeah, sure.
      </button>
    );

    return (
      <div ref={this.setRootRef} class="hello">
        <div class="hello__content">
          {nextButton}
        </div>
      </div>
    );
  }
}
