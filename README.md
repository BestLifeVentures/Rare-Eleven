# Rare Eleven - Modern Art Gallery Website

A luxury, minimalist art gallery website featuring a clean design with no animations, allowing the paintings to be the focal point.

## Features

### Main Website
- **Clean Header**: Features the Rare Eleven logo with cart and filter buttons
- **Museum Banner**: Displays 3 featured paintings in a museum-style layout
- **Gallery Portfolio**: Showcases artworks in a luxury wall setting with minimalist design
- **Filter System**: Filter artworks by Collections A, B, C, or D
- **Responsive Design**: Fully responsive across all devices

### Admin Panel
- **Secure Access**: Admin panel only accessible by searching "Alyssa Barresi" in the footer
- **Gallery Management**: Add, edit, and delete artworks
- **Banner Control**: Update the 3 featured banner paintings
- **Image Upload**: Support for both URL input and file upload
- **Real-time Updates**: Changes reflect immediately on the main site

## Color Scheme

The website uses a sophisticated brown and beige palette:
- **Kumera**: #936025 (Primary gold-brown)
- **Sepia**: #6F4616 (Dark brown accents)
- **Chocolate Brown**: #54350D (Deep brown for footer)
- **Luxury Beige**: #F5F1ED (Background)
- **Luxury Cream**: #E8E4DF (Accent backgrounds)
- **Luxury Nude**: #D4CEC7 (Wall colors)

## File Structure

```
Rare-Eleven/
├── index.html              # Main gallery page
├── admin.html              # Admin management panel
├── css/
│   ├── styles.css          # Main website styles
│   └── admin.css           # Admin panel styles
├── js/
│   ├── script.js           # Main website functionality
│   └── admin.js            # Admin panel functionality
├── assets/
│   ├── images/
│   │   ├── logo.png        # Rare Eleven logo
│   │   ├── banner1.jpg     # Banner painting 1
│   │   ├── banner2.jpg     # Banner painting 2
│   │   └── banner3.jpg     # Banner painting 3
│   └── gallery/
│       ├── painting1.jpg   # Gallery artworks
│       ├── painting2.jpg
│       └── ...
└── README.md
```

## Setup Instructions

### Option 1: Using Cloud Images (Recommended)

If you've uploaded images to cloud storage (Google Drive, Imgur, Cloudinary, etc.):

1. **Access Admin Panel**:
   - Open `index.html` in browser
   - Search "Alyssa Barresi" in footer

2. **Configure Banner**: Use cloud image URLs in "Hero Banner Paintings" section

3. **Add Gallery**: Use cloud URLs when adding artworks

📖 **See [CLOUD_SETUP.md](CLOUD_SETUP.md) for detailed cloud image instructions**

### Option 2: Using Local Files

1. **Add Your Logo**: Place your logo image at root as `logo.img` ✅ (Already done)

2. **Add Hero Background**: Place museum background at root as `hero.img` ✅ (Already done)

3. **Add Banner Images**: Place 3-4 banner images in `assets/images/`:
   - banner1.jpg
   - banner2.jpg
   - banner3.jpg
   - banner4.jpg (optional)

4. **Add Gallery Images**: Place artwork images in `assets/gallery/`:
   - painting1.jpg, painting2.jpg, etc.

5. **Open the Website**: Simply open `index.html` in a web browser

## Using the Admin Panel

### Accessing Admin
1. Scroll to the footer of the main page
2. In the search box, type: **Alyssa Barresi**
3. Press Enter
4. You'll be redirected to the admin panel

### Managing Artworks
1. **Add New Artwork**:
   - Fill in the artwork title
   - Enter the price
   - Select a collection (A, B, C, or D)
   - Enter an image URL or upload a file
   - Click "Add Artwork"

2. **Edit Existing Artwork**:
   - Click the "Edit" button on any artwork
   - Follow the prompts to update details

3. **Delete Artwork**:
   - Click the "Delete" button on any artwork
   - Confirm the deletion

### Managing Banner Images (Hero Wall)
1. Scroll to the "Hero Banner Paintings" section
2. For each painting (1-4):
   - Toggle "Enabled" to show/hide
   - Enter cloud image URL in "Image URL" field
   - Choose frame style (Classic, Gold, Dark, Modern, or None)
   - Set width (150-600px)
   - Adjust position (Left % and Top %)
3. Click "Save Banner Configuration" button
4. Refresh main page to see changes

**💡 Tip**: Use cloud image URLs for easy management!

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks, pure JS
- **localStorage**: For persistent data storage

## Design Philosophy

- **No Animations**: Clean, static design to let artwork shine
- **Minimalist Approach**: Simple, elegant layouts
- **Luxury Aesthetic**: High-end gallery feel with sophisticated colors
- **Performance**: Fast loading, no heavy frameworks
- **Accessibility**: Responsive design for all devices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All data is stored in browser localStorage
- Clearing browser data will reset the gallery to defaults
- For production use, consider integrating a backend database
- Image uploads are converted to base64 and stored in localStorage
- For better performance with many images, use external image hosting

## Future Enhancements

- Shopping cart functionality
- Payment integration
- User accounts
- Advanced search
- Image optimization
- Backend database integration
- Email notifications

## License

All rights reserved © 2024 Rare Eleven

---

For questions or support, contact the administrator.