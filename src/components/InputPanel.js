import React from 'react';
import ComponentHolder from './ComponentHolder';
// import ScoreHolder from './ScoreHolder';
import AddComponentButton from './AddComponentButton';
import RenderButton from './RenderButton';

export default class InputPanel extends React.Component {
  constructor(props) {
    super(props);
    // read in expected components and their initial values?
    this.name = props.name;
  }
  render() {
    return (
      <div className="w3-card-2 w3-round" id="inputPanel" style={{ padding: '0', backgroundColor: '#007873', minHeight: '470px', color: '#fff' }}>
        <div className="w3-row" style={{ }}>
          <ComponentHolder/>
        </div>
        <div className="w3-row"
          style={{ backgroundColor: '#000', height: '2px', textAlign: 'center' }}
        >
          <AddComponentButton/>
        </div>
        <div className="w3-row" style={{ paddingTop: '40px', paddingBottom: '20px', minHeight: '80px' }}>
        <RenderButton/>
        </div>
      </div>
    );
  }
}
InputPanel.propTypes = { name: React.PropTypes.string };
InputPanel.defaultProps = { name: '' };
