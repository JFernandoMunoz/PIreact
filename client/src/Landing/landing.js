import React from 'react';
import { NavLink } from 'react-router-dom';
import './landing.css'


const LandingPage = ()=>{
    return (
        <div className="landing-page">
      <h1 className='title'>Food Recipes by Juan Muñoz as a SoyHenry's project</h1>
        <NavLink to="/home">
        <button className='button'>Ingresar</button>
        </NavLink>
    </div>
    )
}

export default LandingPage;