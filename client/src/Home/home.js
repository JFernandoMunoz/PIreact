import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import SearchBar from '../controllers/searchBar/seachBar';
import RecipeCard from '../controllers/Card/Cards';
import './home.css';
import { Link } from 'react-router-dom';
import { setSearchResults, setSortOrder } from '../reducer/actions'; 




function Home() {
  const dispatch = useDispatch();
  const searchResults = useSelector(state => state.searchResults);
  
  const sortOrder = useSelector(state => state.sortOrder);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;


  useEffect(() => {
    fetchRecipes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder, ]);

  async function fetchRecipes() {
    try {
      const response = await axios.get('http://localhost:3001/getAll');

      const sortedResults = response.data.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.title.localeCompare(b.title);
          
        } else {
          return b.title.localeCompare(a.title);
        }
      });

      dispatch(setSearchResults(sortedResults));
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }

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

      dispatch(setSearchResults(sortedResults));
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

    dispatch(setSearchResults(filteredResults));
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
      

    dispatch(setSearchResults(filteredResults));
    setCurrentPage(1); // Reset current page when filters are applied
  };

  function handleCleanFilters() {
    fetchRecipes(true); // Restaurar las recetas originales
    setCurrentPage(1); // Resetear la página actual
  }

  // Paginate the results
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = searchResults.slice(indexOfFirstRecipe, indexOfLastRecipe);

  return (
    <div className="home-page">
      <h1 className="home-title">FOOD</h1>
      <div className="search-container">
        <SearchBar onSearch={handleSearch} />
        <button onClick={() => dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'))}>
          {sortOrder === 'asc' ? 'Sort A-Z' : 'Sort Z-A'}
        </button>
        <button onClick={() => handleFilterHealthScore('greater')}>Healthy</button>
        <button onClick={() => handleFilterHealthScore('lesser')}>Not Healthy</button>
        <button onClick={() => handleFilterSource('api')}>API</button>
        <button onClick={() => handleFilterSource('database')}>Database</button>
        <button onClick={handleCleanFilters}>Show all</button>
        <Link to="/create" className="create-button">Create Recipe</Link>
      </div>
      <div className="recipe-cards">
        {currentRecipes.map(recipe => (
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
}

export default Home;
