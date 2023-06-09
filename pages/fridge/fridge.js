import { API_URL } from "../../settings.js"
import { makeOptions, handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js"

const URL = API_URL + '/fridge'
let fridgeId = 0

makeOptions
export function initfridge () {
document.querySelector("#more-btn").onclick = newRow
document.querySelector("#add-items-btn").onclick = saveItems
loadFridge()
}

export async function loadFridge() {

    document.querySelector("#table-rows").innerHTML = ""

    const options = makeOptions("GET",null,true)
    try{
    const fridge = await fetch(URL,options).then(handleHttpErrors)
    const tablerows = fridge.ingredients.map(fooditem => `   
    <tr id="delete-${fooditem.id}">
        <td class="stored-item removeable" id="${fooditem.id}">${fooditem.name}</td>
        <td>
        <button class="removeable btn btn-delete"  id="btn-${fooditem.id}"> Remove </button> 
        </td>
    </tr>    
    `).join("")

    if (fridgeId !== undefined){
        fridgeId = fridge.id
    }
    
    document.querySelector("#table-rows").innerHTML = sanitizeStringWithTableRows(tablerows)
    const buttons = document.querySelectorAll(".btn-delete")    
    buttons.forEach(button => button.onclick = deleteFoodItem)
    } catch(err){
        console.log(err)
    }
    }

    async function deleteFoodItem(evt){    
    const id = evt.target.id.slice(4); // remove the 'btn-' prefix from the button ID
    const options = makeOptions("DELETE",null,true)
    try{
        const deleteitem = await fetch(URL+`/ingredient/`+id,options).then(handleHttpErrors)
    } catch (err){
        console.log(err)
    }
    document.getElementById(`delete-${id}`).remove()

    }

    async function newRow () {
    const lastElement = document.querySelector('#end-of-form');
    const inputSection = document.querySelector('.template');
    
    //make a label 
    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', 'food-item');
    newLabel.setAttribute('class', 'removeable');
    newLabel.textContent = 'Food item :';
    inputSection.insertBefore(newLabel, lastElement);
    //new food item
    const newInput = document.createElement('input');
    newInput.setAttribute('class', 'food-item removeable');
    newInput.setAttribute('id', '0');
    inputSection.insertBefore(newInput, lastElement);
    //new line
    const lineBreak = document.createElement('br');
    lineBreak.setAttribute('class', 'removeable');
    inputSection.insertBefore(lineBreak, lastElement);
    }

    async function saveItems(){
        
        const inputFields = document.querySelectorAll('.food-item');
        const storedItems = document.querySelectorAll('.stored-item')

        //make an array of the food items
        const ingredientsArray = [];
        inputFields.forEach((field) => {
            // check if field has a non-empty value
            if (field.value.trim() !== "") {  
              ingredientsArray.push(field.value.trim());
            }
          });


        //make fridge body
          const fridge = {};
          fridge.id = fridgeId;
          fridge.ingredients = [];
          
          ingredientsArray.forEach(ingredient => {
            const obj = {};
            obj["name"] = ingredient;
            fridge.ingredients.push(obj);
          });


          storedItems.forEach(ingredient => {
            const obj = {};
            obj["id"] = ingredient.id;
            obj["name"] = ingredient.innerHTML;
            fridge.ingredients.push(obj);
          });

          //create new fridge
        if(fridgeId ===  0 ){
            try{
            const options = makeOptions("POST",fridge,true)
            const update = await fetch(URL,options).then(handleHttpErrors)
            } catch(err){
                console.log(err)
            }
        } else { //update fridge
                try{
                const options = makeOptions("PUT",fridge,true)
                const update = await fetch(URL+`/${fridgeId}`,options).then(handleHttpErrors)
                } catch(err){
                    console.log(err)
                }
            
        }

        //remove and clean the created fields
            const removableFields = document.querySelectorAll('.removeable');
            removableFields.forEach(field => {
              field.remove();
            });
          document.querySelector(".food-item").value = ''
        //now lets reload the fridge
         await loadFridge()
    }

