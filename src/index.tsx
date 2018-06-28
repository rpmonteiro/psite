import { h, render, Component } from 'preact';
import { App } from './app';

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}
const node = document.getElementById('app') as Element;
render(<App />, node as Element, node.lastChild as Element);

if (module.hot) {
  module.hot.accept();
}