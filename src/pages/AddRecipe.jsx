import { useUserAuth } from '@/context/UserAuth';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { MdCancel } from "react-icons/md";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from '@/components/ui/select'
import { addRecipe } from '@/utils/firebase';
import { ImSpinner8 } from 'react-icons/im';
import toast from 'react-hot-toast';
import { useState } from 'react';



function AddRecipe() {

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      ingredients: [{ name: '', quantity: '' }],
      steps: [{ description: '' }]
    }
  });

  const { uid, name } = useUserAuth();

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
      name: ing.name.toLowerCase(),
      quantity: ing.quantity,
      unit: ing.unit
    }))

    const title = data.title.toLowerCase();
    const category = data.category.toLowerCase();

    const formatedData =
    {
      ...data,
      title: title,
      category: category,
      ingredients: formatedIng,
      ingredientsNameList: formatedIng.map((ing) => ing.name)
    }
    addRecipe(uid, formatedData, name).then(() => {
      setIsLoading(false);
      toast.success('Recipe Created')
    }).catch((err) => {
      toast.error('Unable To Create Recipe');
      setIsLoading(false)
      console.error(err);
    })
  }

  return (
    <div className="flex items-center justify-center md:mt-28">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl p-8 bg-white border rounded-lg shadow-lg border-slate-300">
        <h1 className="mb-6 text-lg font-bold text-red-400 md:text-2xl">Add Recipe</h1>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:mb-6">
          <div className="flex flex-col w-full text-sm md:pr-4 md:mt-10 ">
            <input
              disabled={isLoading}
              type="text"
              placeholder="Title"
              {...register('title', { required: 'Title is required' })}
              className="w-full p-2 mb-1 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
            />
            {errors.title && <p className="text-red-500 ">{errors.title.message}</p>}

            <input
              disabled={isLoading}
              type="text"
              placeholder="Photo URL"
              {...register('photoUrl', {
                required: 'Photo URL is required', pattern: {
                  value: /^https:\/\/.*/,
                  message: 'Photo URL must start with "https://"',
                },
              })}
              className="w-full p-2 mt-8 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
            />
            {errors.photoUrl && <p className="text-red-500 ">{errors.photoUrl.message}</p>}
            <input
              disabled={isLoading}
              type="number"
              placeholder="Servings"
              {...register('servings', { required: 'Servings is required' })}
              className="w-full p-2 mt-8 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
            />
            {errors.servings && <p className="text-red-500 ">{errors.servings.message}</p>}
            <input
              disabled={isLoading}
              type="text"
              placeholder="Category"
              {...register('category', { required: 'Category is required' })}
              className="z-10 w-full p-2 mt-8 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
            />
            {errors.category && <p className="text-red-500 ">{errors.category.message}</p>}
            <div className="flex mt-8">
              <input
                disabled={isLoading}
                type="number"
                placeholder="Prep Time"
                {...register('prepTime.time', { required: 'Prep Time is required', min: { value: 1, message: 'Must be  greater than 0' } })}
                className="w-full p-2 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
              />
              <Controller
                name={`prepTime.unit`}
                defaultValue='min'
                control={control}
                render={() => (
                  <Select
                    defaultValue='min'
                    onValueChange={(value) => {
                      setValue(`prepTime.unit`, value);
                    }}
                  >
                    <SelectTrigger className=" text-xs md:text-sm w-[100px] ml-2">
                      <SelectValue placeholder="min" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="min">Min</SelectItem>
                        <SelectItem value="hour">Hour</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>)}
              />
            </div>
            {errors.prepTime && <p className="text-red-500 ">{errors.prepTime.time.message}</p>}

            <div className="flex mt-8">
              <input
                disabled={isLoading}
                type="number"
                placeholder="Cook Time"
                {...register('cookTime.time', { required: 'Cook Time is required', min: { value: 1, message: 'Must be  greater than 0' } })}
                className="w-full p-2 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
              />
              <Controller
                name={`cookTime.unit`}
                defaultValue='min'
                control={control}
                render={() => (
                  <Select
                    defaultValue='min'
                    onValueChange={(value) => {
                      setValue(`cookTime.unit`, value);
                    }}
                  >
                    <SelectTrigger className=" text-xs md:text-sm w-[100px] ml-2">
                      <SelectValue placeholder="min" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="min">Min</SelectItem>
                        <SelectItem value="hour">Hour</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>)}
              />
            </div>

            {errors.cookTime && <p className="text-red-500 ">{errors.cookTime.time.message}</p>}

          </div>

          <div className="flex flex-col justify-around w-full text-sm md:pl-4 ">
            <div className="mb-4">
              <h2 className="mb-2 font-semibold text-red-400 md:text-lg">Ingredients</h2>
              <div className="p-2 overflow-y-scroll border rounded-lg max-h-60 custom-scrollbar">
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className="flex items-center mb-2">
                    <input
                      disabled={isLoading}
                      type="text"
                      placeholder="Name"
                      {...register(`ingredients.${index}.name`, { required: 'Name is required' })}
                      className="w-1/2 p-2 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
                    />
                    <input
                      disabled={isLoading}
                      type="number"
                      placeholder="Quantity"
                      {...register(`ingredients.${index}.quantity`, { required: 'Quantity is required', min: { value: 1, message: 'Must be  greater than 0' } })}
                      className="w-1/2 p-2 ml-2 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
                    />
                    <Controller
                      name={`ingredients.${index}.unit`}
                      defaultValue='g'
                      control={control}
                      render={() => (
                        <Select
                          defaultValue='g'
                          onValueChange={(value) => {
                            setValue(`ingredients.${index}.unit`, value);
                          }}
                        >
                          <SelectTrigger className=" w-[150px] z-10 text-xs md:text-sm md:w-[250px] ml-2">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
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
                  className="p-2 mt-2 text-xs text-white bg-red-400 rounded-lg"
                  onClick={() => addIngredient({ name: '', quantity: '' })}
                >
                  Add Ingredient
                </button>
              </div>
              {errors.ingredients && <p className="mt-2 text-red-500">All fields required and quant greater than 0</p>}
            </div>

            <div>
              <h2 className="mb-2 font-semibold text-red-400 md:text-lg">Steps</h2>
              <div className="p-2 overflow-y-scroll border rounded-lg max-h-40 custom-scrollbar">
                {stepFields.map((field, index) => (
                  <div key={field.id} className="flex items-center mb-2">
                    <textarea
                      disabled={isLoading}
                      placeholder="Step Description"
                      {...register(`steps.${index}.description`, { required: 'Step description is required' })}
                      className="w-full p-2 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
                      rows="2"
                    />
                    {stepFields.length > 1 && (
                      <button
                        type="button"
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
                  className="p-2 mt-2 text-xs text-white bg-red-400 rounded-lg"
                  onClick={() => addStep({ description: '' })}
                >
                  Add Step
                </button>
              </div>
              {errors.steps && <p className="mt-2 text-red-500">Each step must have a description.</p>}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center w-full gap-4 p-2 mt-6 text-white bg-red-400 rounded-lg"
        >
          <span>
            Add Recipe
          </span>
          {isLoading && <ImSpinner8 className='spinner-rotate' />}
        </button>
      </form>
    </div>
  );
}

export default AddRecipe;


