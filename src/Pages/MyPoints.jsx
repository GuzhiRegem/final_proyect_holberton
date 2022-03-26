import axios from 'axios'
import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Apiurl } from '../services/apirest'

export class MyPoints extends Component {

  state = {
    data: []
  }

  username = localStorage.getItem("username");

  getPoints = () => {
    let url = Apiurl + "/api/users/" + this.username + "/points"
    axios.get(url)
      .then(res => {
        this.setState({ data: res.data })
      })
  }

  componentDidMount() {
    this.getPoints();
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
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((Points) => {
              return (
                <tr key={Points._id}>
                  <td>{Points._id}</td>
                  <td>{Points.name}</td>
                  <td>
				  	<button onClick={this.handelMapView}> View</button>
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
