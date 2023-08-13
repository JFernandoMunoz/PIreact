import React, { useState, } from 'react';
import axios from 'axios';
import SearchBar from '../controllers/searchBar/seachBar';
import RecipeCard from '../controllers/Card/Cards';
import './home.css'
import { Link } from 'react-router-dom';

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  
  const handleSearch = async (searchValue) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/recipes/name?name=${searchValue}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className="home-page">
      <h1 className="home-title">Home Page</h1>
      <div className="search-container">
        <SearchBar onSearch={handleSearch} />
        <Link to="/create" className="create-button">Create Recipe</Link>
      </div>
      <div className="recipe-cards">
        {searchResults.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Home;
