import { db } from "../../firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";


const RecipeContext = createContext();

function RecipesProvider({ children }) {

  const [fetchedRecipes, setFetchedRecipes] = useState([]);
  const [fetchingRecipes, setFetchingRecipes] = useState();
  const [noRecipeFound, setNoRecipeFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchResults, setSearchResults] = useState(
    {
      filter: '',
      query: ''
    }
  )
  const [trendingQuery, setTrendingQuery] = useState('');
  const [filter, setFilter] = useState('all');


  useEffect(() => {
    if (trendingQuery) {
      handleSearch();
    }
    /*eslint-disable */
  }, [trendingQuery])
  /*eslint-enable */


  const parameter = () => {
    const query = searchQuery.toLowerCase().trimEnd();

    const queries = {
      title: [
        where('title', '>=', query),
        where('title', '<=', query + "\uf8ff")
      ],
      ingredients: where('ingredientsNameList', 'array-contains', query),
      category: where('categories', 'array-contains', query)
    };

    return queries;
  };

  const recipesRef = collection(db, 'recipes')



  async function handleSearch() {
    setFetchedRecipes('');
    const queries = parameter();
    let firestoreQuery = query(recipesRef); // Initialize the base query
    let allResults = [];
    let allQueries = [];
    // Apply title queries
    if (filter === 'all') {
      // Apply all filters if 'all' is selected

      if (queries.title) {
        allQueries = [...allQueries, ...queries.title];
      }
      if (queries.ingredients) {
        allQueries.push(queries.ingredients);
      }
      if (queries.category) {
        allQueries.push(queries.category);
      }

      if (allQueries.length > 0) {
        firestoreQuery = query(firestoreQuery, ...allQueries);
      } else {
        console.log('No queries found for "all" filter.');
        return null;
      }

    } else if (filter === 'title' && queries.title) {
      firestoreQuery = query(firestoreQuery, ...queries.title);
    } else if (filter === 'ingredients' && queries.ingredients) {
      firestoreQuery = query(firestoreQuery, queries.ingredients);
    } else if (filter === 'category' && queries.category) {
      firestoreQuery = query(firestoreQuery, queries.category);
    } else {
      return null;
    }

    setFetchingRecipes(true);

    if (filter === 'all') {
      // Run queries for each filter type and combine results
      const queryPromises = [];

      if (queries.title) {
        const titleQuery = query(recipesRef, ...queries.title);
        queryPromises.push(getDocs(titleQuery).then(queryResults => {
          queryResults.forEach(doc => allResults.push(doc.data()));
        }));
      }
      if (queries.ingredients) {
        const ingredientsQuery = query(recipesRef, queries.ingredients);
        queryPromises.push(getDocs(ingredientsQuery).then(queryResults => {
          queryResults.forEach(doc => allResults.push(doc.data()));
        }));
      }
      if (queries.category) {
        const categoryQuery = query(recipesRef, queries.category);
        queryPromises.push(getDocs(categoryQuery).then(queryResults => {
          queryResults.forEach(doc => allResults.push(doc.data()));
        }));
      }

      // Wait for all queries to complete
      await Promise.all(queryPromises);

      // Remove duplicates if necessary
      allResults = Array.from(new Set(allResults.map(item => JSON.stringify(item))))
        .map(item => JSON.parse(item));

      if (allResults.length === 0) {
        setNoRecipeFound(true);
        setFetchingRecipes(false);
        setSearchResults(
          {
            filter: filterType,
            query: searchQuery
          }
        )
      } else {
        setFetchedRecipes(allResults);
        setFetchingRecipes(false);
        setSearchResults(
          {
            filter: filterType,
            query: searchQuery
          }
        )
      }
    }
    else if (filter !== 'all') {
      getDocs(firestoreQuery).then((response) => {
        if (response.empty) {
          setNoRecipeFound(true);
          setFetchedRecipes(false);
        }
        let data = [];
        response.forEach((doc) => {
          data.push(doc.data())
        });
        setFetchedRecipes(data);
        setFetchingRecipes(false);
        setSearchResults(
          {
            filter: filterType,
            query: searchQuery
          }
        )
      }).catch((error) => {
        console.error("Error getting documents: ", error);
      });
    }
  }


  return (
    <RecipeContext.Provider value={
      {
        trendingQuery, setTrendingQuery, handleSearch, filter, setFilter, searchResults, setSearchResults, filterType, setFilterType, searchQuery, setSearchQuery, fetchedRecipes, setFetchedRecipes, fetchingRecipes, setFetchingRecipes, noRecipeFound, setNoRecipeFound
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