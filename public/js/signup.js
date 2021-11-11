// import axios from "axios";
import { showAlert } from "./alerts.js";

export const signup = async (name, email, password, passwordConfirm, photo) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
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
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
