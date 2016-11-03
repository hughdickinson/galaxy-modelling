import React from 'react';

export function sersic1d(R, I0, k, n) {
  /* accepts float R, I_0, k, n and returns Intensity given by sersic profile
  at that radius
  */
  return Math.exp(Math.log(I0) - k * Math.pow(R, 1 / n));
}

export default class ImageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imageDataComponents: {} };
  }
  componentDidMount() {
    const canvas = document.getElementById('galaxyCanvas');
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      // set the image data for the model parameter
      this.state.imageDataComponents['Disk 1'] = ctx.createImageData(400, 400);
      this.state.imageDataComponents.Bulge = ctx.createImageData(400, 400);
      this.updateImageData();
      this.updateCanvas();
    }
  }
  sersic2d(coords, kwargs) {
    let i = 0;
    const params = typeof(kwargs) === 'undefined' ? {} : kwargs;
    const mu = typeof(params.mu) === 'undefined' ? [100, 100] : params.mu;
    const rEff = typeof(params.rEff) === 'undefined' ? 10 : params.rEff;
    const axRatio = typeof(params.axRatio) === 'undefined' ? 1 : params.axRatio;
    const roll = typeof(params.roll) === 'undefined' ? 0 : params.roll;
    const I0 = typeof(params.I0) === 'undefined' ? 1000 : params.I0;
    const n = typeof(params.n) === 'undefined' ? 1 : params.n;

    // precalculate where possible
    const sinRoll = Math.sin(roll);
    const cosRoll = Math.cos(roll);
    const xCorr = mu[0] - mu[0] * cosRoll + mu[1] * sinRoll;
    const yCorr = mu[1] - mu[1] * cosRoll - mu[0] * sinRoll;
    let xPrime = 0;
    let yPrime = 0;
    let weightedRadius = 1;
    const ret = Array(coords.length);
    // compile rolled coordinates
    for (i = 0; i < coords.length; i++) {
      xPrime = coords[i][0] * cosRoll - coords[i][1] * sinRoll + xCorr;
      yPrime = coords[i][0] * sinRoll + coords[i][1] * cosRoll + yCorr;
      weightedRadius = Math.sqrt(Math.pow(axRatio / rEff, 2) * Math.pow(xPrime - mu[0], 2) +
        Math.pow(yPrime - mu[1], 2) / Math.pow(rEff, 2));
      ret[i] = Math.exp(Math.log(I0) - Math.pow(weightedRadius, 1 / n));
    }
    return ret;
  }
  updateImageData() {
    const currentComponents = Object.keys(this.state.imageDataComponents);
    const canvas = document.getElementById('galaxyCanvas');
    const dataLength = this.state.imageDataComponents[currentComponents[0]].data.length;
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const coords = Array(width * height);
      let i = 0;
      let j = 0;
      for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {
          coords[width * i + j] = [i, j];
        }
      }
      const rData = this.sersic2d(coords, { mu: [200, 200], roll: 0.3, axRatio: 0.5 });
      const mx = Math.max(rData);
      rData.forEach((k) => { return 255 * k / mx; });
      for (i = 0; i < dataLength; i++) {
        this.state.imageDataComponents[currentComponents[0]].data[4 * i] = rData[i];
        this.state.imageDataComponents[currentComponents[0]].data[4 * i + 1] = rData[i];
        this.state.imageDataComponents[currentComponents[0]].data[4 * i + 2] = rData[i];
        this.state.imageDataComponents[currentComponents[0]].data[4 * i + 3] = 255;
      }
    }
    return dataLength;
  }
  updateCanvas() {
    // shouldn't need to get the canvas every time?
    let i = 0;
    let j = 0;
    const currentComponents = Object.keys(this.state.imageDataComponents);
    const canvas = document.getElementById('galaxyCanvas');
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      const ret = ctx.createImageData(400, 400);
      for (i = 0; i < ret.data.length; i++) {
        ret.data[i] = 0;
        for (j = 0; j < 1; j++) {
          ret.data[i] += this.state.imageDataComponents[currentComponents[j]].data[i];
        }
      }
      /* for (i = 0; i < 400; i++) {
        for (j = 0; j < 400; j++) {
          if (j > 0) {
            // R
            ret.data[4 * (400 * i + j)] = Math.min(2 * i, 255);
            // G
            ret.data[4 * (400 * i + j) + 1] = Math.min(j, 255);
            // B
            ret.data[4 * (400 * i + j) + 2] = Math.min(400 - j, 255);
            // A
            ret.data[4 * (400 * i + j) + 3] = 255;
          }
        }
      } */
      ctx.putImageData(ret, 0, 0);
    }
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
    };
    const canvasHeight = 400;
    const canvasWidth = 400;
    return (
      <div className="w3-row" style={imageStyle}>
        <canvas id="galaxyCanvas" height={canvasHeight} width={canvasWidth} style={canvasStyle}></canvas>
      </div>
    );
  }
}
