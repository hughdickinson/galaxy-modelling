import React from 'react';

export default class HomePage extends React.Component {
  render() {
    const headerStyle = {
      backgroundColor: '#00838F',
      color: '#fff',
      marginTop: '0px',
      padding: '20px 20px',
    };
    return (
      <div>
        <div style={headerStyle}>
          <h1>WELL HELLO THERE!!</h1>
          <p>
            DIS MAH PERJECT. IZ GOIN BE AWESUM.
          </p>
        </div>
      </div>
    );
  }
}
