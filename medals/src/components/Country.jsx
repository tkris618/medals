import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

class Country extends Component {
    state = { 
        name: this.props.country.name,
        gold: this.props.country.gold,
    }

    handleIncrement = () => {
      this.setState({ gold: this.state.gold + 1});
    }
    handleDecrement = () => {
        if (this.state.gold > 0) {
        this.setState({ gold: this.state.gold - 1});
        }
    }
    render() {
        return ( 
        <Container maxWidth= 'sm' style={{paddingBottom: '25px', textTransform: 'capitalize'}}>
            <Paper elevation={4} className='jss1' style={{width: '300px'}}>
            <div className='Country'>
                <div className='name' style={{fontSize: '1.5em'}}> { this.state.name} </div>
                <Divider style={{marginBottom: '10px'}}/>
                <div className='medals' style={{ display: 'flex', alignItems: 'center'}}><Avatar style={{backgroundColor: '#D1E8EE', color: '#8897AA'}}>{ this.state.gold} </Avatar><span style={{paddingLeft: '10px', fontSize: '1.2em'}}>gold medals</span>
                    <Button variant='contained' style={{backgroundColor: '#8897AA'}} onClick={ () => this.handleIncrement(this.props.country.id)}> + </Button>
                    <Button variant='contained' style={{backgroundColor: '#8897AA'}} onClick={ () => this.handleDecrement(this.props.country.id)}> - </Button>
                </div>
            </div>
            </Paper>
        </Container>
        );
    }
}

export default Country