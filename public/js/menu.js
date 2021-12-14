const searchBar = document.querySelector(".search-form");
const cartButton = document.querySelector(".addToCart");
const currentLocation = window.location.href;

searchBar.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchText = document.getElementById("search").value;
  location.replace(`${currentLocation}?name=${searchText}`);

  //   location.replace(window.location.href);

  //   searchText.textContent = searchText;
});

cartButton.addEventListener("click", function (event) {
  event.preventDefault();
  console.log(event.target.dataset.dish);
  localStorage.setItem("dish", `${event.target.dataset.dish}`);
});
