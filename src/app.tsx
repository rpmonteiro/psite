import { h, render, Component } from 'preact';

export class App extends Component {
  state = {
    location: '/'
  }

  componentDidMount() {
    window.addEventListener('popstate', this.updateLocation);
  }

  updateLocation = () => {
    console.log('popState', window.location.pathname);
    this.setState({ location: window.location.pathname });
  }

  render() {
    return (
      <div>This</div>
    )
  }
}
