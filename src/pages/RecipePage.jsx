import Recipe from "@/app_components/Recipe";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app_components/ModifiedTab";
import { useUserAuth } from "@/context/UserAuth";
import { useState } from "react";
import { getUserRecipes, getUserSavedRecipes } from '../utils/firebase'
import { ImSpinner8 } from "react-icons/im";
import { useQuery } from "@tanstack/react-query";

function RecipePage() {
    // const [recipesData, setRecipesData] = useState([]);
    // const [savedRecipesData, setSavedRecipesData] = useState([]);
    const { uid } = useUserAuth();
    const [tab, setTab] = useState('recipes');

    const { data, isLoading } = useQuery({
        queryKey: ['recipes', tab],
        queryFn: () => {
            if (tab === 'recipes') {
                return getUserRecipes(uid);
            } else if (tab === 'bookmarked') {
                return getUserSavedRecipes(uid);
            }
        },
    })
    // useEffect(() => {

    //     if (tab === 'recipes') getUserRecipes(uid).then((data) => {
    //         setRecipesData(data);
    //     })
    //     if (tab === 'bookmarked') getUserSavedRecipes(uid).then((data) => {
    //         setSavedRecipesData(data)
    //     }) /* eslint-disable */
    // }, [tab]);
    // /* eslint-ensable */

    return (
        <div className="flex flex-col items-center w-full h-[80vh] mt-14  md:mt-20">
            <Tabs onValueChange={(value) => setTab(value)} defaultValue="recipes" className="w-full max-w-4xl">
                <TabsList className="flex p-3 justify-evenly">
                    <TabsTrigger className="px-3 py-1 font-semibold rounded-full md:text-xl" value="recipes">Recipes</TabsTrigger>
                    <TabsTrigger className="px-3 py-1 font-semibold rounded-full md:text-xl" value="bookmarked">Bookmarked Recipes</TabsTrigger>
                </TabsList>

                <TabsContent value="recipes" className="p-4">
                    {!isLoading ? (
                        data.map((recipe) => (
                            <Recipe
                                key={recipe.id}
                                recipe={recipe}
                            />
                        ))
                    ) : (
                        <p className="flex text-sm md:text-lg items-center justify-center my-[60%] md:my-[40%] gap-3"><ImSpinner8 className="text-red-400 spinner-rotate" /><span className="text-slate-600">Loading recipes...</span></p>
                    )}
                    {(!isLoading && data.length < 1) && <p className="my-[50%] md:my-[30%] text-slate-500 text-center">No Recipe In Your List, Add One </p>}
                </TabsContent>

                <TabsContent value="bookmarked" className="p-4">
                    {!isLoading ? (
                        data.map((recipe) => (
                            <Recipe
                                key={recipe.id}
                                recipe={recipe}
                            />
                        ))
                    ) : (
                        <p className="flex text-sm md:text-lg items-center justify-center my-[60%] md:my-[40%] gap-3"><ImSpinner8 className="text-red-400 spinner-rotate" /><span className="text-slate-600">Loading recipes...</span></p>
                    )}
                    {(!isLoading && data.length < 1) && <p className="my-[50%] md:my-[30%] text-slate-500 text-center">No  Recipe In Your List, Add One </p>}
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default RecipePage
