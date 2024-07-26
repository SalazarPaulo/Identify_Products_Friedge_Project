import React from 'react';

const RecipeDetails = ({ recipe }) => {
  if (!recipe) {
    return <div>No recipe has been selected.</div>;
  }

  const { label, source, ingredients, url } = recipe;

  return (
    <div>
      <strong className="text-red-500"><h3>{label}</h3></strong>
      <p>
        <strong>Origin:</strong> {source}
      </p>
      <p>
        <strong>Ingredients:</strong>{' '}
        {ingredients.map((ingredient, index) => (
          <span key={index}>{ingredient.text}</span>
        ))}
      </p>
      <p>
        <strong>Recipe URL:</strong>{' '}
        <a href={url} className="break-all hover:underline text-blue-500" target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </p>
    </div>
  );
};

export default RecipeDetails;
