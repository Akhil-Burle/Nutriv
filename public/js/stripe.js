const stripe = Stripe(
  "pk_test_51JtWTpSB8CbvCgkhtz9HA031eDZuoyMB2sSobJSeG7SNFfXfhsXKraAfhMBUoqvbNanJtX2XN0IF1d59MC1wNTEa00yvF6DuiD"
);

const bookDish = async (dishId) => {
  try {
    // Get session from the server:
    const session = await axios(`/api/v1/bookings/checkout-session/${dishId}`);
    //   Use Stripe object to create the checkout form and all the other features
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
  }
};

const bookBtn = document.getElementById("book-dish");

if (bookBtn)
  bookBtn.addEventListener("click", (e) => {
    // e.preventDefault();
    e.target.textContent = "Processing...";
    const { dishId } = e.target.dataset;

    bookDish(dishId);
  });
