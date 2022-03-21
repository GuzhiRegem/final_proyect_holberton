import axios from 'axios'
import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Apiurl } from '../services/apirest'
import { MapRouteViewModal } from '../components/Routes/ModalMapRouteView'
import { MapRouteEditModal } from '../components/Routes/ModalMapRouteEdit'

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
              <th>View</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(route => (
              <tr key={route._id}>
                <td>{route._id}</td>
                <td>{route.name}</td>
                <td> <MapRouteViewModal id={route._id} name={route.name} /></td>
                <td> <MapRouteEditModal id={route._id} name={route.name} /></td>
                <td><button variant="danger">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
}