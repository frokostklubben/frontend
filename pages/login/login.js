import { API_URL } from "../../settings.js";
import {
  encode,
  handleHttpErrors,
  makeOptions,
  setStatusMsg,
} from "../../utils.js";
import { loadFridge } from "../fridge/fridge.js";

const URL = API_URL + "/auth/login";

export function initLogin() {
  document.querySelector("#login-btn").onclick = login;
  displayLoginStatus();
}

export function logout() {
  localStorage.clear();
  displayLoginStatus();
  window.router.navigate("");
}

async function login() {
  document.querySelector("#status").innerText = "";
  localStorage.clear();

  const username = encode(document.querySelector("#username").value);
  const password = encode(document.querySelector("#password").value);
  const userDto = { username, password };

  const options = makeOptions("POST", userDto, false);

  try {
    const response = await fetch(URL, options).then(handleHttpErrors);
    localStorage.setItem("user", response.username);
    localStorage.setItem("token", response.token);
    localStorage.setItem("roles", response.roles);

    displayLoginStatus();
    window.router.navigate("");
  } catch (err) {
    setStatusMsg("Login failed", true);
  }
}

function toggleMenu() {
  const dropdown = document.getElementById("navbarDropdown");

  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

function displayLoginStatus() {
  const username = localStorage.getItem("user");
  const dropdown = document.getElementById("navbarDropdown");

  // document.getElementById("span-id").removeEventListener("click", toggleMenu);

  if (username) {
    document.getElementById("span-id").textContent = username;
    document.getElementById("login-name").style.display = "block";
    document.getElementById("login-id").style.display = "none";
    document.getElementById("navbarDropdown").style.display = "block";
    document.getElementById("signup-link").style.display = "none";

    // Show dropdown on click
    dropdown.style.display = "none";
    document.getElementById("span-id").addEventListener("click", toggleMenu);
  } else {
    // Hide dropdown on click
    dropdown.style.display = "none";
    document.getElementById("span-id").removeEventListener("click", toggleMenu);
    document.getElementById("navbarDropdown").style.display = "none";
    document.getElementById("login-id").style.display = "block";
    document.getElementById("login-name").style.display = "none";
    document.getElementById("signup-link").style.display = "block";
  }
}
