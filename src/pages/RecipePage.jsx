import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app_components/ModifiedTab";
import { useUserAuth } from "@/context/UserAuth";
import { useState } from "react";
import { getUserRecipes, getUserSavedRecipes } from '../utils/firebase'
import { ImSpinner8 } from "react-icons/im";
import { useQuery } from "@tanstack/react-query";
import img from '../../public/recipe-book.png'
import RecipesList from "@/app_components/RecipesList";

function RecipePage() {
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


    return (
        <div className="flex flex-col items-center w-full h-[80vh] mt-14  md:mt-20">
            <Tabs onValueChange={(value) => setTab(value)} defaultValue="recipes" className="w-full max-w-4xl">
                <TabsList className="flex p-3 justify-evenly">
                    <TabsTrigger className="px-6 py-1 text-base rounded-lg font-ligth md:text-xl" value="recipes">Recipes</TabsTrigger>
                    <TabsTrigger className="px-6 py-1 text-base rounded-lg font-ligth md:text-xl" value="bookmarked">Saved Recipes</TabsTrigger>
                </TabsList>

                <TabsContent value="recipes" className="h-10 p-4">
                    {!isLoading ? (
                        <RecipesList recipes={data} />
                    ) : (
                        <p className="flex text-sm md:text-lg items-center justify-center my-[60%] md:my-[35%] gap-3"><ImSpinner8 className="text-red-400 spinner-rotate" /><span className="text-slate-600">Loading recipes...</span></p>
                    )}
                    {(!isLoading && data.length < 1) && <p className="my-[70%] text-sm md:text-lg flex justify-center items-center gap-2 md:my-[30%] text-slate-500 text-center"><img className="w-6" src={img} />No  Recipe In Your List, Add One </p>}
                </TabsContent>

                <TabsContent value="bookmarked" className="h-10 p-4">
                    {!isLoading ? (
                        <RecipesList recipes={data} />
                    ) : (
                        <p className="flex text-sm md:text-lg items-center justify-center my-[60%] md:my-[35%] gap-3"><ImSpinner8 className="text-red-400 spinner-rotate" /><span className="text-slate-600">Loading recipes...</span></p>
                    )}
                    {(!isLoading && data.length < 1) && <p className="my-[70%] flex justify-center text-sm md:text-lg items-center gap-2 md:my-[30%] text-slate-500 text-center"><img className="w-6" src={img} />No  Recipe In Your List, Add One </p>}
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default RecipePage
