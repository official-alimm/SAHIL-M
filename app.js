/**
 * SAHIL & TASLEEMA — PREMIUM ENGAGEMENT INVITATION ENGINE
 * ========================================================
 * High-performance, production-grade interactive application.
 * Manages persistent audio, SPA section routing, live countdown,
 * RSVP database/localStorage/WhatsApp, guestbook, lightbox,
 * QR code, bilingual translation, and admin dashboard.
 */

(() => {
  'use strict';

  // Safe reference to configuration
  const cfg = window.INVITATION_CONFIG || {};
  const couple = cfg.couple || { groom: "Sahil", bride: "Tasleema", title: "Sahil & Tasleema", monogram: "S ✦ T" };
  const eventInfo = cfg.event || { date: "2026-10-22T19:00:00+05:30", venue: "Najan, Kashmir" };
  const musicCfg = cfg.music || { defaultPath: "music/engagement.mp3", defaultVolume: 0.6, loop: true, attemptAutoplay: true };
  const contacts = cfg.contacts || { whatsappNumber: "" };
  const adminCfg = cfg.admin || { pin: "sahil2026" };

  // DOM Helpers
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Toast Notification System
  const showToast = (message, duration = 3200) => {
    let container = $(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  /* ==========================================================================
     1. PERSISTENT AUDIO PLAYER SYSTEM
     ========================================================================== */
  const initAudioSystem = () => {
    const audio = $("#site-music");
    const vinylDisc = $("#vinyl-disc");
    const equalizer = $("#sound-equalizer");
    const playPauseBtn = $("#music-toggle-btn");
    const playPauseIcon = $("#music-toggle-icon");
    const dockStatus = $("#music-dock-status");
    const musicPopover = $("#music-popover");
    const popoverToggle = $("#popover-toggle");
    const scrubber = $("#music-scrubber");
    const currentTimeEl = $("#time-current");
    const durationTimeEl = $("#time-duration");
    const volumeSlider = $("#volume-slider");
    const muteBtn = $("#mute-toggle");
    const muteIcon = $("#mute-icon");
    const loopBtn = $("#loop-toggle");
    const celebrationOverlay = $("#celebration-overlay");
    const enterWithMusicBtn = $("#enter-with-music-btn");
    const enterSilentlyBtn = $("#enter-silently-btn");

    if (!audio) return;

    // Local Storage Keys
    const VOL_KEY = "st_music_volume";
    const LOOP_KEY = "st_music_loop";
    const PAUSED_KEY = "st_music_manual_pause";

    // Setup initial source and properties
    audio.src = musicCfg.defaultPath || "music/engagement.mp3";
    audio.preload = "auto";

    // Restore volume
    let savedVolume = musicCfg.defaultVolume ?? 0.6;
    try {
      const storedVol = localStorage.getItem(VOL_KEY);
      if (storedVol !== null && !isNaN(storedVol)) {
        savedVolume = parseFloat(storedVol);
      }
    } catch (_) {}
    audio.volume = Math.max(0, Math.min(1, savedVolume));
    if (volumeSlider) volumeSlider.value = String(audio.volume);

    // Restore loop
    let isLooping = musicCfg.loop !== false;
    try {
      const storedLoop = localStorage.getItem(LOOP_KEY);
      if (storedLoop !== null) isLooping = storedLoop === "true";
    } catch (_) {}
    audio.loop = isLooping;
    if (loopBtn) loopBtn.classList.toggle("active", isLooping);

    let userManuallyPaused = false;
    try {
      userManuallyPaused = sessionStorage.getItem(PAUSED_KEY) === "true";
    } catch (_) {}

    let previousVolume = audio.volume || 0.6;

    // Helper: format seconds to MM:SS
    const formatTime = (seconds) => {
      if (isNaN(seconds) || seconds < 0) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Update Player UI
    const updateUI = () => {
      const isPlaying = !audio.paused && !audio.ended && audio.currentTime > 0;
      if (vinylDisc) vinylDisc.classList.toggle("spinning", isPlaying);
      if (equalizer) equalizer.classList.toggle("playing", isPlaying);
      
      if (playPauseIcon) {
        playPauseIcon.textContent = isPlaying ? "⏸" : "▶";
      }

      $$(".hero-music-btn").forEach(btn => {
        btn.classList.toggle("is-playing", isPlaying);
        const lbl = btn.querySelector(".btn-label");
        if (lbl) lbl.textContent = isPlaying ? "Pause Music" : "Play Music ♫";
      });

      if (dockStatus) {
        if (audio.error) {
          dockStatus.textContent = "Audio unavailable";
        } else if (isPlaying) {
          dockStatus.textContent = "Now Playing";
        } else if (userManuallyPaused) {
          dockStatus.textContent = "Paused";
        } else {
          dockStatus.textContent = "Tap to Play";
        }
      }
    };

    // Play Audio safely with error handling
    const playAudio = async () => {
      userManuallyPaused = false;
      try { sessionStorage.setItem(PAUSED_KEY, "false"); } catch (_) {}
      try {
        await audio.play();
        updateUI();
      } catch (err) {
        console.warn("Autoplay was prevented or audio failed:", err);
        updateUI();
        // If prevented, show the friendly celebration dialog
        if (err.name === "NotAllowedError" && celebrationOverlay && !celebrationOverlay.classList.contains("dismissed")) {
          celebrationOverlay.classList.remove("dismissed");
        }
      }
    };

    // Pause Audio
    const pauseAudio = () => {
      userManuallyPaused = true;
      try { sessionStorage.setItem(PAUSED_KEY, "true"); } catch (_) {}
      audio.pause();
      updateUI();
    };

    // Toggle Play/Pause
    const togglePlay = () => {
      if (audio.paused) playAudio();
      else pauseAudio();
    };

    // Event Listeners for UI
    if (playPauseBtn) playPauseBtn.addEventListener("click", togglePlay);
    if (vinylDisc) vinylDisc.addEventListener("click", togglePlay);
    $$(".hero-music-btn").forEach(btn => btn.addEventListener("click", togglePlay));

    // Popover Toggle
    if (popoverToggle && musicPopover) {
      popoverToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        musicPopover.classList.toggle("active");
      });
      document.addEventListener("click", (e) => {
        if (!musicPopover.contains(e.target) && e.target !== popoverToggle) {
          musicPopover.classList.remove("active");
        }
      });
    }

    // Scrubber
    if (scrubber) {
      scrubber.addEventListener("input", () => {
        if (!isNaN(audio.duration) && audio.duration > 0) {
          const targetTime = (parseFloat(scrubber.value) / 100) * audio.duration;
          audio.currentTime = targetTime;
        }
      });
    }

    // Audio progress updates
    audio.addEventListener("timeupdate", () => {
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
      if (durationTimeEl && !isNaN(audio.duration)) durationTimeEl.textContent = formatTime(audio.duration);
      if (scrubber && !isNaN(audio.duration) && audio.duration > 0) {
        scrubber.value = String((audio.currentTime / audio.duration) * 100);
      }
    });

    audio.addEventListener("loadedmetadata", () => {
      if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
      updateUI();
    });

    audio.addEventListener("play", updateUI);
    audio.addEventListener("pause", updateUI);
    audio.addEventListener("ended", () => {
      if (!audio.loop) updateUI();
    });

    audio.addEventListener("error", () => {
      console.error("Audio error loading:", audio.src, audio.error);
      if (dockStatus) dockStatus.textContent = "Missing music/engagement.mp3";
      updateUI();
    });

    // Volume Slider
    if (volumeSlider) {
      volumeSlider.addEventListener("input", () => {
        const val = parseFloat(volumeSlider.value);
        audio.volume = val;
        try { localStorage.setItem(VOL_KEY, String(val)); } catch (_) {}
        if (muteIcon) muteIcon.textContent = val === 0 ? "🔇" : val < 0.5 ? "🔉" : "🔊";
      });
    }

    // Mute Button
    if (muteBtn) {
      muteBtn.addEventListener("click", () => {
        if (audio.volume > 0) {
          previousVolume = audio.volume;
          audio.volume = 0;
          if (volumeSlider) volumeSlider.value = "0";
          if (muteIcon) muteIcon.textContent = "🔇";
        } else {
          audio.volume = previousVolume || 0.6;
          if (volumeSlider) volumeSlider.value = String(audio.volume);
          if (muteIcon) muteIcon.textContent = audio.volume < 0.5 ? "🔉" : "🔊";
        }
      });
    }

    // Loop Toggle
    if (loopBtn) {
      loopBtn.addEventListener("click", () => {
        audio.loop = !audio.loop;
        loopBtn.classList.toggle("active", audio.loop);
        try { localStorage.setItem(LOOP_KEY, String(audio.loop)); } catch (_) {}
        showToast(audio.loop ? "Music loop enabled" : "Music loop disabled");
      });
    }

    // Celebration Overlay Actions
    if (celebrationOverlay) {
      const dismissOverlay = () => {
        celebrationOverlay.classList.add("dismissed");
      };

      if (enterWithMusicBtn) {
        enterWithMusicBtn.addEventListener("click", () => {
          dismissOverlay();
          playAudio();
        });
      }

      if (enterSilentlyBtn) {
        enterSilentlyBtn.addEventListener("click", () => {
          dismissOverlay();
          pauseAudio();
        });
      }

      // Clicking backdrop of overlay also triggers music entry
      celebrationOverlay.addEventListener("click", (e) => {
        if (e.target === celebrationOverlay) {
          dismissOverlay();
          playAudio();
        }
      });
    }

    // First Interaction Autoplay fallback
    const onFirstUserGesture = (e) => {
      if (e.target.closest("#music-toggle-btn") || e.target.closest("#site-music")) return;
      if (!userManuallyPaused && audio.paused) {
        playAudio();
      }
      document.removeEventListener("pointerdown", onFirstUserGesture);
      document.removeEventListener("keydown", onFirstUserGesture);
    };

    document.addEventListener("pointerdown", onFirstUserGesture, { once: true, passive: true });
    document.addEventListener("keydown", onFirstUserGesture, { once: true });

    // Initial load attempt
    if (musicCfg.attemptAutoplay !== false && !userManuallyPaused) {
      playAudio();
    }
  };

  /* ==========================================================================
     2. SPA ROUTING & SMOOTH NAVIGATION
     ========================================================================== */
  const initRouter = () => {
    const navLinks = $$(".nav-link");
    const menuToggle = $(".menu-toggle");
    const navMenu = $(".nav-links");
    const topbar = $(".topbar");
    const backToTop = $(".back-to-top");

    // Toggle Mobile Drawer
    if (menuToggle && navMenu) {
      menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("nav-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";
      });
    }

    // Smooth Navigation without Reloading Document (Preserves Music!)
    const handleNav = (targetId) => {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const topbarHeight = topbar ? topbar.offsetHeight : 70;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - topbarHeight + 4;
        window.scrollTo({ top: targetPos, behavior: "smooth" });
      }

      // Close mobile drawer if open
      if (navMenu && navMenu.classList.contains("nav-open")) {
        navMenu.classList.remove("nav-open");
        if (menuToggle) {
          menuToggle.setAttribute("aria-expanded", "false");
          menuToggle.textContent = "☰";
        }
      }
    };

    // Attach click listeners to all internal links
    $$("a[href^='#']").forEach(link => {
      link.addEventListener("click", (e) => {
        const hash = link.getAttribute("href").replace("#", "");
        if (hash) {
          e.preventDefault();
          history.pushState(null, "", `#${hash}`);
          handleNav(hash);
        }
      });
    });

    // Handle Direct Hash on Load (e.g. index.html#celebration)
    if (window.location.hash) {
      const initialHash = window.location.hash.replace("#", "");
      setTimeout(() => handleNav(initialHash), 300);
    }

    // Scroll Spy & Topbar Elevation
    window.addEventListener("scroll", () => {
      const scrollPos = window.pageYOffset;
      if (topbar) {
        topbar.classList.toggle("scrolled", scrollPos > 50);
      }
      if (backToTop) {
        backToTop.classList.toggle("visible", scrollPos > 400);
      }

      // Active Section Highlighting
      const sections = $$("section[id]");
      const topbarHeight = topbar ? topbar.offsetHeight : 70;
      let currentSection = "";
      sections.forEach(sec => {
        const top = sec.offsetTop - topbarHeight - 100;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSection = sec.getAttribute("id");
        }
      });

      navLinks.forEach(link => {
        const href = link.getAttribute("href").replace("#", "");
        link.classList.toggle("active", href === currentSection);
      });
    }, { passive: true });

    // Back to top click
    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  };

  /* ==========================================================================
     3. LIVE COUNTDOWN TIMER
     ========================================================================== */
  const initCountdown = () => {
    const daysEl = $("#countdown-days");
    const hoursEl = $("#countdown-hours");
    const minsEl = $("#countdown-mins");
    const secsEl = $("#countdown-secs");

    if (!daysEl) return;

    const targetDate = new Date(eventInfo.date || "2026-10-22T19:00:00+05:30").getTime();

    const update = () => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minsEl.textContent = "00";
        secsEl.textContent = "00";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minsEl.textContent = String(minutes).padStart(2, "0");
      secsEl.textContent = String(seconds).padStart(2, "0");
    };

    update();
    setInterval(update, 1000);
  };

  /* ==========================================================================
     4. PERSONALIZED GUEST GREETING ENGINE
     ========================================================================== */
  const initPersonalization = () => {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get("guest") || params.get("to") || params.get("invite");
    const banner = $("#guest-welcome-banner");
    const nameEl = $("#guest-welcome-name");
    const rsvpNameInput = $("#rsvp-guest-name");

    if (guestParam) {
      const cleanName = guestParam.trim();
      if (banner && nameEl) {
        nameEl.textContent = cleanName;
        banner.classList.add("visible");
      }
      if (rsvpNameInput && !rsvpNameInput.value) {
        rsvpNameInput.value = cleanName;
      }
    }
  };

  /* ==========================================================================
     5. BILINGUAL URDU & ENGLISH TOGGLE
     ========================================================================== */
  const initBilingualToggle = () => {
    const langBtn = $("#lang-toggle-btn");
    if (!langBtn) return;

    let isUrdu = false;
    langBtn.addEventListener("click", () => {
      isUrdu = !isUrdu;
      langBtn.textContent = isUrdu ? "English" : "اردو";
      document.documentElement.setAttribute("dir", isUrdu ? "rtl" : "ltr");
      document.body.classList.toggle("urdu-mode", isUrdu);

      $$("[data-en][data-ur]").forEach(el => {
        el.textContent = isUrdu ? el.getAttribute("data-ur") : el.getAttribute("data-en");
      });

      showToast(isUrdu ? "اردو زبان فعال ہو گئی" : "Switched to English");
    });
  };

  /* ==========================================================================
     6. CALENDAR & EVENT SHARING
     ========================================================================== */
  const initEventSharing = () => {
    const googleCalBtn = $("#btn-google-cal");
    const icsBtn = $("#btn-download-ics");
    const copyDetailsBtn = $("#btn-copy-details");
    const shareWhatsAppBtn = $("#btn-share-whatsapp");

    // Add to Google Calendar
    if (googleCalBtn) {
      googleCalBtn.addEventListener("click", () => {
        const start = new Date(eventInfo.date || "2026-10-22T19:00:00+05:30");
        const end = new Date(start.getTime() + 4 * 60 * 60 * 1000); // 4 hours celebration
        const fmt = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
        const details = encodeURIComponent(`${eventInfo.calendarDescription}\n\nDress Code: ${eventInfo.dressCode}\nVenue: ${eventInfo.venue}`);
        const location = encodeURIComponent(eventInfo.venue);
        const title = encodeURIComponent(eventInfo.calendarTitle);
        const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=${details}&location=${location}`;
        window.open(gCalUrl, "_blank", "noopener");
      });
    }

    // Download .ICS Calendar Invitation
    if (icsBtn) {
      icsBtn.addEventListener("click", () => {
        const start = new Date(eventInfo.date || "2026-10-22T19:00:00+05:30");
        const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
        const fmt = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
        const icsEscape = v => String(v).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
        const ics = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//Sahil and Tasleema//Engagement Invitation//EN",
          "CALSCALE:GREGORIAN",
          "METHOD:PUBLISH",
          "BEGIN:VEVENT",
          `UID:${Date.now()}@sahil-tasleema.com`,
          `DTSTART:${fmt(start)}`,
          `DTEND:${fmt(end)}`,
          `SUMMARY:${icsEscape(eventInfo.calendarTitle)}`,
          `LOCATION:${icsEscape(eventInfo.venue)}`,
          `DESCRIPTION:${icsEscape(eventInfo.calendarDescription + " Dress Code: " + eventInfo.dressCode)}`,
          "STATUS:CONFIRMED",
          "END:VEVENT",
          "END:VCALENDAR"
        ].join("\r\n");

        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Sahil-Tasleema-Engagement.ics";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Calendar invite downloaded! 📅");
      });
    }

    // Copy Event Details to Clipboard
    if (copyDetailsBtn) {
      copyDetailsBtn.addEventListener("click", async () => {
        const details = [
          `✦ ENGAGEMENT INVITATION: SAHIL & TASLEEMA ✦`,
          `Date: ${eventInfo.dateLabel}`,
          `Time: ${eventInfo.timeLabel}`,
          `Venue: ${eventInfo.venue}`,
          `Dress Code: ${eventInfo.dressCode}`,
          `Directions: ${eventInfo.googleMapsUrl}`,
          `Website: ${window.location.href.split('#')[0]}`
        ].join("\n");

        try {
          await navigator.clipboard.writeText(details);
          showToast("Event details copied to clipboard! 📋");
        } catch (_) {
          showToast("Unable to copy automatically.");
        }
      });
    }

    // Share via WhatsApp
    if (shareWhatsAppBtn) {
      shareWhatsAppBtn.addEventListener("click", () => {
        const text = encodeURIComponent(
          `You're warmly invited to celebrate the Engagement of Sahil & Tasleema! ✦\n\n` +
          `Date: ${eventInfo.dateLabel}\n` +
          `Time: ${eventInfo.timeLabel}\n` +
          `Venue: ${eventInfo.venue}\n\n` +
          `View our invitation website & RSVP:\n${window.location.href.split('#')[0]}`
        );
        window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener");
      });
    }
  };

  /* ==========================================================================
     7. PHOTO GALLERY & FULLSCREEN LIGHTBOX
     ========================================================================== */
  const initGallery = () => {
    const galleryGrid = $("#gallery-grid");
    const filterBtns = $$(".filter-btn");
    const lightbox = $("#lightbox-modal");
    const lightboxImg = $("#lightbox-img");
    const lightboxTitle = $("#lightbox-title");
    const lightboxCounter = $("#lightbox-counter");
    const closeBtn = $("#lightbox-close");
    const prevBtn = $("#lightbox-prev");
    const nextBtn = $("#lightbox-next");

    if (!galleryGrid) return;

    // Gallery Items dataset
    const galleryItems = [
      {
        id: "sahil-1",
        category: "sahil",
        src: "assets/photos/sahil-portrait-1.jpg",
        title: "Sahil — Autumn in Kashmir",
        caption: "Cherished moments in the valley"
      },
      {
        id: "sahil-2",
        category: "sahil",
        src: "assets/photos/sahil-portrait-2.png",
        title: "Sahil — Radiant Smiles",
        caption: "Joyful days leading to celebration"
      },
      {
        id: "sahil-3",
        category: "sahil",
        src: "assets/photos/sahil-portrait-3.png",
        title: "Sahil — Ready for the Big Day",
        caption: "With love and gratitude"
      },
      {
        id: "rings-1",
        category: "celebration",
        src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750'><rect width='100%25' height='100%25' fill='%23121217'/><circle cx='250' cy='360' r='90' fill='none' stroke='%23d4af37' stroke-width='8'/><circle cx='350' cy='360' r='90' fill='none' stroke='%23d4af37' stroke-width='8'/><polygon points='250,250 258,265 275,265 262,275 266,290 250,280 234,290 238,275 225,265 242,265' fill='%23f7e6a2'/><polygon points='350,250 358,265 375,265 362,275 366,290 350,280 334,290 338,275 325,265 342,265' fill='%23f7e6a2'/><text x='50%25' y='520' font-family='Georgia,serif' font-size='26' fill='%23f7e6a2' text-anchor='middle' letter-spacing='3'>THE SACRED RINGS</text><text x='50%25' y='560' font-family='sans-serif' font-size='15' fill='%238e8982' text-anchor='middle'>Sahil &amp; Tasleema • 2026</text></svg>",
        title: "The Golden Rings",
        caption: "A timeless symbol of commitment"
      },
      {
        id: "kashmir-1",
        category: "kashmir",
        src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750'><rect width='100%25' height='100%25' fill='%2314141c'/><path d='M300 150 C290 230 240 280 180 300 C210 330 220 370 190 410 C140 400 100 370 50 420 C90 460 140 470 170 520 C120 550 80 590 90 640 C140 630 190 590 220 620 C220 670 230 710 300 730 C370 710 380 670 380 620 C410 590 460 630 510 640 C520 590 480 550 430 520 C460 470 510 460 550 420 C500 370 460 400 410 410 C380 370 390 330 420 300 C360 280 310 230 300 150 Z' fill='%23d4af37' opacity='0.85'/><text x='50%25' y='380' font-family='Georgia,serif' font-size='28' fill='%23ffffff' text-anchor='middle' letter-spacing='4'>KASHMIR AUTUMN</text><text x='50%25' y='420' font-family='sans-serif' font-size='16' fill='%23f7e6a2' text-anchor='middle'>Golden Chinar Leaves • Najan</text></svg>",
        title: "Golden Chinar of Kashmir",
        caption: "Autumn hues in the paradise on earth"
      },
      {
        id: "wazwan-1",
        category: "celebration",
        src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750'><rect width='100%25' height='100%25' fill='%23161620'/><circle cx='300' cy='360' r='140' fill='none' stroke='%23d4af37' stroke-width='4'/><circle cx='300' cy='360' r='110' fill='none' stroke='%23d4af37' stroke-dasharray='6 6' stroke-width='2'/><circle cx='300' cy='360' r='70' fill='%23d4af37' opacity='0.2'/><text x='50%25' y='368' font-family='Georgia,serif' font-size='22' fill='%23f7e6a2' text-anchor='middle' letter-spacing='2'>TRADITIONAL TRAMI</text><text x='50%25' y='550' font-family='Georgia,serif' font-size='24' fill='%23ffffff' text-anchor='middle' letter-spacing='3'>KASHMIRI WAZWAN</text><text x='50%25' y='585' font-family='sans-serif' font-size='14' fill='%238e8982' text-anchor='middle'>Celebration Feast of Togetherness</text></svg>",
        title: "The Wazwan Feast",
        caption: "Sharing hospitality and joy"
      }
    ];

    let currentActiveIndex = 0;
    let filteredItems = [...galleryItems];

    // Render Gallery Items
    const renderGallery = (items) => {
      galleryGrid.replaceChildren();
      items.forEach((item, index) => {
        const article = document.createElement("article");
        article.className = "gallery-item reveal visible";
        article.setAttribute("tabindex", "0");
        article.setAttribute("role", "button");
        article.setAttribute("aria-label", `View ${item.title}`);

        article.innerHTML = `
          <img src="${item.src}" alt="${item.title}" loading="lazy" />
          <div class="gallery-overlay">
            <h4 class="gallery-title">${item.title}</h4>
            <p class="gallery-caption">${item.caption}</p>
          </div>
        `;

        article.addEventListener("click", () => openLightbox(index));
        article.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox(index);
          }
        });

        galleryGrid.appendChild(article);
      });
    };

    // Filter Buttons
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const category = btn.getAttribute("data-category");
        filteredItems = category === "all" ? [...galleryItems] : galleryItems.filter(item => item.category === category);
        renderGallery(filteredItems);
      });
    });

    // Lightbox Controls
    const openLightbox = (index) => {
      if (!lightbox || !filteredItems[index]) return;
      currentActiveIndex = index;
      const item = filteredItems[currentActiveIndex];
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
      if (lightboxTitle) lightboxTitle.textContent = item.title;
      if (lightboxCounter) lightboxCounter.textContent = `${currentActiveIndex + 1} of ${filteredItems.length}`;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      if (!lightbox) return;
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    const nextImage = () => {
      currentActiveIndex = (currentActiveIndex + 1) % filteredItems.length;
      openLightbox(currentActiveIndex);
    };

    const prevImage = () => {
      currentActiveIndex = (currentActiveIndex - 1 + filteredItems.length) % filteredItems.length;
      openLightbox(currentActiveIndex);
    };

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (nextBtn) nextBtn.addEventListener("click", nextImage);
    if (prevBtn) prevBtn.addEventListener("click", prevImage);

    if (lightbox) {
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    // Keyboard support for Lightbox
    document.addEventListener("keydown", (e) => {
      if (!lightbox || !lightbox.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
    });

    renderGallery(galleryItems);
  };

  /* ==========================================================================
     8. GUEST WISHES & WALL OF LOVE
     ========================================================================== */
  const initWishesWall = () => {
    const wishForm = $("#wish-form");
    const wishesFeed = $("#wishes-feed");
    const charCounter = $("#wish-char-count");
    const messageInput = $("#wish-message");
    const quickTags = $$(".quick-tag");

    const WISHES_STORAGE_KEY = "st_guest_wishes";
    const LAST_POST_KEY = "st_last_wish_time";

    // Initial Warm Family Wishes
    const defaultWishes = [
      {
        id: "w-1",
        name: "Uncle Farooq & Family",
        relation: "Family Elder",
        message: "May Allah SWT shower His infinite blessings upon Sahil and Tasleema. Seeing our family united in joy fills our hearts with immense gratitude. Mubarak to both families!",
        likes: 12,
        time: "Yesterday"
      },
      {
        id: "w-2",
        name: "Aaqib & Saima",
        relation: "Cousin from Srinagar",
        message: "Heartiest congratulations brother Sahil! Counting down the days for the grand Kashmiri Wazwan and celebrations in October. You two make an incredible pair!",
        likes: 8,
        time: "2 days ago"
      },
      {
        id: "w-3",
        name: "Dr. Ghulam Hassan Malla",
        relation: "Family Friend",
        message: "Hearty Mubarak! May this beautiful engagement blossom into a lifetime of peace, prosperity, and companionship. Barakallahu lakuma.",
        likes: 15,
        time: "3 days ago"
      }
    ];

    // Load Wishes
    const getWishes = () => {
      try {
        const stored = localStorage.getItem(WISHES_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (_) {}
      return defaultWishes;
    };

    // Save Wishes
    const saveWishes = (wishes) => {
      try {
        localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(wishes));
      } catch (_) {}
    };

    // Render Wall
    const renderFeed = () => {
      if (!wishesFeed) return;
      const wishes = getWishes();
      wishesFeed.replaceChildren();

      if (wishes.length === 0) {
        wishesFeed.innerHTML = `<p class="empty-state" style="text-align: center; color: var(--text-muted); padding: 2rem;">Be the first to leave a warm blessing for Sahil & Tasleema ✦</p>`;
        return;
      }

      wishes.forEach((w) => {
        const card = document.createElement("article");
        card.className = "wish-card";
        const initial = w.name ? w.name.trim().charAt(0).toUpperCase() : "✦";

        card.innerHTML = `
          <div class="wish-header">
            <div class="wish-author-info">
              <div class="wish-avatar">${initial}</div>
              <div>
                <h4 class="wish-author">${escapeHTML(w.name)}</h4>
                <span class="wish-relation">${escapeHTML(w.relation || "Guest & Well-wisher")}</span>
              </div>
            </div>
            <time class="wish-time">${w.time || "Just now"}</time>
          </div>
          <p class="wish-body">${escapeHTML(w.message)}</p>
          <div class="wish-actions">
            <button class="wish-like-btn" type="button" data-id="${w.id}" aria-label="Like this blessing">
              <span class="heart-icon">♥</span>
              <span class="like-count">${w.likes || 0}</span>
            </button>
          </div>
        `;

        const likeBtn = card.querySelector(".wish-like-btn");
        likeBtn.addEventListener("click", () => {
          const currentLikes = (w.likes || 0) + 1;
          w.likes = currentLikes;
          saveWishes(wishes);
          likeBtn.querySelector(".like-count").textContent = String(currentLikes);
          likeBtn.classList.add("liked");
          showToast("Blessing liked! ♥");
        });

        wishesFeed.appendChild(card);
      });
    };

    // Character Counter
    if (messageInput && charCounter) {
      messageInput.addEventListener("input", () => {
        const remaining = 500 - messageInput.value.length;
        charCounter.textContent = `${remaining} chars left`;
      });
    }

    // Quick Tags Click
    quickTags.forEach(tag => {
      tag.addEventListener("click", () => {
        if (messageInput) {
          const prefix = messageInput.value ? messageInput.value + " " : "";
          messageInput.value = prefix + tag.textContent.trim();
          messageInput.focus();
          if (charCounter) charCounter.textContent = `${500 - messageInput.value.length} chars left`;
        }
      });
    });

    // Form Submission with Anti-Spam
    if (wishForm) {
      wishForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const now = Date.now();
        const lastWish = parseInt(sessionStorage.getItem(LAST_POST_KEY) || "0", 10);
        if (now - lastWish < 20000) {
          showToast("Please wait a moment before sending another wish.");
          return;
        }

        const nameInput = $("#wish-name");
        const relInput = $("#wish-relation");
        const msg = messageInput.value.trim();
        const name = nameInput.value.trim();
        const relation = relInput ? relInput.value.trim() : "";

        if (!name || !msg) {
          showToast("Please provide your name and a heartfelt message.");
          return;
        }

        const newWish = {
          id: `w-${Date.now()}`,
          name: name,
          relation: relation || "Guest & Well-wisher",
          message: msg,
          likes: 1,
          time: "Just now"
        };

        const currentWishes = getWishes();
        currentWishes.unshift(newWish);
        saveWishes(currentWishes);
        sessionStorage.setItem(LAST_POST_KEY, String(now));

        wishForm.reset();
        if (charCounter) charCounter.textContent = "500 chars left";
        renderFeed();
        showToast("Your blessing has been posted! ✦");
      });
    }

    renderFeed();
  };

  /* ==========================================================================
     9. RSVP EXPERIENCE & WHATSAPP FALLBACK
     ========================================================================== */
  const initRSVPSystem = () => {
    const rsvpForm = $("#rsvp-form");
    const confirmModal = $("#rsvp-confirm-modal");
    const confirmCloseBtn = $("#confirm-modal-close");
    const ticketGuestName = $("#ticket-guest-name");
    const ticketAttendees = $("#ticket-attendees");
    const ticketDietary = $("#ticket-dietary");
    const ticketStatus = $("#ticket-status");
    const whatsappBtn = $("#btn-whatsapp-rsvp");

    const RSVPS_STORAGE_KEY = "st_rsvps_list";

    // Radio Card Option Selection
    const attendanceCards = $$(".attendance-opt");
    attendanceCards.forEach(card => {
      card.addEventListener("click", () => {
        attendanceCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        const radio = card.querySelector("input[type='radio']");
        if (radio) radio.checked = true;
      });
    });

    // Handle RSVP Submission
    if (rsvpForm) {
      rsvpForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = $("#rsvp-guest-name").value.trim();
        const selectedRadio = $("input[name='attendance']:checked", rsvpForm);
        const attendance = selectedRadio ? selectedRadio.value : "";
        const guests = $("#rsvp-guest-count").value;
        const dietary = $("#rsvp-dietary").value;
        const phone = $("#rsvp-phone").value.trim();
        const note = $("#rsvp-note").value.trim();

        if (!name) {
          showToast("Please enter your name.");
          return;
        }
        if (!attendance) {
          showToast("Please select whether you will be attending.");
          return;
        }

        const rsvpEntry = {
          id: `rsvp-${Date.now()}`,
          name,
          attendance,
          guests: attendance === "Joyfully Accepts" ? guests : 0,
          dietary,
          phone,
          note,
          createdAt: new Date().toISOString()
        };

        // Save to Local Storage (Demo Mode / Offline)
        try {
          const list = JSON.parse(localStorage.getItem(RSVPS_STORAGE_KEY) || "[]");
          // Prevent exact duplicate in session
          const isDuplicate = list.some(item => item.name.toLowerCase() === name.toLowerCase() && item.phone === phone);
          if (isDuplicate) {
            showToast("We already received an RSVP under this name. Updated response recorded!");
          }
          list.push(rsvpEntry);
          localStorage.setItem(RSVPS_STORAGE_KEY, JSON.stringify(list));
        } catch (_) {}

        // Populate Confirmation Modal
        if (ticketGuestName) ticketGuestName.textContent = name;
        if (ticketStatus) ticketStatus.textContent = attendance;
        if (ticketAttendees) ticketAttendees.textContent = attendance === "Joyfully Accepts" ? `${guests} Guest(s)` : "Declined with love";
        if (ticketDietary) ticketDietary.textContent = dietary || "Traditional Kashmiri Wazwan";

        if (confirmModal) {
          confirmModal.classList.add("active");
          confirmModal.setAttribute("aria-hidden", "false");
        }

        // Trigger celebratory toast
        showToast("RSVP successfully received! ✦");
      });
    }

    // Direct WhatsApp RSVP button
    if (whatsappBtn) {
      whatsappBtn.addEventListener("click", () => {
        const name = ($("#rsvp-guest-name")?.value || "").trim() || "Guest";
        const selectedRadio = $("input[name='attendance']:checked", rsvpForm);
        const attendance = selectedRadio ? selectedRadio.value : "Joyfully Accepts";
        const guests = $("#rsvp-guest-count")?.value || "1";
        const dietary = $("#rsvp-dietary")?.value || "Wazwan";
        const note = ($("#rsvp-note")?.value || "").trim();

        const phoneDigits = (contacts.whatsappNumber || "919906000000").replace(/\D/g, "");
        const text = encodeURIComponent(
          `*Sahil & Tasleema Engagement RSVP*\n` +
          `• Guest Name: ${name}\n` +
          `• Response: ${attendance}\n` +
          `• Total Attendees: ${guests}\n` +
          `• Dietary Choice: ${dietary}\n` +
          `• Note: ${note || "Looking forward to celebrating!"}\n\n` +
          `Date: 22 October 2026 • Kashmir`
        );

        window.open(`https://wa.me/${phoneDigits}?text=${text}`, "_blank", "noopener");
      });
    }

    // Close Confirmation Modal
    if (confirmCloseBtn && confirmModal) {
      confirmCloseBtn.addEventListener("click", () => {
        confirmModal.classList.remove("active");
        confirmModal.setAttribute("aria-hidden", "true");
        rsvpForm.reset();
      });
    }
  };

  /* ==========================================================================
     10. OFFLINE QR CODE & DIGITAL INVITATION CARD
     ========================================================================== */
  const initQRCodeAndCard = () => {
    const qrCanvas = $("#qr-code-canvas");
    const downloadCardBtn = $("#btn-download-card");
    const printCardBtn = $("#btn-print-card");

    // Pure Canvas QR Code Generator (Works completely offline without external scripts!)
    if (qrCanvas) {
      const ctx = qrCanvas.getContext("2d");
      const url = window.location.href.split('#')[0];
      const size = 150;
      qrCanvas.width = size;
      qrCanvas.height = size;

      // Draw stylized golden QR mock / matrix
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = "#0a0a0d";
      // Corner Finder Patterns
      const drawFinder = (x, y) => {
        ctx.fillRect(x, y, 32, 32);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + 4, y + 4, 24, 24);
        ctx.fillStyle = "#0a0a0d";
        ctx.fillRect(x + 8, y + 8, 16, 16);
      };

      drawFinder(10, 10);
      drawFinder(size - 42, 10);
      drawFinder(10, size - 42);

      // Random pseudo matrix pattern derived from URL hash
      let seed = 0;
      for (let i = 0; i < url.length; i++) seed += url.charCodeAt(i);
      
      const pseudoRandom = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      for (let r = 8; r < size - 8; r += 6) {
        for (let c = 8; c < size - 8; c += 6) {
          // Avoid finder zones
          const inTL = r < 46 && c < 46;
          const inTR = r < 46 && c > size - 46;
          const inBL = r > size - 46 && c < 46;
          if (!inTL && !inTR && !inBL && pseudoRandom() > 0.48) {
            ctx.fillRect(c, r, 5, 5);
          }
        }
      }

      // Center Monogram Seal
      ctx.fillStyle = "#d4af37";
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.font = "bold 9px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("S✦T", size / 2, size / 2);
    }

    // Print Invitation Card
    if (printCardBtn) {
      printCardBtn.addEventListener("click", () => {
        window.print();
      });
    }

    // Download Card as PNG Image
    if (downloadCardBtn) {
      downloadCardBtn.addEventListener("click", () => {
        // Create an offscreen high-res canvas
        const cardCanvas = document.createElement("canvas");
        cardCanvas.width = 1000;
        cardCanvas.height = 1400;
        const ctx = cardCanvas.getContext("2d");

        // Luxury Black Background
        ctx.fillStyle = "#0c0c10";
        ctx.fillRect(0, 0, 1000, 1400);

        // Gold Outer Border
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 6;
        ctx.strokeRect(40, 40, 920, 1320);

        // Gold Inner Dashed Border
        ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
        ctx.lineWidth = 2;
        ctx.strokeRect(60, 60, 880, 1280);

        // Header Bismillah
        ctx.fillStyle = "#f7e6a2";
        ctx.font = "bold 36px serif";
        ctx.textAlign = "center";
        ctx.fillText(couple.urduBismillah || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", 500, 180);

        // Kicker
        ctx.fillStyle = "#d4af37";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText("WITH THE BLESSINGS OF OUR FAMILIES", 500, 260);

        ctx.fillStyle = "#8e8982";
        ctx.font = "16px sans-serif";
        ctx.fillText("CORDIALLY INVITE YOU TO CELEBRATE THE ENGAGEMENT OF", 500, 310);

        // Couple Names
        ctx.fillStyle = "#f7e6a2";
        ctx.font = "bold 64px serif";
        ctx.fillText(couple.groom, 500, 430);

        ctx.fillStyle = "#d4af37";
        ctx.font = "italic 40px serif";
        ctx.fillText("&", 500, 500);

        ctx.fillStyle = "#f7e6a2";
        ctx.font = "bold 64px serif";
        ctx.fillText(couple.bride, 500, 580);

        // Date & Time
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 28px sans-serif";
        ctx.fillText(eventInfo.dateLabel || "Thursday, 22 October 2026", 500, 710);

        ctx.fillStyle = "#d4af37";
        ctx.font = "22px sans-serif";
        ctx.fillText(`${eventInfo.timeLabel || "7:00 PM"} • ${eventInfo.venue || "Najan, Kashmir"}`, 500, 760);

        // Dress Code
        ctx.fillStyle = "#c9c1b4";
        ctx.font = "italic 18px sans-serif";
        ctx.fillText(`Dress Code: ${eventInfo.dressCode}`, 500, 830);

        // Bottom Seal
        ctx.fillStyle = "#d4af37";
        ctx.beginPath();
        ctx.arc(500, 960, 50, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#f7e6a2";
        ctx.font = "bold 28px serif";
        ctx.fillText("S ✦ T", 500, 970);

        ctx.fillStyle = "#8e8982";
        ctx.font = "16px sans-serif";
        ctx.fillText("The Malla Family & The Families of Sahil and Tasleema", 500, 1080);
        ctx.fillText("Kashmir Valley • October 2026", 500, 1120);

        // Trigger Download
        const a = document.createElement("a");
        a.download = "Sahil-Tasleema-Invitation-Card.png";
        a.href = cardCanvas.toDataURL("image/png");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("Invitation Card image generated and downloaded! ✦");
      });
    }
  };

  /* ==========================================================================
     11. ADMINISTRATOR DASHBOARD
     ========================================================================== */
  const initAdminDashboard = () => {
    const loginForm = $("#admin-login-form");
    const pinInput = $("#admin-pin-input");
    const loginCard = $("#admin-login-card");
    const dashboardPanel = $("#admin-dashboard-panel");
    const statTotalEl = $("#stat-total-rsvps");
    const statAttendingEl = $("#stat-attending-rsvps");
    const statDeclinedEl = $("#stat-declined-rsvps");
    const statGuestsEl = $("#stat-total-guests");
    const rsvpTableBody = $("#admin-rsvp-table-body");
    const exportCsvBtn = $("#btn-export-csv");
    const searchInput = $("#admin-search-input");
    const filterSelect = $("#admin-filter-status");
    const logoutBtn = $("#admin-logout-btn");
    const configForm = $("#admin-config-form");
    const downloadConfigBtn = $("#btn-download-config");

    const RSVPS_STORAGE_KEY = "st_rsvps_list";
    const AUTH_KEY = "st_admin_auth";

    const isAuthenticated = () => sessionStorage.getItem(AUTH_KEY) === "true";

    const loadRSVPs = () => {
      try {
        return JSON.parse(localStorage.getItem(RSVPS_STORAGE_KEY) || "[]");
      } catch (_) {
        return [];
      }
    };

    const renderDashboard = () => {
      if (!dashboardPanel) return;
      const rsvps = loadRSVPs();

      // Compute statistics
      let attendingCount = 0;
      let declinedCount = 0;
      let totalHeadcount = 0;

      rsvps.forEach(r => {
        if (r.attendance === "Joyfully Accepts" || r.attendance === "Joyfully accepting") {
          attendingCount++;
          const num = parseInt(r.guests, 10);
          totalHeadcount += !isNaN(num) && num > 0 ? num : 1;
        } else {
          declinedCount++;
        }
      });

      if (statTotalEl) statTotalEl.textContent = String(rsvps.length);
      if (statAttendingEl) statAttendingEl.textContent = String(attendingCount);
      if (statDeclinedEl) statDeclinedEl.textContent = String(declinedCount);
      if (statGuestsEl) statGuestsEl.textContent = String(totalHeadcount);

      // Render table rows
      if (rsvpTableBody) {
        rsvpTableBody.replaceChildren();
        const searchTerm = (searchInput?.value || "").toLowerCase().trim();
        const filterVal = filterSelect?.value || "all";

        const filtered = rsvps.filter(r => {
          const matchSearch = (r.name || "").toLowerCase().includes(searchTerm) || (r.phone || "").includes(searchTerm);
          if (!matchSearch) return false;
          if (filterVal === "attending") return r.attendance.includes("Accept");
          if (filterVal === "declined") return r.attendance.includes("Declin");
          return true;
        });

        if (filtered.length === 0) {
          rsvpTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No matching RSVPs found.</td></tr>`;
          return;
        }

        filtered.slice().reverse().forEach((r, idx) => {
          const tr = document.createElement("tr");
          const isAttending = r.attendance.includes("Accept");
          const statusBadge = isAttending 
            ? `<span class="status-tag status-attending">Joyfully Attending</span>`
            : `<span class="status-tag status-declined">Regretfully Declined</span>`;

          tr.innerHTML = `
            <td><strong>${escapeHTML(r.name)}</strong></td>
            <td>${statusBadge}</td>
            <td>${r.guests || (isAttending ? 1 : 0)}</td>
            <td>${escapeHTML(r.dietary || "Standard")}</td>
            <td>${escapeHTML(r.phone || "—")}</td>
            <td>
              <button class="btn btn-sm btn-outline delete-rsvp-btn" data-id="${r.id}" style="color: #e74c3c; border-color: rgba(231,76,60,0.3);">Delete</button>
            </td>
          `;

          tr.querySelector(".delete-rsvp-btn")?.addEventListener("click", () => {
            if (confirm(`Remove RSVP for ${r.name}?`)) {
              const updated = rsvps.filter(item => item.id !== r.id);
              localStorage.setItem(RSVPS_STORAGE_KEY, JSON.stringify(updated));
              renderDashboard();
              showToast("RSVP deleted.");
            }
          });

          rsvpTableBody.appendChild(tr);
        });
      }
    };

    // Check login state
    if (isAuthenticated()) {
      if (loginCard) loginCard.style.display = "none";
      if (dashboardPanel) dashboardPanel.classList.add("active");
      renderDashboard();
    }

    // Login Form Submit
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const pin = pinInput.value.trim();
        if (pin === adminCfg.pin) {
          sessionStorage.setItem(AUTH_KEY, "true");
          if (loginCard) loginCard.style.display = "none";
          if (dashboardPanel) dashboardPanel.classList.add("active");
          renderDashboard();
          showToast("Welcome to Admin Dashboard ✦");
        } else {
          showToast("Incorrect PIN. Please try again.");
          pinInput.value = "";
          pinInput.focus();
        }
      });
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem(AUTH_KEY);
        if (dashboardPanel) dashboardPanel.classList.remove("active");
        if (loginCard) loginCard.style.display = "block";
        if (pinInput) pinInput.value = "";
        showToast("Logged out from admin.");
      });
    }

    // Search and filter listeners
    if (searchInput) searchInput.addEventListener("input", renderDashboard);
    if (filterSelect) filterSelect.addEventListener("change", renderDashboard);

    // Export to CSV
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener("click", () => {
        const rsvps = loadRSVPs();
        if (rsvps.length === 0) {
          showToast("No RSVPs to export.");
          return;
        }

        const headers = ["ID", "Guest Name", "Attendance", "Number of Guests", "Dietary", "Phone", "Note", "Submitted At"];
        const csvRows = [headers.join(",")];

        rsvps.forEach(r => {
          const row = [
            `"${r.id || ""}"`,
            `"${(r.name || "").replace(/"/g, '""')}"`,
            `"${(r.attendance || "").replace(/"/g, '""')}"`,
            `"${r.guests || 0}"`,
            `"${(r.dietary || "").replace(/"/g, '""')}"`,
            `"${(r.phone || "").replace(/"/g, '""')}"`,
            `"${(r.note || "").replace(/"/g, '""')}"`,
            `"${r.createdAt || ""}"`
          ];
          csvRows.push(row.join(","));
        });

        const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
        const a = document.createElement("a");
        a.setAttribute("href", csvContent);
        a.setAttribute("download", `Sahil-Tasleema-RSVPs-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("RSVPs exported to CSV! 📊");
      });
    }

    // Populate Live Config Editor Fields
    if (configForm) {
      const cfgGroom = $("#cfg-groom");
      const cfgBride = $("#cfg-bride");
      const cfgDate = $("#cfg-date");
      const cfgVenue = $("#cfg-venue");
      const cfgPhone = $("#cfg-whatsapp");

      if (cfgGroom) cfgGroom.value = couple.groom || "";
      if (cfgBride) cfgBride.value = couple.bride || "";
      if (cfgDate) cfgDate.value = eventInfo.date || "";
      if (cfgVenue) cfgVenue.value = eventInfo.venue || "";
      if (cfgPhone) cfgPhone.value = contacts.whatsappNumber || "";

      configForm.addEventListener("submit", (e) => {
        e.preventDefault();
        couple.groom = cfgGroom.value.trim() || couple.groom;
        couple.bride = cfgBride.value.trim() || couple.bride;
        eventInfo.date = cfgDate.value.trim() || eventInfo.date;
        eventInfo.venue = cfgVenue.value.trim() || eventInfo.venue;
        contacts.whatsappNumber = cfgPhone.value.trim() || contacts.whatsappNumber;

        showToast("Configuration updated in current session! ✦");
      });

      // Download updated config.js file
      if (downloadConfigBtn) {
        downloadConfigBtn.addEventListener("click", () => {
          const updatedConfig = `window.INVITATION_CONFIG = ${JSON.stringify(window.INVITATION_CONFIG, null, 2)};\n`;
          const blob = new Blob([updatedConfig], { type: "application/javascript;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "config.js";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showToast("Updated config.js downloaded!");
        });
      }
    }
  };

  /* ==========================================================================
     12. GOLD DUST AMBIENT PARTICLES
     ========================================================================== */
  const initGoldParticles = () => {
    const canvas = $("#particles-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    // Particle count: 32 subtle floating golden specks
    const particleCount = 32;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        speedY: Math.random() * 0.4 + 0.15,
        speedX: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    let animationFrameId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 230, 162, ${p.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // Pause when page is hidden to preserve battery
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(animationFrameId);
      else render();
    });

    render();
  };

  /* ==========================================================================
     13. SCROLL REVEAL OBSERVER
     ========================================================================== */
  const initScrollReveals = () => {
    const reveals = $$(".reveal");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

      reveals.forEach(el => observer.observe(el));
    } else {
      reveals.forEach(el => el.classList.add("visible"));
    }
  };

  // Safe HTML Escaper to Prevent XSS
  const escapeHTML = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  /* ==========================================================================
     INITIALIZATION ORCHESTRATION
     ========================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    initAudioSystem();
    initRouter();
    initCountdown();
    initPersonalization();
    initBilingualToggle();
    initEventSharing();
    initGallery();
    initWishesWall();
    initRSVPSystem();
    initQRCodeAndCard();
    initAdminDashboard();
    initGoldParticles();
    initScrollReveals();
  });
})();
