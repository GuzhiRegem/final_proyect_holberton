import React from "react";
import  carousel3 from "../images/Carousel3.jpg";
import  carousel4 from "../images/Carousel4.jpg";
import  carousel5 from "../images/carousel5.jpg";
import  carousel1 from "../images/Carousel1.jpg";
import { Carousel } from "react-bootstrap";
import "../style/Home.css";


export const Home = () => {
    return (
        <div className="container justify-content-center align-items-center Container">
        <Carousel className="carousel">
        <Carousel.Item className="carousel-item">
        <img
        className="d-block w-100"
        src={carousel1}
        />
        <Carousel.Caption>
        <h2>Routes</h2>
        <h3>Nulla vitae elit libero, a pharetra augue mollis interdum.</h3>
        </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item className="carousel-item">
        <img
        className="d-block w-100"
        src={carousel4}
        />
    <Carousel.Caption>
      <h2>Lineas</h2>
      <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item className="carousel-item">
    <img
      className="d-block w-100"
      src={carousel3}
    />
    <Carousel.Caption>
      <h2>Points</h2>
      <h3>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</h3>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>
        </div>
    );
}