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
        <div className="flex flex-col items-center w-full h-[80vh] mt-14 md:mt-16">
            <Tabs onValueChange={(value) => setTab(value)} defaultValue="recipes" className="w-full max-w-4xl">
                <TabsList className="flex p-3 justify-evenly">
                    <TabsTrigger className="px-6 py-1 text-base font-normal rounded-lg md:text-xl" value="recipes">Recipes</TabsTrigger>
                    <TabsTrigger className="px-6 py-1 text-base font-normal rounded-lg md:text-xl" value="bookmarked">Saved Recipes</TabsTrigger>
                </TabsList>

                <TabsContent value="recipes" className="relative h-full p-4">
                    {!isLoading ? (
                        <RecipesList recipes={data} />
                    ) : (
                        <p className="absolute inset-0 flex items-center justify-center gap-3 text-sm md:text-lg">
                            <ImSpinner8 className="text-red-400 spinner-rotate" />
                            <span className="text-slate-600">Loading Recipes...</span>
                        </p>
                    )}
                    {(!isLoading && data.length < 1) && (
                        <p className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-center md:text-lg text-slate-500">
                            <img className="w-6" src={img} alt="No recipe" />
                            No Recipe In Your List, Add One
                        </p>
                    )}
                </TabsContent>

                <TabsContent value="bookmarked" className="relative h-full p-4">
                    {!isLoading ? (
                        <RecipesList recipes={data} />
                    ) : (
                        <p className="absolute inset-0 flex items-center justify-center gap-3 text-sm md:text-lg">
                            <ImSpinner8 className="text-red-400 spinner-rotate" />
                            <span className="text-slate-600">Loading Recipes...</span>
                        </p>
                    )}
                    {(!isLoading && data.length < 1) && (
                        <p className="absolute inset-0 flex items-center justify-center w-full gap-2 text-sm text-center md:text-lg text-slate-500">
                            <img className="w-6" src={img} alt="No recipe" />
                            No Recipe In Your List, Add One
                        </p>
                    )}
                </TabsContent>
            </Tabs>
        </div>

    );
}

export default RecipePage
