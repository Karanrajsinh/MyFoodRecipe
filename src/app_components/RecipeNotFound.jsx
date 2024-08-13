import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom"

function RecipeNotFound() {

    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-100">
            <div className="text-center">
                <h1 className="mb-4 text-xl font-bold text-red-400 md:text-3xl">Recipe Not Found</h1>
                <p className="mb-6 w-[80%] mx-auto text-sm md:text-lg text-slate-500">
                    Sorry, the recipe you&quot;re looking for doesn&quot;t exist or has been removed.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center gap-3 px-6 py-2 mx-auto text-xs text-white bg-red-400 md:text-base rounded-3xl hover:bg-opacity-90"
                >
                    <FaArrowLeftLong />
                    Back
                </button>
            </div>
        </div>
    )
}

export default RecipeNotFound
