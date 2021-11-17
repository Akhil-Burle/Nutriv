/* eslint-disable */
// import "@babel/polyfill";
// import { displayMap } from "./mapbox";
import { login, logout } from "./login.js";
import { signup, verify } from "./signup.js";
import { updateSettings } from "./updateSettings.js";
import { bookDish } from "./stripe.js";
import { showAlert } from "./alerts.js";
import { addNewDish } from "./dashboard.js";

// DOM ELEMENTS
// const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const verifyForm = document.querySelector(".form--verify");
const addNewDishForm = document.querySelector(".form-admin--addNewDish");
const logOutBtn = document.querySelector(".logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-dish");
// const menuBookBtn = document.querySelector(".book-now");

// DELEGATION
// if (mapBox) {
//   const locations = JSON.parse(mapBox.dataset.locations);
//   displayMap(locations);
// }

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("confirm-password").value;
    const photo = document.getElementById("photo").value;
    //   console.log(email, password, passwordConfirm, photo);
    signup(name, email, password, passwordConfirm, photo);
  });
}

if (verifyForm) {
  verifyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    verify(email, password);
  });
}

if (addNewDishForm) {
  addNewDishForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const deliveryTime = document.getElementById("deliveryTime").value;
    const summary = document.getElementById("summary").value;
    const availability = document.getElementById("availability").value;
    const type = document.getElementById("type").value;
    const foodType = document.getElementById("foodType").value;
    const chefs = document.getElementById("chefs").value;
    const imageCover = document.getElementById("imageCover").value;
    addNewDish(
      name,
      price,
      deliveryTime,
      summary,
      availability,
      type,
      foodType,
      chefs,
      imageCover
    );
  });
}

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);

    updateSettings(form, "data");
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );

    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    const { dishId } = e.target.dataset;
    bookDish(dishId);
  });

  const alertMessage = document.querySelector("body").dataset.alert;
  if (alertMessage) showAlert("success", alertMessage, 20);
}

/* if (menuBookBtn) {
  menuBookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    const { dishId } = e.target.dataset;
    bookDish(dishId);
  });

  const alertMessage = document.querySelector("body").dataset.alert;
  if (alertMessage) showAlert("success", alertMessage, 20);
}
 */
