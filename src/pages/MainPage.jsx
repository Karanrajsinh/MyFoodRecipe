import Recipe from "../app_components/Recipe";
import '../index.css'
import SearchBar from "../app_components/SearchBar";
import { useRecipes } from "@/context/Recipes";
import { ImSpinner8 } from "react-icons/im";
import img from "../../public/cook-book.png"

function MainPage() {

    const { fetchedRecipes, noRecipeFound, fetchingRecipes } = useRecipes();

    return (
        <>
            <div className="flex flex-col md:w-[90%] h-[80vh] gap-12 mx-auto ">
                <SearchBar />
                <div className="flex flex-col min-h-[600px] w-[90%] mx-auto overflow-x-hidden overflow-y-scroll custom-scrollbar">
                    {fetchedRecipes.length > 0 && (
                        fetchedRecipes.map((recipe) => (
                            <Recipe
                                key={recipe.id}
                                recipe={recipe}
                            />
                        ))
                    )}
                    {(!fetchingRecipes && fetchedRecipes.length < 1 && !noRecipeFound) && <p className="flex items-center justify-center gap-2 my-auto text-center">Search Your Recipe <img className="w-8" src={img} /></p>}
                    {fetchingRecipes && <p className="flex items-center justify-center gap-2 my-auto text-center">Searching Recipes <ImSpinner8 className="text-red-400 spinner-rotate" /></p>}
                    {(!fetchingRecipes && noRecipeFound && fetchedRecipes.length < 1) && <p className="flex items-center justify-center gap-2 my-auto text-center">No Recipe Found<img className="w-8" src={img} /></p>}
                </div>
            </div>
        </>
    )
}

export default MainPage
