import React from 'react';
import { SectionWrapper } from '../hoc';

const RecipeImage = ({ imageUrl, label }) => {
  return (
    <div>
      <strong className="text-red-500">
      <h3>Recipe Image:</h3>
      </strong>{" "}
      <strong><h3>{label}</h3></strong>
      
      <img src={imageUrl} alt={label} style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
    
  );
};
// export default SectionWrapper(RecipeImage, "recipeImage");
export default RecipeImage;