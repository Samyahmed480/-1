// Admin Authentication
const ADMIN_PASSWORD = '1234';
let categories = JSON.parse(localStorage.getItem('categories')) || [];
let books = JSON.parse(localStorage.getItem('books')) || [];

function login() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('loginPanel').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadData();
    } else {
        alert('كلمة المرور غير صحيحة');
    }
}

function logout() {
    document.getElementById('loginPanel').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

// Categories Management
function addCategory(e) {
    e.preventDefault();
    const nameInput = document.getElementById('categoryName');
    const idInput = document.getElementById('categoryId');

    const category = {
        id: idInput.value || Date.now(),
        name: nameInput.value
    };

    if (idInput.value) {
        const index = categories.findIndex(c => c.id == idInput.value);
        categories[index] = category;
    } else {
        categories.push(category);
    }

    localStorage.setItem('categories', JSON.stringify(categories));
    displayCategories();
    e.target.reset();
    idInput.value = '';
    updateCategorySelect();
}

function editCategory(id) {
    const category = categories.find(c => c.id == id);
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
}

function deleteCategory(id) {
    if (confirm('هل أنت متأكد من حذف هذا القسم؟')) {
        categories = categories.filter(c => c.id != id);
        localStorage.setItem('categories', JSON.stringify(categories));
        displayCategories();
        updateCategorySelect();
    }
}

// Books Management
function addBook(e) {
    e.preventDefault();
    const book = {
        id: document.getElementById('bookId').value || Date.now(),
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        price: parseFloat(document.getElementById('bookPrice').value),
        image: document.getElementById('bookImage').value,
        categoryId: document.getElementById('bookCategory').value
    };

    if (document.getElementById('bookId').value) {
        const index = books.findIndex(b => b.id == book.id);
        books[index] = book;
    } else {
        books.push(book);
    }

    localStorage.setItem('books', JSON.stringify(books));
    displayBooks();
    e.target.reset();
    document.getElementById('bookId').value = '';
}

function editBook(id) {
    const book = books.find(b => b.id == id);
    document.getElementById('bookId').value = book.id;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookPrice').value = book.price;
    document.getElementById('bookImage').value = book.image;
    document.getElementById('bookCategory').value = book.categoryId;
}

function deleteBook(id) {
    if (confirm('هل أنت متأكد من حذف هذا الكتاب؟')) {
        books = books.filter(b => b.id != id);
        localStorage.setItem('books', JSON.stringify(books));
        displayBooks();
    }
}

// Display Functions
function displayCategories() {
    const list = document.getElementById('categoriesList');
    list.innerHTML = categories.map(category => `
        <div class="admin-item">
            <span>${category.name}</span>
            <div class="admin-item-buttons">
                <button onclick="editCategory('${category.id}')" class="edit-button">تعديل</button>
                <button onclick="deleteCategory('${category.id}')" class="delete-button">حذف</button>
            </div>
        </div>
    `).join('');
}

function displayBooks() {
    const list = document.getElementById('booksList');
    list.innerHTML = books.map(book => `
        <div class="admin-item">
            <span>${book.title} - ${book.author}</span>
            <div class="admin-item-buttons">
                <button onclick="editBook('${book.id}')" class="edit-button">تعديل</button>
                <button onclick="deleteBook('${book.id}')" class="delete-button">حذف</button>
            </div>
        </div>
    `).join('');
}

function updateCategorySelect() {
    const select = document.getElementById('bookCategory');
    select.innerHTML = categories.map(category =>
        `<option value="${category.id}">${category.name}</option>`
    ).join('');
}

// Orders Management
let currentFilter = 'all';

function displayOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const list = document.getElementById('ordersList');

    const filteredOrders = currentFilter === 'all'
        ? orders
        : orders.filter(order => order.status === currentFilter);

    list.innerHTML = filteredOrders.map(order => `
        <div class="order-item ${order.status}">
            <div class="order-header">
                <h3>طلب #${order.id}</h3>
                <span class="order-date">${new Date(order.date).toLocaleDateString('ar-EG')}</span>
            </div>
            <div class="order-details">
                <p><strong>العميل:</strong> ${order.customer.name}</p>
                <p><strong>الهاتف:</strong> ${order.customer.phone}</p>
                <p><strong>العنوان:</strong> ${order.customer.address}</p>
                <p><strong>المجموع:</strong> ${order.total} جنيه</p>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item-detail">
                        ${item.title} - ${item.price} جنيه
                    </div>
                `).join('')}
            </div>
            <div class="order-actions">
                ${order.status === 'pending' ?
            `<button onclick="completeOrder(${order.id})" class="complete-button">
                        تم التسليم
                    </button>` :
            `<span class="completed-tag">تم التسليم</span>`
        }
                <button onclick="deleteOrder(${order.id})" class="delete-button">
                    حذف الطلب
                </button>
            </div>
        </div>
    `).join('');
}

function filterOrders(status) {
    currentFilter = status;
    displayOrders();

    // Update active filter button
    document.querySelectorAll('.filter-button').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.includes(status));
    });
}

function completeOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'completed';
        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders();
    }
}

function deleteOrder(orderId) {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const updatedOrders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        displayOrders();
    }
}

// Update loadData function to include orders
function loadData() {
    displayCategories();
    displayBooks();
    displayOrders();
    updateCategorySelect();
}

// Event Listeners
document.getElementById('categoryForm').addEventListener('submit', addCategory);
document.getElementById('bookForm').addEventListener('submit', addBook);

// Initialize
if (localStorage.getItem('adminLoggedIn') === 'true') {
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadData();
}
