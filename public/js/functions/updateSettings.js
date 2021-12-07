/* eslint-disable */
import { showAlert } from "../alerts.js";

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/updateMyPassword"
        : "/api/v1/users/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully!`);
      location.reload();
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const deleteAccount = async () => {
  try {
    const res = await axios({
      method: "DELETE",
      url: "/api/v1/users/deleteMe",
    });

    if (res.status === 204) {
      showAlert("success", "Account deleted successfully..");
      location.assign("/");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
