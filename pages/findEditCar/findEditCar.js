import { handleHttpErrors } from "../../utils.js"
import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js"

//Add id to this URL to get a single user
const URL = `${API_URL}/cars`

//Store reference to commonly used nodes
let carIdInput
let carInputBrand
let carInputModel
let carInputPricePrDay
let carInputDiscount

export async function initFindEditCar(match) {

  document.getElementById("spinner").style.display = "none"
  document.getElementById("btn-fetch-car").onclick = getCarIdFromInputField
  document.getElementById("btn-submit-edited-car").onclick = submitEditedCar
  document.getElementById("btn-delete-car").onclick = deleteCar;
  carIdInput = document.getElementById("car-id")
  carInputBrand = document.getElementById("brand")
  carInputModel = document.getElementById("model")
  carInputPricePrDay = document.getElementById("price-pr-day")
  carInputDiscount = document.getElementById("best-discount")

  setInfoText("");
  //Check if id is provided as a Query parameter
  if (match?.params?.id) {
    const id = match.params.id
    try {
      fetchCar(id)
    } catch (err) {
      setStatusMsg("Could not find car: " + id, true)
    }
  } else {
    clearInputFields()
  }
}

/**
 * Delete the car, with the given ID
 */
async function deleteCar() {
  try {
    const idForCarToDelete = document.getElementById("car-id").value
    if (idForCarToDelete === "") {
      setStatusMsg("No car found to delete", true)
      return
    }
    const options = {}
    options.method = "DELETE"
    await fetch(URL + "/" + idForCarToDelete, options)
    setStatusMsg("Car succesfully deleted", false)
    clearInputFields()
  }
  catch (err) {
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true)
    }
    else {
      setStatusMsg(err.message + FETCH_NO_API_ERROR)
      console.log(err.message + FETCH_NO_API_ERROR)
    }
  }
}

function getCarIdFromInputField() {
  const id = document.getElementById("car-id-input").value
  if (!id) {
    setStatusMsg("Please provide an id", true)
    return
  }
  fetchCar(id)
}

async function fetchCar(id) {
  setStatusMsg("", false)
  try {
    document.getElementById("spinner").style.display = "block"
    const URL_FOR_ADMIN = URL + "/admin"
    const car = await fetch(URL_FOR_ADMIN + "/" + id).then(handleHttpErrors)
    document.getElementById("spinner").style.display = "none"
    renderCar(car)
    setInfoText("Edit values and press 'Submit changes' or delete if needed")
  } catch (err) {
    document.getElementById("spinner").style.display = "none"
       setStatusMsg(err.message, true)
    }
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

function setInfoText(txt) {
  document.getElementById("info-text").innerText = txt
}

function renderCar(car) {
  carIdInput.value = car.id;
  carInputBrand.value = car.brand;
  carInputModel.value = car.model;
  carInputPricePrDay.value = car.pricePrDay
  carInputDiscount.value = car.bestDiscount
}


async function submitEditedCar(evt) {
  evt.preventDefault()
  try {
    const car = {}
    car.id = carIdInput.value
    car.brand = carInputBrand.value
    car.model = carInputModel.value
    car.pricePrDay = carInputPricePrDay.value
    car.bestDiscount = carInputDiscount.value

    if (car.brand === "" || car.model === "" || car.pricePrDay == "") {
      setStatusMsg(`Missing fields required for a submit`, false)
      return
    }

    const options = {}
    options.method = "PUT"
    options.headers = { "Content-type": "application/json" }
    options.body = JSON.stringify(car)


    const PUT_URL = URL + "/" + car.id
    const newCar = await fetch(PUT_URL, options).then(handleHttpErrors)
    clearInputFields()
    setStatusMsg(`Car with id '${car.id}' was successfully edited`)
  } catch (err) {
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true)
    } else {
      console.log(err.message + FETCH_NO_API_ERROR)
    }
  }
}

function clearInputFields() {
  document.getElementById("car-id-input").value = ""
  //********************* */
  carIdInput.value = "";
  carInputBrand.value = "";
  carInputModel.value = "";
  carInputPricePrDay.value = "";
  carInputDiscount.value = "";
}