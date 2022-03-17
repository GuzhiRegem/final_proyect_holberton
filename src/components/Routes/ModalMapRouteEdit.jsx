import React, { useState } from 'react';
import { MapRouteEdit } from './MapRouteEdit';
import { Modal, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Apiurl } from '../../services/apirest';

export function ModalMapRouteEdit(props) {

  let routeData = undefined;

  const updateChanges = (data) => {
    routeData = data
  };

  const saveChanges = () => {
    let url = Apiurl + "/api/routes/edit/" + props.id
    axios.put(url, { points: routeData.route.geometry.coordinates, stops: routeData.stops }, { headers: { "token": localStorage.getItem("write_token") } })
      .then(res => {
        console.log(res)
      })
  };

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
        <MapRouteEdit id={props.id} updateFunction={updateChanges} on_load={onLoad}/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={props.onHide}>Close</Button>
        <Button onClick={saveChanges}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export function MapRouteEditModal(props) {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button variant="success" onClick={() => setModalShow(true)}>
        Edit
      </Button>

      <ModalMapRouteEdit
        show={modalShow}
        id={props.id}
        name={props.name}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}