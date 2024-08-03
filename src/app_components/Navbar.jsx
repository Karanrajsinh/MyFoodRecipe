import { getAuth, signOut } from "firebase/auth"
import { Link } from "react-router-dom";


function Navbar() {

  const auth = getAuth();
  return (
    <nav className="sticky top-0 px-0 z-50 py-5 sm:p-8 text-red-100 shadow-xl bg-[#f48982]">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <div className="text-xl font-bold text-white sm:text-xl">
          <Link to="/main">MyRecipes</Link>
        </div>
        <div className="flex space-x-2 text-xs sm:space-x-4 sm:text-base">
          <Link to="/main/add-recipe" className="px-2 py-1 hover:text-white sm:px-4 sm:py-1">
            Add Recipe
          </Link>
          <Link to="/main/my-recipes" className="px-2 py-1 hover:text-white sm:px-4 sm:py-1">
            Recipes
          </Link>
          <button
            onClick={() => signOut(auth)}
            className="px-3 py-1 text-red-500 bg-white rounded-xl hover:opacity-80 sm:px-4 sm:py-1"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
