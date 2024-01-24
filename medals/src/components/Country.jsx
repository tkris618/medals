import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';

class Country extends Component {
    state = { 
        name: 'United States',
        medals: 0,
    }

    handleClick = () => {
      this.setState({ medals: this.state.medals + 1});
      console.log(this.state.medals);
    }
    render() {
        return ( 
        <Container maxWidth='sm'>
            <Paper elevation={4} className='jss1' style={{width: '260px'}}>
            <div className='country' style={{textAlign: 'center'}}>
            <div className='name' style={{ fontSize: '2em', fontWeight: '700', marginBottom: '10px'}}>{ this.state.name }</div>
                <Divider style={{marginBottom: '10px'}}/>
            <div className='medals' style={{fontSize: '1.5em', textTransform: 'capitalize', display: 'flex', alignItems: 'center', marginTop: '5px'}}>
                <Avatar style={{backgroundColor: '#F4CBBA'}}>{ this.state.medals }</Avatar> <span style={{width: '130px', paddingLeft: '10px'}}>gold medals</span>
                <Button variant="contained" onClick={this.handleClick}> <AddIcon></AddIcon> </Button>
            </div>
            </div>
            </Paper>
        </Container>
        );
    }
}

export default Country