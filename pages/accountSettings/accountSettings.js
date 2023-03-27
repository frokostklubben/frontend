import { handleHttpErrors, makeOptions, encode } from "../../utils.js";
import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js";

//Add id to this URL to get a single user
const URL = `${API_URL}/members`;

//Store reference to commonly used nodes
let usernameLoggedIn;
let emailInput;
let firstNameInput;

export async function initAccountSettings(match) {
  usernameLoggedIn = localStorage.getItem("user");

  // Når man trykker på drop-down menu, er det her man skal fetche medlemmet?
  const loggedInMember = (document.getElementById("navbarDropdown").onclick =
    fetchMember);
  console.log(loggedInMember);

  try {
    const username = await fetchMember();
    console.log(username);
    // Show the member logged in
    document.getElementById("username").value = usernameLoggedIn;

    // Ændre til det medlemmet som er logget ind
    document.getElementById("email").value = username.email;
    document.getElementById("firstName").value = username.firstName;
  } catch (err) {
    console.log(err.message);
  }

  document.getElementById("btn-submit-edited-member").onclick =
    submitEditedMember;

  document.getElementById("btn-delete-member").onclick = deleteMember;

  //.setInfoText("");
}

async function deleteMember() {
  try {
    const memberToDelete = document.getElementById("username").value;
    if (memberToDelete === "") {
      setStatusMsg("No member found to delete", true);
      return;
    }
    const options = makeOptions("DELETE", null, true);

    await fetch(URL + "/" + memberToDelete, options);
    setStatusMsg("Member succesfully deleted", false);
    clearInputFields();
  } catch (err) {
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true);
    } else {
      setStatusMsg(err.message + FETCH_NO_API_ERROR);
      console.log(err.message + FETCH_NO_API_ERROR);
    }
  }
}

async function fetchMember() {
  const options = makeOptions("GET", null, true);

  setStatusMsg("", false);
  try {
    // Nu henter den alle medlemmer!!! Selv om det endpoint ikke findes
    const member = await fetch(URL, options).then(handleHttpErrors);
    renderMember(member);

    setInfoText("Edit values and press 'Submit changes' or delete if needed");
    // return member;
  } catch (err) {
    setStatusMsg(err.message, true);
  }
}

/**
 * Set's the status message, either styled as an error, or as a normal message
 * @param {String} msg The status message to display
 * @param {boolean} [isError] true, to style in red
 */
function setStatusMsg(msg, isError) {
  const color = isError ? "red" : "darkgreen";
  const statusNode = document.getElementById("status");
  statusNode.style.color = color;
  statusNode.innerText = msg;
}

function setInfoText(txt) {
  document.getElementById("info-text").innerText = txt;
}

function renderMember(member) {
  usernameLoggedIn = localStorage.getItem("user");
  emailInput.value = member.email;
  firstNameInput.value = member.firstName;
}

async function submitEditedMember() {
  try {
    const member = {};
    member.username = localStorage.getItem("user");
    member.email = emailInput.value;
    member.firstName = firstNameInput.value;

    if (
      member.username === "" ||
      member.email === "" ||
      member.firstName == ""
    ) {
      setStatusMsg(`Missing fields required for a submit`, false);
      return;
    }

    // Make ready for token:
    //const optionsWithToken = makeOptions("PUT", body, true)
    const options = {};
    options.method = "PUT";
    options.headers = { "Content-type": "application/json" };
    options.body = JSON.stringify(member);

    const newMember = await fetch(URL, options).then(handleHttpErrors);
    clearInputFields();
    setStatusMsg(
      `Member with username '${member.username}' was successfully edited`
    );
  } catch (err) {
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true);
    } else {
      console.log(err.message + FETCH_NO_API_ERROR);
    }
  }
}

function clearInputFields() {
  document.getElementById("username").value = "";
  emailInput.value = "";
  firstNameInput.value = "";
}
