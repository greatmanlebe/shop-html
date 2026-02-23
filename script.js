// Product Data
const products = [
    {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        category: 'electronics',
        description: 'Experience crystal-clear audio with active noise cancellation and 30-hour battery life.'
    },
    {
        id: 2,
        name: 'Luxury Gold Watch',
        price: 499.99,
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
        category: 'tel',
        description: 'Swiss movement, sapphire crystal glass, and water resistance up to 100m.'
    },
    {
        id: 3,
        name: 'Wireless Mechanical Keyboard',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400',
        category: 'electronics',
        description: 'RGB lighting, hot-swappable switches, and dual connectivity.'
    },
    {
        id: 4,
        name: 'Latest Smartphone',
        price: 899.99,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        category: 'electronics',
        description: '6.7" OLED display, professional-grade camera system, all-day battery life.'
    },
    {
        id: 5,
        name: 'Leather Travel Backpack',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        category: 'fashion',
        description: 'Genuine leather with padded laptop sleeve and multiple compartments.'
    },
    {
        id: 6,
        name: 'Designer Sunglasses',
        price: 179.99,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        category: 'fashion',
        description: 'UV400 protection, polarized lenses, timeless design.'
    },
    {
        id: 7,
        name: 'Performance Running Shoes',
        price: 139.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        category: 'sports',
        description: 'Responsive cushioning, breathable mesh, advanced traction.'
    },
    {
        id: 8,
        name: 'MacBook Pro Laptop',
        price: 1999.99,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        category: 'electronics',
        description: 'Latest processor, Retina display, all-day battery life.'
    }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const categoryFilters = document.querySelectorAll('.category-filter');
const cartSidebar = document.getElementById('cartSidebar');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');
const shopNowBtn = document.getElementById('shopNowBtn');

// Render Products
function renderProducts(category = 'all') {
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    productsGrid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-image" onclick="openProductModal(${product.id})">
                <img src="${product.image}" alt="${product.name}">
                <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name" onclick="openProductModal(${product.id})">${product.name}</h3>
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Category Filter
categoryFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        categoryFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        renderProducts(filter.dataset.category);
    });
});

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    saveCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
            saveCart();
        }
    }
}

function updateCart() {
    // Update cart items display
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="quantity-btn" onclick="removeFromCart(${item.id})">×</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Update cart count
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Modal Functions
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    modalBody.innerHTML = `
        <div style="display: grid; gap: 1.5rem;">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 0.5rem;">
            <div>
                <span style="color: #6b7280;">${product.category}</span>
                <h2 style="font-size: 2rem; margin: 0.5rem 0;">${product.name}</h2>
                <div style="font-size: 2rem; color: #111827; margin: 1rem 0;">$${product.price.toFixed(2)}</div>
                <p style="color: #4b5563; line-height: 1.6;">${product.description}</p>
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="addToCart(${product.id}); closeModal.click()">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    productModal.classList.add('active');
}

// Event Listeners
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (cartSidebar.classList.contains('active') && 
        !cartSidebar.contains(e.target) && 
        !cartBtn.contains(e.target)) {
        cartSidebar.classList.remove('active');
    }
});

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

closeModal.addEventListener('click', () => {
    productModal.classList.remove('active');
});

shopNowBtn.addEventListener('click', () => {
    document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
});

// Wishlist function (placeholder)
function toggleWishlist(productId) {
    alert('Wishlist feature coming soon!');
}

// Initialize
renderProducts();
updateCart();