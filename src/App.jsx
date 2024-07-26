import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  Navbar,
  ListIngredients,
  RecipeComponent,
  FooterWeb,
} from './components';
import { IngredientContext } from './components/IngredientContext';

const App = () => {
  const [selectedIngredient, setSelectedIngredient] = useState('');

  return (
    <IngredientContext.Provider value={{ selectedIngredient, setSelectedIngredient }}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">
            <div className="grid grid-cols-1 gap-4">
              {/* ListIngredients Component */}
              <div className="py-2">
                <ListIngredients />
              </div>

              {/* RecipeComponent Component */}
              <div className="col-span-1 py-2">
                <RecipeComponent />
              </div>
            </div>
          </main>

          {/* Footer */}
          <FooterWeb />
        </div>
      </BrowserRouter>
    </IngredientContext.Provider>
  );
};

export default App;
