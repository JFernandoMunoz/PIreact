import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './form.css';
import { Link } from 'react-router-dom';

const FormPage = () => {
  const [diets, setDiets] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    summary: '',
    healthScore: '',
    steps: '',
    image: '',
    diets: [],
  });

  const [errors, setErrors] = useState({
    name: '',
    healthScore: '',
    summary: '',
    steps: '',
    image: '',
    diets: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const response = await axios.get('http://localhost:3001/diets');
        setDiets(response.data);
      } catch (error) {
        console.error('Error fetching diets:', error);
      }
    };

    fetchDiets();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDietChange = (event) => {
    const selectedDiet = event.target.value;
    if (event.target.checked) {
      setFormData({
        ...formData,
        diets: [...formData.diets, selectedDiet],
      });
    } else {
      setFormData({
        ...formData,
        diets: formData.diets.filter((diet) => diet !== selectedDiet),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasErrors()) {
      try {
        const formDataToSend = {
          Nombre: formData.name,
          Imagen: formData.image,
          ResumenDelPlato: formData.summary,
          NivelDeComidaSaludable: parseFloat(formData.healthScore),
          PasoAPaso: formData.steps.split('\n'),
          dietIds: formData.diets,
        };

        await axios.post('http://localhost:3001/createRecipe', formDataToSend);
        setSuccessMessage('Recipe created successfully!');
        setErrorMessage('');
        clearForm();
      } catch (error) {
        console.error('Error creating recipe:', error);
        setSuccessMessage('');
        setErrorMessage('An error occurred while creating the recipe, fill all fields.');
      }
    }
  };

  const hasErrors = () => {
    const newErrors = {};

    if (formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    if (isNaN(formData.healthScore) || formData.healthScore < 0 || formData.healthScore > 100) {
      newErrors.healthScore = 'Health Score must be a number between 0 and 100';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length > 0;
  };

  const clearForm = () => {
    setFormData({
      name: '',
      summary: '',
      healthScore: '',
      steps: '',
      image: '',
      diets: [],
    });
    setErrors({});
  };

  return (
    <div className="form-page">
      <Link to="/home" className="back-button">Volver</Link>
      <h2>Create Recipe</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}

        <label>Summary</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
        />
        {errors.summary && <p className="error-message">{errors.summary}</p>}

        <label>Health Score</label>
        <input
          type="number"
          name="healthScore"
          value={formData.healthScore}
          onChange={handleInputChange}
        />
        {errors.healthScore && <p className="error-message">{errors.healthScore}</p>}

        <label>Steps</label>
        <textarea
          name="steps"
          value={formData.steps}
          onChange={handleInputChange}
        />
        {errors.steps && <p className="error-message">{errors.steps}</p>}

        <label>Image</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
        />
        {errors.image && <p className="error-message">{errors.image}</p>}

        <label>Diets</label>
        {diets.map((diet) => (
          <label key={diet.ID}>
            <input
              type="checkbox"
              name="diets"
              value={diet.ID}
              onChange={handleDietChange}
              checked={formData.diets.includes(diet.ID)}
            />
            {diet.Nombre}
          </label>
        ))}

        <button type="submit" className='buttonsubmit'>Create Recipe</button>
      </form>
    </div>
  );
};

export default FormPage;
