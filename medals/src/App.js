import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Country from './components/Country';
import NewCountry from './components/NewCountry';
import Login from './components/Login';
import Logout from './components/Logout';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';
import { HubConnectionBuilder } from '@microsoft/signalr';

const App = () => {
  const [ countries, setCountries ] = useState([]);
  const [ connection, setConnection] = useState(null);
  const apiEndPoint = "https://medals-api-6.azurewebsites.net/jwt/api/country";
  const hubEndpoint = "https://medals-api-6.azurewebsites.net/medalsHub"
  const usersEndpoint = "https://medals-api-6.azurewebsites.net/api/users/login";
  const medals = useRef([
    { id: 1, name: 'gold' },
    { id: 2, name: 'silver' },
    { id: 3, name: 'bronze' },
  ]);
  const [ user, setUser ] = useState(
    {
      name: null,
      authenticated: false,
      canPost: false,
      canPatch: false,
      canDelete: false
    }
  );
  const latestCountries = useRef(null);
  // latestCountries.current is a ref variable to countries
  // this is needed to access state variable in useEffect w/o dependency
  latestCountries.current = countries;

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
    const encodedJwt = localStorage.getItem("token");
    // check for existing token
    encodedJwt && setUser(getUser(encodedJwt));

      // signalR
      const newConnection = new HubConnectionBuilder()
      .withUrl(hubEndpoint)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

    // componentDidUpdate (changes to connection)
    useEffect(() => {
      if (connection) {
        connection.start()
        .then(() => {
          console.log('Connected!')

          connection.on('ReceiveAddMessage', country => {
            console.log(`Add: ${country.name}`);

            let newCountry = { 
              id: country.id, 
              name: country.name,
            };
            medals.current.forEach(medal => {
              const count = country[medal.name];
              newCountry[medal.name] = { page_value: count, saved_value: count };
            });
            let mutableCountries = [...latestCountries.current];
            mutableCountries = mutableCountries.concat(newCountry);
            setCountries(mutableCountries);
          });
          connection.on('ReceiveDeleteMessage', id => {
            console.log(`Delete id: ${id}`);
            let mutableCountries = [...latestCountries.current];
            mutableCountries = mutableCountries.filter(c => c.id !== id);
            setCountries(mutableCountries);
          });
          connection.on('ReceivePatchMessage', country => {
            console.log(`Patch: ${country.name}`);
            let updatedCountry = {
              id: country.id,
              name: country.name,
            }
            medals.current.forEach(medal => {
              const count = country[medal.name];
              updatedCountry[medal.name] = { page_value: count, saved_value: count };
            });
            let mutableCountries = [...latestCountries.current];
            const idx = mutableCountries.findIndex(c => c.id === country.id);
            mutableCountries[idx] = updatedCountry;
  
            setCountries(mutableCountries);
          });
        })
        .catch(e => console.log('Connection failed: ', e));
      }
    // useEffect is dependent on changes connection
    }, [connection]);
  

  const handleAdd = async (name) => {
    try {
      await axios.post(apiEndPoint, {
        name: name
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      } catch (ex) {
      if (ex.response && (ex.response.status === 401 || ex.response.status === 403)) {
        alert("You are not authorized to complete this request");
      } else if (ex.response) {
        console.log(ex.response);
      } else {
        console.log("Request failed");
      }
    }  
  }
  const handleDelete = async (countryId) => {
    const originalCountries = countries;
    setCountries(countries.filter(c => c.id !== countryId));
    try {
      await axios.delete(`${apiEndPoint}/${countryId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        // country already deleted
        console.log("The record does not exist - it may have already been deleted");
      } else { 
        setCountries(originalCountries);
        if (ex.response && (ex.response.status === 401 || ex.response.status === 403)) {
          alert("You are not authorized to complete this request");
        } else if (ex.response) {
          console.log(ex.response);
        } else {
          console.log("Request failed");
        }
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
      await axios.patch(`${apiEndPoint}/${countryId}`, jsonPatch, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        // country already deleted
        console.log("The record does not exist - it may have already been deleted");
      } else if (ex.response && ex.response.status === 401) {
        alert('You are not authorized to complete this request');
        // to simplify, I am reloading the page to restore "saved" values
        window.location.reload(false);
      }else { 
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
    setCountries(mutableCountries);
  }
  const handleIncrement = (countryId, medalName) => handleUpdate(countryId, medalName, 1);
  const handleDecrement = (countryId, medalName) => handleUpdate(countryId, medalName, -1);
  const handleUpdate = (countryId, medalName, factor) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries ];
    mutableCountries[idx][medalName].page_value += (1 * factor);
    setCountries(mutableCountries);
  }
  const handleLogin = async (username, password) => {
    try {
      const resp = await axios.post(usersEndpoint, { username: username, password: password });
      const encodedJwt = resp.data.token;
      localStorage.setItem('token', encodedJwt);
      setUser(getUser(encodedJwt));
    } catch (ex) {
      if (ex.response && (ex.response.status === 401 || ex.response.status === 400 )) {
        alert("Login failed");
      } else if (ex.response) {
        console.log(ex.response);
      } else {
        console.log("Request failed");
      }
    }  
  }
  const getUser = (encodedJwt) => {
    // return unencoded user / permissions
    const decodedJwt = jwtDecode(encodedJwt);
    return {
      name: decodedJwt['username'],
      authenticated: true,
      canPost: decodedJwt['roles'].indexOf('medals-post') === -1 ? false : true,
      canPatch: decodedJwt['roles'].indexOf('medals-patch') === -1 ? false : true,
      canDelete: decodedJwt['roles'].indexOf('medals-delete') === -1 ? false : true,
    };
  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({
      name: null,
      authenticated: false,
      canPost: false,
      canPatch: false,
      canDelete: false
    });
  }
  const getAllMedalsTotal = () => {
    let sum = 0;
    // use medal count displayed in the web page for medal count totals
    medals.current.forEach(medal => { sum += countries.reduce((a, b) => a + b[medal.name].page_value, 0); });
    return sum;
  }
  
  useEffect(() => {
    if(countries && countries.length === "0") {
      async function fetchData() {
        const { data: fetchedCountries } = await axios.get(apiEndPoint);
        setCountries(fetchedCountries);
      }
      fetchData();
    }

  }, [countries])

  return (
    <React.Fragment>
    <Navbar className="navbar" style={{backgroundColor: '#507882'}}>
        <Container fluid>
          <Navbar.Brand>
            Olympic Medals
            <Badge className="ml-2" bg="light" text="dark" pill>{ getAllMedalsTotal() }</Badge>
          </Navbar.Brand>
          <Nav className="flex-end">
          { user.authenticated ? <Logout onLogout={ handleLogout } /> : <Login onLogin={ handleLogin } /> }
          { user.canPost && <NewCountry onAdd={ handleAdd } /> }
          </Nav>
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
            canDelete={ user.canDelete }
            canPatch={ user.canPatch }
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