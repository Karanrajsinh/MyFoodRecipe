import { Button } from "@/components/ui/button";
import { db } from "../../firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { useRecipes } from "@/context/Recipes";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from '@/components/ui/select'


function SearchBar() {

    const [filter, setFilter] = useState('title');

    const [searchQuery, setSearchQuery] = useState('');
    const { setFetchedRecipes, setNoRecipeFound, setFetchingRecipes } = useRecipes();

    const parameter = () => {
        if (filter === 'title') {
            return [
                where('title', '>=', searchQuery.toLowerCase()),
                where('title', '<=', searchQuery.toLowerCase() + "\uf8ff")
            ];
        }
        if (filter === 'ingredients') {
            return where('ingredientsNameList', 'array-contains', searchQuery.toLowerCase());
        }
        if (filter === 'category') {
            return where('category', '==', searchQuery.toLowerCase());
        }
        return null; // Default return if no match
    };

    const recipesRef = collection(db, 'recipes')

    const handleSearch = () => {
        const filters = parameter();
        setFetchedRecipes([]);
        if (searchQuery === '') return console.log('query cannot be empty');



        let firestoreQuery = query(recipesRef); // Initialize the base query

        if (Array.isArray(filters)) {
            // If filters are an array (for title search), apply both conditions
            filters.forEach((filter) => {
                firestoreQuery = query(firestoreQuery, filter);
            });
        } else if (filters) {
            // If there's a single filter (ingredients or category), apply it
            firestoreQuery = query(firestoreQuery, filters);
        }
        setFetchingRecipes(true);

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
        }).catch((error) => {
            console.error("Error getting documents: ", error);
        });
    };

    return (
        <div className="flex flex-wrap items-center w-full gap-4 mx-1 mt-20 md:justify-center">
            <div className="flex flex-row md:min-w-[20%] max-w-[270px] p-2 bg-white border border-gray-300 rounded-full">
                <input
                    type="text"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes..."
                    className="flex-grow w-1/2 p-2 ml-2 text-gray-400 border-none md:w-full md:flex-grow bg-inherit placeholder-color focus:outline-none focus:ring-0"
                />
                <Button onClick={handleSearch} className="px-2 ml-2 text-xs text-white bg-red-400 rounded-full md:text-sm hover:opacity-90 hover:bg-red-500">
                    Search
                </Button>
            </div>
            <div className="flex items-center justify-center gap-4">
                <Select defaultValue="title" onValueChange={(value) => setFilter(value)}>
                    <SelectTrigger className=" text-xs md:text-sm w-[80px] md:min-w-[150px] rounded-3xl">
                        <SelectValue placeholder="title" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectGroup>
                            <SelectItem className="text-xs md:text-sm rounded-xl" value="title">Recipe Name</SelectItem>
                            <SelectItem className="text-xs md:text-sm rounded-xl" value="ingredients">Ingredients</SelectItem>
                            <SelectItem className="text-xs md:text-sm rounded-xl" value="category">Category</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <p className="hidden font-semibold text-center text-red-400 md:block">Search Filter</p>
            </div>
        </div>
    )
}

export default SearchBar