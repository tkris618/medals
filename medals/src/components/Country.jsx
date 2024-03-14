import React from 'react';
import Medal from './Medal';
import { TrashFill, ArrowCounterclockwise, ArrowDownCircle } from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

const Country = (props) => {
  const { country, medals, onIncrement, onDecrement, onDelete, onSave, onReset, canDelete, canPatch } = props;
  const getMedalsTotal = (country, medals) => {
    let sum = 0;
    medals.forEach(medal => { sum += country[medal.name].page_value; });
    return sum;
  }
  const renderSaveButton = () => {
    let unsaved = false;
    medals.forEach(medal => {
      if (country[medal.name].page_value !== country[medal.name].saved_value) {
        unsaved = true;
      }
    });
    return unsaved;
  }
  return (
    <Card>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between">
          <span>
          { country.name }
          <Badge bg="secondary" text="light" pill className="ml-2">
            { getMedalsTotal(country, medals) }
          </Badge>
          </span>
   {/* this will render save/reset buttons if the page/saved medal counts are not equal
          otherewise, the delete country button will be rendered */}
          { renderSaveButton() ?
            <React.Fragment>
              {/* TODO: use Bootstrap stying / icons */}
              <ArrowDownCircle onClick={ () => onSave(country.id) } style={{ color:'green'}}/>
              <ArrowCounterclockwise onClick={ () => onReset(country.id) } style={{ color: 'blue'}}/>
            </React.Fragment>
            :
            canDelete && <TrashFill onClick={() => onDelete(country.id)} className='icon-btn' style={{ color:'red' }} />          }        </Card.Title>
        <ListGroup variant="flush">
        { medals.map(medal =>
        <ListGroup.Item className="d-flex justify-content-between" key={ medal.id }>
          <Medal  
            country={ country } 
            medal={ medal } 
            canPatch={ canPatch }
            onIncrement={ onIncrement } 
            onDecrement={ onDecrement } />
        </ListGroup.Item>
        ) }
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default Country;