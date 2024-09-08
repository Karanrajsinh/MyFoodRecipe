import { useUserAuth } from '@/context/UserAuth';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { MdCancel } from "react-icons/md";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from '@/components/ui/select'
import { addRecipe, getRecipe, updateRecipe } from '@/utils/firebase';
import { ImSpinner8 } from 'react-icons/im';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { capitalizeText } from '@/utils/uitls';



function AddRecipe() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [editRecipe, setEditRecipe] = useState();
  const [recipeTitle, setRecipeTitle] = useState('');
  const [fetchingRecipe, setFetchingRecipe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipeData, setRecipeData] = useState(null);
  const auth = getAuth();
  const query = useQueryClient();
  const [isFormChanged, setIsFormChanged] = useState(false);

  const defaultData = {
    title: '',
    photoUrl: '',
    servings: '',
    prepTime: { time: "" },
    cookTime: { time: "" },
    categories: [{ value: "" }],
    ingredients: [{ name: '', quantity: '' }],
    steps: [{ description: '' }]
  }


  const name = auth.currentUser.displayName;
  const { uid } = useUserAuth();

  const { register, trigger, getValues, reset, watch, handleSubmit, setValue, control, formState: { errors } } = useForm({
    defaultValues: defaultData
  });


  const formValues = watch();

  useEffect(() => {

    const hasChanged = Object.keys(defaultData).some((key) => {
      const currentValue = formValues[key];
      const initialValue = recipeData ? recipeData[key] : defaultData[key];
      return JSON.stringify(currentValue) !== JSON.stringify(initialValue);
    });
    setIsFormChanged(hasChanged);
    /*eslint-disable */
  }, [formValues, recipeData]);
  /*eslint-ensable */

  useEffect(() => {
    setEditRecipe(Boolean(id));
  }, [setEditRecipe, reset, id])


  useEffect(() => {
    setFetchingRecipe(true);
    if (editRecipe) {
      getRecipe(id).then((res) => {
        setRecipeTitle(res.data()?.title);
        const formatedData = {
          ...res.data(),
          categories: res.data().categories.map((category) => {
            return {
              value: category,
            };
          })
        };
        reset(formatedData);
        setRecipeData(formatedData);
        setFetchingRecipe(false);
      })
    }
    else {
      reset(defaultData);
      setFetchingRecipe(false);
    }/*eslint-disable */
  }, [editRecipe, id, setRecipeTitle, reset,])
  /*eslint-enable */


  const { fields: categoryFields, append: addCategory, remove: removeCategory } = useFieldArray({
    control,
    name: 'categories'
  });
  const { fields: ingredientFields, append: addIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients'
  });

  const { fields: stepFields, append: addStep, remove: removeStep } = useFieldArray({
    control,
    name: 'steps'
  });

  async function onSubmit(data) {

    setIsLoading(true);
    const formatedIng = data.ingredients.map((ing) => ({
      name: ing.name.toLowerCase().trimEnd(),
      quantity: ing.quantity,
      unit: ing.unit
    }))


    const formatedCategory = data.categories.map((category) => category.value.toLowerCase().trimEnd())

    const title = data.title.toLowerCase().trimEnd();

    const formatedData =
    {
      ...data,
      title: title,
      categories: formatedCategory,
      ingredients: formatedIng,
      ingredientsNameList: formatedIng.map((ing) => ing.name)
    }

    if (!editRecipe) {
      addRecipe(uid, formatedData, name).then(() => {
        query.invalidateQueries({ queryKey: ['recipes', 'recipes'] }).then(() => {
          setIsLoading(false);
          toast.success('Recipe Created');
          navigate('/main/my-recipes')
        })
      })
    }
    else {
      updateRecipe(id, formatedData).then(() => {
        setIsLoading(false);
        toast.success('Recipe Edited');
        navigate(`/main/recipe/${id}`)
      }).catch((err) => {
        toast.error('Unable To Edit Recipe');
        setIsLoading(false)
        console.error(err);
      })
    }
  }

  return (
    <div className="flex items-center justify-center md:h-[90vh] my-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full md:min-w-[50em] max-w-[70em] p-8 bg-white border shadow-lg md:rounded-lg border-slate-300">
        <h1 className="mb-6 text-lg font-bold text-red-400 md:text-2xl">{editRecipe ? `Edit Recipe "${capitalizeText(recipeTitle)}"` : "Add Recipe"}</h1>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:mb-6">
          <div className="flex flex-col w-full text-sm md:pr-4 md:mt-10 ">
            <input
              disabled={isLoading || fetchingRecipe}
              type="text"
              placeholder="Title"
              {...register('title', {
                required: 'Title is required', pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: 'This Field Must Contain Only Letters'
                }
              })}
              className="w-full p-2 mb-1 border border-gray-400 rounded-lg disabled:cursor-not-allowed focus:border-red-400 focus:outline-none"
            />
            {errors.title && <p className="mt-1 text-red-500">{errors.title.message}</p>}

            <input
              disabled={isLoading || fetchingRecipe}
              type="text"
              placeholder="Photo URL"
              {...register('photoUrl', {
                required: 'Photo URL is required', pattern: {
                  value: /^https:\/\/.*/,
                  message: 'Photo URL must start with "https://"',
                },
              })}
              className="w-full p-2 mt-8 border border-gray-400 rounded-lg autofill:bg-red-300 disabled:cursor-not-allowed focus:border-red-400 focus:outline-none"
            />
            {errors.photoUrl && <p className="mt-1 text-red-500">{errors.photoUrl.message}</p>}
            <input
              disabled={isLoading || fetchingRecipe}
              type="number"
              placeholder="Servings"
              {...register('servings', { required: 'Servings is required', min: { value: 1, message: 'Must be  greater than 0' } })}
              className="w-full p-2 mt-8 border border-gray-400 rounded-lg disabled:cursor-not-allowed focus:border-red-400 focus:outline-none"
            />
            {errors.servings && <p className="mt-1 text-red-500">{errors.servings.message}</p>}

            <div className="flex mt-8">
              <input
                disabled={isLoading || fetchingRecipe}
                type="number"
                placeholder="Prep Time"
                {...register('prepTime.time', { required: 'Prep Time is required', min: { value: 1, message: 'Must be  greater than 0' } })}
                className="w-full p-2 border border-gray-400 rounded-lg disabled:cursor-not-allowed focus:border-red-400 focus:outline-none"
              />
              <Controller
                name={`prepTime.unit`}
                defaultValue='min'
                control={control}
                render={({ field }) => (
                  <Select
                    defaultValue={field.value || 'min'}
                    onValueChange={(value) => {
                      setValue(`prepTime.unit`, value);
                    }}
                  >
                    <SelectTrigger className=" text-xs text-slate-500 md:text-sm w-[100px] ml-2">
                      <SelectValue placeholder="min" />
                    </SelectTrigger>
                    <SelectContent className='text-slate-500'>
                      <SelectGroup>
                        <SelectItem value="min">Min</SelectItem>
                        <SelectItem value="hour">Hour</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>)}
              />
            </div>
            {errors.prepTime && <p className="mt-1 text-red-500">{errors.prepTime.time.message}</p>}

            <div className="flex mt-8">
              <input
                disabled={isLoading || fetchingRecipe}
                type="number"
                placeholder="Cook Time"
                {...register('cookTime.time', { required: 'Cook Time is required', min: { value: 1, message: 'Must be  greater than 0' } })}
                className="w-full p-2 border border-gray-400 rounded-lg disabled:cursor-not-allowed focus:border-red-400 focus:outline-none"
              />
              <Controller
                name={`cookTime.unit`}
                defaultValue='min'
                control={control}
                render={({ field }) => (
                  <Select
                    defaultValue={field.value || "min"}
                    onValueChange={(value) => {
                      setValue(`cookTime.unit`, value);
                    }}
                  >
                    <SelectTrigger className=" text-xs text-slate-500 md:text-sm w-[100px] ml-2">
                      <SelectValue placeholder="min" />
                    </SelectTrigger>
                    <SelectContent className='text-slate-500'>
                      <SelectGroup>
                        <SelectItem value="min">Min</SelectItem>
                        <SelectItem value="hour">Hour</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>)}
              />
            </div>
            {errors.cookTime && <p className="mt-1 text-red-500">{errors.cookTime.time.message}</p>}
            <div className='mt-4'>
              <h2 className="mb-2 font-semibold text-red-400 md:text-lg">Category</h2>
              <div className="p-2 overflow-y-scroll border rounded-lg border-slate-400 max-h-40 custom-scrollbar">
                {categoryFields.map((field, index) => (
                  <div key={field.id} className="flex items-center mb-2">
                    <input
                      disabled={isLoading || fetchingRecipe}
                      placeholder="Category"
                      {...register(`categories.${index}.value`, {
                        required: 'Category Cannot Be Empty', pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: 'This Field Must Contain Only Letters'
                        }
                      })}
                      className="w-full p-2 border border-gray-400 rounded-lg disabled:cursor-not-allowed focus:border-red-400 focus:outline-none"
                      rows="2"
                    />
                    {categoryFields.length > 1 && (
                      <button
                        type="button"
                        disabled={isLoading || fetchingRecipe}
                        className="ml-2 text-lg text-red-500"
                        onClick={() => removeCategory(index)}
                      >
                        <MdCancel />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  disabled={isLoading || fetchingRecipe}
                  className="p-2 mt-2 text-xs text-white bg-red-400 rounded-lg md:text-sm"
                  onClick={() => addCategory({ value: "" })}
                >
                  Add Category
                </button>
              </div>
              {errors.categories && <p className="mt-1 text-red-500">Each Category Must Have a Value Without Any Number or Symbols</p>}
            </div>
          </div>


          <div className="flex flex-col justify-around w-full text-sm md:pl-4 ">
            <div className="mb-4">
              <h2 className="mb-2 font-semibold text-red-400 md:text-lg">Ingredients</h2>
              <div className="p-2 overflow-y-scroll border rounded-lg border-slate-400 max-h-60 custom-scrollbar">
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className="flex items-center mb-2">
                    <input
                      disabled={isLoading || fetchingRecipe}
                      type="text"
                      placeholder="Name"
                      {...register(`ingredients.${index}.name`, {
                        required: 'Name is required', pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: 'This Field Must Contain Only Letters'
                        }
                      })}
                      className="w-1/2 p-2 border border-gray-400 rounded-lg disabled:cursor-not-allowed focus:border-red-400 focus:outline-none"
                    />
                    <input
                      disabled={isLoading || getValues(`ingredients.${index}.unit`) === "to taste"}
                      type="number"

                      placeholder="Quantity"
                      {...register(`ingredients.${index}.quantity`, {
                        validate: {
                          required: (value) => {
                            if (getValues(`ingredients.${index}.unit`) === 'to taste') {
                              setValue(`ingredients.${index}.quantity`, '');
                              return true
                            }
                            return value !== "" || 'Quantity is required';
                          }
                        }, min: { value: 1, message: 'Must be  greater than 0' },
                      })}
                      className="w-1/2 p-2 ml-2 border border-gray-400 rounded-lg disabled:cursor-not-allowed focus:border-red-400 focus:outline-none"
                    />
                    <Controller
                      name={`ingredients.${index}.unit`}
                      defaultValue='g'
                      control={control}
                      render={({ field }) => (
                        <Select
                          defaultValue={field.value || "g"}
                          onValueChange={(value) => {
                            setValue(`ingredients.${index}.unit`, value);
                            if (value == "to taste") {
                              trigger(`ingredients.${index}.quantity`);
                            }
                            else {
                              trigger(`ingredients.${index}.quantity`);
                            }
                          }}
                        >
                          <SelectTrigger className=" w-[150px] z-10 text-slate-500 text-xs md:text-sm md:w-[250px] ml-2">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent className='text-slate-500'>
                            <SelectGroup>
                              <SelectItem value="g">Gram (g)</SelectItem>
                              <SelectItem value="kg">Kilogram (kg)</SelectItem>
                              <SelectItem value="ml">Militre (ml)</SelectItem>
                              <SelectItem value="l">Litre (l)</SelectItem>
                              <SelectItem value="cup">Cup</SelectItem>
                              <SelectItem value="to taste">To Taste</SelectItem>
                              <SelectItem value="tsp">Tea Spoon (tsp)</SelectItem>
                              <SelectItem value="tbsp">Table Spoon (tbsp)</SelectItem>
                              <SelectItem value=" ">Item</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {ingredientFields.length > 1 && (
                      <button
                        type="button"
                        disabled={isLoading || fetchingRecipe}
                        className="ml-2 text-lg text-red-500"
                        onClick={() => removeIngredient(index)}
                      >
                        <MdCancel />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  disabled={isLoading || fetchingRecipe}
                  className="p-2 mt-2 text-xs text-white bg-red-400 rounded-lg md:text-sm"
                  onClick={() => addIngredient({ name: '', quantity: '' })}
                >
                  Add Ingredient
                </button>
              </div>
              {errors.ingredients && <p className="mt-2 text-red-500">All fields required , Name Only Text, Quantity at least 1 unless &quot;To Taste&quot;.</p>}
            </div>

            <div>
              <h2 className="mb-2 font-semibold text-red-400 md:text-lg">Steps</h2>
              <div className="p-2 overflow-y-scroll border rounded-lg border-slate-400 max-h-40 custom-scrollbar">
                {stepFields.map((field, index) => (
                  <div key={field.id} className="flex items-center mb-2">
                    <textarea
                      disabled={isLoading || fetchingRecipe}
                      placeholder="Step Description"
                      {...register(`steps.${index}.description`, { required: 'Step description is required' })}
                      className="w-full p-2 border border-gray-400 rounded-lg disabled:cursor-not-allowed focus:border-red-400 focus:outline-none"
                      rows="2"
                    />
                    {stepFields.length > 1 && (
                      <button
                        type="button"
                        disabled={isLoading || fetchingRecipe}
                        className="ml-2 text-lg text-red-500"
                        onClick={() => removeStep(index)}
                      >
                        <MdCancel />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  disabled={isLoading || fetchingRecipe}
                  className="p-2 mt-2 text-xs text-white bg-red-400 rounded-lg md:text-sm"
                  onClick={() => addStep({ description: '' })}
                >
                  Add Step
                </button>
              </div>
              {errors.steps && <p className="mt-2 text-red-500">Each step must have a description.</p>}
            </div>
          </div>
        </div>
        <div className='flex items-center justify-center gap-10 mt-8 md:gap-4'>
          <button
            type="submit"
            disabled={isLoading || !isFormChanged}
            className="flex items-center justify-center w-32 gap-2 p-2 text-sm text-white bg-red-400 md:text-base rounded-xl disabled:cursor-not-allowed hover:bg-opacity-80 disabled:bg-opacity-50"
          >
            <span>
              {editRecipe ? "Edit Recipe" : "Add Recipe"}
            </span>
            {isLoading && <ImSpinner8 className='spinner-rotate' />}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }
            }
            disabled={isLoading}
            className="flex items-center justify-center px-6 py-2 text-sm text-red-400 bg-white border border-red-400 md:text-base rounded-xl md:w-32 hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-red-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipe;


