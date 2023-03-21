import { handleHttpErrors } from "../../utils.js"
import { API_URL,FETCH_NO_API_ERROR } from "../../settings.js"

//Add id to this URL to get a single user
const URL = `${API_URL}/cars`

export async function initAddCar(match) {
  document.getElementById("form").onsubmit = submitCar
  clearInputFields()
}

/**
 * Set's the status message, either styled as an error, or as a normal message
 * @param {String} msg The status message to display
 * @param {boolean} [isError] true, to style in red
 */
function setStatusMsg(msg, isError) {
  const color = isError ? "red" : "darkgreen"
  const statusNode = document.getElementById("status")
  statusNode.style.color = color
  statusNode.innerText = msg
}


async function submitCar(evt) {
  evt.preventDefault()

  try {
    const car = {}
    car.brand = document.getElementById("brand").value
    car.model = document.getElementById("model").value
    car.pricePrDay = document.getElementById("price-pr-day").value
    car.bestDiscount = document.getElementById("best-discount").value

    if (car.brand === "" || car.model === "" || car.pricePrDay == "") {
      setStatusMsg(`Missing fields required for a submit`, true)
      return
    }

    const options = {}
    options.method = "POST"
    options.headers = { "Content-type": "application/json" }
    options.body = JSON.stringify(car)

    const newCar = await fetch(URL, options).then(handleHttpErrors)
    clearInputFields()
    setStatusMsg(`${newCar.brand}, ${newCar.model} with id '${newCar.id}' was successfully added`)

  } catch (err) {

    if (err.apiError) {
      setStatusMsg(err.apiError.message, true)
    } else {
      setStatusMsg(err.message + FETCH_NO_API_ERROR, true)
      console.error(err.message + FETCH_NO_API_ERROR)
    }
  }
}

function clearInputFields() {
  document.getElementById("brand").value = "";
  document.getElementById("model").value = "";
  document.getElementById("price-pr-day").value = "";
  document.getElementById("best-discount").value = "";
}