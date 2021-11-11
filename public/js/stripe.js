const stripe = Stripe(
  "pk_test_51JtWTpSB8CbvCgkhtz9HA031eDZuoyMB2sSobJSeG7SNFfXfhsXKraAfhMBUoqvbNanJtX2XN0IF1d59MC1wNTEa00yvF6DuiD"
);

export const bookDish = async (dishId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${dishId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
