const addToCart = document.querySelector(".addToCart");
addToCart.addEventListener("click", function (event) {
  event.preventDefault();
  let dish = event.target.dataset.dish;
  const currentDishes = [localStorage.getItem("cartDishes")];
  currentDishes.push(dish);
  //   console.log(JSON.stringify(currentDishes));
  //   const cartDishes = [dish];
  //   cartDishes.push("238uyrwioeryioweuroweyrioweru");
  //   console.log(cartDishes);
  //   console.log(event.target.dataset.dish);
  //   localStorage.setItem("dish", cartDishes);
  //   console.log(localStorage.getItem("dish"));
  localStorage.setItem("cartDishes", currentDishes);
});
