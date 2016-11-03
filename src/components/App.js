import React from 'react';
import { Link } from 'react-router';

// this is the root, it conatins a header and a space for children as dictated
// by react-router
export default class App extends React.Component {
  returnSomething(something) {
    // this is only for testing purposes. Check /test/components/App-test.js
    return something;
  }
  render() {
    return (
      <div className="parallax parallax1">
        <header className="site-header">
          <h1 className="title">Galaxy Modelling</h1>
          <Link to="/" className="link">Home</Link>
          <Link to="/about" className="link">About</Link>
          <Link to="/classify" className="link">Classify</Link>
        </header>
        <section className="content-section">
          {this.props.children}
        </section>
        <section id="spacer" style={{ height: '50px' }}></section>
        <footer style={{ minY: '100%', height: '100px', backgroundColor: '#0097A7', color: 'white' }}>
          This is a footer
        </footer>
      </div>
    );
  }
}
App.propTypes = {
  children: React.PropTypes.object,
};
