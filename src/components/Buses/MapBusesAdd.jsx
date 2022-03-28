import React, { useEffect, useRef, useState } from "react";
import { Table } from 'react-bootstrap';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '../../style/map.css';
import axios from "axios";
import { Apiurl } from '../../services/apirest';
import { render } from "@testing-library/react";

export function BusesEditRow(props) {
  
  return (
    <tr>
      <td>chau</td>
      <td>hola</td>
    </tr>
  );
}
