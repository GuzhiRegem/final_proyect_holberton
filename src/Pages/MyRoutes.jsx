import axios from 'axios'
import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Apiurl } from '../services/apirest'
import { ModalMap } from '../components/ModalMapView'
import { ModalMapEdit } from '../components/ModalMapEdit'
import 'reactjs-popup/dist/index.css';

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
                  <td> <ModalMap id={Route._id}  name={Route.name} /></td>
                  <td>
                    <ModalMapEdit id={Route._id}  name={Route.name} />
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