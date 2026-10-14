# Backend & Cloud Database Setup Guide

This project includes dual-mode backend architecture:
1. **Local Demo Mode (Default):** Runs immediately in any browser without configuration. Responses and wishes are stored securely in browser `localStorage`.
2. **Cloud Database Mode (Supabase):** Connects to a free, production-grade PostgreSQL database hosted on [Supabase](https://supabase.com). Responses and guest wishes are synchronized globally across all devices in real-time.

---

## 5-Minute Supabase Setup

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create or log in to your account.
2. Click **"New Project"**.
3. Choose a name: `sahil-tasleema-invitation`.
4. Enter a secure database password.
5. Select a region close to your guests (e.g., *South Asia / Mumbai*).
6. Click **"Create new project"** (takes ~1-2 minutes).

### Step 2: Run the Database Schema
1. In your Supabase Dashboard, click on **"SQL Editor"** in the left sidebar.
2. Click **"New query"**.
3. Open `backend/schema.sql` from this project, copy its entire contents, and paste them into the query editor.
4. Click **"Run"** (or press Ctrl + Enter).
5. You should see `Success. No rows returned`.

### Step 3: Copy Your API Credentials
1. In your Supabase Dashboard, click the **Settings icon** (bottom left) -> **API**.
2. Copy the **Project URL** (e.g., `https://abcdefghijklm.supabase.co`).
3. Copy the **Project API keys: `anon` `public`** key.

### Step 4: Add Credentials to `config.js`
Open `config.js` in a text editor and paste the values into the `supabase` section:

```javascript
supabase: {
  url: "https://your-project.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Save `config.js`. Refresh your website, and your RSVPs and Guest Wishes will now save directly to your live cloud database!

---

## Direct WhatsApp RSVP Fallback
Even without a cloud database, guests can click the **"Send RSVP via WhatsApp Directly"** button on the RSVP card. This pre-fills their attendance response, guest count, dietary choice, and personal message directly into the family's WhatsApp chat without requiring any server setup.

Configure the family WhatsApp number in `config.js`:
```javascript
contacts: {
  whatsappNumber: "919906000000" // Country code + 10 digits, no spaces or symbols
}
```
