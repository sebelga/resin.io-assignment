import React, { Component } from 'react';
import './App.css';

import DroneFleet from './components/DronesFleet/DronesFleet';
import DronesList from './components/DronesList/DronesList';
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">BlueInc drones fleet</h1>
        </header>

        <div className="App-content">
          <DroneFleet>
            <DronesList />
          </DroneFleet>
        </div>
      </div>
    );
  }
}

export default App;
