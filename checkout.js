document.addEventListener('DOMContentLoaded', () => {
  const totalDisplay = document.getElementById('checkout-total');
  const paypalContainer = document.getElementById('paypal-button-container');
  const checkoutForm = document.getElementById('checkout-form');

  // Load cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    totalDisplay.innerText = "Your cart is empty 🛍️";
    paypalContainer.style.display = "none";
    console.log("Cart is empty, PayPal button hidden.");
    return;
  }

  // Ensure all prices are numbers
  cart.forEach(item => item.price = parseFloat(item.price));

  // Calculate total
  let total = 0;
  cart.forEach(item => total += item.price * item.qty);
  totalDisplay.innerText = `Total: R${total.toFixed(2)}`;

  paypalContainer.style.display = "block";

  // Render PayPal button
  paypal.Buttons({
    createOrder: function(data, actions) {
      // Combine items into a single description
      const itemDesc = cart.map(item => `${item.name} - ${item.size} - ${item.color} x${item.qty}`).join(', ');
      console.log("Creating order with total:", total.toFixed(2), "Description:", itemDesc);

      return actions.order.create({
        purchase_units: [{
          amount: { value: total.toFixed(2) },
          description: itemDesc
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(details => {
        // Payment successful
        console.log("PayPal transaction details:", details);

        // Collect customer info
        const customerName = checkoutForm.querySelector('input[type="text"]').value;
        const customerEmail = checkoutForm.querySelector('input[type="email"]').value;
        const customerPhone = checkoutForm.querySelector('input[type="tel"]').value;
        const customerAddress = checkoutForm.querySelector('textarea').value;

        console.log("Customer Info:", {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress
        });

        // Clear cart
        localStorage.removeItem('cart');

        // Alert user after successful payment
        alert(`Payment completed by ${details.payer.name.given_name}! Thank you for your order 💜`);

        // Redirect to homepage
        window.location.href = "index.html";
      });
    },
    onError: function(err) {
      console.error("PayPal error:", err);
      alert('Something went wrong with PayPal payment. Please try again.');
    }
  }).render('#paypal-button-container');

});
