import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Apiurl } from '../../services/apirest'
import axios from 'axios'
import { MapBusesEdit } from './MapBusesEdit';
import { Table } from 'react-bootstrap';
import '../../style/buses.css';

export function ModalMapBusesEdit(props) {

  let url = Apiurl + "/api/users/" + props.name + "/routes"
  axios.get(url)
    .then(res => {
      console.log(res.data);
      const tableObj = document.querySelector('#editBusTable');
      if (tableObj) {
        tableObj.querySelector('tbody').innerHTML = "";
        for (let i = 0; res.data[i]; i++) {
          const newRow = document.createElement('tr');
          newRow.addEventListener('click', function (params) {
            console.log(this);
          })
          newRow.key = res.data[i]._id;
          newRow.innerHTML="<td>" + res.data[i]._id + "</td><td>" + res.data[i].name + "</td>"
          tableObj.appendChild(newRow);
        }
      }
    })
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
        <Table striped bordered hover id="editBusTable">
          <thead>
            <tr>
              <th>id</th>
              <th>Line</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export function MapBusesEditModal(props) {
  const [modalShow, setModalShow] = React.useState(false);

  console.log(props);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Edit
      </Button>

      <ModalMapBusesEdit
        show={modalShow}
        id={props.id}
        name={props.username}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}