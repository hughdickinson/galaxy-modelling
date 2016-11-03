import React from 'react';
import InputPanel from './InputPanel';
import ImagePanel from './ImagePanel';


export default class Classify extends React.Component {
  render() {
    const leftBoxStyle = {
      margin: 'auto',
      textAlign: 'center',
      paddingTop: '20px',
    };
    const rightBoxStyle = {
      margin: 'auto',
      textAlign: 'center',
      paddingTop: '20px',
      overflowY: 'scroll',
      maxHeight: '100%',
    };
    return (
      <div className="w3-container" id="classificationWindow">
        <div className="w3-row">
          <div className="w3-col l6" style={leftBoxStyle}>
            <ImagePanel/>
          </div>
          <div className="w3-col l6" style={rightBoxStyle}>
            <InputPanel/>
          </div>
        </div>
      </div>
    );
  }
}
