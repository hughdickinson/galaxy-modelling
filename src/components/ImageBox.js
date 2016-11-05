import React from 'react';

export default class ImageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imageDataComponents: {} };
  }
  componentDidMount() {
    /* the image box is now mounted, we can get the canvas context and trigger
      the rendering of the default galaxy
    */
    const canvas = document.getElementById('galaxyCanvas');
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      // set the image data for the model parameter
      this.state.imageDataComponents['Disk 1'] = ctx.createImageData(400, 400);
      this.state.imageDataComponents['Disk 2'] = ctx.createImageData(400, 400);

      setTimeout(() => {
        this.updateImageData('Disk 1'); this.updateImageData('Disk 2');
      }, 1000);
    }
  }
  sersic2d(coords, kwargs) {
    let i = 0;
    // grab parameters and check which are defined
    const params = typeof(kwargs) === 'undefined' ? {} : kwargs;
    const mu = typeof(params.mu) === 'undefined' ? [100, 100] : params.mu;
    const rEff = typeof(params.rEff) === 'undefined' ? 10 : params.rEff;
    const axRatio = typeof(params.axRatio) === 'undefined' ? 1 : params.axRatio;
    const roll = typeof(params.roll) === 'undefined' ? 0 : params.roll;
    const I0 = typeof(params.I0) === 'undefined' ? 200 : params.I0;
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
    // calculate sersic value at rolled coordinates
    for (i = 0; i < coords.length; i++) {
      xPrime = coords[i][0] * cosRoll - coords[i][1] * sinRoll + xCorr;
      yPrime = coords[i][0] * sinRoll + coords[i][1] * cosRoll + yCorr;
      weightedRadius = Math.sqrt(Math.pow(axRatio / rEff, 2) * Math.pow(xPrime - mu[0], 2) +
        Math.pow(yPrime - mu[1], 2) / Math.pow(rEff, 2));
      ret[i] = Math.exp(Math.log(I0) - Math.pow(weightedRadius, 1 / n));
    }
    return ret;
  }
  updateImageData(component) {
    const t0 = (new Date).getTime();
    // const currentComponents = Object.keys(this.state.imageDataComponents);
    const canvas = document.getElementById('galaxyCanvas');
    const dataLength = this.state.imageDataComponents[component].data.length;
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
      // TODO: change paramaters here to reflect user input
      // might be best to pass these as props to ImageBox and re-render each time component changes?
      const mu = [
        document.getElementsByName(component.replace(' ', '-') + '_mux_number')[0].value * 4,
        document.getElementsByName(component.replace(' ', '-') + '_muy_number')[0].value * 4,
      ];
      const roll = document.getElementsByName(component.replace(' ', '-') + '_roll_number')[0].value * Math.PI / 180;
      const axRatio = parseFloat(document.getElementsByName(component.replace(' ', '-') + '_axRatio_number')[0].value);
      const rEff = parseFloat(document.getElementsByName(component.replace(' ', '-') + '_rEff_number')[0].value);
      const n = parseFloat(document.getElementsByName(component.replace(' ', '-') + '_sersic_number')[0].value);
      console.log({ mu, roll, axRatio, rEff, n });
      const rData = this.sersic2d(coords, { mu, roll, axRatio, rEff, n });
      // const mx = Math.max(rData);
      for (i = 0; i < dataLength; i++) {
        this.state.imageDataComponents[component].data[4 * i] = rData[i];
        this.state.imageDataComponents[component].data[4 * i + 1] = rData[i];
        this.state.imageDataComponents[component].data[4 * i + 2] = rData[i];
        this.state.imageDataComponents[component].data[4 * i + 3] = 255;
      }
    }
    const t1 = (new Date).getTime();
    console.log('Time taken to calculate: ', t1 - t0);
    this.updateCanvas();
    console.log('Time taken to render: ', (new Date).getTime() - t1);
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
        for (j = 0; j < 2; j++) {
          ret.data[i] += this.state.imageDataComponents[currentComponents[j]].data[i];
        }
      }
      // TODO: need to normalize ret

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
