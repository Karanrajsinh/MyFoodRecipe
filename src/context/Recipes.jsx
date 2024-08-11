import { createContext, useContext, useState } from "react";


const RecipeContext = createContext();

function RecipesProvider({ children }) {

  const [fetchedRecipes, setFetchedRecipes] = useState([]);
  const [fetchingRecipes, setFetchingRecipes] = useState();
  const [noRecipeFound, setNoRecipeFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Recipe');
  const [searchResults, setSearchResults] = useState(
    {
      filter: '',
      query: ''
    }
  )

  return (
    <RecipeContext.Provider value={
      {
        searchResults, setSearchResults, filterType, setFilterType, searchQuery, setSearchQuery, fetchedRecipes, setFetchedRecipes, fetchingRecipes, setFetchingRecipes, noRecipeFound, setNoRecipeFound
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