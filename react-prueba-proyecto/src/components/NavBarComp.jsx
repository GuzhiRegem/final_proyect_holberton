import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Logo from '../images/logo.png';

export const NavbarComp  = () => {
    return (
        <Navbar className="nav-bar" expand="lg">
          <LinkContainer to="/">
            <Navbar.Brand>
                <img width="50px" src={Logo}  alt="logo" />
            </Navbar.Brand>
          </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ margin:"0px 10px 0px 0px" }} />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="justify-content-end "style={{ width: "98%" }}>
        <LinkContainer to="/Company">
          <Nav.Link>Company</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/Contact">
          <Nav.Link>Contact</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/Login">
          <Nav.Link>Login</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/Map">
          <Nav.Link>Map</Nav.Link>
        </LinkContainer>
      </Nav>
      </Navbar.Collapse>
      
    </Navbar>
    )}