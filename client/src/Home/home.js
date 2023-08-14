import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../controllers/searchBar/seachBar';
import RecipeCard from '../controllers/Card/Cards';
import './home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' por defecto
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  const handleSearch = async (searchValue) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/recipes/name?name=${searchValue}`
      );

      const sortedResults = response.data.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      });

      setSearchResults(sortedResults);
      setCurrentPage(1); // Reset current page when new search is performed
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleFilterHealthScore = (filterValue) => {
    const filteredResults = searchResults.filter((recipe) => {
      if (filterValue === 'greater') {
        return recipe.healthScore > 50;
      } else if (filterValue === 'lesser') {
        return recipe.healthScore <= 50;
      }
      return true;
    });

    setSearchResults(filteredResults);
    setCurrentPage(1); // Reset current page when filters are applied
  };

  const handleFilterSource = (source) => {
    const filteredResults = searchResults.filter((recipe) => {
      if (source === 'api') {
        return typeof recipe.id === 'number';
      } else if (source === 'database') {
        return typeof recipe.id === 'string';
      }
      return true;
    });

    setSearchResults(filteredResults);
    setCurrentPage(1); // Reset current page when filters are applied
  };

  // Paginate the results
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = searchResults.slice(indexOfFirstRecipe, indexOfLastRecipe);

  return (
    <div className="home-page">
      <h1 className="home-title">Home Page</h1>
      <div className="search-container">
        <SearchBar onSearch={handleSearch} />
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? 'Sort Z-A' : 'Sort A-Z'}
        </button>
        <button onClick={() => handleFilterHealthScore('greater')}>Saludable</button>
        <button onClick={() => handleFilterHealthScore('lesser')}>No saludable</button>
        <button onClick={() => handleFilterSource('api')}>API</button>
        <button onClick={() => handleFilterSource('database')}>Base de datos</button>
        <Link to="/create" className="create-button">Create Recipe</Link>
      </div>
      <div className="recipe-cards">
        {currentRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil(searchResults.length / recipesPerPage) }).map((_, index) => (
          <button key={index} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;




