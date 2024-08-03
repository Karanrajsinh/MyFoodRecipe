import { createContext, useContext, useState } from "react";


const RecipeContext = createContext();

function RecipesProvider({ children }) {

  const [fetchedRecipes, setFetchedRecipes] = useState([]);
  const [fetchingRecipes, setFetchingRecipes] = useState(false);
  const [noRecipeFound, setNoRecipeFound] = useState(false);
  return (
    <RecipeContext.Provider value={
      {
        fetchedRecipes, setFetchedRecipes, fetchingRecipes, setFetchingRecipes, noRecipeFound, setNoRecipeFound
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