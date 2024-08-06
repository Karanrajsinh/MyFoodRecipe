import Recipe from "./Recipe"

function RecipesList({ recipes }) {
    return (
        <div className="flex flex-col gap-5 md:gap-7">
            {recipes.map((recipe) => (
                <Recipe
                    key={recipe.id}
                    recipe={recipe}
                />
            ))}
        </div>
    )
}

export default RecipesList
