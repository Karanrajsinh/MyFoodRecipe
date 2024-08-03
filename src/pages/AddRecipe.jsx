import { useUserAuth } from '@/context/UserAuth';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { MdCancel } from "react-icons/md";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from '@/components/ui/select'
import { addRecipe } from '@/utils/firebase';



function AddRecipe() {
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
    addRecipe(uid, formatedData, name)
  }

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl p-8 bg-white border rounded-lg shadow-lg border-slate-300">
        <h1 className="mb-6 text-2xl font-bold text-red-400">Add Recipe</h1>
        <div className="flex justify-between mb-6">
          <div className="flex flex-col w-[4/10] pr-4 mt-10 ">
            <input
              type="text"
              placeholder="Title"
              {...register('title', { required: 'Title is required' })}
              className="w-full p-2 mb-1 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
            />
            {errors.title && <p className="text-red-500 ">{errors.title.message}</p>}

            <input
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
              type="number"
              placeholder="Servings"
              {...register('servings', { required: 'Servings is required' })}
              className="w-full p-2 mt-8 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
            />
            {errors.servings && <p className="text-red-500 ">{errors.servings.message}</p>}

            <div className="flex mt-8">
              <input
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
                    <SelectTrigger className="w-[100px] ml-2">
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
                    <SelectTrigger className="w-[100px] ml-2">
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

            <input
              type="text"
              placeholder="Category"
              {...register('category', { required: 'Category is required' })}
              className="w-full p-2 mt-8 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
            />
            {errors.category && <p className="text-red-500 ">{errors.category.message}</p>}
          </div>

          <div className="flex flex-col justify-around w-2/3 pl-4 ">
            <div className="mb-4">
              <h2 className="mb-2 text-lg font-semibold text-red-400">Ingredients</h2>
              <div className="p-2 overflow-y-scroll border rounded-lg max-h-60 custom-scrollbar">
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className="flex items-center mb-2">
                    <input
                      type="text"
                      placeholder="Name"
                      {...register(`ingredients.${index}.name`, { required: 'Name is required' })}
                      className="w-1/2 p-2 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
                    />
                    <input
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
                          <SelectTrigger className="w-[250px] ml-2">
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
                        className="ml-2 text-red-500"
                        onClick={() => removeIngredient(index)}
                      >
                        <MdCancel />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="p-2 mt-2 text-white bg-red-400 rounded-lg"
                  onClick={() => addIngredient({ name: '', quantity: '' })}
                >
                  Add Ingredient
                </button>
              </div>
              {errors.ingredients && <p className="mt-2 text-red-500">All fields required and quant greater than 0</p>}
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-red-400">Steps</h2>
              <div className="p-2 overflow-y-scroll border rounded-lg max-h-40 custom-scrollbar">
                {stepFields.map((field, index) => (
                  <div key={field.id} className="flex items-center mb-2">
                    <textarea
                      placeholder="Step Description"
                      {...register(`steps.${index}.description`, { required: 'Step description is required' })}
                      className="w-full p-2 border border-gray-400 rounded-lg focus:border-red-400 focus:outline-none"
                      rows="2"
                    />
                    {stepFields.length > 1 && (
                      <button
                        type="button"
                        className="ml-2 text-red-500"
                        onClick={() => removeStep(index)}
                      >
                        <MdCancel />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="p-2 mt-2 text-white bg-red-400 rounded-lg"
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
          className="w-full p-2 text-white bg-red-400 rounded-lg"
        >
          Add Recipe
        </button>
      </form>
    </div>
  );
}

export default AddRecipe;


