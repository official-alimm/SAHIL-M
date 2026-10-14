/**
 * SAHIL & TASLEEMA — PREMIUM ENGAGEMENT INVITATION CONFIGURATION
 * ==============================================================
 * Central configuration file for all website content, dates, contacts,
 * music, database settings, and administrative credentials.
 * 
 * Edit this file to customize details without touching HTML or application logic.
 */

window.INVITATION_CONFIG = {
  // Couple Information
  couple: {
    groom: "Sahil",
    bride: "Tasleema",
    title: "Sahil & Tasleema",
    monogram: "S ✦ T",
    urduBismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    tagline: "Two Families • One Beautiful Beginning in Kashmir",
    hashtag: "#SahilWedsTasleema"
  },

  // Event Details
  event: {
    // ISO 8601 formatted event date with Indian Standard Time (+05:30)
    date: "2026-10-22T19:00:00+05:30",
    dateLabel: "Thursday, 22 October 2026",
    timeLabel: "7:00 PM IST",
    dayOfWeek: "Thursday",
    region: "Kashmir",
    venue: "Najan, Kashmir",
    venueStatus: "pending", // "pending" | "confirmed"
    venuePendingNotice: "Exact venue in Kashmir will be announced soon by the family",
    mapQuery: "Najan, Kashmir",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Najan%2C%20Kashmir",
    dressCode: "Kashmiri Traditional / Elegant Evening Formal (Pashmina, Velvet, Suits, Champagne Gold & Black)",
    calendarTitle: "Engagement of Sahil & Tasleema",
    calendarDescription: "Join the families of Sahil and Tasleema to celebrate their engagement in the Kashmir Valley. May Allah bless this sacred union."
  },

  // Detailed Evening Schedule
  schedule: [
    {
      time: "6:30 PM",
      title: "Warm Welcome & Kashmiri Sharbat",
      description: "Arrival of esteemed guests, welcome greetings by the Malla family, and traditional saffron kahwa & sharbat.",
      icon: "fa-mug-hot"
    },
    {
      time: "7:00 PM",
      title: "The Engagement Ceremony (Nishani)",
      description: "Exchange of rings, elder Duas, and formal exchange of sweets and blessings between the families.",
      icon: "fa-ring"
    },
    {
      time: "7:45 PM",
      title: "Family Photographs & Felicitations",
      description: "Cherished portrait moments with the couple, parents, family elders, and close friends.",
      icon: "fa-camera"
    },
    {
      time: "8:15 PM",
      title: "Traditional Kashmiri Wazwan Feast",
      description: "The grand seven-dish Wazwan feast served in traditional copper tramis with warm hospitalities.",
      icon: "fa-utensils"
    },
    {
      time: "9:30 PM",
      title: "Musical Evening & Rouf",
      description: "Soulful Kashmiri Sufiana music, celebratory songs, and joyous farewell blessings.",
      icon: "fa-music"
    }
  ],

  // Background Music Configuration
  music: {
    defaultPath: "music/engagement.mp3",
    title: "Engagement Celebration Theme",
    subtitle: "Sahil & Tasleema • Kashmir 2026",
    defaultVolume: 0.60, // 0.0 (silent) to 1.0 (loudest)
    loop: true,
    attemptAutoplay: true
  },

  // Family Contacts & WhatsApp RSVP
  contacts: {
    // Add family WhatsApp number with country code, digits only (e.g. "919906000000")
    whatsappNumber: "919906000000",
    familyRepresentative: "The Malla Family",
    contactPhone: "+91 (Kashmir)",
    rsvpDeadline: "15 October 2026"
  },

  // Security & Admin Credentials
  admin: {
    // Default PIN for the on-page administrator dashboard
    // Change this to your private PIN before publishing
    pin: "sahil2026"
  },

  // Backend Database Integration (Supabase)
  // Leave empty for local demo mode with browser storage.
  // When supplied, RSVPs and Wishes synchronize with your live cloud database!
  supabase: {
    url: "",      // e.g. "https://xyzcompany.supabase.co"
    anonKey: ""   // e.g. "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },

  // Urdu Translations Configuration
  urdu: {
    title: "ساحل اور تسلیمہ کی منگنی",
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    welcome: "دو خاندان، ایک خوبصورت آغاز۔ ہم آپ کو دل کی گہرائیوں سے شرکت کی دعوت دیتے ہیں۔",
    dateLabel: "جمعرات، ۲۲ اکتوبر ۲۰۲۶ • شام ۷:۰۰ بجے",
    venue: "نجن، کشمیر",
    rsvpBtn: "شرکت کی اطلاع دیں"
  }
};
