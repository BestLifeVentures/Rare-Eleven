// Filter Panel Toggle
const filterBtn = document.getElementById('filterBtn');
const filterPanel = document.getElementById('filterPanel');
const filterOptions = document.querySelectorAll('.filter-option');

// Toggle filter panel
filterBtn.addEventListener('click', () => {
    filterPanel.classList.toggle('active');
});

// Filter functionality
filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        filterOptions.forEach(opt => opt.classList.remove('active'));

        // Add active class to clicked option
        option.classList.add('active');

        // Get filter value
        const filterValue = option.getAttribute('data-filter');

        // Get current gallery items (works with dynamically loaded items)
        const galleryItems = document.querySelectorAll('.gallery-item');

        // Filter gallery items
        galleryItems.forEach(item => {
            if (filterValue === 'all') {
                item.classList.remove('hidden');
            } else {
                const itemCategory = item.getAttribute('data-category');
                if (itemCategory === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });
    });
});

// Cart functionality (placeholder)
const cartBtn = document.getElementById('cartBtn');
let cartItems = [];

cartBtn.addEventListener('click', () => {
    alert('Cart functionality coming soon!');
    // You can expand this later with a shopping cart modal
});

// Admin Search - Access to admin page
const adminSearch = document.getElementById('adminSearch');

adminSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchValue = adminSearch.value.trim();

        // Check if search matches "Alyssa Barresi" (case-insensitive)
        if (searchValue.toLowerCase() === 'alyssa barresi') {
            window.location.href = 'admin.html';
        } else {
            // Clear the input if not matching
            adminSearch.value = '';
        }
    }
});

// Load gallery data from localStorage if available
function loadGalleryData() {
    const savedGallery = localStorage.getItem('galleryData');
    if (savedGallery) {
        const galleryData = JSON.parse(savedGallery);
        updateGallery(galleryData);
    }
}

// Update gallery with new data
function updateGallery(galleryData) {
    const galleryGrid = document.getElementById('galleryGrid');

    if (galleryData && galleryData.length > 0) {
        galleryGrid.innerHTML = '';

        galleryData.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-category', item.category);

            galleryItem.innerHTML = `
                <div class="luxury-wall">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="artwork-info">
                        <h3>${item.title}</h3>
                        <p>$${item.price}</p>
                    </div>
                </div>
            `;

            galleryGrid.appendChild(galleryItem);
        });
    }
}

// Load banner images from localStorage
function loadBannerImages() {
    const bannerData = JSON.parse(localStorage.getItem('bannerData') || '{}');
    const bannerPaintings = document.querySelectorAll('.banner-painting img');

    for (let i = 1; i <= 3; i++) {
        if (bannerData[`banner${i}`] && bannerPaintings[i - 1]) {
            bannerPaintings[i - 1].src = bannerData[`banner${i}`];
        }
    }
}

// Load gallery data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadGalleryData();
    loadBannerImages();
});
