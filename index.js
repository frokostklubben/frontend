//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./navigo_EditedByLars.js"; //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js"  //Will create the global Navigo object used below

import {
  setActiveLink,
  adjustForMissingHash,
  renderTemplate,
  loadHtml,
} from "./utils.js";

import { initReservation } from "./pages/reservation/reserve.js";
import { initMembers } from "./pages/members/members.js";
import { initCars } from "./pages/cars/cars.js";
import { initAddCar } from "./pages/addCar/addCar.js";
import { initLogin } from "./pages/login/login.js";
import { initSignup } from "./pages/signup/signup.js";
import { initAccountSettings } from "./pages/accountSettings/accountSettings.js";
import { initListReservationsAll } from "./pages/showReservations/reservations.js";

window.addEventListener("load", async () => {
  const templateCars = await loadHtml("./pages/cars/cars.html");
  const templateMembers = await loadHtml("./pages/members/members.html");
  const templateAddCar = await loadHtml("./pages/addCar/addCar.html");
  const templateSignup = await loadHtml("./pages/signup/signup.html");
  const templateLogin = await loadHtml("./pages/login/login.html");
  const templateAccountSettings = await loadHtml(
    "./pages/accountSettings/accountSettings.html"
  );
  const templateReserve = await loadHtml("./pages/reservation/reserve.html");
  const templateReservations = await loadHtml(
    "./pages/showReservations/reservations.html"
  );
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html");

  adjustForMissingHash();

  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router;

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url);
        done();
      },
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () =>
        (document.getElementById("content").innerHTML = `
        <h2>Home</h2>
        <img style="width:50%;max-width:600px;margin-top:1em;" src="./images/" alt="Picture here">
        <p style='margin-top:1em;font-size: 1.5em;color:darkgray;'>
          Recipe app under construction <span style='font-size:2em;'></span>
        </p>
     `),
      "/cars": () => {
        //(templateCars, "content");
        //initCars();
      },
      "/account-settings": (match) => {
        renderTemplate(templateAccountSettings, "content");
        initAccountSettings(match);
      },
      "/add-car": (match) => {
        // renderTemplate(templateAddCar, "content");
        // initAddCar();
      },
      "/members": () => {
        // renderTemplate(templateMembers, "content");
        // initMembers();
      },
      "/reserve-car": () => {
        // renderTemplate(templateReserve, "content");
        // initReservation();
      },
      "/reservations": () => {
        // renderTemplate(templateReservations, "content");
        // initListReservationsAll();
      },
      "/signup": () => {
        renderTemplate(templateSignup, "content");
        initSignup();
      },
      "/login": (match) => {
        // renderTemplate(templateLogin, "content");
        //initLogin();
      },
    })
    .notFound(() => {
      renderTemplate(templateNotFound, "content");
    })
    .resolve();
});

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert(
    "Error: " +
      errorMsg +
      " Script: " +
      url +
      " Line: " +
      lineNumber +
      " Column: " +
      column +
      " StackTrace: " +
      errorObj
  );
};
