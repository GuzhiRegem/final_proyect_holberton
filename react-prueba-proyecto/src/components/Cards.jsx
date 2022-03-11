import React from 'react'
import { Card } from "./Card";
import Routeimg from '../images/Routeimg.png'
import Buses from '../images/Buses.png'
import Points from '../images/Points.png'

export  function Cards() {

    const cards = [
        {
            id: 1,
            title: "My Routes",
            Image: Routeimg,
            button: "/MyRoutes"
        },
        {
            id: 2,
            title: "My Buses",
            Image: Buses,
            button: "/MyBuses"
        },
        {
            id: 3,
            title: "My Points",
            Image: Points,
            button: "/MyPoints"
        }
    ]

  return (
    <div>
        <div className='row' >
            {cards.map(card => (
                <div className='col-sm-4' key={card.id}>
                    <Card title={card.title} Image={card.Image} button={card.button} />
                    </div>
                    ))
            }       
    </div>
    </div>
    )
}
