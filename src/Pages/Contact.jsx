import React from "react";
import "../style/Company.css";
import Colo from "../images/Colo.png";
import Agus from "../images/Agus.png";
import Seba from "../images/Seba.png";
import LinkAgus from "../images/LinkAgus.jpeg";
import LinkSeba from "../images/LinkSeba.jpeg";
import LinkColo from "../images/LinkDiego.jpeg";
import GitColo from "../images/GitDiego.jpeg";
import GitAgus from "../images/GitAgus.jpeg";
import GitSeba from "../images/GitSeba.jpeg";

export const Contact = () => {
    return (
        <div className="container justify-content-center align-items-center Container">
        <br />
        <h1>Contact</h1>
        <br />
        <div className="overflow">
        <div class="row row-cols-1 row-cols-md-3 g-4">
  <div class="col mb-4">
    <div class="card h-100">
      <img src={Colo} class="card-img-top cards_contact" alt="..." />
      <div class="card-body">
        <h5 class="card-title">Diego Guarise</h5>
        <br />
        <img src= {LinkColo} width="100px" height="100px" class="rounded float-start" alt="Diego Linkedin" />
        <img src={GitColo} width="100px" height="100px" class="rounded float-end" alt="Diego Github" />
      </div>
    </div>
  </div>
  <div class="col mb-4">
    <div class="card h-100">
      <img src={Seba} class="card-img-top cards_contact" alt="..." />
      <div class="card-body">
        <h5 class="card-title">Sebastian Moreira</h5>
        <br />
        <img src= {LinkSeba} width="100px" height="100px" class="rounded float-start" alt="Seba Linkedin" />
        <img src={GitSeba} width="100px" height="100px" class="rounded float-end" alt="Seba Github" />
      </div>
    </div>
  </div>
  <div class="col mb-4">
    <div class="card h-100">
      <img src={Agus} class="card-img-top cards_contact" alt="..." />
      <div class="card-body">
        <h5 class="card-title">Agustin Bolioli</h5>
        <br />
        <img src= {LinkAgus} width="100px" height="100px" class="rounded float-start" alt="Agustin Linkedin" />
        <img src={GitAgus} width="100px" height="100px" class="rounded float-end" alt="Agustin Github" />
      </div>
    </div>
  </div>
</div>
</div>
        </div>
    );
}