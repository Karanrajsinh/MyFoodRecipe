import '../index.css'
import SearchBar from "../app_components/SearchBar";
import { useRecipes } from "@/context/Recipes";
import { ImSpinner8 } from "react-icons/im";
import img from "../../public/recipe-book.png"
import RecipesList from "@/app_components/RecipesList";

function MainPage() {

    const { fetchedRecipes, searchResults, noRecipeFound, fetchingRecipes } = useRecipes();

    return (
        <>
            <div className="flex flex-col md:w-[90%] h-[80vh] gap-12 mx-auto ">
                <SearchBar />
                <div className="flex flex-col min-h-[600px] w-[90%] mx-auto overflow-x-hidden overflow-y-scroll custom-scrollbar">
                    {(fetchingRecipes === false && fetchedRecipes.length > 0) && <p className='mb-4 text-sm text-center md:text-lg text-slate-500'>Recipe Found : {fetchedRecipes.length} , For  {searchResults.filter} :  {`"${searchResults.query}"`}</p>}
                    {fetchedRecipes.length > 0 && (
                        <RecipesList recipes={fetchedRecipes} />
                    )}
                    {(!fetchingRecipes && fetchedRecipes.length < 1 && (!noRecipeFound || searchResults.query == '')) && <p className="flex items-center justify-center gap-2 my-auto text-sm text-center md:text-lg text-slate-500"> <img className="w-8" src={img} />Search  Recipe</p>}
                    {fetchingRecipes && <p className="flex items-center justify-center gap-2 my-auto text-sm text-center md:text-lg text-slate-500">Searching Recipes...<ImSpinner8 className="text-red-400 spinner-rotate" /></p>}
                    {(!fetchingRecipes && noRecipeFound && fetchedRecipes.length < 1 && searchResults.query !== '') && <p className="flex items-center justify-center gap-2 my-auto text-sm text-center md:text-lg text-slate-500"><img className="w-8" src={img} />No Recipe Found , For {searchResults.filter}: {`"${searchResults.query}"`}</p>}
                </div>
            </div>
        </>
    )
}

export default MainPage
