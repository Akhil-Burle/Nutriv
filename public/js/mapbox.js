/* const availableIn = JSON.parse(
  document.getElementById("map").dataset.availablein
);

console.log(availableIn);

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWtoaWwtYiIsImEiOiJja3ZrajNzYzc4eDN2Mm9zNzU1Mml4ZTN4In0.n3L75FvFC4xSM3FJQ0QGXg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
}); */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWtoaWwtYiIsImEiOiJja3ZrajNzYzc4eDN2Mm9zNzU1Mml4ZTN4In0.n3L75FvFC4xSM3FJQ0QGXg";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/jonasschmedtmann/cjvi9q8jd04mi1cpgmg7ev3dy",
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement("div");
    el.className = "marker";

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
