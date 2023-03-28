import { API_URL } from "../../settings.js"
import { makeOptions, handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js"

const URL = API_URL + '/recipe'

export function initRecipes () {
    loadRecipes()
}
    
export async function loadRecipes() {

    const options = makeOptions("GET",null,true)

    try{
        const recipe = await fetch(URL,options).then(handleHttpErrors)
    
        const usedIngredientNames = recipe.usedIngredientNames.map(name => `
            <li>${name}</li>
        `).join("")

        const missedIngredientNames = recipe.missedIngredientNames.map(name => `
            <li>${name}</li>
        `).join("")

        const recipeSteps = recipe.steps.map(recipeStep => `
            <li>${recipeStep}</li>
        `).join("")

        document.getElementById("recipe-title").innerText = recipe.title

        document.getElementById("recipe-image").src = recipe.image;

        document.getElementById("recipe-ingredients-used").innerHTML = sanitizeStringWithTableRows(usedIngredientNames);

        document.getElementById("recipe-ingredients-missed").innerHTML = sanitizeStringWithTableRows(missedIngredientNames);

        document.getElementById("recipe-steps").innerHTML = sanitizeStringWithTableRows(recipeSteps);
    }
    catch (err){
        console.log(err)
    }

}