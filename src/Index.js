import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import App from './components/App';
import ClassifyPage from './components/ClassifyPage';
import About from './components/About';
// import InputPanel from './components/InputPanel';
import HomePage from './components/HomePage';
import InputPanel from './components/InputPanel';
import OptionsPanel from './components/OptionsPanel';

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
      <Route path="/classify" component={ClassifyPage}>
        <IndexRoute component={InputPanel}/>
        <Route path="/classify/options" component={OptionsPanel}/>
      </Route>
    </Route>
  </Router>
  , document.getElementById('root')
);
