// Gallery data stored in localStorage
let galleryData = [];

// Initialize default gallery data
const defaultGalleryData = [
    {
        id: 1,
        title: "Abstract Expression",
        price: 2500,
        category: "a",
        image: "assets/gallery/painting1.jpg"
    },
    {
        id: 2,
        title: "Modern Minimalism",
        price: 3200,
        category: "b",
        image: "assets/gallery/painting2.jpg"
    },
    {
        id: 3,
        title: "Contemporary Vision",
        price: 2800,
        category: "a",
        image: "assets/gallery/painting3.jpg"
    },
    {
        id: 4,
        title: "Urban Landscape",
        price: 4100,
        category: "c",
        image: "assets/gallery/painting4.jpg"
    },
    {
        id: 5,
        title: "Ethereal Dreams",
        price: 3600,
        category: "d",
        image: "assets/gallery/painting5.jpg"
    },
    {
        id: 6,
        title: "Bold Strokes",
        price: 2900,
        category: "b",
        image: "assets/gallery/painting6.jpg"
    }
];

// Load gallery data from localStorage or use default
function loadGalleryData() {
    const saved = localStorage.getItem('galleryData');
    if (saved) {
        galleryData = JSON.parse(saved);
    } else {
        galleryData = [...defaultGalleryData];
        saveGalleryData();
    }
    displayCurrentArtworks();
}

// Save gallery data to localStorage
function saveGalleryData() {
    localStorage.setItem('galleryData', JSON.stringify(galleryData));
}

// Display current artworks in admin panel
function displayCurrentArtworks() {
    const container = document.getElementById('currentArtworks');
    container.innerHTML = '';

    if (galleryData.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No artworks in gallery yet.</p>';
        return;
    }

    galleryData.forEach(artwork => {
        const card = document.createElement('div');
        card.className = 'artwork-card';
        card.innerHTML = `
            <img src="${artwork.image}" alt="${artwork.title}">
            <div class="artwork-details">
                <h3>${artwork.title}</h3>
                <p class="artwork-price">$${artwork.price.toLocaleString()}</p>
                <span class="artwork-category">Collection ${artwork.category.toUpperCase()}</span>
            </div>
            <div class="artwork-actions">
                <button class="edit-btn" onclick="editArtwork(${artwork.id})">Edit</button>
                <button class="delete-btn" onclick="deleteArtwork(${artwork.id})">Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Add new artwork
document.getElementById('addArtworkForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('artworkTitle').value;
    const price = parseFloat(document.getElementById('artworkPrice').value);
    const category = document.getElementById('artworkCategory').value;
    let imageUrl = document.getElementById('artworkImage').value;
    const imageFile = document.getElementById('artworkImageFile').files[0];

    // Handle file upload
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imageUrl = event.target.result;
            addArtworkToGallery(title, price, category, imageUrl);
        };
        reader.readAsDataURL(imageFile);
    } else {
        addArtworkToGallery(title, price, category, imageUrl);
    }
});

function addArtworkToGallery(title, price, category, imageUrl) {
    const newArtwork = {
        id: Date.now(), // Use timestamp as unique ID
        title: title,
        price: price,
        category: category,
        image: imageUrl
    };

    galleryData.push(newArtwork);
    saveGalleryData();
    displayCurrentArtworks();

    // Reset form
    document.getElementById('addArtworkForm').reset();

    alert('Artwork added successfully!');
}

// Edit artwork
function editArtwork(id) {
    const artwork = galleryData.find(item => item.id === id);
    if (!artwork) return;

    const newTitle = prompt('Enter new title:', artwork.title);
    if (newTitle === null) return;

    const newPrice = prompt('Enter new price:', artwork.price);
    if (newPrice === null) return;

    const newCategory = prompt('Enter new category (a, b, c, or d):', artwork.category);
    if (newCategory === null) return;

    const newImage = prompt('Enter new image URL:', artwork.image);
    if (newImage === null) return;

    // Update artwork
    artwork.title = newTitle || artwork.title;
    artwork.price = parseFloat(newPrice) || artwork.price;
    artwork.category = newCategory || artwork.category;
    artwork.image = newImage || artwork.image;

    saveGalleryData();
    displayCurrentArtworks();

    alert('Artwork updated successfully!');
}

// Delete artwork
function deleteArtwork(id) {
    if (!confirm('Are you sure you want to delete this artwork?')) return;

    galleryData = galleryData.filter(item => item.id !== id);
    saveGalleryData();
    displayCurrentArtworks();

    alert('Artwork deleted successfully!');
}

// Save Banner Configuration (Advanced)
async function saveBannerConfiguration() {
    const bannerConfig = {
        paintings: []
    };

    // Process each painting
    const promises = [];

    for (let i = 1; i <= 4; i++) {
        const enabled = document.getElementById(`painting${i}-enabled`).checked;
        const urlInput = document.getElementById(`painting${i}-url`).value;
        const fileInput = document.getElementById(`painting${i}-file`).files[0];
        const frame = document.getElementById(`painting${i}-frame`).value;
        const width = document.getElementById(`painting${i}-width`).value;
        const left = document.getElementById(`painting${i}-left`).value;
        const top = document.getElementById(`painting${i}-top`).value;

        // Create a promise for this painting
        const promise = new Promise((resolve) => {
            // Check if file is uploaded
            if (fileInput) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    resolve({
                        enabled: enabled,
                        url: event.target.result, // base64 data
                        frame: frame,
                        width: parseInt(width) || 350,
                        left: parseInt(left) || 0,
                        top: parseInt(top) || 0
                    });
                };
                reader.readAsDataURL(fileInput);
            } else {
                // No file uploaded, use URL
                resolve({
                    enabled: enabled,
                    url: urlInput,
                    frame: frame,
                    width: parseInt(width) || 350,
                    left: parseInt(left) || 0,
                    top: parseInt(top) || 0
                });
            }
        });

        promises.push(promise);
    }

    // Wait for all files to be processed
    bannerConfig.paintings = await Promise.all(promises);

    // Save to localStorage
    localStorage.setItem('bannerConfig', JSON.stringify(bannerConfig));

    alert('Banner configuration saved successfully! Refresh the main page to see changes.');
}

// Load Banner Configuration
function loadBannerConfiguration() {
    const savedConfig = localStorage.getItem('bannerConfig');

    if (savedConfig) {
        const config = JSON.parse(savedConfig);

        config.paintings.forEach((painting, index) => {
            const i = index + 1;

            if (document.getElementById(`painting${i}-enabled`)) {
                document.getElementById(`painting${i}-enabled`).checked = painting.enabled;
            }
            if (painting.url && document.getElementById(`painting${i}-url`)) {
                document.getElementById(`painting${i}-url`).value = painting.url;
            }
            if (document.getElementById(`painting${i}-frame`)) {
                document.getElementById(`painting${i}-frame`).value = painting.frame || 'classic';
            }
            if (document.getElementById(`painting${i}-width`)) {
                document.getElementById(`painting${i}-width`).value = painting.width || 350;
            }
            if (document.getElementById(`painting${i}-left`)) {
                document.getElementById(`painting${i}-left`).value = painting.left || 0;
            }
            if (document.getElementById(`painting${i}-top`)) {
                document.getElementById(`painting${i}-top`).value = painting.top || 0;
            }
        });
    }
}

// Upload Logo
function uploadLogo() {
    const fileInput = document.getElementById('logoFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a logo file first');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const logoData = event.target.result;

        // Save to localStorage
        localStorage.setItem('siteLogo', logoData);

        // Update preview
        document.getElementById('currentLogoPreview').src = logoData;

        alert('Logo uploaded successfully! Refresh the main page to see it.');

        // Clear file input
        fileInput.value = '';
    };

    reader.readAsDataURL(file);
}

// Load Logo Preview
function loadLogoPreview() {
    const savedLogo = localStorage.getItem('siteLogo');
    const previewImg = document.getElementById('currentLogoPreview');

    if (savedLogo && previewImg) {
        previewImg.src = savedLogo;
    }
}

// Load logo in header
function loadHeaderLogo() {
    const savedLogo = localStorage.getItem('siteLogo');
    const logoElements = document.querySelectorAll('.logo');

    if (savedLogo && logoElements.length > 0) {
        logoElements.forEach(logo => {
            logo.src = savedLogo;
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadGalleryData();
    loadBannerConfiguration();
    loadLogoPreview();
    loadHeaderLogo();
});

// Make functions globally accessible
window.uploadLogo = uploadLogo;
window.saveBannerConfiguration = saveBannerConfiguration;
window.editArtwork = editArtwork;
window.deleteArtwork = deleteArtwork;
