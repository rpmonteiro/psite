import { h } from 'preact';
import { Link } from '../link';

export const NavBar = () => (
  <nav class="navbar">
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
    </ul>
  </nav>
);
