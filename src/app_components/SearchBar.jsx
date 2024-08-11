import { Button } from "@/components/ui/button";
import { db } from "../../firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRef, useState } from "react";
import { useRecipes } from "@/context/Recipes";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from '@/components/ui/select'


function SearchBar() {

    const { searchQuery, setSearchQuery, filterType, setFilterType, setSearchResults } = useRecipes();
    const [filter, setFilter] = useState('title');
    const options = [
        { value: 'title', option: 'Recipe' },
        { value: 'ingredients', option: 'Ingredients' },
        { value: 'category', option: 'Category' },
    ];
    const inputRef = useRef(null);
    const handleValueChange = (value) => {
        // Find the label based on the selected value
        setFilter(value);
        const selectedOption = options.find(opt => opt.value === value);
        setFilterType(selectedOption ? selectedOption.option : ''); // Fallback to empty string if value not found
    };
    const { setFetchedRecipes, setNoRecipeFound, setFetchingRecipes } = useRecipes();
    const parameter = () => {

        const query = searchQuery.toLowerCase().trimEnd();

        if (filter === 'title') {
            return [
                where('title', '>=', query),
                where('title', '<=', query + "\uf8ff")
            ];
        }
        if (filter === 'ingredients') {
            return where('ingredientsNameList', 'array-contains', query);
        }
        if (filter === 'category') {
            return where('categories', 'array-contains', query);
        }
        return null; // Default return if no match
    };

    const recipesRef = collection(db, 'recipes')

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && searchQuery !== '') {
            handleSearch();
            inputRef.current.blur();
        }
    }

    const handleSearch = () => {

        const filters = parameter();
        setFetchedRecipes([]);
        if (searchQuery === '') return
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
            setSearchResults(
                {
                    filter: filterType,
                    query: searchQuery
                }
            )
        }).catch((error) => {
            console.error("Error getting documents: ", error);
        });
    };

    return (
        <div className="flex flex-wrap items-center justify-center w-[95%] gap-4 mx-auto mt-20">
            <div className="flex flex-row p-2 bg-white border border-gray-300 rounded-full md:min-w-[40%]">
                <div className="gap-4">
                    <Select defaultValue="title" onValueChange={handleValueChange}>
                        <SelectTrigger className="text-xs md:text-sm w-[110px] border-none md:min-w-[150px]">
                            <SelectValue placeholder="title" />
                        </SelectTrigger>
                        <SelectContent className="z-50 rounded-xl" ref={(ref) => ref?.addEventListener('touchend', (e) => e.preventDefault())} >
                            <SelectGroup>
                                {options.map(({ value, option }) => (
                                    <SelectItem
                                        key={value}
                                        className="text-xs md:text-sm rounded-xl"
                                        value={value}
                                    >
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    onKeyDown={(e) => handleKeyPress(e)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes..."
                    className="flex-grow w-[50%]  p-2 ml-2 text-sm  text-gray-400 border-none bg-inherit placeholder-color focus:outline-none focus:ring-0"
                />
                <Button disabled={!searchQuery} onClick={handleSearch} className="w-24 px-2 ml-2 text-xs text-white bg-red-400 rounded-full md:text-sm hover:opacity-90 hover:bg-red-500" >
                    Search
                </Button>
            </div>
        </div>
    )
}

export default SearchBar