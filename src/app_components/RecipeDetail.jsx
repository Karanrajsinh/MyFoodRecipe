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
import { useQueryClient } from '@tanstack/react-query';

const RecipeDetail = () => {

  const navigate = useNavigate();
  const { uid } = useUserAuth();
  const { id } = useParams();
  const [isAuthor, setIsAuthor] = useState();
  const [recipeData, setRecipeData] = useState();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const query = useQueryClient();
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
        query.invalidateQueries({ queryKey: ["recipes", "bookmarked"] })
        toast.success('Recipe Saved')
        setIsBookmarked(true);
        setIsSaving(false);
      })
    }

    if (isBookmarked) {
      removeSavedRecipe(uid, id).then(() => {
        query.invalidateQueries({ queryKey: ["recipes", "bookmarked"] })
        toast.success('Recipe Unsaved')
        setIsBookmarked(false);
        setIsSaving(false);
      })
    }
  };


  return (
    <>
      {
        loading ? (
          <p className='flex items-center justify-center my-[80%] md:m-[20%] text-center text-sm md:text-lg gap-2 text-slate-500'>Loading Recipe<ImSpinner8 className='text-red-400 spinner-rotate' /></p>
        ) : (
          <>
            <div className=" flex flex-col w-full md:mt-8 md:w-[50%] md:min-h-screen mx-auto">
              <div className="relative bg-black shadow-lg h-44 md:rounded-3xl md:h-60">
                <img
                  src={formatedRecipeData?.photoUrl}
                  alt={formatedRecipeData?.title}
                  className="object-cover w-full shadow-md h-44 md:h-60 md:rounded-3xl opacity-70"
                />
                <div className="absolute top-0 left-0 flex items-center justify-center w-full bg-red-500 h-44 bg-opacity-40 md:h-60 md:rounded-3xl">
                  <h1 className="text-2xl font-bold text-red-100 spectral-sc md:text-4xl">{formatedRecipeData?.title}</h1>
                </div>
              </div>
              <div className="text-sm md:text-base relative  p-6 md:p-8 mx-auto  text-[#993b3b] min-w-[100%] max-w-[25em] md:min-w-[80%] md:max-w-[70em]">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="mb-1 italic"><span className='font-semibold'>Author:</span> {formatedRecipeData?.author}</p>
                    <p className="mb-1"><span className='font-semibold'>Category:</span> {formatedRecipeData?.category}</p>
                    <p className="mb-1"><span className='font-semibold'>Servings:</span> {formatedRecipeData?.servings}</p>
                    <p className="mb-1"><span className='font-semibold'>Preparation:</span>{` ${formatedRecipeData?.prepTime?.time} ${formatedRecipeData?.prepTime?.unit}`}</p>
                    <p className="mb-1"><span className='font-semibold'>Cooking:</span>{` ${formatedRecipeData?.cookTime?.time} ${formatedRecipeData?.cookTime?.unit}`}</p>
                  </div>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <button className="ml-1 text-red-500 disabled:cursor-not-allowed" onClick={saveRecipe} disabled={isSaving}>
                      {!isAuthor && (
                        <>
                          {isBookmarked ? (
                            <FaBookmark className="text-2xl md:text-3xl" />
                          ) : (
                            <FiBookmark className="text-2xl md:text-3xl" />
                          )}
                        </>
                      )}
                    </button>
                    {isSaving && <ImSpinner8 className='mx-auto text-sm md:text-xl spinner-rotate' />}
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-semibold frank-ruhl-libre md:text-2xl">Ingredients</h3>
                  <ul className="pl-5 mb-4 list-disc">
                    {formatedRecipeData?.ingredients.map((ingredient, index) => (
                      <li key={index} className="mb-1">
                        {ingredient.name} {`(${ingredient.quantity}${ingredient.unit === " " ? "" : ingredient.unit})`}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold frank-ruhl-libre md:text-2xl">Steps</h3>
                  <ol className="pl-5 list-decimal">
                    {formatedRecipeData?.steps.map((step, index) => (
                      <li key={index} className="mb-3">{step.description}</li>
                    ))}
                  </ol>
                </div>
              </div>
              <Button className="flex items-center justify-center px-6 mx-auto mt-2 mb-4 text-sm text-center bg-red-400 md:my-6 w-min md:px-6 md:py-6 md:text-lg rounded-3xl hover:bg-opacity-90 hover:bg-red-400" onClick={() => navigate(-1)}><FaArrowLeftLong className='text-sm' /><span className='flex ml-2 md:mt-1 md:mb-1'>Back</span></Button>
            </div>
          </>
        )
      }
    </>
  );
}

export default RecipeDetail;
