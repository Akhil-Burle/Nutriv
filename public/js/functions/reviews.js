// import axios from "axios";
import { showAlert } from "../alerts.js";

export const addNewReview = async (review, rating, dishId) => {
  try {
    const res = await axios({
      method: "POST",
      url: `/api/v1/menu/${dishId}/reviews`,
      data: {
        review: review,
        rating: rating,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Review added successfully");
      location.reload();
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
