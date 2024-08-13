import '../index.css'
import SearchBar from "../app_components/SearchBar";
import { useRecipes } from "@/context/Recipes";
import { ImSpinner8 } from "react-icons/im";
import img from "../../public/recipe-book.png"
import RecipesList from "@/app_components/RecipesList";


function MainPage() {

    const { fetchedRecipes, setTrendingQuery, setSearchQuery, setFilter, searchResults, noRecipeFound, fetchingRecipes } = useRecipes();

    function scrollHorizontally(offset) {
        const scrollableDiv = document.getElementById('scrollableDiv');
        scrollableDiv.scrollBy({ left: offset, behavior: 'smooth' });
    }
    const buttonContent = [
        { filter: 'category', query: 'Quick Meal', value: 'category' },
        { filter: 'recipe', query: 'Margarita Pizza', value: 'title' },
        { filter: 'category', query: 'Fast Food', value: 'category' },
        { filter: 'recipe', query: 'Lachha Paratha', value: 'title' },
        { filter: 'ingredients', query: 'Lettuce', value: 'ingredients' },
    ];
    return (
        <>
            <div className="flex flex-col md:w-[100%] h-[50vh] justify-evenly   mx-auto">
                <div className="flex flex-col items-center py-12 text-center md:pt-24">
                    <h1 className="mb-4 text-xl font-bold text-red-400 md:text-3xl">Find Your Next Favorite Recipe</h1>
                    <p className="text-sm md:text-lg text-slate-500">Search by name, ingredient, or type.</p>

                    <SearchBar />
                    <div className="relative flex justify-between items-center mt-6 w-[90%] md:w-[40%] mx-auto">
                        <button
                            onClick={() => scrollHorizontally(-200)}
                            className="hidden px-4 py-2 mr-2 text-white bg-red-400 rounded-full shadow-md md:block hover:bg-opacity-80"
                        >
                            &lt;
                        </button>

                        <div id="scrollableDiv" className="flex w-full gap-4 overflow-x-scroll text-nowrap no-scrollbar">
                            {buttonContent.map((btn, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setFilter(btn.value);
                                        setSearchQuery(btn.query);
                                        setTrendingQuery(btn.query);
                                    }}
                                    className="px-4 py-2 text-xs text-white bg-red-400 rounded-lg md:text-sm hover:bg-opacity-90"
                                >
                                    {`${btn.filter.charAt(0).toUpperCase() + btn.filter.slice(1)}: ${btn.query}`}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => scrollHorizontally(200)}
                            className="hidden px-4 py-2 ml-2 text-white bg-red-400 rounded-full shadow-md md:block hover:bg-opacity-80"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
                <div className=" flex flex-col min-h-[400px]  w-[90%] mx-auto overflow-x-hidden overflow-y-scroll custom-scrollbar">
                    {(fetchingRecipes === false && fetchedRecipes.length > 0) && (
                        <p className="mb-4 text-sm text-center md:text-lg text-slate-500">
                            <span className="text-red-400">&quot;{fetchedRecipes.length}&quot;</span> Results for {searchResults.filter !== 'All' && searchResults.filter} : {`"${searchResults.query}"`}
                        </p>
                    )}
                    {fetchedRecipes.length > 0 && <RecipesList recipes={fetchedRecipes} />}
                    {(!fetchingRecipes && fetchedRecipes.length < 1 && (!noRecipeFound || searchResults.query === '')) && (
                        <p className="flex items-center justify-center gap-2 my-auto text-sm text-center md:text-lg text-slate-500">
                            <img className="w-8" src={img} alt="Search" />Search Recipe
                        </p>
                    )}
                    {fetchingRecipes && (
                        <p className="flex items-center justify-center gap-2 my-auto text-sm text-center md:text-lg text-slate-500">
                            Searching Recipes...<ImSpinner8 className="text-red-400 spinner-rotate" />
                        </p>
                    )}
                    {(!fetchingRecipes && noRecipeFound && fetchedRecipes.length < 1 && searchResults.query !== '') && (
                        <p className="flex items-center justify-center gap-2 my-auto text-sm text-center md:text-lg text-slate-500">
                            <img className="w-8" src={img} alt="No Recipe Found" />No Recipe Found , For {searchResults.filter}: {`"${searchResults.query}"`}
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}

export default MainPage
