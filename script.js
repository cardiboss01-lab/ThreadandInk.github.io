// ===== THREAD & INK CART SYSTEM =====
document.addEventListener('DOMContentLoaded', () => {

  // -------- ADD ITEMS TO CART --------
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();

      // Grab product info from data attributes
      const name = this.dataset.name;
      const price = parseFloat(this.dataset.price);

      // Grab optional size and color from sibling selects (if they exist)
      const parent = this.closest('.product'); // assumes button is inside a product div
      let size = parent ? parent.querySelector('.size-select')?.value || '' : '';
      let color = parent ? parent.querySelector('.color-select')?.value || '' : '';

      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Check if exact item already exists (same name, size, color)
      const existingIndex = cart.findIndex(item =>
        item.name === name &&
        item.size === size &&
        item.color === color
      );

      if (existingIndex !== -1) {
        cart[existingIndex].qty += 1; // increase qty
      } else {
        cart.push({
          name: name,
          price: price,
          size: size,
          color: color,
          qty: 1
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${name} added to cart 🛍️`);
    });
  });

  // -------- DISPLAY CART ON CART PAGE --------
  const cartTableBody = document.querySelector('#cart-table tbody');
  const totalDisplay = document.getElementById('total');

  function loadCart() {
    if (!cartTableBody) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartTableBody.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.size}</td>
        <td>${item.color}</td>
        <td>${item.price}</td>
        <td>
          <input type="number" min="1" value="${item.qty}" class="qty-input" data-index="${index}">
        </td>
        <td>
          <button class="remove-item" data-index="${index}">X</button>
        </td>
      `;
      cartTableBody.appendChild(row);

      total += item.price * item.qty;
    });

    if (totalDisplay) totalDisplay.innerText = `Total: R${total}`;

    // -------- QUANTITY CHANGE --------
    document.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', function() {
        const idx = parseInt(this.dataset.index);
        let qty = parseInt(this.value);
        if (qty < 1) qty = 1;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart[idx].qty = qty;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart(); // refresh totals
      });
    });

    // -------- REMOVE ITEM --------
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
});
