import React from 'react';

export default class ImagePanel extends React.Component {
  render() {
    const imageStyleControlBox = {
      maxWidth: '400px',
      marginTop: '10px',
      margin: 'auto',
    };
    const imageControlButton = {
      minWidth: '98%',
      height: '48px',
      marginTop: '2px',
    };
    return (
      <div className="w3-row" style={imageStyleControlBox}>
        { /* This could (should) be moved to a new component */ }
        <div className="w3-col s4" style={{ textAlign: 'left' }}>
          <button className="w3-btn w3-white w3-border" style={imageControlButton}>Image</button>
        </div>
        <div className="w3-col s4" style={{ textAlign: 'center' }}>
          <button className="w3-btn w3-white w3-border" style={imageControlButton}>Difference</button>
        </div>
        <div className="w3-col s4" style={{ textAlign: 'right' }}>
          <button className="w3-btn w3-white w3-border" style={imageControlButton}>Model</button>
        </div>
      </div>
    );
  }
}
