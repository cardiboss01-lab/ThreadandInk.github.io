document.addEventListener('DOMContentLoaded', () => {
  const cartTableBody = document.querySelector('#cart-table tbody');
  const totalDisplay = document.getElementById('total');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Load and display cart
  function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartTableBody.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.size}</td>
        <td>${item.color}</td>
        <td>${item.price.toFixed(2)}</td>
        <td><input type="number" min="1" value="${item.qty}" class="qty-input" data-index="${index}"></td>
        <td><button class="remove-item" data-index="${index}">X</button></td>
      `;
      cartTableBody.appendChild(row);
      total += item.price * item.qty;
    });

    totalDisplay.innerText = `Total: R${total.toFixed(2)}`;

    // Quantity change
    document.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', function() {
        const idx = parseInt(this.dataset.index);
        let qty = parseInt(this.value);
        if (qty < 1) qty = 1;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart[idx].qty = qty;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
      });
    });

    // Remove item
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.dataset.index);
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
      });
    });
  }

  loadCart();

  // Proceed to checkout
  checkoutBtn.addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      alert("Your cart is empty 🛍️");
      return;
    }
    window.location.href = "checkout.html";
  });
});
