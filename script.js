// ======================================
// URL PARAMS - CHECK FOR "VIEW ALL" MODE
// ======================================
const urlParams = new URLSearchParams(window.location.search);
const showAllProducts = urlParams.get('view') === 'all';

// ======================================
// PRODUCT DATA (SPECIALITY → PRODUCTS)
// ======================================
const data = {
    "Physician": [
        "Apihope", "Betacef", "Biscal", "Bispan", "Cefbis O", "Cuffex",
        "Cuffex T", "Emprovit", "Ferich XT", "GIKool", "Inflecheck",
        "Inflecheck SP", "Inflecheck T", "Leehope 500", "Levohope M",
        "Mefebis DS", "Nutrihope", "Nutrihope Gold", "Pericalm",
        "Picosulf Syrup", "Pirobis", "Rabihope 20", "Rabihope DSR",
        "Rabihope L", "Relaxfull", "Telmihope 40", "Telmihope AM",
        "Telmihope H", "Vertihope"
    ],

    "General Practitioner": [
        "Apihope", "Betacef", "Biscal", "Bispan", "Cefbis O", "Cuffex",
        "Cuffex T", "Emprovit", "Ferich XT", "GIKool", "Inflecheck",
        "Inflecheck SP", "Inflecheck T", "Leehope 500", "Levohope M",
        "Mefebis DS", "Nutrihope", "Nutrihope Gold", "Pericalm",
        "Picosulf Syrup", "Pirobis", "Rabihope 20", "Rabihope DSR",
        "Rabihope L", "Relaxfull", "Telmihope 40", "Telmihope AM",
        "Telmihope H", "Vertihope"
    ],

    "Pediatrician": [
        "Apihope", "Betacef", "Biscal", "Cefbis O", "Cuffex",
        "Cuffex T", "Emprovit", "Leehope 500"
    ],

    "Orthopedic": [
        "Betacef", "Biscal", "Bispan", "GIKool", "Inflecheck",
        "Leehope 500", "Nutrihope", "Nutrihope Gold",
        "Picosulf Syrup", "Rabihope 20", "Rabihope DSR"
    ],

    "Gynaecologist": [
        "Apihope", "Betacef", "Biscal", "Bispan", "Cefbis O",
        "Cuffex", "Cuffex T", "Emprovit", "Ferich XT", "GIKool",
        "Leehope 500", "Nutrihope", "Nutrihope Gold",
        "Picosulf Syrup", "Rabihope 20", "Rabihope DSR",
        "Rabihope L"
    ],

    "Dentist": [
        "Bispan", "GIKool", "Inflecheck", "Pirobis",
        "Rabihope 20", "Rabihope DSR"
    ]
};

// ======================================
// STATE
// ======================================
let currentView = 'categories';
let currentCategory = null;
let currentProductIndex = 0;
let allProducts = [];
let filteredProducts = [];

// ======================================
// INIT
// ======================================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    
    if (showAllProducts) {
        showAllProductsView();
    } else {
        showCategories();
    }
});

// ======================================
// EVENT LISTENERS
// ======================================
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }
}

// ======================================
// BUILD PRODUCT OBJECTS
// ======================================
function buildProductObjects(names) {
    return names.map(name => ({
        name,
        img: `assets/${name}.jpeg`
    }));
}

// ======================================
// CATEGORIES VIEW
// ======================================
function showCategories() {
    currentView = 'categories';
    currentCategory = null;

    document.getElementById('pageTitle').textContent = 'Speciality';
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('searchBox').style.display = 'none';

    let html = '<div class="categories-grid">';
    Object.keys(data).forEach(cat => {
        const initials = cat.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        html += `
            <div class="category-card" onclick="showProducts('${escapeHtml(cat)}')">
                <div class="category-icon">${initials}</div>
                <h3>${escapeHtml(cat)}</h3>
                <p>${data[cat].length} products</p>
            </div>
        `;
    });
    html += '</div>';

    document.getElementById('main').innerHTML = html;
}

// ======================================
// PRODUCTS VIEW
// ======================================
function showProducts(category) {
    currentView = 'products';
    currentCategory = category;

    allProducts = buildProductObjects(data[category]);
    filteredProducts = [...allProducts];

    document.getElementById('pageTitle').textContent = 'Products';
    document.getElementById('backBtn').style.display = 'flex';
    document.getElementById('searchBox').style.display = 'block';

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    renderProducts();
}

// ======================================
// ALL PRODUCTS VIEW
// ======================================
function showAllProductsView() {
    currentView = 'products';
    currentCategory = 'All Products';

    // Get unique product names from all categories
    const uniqueNames = [...new Set(Object.values(data).flat())].sort();
    allProducts = buildProductObjects(uniqueNames);
    filteredProducts = [...allProducts];

    document.getElementById('pageTitle').textContent = 'All Products';
    document.getElementById('backBtn').style.display = 'flex';
    document.getElementById('searchBox').style.display = 'block';

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    renderProducts();
}

// ======================================
// RENDER PRODUCTS
// ======================================
function renderProducts() {
    if (!filteredProducts.length) {
        document.getElementById('main').innerHTML = `
            <div class="empty-state">
                <h2>No products found</h2>
                <p>Try adjusting your search</p>
            </div>
        `;
        return;
    }

    let html = '<div class="products-grid">';
    filteredProducts.forEach((product, idx) => {
        html += `
            <div class="product-card" onclick="showProductViewer(${idx})">
                <img src="${escapeHtml(product.img)}"
                     alt="${escapeHtml(product.name)}"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22200%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22250%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2216%22%3ENo Image%3C/text%3E%3C/svg%3E'">
                <h4>${escapeHtml(product.name)}</h4>
            </div>
        `;
    });
    html += '</div>';

    document.getElementById('main').innerHTML = html;
}

// ======================================
// VIEWER
// ======================================
function showProductViewer(index) {
    currentView = 'viewer';
    currentProductIndex = index;
    
    // Hide catalog header and container
    const catalogHeader = document.getElementById('catalogHeader');
    const catalogContainer = document.getElementById('catalogContainer');
    const body = document.body;
    
    if (catalogHeader) {
        catalogHeader.classList.add('hidden');
    }
    if (catalogContainer) {
        catalogContainer.classList.add('viewer-active');
    }
    if (body) {
        body.classList.add('viewer-mode');
    }
    
    renderViewer();
}

function jumpToProduct(index) {
    currentProductIndex = index;
    renderViewer();
}

function renderViewer() {
    const product = filteredProducts[currentProductIndex];

    const html = `
        <div class="viewer-header">
            <img class="logo" src="assets/logo.jpeg" alt="Logo">
            <div class="header-buttons">
                <button onclick="goHome()">Home</button>
                <button onclick="closeViewer()">Close</button>
            </div>
        </div>
        
        <div class="viewer-wrapper">
            <div class="viewer-card">
                <img src="${escapeHtml(product.img)}" alt="${escapeHtml(product.name)}"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23eee%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2220%22%3ENo Image%3C/text%3E%3C/svg%3E'">
            </div>
            
            <div class="viewer-sidebar">
                <ul class="viewer-product-list">
                    ${filteredProducts.map((p, i) => `
                        <li class="${i === currentProductIndex ? 'active' : ''}" onclick="jumpToProduct(${i})">
                            ${escapeHtml(p.name)}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;

    document.getElementById('main').innerHTML = html;
    
    // Scroll active item into view
    setTimeout(() => {
        const activeItem = document.querySelector('.viewer-product-list li.active');
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
}

// ======================================
// NAVIGATION
// ======================================
function closeViewer() {
    // Show catalog header and restore normal mode
    const catalogHeader = document.getElementById('catalogHeader');
    const catalogContainer = document.getElementById('catalogContainer');
    const body = document.body;
    
    if (catalogHeader) {
        catalogHeader.classList.remove('hidden');
    }
    if (catalogContainer) {
        catalogContainer.classList.remove('viewer-active');
    }
    if (body) {
        body.classList.remove('viewer-mode');
    }
    
    if (currentCategory === 'All Products') {
        showAllProductsView();
    } else {
        showProducts(currentCategory);
    }
}

function goBack() {
    if (currentView === 'products') {
        window.location.href = 'categories.html';
    } else if (currentView === 'viewer') {
        closeViewer();
    }
}

function goHome() {
    window.location.href = 'index.html';
}

// ======================================
// SEARCH
// ======================================
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(query)
    );
    
    renderProducts();
}

// ======================================
// UTILITY FUNCTIONS
// ======================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ======================================
// GLOBAL EXPORTS
// ======================================
window.showProducts = showProducts;
window.showProductViewer = showProductViewer;
window.jumpToProduct = jumpToProduct;
window.closeViewer = closeViewer;
window.goBack = goBack;
window.goHome = goHome;