// import axios from "axios";
import { showAlert } from "../alerts.js";

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: {
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
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

export const verify = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/verify",
      data: {
        email: email,
        password: password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Email sent successfully!");
      location.assign("/emailVerify");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

// export const addNewReview = async (dishId, review, rating) => {
//   try {
//     const res = await axios({
//       method: "POST",
//       url: `/api/v1/menu/${dishId}/reviews`,
//       data: {
//         review,
//         rating,
//       },
//     });
//     if (res.data.status === "success") {
//       showAlert("success", "Review Added successfully!");
//       location.reload();
//     }
//   } catch (err) {
//     showAlert("error", err.response.data.message);
//   }
// };
