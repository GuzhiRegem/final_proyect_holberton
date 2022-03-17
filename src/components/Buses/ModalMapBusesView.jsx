import React, { useState } from 'react';
import { MapRouteView } from '../MapRouteView';
import { Modal, Button } from 'react-bootstrap';

export function ModalMapRouteView(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          View
        </Button>
  
        <Modal show={show} onHide={handleClose} className="modal-map">
          <Modal.Header closeButton>
            <Modal.Title>Map of {props.name} </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-map-body">
            <MapRouteView id={props.id}/>
            </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
