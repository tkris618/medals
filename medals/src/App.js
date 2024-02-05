import './App.css';
import React, { Component } from 'react';
import Country from './components/Country';
import NewCountry from './components/NewCountry';
import Grid from '@mui/material/Grid';
// import Medal from './components/Medal';
import Container from '@mui/material/Container';

class App extends Component{
  state = {
    countries: [
      { id: 1, name: 'United States', gold: 2, silver: 4, bronze: 3, },
      { id: 2, name: 'China', gold: 3, silver: 1, bronze: 0 },
      { id: 3, name: 'Germany', gold: 0, silver: 2, bronze: 2}
    ],
    medals: [
      { id: 1, name: 'gold'},
      { id: 2, name: 'silver'},
      { id: 3, name: 'bronze'}
    ]
  }
  
  getTotalMedal() {

    return this.state.countries.reduce((a ,b) => a + b.gold, 0);
    

}
  handleIncrement = (countryId, medalId) => {

    //created clones of the arrays

    const currentItems = this.state.countries;

    const currentMedal = this.state.medals;

    //searching through each cloned array for matching Id's 

    const idx = currentItems.findIndex((c) => c.id === countryId);

    //searchiing through medal array for matching id

    const medalType = currentMedal.find((m) => m.id === medalId);   
    
    //if the medal id matches the medalType name add 1

    if(medalType.name === "gold") {
      currentItems[idx].gold += 1;

    }
    else if(medalType.name === "silver") {
      currentItems[idx].silver += 1;
    }
    else if(medalType.name === "bronze") {
      currentItems[idx].bronze += 1;
    }

    //sets the state to the updated quantity after each click
    this.setState({countries: currentItems})
  }
  handleDecrement = (countryId, medalId) => {

    const currentItems = this.state.countries;

    const currentMedal = this.state.medals;

    const idx = currentItems.findIndex((c) => c.id === countryId);

    const medalType = currentMedal.find((m) => m.id === medalId);

    //if medal id match medal name and the count is not zero decrease by 1

    if (currentItems[idx].gold > 0 && medalType.name === "gold"){
      currentItems[idx].gold -= 1;
      this.setState({countries: currentItems})

    }
    else if(currentItems[idx].silver > 0 && medalType.name === "silver"){
      currentItems[idx].silver -= 1;
      this.setState({countries: currentItems})
    }
    else if(currentItems[idx].bronze > 0 && medalType.name === "bronze") {
      currentItems[idx].bronze -= 1;
      this.setState({countries: currentItems})
    }
  }

  getTotalMedalsForAll() {

    const goldTotal = this.state.countries.reduce((a, b) => a + b.gold, 0);
    const silverTotal = this.state.countries.reduce((a, b ) => a + b.silver, 0);
    const bronzeTotal = this.state.countries.reduce((a, b) => a + b.bronze, 0);

    return (goldTotal + silverTotal + bronzeTotal)

  }

  deleteCountry = (countryId) => {
    //ensuring the country deleted matches the specific id
    const countries = this.state.countries.filter(c => c.id !== countryId);
    //updating the state with the remaining countries
    this.setState({countries:countries});

  }

  addCountry = (name, gold, silver, bronze) => {
    const {countries} = this.state;
    const id = countries.length === 0 ? 1 : Math.max(...countries.map(name => name.id)) + 1;
    const mutableCountries = countries.concat({ id: id, name: name, gold: gold, silver: silver, bronze: bronze});
    this.setState({countries:mutableCountries});
    console.log(`name: ${name}, gold: ${gold}, silver: ${silver}, bronze: ${bronze}`)
} 
  
  render() {
    console.log(this.getTotalMedalsForAll());

      return (

        
        <Container fixed style={{textTransform: 'capitalize'}}>
          <div className='jss12'>Olympic Medals</div>
          <Grid container spacing={{xs: 2}} className='jss3' justifyContent={'center'}>
          
        {this.state.countries.map(country => <Country
          key={ country.id }
          country={ country }
          onIncrement={ this.handleIncrement }
          onDecrement={ this.handleDecrement }
          onDelete={ this.deleteCountry }
          />
          )}
           <NewCountry onAdd={ this.addCountry }/>
           </Grid>
           </Container>
      )
  }
  }
/* 
<Container fixed style={{textTransform: 'capitalize'}}>
      { this.state.countries.map(country => <Country 
        // onIncrement={handleIncrement}
        key={ country.id }
        country={ country }

        />) }
      </Container> */

  

export default App;
