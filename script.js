const menuItems = [
    { name: "Burger", price: 9.99, image: "burger.jpg" },
    { name: "Pizza", price: 11.99, image: "Pizza-3007395.jpg" },
    { name: "Salad", price: 7.99, image: "salad.jpg" },
    { name: "Fries", price: 3.99, image: "fries.jpg" },
    { name: "Soda", price: 1.99, image: "soda.jpg" },
    { name: "Desserts", price: 5.99, image: "desert.jpg" }
];

let order = [];
let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

function displayMenu(items = menuItems) {
    const menuSection = document.getElementById('menu');
    menuSection.innerHTML = '';
    
    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('col-md-6', 'col-lg-4', 'mb-4');
        
        menuItem.innerHTML = `
            <div class="card h-100">
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">$${item.price.toFixed(2)}</p>
                    <button class="btn btn-primary mt-auto" onclick="addToOrder('${item.name}', ${item.price})">Add to Order</button>
                </div>
            </div>
        `;
        
        menuSection.appendChild(menuItem);
    });
}

function addToOrder(name, price) {
    order.push({ name, price });
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderItemsList = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    
    orderItemsList.innerHTML = '';
    
    let total = 0;
    
    order.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        
        listItem.innerHTML = `
            ${item.name} - $${item.price.toFixed(2)}
            <button class="btn btn-danger btn-sm" onclick="removeFromOrder(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        orderItemsList.appendChild(listItem);
        
        total += item.price;
    });
    
    orderTotal.textContent = total.toFixed(2);
}

function removeFromOrder(index) {
    order.splice(index, 1);
    updateOrderSummary();
}


function placeOrder() {
    if (order.length === 0) {
        alert("Your order is empty!");
        return;
    }

    const orderSummary = order.map(item => item.name).join(", ");
    const totalPrice = order.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    alert(`Order Summary:\n${orderSummary}\n\nTotal Price: $${totalPrice}`);

    // Add the current order to the order history
    orderHistory.push({
        items: order,
        total: totalPrice,
        date: new Date().toLocaleString()
    });

    // Save the updated order history to local storage
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    order = [];
    updateOrderSummary();
}

function searchMenu() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredItems = menuItems.filter(item => item.name.toLowerCase().includes(searchTerm));
    displayMenu(filteredItems);
}
function displayOrderHistory() {
    const orderHistoryList = document.getElementById('orderHistoryList');
    orderHistoryList.innerHTML = '';

    if (orderHistory.length === 0) {
        orderHistoryList.innerHTML = '<p>No previous orders found.</p>';
        return;
    }

    orderHistory.forEach((order, index) => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('mb-3', 'p-3', 'border', 'rounded');

        const orderItems = order.items.map(item => `${item.name} - $${item.price.toFixed(2)}`).join('<br>');

        orderDiv.innerHTML = `
            <h6>Order #${orderHistory.length - index}</h6>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Items:</strong><br>${orderItems}</p>
            <p><strong>Total:</strong> $${order.total}</p>
        `;

        orderHistoryList.appendChild(orderDiv);
    });
}
window.onload = function() {
    displayMenu();
    
    const placeOrderBtn = document.getElementById('place-order-btn');
    placeOrderBtn.addEventListener('click', placeOrder);

    // Add event listener for the order history modal
    const orderHistoryModal = document.getElementById('orderHistoryModal');
    orderHistoryModal.addEventListener('show.bs.modal', displayOrderHistory);
};