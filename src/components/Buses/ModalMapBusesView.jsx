import React from 'react';
import { MapBusesView } from './MapBusesView';
import { Modal, Button, Spinner } from 'react-bootstrap';

export function ModalMapBusesView(props) {

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
            Map of {props.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Spinner animation="border" variant="success" className="spinner-border"/>
		      <div id="content-modal">
            <h1> TEST: </h1>
            <MapBusesView id={props.id} on_load={onLoad} />
			    </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
  export function MapBusesViewModal(props) {
    const [modalShow, setModalShow] = React.useState(false);

    return (
      <>
        <Button variant="primary" onClick={() => setModalShow(true)}>
          View
        </Button>

        <ModalMapBusesView
          show={modalShow}
          id={props.id}
          name={props.name}
          onHide={() => setModalShow(false)}
        />
      </>
    );
  }