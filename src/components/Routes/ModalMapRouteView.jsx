import React from 'react';
import { MapRouteView } from './MapRouteView';
import { Modal, Button, Spinner } from 'react-bootstrap';

export function ModalMapRouteView(props) {

    const onLoad = () => {
      document.querySelector(".modal-body").removeChild(document.querySelector(".spinner-border"));
    }

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
			View Route
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
		<h3>id: <strong>{props.id}</strong></h3>
		<h3>name: <strong>{props.name}</strong></h3>
          <Spinner animation="border" variant="success" className="spinner-border"/>
          <MapRouteView id={props.id} on_load={onLoad}/>
        </Modal.Body>
      </Modal>
    );
  }
  
  export function MapRouteViewModal(props) {
    const [modalShow, setModalShow] = React.useState(false);

    return (
      <>
        <Button variant="primary" onClick={() => setModalShow(true)}>
          View
        </Button>

        <ModalMapRouteView
          show={modalShow}
          id={props.id}
          name={props.name}
          onHide={() => setModalShow(false)}
        />
      </>
    );
  }