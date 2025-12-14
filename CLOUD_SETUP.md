# Setting Up Images from Cloud Storage

Since you've uploaded your images to cloud storage, here's how to use them on your Rare Eleven website:

## Quick Start Guide

### Step 1: Get Your Image URLs

From your cloud storage (Google Drive, Imgur, Cloudinary, etc.), get the **direct image URLs** for:
- Your logo (logo.img should already be in the root folder)
- Hero background (hero.img should already be in the root folder)
- Banner paintings (3-4 images)
- Gallery artworks (as many as you want)

**Important**: Make sure the URLs are **direct image links** that end in `.jpg`, `.png`, or `.webp`. Not preview pages!

### Step 2: Configure Banner Paintings

1. **Open the website**: Open `index.html` in your browser
2. **Access Admin Panel**:
   - Scroll to the footer
   - In the search box, type: `Alyssa Barresi`
   - Press Enter
3. **Scroll to "Hero Banner Paintings"** section
4. **For each painting (1-4)**:
   - Toggle it **Enabled** (if you want to show it)
   - **Paste the cloud image URL** in "Image URL" field
   - Choose a **Frame Style**
   - Adjust **Width** (150-600px)
   - Set **Position** (Left % and Top %)
5. **Click "Save Banner Configuration"**
6. **Refresh the main page**

### Step 3: Add Gallery Artworks

1. In the **Admin Panel**, scroll to **"Add New Artwork"**
2. Fill in:
   - **Artwork Title**
   - **Price**
   - **Collection** (A, B, C, or D)
   - **Image URL**: Paste your cloud image URL
3. Click **"Add Artwork"**
4. Repeat for all gallery pieces
5. **Refresh main page** to see updates

## Cloud Storage Setup (Getting Direct URLs)

### Google Drive
1. Upload image to Google Drive
2. Right-click → Get link → Set to "Anyone with the link"
3. Copy the file ID from the URL (the long string)
4. Use this format: `https://drive.google.com/uc?export=view&id=YOUR_FILE_ID`

### Imgur
1. Upload image to Imgur
2. Right-click on image → "Copy image address"
3. Use that URL directly

### Cloudinary
1. Upload to Cloudinary
2. Copy the image URL from the dashboard
3. Use directly

### Dropbox
1. Upload to Dropbox
2. Get shareable link
3. Change `?dl=0` at the end to `?raw=1`

## Troubleshooting

### Images Not Showing?

**Check 1**: Are you using direct image URLs?
- ✅ Good: `https://i.imgur.com/abc123.jpg`
- ❌ Bad: `https://imgur.com/abc123` (this is a page, not an image)

**Check 2**: Are images publicly accessible?
- Make sure cloud images are set to "public" or "anyone with link"

**Check 3**: Did you save the configuration?
- In admin panel, click "Save Banner Configuration"
- For gallery, click "Add Artwork"

**Check 4**: Did you refresh the page?
- After saving in admin, refresh `index.html`

### Testing Image URLs

Before adding to admin, test your URL:
1. Copy the URL
2. Paste it in a new browser tab
3. You should see ONLY the image, nothing else
4. If it works in browser, it will work on the site

## File Structure (Optional - Local Setup)

If you prefer to use local files instead of cloud:

```
Rare-Eleven/
├── logo.img              ← Your logo (already added)
├── hero.img              ← Museum background (already added)
├── assets/
│   ├── images/
│   │   ├── banner1.jpg   ← Add banner images here
│   │   ├── banner2.jpg
│   │   ├── banner3.jpg
│   │   └── banner4.jpg
│   └── gallery/
│       ├── painting1.jpg ← Add gallery images here
│       ├── painting2.jpg
│       └── ...
```

Then you won't need to configure anything in the admin - just open `index.html`!

## Default Images

The website has default paths for:
- Banner: `assets/images/banner1.jpg`, `banner2.jpg`, `banner3.jpg`
- Gallery: `assets/gallery/painting1.jpg`, etc.

**If these files don't exist**, you'll see broken images until you:
1. Add files to these locations, OR
2. Configure cloud URLs through admin panel

## Next Steps

1. ✅ Upload images to cloud storage
2. ✅ Get direct image URLs
3. ⬜ Configure banner through admin panel
4. ⬜ Add gallery artworks through admin panel
5. ⬜ Refresh and enjoy!

## Need Help?

If images still aren't showing:
1. Open browser console (F12)
2. Check for any error messages
3. Verify image URLs are accessible
4. Make sure you clicked "Save" in admin panel
5. Try refreshing the page (Ctrl+R or Cmd+R)
