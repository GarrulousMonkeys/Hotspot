import React from 'react';
import Map from '../containers/Map';
import Nav from '../containers/Nav';
import Panel from '../containers/Panel';

class App extends React.Component {
  render() {
    return (
      <div>
        <Nav />
        <Panel />
        <Map />
      </div>
    );
  }
}

export default App;
