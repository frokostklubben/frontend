import { handleHttpErrors, makeOptions, encode } from "../../utils.js";
import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js";
import { displayLoginStatus } from "../login/login.js";

//Add id to this URL to get a single user
const URL = `${API_URL}/members`;

//Store reference to commonly used nodes
let usernameLoggedIn;

export async function initAccountSettings(match) {
  usernameLoggedIn = localStorage.getItem("user");

  // Når man trykker på drop-down menu, er det her man skal fetche medlemmet?
  const loggedInMember = (document.getElementById("edit-account").onclick =
    fetchMember);

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

    await fetch(URL, options);
    setStatusMsg("Member succesfully deleted", false);
    localStorage.clear();
    displayLoginStatus();
    window.router.navigate("");

    //clearInputFields();
    
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
    const member = await fetch(URL, options).then(handleHttpErrors);
    document.getElementById("username").value = localStorage.getItem("user");
    document.getElementById("email").value = member.email;
    document.getElementById("first-name").value = member.firstName;

    return member;
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

async function submitEditedMember() {
  let emailInput = document.getElementById("email").value;
  let firstNameInput = document.getElementById("first-name").value;
  document.getElementById("username").value = localStorage.getItem("user");

  try {
    const member = {};
    member.username = localStorage.getItem("user");
    member.email = emailInput;
    member.firstName = firstNameInput;

    if (
      member.username === "" ||
      member.email === "" ||
      member.firstName == ""
    ) {
      setStatusMsg(`Missing fields required for a submit`, false);
      return;
    }

    console.log(member);

    const options = makeOptions("PUT", member, true);
    const newMember = await fetch(URL, options).then(handleHttpErrors);
    console.log(newMember);

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
   //document.getElementById("username").value = "";
   //emailInput.value = "";
   //firstNameInput.value = "";
}
