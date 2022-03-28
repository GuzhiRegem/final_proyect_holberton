import React, { useState } from 'react';
import { MapRouteAdd } from './MapRouteAdd';
import { Modal, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Apiurl } from '../../services/apirest';

export function ModalMapRouteAdd(props) {

	let routeData = undefined;

	const updateChanges = (data) => {
		routeData = data
	};

	const saveChanges = () => {
		const inp = document.querySelector('#InputLineName').value;
		console.log(inp)
		if (inp && routeData.points && routeData.stops) {
			routeData.name = inp;
			props.add_func(routeData);
			props.onHide();
		}
		return;
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
					New route
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Spinner animation="border" variant="success" className="spinner-border" />
				<form>
					<div class="form-group">
						<label for="exampleInputEmail1">Line name:</label>
						<input type="email" class="form-control" id="InputLineName" aria-describedby="emailHelp" placeholder="Enter line name" />
						<small id="emailHelp" class="form-text text-muted">Try to have different numbers between lines</small>
					</div>
				</form>
				<MapRouteAdd id={props.id} updateFunction={updateChanges} on_load={onLoad} />
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={props.onHide}>Close</Button>
				<Button onClick={saveChanges}>Save</Button>
			</Modal.Footer>
		</Modal>
	);
}

export function MapRouteAddModal(props) {
	const [modalShow, setModalShow] = React.useState(false);

	return (
		<>
			<Button variant="success" onClick={() => setModalShow(true)}>
				Add Route
			</Button>

			<ModalMapRouteAdd
				show={modalShow}
				add_func={props.add_func}
				onHide={() => setModalShow(false)}
			/>
		</>
	);
}