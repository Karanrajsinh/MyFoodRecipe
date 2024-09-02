import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { FaBookmark, FaEdit } from 'react-icons/fa';
import { ImSpinner8 } from "react-icons/im";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiBookmark } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUserAuth } from '@/context/UserAuth';
import toast from 'react-hot-toast';
import { capitalizeText } from '@/utils/uitls';
import { addSavedRecipe, checkIsOwner, checkSavedRecipe, deleteRecipe, getRecipe, removeSavedRecipe } from '@/utils/firebase';
import { useQueryClient } from '@tanstack/react-query';
import { MdDelete } from 'react-icons/md';
import RecipeNotFound from './RecipeNotFound';


const RecipeDetail = () => {

  const navigate = useNavigate();
  const { uid } = useUserAuth();
  const { id } = useParams();
  const [isAuthor, setIsAuthor] = useState();
  const [recipeData, setRecipeData] = useState();
  const [loading, setLoading] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [noRecipeFound, setNoRecipeFound] = useState(false);

  const query = useQueryClient();

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const checkData = async () => {
      setLoading(true);
      try {
        const [ownerRes, savedRecipeRes, recipeRes] = await Promise.all([
          checkIsOwner(uid, id),
          checkSavedRecipe(uid, id),
          getRecipe(id)
        ]);

        // Handle checkIsOwner result
        if (ownerRes.empty) {
          setIsAuthor(false);
        } else {
          setIsAuthor(true);
        }

        // Handle checkSavedRecipe result
        if (!savedRecipeRes.empty) {
          setIsBookmarked(true);
        }

        // Handle getRecipe result
        if (!recipeRes.exists()) {
          setNoRecipeFound(true)
        } else {
          setRecipeData(recipeRes.data());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors here if needed
      } finally {
        setLoading(false);
      }
    };

    checkData()
  }, [uid, id, navigate]);

  let formatedRecipeData;

  if (recipeData) {
    formatedRecipeData = {
      ...recipeData,
      title: capitalizeText(recipeData?.title),
      categories: recipeData?.categories.map((category) => (capitalizeText(category))),
      ingredients: recipeData?.ingredients.map(ing => ({ ...ing, name: capitalizeText(ing.name) })),
    }
  }


  const handleDelete = () => {
    setIsDeleting(true)
    deleteRecipe(uid, id).then((res) => {
      console.log(res)
      query.invalidateQueries({ queryKey: ["recipes", "recipes"] }).then(() => {
        toast.success('Recipe Deleted');
        setIsDeleting(false);
        navigate('/main/my-recipes');
      })
    })
  }

  const saveRecipe = () => {

    setIsSaving(true);

    if (!isBookmarked) {
      addSavedRecipe(uid, id).then(() => {
        query.invalidateQueries({ queryKey: ["recipes", "bookmarked"] }).then(() => {
          toast.success('Recipe Saved')
          setIsBookmarked(true);
          setIsSaving(false);
        })
      })
    }

    if (isBookmarked) {
      removeSavedRecipe(uid, id).then(() => {
        query.invalidateQueries({ queryKey: ["recipes", "bookmarked"] }).then(() => {
          toast.success('Recipe Unsaved')
          setIsBookmarked(false);
          setIsSaving(false);
        })
      })
    }
  };

  if (loading) return <p className='flex items-center justify-center my-[80%] md:m-[20%] text-center text-sm md:text-lg gap-2 text-slate-500'>Loading Recipe<ImSpinner8 className='text-red-400 spinner-rotate' /></p>
  if (noRecipeFound) return <RecipeNotFound />
  if (loading === false && !noRecipeFound) return (
    <>
      <div className=" flex  flex-col w-full md:mt-8 md:w-[50%] md:min-h-screen mx-auto">
        <div className="relative bg-black shadow-lg h-44 md:rounded-2xl md:h-72">
          <img
            src={formatedRecipeData?.photoUrl}
            alt={formatedRecipeData?.title}
            className="object-cover w-full shadow-md realtive h-44 md:h-72 md:rounded-2xl opacity-70"
          />
          <div className="absolute top-0 left-0 flex items-center justify-center w-full bg-red-500 h-44 bg-opacity-40 md:h-72 md:rounded-2xl">
            <h1 className="text-2xl font-bold text-red-100 spectral-sc md:text-4xl">{formatedRecipeData?.title}</h1>
          </div>
        </div>
        <div className="text-sm md:text-lg relative text-slate-600  p-6 md:p-8 mx-auto   min-w-[100%] max-w-[25em] md:min-w-[90%] md:max-w-[90em]">
          <div className="flex items-start justify-between mt-4 mb-8">
            <div>
              <p className="mb-1 italic"><span className='font-semibold text-red-600'>Author:</span> {formatedRecipeData?.author}</p>
              <div className="flex gap-1 mb-1"><span className='font-semibold text-red-600'>Category:</span> <p className='w-[80%] md:w-[90%]'> {formatedRecipeData?.categories.map((category, index) => <span className='mr-1' key={index}>{category}{index === formatedRecipeData?.categories.length - 1 ? '' : ","}</span>)}</p></div>
              <p className="mb-1"><span className='font-semibold text-red-600'>Servings:</span> {formatedRecipeData?.servings}</p>
              <p className="mb-1"><span className='font-semibold text-red-600'>Preparation:</span>{` ${formatedRecipeData?.prepTime?.time} ${formatedRecipeData?.prepTime?.unit}`}</p>
              <p className="mb-1"><span className='font-semibold text-red-600'>Cooking:</span>{` ${formatedRecipeData?.cookTime?.time} ${formatedRecipeData?.cookTime?.unit}`}</p>
            </div>
            <div className='flex flex-col items-center justify-center gap-2 md:gap-4'>
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
              {isSaving && <ImSpinner8 className='mx-auto text-sm text-red-500 md:text-xl spinner-rotate' />}
              <div className='flex flex-col items-center justify-center gap-5 text-red-600'>
                {isAuthor &&
                  <>
                    <button>
                      <Link to={`/main/recipe-edit/${id}`}>
                        <FaEdit className='text-xl md:text-2xl' />
                      </Link>
                    </button>
                    <button onClick={() => setModalOpen(true)}>
                      <MdDelete className='mr-1.5 text-2xl md:text-3xl' />
                    </button>
                  </>
                }
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold text-red-600 md:mb-4 frank-ruhl-libre md:text-3xl">Ingredients</h3>
            <ul className="pl-5 mb-4 list-disc">
              {formatedRecipeData?.ingredients.map((ingredient, index) => (
                <li key={index} className="mb-1 md:text-lg">
                  {ingredient.name} {`(${ingredient.quantity}${ingredient.unit === " " ? "" : ingredient.unit})`}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-red-600 md:mb-4 frank-ruhl-libre md:text-3xl">Steps</h3>
            <ol className="pl-5 list-decimal">
              {formatedRecipeData?.steps.map((step, index) => (
                <li key={index} className="mb-3 md:mb-5 md:text-lg">{step.description}</li>
              ))}
            </ol>
          </div>
        </div>
        <Button className="flex items-center justify-center gap-2 px-6 mx-auto mt-2 mb-4 text-sm text-center bg-red-400 md:gap-3 md:my-6 w-min md:px-7 md:py-6 md:text-[1.025rem] rounded-3xl hover:bg-opacity-90 hover:bg-red-400" onClick={() => navigate(-1)}><FaArrowLeftLong className='text-sm' /><span className='flex md:mt-1 md:mb-1'>Back</span></Button>
      </div>
      {modalOpen &&
        <>
          <div id='overlay' className="fixed inset-0 z-50 min-h-screen bg-gray-800 bg-opacity-50 backdrop-blur-sm">

            <div id='modal' className="absolute inset-0 z-50 flex items-center justify-center">
              <div className="bg-red-100  text-[#993b3b] p-8 rounded-lg shadow-lg relative w-full max-w-sm md:w-[40em] md:max-w-[40em]">
                <button className="absolute text-[#993b3b] top-3 right-3 hover:opacity-70" onClick={closeModal}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>

                <p className="mb-4 text-base font-semibold md:text-xl">Delete Recipe</p>
                <p className='mb-4 text-sm md:text-base'>Are You Sure You Want To Delete Recipe &quot;{`${formatedRecipeData?.title}`}&quot; Permanently ? </p>
                <div className="flex justify-end gap-4">
                  <button className="px-4 py-2 text-sm border rounded-lg md:text-base text-[#993b3b] border-[#993b3b] " onClick={closeModal}>Cancel</button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-red-400 rounded-lg md:text-base hover:opacity-80" onClick={handleDelete}><span>Delete</span>{isDeleting && <ImSpinner8 className='spinner-rotate' />}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </>
  );
}

export default RecipeDetail;
