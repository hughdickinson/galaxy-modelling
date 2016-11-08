import React from 'react';
import { modelShouldRender } from '../CustomGlobalCallbacks.js';

export default class RenderButton extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick(e) {
    e.preventDefault();
    console.log(e.target);
    return;
  }
  render() {
    const buttonClasses = 'w3-btn w3-xxlarge w3-round w3-dark-grey w3-border';
    return (
        <button type="button" className={buttonClasses} onClick={modelShouldRender}>Render</button>
    );
  }
}
