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

// Load banner configuration from localStorage
function loadBannerConfiguration() {
    const savedConfig = localStorage.getItem('bannerConfig');

    if (savedConfig) {
        const config = JSON.parse(savedConfig);

        config.paintings.forEach((painting, index) => {
            const paintingElement = document.getElementById(`painting-${index + 1}`);

            if (paintingElement) {
                // Show/hide painting based on enabled state
                if (painting.enabled) {
                    paintingElement.classList.remove('hidden');

                    // Set image URL if provided
                    const img = paintingElement.querySelector('.framed-img');
                    if (painting.url && img) {
                        img.src = painting.url;
                    }

                    // Set frame style
                    const frameBorder = paintingElement.querySelector('.frame-border');
                    if (frameBorder) {
                        // Remove all frame classes
                        frameBorder.classList.remove('frame-style-classic', 'frame-style-gold', 'frame-style-dark', 'frame-style-modern', 'frame-style-none');
                        // Add selected frame class
                        frameBorder.classList.add(`frame-style-${painting.frame}`);
                    }

                    // Set position and size
                    paintingElement.style.width = `${painting.width}px`;
                    paintingElement.style.left = `${painting.left}%`;
                    paintingElement.style.top = `${painting.top}%`;
                } else {
                    paintingElement.classList.add('hidden');
                }
            }
        });
    } else {
        // Default positioning if no config exists
        setDefaultBannerPositions();
    }
}

// Set default banner positions
function setDefaultBannerPositions() {
    const defaultPositions = [
        { width: 350, left: 5, top: 20 },
        { width: 350, left: 35, top: 20 },
        { width: 350, left: 65, top: 20 }
    ];

    defaultPositions.forEach((pos, index) => {
        const paintingElement = document.getElementById(`painting-${index + 1}`);
        if (paintingElement) {
            paintingElement.style.width = `${pos.width}px`;
            paintingElement.style.left = `${pos.left}%`;
            paintingElement.style.top = `${pos.top}%`;
        }
    });
}

// Load logo from localStorage
function loadLogo() {
    const savedLogo = localStorage.getItem('siteLogo');
    const logoElements = document.querySelectorAll('.logo');

    if (savedLogo && logoElements.length > 0) {
        logoElements.forEach(logo => {
            logo.src = savedLogo;
        });
    }
}

// Load gallery data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadGalleryData();
    loadBannerConfiguration();
    loadLogo();
});
