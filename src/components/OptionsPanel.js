import React from 'react';

export default class OptionsPanel extends React.Component {
  render() {
    const buttonClasses = 'w3-btn w3-round w3-dark-grey w3-border';
    return (
      <div className="w3-container" style={{ minHeight: '500px' }}>
        <div className="w3-card-2 w3-white" style={{ paddingBottom: '20px' }}>
          <p>Well hello there</p>
          <div className="w3-row">
            <button type="button" className={buttonClasses}>Suggest a step</button>
          </div>
          <div className="w3-row">
            <button type="button" className={buttonClasses}>Submit to Supercomputer</button>
          </div>
          <div className="w3-row">
            <button type="button" className={buttonClasses}>Render</button>
          </div>
        </div>
      </div>
    );
  }
}
