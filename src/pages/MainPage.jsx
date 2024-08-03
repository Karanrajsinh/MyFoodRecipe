import Recipe from "../app_components/Recipe";
import '../index.css'
import SearchBar from "../app_components/SearchBar";
import { useRecipes } from "@/context/Recipes";

function MainPage() {

    const { fetchedRecipes } = useRecipes();

    return (
        <>
            <div className="flex flex-col w-full h-[90.35vh] gap-12 mx-auto ">
                <SearchBar />
                <div className="flex flex-col min-h-[600px] w-1/2 mx-auto overflow-x-hidden overflow-y-scroll custom-scrollbar">
                    {fetchedRecipes.length < 1 ? (
                        <p className="my-auto text-center">Search Your Recipe</p>
                    ) : (
                        fetchedRecipes.map((recipe) => (
                            <Recipe
                                key={recipe.id}
                                recipe={recipe}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

export default MainPage
