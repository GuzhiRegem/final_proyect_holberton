import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';import {Contact } from "./Pages/Contact";
import { Login } from "./Pages/Login";
import { Company } from "./Pages/Company";
import { MapView } from "./Pages/Map";
import { Users } from "./Pages/Users";
import { Home } from "./Pages/Home";
import { NotFound } from './Pages/NotFound';
import { NavbarComp } from "./components/NavBarComp";
import { MyRoutes } from './Pages/MyRoutes';
import { MyPoints } from './Pages/MyPoints';
import { MyBuses } from './Pages/MyBuses';


export function App() { 
  
  return (
    <BrowserRouter>
      <NavbarComp />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/company" element={<Company />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/user/:user_name" element={<Users />} />
        <Route path="user/:user_name/MyRoutes/" element={<MyRoutes />} />
        <Route path="user/:user_name/MyBuses/" element={<MyBuses />} />
        <Route path="user/:user_name/MyPoints/" element={<MyPoints />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  ); 
}  