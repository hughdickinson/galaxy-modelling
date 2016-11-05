import React from 'react';
import ComponentHolder from './ComponentHolder';
// import ScoreHolder from './ScoreHolder';
import AddComponentButton from './AddComponentButton';

export default class InputPanel extends React.Component {
  constructor(props) {
    super(props);
    // read in expected components and their initial values?
    this.name = props.name;
  }
  render() {
    /* const containerStyle = {
      backgroundColor: '#006064',
      color: 'white',
      height: '470px',
    }; */
    return (
      <div className="w3-card-2 w3-round" id="inputPanel" style={{ padding: '0', backgroundColor: '#007873', minHeight: '470px', color: '#fff' }}>
        <span style={{ textAlign: 'center' }}>
          { /* Score goes here? Might want a new component */ }
          <h3 style={{ marginTop: '0px', paddingTop: '5px' }}>Welcome{ (this.name) ? ', ' + this.name : '' }</h3>
        </span>
        <div className="w3-row" style={{ }}>
          <ComponentHolder/>
        </div>
        <div className="w3-row"
          style={{ backgroundColor: '#000', height: '2px', textAlign: 'center' }}
        >
          <AddComponentButton/>
        </div>
        <div className="w3-row" style={{ height: '80px' }}>
        </div>
      </div>
    );
  }
}
InputPanel.propTypes = { name: React.PropTypes.string };
InputPanel.defaultProps = { name: '' };
