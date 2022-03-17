import axios from 'axios'
import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Apiurl } from '../services/apirest'

export class MyBuses extends Component {

  state = {
    data: []
  }

  username = localStorage.getItem("username");

  getBuses = () => {
    let url = Apiurl + "/api/users/" + this.username + "/buses"
    axios.get(url)
      .then(res => {
        this.setState({ data: res.data })
      })
  }
  componentDidMount() {
    this.getBuses();
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
                  <td>{Buses.name}</td>
                  <td> <button onClick={this.handelMapView}> View</button> </td>
                  <td>
                    <button className="btn btn-success" style={{ "marginRight": "10px" }}>Edit</button>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }
}
