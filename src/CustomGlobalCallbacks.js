const imageDataComponents = [];

let imageData = [];
let modelData = [];

export function getCanvas() {
  const canvas = document.getElementById('galaxyCanvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    return [ctx, canvas];
  }
  return [];
}

export function setImageData(imageSource) {
  imageData = imageSource.slice();
  return imageData;
}

export function calculateModelDifference() {
  return modelData;
}

function trackCanvasMousePosition(f, e) {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.putImageData(modelData, 0, 0);
  // code which tracks mouse movement and passes it to f, a function
  f(e.offsetX, e.offsetY);
}

function drawTarget(posx, posy) {
  this.ctx.beginPath();
  this.ctx.lineWidth = 2;
  this.ctx.strokeStyle = 'red';
  this.ctx.moveTo(posx - 10, posy);
  this.ctx.lineTo(posx + 10, posy);
  this.ctx.moveTo(posx, posy - 10);
  this.ctx.lineTo(posx, posy + 10);
  this.ctx.stroke();
}

function drawEllipse(ellipse) {
  this.ctx.beginPath();
  this.ctx.lineWidth = 1;
  this.ctx.ellipse(
    ellipse.mu[0],
    ellipse.mu[1],
    ellipse.minorAxis * 4,
    ellipse.majorAxis * 4,
    ellipse.roll,
    0,
    Math.PI * 2,
  );
  this.ctx.stroke();
}

export function updateUserOverlay(ctx_, canvas) {
  const ctx = ctx_;
  // update the user overlay
  const mu = [
    document.getElementsByName('global_mux_number')[0].value * 4,
    document.getElementsByName('global_muy_number')[0].value * 4,
  ];
  const boundDrawTarget = drawTarget.bind({ ctx, canvas });
  const boundDrawEllipse = drawEllipse.bind({ ctx, canvas });
  const muComp = [0, 0];
  let roll = 0;
  let axRatio = 0;
  let rEff = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(modelData, 0, 0);
  let i = 0;
  const components = Object.keys(imageDataComponents);
  let component = '';
  const colours = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
  for (i = 0; i < Object.keys(imageDataComponents).length; i++) {
    component = components[i];
    if (component.indexOf('Disk') !== -1 || component.indexOf('Bulge') !== -1) {
      ctx.strokeStyle = colours[i];
      muComp[1] = mu[1] + document.getElementsByName(component.replace(' ', '-') + '_muy_number')[0].value * 4;
      muComp[0] = mu[0] + document.getElementsByName(component.replace(' ', '-') + '_mux_number')[0].value * 4;
      roll = document.getElementsByName(component.replace(' ', '-') + '_roll_number')[0].value * Math.PI / 180;
      axRatio = parseFloat(document.getElementsByName(component.replace(' ', '-') + '_axRatio_number')[0].value);
      rEff = parseFloat(document.getElementsByName(component.replace(' ', '-') + '_rEff_number')[0].value);
      boundDrawEllipse({ mu: muComp, roll, majorAxis: rEff, minorAxis: rEff * axRatio });
    }
  }
  boundDrawTarget(mu[0], mu[1]);
}

export function startCanvasMouseTracking(type) {
  // function which enables tracking of mousemove events on
  const canvas = document.getElementById('galaxyCanvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const startData = ctx.getImageData(0, 0, 400, 400);
    const boundDrawTarget = drawTarget.bind({ ctx, canvas, startData });
    switch (type) {
      case 'chooseGalaxyCenter':
        if (document.getElementById('galaxyCanvas')) {
          const boundTrackCanvasMousePosition = trackCanvasMousePosition.bind({ ctx, canvas });
          document.getElementById('galaxyCanvas').onmousemove = (e) => {
            boundTrackCanvasMousePosition(boundDrawTarget, e);
          };
          document.getElementById('galaxyCanvas').onclick = (e) => {
            // clear mousemove and click binding for the canvas
            document.getElementById('galaxyCanvas').onmousemove = undefined;
            document.getElementById('galaxyCanvas').onclick = undefined;
            ctx.putImageData(startData, 0, 0);
            document.getElementsByName('global_mux_number')[0].value = e.offsetX / 4.0;
            document.getElementsByName('global_mux_slider')[0].value = e.offsetX / 4.0;
            document.getElementsByName('global_muy_number')[0].value = e.offsetY / 4.0;
            document.getElementsByName('global_muy_slider')[0].value = e.offsetY / 4.0;
            updateUserOverlay(ctx, canvas);
          };
        }
        break;
      default:
        break;
    }
  }
}

export function stopCanvasMouseTracking(type) {
  return type;
}

function sersic2d(coords, kwargs) {
  // grab parameters and check which are defined, otherwise provide defaults
  const params = typeof(kwargs) === 'undefined' ? {} : kwargs;
  const mu = typeof(params.mu) === 'undefined' ? [100, 100] : params.mu;
  const rEff = typeof(params.rEff) === 'undefined' ? 10 : params.rEff;
  const axRatio = typeof(params.axRatio) === 'undefined' ? 1 : params.axRatio;
  const roll = typeof(params.roll) === 'undefined' ? 0 : params.roll;
  const I0 = typeof(params.I0) === 'undefined' ? 200 : params.I0;
  const n = typeof(params.n) === 'undefined' ? 1 : params.n;

  // precalculate values where possible
  const sinRoll = Math.sin(roll);
  const cosRoll = Math.cos(roll);
  const xCorr = mu[0] - mu[0] * cosRoll + mu[1] * sinRoll;
  const yCorr = mu[1] - mu[1] * cosRoll - mu[0] * sinRoll;
  let xPrime = 0;
  let yPrime = 0;
  let weightedRadius = 1;
  // calculate sersic value at rolled coordinates
  const ret = coords.map((coord) => {
    xPrime = coord[0] * cosRoll - coord[1] * sinRoll + xCorr;
    yPrime = coord[0] * sinRoll + coord[1] * cosRoll + yCorr;
    weightedRadius = Math.sqrt(Math.pow(axRatio / rEff, 2) * Math.pow(xPrime - mu[0], 2) +
      Math.pow(yPrime - mu[1], 2) / Math.pow(rEff, 2));
    return Math.exp(Math.log(I0) - Math.pow(weightedRadius, 1 / n));
  });
  return ret;
}

function calculateNewModel() {
  const canvas = document.getElementById('galaxyCanvas');
  const components = Object.keys(imageDataComponents);
  let i = 0;
  let component = '';
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const coords = Array(width * height);
    let j = 0;
    let k = 0;
    for (j = 0; j < width; j++) {
      for (k = 0; k < height; k++) {
        coords[width * j + k] = [j, k];
      }
    }
    const nanTest = (a) => a === parseFloat('a');
    for (i = 0; i < components.length; i++) {
      component = components[i];
      const dataLength = imageDataComponents[component].data.length;
      // reverse x and y as it's simpler than transposing the resulting matrix
      // (canvas goes [row][column] so reversing mu gives the correct value)
      const mu = [
        document.getElementsByName('global_mux_number')[0].value * 4,
        document.getElementsByName('global_muy_number')[0].value * 4,
      ].reverse();
      mu[1] += document.getElementsByName(component.replace(' ', '-') + '_mux_number')[0].value * 4;
      mu[0] += document.getElementsByName(component.replace(' ', '-') + '_muy_number')[0].value * 4;
      const roll = document.getElementsByName(component.replace(' ', '-') + '_roll_number')[0].value * Math.PI / 180;
      const axRatio = parseFloat(document.getElementsByName(component.replace(' ', '-') + '_axRatio_number')[0].value);
      const rEff = parseFloat(document.getElementsByName(component.replace(' ', '-') + '_rEff_number')[0].value);
      const n = parseFloat(document.getElementsByName(component.replace(' ', '-') + '_sersic_number')[0].value);
      const I0 = 2 * parseFloat(document.getElementsByName(component.replace(' ', '-') + '_I0_number')[0].value);
      console.log({ mu, roll, axRatio, rEff, n, I0 });
      console.log([mu, roll, axRatio, rEff, n, I0].map(nanTest));
      const rData = sersic2d(coords, { mu, roll, axRatio, rEff, n, I0 });
      for (j = 0; j < dataLength; j++) {
        imageDataComponents[component].data[4 * j] = rData[j];
        imageDataComponents[component].data[4 * j + 1] = rData[j];
        imageDataComponents[component].data[4 * j + 2] = rData[j];
        imageDataComponents[component].data[4 * j + 3] = 255;
      }
    }
  }
}

function updateCanvasData() {
  // shouldn't need to get the canvas every time?
  let i = 0;
  let j = 0;
  const currentComponents = Object.keys(imageDataComponents);
  const canvas = document.getElementById('galaxyCanvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const ret = ctx.createImageData(400, 400);
    for (i = 0; i < ret.data.length; i++) {
      ret.data[i] = 0;
      for (j = 0; j < currentComponents.length; j++) {
        ret.data[i] += imageDataComponents[currentComponents[j]].data[i];
      }
    }
    modelData = ret;
    ctx.putImageData(ret, 0, 0);
    // TODO: calculate model score here (still async)
    updateUserOverlay(ctx, canvas);
  }
}

export function modelShouldRender() {
  // the model needs recalculating, update the stored arrays and calculate the
  // new model
  const canvas = document.getElementById('galaxyCanvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    // set the image data for the model parameter
    // TODO: get these from props
    const components = document.getElementsByClassName('component-parameter-box');
    let i = 0;
    for (i = 0; i < components.length; i++) {
      imageDataComponents[components[i].id] = ctx.createImageData(400, 400);
    }
    // TODO: create save point after this
    setTimeout(() => {
      calculateNewModel();
      updateCanvasData();
    }, 10);
  }
}
