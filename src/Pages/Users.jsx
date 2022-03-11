import React from "react";
import '../style/users.css'
import { Cards } from "../components/Cards";

export const Users = () => {

    const username = localStorage.getItem("username");

    return (
        <div className="justify-content-center align-items-center Container-cards">
            <h1> Hello {username} </h1>
            <br />
            <Cards />
        </div>
    )
}