import React, { useState, useEffect, useContext } from 'react';
import { SectionWrapper } from '../hoc';
import { RecipeImage, RecipeDetails } from "../components";
import { IngredientContext } from './IngredientContext';

const RecipeComponent = () => {
  const { selectedIngredient } = useContext(IngredientContext);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchRecipes = async () => {
    if (!selectedIngredient || selectedIngredient.trim() === '') return;

    try {
      const response = await fetch(
        `https://api.edamam.com/search?q=${encodeURIComponent(selectedIngredient)}&app_id=6cd570ea&app_key=3d332abbbaa3353aa618c5a4f1e6f7ec`
      );
      const data = await response.json();
      setRecipes(data.hits);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [selectedIngredient]);

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Primera sección: Buscar Recetas por Ingrediente */}
        <div className="lg:col-span-1">
          <h2 className="font-bold">
            Recipes to:
            <span className="text-red-500"> {selectedIngredient}</span>
          </h2>
          <ul>
            {recipes.map((recipe, index) => (
              <li
                key={index}
                onClick={() => handleRecipeSelect(recipe.recipe)}
                className="cursor-pointer hover:text-blue-500 hover:underline"
              >
                <strong className="hover:text-blue-500 cursor-pointer">
                  {recipe.recipe.label}
                </strong>{" "}
                - {recipe.recipe.source}
              </li>
            ))}
          </ul>
        </div>

        {/* Segunda sección: RecipeDetails */}
        <div>
          {selectedRecipe && (
            <div className="overflow-hidden text-ellipsis whitespace-pre-wrap">
              <RecipeDetails recipe={selectedRecipe} />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="text-red-500 hover:text-blue-500 cursor-pointer"
              >
                Back to list
              </button>
            </div>
          )}
        </div>

        {/* Tercera sección: RecipeImage */}
        <div className="lg:col-span-1">
          {selectedRecipe && (
            <RecipeImage imageUrl={selectedRecipe.image} label={selectedRecipe.label} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(RecipeComponent, 'Recipe List');
