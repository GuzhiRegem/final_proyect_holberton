import React from "react";
import "../style/Company.css";
import logo from "../images/Logo-hd.png";
import { Container } from "react-bootstrap";

export const Company = () => {
    return (
        <div className="container justify-content-center align-items-center Container">
        <div className="img-container">
        <img src={logo} width="250px" />
        </div>
        <h1>Tour-Me</h1>
        <h2>Who are we?</h2>
        <p>We are a group of software students, who are driven to learn and help. 
        In this project we developed a semi-decentralized web application for
        that the users of the metropolitan public transport can at the moment of getting on a bus
        without internet access to get to know and travel around Montevideo in an easy and accessible way, watching
        in an easy and accessible way, seeing the points of interest around them through a dynamic map
        through a dynamic map which also shows the stops and the route of the bus itself.</p>
        <br />
        </div>
    );
}