import React, { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { MapRouteEdit } from './MapRouteEdit';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { Apiurl } from '../services/apirest';

export function ModalMapEdit(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let routeData = undefined;
    const updateChanges = (data) => {
      routeData = data
    };
    const saveChanges = () => {
      let url = Apiurl + "/api/routes/edit/" + props.id
      axios.put(url, {points: routeData.geometry.coordinates}, { headers: { "token": localStorage.getItem("write_etoken") } })
      .then(res => {
        console.log(res)
      })
    }; 
  
    return (
      <>
        <button className="btn btn-success"  onClick={handleShow} style={{"marginRight": "10px"}}>
          Edit
          </button>
  
        <Modal show={show} onHide={handleClose} className="modal-map">
          <Modal.Header closeButton>
            <Modal.Title>Map of {props.name} </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-map-body">
            <MapRouteEdit id={props.id} updateFunction={updateChanges}/>
            </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={saveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
