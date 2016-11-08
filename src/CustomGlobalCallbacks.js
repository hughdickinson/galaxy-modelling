const imageDataComponents = [];
// test comment

function sersic2d(coords, kwargs) {
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
    for (i = 0; i < components.length; i++) {
      component = components[i];
      console.log(component);
      const dataLength = imageDataComponents[component].data.length;

      // TODO: might be best to pass these as props to ImageBox and re-render each time component changes?
      // reverse x and y as it's simpler than transposing the resulting matrix
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
    ctx.putImageData(ret, 0, 0);
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

    setTimeout(() => {
      calculateNewModel();
      updateCanvasData();
    }, 10);
  }
}
