import { API_URL, FETCH_NO_API_ERROR } from "../../settings.js";
import { handleHttpErrors } from "../../utils.js";

const URL = API_URL + "/members";

let inputUsername;
let inputEmail;
let inputPassword;
let inputFirstName;

export function initSignup() {
  //Initialize nodes used more than once
  inputUsername = document.getElementById("input-username");
  inputEmail = document.getElementById("input-email");
  inputPassword = document.getElementById("input-password");
  inputFirstName = document.getElementById("input-firstname");

  document.getElementById("form").onsubmit = saveMember;
  document.getElementById("goto-login").onclick = () => {
    document.getElementById("goto-login").style.display = "none";
  };
  clearInputFields();
  setStatusMsg("");
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

function clearInputFields() {
  inputUsername.value = "";
  inputEmail.value = "";
  inputPassword.value = "";
  inputFirstName.value = "";
}

async function saveMember(evt) {
  evt.preventDefault();
  setStatusMsg("");
  //Create the DTO object that must be sent with the body in the POST Request
  const memberRequest = {};
  memberRequest.username = inputUsername.value;
  memberRequest.email = inputEmail.value;
  memberRequest.password = inputPassword.value;
  memberRequest.firstName = inputFirstName.value;

  const postOptions = {};
  postOptions.method = "POST";
  postOptions.headers = { "Content-type": "application/json" };

  postOptions.body = JSON.stringify(memberRequest);
  try {
    const newMember = await fetch(URL, postOptions).then(handleHttpErrors);
    clearInputFields();
    console.log("Kommer vi hit?");
    setStatusMsg(`Successfully created member "${newMember.username}"`);
    //document.getElementById("goto-login").style.display = "block";
  } catch (err) {
    setStatusMsg(err.message + FETCH_NO_API_ERROR, true);
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true);
    }
  }
}
