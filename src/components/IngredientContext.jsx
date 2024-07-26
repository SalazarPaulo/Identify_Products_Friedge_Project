import React, { createContext, useState } from 'react';

export const IngredientContext = createContext();

export const IngredientProvider = ({ children }) => {
  const [selectedIngredient, setSelectedIngredient] = useState('');

  return (
    <IngredientContext.Provider value={{ selectedIngredient, setSelectedIngredient }}>
      {children}
    </IngredientContext.Provider>
  );
};
