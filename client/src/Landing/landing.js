import React from 'react';
import { NavLink } from 'react-router-dom';
import './landing.css'


const LandingPage = ()=>{
    return (
        <div className="landing-page">
      <h1 className='title'>Food React project</h1>
      <p className='parrafo'>Food recipes or diets as a React and JavaScript project made by Juan Muñoz for SoyHenry academy, individual project.</p>
      <a href="https://github.com/JFernandoMunoz/PIreact.git">
        <button className='gitbutton'>GitHub</button>
    </a>
        <NavLink to="/home">
        <button className='button'>Enter</button>
        </NavLink>
    </div>
    )
}

export default LandingPage;