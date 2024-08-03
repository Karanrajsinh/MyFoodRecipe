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
        <div className="flex flex-col items-center w-full h-[80vh] p-4 mt-20">
            <Tabs onValueChange={(value) => setTab(value)} defaultValue="recipes" className="w-full max-w-4xl rounded-lg">
                <TabsList className="flex p-2 rounded-t-lg justify-evenly">
                    <TabsTrigger className="px-4 py-2 text-xl font-semibold" value="recipes">Recipes</TabsTrigger>
                    <TabsTrigger className="px-4 py-2 text-xl font-semibold" value="bookmarked">Bookmarked Recipes</TabsTrigger>
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
                        <p className="flex items-center justify-center gap-3"><ImSpinner8 className="text-red-400 spinner-rotate" /><span className="text-slate-600">Loading recipes...</span></p>
                    )}
                    {(!isLoading && data.length < 1) && <p>No Recipe In Your List, Add One </p>}
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
                        <p className="flex items-center justify-center gap-3"><ImSpinner8 className="text-red-400 spinner-rotate" /><span className="text-slate-600">Loading recipes...</span></p>
                    )}
                    {(!isLoading && data.length < 1) && <p>No Recipe In Your List, Add One </p>}
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default RecipePage
