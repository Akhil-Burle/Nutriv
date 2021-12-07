/* eslint-disable */
// import "@babel/polyfill";
// import { displayMap } from "./mapbox.js";
import { login, logout } from "./functions/login.js";
import { signup, verify } from "./functions/signup.js";
import { updateSettings, deleteAccount } from "./functions/updateSettings.js";
import { bookDish } from "./functions/stripe.js";
import { addNewReview } from "./functions/reviews.js";
import { showAlert } from "./alerts.js";
import { addNewDish } from "./functions/dashboard.js";
import { forgotPassword, resetPassword } from "./functions/password.js";

// DOM ELEMENTS
// const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const verifyForm = document.querySelector(".form--verify");
const addNewDishForm = document.querySelector(".form-admin--addNewDish");
const addNewReviewButton = document.getElementById("addNewReviewButton");
const forgotPasswordForm = document.querySelector(
  ".form-admin--forgotPassword"
);
const resetPasswordForm = document.querySelector(".form-admin--resetPassword");
const logOutBtn = document.querySelector(".logout");
const userDataForm = document.querySelector(".form-account-user-data");
const userPasswordForm = document.querySelector(".form-account-user-password");
const deleteAccountBtn = document.querySelector(".btn-account--delete-account");
const bookBtn = document.getElementById("book-dish");
// const menuBookBtn = document.querySelector(".book-now");

// DELEGATION
// if (mapBox) {
//   const availableIn = JSON.parse(mapBox.dataset.availableIn);
//   displayMap(availableIn);
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
    // const photo = document.getElementById("photo").value;
    //   console.log(email, password, passwordConfirm, photo);
    signup(name, email, password, passwordConfirm);
  });
}
if (addNewReviewButton) {
  addNewReviewButton.addEventListener("click", (event) => {
    const review = document.getElementById("review").value;
    const rating = document.getElementById("rating").value;
    event.preventDefault();
    const { dishId } = event.target.dataset;
    addNewReview(review, rating, dishId);
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

    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("price", document.getElementById("price").value);
    form.append("deliveryTime", document.getElementById("deliveryTime").value);
    form.append("summary", document.getElementById("summary").value);
    form.append("availability", document.getElementById("availability").value);
    form.append("type", document.getElementById("type").value);
    form.append("foodType", document.getElementById("foodType").value);
    form.append("chefs", document.getElementById("chefs").value);
    form.append("imageCover", document.getElementById("imageCover").files[0]);
    console.log(form);

    addNewDish(form);
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("forgotPasswordEmail").value;
    forgotPassword(email);
  });
}
if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword =
      document.getElementById("confirmNewPassword").value;
    resetPassword(newPassword, confirmNewPassword);
  });
}

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (userDataForm)
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    // form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);

    updateSettings(form, "data");
  });

if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn-account--save-password").textContent =
      "Updating...";

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );

    document.querySelector(".btn-account--save-password").textContent =
      "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const text = prompt(
      "Are you sure you want to delete your account? Please type 'DELETE ACCOUNT' to delete your account.."
    );

    if (text === "DELETE ACCOUNT") {
      deleteAccount();
    } else {
      alert("Failed to delete your account try again later!");
    }
    // console.log("hello");
    // deleteAccount();
  });
}
if (bookBtn)
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    const { dishId } = e.target.dataset;
    bookDish(dishId);
  });

const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) showAlert("success", alertMessage, 20);

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
