const sizes = document.querySelectorAll(".item-size");
const colors = document.querySelectorAll(".item-color");
const shoes = document.querySelectorAll(".item-shoe");
const gradients = document.querySelectorAll(".item-gradient");
const shoeBg = document.querySelector(".item-shoeBackground");
const price = document.querySelector(".item-price");
const currentprice = price.textContent.split("₹")[1];

const locations = JSON.parse(document.getElementById("map").dataset.locations);

const map = L.map("map").setView(
  [locations[0].coordinates[1], locations[0].coordinates[0]],
  13
);

L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png").addTo(map);

locations.forEach((loc) => {
  L.marker([loc.coordinates[1], loc.coordinates[0]])
    .addTo(map)
    .bindPopup(`${loc.description}`)
    .openPopup();
});

let prevColor = "blue";
let animationEnd = true;

function changeSize() {
  sizes.forEach((size) => size.classList.remove("item-active"));

  // console.log(size.textContent);
  // console.log(sizes.textContent);
  // console.log(price.textContent);

  this.classList.add("item-active");

  const active = document.querySelector(".item-active");

  price.textContent = `₹${currentprice * active.textContent}`;
}

function changeColor() {
  if (!animationEnd) return;
  let primary = this.getAttribute("primary");
  let color = this.getAttribute("color");
  let shoe = document.querySelector(`.shoe[color="${color}"]`);
  let gradient = document.querySelector(`.gradient[color="${color}"]`);
  let prevGradient = document.querySelector(`.gradient[color="${prevColor}"]`);

  if (color == prevColor) return;

  colors.forEach((c) => c.classList.remove("item-active"));
  this.classList.add("item-active");

  document.documentElement.style.setProperty("--primary", primary);

  shoes.forEach((s) => s.classList.remove("show"));
  shoe.classList.add("show");

  gradients.forEach((g) => g.classList.remove("first", "second"));
  gradient.classList.add("first");
  prevGradient.classList.add("second");

  prevColor = color;
  animationEnd = false;

  gradient.addEventListener("animationend", () => {
    animationEnd = true;
  });
}

sizes.forEach((size) => size.addEventListener("click", changeSize));
colors.forEach((c) => c.addEventListener("click", changeColor));

let x = window.matchMedia("(max-width: 1000px)");

function changeHeight() {
  if (x.matches) {
    let shoeHeight = shoes[0].offsetHeight;
    shoeBg.style.height = `${shoeHeight * 0.9}px`;
  } else {
    shoeBg.style.height = "475px";
  }
}

changeHeight();

window.addEventListener("resize", changeHeight);
