import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useRecipes } from "@/context/Recipes";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from '@/components/ui/select'
import searchIcon from "../../public/search.png"

function SearchBar() {

    const { searchQuery, setSearchQuery, filter, setFilter, setFilterType, handleSearch } = useRecipes();
    const options = [
        { value: 'all', option: 'All' },
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

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && searchQuery !== '') {
            handleSearch();
            inputRef.current.blur();
        }
    }

    return (
        <div className="flex flex-wrap items-center justify-center w-[95%] gap-4 mx-auto  mt-10">
            <div className="flex flex-row p-2 bg-white border border-gray-300 rounded-full md:min-w-[40%]">
                <div className="gap-4">
                    <Select defaultValue="all" onValueChange={handleValueChange} value={filter}>
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
                    value={searchQuery}
                    onKeyDown={(e) => handleKeyPress(e)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes..."
                    className="flex-grow w-[50%]  p-2 ml-2 text-sm  text-gray-400 border-none bg-inherit placeholder-color focus:outline-none focus:ring-0"
                />
                <Button disabled={!searchQuery} onClick={handleSearch} className="w-24 px-2 ml-2 text-xs text-white bg-white rounded-full md:text-sm hover:opacity-90 hover:bg-white" >
                    <img src={searchIcon} alt="" className="md:w-8 w-7" />
                </Button>
            </div>
        </div>
    )
}

export default SearchBar