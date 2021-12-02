import { showAlert } from "./alerts.js";

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/forgotPassword",
      data: {
        email: email,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Email sent successfully");
      location.assign("/forgotPasswordMessage");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const resetPassword = async (newPassword, confirmNewPassword) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/users/resetPassword/${window.location.href.split("/")[4]}`,
      data: {
        password: newPassword,
        passwordConfirm: confirmNewPassword,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Password Changed successfully!");
      location.assign("/me");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
