const availableIn = JSON.parse(
  document.getElementById("map").dataset.availablein
);

console.log(availableIn);

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWtoaWwtYiIsImEiOiJja3ZrajNzYzc4eDN2Mm9zNzU1Mml4ZTN4In0.n3L75FvFC4xSM3FJQ0QGXg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
});
