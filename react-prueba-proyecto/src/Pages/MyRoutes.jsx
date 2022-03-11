import axios from 'axios'
import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Apiurl } from '../services/apirest'
import { useNavigate } from 'react-router-dom'

export  class MyRoutes extends Component {

    state = {
      data : []
    }

    username = localStorage.getItem("username");

    getRoutes = () => {
        let url = Apiurl + "/api/users/" + this.username + "/routes"
        axios.get(url)
        .then(res => {
            this.setState({data: res.data})
        })
      }
      componentDidMount() {
        this.getRoutes();
      }
      
      handelMapView = () => {
        axios.get(Apiurl + "/api/routes/", { headers: { "token": localStorage.getItem("read_token") } })
        .then(res => {
          console.log(res)
        })
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
            {this.state.data.map((Route) => {
              return (
                <tr key={Route._id}>
                  <td>{Route._id}</td>
                  <td>{Route.name}</td>
                  <td> <button onClick={ this.handelMapView}> View</button> </td>
                  <td>
                    <button className="btn btn-success" style={{"marginRight": "10px"}}>Edit</button>
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