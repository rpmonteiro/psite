import { h, render, Component } from 'preact';
import { Home } from './routes/home';
import { NotFound } from './routes/not-found';
import { About } from './routes/about';
import { Link } from './components/link';
import { pushStateMonkeyPatch } from './utils/monkey-patch';
import { NavBar } from './components/navbar';

interface State {
  location: string;
}

export class App extends Component<{}, State> {
  state = {
    location: window.location.pathname
  };

  componentDidMount() {
    pushStateMonkeyPatch();
    window.addEventListener('pushstate', this.updateLocation);
  }

  updateLocation = () => {
    this.setState({ location: window.location.pathname });
  }

  render() {
    const { location } = this.state;

    let component;
    switch (location) {
      case '/':
        component = <Home />;
        break;
      case '/about':
        component = <About />;
        break;
      default:
        component = <NotFound />;
        break;
    }

    return (
      <div class="app">
        <NavBar />
        {component}
      </div>
    );
  }
}
