import { h, Component, ComponentChildren, RenderableProps } from 'preact';

interface Props {
  to: string;
}

export class Link extends Component<RenderableProps<Props>> {
  clickHandler = (e: MouseEvent) => {
    e.preventDefault();
    history.pushState(null, undefined, this.props.to);
  }

  render() {
    const { to, children } = this.props;
    return (
      <a href={to} onClick={this.clickHandler}>{children}</a>
    );
  }
}
