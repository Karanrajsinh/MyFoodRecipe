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
    checkIsOwner(uid, recipe.id).then((res) => {
      if (res.empty) setIsAuthor(false);
      else setIsAuthor(true);
    }) /* eslint-disable */

  }, [])
  /* eslint-ensable */

  let ingredientsList = [];
  recipe.ingredients.forEach((ing => {
    ingredientsList.push(capitalizeText(ing.name));
  }
  ));

  const filteredRecipe =
  {
    title: capitalizeText(recipe.title),
    photoUrl: recipe.photoUrl,
    author: recipe.author,
    ingredients: ingredientsList,
    category: capitalizeText(recipe.category)
  }

  return (
    <Link to={`/main/recipe/${recipe.id}`}>
      <div className="  bg-[#ffb9b9] bg-opacity-50 text-[#a75858] hover:bg-opacity-80 flex flex-col justify-center p-4 mx-auto mb-4  border border-gray-300 rounded-3xl shadow-md w-[50em] md:flex-row">
        <img src={filteredRecipe?.photoUrl} alt={filteredRecipe?.title} className="max-w-[120px] h-[120px] mb-4 rounded-[10rem] md:w-1/4 md:mb-0 object-cover" />
        <div className="flex-grow md:ml-4">
          {isAuthor && <FaUserCircle className="relative float-right text-xl top-2 right-4" />}
          <h2 className="mb-3 text-xl font-bold">{filteredRecipe?.title}</h2>
          <p className="mb-1 italic"><span className='mr-1 not-italic font-semibold'>Author:</span>{filteredRecipe?.author}</p>
          <div className="flex gap-1 mb-1">
            <span className='mr-1 not-italic font-semibold'>Ingredients:</span>
            {filteredRecipe.ingredients.map((ing, index) => (
              <p key={index}>{ing}{index === filteredRecipe.ingredients.length - 1 ? '' : ","}</p>
            ))}
          </div>
          <p className=""><span className='mr-1 not-italic font-semibold'>Category:</span> {filteredRecipe?.category}</p>
        </div>
      </div>
    </Link>
  );
}


export default Recipe
