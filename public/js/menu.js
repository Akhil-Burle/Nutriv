const searchBar = document.querySelector(".search-form");
const currentLocation = window.location.href;

searchBar.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchText = document.getElementById("search").value;
  location.replace(`${currentLocation}?name=${searchText}`);

  //   location.replace(window.location.href);

  //   searchText.textContent = searchText;
});
