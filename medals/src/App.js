import './App.css';
import React, { Component } from 'react';
import Country from './components/Country';

class App extends Component{
  state = {
    countries: [
      { id: 1, name: 'United States', gold: 2 },
      { id: 2, name: 'China', gold: 3 },
      { id: 3, name: 'Germany', gold: 0 ,}
    ]
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        { this.state.countries.map(country => <Country 
        key={ country.id }
        country={ country }

        />) }
      </div>
    );
  }
  }
  

export default App;
