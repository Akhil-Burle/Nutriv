import { showAlert } from "../alerts.js";

export const addNewCartItem = async (dish, user) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/cart",
      data: { dish, user },
    });
    if (res.data.status === "success") {
      showAlert("success", "Added to Cart!");
    }
  } catch (error) {
    showAlert("error", "Please login to get access to cart!");
  }
};

export const deleteCartItem = async (cartItemId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/cart/${cartItemId}`,
    });

    if (res.status === 204) {
      location.reload();
      showAlert("success", "Item removed from your cart.");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
