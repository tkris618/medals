import React, { Component } from 'react';
// import Country from './Country';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


class NewCountry extends Component {
    state = {
        open: false,
        name: '',
        gold: 0,
        silver: 0,
        bronze: 0,
    }
   
   toggleForm = () => this.setState({ showForm : !this.state.showForm });
   handleChange = (e) => this.setState({ [e.target.name ] : e.target.value});
   saveCountry = () => {
    const { name, gold, silver, bronze } = this.state;
    this.props.onAdd(name, gold, silver, bronze);
    this.toggleForm();
   }

    
    render() {
        const {showForm, name,} = this.state;
        return (
            
            <div className='New-country'>
                {
                    (showForm) ?
                    <Dialog
                    open= {this.toggleForm}
                    onClose= {this.toggleForm}>
                        <DialogContent>
                            <DialogTitle>Add Country</DialogTitle>
                    <form>
                        <TextField type='text' id='name' name='name' value={ name } onChange={ this.handleChange } placeholder='Country' autoComplete='off'></TextField>
                        <Button variant='contained' className='jss10' type='button'
                         onClick={ this.saveCountry } 
                         disabled={ name.trim().length === 0}>
                            Save</Button>
                        <Button variant='contained' className='jss10' type='button' onClick={this.toggleForm}>Cancel</Button>
                    </form>
                    </DialogContent>
                    </Dialog>
                    :
                    <Fab aria-label="add" style={{ right: '1em',
                        bottom: '1em',
                        position: 'fixed'}} onClick={this.toggleForm}>
                        <AddIcon className='jss4' />
                    </Fab>
                    // <span onClick={this.toggleForm} className='Toggle-form'>New Country</span>
                }
            </div>
        )
    }
}

export default NewCountry;