import { API_URL } from "../../settings.js";
import { encode, handleHttpErrors, makeOptions, setStatusMsg} from "../../utils.js";
import { loadFridge } from "../fridge/fridge.js";


const URL = API_URL + "/auth/login"

export function initLogin() {
document.querySelector("#login-btn").onclick = login
}

async function login() {
    document.querySelector("#status").innerText = ""
    localStorage.clear()

    const username = encode(document.querySelector("#username").value)
    const password = encode(document.querySelector("#password").value)
    const userDto = {username, password}

    const options = makeOptions("POST", userDto, false)

    try {
        const response = await fetch(URL, options).then(handleHttpErrors)
        localStorage.setItem("user", response.username)
        localStorage.setItem("token", response.token)
        localStorage.setItem("roles", response.roles)

        window.router.navigate("")
    } catch (err) {
        setStatusMsg("Login failed", true)
    }

}
