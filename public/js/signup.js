const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

  window.setTimeout(hideAlert, 5000);
};

const signup = async (name, email, password, passwordConfirm, photo) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/signup",
      data: {
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        photo: photo,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Please verify your email before getting started!!");
      location.assign("/emailVerify");
      /*       window.setTimeout(() => {
        location.assign("/menu");
      }, 1500); */
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

document.querySelector(".signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("confirm-password").value;
  const photo = document.getElementById("photo").value;
  //   console.log(email, password, passwordConfirm, photo);
  signup(name, email, password, passwordConfirm, photo);
});
