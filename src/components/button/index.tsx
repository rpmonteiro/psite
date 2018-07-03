import { h, Component } from 'preact';
import { Link } from '../link';

interface Props {
  text: string;
  to?: string;
  containerClass?: string;
}

export class Button extends Component<Props> {
  render() {
    const { text, containerClass, to } = this.props;

    const buttonText = (
      <span class="button__text">
        {text}
      </span>
    );

    const childEl = to
      ? <Link to={to}>{buttonText}</Link>
      : buttonText;

    return (
      <div class={containerClass || 'button__container'}>
        <button class="button">
          {childEl}
        </button>
      </div>
    );
  }
}
