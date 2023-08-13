import React from 'react';
import './Cards.css';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/details/${recipe.id}`} className="recipe-card-link">
      <div className="recipe-card">
        <img src={recipe.image} alt={recipe.title} />
        <h3>Title: {recipe.title}</h3>
        {recipe.diets && recipe.diets.length > 0 && (
          <p>Diets: {recipe.diets.join(', ')}</p>
        )}
      </div>
    </Link>
  );
};

export default RecipeCard;
