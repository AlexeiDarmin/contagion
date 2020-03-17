import React from 'react';

import logo from './logo.svg';
import COCanvas from './components/canvas'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Contagion
        <div className="App-subheader">
          A simulation of the effects our actions have on the spread of a virus.
        </div>
      </header>
      <div>
        <COCanvas key='main' />
      </div>
    </div>
  );
}

export default App;
