import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './details.css'

const DetailPage = ({ match }) => {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipe/${match.params.id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };

    fetchRecipeDetails();
  }, [match.params.id]);

  return (
    <div className="detail-page">
        <Link to="/home" className="back-button">Back</Link>
      {recipe ? (
            <div className="recipe-details">
            <h2>{recipe.title}</h2>
            <img src={recipe.image} alt={recipe.title} />
            <p dangerouslySetInnerHTML={{ __html: recipe.summary }} />
            <p>Health Score: {recipe.healthScore}</p>
            <h3>Diets</h3>
            <p>{recipe.diets.join(', ')}</p>
            <h3>Instructions</h3>
            <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
            </div>
      ) : (
        <p>Loading recipe details...</p>
      )}
    </div>
  );
};

export default DetailPage;
