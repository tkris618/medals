import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
// import Medal from './Medal';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';



class Country extends Component {
  
    
    render() {
        const {onIncrement, onDecrement, country, onDelete, } = this.props;
        return ( 
           
            
            <Grid item>
        <Paper elevation={4} className='jss1' style={{width: '300px'}}>
        <div className='Country'>
                                                                                                        {/* placed the counter for the countries medal totals here because when it loops through the countries to display it in App.js it can add the totals as it does */}
                <div className='name' style={{alignItems: 'center', fontSize: '1.8em'}}> { country.name } {country.gold+ country.silver+ country.bronze} <DeleteIcon id={ country.id } onClick={ () => onDelete(country.id)}></DeleteIcon></div>
                <Divider style={{marginBottom: '10px'}}/>
                <div className='jss7' ><Avatar style={{backgroundColor: '#D1E8EE', color: '#8897AA'}}>{ country.gold}</Avatar><span className='jss9'>gold medals</span>
                <Button variant='contained' className='jss10' onClick={ () => onIncrement(country.id, 1)}> + </Button>
                <Button variant='contained' className='jss10' onClick={ () => onDecrement(country.id, 1)}> - </Button>
                </div>
                <div className='jss7'><Avatar style={{backgroundColor: '#D1E8EE', color: '#8897AA'}}>{ country.silver}</Avatar> <span className='jss9'>silver medals</span>
                <Button variant='contained' className='jss10' onClick={ () => onIncrement(country.id, 2)}> + </Button>
                    <Button variant='contained' className='jss10' onClick={ () => onDecrement(country.id, 2)}> - </Button>
                </div>
                <div className='jss7'><Avatar style={{backgroundColor: '#D1E8EE', color: '#8897AA'}}>{ country.bronze}</Avatar> <span className='jss9'>bronze medals</span>
                <Button variant='contained' className='jss10' onClick={ () => onIncrement(country.id, 3)}> + </Button>
                <Button variant='contained' className='jss10' onClick={ () => onDecrement(country.id, 3)}> - </Button>
                </div>
                
            </div>
            </Paper>
            </Grid>
         
        );
    }
}

export default Country
