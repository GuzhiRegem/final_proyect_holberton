import React from "react";
import ReactDOM from "react-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavbarComp } from "./components/NavBarComp";
import {Contact } from "./components/Contact";
import { Login } from "./components/Login";
import { Company } from "./components/Company";
import { MapView } from "./components/Map";
import { App } from "./App";
import './index.css';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
 
mapboxgl.accessToken = 'pk.eyJ1IjoiYm9saW9saWFndXN0aW4iLCJhIjoiY2t6eDVzcWY5NDJoNTJucW9xaHY2bXA2dCJ9.ZR3iXpsXSNMjzh9Nj-0EDQ';


ReactDOM.render(
    <React.StrictMode>
        <Router>
            <NavbarComp />
            <Routes>
                <Route exact path="/" element={<App />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/company" element={<Company />} />
                <Route path="/map" element={<MapView />} />
            </Routes>
        </Router>
    </React.StrictMode>,
    document.getElementById("root")
);