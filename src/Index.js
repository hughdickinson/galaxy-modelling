import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import App from './components/App';
import Classify from './components/Classify';
import About from './components/About';
// import InputPanel from './components/InputPanel';
import HomePage from './components/HomePage';

// Todo: let's find a better way to include Styles,
// currently Styles looks like an unused var to eslint
/* eslint "no-unused-vars": 1 */
import Styles from './styles/main.styl';

window.React = React;

// const InputPanelWrapper = <InputPanel name="Tim" />;

ReactDOM.render(
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={HomePage}/>
      <Route path="/about" component={About}/>
      <Route path="/classify" component={Classify}/>
    </Route>
  </Router>
  , document.getElementById('root')
);
