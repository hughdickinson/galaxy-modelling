import React from 'react';
import ImagePanel from './ImagePanel';
import { Link } from 'react-router';

export default class ClassifyPage extends React.Component {
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
      maxHeight: '100%',
    };
    return (
      <div className="w3-container" id="classificationWindow">
        <div className="w3-row">
          <div className="w3-col l6" style={leftBoxStyle}>
            <ImagePanel/>
          </div>
          <div className="w3-col l6" style={rightBoxStyle}>
            <div className="w3-card-2 w3-round" id="inputPanel"
              style={{ padding: '0', backgroundColor: '#007873', minHeight: '470px', color: '#fff' }}
            >
              <div className="w3-row" style={{ padding: '3px' }}>
                <div className="w3-col l6" style={{ padding: '1px' }}>
                  <Link to="/classify" className="w3-btn-block w3-white">Components</Link>
                </div>
                <div className="w3-col l6"style={{ padding: '1px' }}>
                  <Link to="/classify/options" className="w3-btn-block w3-white">Options</Link>
                </div>
              </div>
              { this.props.children }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
ClassifyPage.propTypes = {
  children: React.PropTypes.object,
};
