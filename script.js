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

// 1. Grab all Add to Cart buttons
const cartButtons = document.querySelectorAll('.add-to-cart');

cartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();

    // 2. Get product data
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const size = button.dataset.size || '';
    const color = button.dataset.color || '';

    // 3. Get current cart from localStorage or create new
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // 4. Add product to cart
    cart.push({ name, price, size, color, quantity: 1 });

    // 5. Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${name} added to cart!`);
  });
});

function displayCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const tbody = document.querySelector('#cart-table tbody');
  tbody.innerHTML = '';

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.size}</td>
      <td>${item.color}</td>
      <td>R${item.price}</td>
      <td>${item.quantity}</td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById('total').textContent = `Total: R${total}`;
}

// Run displayCart only if cart-table exists
if (document.querySelector('#cart-table')) {
  displayCart();
}
