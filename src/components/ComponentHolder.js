import React from 'react';

export function expand(e) {
  const id = e.target.dataset.target;
  const box = document.getElementById(id);
  if (box.className.indexOf('w3-show') === -1) {
    box.className += ' w3-show';
  } else {
    box.className = box.className.replace(' w3-show', '');
  }
}

export function updateComponentInputs(e) {
  const currentVal = e.target.value;
  let multiplier = e.target.dataset.multiplier;
  const tg = e.target.name.split('_');
  const component = tg[0].replace(' ', '-');
  const componentPar = tg[1];
  const componentParInput = tg[2];
  let s = `${component}_${componentPar}_`;
  if (componentParInput === 'number') {
    multiplier = 1 / multiplier;
  }
  s += componentParInput === 'slider' ? 'number' : 'slider';
  document.getElementsByName(s)[0].value = currentVal * multiplier;
  // we now need to pass it to the render function
}

// should use props instead? It's an unnecessary hassle...
export function addInput(comp, param, lbl, kws) {
  // check the arguments provided. Assume comp, param, lbl are defined.
  const c = comp.replace(' ', '-');
  const kwargs = typeof(kws) === 'undefined' ? {} : kws;
  const mn = typeof(kwargs.mn) === 'undefined' ? 0 : kwargs.mn;
  const mx = typeof(kwargs.mx) === 'undefined' ? 100 : kwargs.mx;
  const multiplier = typeof(kwargs.multiplier) === 'undefined' ? 1 : kwargs.multiplier;
  const dflt = typeof(kwargs.default) === 'undefined' ? 0 : kwargs.default;
  // and send out the JSX
  return (
    <div className="w3-row" style={{ padding: '3px 0' }}>
      <div className="w3-col s4">
        <label style={{ lineHeight: '40px' }}htmlFor={`${c}_${param}_slider`}>{lbl}</label>
      </div>
      <div className="w3-col s4">
        <input className="paramSlider" type="range"
          name={`${c}_${param}_slider`} min={mn} max={mx} data-default={dflt}
          data-multiplier={multiplier} onChange={updateComponentInputs}
        />
      </div>
      <div className="w3-col s4" className="w3-right">
        <input className="paramNumber" type="number"
          name={`${c}_${param}_number`} min={mn} max={mx} data-default={dflt}
          data-multiplier={multiplier} onChange={updateComponentInputs}
        />
      </div>
    </div>
  );
}

export function componentBox(props) {
  const propname = props.name;
  /* TODO: How to remove components
  TODO: pass required inputs in props
  TODO: Is there a way to lock values together (i.e. component centers)?
  */
  const buttonClasses = 'w3-btn-block w3-dark-grey w3-border w3-left-align';
  return ([
    <div data-target={propname} className={buttonClasses}>
      {propname}
    </div>,
    <div id={propname.replace(' ', '-')} className="w3-container component-parameter-box">
      <div className="w3-col l10">
        {addInput(propname, 'mux', 'X-offset', { mn: -10, mx: 10, default: 0 })}
        {addInput(propname, 'muy', 'Y-offset', { mn: -10, mx: 10, default: 0 })}
        {addInput(propname, 'roll', 'Roll Angle', { mn: 0, mx: 360, default: 45 })}
        {addInput(propname, 'rEff', 'Effective Radius', { mn: 0, mx: 500, multiplier: 0.1, default: 200 })}
        {addInput(propname, 'axRatio', 'Axis Ratio', { mn: 0, mx: 100, multiplier: 0.01, default: 60 })}
        {addInput(propname, 'sersic', 'Sersic Index', { mn: 50, mx: 500, multiplier: 0.01, default: 100 })}
        {addInput(propname, 'I0', 'Intensity', { mn: 0, mx: 100, default: 50 })}
      </div>
      <div className="w3-col l2">
      hi
      </div>
    </div>,
  ]);
}
componentBox.propTypes = {
  name: React.PropTypes.string,
  type: React.PropTypes.string,
  initialValue: React.PropTypes.float,
};
componentBox.defaultProps = {
  name: 'None',
  type: 'number',
  initialValue: 0,
};

export default class ComponentHolder extends React.Component {
  componentDidMount() {
    // initialise all inputs to the correct default value
    let i = 0;
    const iptsSlider = [].slice.call(document.querySelectorAll('input.paramSlider'));
    const iptsNumber = [].slice.call(document.querySelectorAll('input.paramNumber'));
    for (i = 0; i < iptsSlider.length; i++) {
      const v = typeof(iptsSlider[i].dataset.default) === 'undefined' ? 0 : iptsSlider[i].dataset.default;
      iptsSlider[i].value = v;
    }
    for (i = 0; i < iptsNumber.length; i++) {
      const v = typeof(iptsNumber[i].dataset.default) === 'undefined' ? 0 : iptsNumber[i].dataset.default;
      iptsNumber[i].value = v * iptsNumber[i].dataset.multiplier;
    }
  }
  render() {
    const components = [
      { name: 'Disk 1', type: 'sersic' },
      { name: 'Disk 2', type: 'sersic' },
      /* { name: 'Bulge', type: 'sersic' }, */
    ];
    return (
      <div className="w3-light-grey" style={{ minHeight: '100%', paddingBottom: '30px' }}>
        <div className="w3-row w3-container">
          {addInput('global', 'mux', 'Galaxy X position', { mn: 0, mx: 100, default: 50 })}
          {addInput('global', 'muy', 'Galaxy Y position', { mn: 0, mx: 100, default: 50 })}
        </div>
        { components.map(c => componentBox(c)) }
      </div>
    );
  }
}
