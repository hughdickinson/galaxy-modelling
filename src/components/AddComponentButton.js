import React from 'react';

export function hello(e) {
  return e.target.text;
}

function showComponentMenu() {
  const x = document.getElementById('addComponentDropdown');
  if (x.className.indexOf('w3-show') === -1) {
    x.className += ' w3-show';
  } else {
    x.className = x.className.replace(' w3-show', '');
  }
}

export default class AddComponentButton extends React.Component {
  handleClick(e) {
    e.preventDefault();
    return;
  }
  render() {
    return (
      <div className="w3-dropdown-click">
        <button onClick={showComponentMenu} className="w3-btn-floating-large"
          style={{ marginTop: '-25px', backgroundColor: '#FFA900' }}
        >
          +
        </button>
        <div id="addComponentDropdown" style={{ marginLeft: '-50px' }}
          className="w3-dropdown-content w3-border"
        >
          <a onClick={hello} className="addComponentLink" href="#/classify">Disk</a>
          <a className="addComponentLink" href="#/classify">Bulge</a>
          <a className="addComponentLink" href="#" onClick={this.handleClick}>Bar</a>
          <a className="addComponentLink" href="#/classify">Spiral Arm</a>
        </div>
      </div>
    );
  }
}
