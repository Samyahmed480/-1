// Sample books data with real images
const books = [
    {
        id: 1,
        title: "كتاب الأدب العربي",
        author: "أحمد محمد",
        price: 149.99,
        image: "https://i.ibb.co/G08BPgT/arabic-literature.jpg"
    },
    {
        id: 2,
        title: "تاريخ العلوم",
        author: "سارة أحمد",
        price: 99.50,
        image: "https://i.ibb.co/7k5G8Zt/science-history.jpg"
    },
    {
        id: 3,
        title: "الفلسفة الحديثة",
        author: "محمد علي",
        price: 175.00,
        image: "https://i.ibb.co/mcBBn8h/modern-philosophy.jpg"
    },
    {
        id: 4,
        title: "علم النفس التطبيقي",
        author: "ليلى محمود",
        price: 135.00,
        image: "https://i.ibb.co/p4Xtp7Y/psychology.jpg"
    },
    {
        id: 5,
        title: "أساسيات الرياضيات",
        author: "حسن كامل",
        price: 120.00,
        image: "https://i.ibb.co/QNLZTKT/mathematics.jpg"
    },
    {
        id: 6,
        title: "الفيزياء الحديثة",
        author: "عمر خالد",
        price: 165.00,
        image: "https://i.ibb.co/f8GQgzM/physics.jpg"
    }
];

// Function to display books
function displayBooks() {
    const booksContainer = document.getElementById('booksContainer');
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];

    booksContainer.innerHTML = '';

    storedBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';

        bookCard.innerHTML = `
            <div class="book-image">
                <img src="${book.image}" alt="${book.title}" loading="lazy">
            </div>
            <h3>${book.title}</h3>
            <p>المؤلف: ${book.author}</p>
            <p>السعر: ${book.price} جنيه</p>
            <button onclick="addToCart(${book.id})" class="cta-button">أضف إلى السلة</button>
        `;

        booksContainer.appendChild(bookCard);
    });
}

// Cart management functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(bookId) {
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    const book = storedBooks.find(b => b.id == bookId); // تغيير === إلى == للمقارنة المرنة

    if (book) {
        cart.push(book);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('تم إضافة الكتاب إلى السلة');
    } else {
        alert('عذراً، لم يتم العثور على الكتاب');
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div>
                <h3>${item.title}</h3>
                <p>المؤلف: ${item.author}</p>
                <p>السعر: ${item.price} جنيه</p>
            </div>
            <button onclick="removeFromCart(${index})" class="remove-button">حذف</button>
        `;
        cartItems.appendChild(cartItem);
    });

    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2) + ' جنيه';
    }
}

// Theme toggle function
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize theme from localStorage
window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // تهيئة الكتب في localStorage إذا كانت فارغة
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    if (storedBooks.length === 0) {
        localStorage.setItem('books', JSON.stringify(books));
    }

    if (document.getElementById('booksContainer')) {
        displayBooks();
    }

    if (document.getElementById('cartItems')) {
        displayCartItems();
    }

    updateCartCount();

    // Add input event listener for real-time search
    document.getElementById('searchInput').addEventListener('input', function (e) {
        if (this.value === '') {
            displayBooks(); // Show all books when search is empty
        }
    });
};

function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const booksContainer = document.getElementById('booksContainer');
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];

    booksContainer.innerHTML = ''; // Clear current books

    const filteredBooks = storedBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );

    if (filteredBooks.length === 0) {
        booksContainer.innerHTML = '<div class="no-results">لا توجد نتائج للبحث</div>';
        return;
    }

    filteredBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-image">
                <img src="${book.image}" alt="${book.title}" loading="lazy">
            </div>
            <h3>${book.title}</h3>
            <p>المؤلف: ${book.author}</p>
            <p>السعر: ${book.price} جنيه</p>
            <button onclick="addToCart(${book.id})" class="cta-button">أضف إلى السلة</button>
        `;
        booksContainer.appendChild(bookCard);
    });
}

// Add event listener for enter key
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchBooks();
    }
});

function confirmOrder() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();

    if (!name || !phone || !address) {
        alert('الرجاء ملء جميع البيانات المطلوبة');
        return;
    }

    if (cart.length === 0) {
        alert('السلة فارغة! الرجاء إضافة كتب للطلب');
        return;
    }

    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: { name, phone, address },
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        status: 'pending'
    };

    // Store order in localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart and form
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();

    // Reset form
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';

    alert('تم تأكيد طلبك بنجاح!');
    window.location.href = 'index.html';
}

// Remove the checkout function since we're only using WhatsApp
// Remove or comment out the checkout function
