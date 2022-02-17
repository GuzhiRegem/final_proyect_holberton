import React, { Component } from "react";
import { Navbar, Nav, NavDropdown,Form,FormControl,Button} from "react-bootstrap";
import Logo from '../images/logo.svg';

export class NavbarComp extends Component {
  render() {
    return (
        <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">
            <img width="50px" className="d-inline-block align-top" src={Logo}  alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#link">Link</Nav.Link>
        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
    </Navbar>
    )}
}