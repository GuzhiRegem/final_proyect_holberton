import React from 'react'
import "../style/users.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Apiurl } from '../services/apirest';

export function Card(props) {
  const Navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handelClick = () => {
    Navigate("/user/"+ username + props.button);
    axios.get(Apiurl + "/api/users/" + localStorage.getItem("username"), { headers: { "token": localStorage.getItem("read_token") } })
      .then(res => {
        console.log(res)
      })
    }

  return (
    <div className='card' >
        <div className="overflow">
          <img src={props.Image} className="card-img-top cards_user" alt='' />
        </div>
        <div className='card-body'>
            <h5 className='card-title'>{ props.title}</h5>
            <p className='card-text text-secondary'>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <button className='btn btn-success' type='button'  onClick={handelClick}>Go to {props.title}</button>
        </div>
    </div>
  )
}
