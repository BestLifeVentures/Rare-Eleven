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

// Update banner images
function updateBanner(bannerNumber) {
    const inputId = `banner${bannerNumber}`;
    const imageUrl = document.getElementById(inputId).value;

    if (!imageUrl) {
        alert('Please enter an image URL');
        return;
    }

    // Save banner images to localStorage
    let bannerData = JSON.parse(localStorage.getItem('bannerData') || '{}');
    bannerData[`banner${bannerNumber}`] = imageUrl;
    localStorage.setItem('bannerData', JSON.stringify(bannerData));

    alert(`Banner image ${bannerNumber} updated successfully!`);
    document.getElementById(inputId).value = '';
}

// Load banner data on page load
function loadBannerData() {
    const bannerData = JSON.parse(localStorage.getItem('bannerData') || '{}');

    for (let i = 1; i <= 3; i++) {
        const inputId = `banner${i}`;
        if (bannerData[`banner${i}`]) {
            document.getElementById(inputId).placeholder = 'Current: ' + bannerData[`banner${i}`].substring(0, 30) + '...';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadGalleryData();
    loadBannerData();
});

// Make updateBanner function globally accessible
window.updateBanner = updateBanner;
window.editArtwork = editArtwork;
window.deleteArtwork = deleteArtwork;
