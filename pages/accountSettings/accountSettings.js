import { handleHttpErrors, makeOptions, encode } from "../../utils.js";
import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js";

//Add id to this URL to get a single user
const URL = `${API_URL}/members`;

//Store reference to commonly used nodes
let usernameInput;
let emailInput;
let firstNameInput;

export async function initAccountSettings(match) {
  document.getElementById("spinner").style.display = "none";
  document.getElementById("btn-fetch-member").onclick =
    getUsernameFromInputField;
  document.getElementById("btn-submit-edited-member").onclick =
    submitEditedMember;
  document.getElementById("btn-delete-member").onclick = deleteMember;
  // Is this the strategy to use encode to avoid xxx?
  //usernameInput = encode(document.getElementById("username"));
  usernameInput = document.getElementById("username");
  emailInput = document.getElementById("email");
  firstNameInput = document.getElementById("first-name");

  setInfoText("");
  //Check if username is provided as a Query parameter
  if (match?.params?.username) {
    const username = match.params.username;
    try {
      fetchMember(username);
    } catch (err) {
      setStatusMsg("Could not find member: " + username, true);
    }
  } else {
    clearInputFields();
  }
}

async function deleteMember() {
  try {
    const memberToDelete = document.getElementById("username").value;
    if (memberToDelete === "") {
      setStatusMsg("No member found to delete", true);
      return;
    }
    const options = makeOptions("DELETE", null, false);

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

function getUsernameFromInputField() {
  const username = document.getElementById("username-search").value;
  if (!username) {
    setStatusMsg("Please provide a username", true);
    return;
  }
  fetchMember(username);
}

async function fetchMember(username) {
  // Make ready for token from logged in member:
  //const options = makeOptions("GET", null, true)

  setStatusMsg("", false);
  try {
    document.getElementById("spinner").style.display = "block";
    const member = await fetch(URL + "/" + username).then(handleHttpErrors);
    document.getElementById("spinner").style.display = "none";
    renderMember(member);
    setInfoText("Edit values and press 'Submit changes' or delete if needed");
  } catch (err) {
    document.getElementById("spinner").style.display = "none";
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
  usernameInput.value = member.username;
  emailInput.value = member.email;
  firstNameInput.value = member.firstName;
}

//TODO: Change when login is implemented
async function submitEditedMember(evt) {
  evt.preventDefault();
  try {
    const member = {};
    member.username = usernameInput.value;
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

    const PUT_URL = URL + "/" + member.username;
    const newMember = await fetch(PUT_URL, options).then(handleHttpErrors);
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
  usernameInput.value = "";
  emailInput.value = "";
  firstNameInput.value = "";
}
