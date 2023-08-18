const { Router, application } = require('express');
const { Recipe, Diets } = require('../db')
require('dotenv').config();
const { API_KEY } = process.env;
const axios = require('axios');
const { Op } = require('sequelize');


// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();


// controllers
const getRecipeByid = async (id)=>{
    if(!id) throw new Error("No se envió un id")
    const recipe = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&addRecipeInformation=true`);
    return recipe.data
}

const getAllRecipes = async (id)=>{
 
  const recipe = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`);
  return recipe.data
}

const getRecipesByName = async (name) => {
    if (!name) throw new Error('No se proporcionó un nombre');
  
    // Escapar los caracteres especiales del nombre para evitar problemas en la URL
    const encodedName = encodeURIComponent(name);
  
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100&query=${encodedName}`
    );
    return response.data.results;
  };
  
//  rutas
router.get('/getAll', async (req, res) => {
  try {
   

    const apiRecipes = await getAllRecipes(); // Obtener recetas de la API
    const dbRecipes = await Recipe.findAll({
      include: [
        {
          model: Diets,
          attributes: ['Nombre'], // Incluir solo el nombre de las dietas
          through: {
            attributes: [] // No incluir atributos de la tabla intermedia
          }
        }
      ],
    });

   
   

    const simplifiedApiRecipes = apiRecipes.results.map(({ id, title, image, diets, healthScore }) => {

      return {
        id,
        title,
        image,
        diets,
        healthScore
      };
    });

    const simplifiedDbRecipes = dbRecipes.map((recipe) => {
      const {
        ID: id,
        Nombre: title,
        Imagen: image,
        ResumenDelPlato: summary,
        NivelDeComidaSaludable: healthScore,
        PasoAPaso: instructions,
        diets,
      } = recipe;
    
      const simplifiedDiets = diets.map(diet => diet.Nombre);
    
      return {
        id, // Usamos el ID real de la receta en la base de datos
        title,
        image,
        summary,
        healthScore,
        instructions,
        diets: simplifiedDiets,
      };
    });
    
    
    

    const combinedRecipes = [...simplifiedApiRecipes, ...simplifiedDbRecipes];

    if (combinedRecipes.length > 0) {
      return res.status(200).json(combinedRecipes);
    } else {
      return res.status(404).json({ message: "No se encontraron recetas con ese nombre" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Error al buscar todas las recetas en home" });
  }
});

//

router.get("/recipe/:idRecipe", async (req, res) => {
  try {
    const { idRecipe } = req.params;

    if (!isNaN(idRecipe)) {
      // Si idRecipe es un número válido, obtén la receta de la API
      const recipe = await getRecipeByid(idRecipe);

      // Filtrar la información que quieres mostrar
      const { id, title, healthScore, image, instructions, summary, diets } = recipe;

      // Construir un nuevo objeto solo con los campos seleccionados
      const simplifiedRecipe = {
        id,
        title,
        image,
        summary,
        healthScore,
        instructions,
        diets,
      };

      return res.status(200).json(simplifiedRecipe);
    } else {
      // Si idRecipe no es un número válido, obtén la receta de la base de datos
      const dbRecipe = await Recipe.findOne({
        where: { ID: idRecipe },
        include: [
          {
            model: Diets,
            attributes: ['Nombre'], // Incluir solo el nombre de las dietas
            through: {
              attributes: [] // No incluir atributos de la tabla intermedia
            }
          }
        ],
      });

      if (dbRecipe) {
        // Construir un objeto con los detalles de la receta de la base de datos
        const simplifiedDbRecipe = {
            id: dbRecipe.ID,
          title: dbRecipe.Nombre,
          image: dbRecipe.Imagen,
          summary: dbRecipe.ResumenDelPlato,
          healthScore: dbRecipe.NivelDeComidaSaludable,
          instructions: dbRecipe.PasoAPaso,
          diets: dbRecipe.diets.map(diet => diet.Nombre), // Obtener solo los nombres de las dietas
        };

        return res.status(200).json(simplifiedDbRecipe);
      } else {
        return res.status(404).json({ message: "Receta no encontrada" });
      }
    }
  } catch (e) {
    return res.status(500).json({ message: "Error al obtener la receta", error: e.message });
  }
});





router.get('/recipes/name', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "El parámetro 'name' es requerido" });
    }

    const apiRecipes = await getRecipesByName(name); // Obtener recetas de la API
    const dbRecipes = await Recipe.findAll({
      where: {
        Nombre: {
          [Op.iLike]: `%${name}%`,
        },
      },
      include: [
        {
          model: Diets,
          attributes: ['Nombre'], // Incluir solo el nombre de las dietas
          through: {
            attributes: [] // No incluir atributos de la tabla intermedia
          }
        }
      ],
    });

    const simplifiedApiRecipes = apiRecipes.map((recipe) => {
      const {
        id,
        title,
        image,
        diets,
        healthScore,
      } = recipe;

      return {
        id,
        title,
        image,
        diets,
        healthScore
      };
    });

    const simplifiedDbRecipes = dbRecipes.map((recipe) => {
      const {
        ID: id,
        Nombre: title,
        Imagen: image,
        ResumenDelPlato: summary,
        NivelDeComidaSaludable: healthScore,
        PasoAPaso: instructions,
        diets,
      } = recipe;
    
      const simplifiedDiets = diets.map(diet => diet.Nombre);
    
      return {
        id, // Usamos el ID real de la receta en la base de datos
        title,
        image,
        summary,
        healthScore,
        instructions,
        diets: simplifiedDiets,
      };
    });
    
    
    

    const combinedRecipes = [...simplifiedApiRecipes, ...simplifiedDbRecipes];

    if (combinedRecipes.length > 0) {
      return res.status(200).json(combinedRecipes);
    } else {
      return res.status(404).json({ message: "No se encontraron recetas con ese nombre" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Error al buscar recetas por nombre" });
  }
});







  // Función para crear una nueva receta en la base de datos
  // POST | /recipes
router.post('/createRecipe', async (req, res) => {
    try {
      const {
        Nombre,
        Imagen,
        ResumenDelPlato,
        NivelDeComidaSaludable,
        PasoAPaso,
        dietIds // Una lista de IDs de los tipos de dieta asociados a la receta
      } = req.body;
  
      // Primero creamos la nueva receta en la base de datos
      const newRecipe = await Recipe.create({
        Nombre,
        Imagen,
        ResumenDelPlato,
        NivelDeComidaSaludable,
        PasoAPaso,
      });
  
      // Si se proporcionaron dietIds, buscamos los tipos de dieta correspondientes
      // y los asociamos con la receta creada
      if (dietIds && dietIds.length > 0) {
        const diets = await Diets.findAll({
          where: { ID: dietIds } // Buscamos los tipos de dieta por sus IDs
        });
  
        // Si encontramos los tipos de dieta, los asociamos con la receta creada
        if (diets && diets.length > 0) {
          await newRecipe.setDiets(diets);
        }
      }
  
      return res.status(201).json(newRecipe);
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear la receta', error: error.message });
    }
  });
  
  // GET | /diets
  router.get('/diets', async (req, res) => {
    try {
      // Definimos las dietas que deseamos obtener de la API
      const dietNamesFromAPI = [
        'Gluten Free',
        'Ketogenic',
        'Vegetarian',
        'Lacto-Vegetarian',
        'Ovo-Vegetarian',
        'Vegan',
        'Pescetarian',
        'Paleo',
        'Primal',
        'Low FODMAP',
        'Whole30',
      ];
  
      // Creamos un arreglo para almacenar las instancias de las dietas encontradas o creadas
      const dietsFoundOrCreated = [];
  
      // Recorremos el arreglo de nombres de dietas
      for (const dietName of dietNamesFromAPI) {
        // Buscamos la dieta en la base de datos por nombre
        const diet = await Diets.findOne({
          where: { Nombre: dietName }, // Condición de búsqueda por nombre
        });
  
        // Si la dieta no se encuentra en la base de datos, la obtenemos de la API y la guardamos en la base de datos
        if (!diet) {
          const dietFromAPI = await getDietFromAPI(dietName); // Función para obtener la dieta de la API
          const createdDiet = await Diets.create({ Nombre: dietName }); // Creamos la dieta en la base de datos
          dietsFoundOrCreated.push(createdDiet);
        } else {
          dietsFoundOrCreated.push(diet);
        }
      }
  
      return res.status(200).json(dietsFoundOrCreated); // Devolvemos el arreglo de resultados
    } catch (error) {
      console.error('Error al obtener las dietas:', error);
      return res.status(500).json({ message: 'Error al obtener las dietas' });
    }
  });
  
  // Función para obtener la dieta de la API
  async function getDietFromAPI(dietName) {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=300&addRecipeInformation=true&diet=${dietName}`
      );
  
      // Retorna la dieta desde la API o un objeto vacío si no se encontró
      return response.data.results[0]?.diets || [];
    } catch (error) {
      console.error('Error al obtener la dieta de la API:', error);
      throw new Error('Error al obtener la dieta de la API');
    }
  }

module.exports = router;
