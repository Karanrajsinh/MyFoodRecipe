import { createContext, useContext, useState } from "react";


const RecipeContext = createContext();

function RecipesProvider({ children }) {

  const [fetchedRecipes, setFetchedRecipes] = useState([]);

  return (
    <RecipeContext.Provider value={
      {
        fetchedRecipes, setFetchedRecipes
      }}>
      {children}
    </RecipeContext.Provider>
  )
}

function useRecipes() {
  const context = useContext(RecipeContext

  );
  return context;
}

/*eslint-disable */
export { RecipesProvider, useRecipes };