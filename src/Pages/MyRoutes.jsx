import axios from 'axios'
import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Apiurl } from '../services/apirest'
import { MapRouteViewModal } from '../components/Routes/ModalMapRouteView'
import { MapRouteEditModal } from '../components/Routes/ModalMapRouteEdit'
import { MapRouteAddModal } from '../components/Routes/ModalMapRouteAdd'
import { MapRouteDeleteModal } from '../components/Routes/ModalMapRouteDelete'

export class MyRoutes extends Component {

	state = {
		data: []
	}

	username = localStorage.getItem("username");

	getRoutes = () => {
		let url = Apiurl + "/api/users/" + this.username + "/routes"
		axios.get(url)
			.then(res => {
				this.setState({ data: res.data })

			})
	}

	addRoute = (data) => {
		let url = Apiurl + "/api/routes/add";
		data.owner = localStorage.getItem("userId")
		axios.post(url, data, { headers: { "token": localStorage.getItem("write_token") } })
			.then(res => {
				this.getRoutes();
			})
			.catch(err => {
				if (err.response) {
				  console.log(err.response);
				}})
	}
	removeRoute = (id) => {
		let url = Apiurl + "/api/routes/delete/" + id;
		axios.delete(url, { headers: { "token": localStorage.getItem("write_token") } })
			.then(res => {
				this.getRoutes();
			})
			.catch(err => {
				if (err.response) {
				  console.log(err.response);
				}})
	}
	componentDidMount() {
		this.getRoutes();
	}

	render() {
		return (
			<div>
				<h1>My Routes</h1>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>id</th>
							<th>Line</th>
							<th>Accion</th>
						</tr>
					</thead>
					<tbody>
						{this.state.data.map(route => (
							<tr key={route._id}>
								<td>{route._id}</td>
								<td>{route.name}</td>
								<td>
									<MapRouteViewModal id={route._id} name={route.name} />
									<MapRouteEditModal id={route._id} name={route.name} update_func={this.getRoutes} />
									<MapRouteDeleteModal id={route._id} name={route.name} remove_func={this.removeRoute}/>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
				<MapRouteAddModal add_func={this.addRoute} />
			</div>
		)
	}
}