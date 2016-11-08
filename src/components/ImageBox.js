import React from 'react';
import { modelShouldRender } from '../CustomGlobalCallbacks.js';

export default class ImageBox extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    /* the image box is now mounted, we can get the canvas context and trigger
      the rendering of the default galaxy */
    modelShouldRender();
  }
  render() {
    const imageStyle = {
      maxWidth: '400px',
      height: '400px',
      backgroundColor: '#fff',
      color: 'white',
      margin: 'auto',
      textAlign: 'center',
    };
    const canvasStyle = {
      width: '400px',
      height: '400px',
      backgroundColor: '#000',
      margin: 'auto',
      textAlign: 'center',
      zIndex: 0,
    };
    const canvasHeight = 400;
    const canvasWidth = 400;
    return (
      <div className="w3-row" style={imageStyle}>
        <canvas id="galaxyCanvas" height={canvasHeight} width={canvasWidth}
          style={canvasStyle}
        ></canvas>
      </div>
    );
  }
}
ImageBox.propTypes = { components: React.PropTypes.array };
ImageBox.defaultProps = { components: Array() };
