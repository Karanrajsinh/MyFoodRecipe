import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { FaBookmark } from 'react-icons/fa';
import { ImSpinner8 } from "react-icons/im";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiBookmark } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserAuth } from '@/context/UserAuth';
import toast from 'react-hot-toast';
import { capitalizeText } from '@/utils/uitls';
import { addSavedRecipe, checkIsOwner, checkSavedRecipe, getRecipe, removeSavedRecipe } from '@/utils/firebase';

const RecipeDetail = () => {

  const navigate = useNavigate();
  const { uid } = useUserAuth();
  const { id } = useParams();
  const [isAuthor, setIsAuthor] = useState();
  const [recipeData, setRecipeData] = useState();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setLoading(true);

    checkIsOwner(uid, id).then((res) => {
      if (res.empty) setIsAuthor(false);
      else setIsAuthor(true);
    })

    checkSavedRecipe(uid, id).then((res) => {
      if (!res.empty) setIsBookmarked(true);
    })

    getRecipe(id).then((res) => {
      setRecipeData(res.data());
      setLoading(false);
    })
    /* eslint-disable */
  }, [])

  /* eslint-ensable */

  let formatedRecipeData;

  if (recipeData) {
    formatedRecipeData = {
      ...recipeData,
      title: capitalizeText(recipeData?.title),
      category: capitalizeText(recipeData?.category),
      ingredients: recipeData?.ingredients.map(ing => ({ ...ing, name: capitalizeText(ing.name) })),
    }
  }

  const saveRecipe = () => {

    setIsSaving(true);

    if (!isBookmarked) {
      addSavedRecipe(uid, id).then(() => {
        toast.success('Recipe Saved')
        setIsBookmarked(true);
        setIsSaving(false);
      })
    }

    if (isBookmarked) {
      removeSavedRecipe(uid, id).then(() => {
        toast.success('Recipe UnSaved')
        setIsBookmarked(false);
        setIsSaving(false);
      })
    }
  };


  return (
    <>
      <Button className="relative flex px-8 py-6 text-2xl text-center bg-red-400 rounded-3xl top-14 left-16 hover:bg-opacity-90 hover:bg-red-400" onClick={() => navigate(-1)}><FaArrowLeftLong /><span className='flex mb-1 ml-2'>Back</span></Button>
      {
        loading ? (
          <p className='text-center m-[20%]'>Loading Recipe</p>
        ) : (
          <>
            <div className="flex flex-col mt-16 w-[70%] min-h-screen mx-auto">
              <div className="relative bg-black rounded-2xl h-80">
                <img
                  src={formatedRecipeData?.photoUrl}
                  alt={formatedRecipeData?.title}
                  className="object-cover w-full h-80 rounded-2xl opacity-70"
                />
                <div className="absolute top-0 left-0 flex items-center justify-center w-full bg-red-500 bg-opacity-40 h-80 rounded-2xl">
                  <h1 className="text-4xl font-bold text-red-100">{formatedRecipeData?.title}</h1>
                </div>
              </div>
              <div className="relative z-10 p-8 mx-auto -mt-16 bg-[#f3cfcf] text-[#993b3b] border border-red-300 rounded-3xl shadow-md w-[50em]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="mb-1 italic"><strong>Author:</strong> {formatedRecipeData?.author}</p>
                    <p className="mb-1"><strong>Category:</strong> {formatedRecipeData?.category}</p>
                    <p className="mb-1"><strong>Servings:</strong> {formatedRecipeData?.servings}</p>
                    <p className="mb-1"><strong>Preparation:</strong>{` ${formatedRecipeData?.prepTime?.time} ${formatedRecipeData?.prepTime?.unit}`}</p>
                    <p className="mb-1"><strong>Cooking:</strong>{` ${formatedRecipeData?.cookTime?.time} ${formatedRecipeData?.cookTime?.unit}`}</p>
                  </div>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <button className="ml-1 text-red-500 disabled:cursor-not-allowed" onClick={saveRecipe} disabled={isSaving}>
                      {!isAuthor && (
                        <>
                          {isBookmarked ? (
                            <FaBookmark className="text-3xl" />
                          ) : (
                            <FiBookmark className="text-3xl" />
                          )}
                        </>
                      )}
                    </button>
                    {isSaving && <ImSpinner8 className='text-xl spinner-rotate' />}
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="mb-2 text-2xl font-semibold">Ingredients:</h3>
                  <ul className="pl-5 mb-4 list-disc">
                    {formatedRecipeData?.ingredients.map((ingredient, index) => (
                      <li key={index} className="mb-1">
                        {ingredient.name} {`(${ingredient.quantity}${ingredient.unit === " " ? "" : ingredient.unit})`}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 text-2xl font-semibold">Steps:</h3>
                  <ol className="pl-5 list-decimal">
                    {formatedRecipeData?.steps.map((step, index) => (
                      <li key={index} className="mb-3">{step.description}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </>
        )
      }
    </>
  );
}

export default RecipeDetail;
