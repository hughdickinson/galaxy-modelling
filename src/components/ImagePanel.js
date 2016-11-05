import React from 'react';
import ImageBox from './ImageBox';
import ImageControls from './ImageControls';
import ScoreHolder from './ScoreHolder';

export function fixPos() {
  const imP = document.getElementById('imagePanel');
  console.log(document.body.scrollTop);
  if (window.innerWidth > 992) {
    if (document.body.scrollTop > 88) {
      const top = Math.min(window.scrollY - 88, document.getElementById('inputPanel').offsetHeight - 470 - 88);
      imP.style['margin-top'] = top + 'px';
    } else {
      imP.style['margin-top'] = 0 + 'px';
    }
  } else {
    imP.style['margin-top'] = 0 + 'px';
  }
}


export default class ImagePanel extends React.Component {
  componentDidMount() {
    window.onscroll = function () {fixPos();};
  }
  render() {
    return (
      <div className="w3-container" id="imagePanel">
        <div className="w3-card-2 w3-round" style={{ padding: '10px 0', maxWidth: '420px', backgroundColor: '#ddd', margin: 'auto' }}>
          <div className="w3-row">
            <ImageBox/>
          </div>
          <div className="w3-row">
            <ImageControls/>
          </div>
          <div className="w3-row">
            <ScoreHolder/>
          </div>
        </div>
      </div>
    );
  }
}
