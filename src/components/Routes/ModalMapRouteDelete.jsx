import React, { useState } from 'react';
import { MapRouteAdd } from './MapRouteAdd';
import { Modal, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Apiurl } from '../../services/apirest';

export function ModalMapRouteDelete(props) {

  let routeData = undefined;

  const saveChanges = () => {
	props.remove_func(props.id);
	props.onHide();
	return;
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Delete route
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>WARNING:</h1>
		<h2>deleting route</h2>
		<h3>name:</h3>
		<h2>{props.name}</h2>
		<h3>id:</h3>
		<h2>{props.id}</h2>
        <Button onClick={saveChanges}>DELETE</Button>
      </Modal.Body>
    </Modal>
  );
}

export function MapRouteDeleteModal(props) {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button variant="success" onClick={() => setModalShow(true)}>
        Delete
      </Button>

      <ModalMapRouteDelete
        show={modalShow}
		name={props.name}
		id={props.id}
		remove_func={props.remove_func}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}