# Sahil & Tasleema — Premium Engagement Invitation Website

A luxury, production-quality wedding and engagement invitation website crafted for **Sahil & Tasleema**.

- **Couple:** Sahil & Tasleema
- **Event Date:** Thursday, 22 October 2026 • 7:00 PM IST
- **Location:** Najan, Kashmir Valley
- **Design Theme:** Obsidian Black, Champagne Gold, Ivory & Kashmiri Floral Details

---

## Key Highlights & Features

### 1. Cinematic Hero Section
- Regal entrance animations with subtle ambient gold dust particles.
- Islamic calligraphy of *Bismillah Al-Rahman Al-Rahim* with English translation.
- Couple display typography with gold shimmer gradients.
- Live real-time countdown timer to **22 October 2026, 7:00 PM IST**.
- Personalized guest greeting banner: append `?guest=YourName` or `?to=YourName` to any link for a tailored welcome.
- Quick navigation buttons: *Explore The Day*, *Play Music*, and *Kindly RSVP*.

### 2. Professional Persistent Audio System
- Built on a Single-Page Application (SPA) architecture so navigating between sections **never reloads the document or interrupts music playback**.
- Default song: `music/engagement.mp3` (bundled and active).
- Floating luxury vinyl record disc widget that spins during playback.
- Dancing animated equalizer soundwave bars.
- Popover controls with scrubbable progress bar, current elapsed time, total duration, volume slider, mute toggle, and repeat loop toggle.
- Remembers user volume and playback preferences in `localStorage`.
- Autoplay handling: attempts autoplay on load; if modern browser policies restrict unmuted audio, displays an elegant *"Welcome to Our Celebration — Tap to Begin with Music"* overlay.
- Never displays "Playing" if the song is paused or failed.

### 3. Our Story & Milestones
- Spotlight cards for the groom (**Sahil**, featuring authentic photos) and bride (**Tasleema**).
- Interactive milestones timeline: *When Paths Crossed*, *The Thapbaer (Elder Consent)*, *The Engagement Ceremony*, and *Looking Ahead to Nikah*.
- Heartfelt welcome note and Quranic verse from Surah Ar-Rum (30:21).

### 4. Event Details & Kashmir Celebration Guide
- Large calendar badge for 22 October 2026.
- Venue information clearly noting: *"Exact venue in Kashmir will be announced soon by the family"*.
- Interactive action buttons:
  - **Get Directions:** Direct link to Google Maps.
  - **＋ Google Calendar:** Generates instant Google Calendar event with details.
  - **📥 Download .ICS:** Cross-platform iCalendar invitation file for Apple Calendar, Outlook, and Android.
  - **📋 Copy Details:** Copies formatted invitation text with toast confirmation.
- Detailed evening timeline (Welcome Kahwa, Ring Ceremony, Portraits, Wazwan Banquet, Sufi Music).
- Logistics guide: Kashmir October weather (~12°C - 16°C), traditional dress code, valet parking, and step-free accessibility.

### 5. Photo Gallery & Lightbox
- Responsive masonry/grid layout.
- Category filters: *All Photos*, *The Groom (Sahil)*, *Celebration & Rings*, and *Kashmir Autumn*.
- High-resolution fullscreen lightbox with Next/Previous navigation, keyboard arrow support (Left, Right, Escape), and mobile touch swipe.

### 6. Guest Wishes Wall (Wall of Love)
- Interactive guestbook where relatives and friends can write heartfelt Duas and congratulations.
- Quick blessing chips (*"Mubarak! 🎉"*, *"Barakallahu lakuma 🤲"*, *"Lots of love ❤️"*).
- Interactive heart reaction counter on each card.
- Anti-spam cooldown timer and client-side sanitization against XSS.

### 7. Comprehensive RSVP Experience
- Attendance toggle: *Joyfully Accepts* vs. *Regretfully Declines*.
- Number of guests selector (1 to 5+).
- Kashmiri Wazwan dietary preference selection (Traditional Wazwan vs. Vegetarian Wazwan).
- Optional phone number and personal note.
- Duplicate submission handling and instant gold celebration pass modal.
- Direct **"Send RSVP via WhatsApp"** button that pre-fills formatted attendance details into WhatsApp.

### 8. Digital Invitation Card & QR Code
- High-res digital invitation card with gold borders.
- Self-contained dynamic QR code generator (renders to Canvas without external dependencies, works 100% offline).
- **Download Card Image:** Generates a high-res PNG card ready for camera rolls and sharing.
- **Print Card:** Formatted print view.

### 9. Host Administrator Dashboard
- Security PIN protected (Default PIN: `sahil2026`, configurable in `config.js`).
- Live statistics cards: *Total RSVPs*, *Confirmed Attending*, *Declined*, and *Total Expected Headcount*.
- Searchable and filterable RSVP response table with delete actions.
- **Export to CSV:** Downloads a clean `.csv` spreadsheet of all guest responses.
- Live website settings editor with downloadable updated `config.js`.

### 10. Bilingual Interface (English & Urdu)
- One-click language toggle in top navigation (`EN` / `اردو`).
- Translates headings, Bismillah, welcoming texts, and buttons into Urdu with authentic RTL layout.

---

## File Structure

```
sahil-tasleema-invitation/
├── index.html           # Main Single-Page Application (SPA)
├── style.css            # Luxury obsidian black & champagne gold stylesheet
├── app.js               # Application logic, audio engine, router, and modules
├── config.js            # Central editable settings, dates, contacts, and PIN
├── story.html           # SPA bridge for backwards-compatible links
├── celebration.html     # SPA bridge for celebration links
├── gallery.html         # SPA bridge for gallery links
├── wishes.html          # SPA bridge for wishes links
├── rsvp.html            # SPA bridge for RSVP links
├── admin.html           # SPA bridge for admin links
├── README.md            # Project documentation and guide
├── music/
│   └── engagement.mp3   # Default celebratory song (bundled)
├── assets/
│   ├── photos/
│   │   ├── sahil-portrait-1.jpg  # Groom photo (Sahil)
│   │   ├── sahil-portrait-2.png  # Groom photo (Sahil)
│   │   └── sahil-portrait-3.png  # Groom photo (Sahil)
│   └── icons/
│       └── decorations.svg       # Scalable gold SVG ornaments & corners
└── backend/
    ├── schema.sql       # PostgreSQL / Supabase SQL schema with RLS policies
    └── README.md        # 5-minute cloud database setup guide
```

---

## How to Preview & Open

### Option A: Direct Browser Preview
1. Double-click `index.html` in your file explorer.
2. It will open in Chrome, Edge, Safari, Firefox, or any mobile browser.

### Option B: Local Web Server (Recommended)
If you have Node.js or Python installed:
```bash
# Using Node:
npx serve .

# Or using Python:
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## Deployment to Free Hosting Platforms

### 1. Vercel
1. Install Vercel CLI: `npm i -g vercel` (or link your GitHub repository on [vercel.com](https://vercel.com)).
2. Run `vercel` inside this directory and accept default settings.
3. Your website will be live worldwide on a fast HTTPS domain in seconds!

### 2. Netlify
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `sahil-tasleema-invitation` folder into the browser window.
3. Your invitation will be published instantly with a custom shareable link.

### 3. GitHub Pages
1. Push the code to a GitHub repository named `sahil-tasleema-invitation`.
2. Go to **Settings > Pages > Source > main branch / root**.
3. Your site will be live at `https://<username>.github.io/sahil-tasleema-invitation/`.

---

## Customizing Settings in `config.js`

To customize details without writing any code, open `config.js` in any text editor:

```javascript
window.INVITATION_CONFIG = {
  couple: {
    groom: "Sahil",
    bride: "Tasleema"
  },
  event: {
    date: "2026-10-22T19:00:00+05:30",
    venue: "Najan, Kashmir"
  },
  contacts: {
    whatsappNumber: "919906000000" // Family WhatsApp for RSVP
  },
  admin: {
    pin: "sahil2026" // Change host PIN
  }
};
```
