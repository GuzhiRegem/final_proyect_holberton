import axios from 'axios'
import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Apiurl } from '../services/apirest'
import { MapBusesViewModal } from '../components/Buses/ModalMapBusesView'
import { MapBusesEditModal } from '../components/Buses/ModalMapBusesEdit'

export class MyBuses extends Component {

	state = {
		data: []
	}

	username = localStorage.getItem("username");

	getRoutes = () => {
		let url = Apiurl + "/api/users/" + this.username + "/buses"
		axios.get(url)
			.then(res => {
				this.setState({ data: res.data })
			})
	}
	componentDidMount() {
		this.getRoutes();
	}

	render() {

		return (
			<div>
				<h1>My Points</h1>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>id</th>
							<th>Line</th>
							<th>View</th>
							<th>Accion</th>
						</tr>
					</thead>
					<tbody>
						{this.state.data.map((Buses) => {
							return (
								<tr key={Buses._id}>
									<td>{Buses._id}</td>
									<td>{Buses.wifi_name}</td>
									<td> <MapBusesViewModal id={Buses._id} /></td>
									<td> <MapBusesEditModal id={Buses._id} username={this.username}/></td>
									<td> <button variant="danger">Delete</button></td>
								</tr>
							)
						})}
					</tbody>
				</Table>
			</div>
		)
	}
}
