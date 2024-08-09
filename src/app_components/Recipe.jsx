import { useUserAuth } from "@/context/UserAuth";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { capitalizeText } from "../utils/uitls.js";
import { checkIsOwner } from "@/utils/firebase";

function Recipe({ recipe }) {

  const { uid } = useUserAuth();
  const [isAuthor, setIsAuthor] = useState();

  useEffect(() => {
    checkIsOwner(uid, recipe?.id).then((res) => {
      if (res.empty) setIsAuthor(false);
      else setIsAuthor(true);
    }) /* eslint-disable */

  }, [])
  /* eslint-ensable */

  let formatedIngredientsList = [];
  let formatedCategories = [];

  recipe?.ingredients.forEach((ing => {
    formatedIngredientsList.push(capitalizeText(ing.name));
  }
  ));

  recipe?.categories?.forEach((category => {
    formatedCategories.push(capitalizeText(category));
  }
  ));

  const filteredRecipe =
  {
    title: capitalizeText(recipe?.title),
    photoUrl: recipe?.photoUrl,
    author: recipe?.author,
    ingredients: formatedIngredientsList,
    categories: formatedCategories
  }

  return (
    <Link to={`/main/recipe/${recipe?.id}`}>
      <div className="bg-[#ffb9b9] frank-ruhl-libre bg-opacity-50 fira-sans text-[#a75858] hover:bg-opacity-80 flex items-center justify-center px-1 py-3 mx-auto  border border-gray-300 rounded-2xl md:rounded-3xl shadow-md w-full max-w-[50em] gap-4 md:p-4">
        <img
          src={filteredRecipe?.photoUrl}
          alt={filteredRecipe?.title}
          className="w-[70px] h-[70px] ml-2 rounded-[5rem] md:w-[120px] md:h-[120px] md:mb-0 object-cover my-auto"
        />
        <div className="flex-grow md:ml-4">
          {isAuthor && <FaUserCircle className="relative float-right text-sm md:text-xl top-2 right-4" />}
          <h2 className="mb-1 text-sm font-bold spectral-sc md:text-lg">{filteredRecipe?.title}</h2>
          <p className="mb-1 text-xs italic md:text-base"><span className='mr-1 not-italic font-semibold'>Author:</span>{filteredRecipe?.author}</p>
          <div className="flex w-full mb-1 text-xs flext md:text-base ">
            <span className='mr-1 not-italic font-semibold'>Ingredients:</span>
            <p className="max-w-[180px] md:max-w-[400px] truncate">{filteredRecipe?.ingredients.map((ing, index) => (
              <span className="" key={index}>{ing}{index === filteredRecipe?.ingredients.length - 1 ? '' : ","}</span>
            ))}</p>
          </div>
          <div className="flex w-full mb-1 text-xs flext md:text-base ">
            <span className='mr-1 not-italic font-semibold'>Category:</span>
            <p className="max-w-[180px] md:max-w-[400px] truncate">{filteredRecipe?.categories.map((category, index) => (
              <span className="" key={index}>{category}{index === filteredRecipe?.categories.length - 1 ? '' : ","}</span>
            ))}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}


export default Recipe
