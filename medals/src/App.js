import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Country from './components/Country';
import NewCountry from './components/NewCountry';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';

const App = () => {
  const [ countries, setCountries ] = useState([]);
  const apiEndPoint = "https://olympicmedalsapi.azurewebsites.net/api/country";
  const medals = useRef([
    { id: 1, name: 'gold' },
    { id: 2, name: 'silver' },
    { id: 3, name: 'bronze' },
  ]);

  // this is the functional equivalent to componentDidMount
  useEffect(() => {
    // initial data loaded here
    async function fetchedCountries() {
      const { data : fetchedCountries } = await axios.get(apiEndPoint);
      //we need to save the original medla count  in state
      let newCountries = [];
      fetchedCountries.forEach(countries => {
        let newCountry = {
          id: countries.id,
          name: countries.name,
        };
        medals.current.forEach(medal => {
          const count = countries[medal.name];
          //page value is what is displayed on the web page
          //save_value is what is saved to the database
          newCountry[medal.name] = { page_value: count, saved_value: count};
        });
        newCountries.push(newCountry);
      });
      setCountries(newCountries);
    }
    fetchedCountries();
  }, []);

  const handleAdd = async (name) => {
    const {data : post} = await axios.post(apiEndPoint, { name: name });
    let newCountry = {
      id: post.id,
      name: post.name
    };
    medals.current.forEach(medal => {
      const count = post[medal.name];
      //when a new country is added, we need to store page andd saved values for medal count state
      newCountry[medal.name] = { page_value: count, saved_value: count};
    });
    setCountries(countries.concat(newCountry));
  }
  const handleDelete = async (countryId) => {
    const originalCountries = countries;
    setCountries(countries.filter(c => c.id !== countryId));
    try {
      await axios.delete(`${apiEndPoint}/${countryId}`);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        // country already deleted
        console.log("The record does not exist - it may have already been deleted");
      } else { 
        alert('An error occurred while deleting');
        setCountries(originalCountries);
      }
    }
  }

  const handleSave = async (countryId) => {
    const originalCountries = countries;

    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [ ...countries ];
    const country = mutableCountries[idx];
    let jsonPatch = [];
    medals.current.forEach(medal => {
      if (country[medal.name].page_value !== country[medal.name].saved_value) {
        jsonPatch.push({ op: "replace", path: medal.name, value: country[medal.name].page_value });
        country[medal.name].saved_value = country[medal.name].page_value;
      }
    });
    console.log(`json patch for id: ${countryId}: ${JSON.stringify(jsonPatch)}`);
    // update state
    setCountries(mutableCountries);

    try {
      await axios.patch(`${apiEndPoint}/${countryId}`, jsonPatch);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        // country already deleted
        console.log("The record does not exist - it may have already been deleted");
      } else { 
        alert('An error occurred while updating');
        setCountries(originalCountries);
      }
    }
}

const handleReset = (countryId) => {
 // to reset, make page value the same as the saved value
 const idx = countries.findIndex(c => c.id === countryId);
 const mutableCountries = [ ...countries ];
 const country = mutableCountries[idx];
 medals.current.forEach(medal => {
   country[medal.name].page_value = country[medal.name].saved_value;
 });
 setCountries(mutableCountries);}

  const handleIncrement = (countryId, medalName) => handleUpdate(countryId, medalName, 1);
  
  const handleDecrement = (countryId, medalName) => handleUpdate(countryId, medalName, -1);
  
  const handleUpdate = (countryId, medalName, factor) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries];
    mutableCountries[idx][medalName].page_value += (1 * factor);
    setCountries(mutableCountries);
  }
  
  const getAllMedalsTotal = () => {
    let sum = 0;
    medals.current.forEach(medal => { sum += countries.reduce((a, b) => a + b[medal.name].page_value, 0); });
    return sum;
  }
  
  useEffect(() => {
    if(countries && countries.length === 0) {
      async function fetchData() {
        const { data: fetchedCountries } = await axios.get(apiEndPoint);
        setCountries(fetchedCountries);
      }
      fetchData();
    }

  }, [countries])

  return (
    <React.Fragment>
    <Navbar className="navbar-dark bg-dark">
        <Container fluid>
          <Navbar.Brand>
            Olympic Medals
            <Badge className="ml-2" bg="light" text="dark" pill>{ getAllMedalsTotal() }</Badge>
          </Navbar.Brand>
          <NewCountry onAdd={ handleAdd } />
        </Container>
    </Navbar>
    <Container fluid>
    <Row>
      { countries.map(country => 
        <Col className="mt-3" key={ country.id }>
          <Country  
            country={ country } 
            medals={ medals.current }
            onDelete={ handleDelete }
            onSave={handleSave}
            onReset={handleReset}
            onIncrement={ handleIncrement } 
            onDecrement={ handleDecrement } />
        </Col>
      )}
      </Row>
    </Container>
    </React.Fragment>
  );
}
 
export default App;