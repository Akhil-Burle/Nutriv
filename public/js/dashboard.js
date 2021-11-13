import { showAlert } from "./alerts.js";

export const addNewDish = async (
  name,
  price,
  deliveryTime,
  summary,
  availability,
  type,
  foodType,
  chefs,
  imageCover
) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/menu",
      data: {
        name,
        price,
        deliveryTime,
        summary,
        availability,
        type,
        foodType,
        chefs,
        imageCover,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Dish created Successfully!");
      window.setTimeout(() => {
        location.assign("/menu");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
