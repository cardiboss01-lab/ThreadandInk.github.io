let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(name + " added to cart 🧶");
}

function loadCart() {
  const cartItems = document.getElementById("cartItems");
  const total = document.getElementById("total");

  if (!cartItems) return;

  cartItems.innerHTML = "";
  let sum = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} — $${item.price}`;
    cartItems.appendChild(li);
    sum += item.price;
  });

  total.textContent = "Total: $" + sum;
}

function checkout() {
  alert("Thank you for supporting handmade art 💛");
  localStorage.removeItem("cart");
  window.location.reload();
}

loadCart();

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

if (document.getElementById("paypal-button-container")) {
  paypal.Buttons({
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: getTotal().toFixed(2)
          }
        }]
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function () {
        alert("Payment successful! Thank you for supporting handmade art 💛");
        localStorage.removeItem("cart");
        window.location.href = "index.html";
      });
    }
  }).render("#paypal-button-container");
}

const customForm = document.getElementById("customForm");

if (customForm) {
  customForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert(
      "Thank you! Your custom request has been sent 💛\nI’ll be in touch via email soon."
    );
    customForm.reset();
  });
}
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: "200"   // later we’ll replace with cart total
                }
            }]
        });
    },

    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert("Payment successful! Thanks " + details.payer.name.given_name);
        });
    }
}).render('#paypal-button-container');

