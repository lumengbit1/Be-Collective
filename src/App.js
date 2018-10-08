import 'babel-polyfill';
import React, { Component } from 'react';
import './App.css';
import ITree from './Tree';

class App extends Component {
  render() {
    return (
      <div className="App">
            <ITree/>
      </div>
    );
  }
}

export default App;
