//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./navigo_EditedByLars.js"; //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js"  //Will create the global Navigo object used below

import {
  setActiveLink,
  adjustForMissingHash,
  renderTemplate,
  loadHtml,
} from "./utils.js";

import { initLogin, logout } from "./pages/login/login.js";
import { initSignup } from "./pages/signup/signup.js";
import { initAccountSettings } from "./pages/accountSettings/accountSettings.js";
import { initfridge } from "./pages/fridge/fridge.js";
import { initRecipes } from "./pages/recipes/recipes.js";

window.addEventListener("load", async () => {
  const templateSignup = await loadHtml("./pages/signup/signup.html");
  const templateLogin = await loadHtml("./pages/login/login.html");
  const templateAccountSettings = await loadHtml(
    "./pages/accountSettings/accountSettings.html"
  );
  const templateFridge = await loadHtml("./pages/fridge/fridge.html");
  const templateRecipes = await loadHtml("./pages/recipes/recipes.html");
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
        <div class="container">
        <div class="row justify-content-center align-items-center">
          <div class="col-lg-6 col-md-8 order-lg-1 order-md-2">
            <h2 class="mt-5">Cook with what you have, and love what you make!</h2>
            <p class="lead">
              Welcome to The Food Recipe App (FRAPP), where you can easily discover new recipes based on the ingredients you have on hand! Our app is designed to help you create delicious meals without the hassle of searching through countless recipes and grocery store aisles.
            </p>
            <p>
              Simply sign up and input the ingredients you have on hand, and we'll suggest the most popular recipe based on the ingredients.
            </p>
            <p>
              Our app is perfect for busy people who want to cook healthy meals without the stress of meal planning. Whether you're a beginner or an experienced cook, our app is easy to use and will help you create delicious, nutritious meals in no time.
            </p>
            <p class="lead">
              Thank you for choosing FRAPP. We can't wait to see what delicious creations you come up with!
            </p>
          </div>
          <div class="col-lg-6 col-md-8 order-lg-2 order-md-1">
      <img class="img-fluid my-4" src="./images/vegetables.jpg" alt="Picture of vegetables by Dennis Klein" <a href="https://stocksnap.io/photo/ingredients-food-H500S57QYI">Photo</a> by <a href="https://stocksnap.io/author/47948">Dennis Klein</a> on <a href="https://stocksnap.io">StockSnap</a>
    </div>
  </div>
</div>
        `),

      /* `
        <h2>Cook with what you have, and love what you make!</h2>
        <img style="width:50%;max-width:600px;margin-top:1em;" src="./images/" alt="">
        <p style='margin-top:1em;font-size: 1.5em;color:darkgray;'>
        Welcome to The Food Recipe App (FRAPP), where you can easily discover new recipes based on the ingredients you have on hand! Our app is designed to help you create delicious meals without the hassle of searching through countless recipes and grocery store aisles.

        Simply sign up and input the ingredients you have on hand, and we'll suggest the most popular recipe based on the ingredients. 
        
        Our app is perfect for busy people who want to cook healthy meals without the stress of meal planning. Whether you're a beginner or an experienced cook, our app is easy to use and will help you create delicious, nutritious meals in no time.
             
        Thank you for choosing FRAPP. We can't wait to see what delicious creations you come up with! <span style='font-size:2em;'></span>
        </p>
     ` */
      "/account-settings": (match) => {
        renderTemplate(templateAccountSettings, "content");
        initAccountSettings(match);
      },
      "/signup": () => {
        renderTemplate(templateSignup, "content");
        initSignup();
      },
      "/fridge": (match) => {
        renderTemplate(templateFridge, "content");
        initfridge();
      },
      "/recipes": (match) => {
        renderTemplate(templateRecipes, "content");
        initRecipes();
      },
      "/login": (match) => {
        renderTemplate(templateLogin, "content");
        initLogin();
      },
      "/logout": () => {
        logout();
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
