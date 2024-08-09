import { getAuth, signOut } from "firebase/auth"
import { Link } from "react-router-dom";
import img from '../../public/recipe-book.png'
import { IoLogOutOutline } from "react-icons/io5";
import { useState } from "react";
import recipeImg from '../../public/recipe.png'
import recipeList from '../../public/cook-book.png'
function Navbar() {

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const auth = getAuth();
  return (
    <nav className="sticky top-0 px-0 z-50 py-5 sm:p-8 text-[white] bg-[#f48982] shadow-lg md:shadow-xl fira-sans">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <div className="flex items-center space-x-2 text-xl font-bold sm:text-xl">
          <Link to="/main" className="flex items-center gap-2">
            <img className="w-6 ml-2 md:w-8" src={img} alt="Logo" />
            <p>MyFoodRecipes</p>
          </Link>
        </div>
        <div className="hidden space-x-2 text-xs md:flex sm:space-x-4 sm:text-base">
          <Link
            onClick={closeMenu}
            to="/main/add-recipe"
            className="relative flex items-center justify-center gap-3 px-2 py-1 hover:text-white sm:px-4 sm:py-1"
          >
            <img className="w-5" src={recipeImg} alt="" />
            <span className="relative underline-hover">Add Recipe</span>
          </Link>
          <Link
            onClick={closeMenu}
            to="/main/my-recipes"
            className="relative flex items-center justify-center gap-2 px-2 py-1 hover:text-white sm:px-4 sm:py-1"
          >
            <img className="w-6" src={recipeList} alt="" />
            <span className="relative underline-hover">MyRecipes</span>
          </Link>
          <button
            onClick={() => signOut(auth)}
            className="relative flex items-center justify-center gap-2 px-6 py-1 text-red-500 bg-white rounded-xl hover:opacity-80 sm:px-4 sm:py-1"
          >
            <span>Logout</span>
            <IoLogOutOutline />
          </button>
        </div>

        {/* Hamburger Menu */}
        <div className="flex items-center md:hidden">
          <button className="text-white focus:outline-none" onClick={toggleMenu}>
            <div className="relative flex flex-col items-center justify-center w-8 h-8">
              <span
                className={`block h-0.5 mb-1.5 w-full bg-current transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
              ></span>
              <span
                className={`block h-0.5  mb-1.5 w-full bg-current transition duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''
                  }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-current transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
              ></span>
            </div>
          </button>
        </div>
      </div>


      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={closeMenu}
      ></div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#f48982] w-64 z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-center py-2 mt-24 space-x-2 text-xl font-bold border-b-2 border-white sm:text-xl">
          <Link onClick={closeMenu} to="/main" className="flex items-center gap-2">
            <img className="w-6 ml-2 md:w-8" src={img} alt="Logo" />
            <p>MyFoodRecipes</p>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center gap-8 px-4 my-[90%]">
          <Link onClick={closeMenu} to="/main/add-recipe" className="flex items-center justify-center w-full gap-2 px-2 py-0 text-center hover:text-white sm:px-4 sm:py-2">
            <img className="w-6" src={recipeImg} alt="" />
            <span>Add Recipe</span>
          </Link>

          {/* <div className="w-[114%] border-t border-white"></div> Divider */}

          <Link onClick={closeMenu} to="/main/my-recipes" className="flex items-center justify-center w-full gap-2 px-2 py-0 text-center hover:text-white sm:px-4 sm:py-2">
            <img className="w-8" src={recipeList} alt="" />
            <span>MyRecipes</span>
          </Link>

          {/* <div className="w-[114%] border-t border-white"></div> Divider */}

          <button
            onClick={() => {
              closeMenu();
              signOut(auth);
            }}
            className="absolute  flex items-center justify-center w-[80%] gap-2 px-3 py-2 text-red-500 bg-white bottom-5 rounded-xl hover:opacity-80 sm:px-4 sm:py-2"
          >
            Logout
            <IoLogOutOutline />
          </button>
        </div>
      </div>

    </nav>
  )
}

export default Navbar
