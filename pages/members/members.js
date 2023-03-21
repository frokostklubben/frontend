import { API_URL,FETCH_NO_API_ERROR } from "../../settings.js"
import { sanitizeStringWithTableRows, handleHttpErrors } from "../../utils.js"

const URL = API_URL + "/members"

const errStatus = document.getElementById("error")

export function initMembers() {
  document.getElementById("tbl-body").onclick = showDetails
  getAllMembers()
}

async function getAllMembers() {
  try {
    document.getElementById("spinner").style.display = "block"
    const usersFromServer = await fetch(URL).then(handleHttpErrors)
    document.getElementById("spinner").style.display = "none"
    showAllData(usersFromServer)
  }
  catch (err) {
    if (err.apiError) {
      errStatus.innerText = err.apiError.message
    } else {
      errStatus.innerText = err.message + FETCH_NO_API_ERROR
      console.error(err.message + FETCH_NO_API_ERROR)
    }
  }
}

function showAllData(data) {
  const tableRowsArray = data.map(member => `
  <tr>                                
    <td>${member.username}</td>                               
    <td>${member.email} </td>  
    <td>${member.firstName} ${member.lastName} </td>
    <td>${member.ranking}</td>
    <td><button data-member=${encodeURI(JSON.stringify(member))} id="${member.id}-member-id" class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#member-details-modal">Details</button> </td>      
  </tr>`
  )

  const tableRowsString = tableRowsArray.join("\n")
  document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowsString)
}

function showDetails(evt) {
  const btn = evt.target;
  if (!btn.id.includes("-member-id")) {
    return
  }
  const memberAsJson = decodeURI(btn.dataset.member)
  const mem = JSON.parse(memberAsJson)

  const headerText = `Details for ${mem.username} (${mem.firstName} ${mem.lastName})`
  document.getElementById("modal-title").innerText = headerText
  document.getElementById("user-name").innerText = mem.username
  document.getElementById("email").innerText = mem.email
  document.getElementById("first-name").innerText = mem.firstName
  document.getElementById("last-name").innerText = mem.lastName
  document.getElementById("street").innerText = mem.street
  document.getElementById("city").innerText = mem.city
  document.getElementById("zip").innerText = mem.zip
  document.getElementById("created").innerText = mem.created
  document.getElementById("edited").innerText = mem.edited
  document.getElementById("ranking").innerText = mem.ranking
}

