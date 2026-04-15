document.addEventListener("DOMContentLoaded", () => {
    // 1. IntersectionObserver for reveal animations
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2 // Trigger when 20% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll(".animate");
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // 1.5. Play video only when in view
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target.tagName.toLowerCase() === 'video') {
                if (entry.isIntersecting) {
                    entry.target.play().catch(e => console.log("Autoplay blocked by browser policy: ", e));
                } else {
                    entry.target.pause();
                }
            }
        });
    }, { threshold: 0.3 });

    const conceptVideo = document.querySelector(".concept-video");
    if (conceptVideo) {
        videoObserver.observe(conceptVideo);
    }

    // 1.6. Custom hero video controls
    const heroVideo    = document.getElementById("heroVideo");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const muteBtn      = document.getElementById("muteBtn");

    if (heroVideo && playPauseBtn && muteBtn) {
        const iconPlay   = playPauseBtn.querySelector(".icon-play");
        const iconPause  = playPauseBtn.querySelector(".icon-pause");
        const iconMute   = muteBtn.querySelector(".icon-mute");
        const iconUnmute = muteBtn.querySelector(".icon-unmute");

        // Sync play/pause icon on any state change
        const syncPlayIcon = () => {
            const playing = !heroVideo.paused;
            iconPlay.style.display  = playing ? "none"  : "block";
            iconPause.style.display = playing ? "block" : "none";
        };

        heroVideo.addEventListener("play",  syncPlayIcon);
        heroVideo.addEventListener("pause", syncPlayIcon);
        syncPlayIcon(); // initial state

        playPauseBtn.addEventListener("click", () => {
            heroVideo.paused ? heroVideo.play() : heroVideo.pause();
        });

        // icon-mute   = 🔊 speaker WITH sound  → shown when UNMUTED  (click to mute)
        // icon-unmute = 🔇 speaker WITH slash   → shown when MUTED    (click to unmute)
        const syncMuteIcon = () => {
            const muted = heroVideo.muted;
            iconMute.style.display   = muted ? "none"  : "block";
            iconUnmute.style.display = muted ? "block" : "none";
        };

        syncMuteIcon(); // initial state

        muteBtn.addEventListener("click", () => {
            heroVideo.muted = !heroVideo.muted;
            syncMuteIcon();
        });

        // Autoplay with sound — browsers may block it.
        // If blocked, silently fall back to muted so video still plays,
        // and update icon so user knows they need to click to hear sound.
        heroVideo.play().catch(() => {
            heroVideo.muted = true;
            heroVideo.play().catch(() => {}); // last resort
            syncMuteIcon();
        });
    }

    // 2. Anti-theft measures
    // Disable right-click
    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
    document.addEventListener("keydown", (e) => {
        // F12
        if (e.key === "F12") {
            e.preventDefault();
        }
        
        // Ctrl/Cmd + Shift + I
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "i") {
            e.preventDefault();
        }
        
        // Ctrl/Cmd + U (View Source)
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
            e.preventDefault();
        }

        // Ctrl/Cmd + Shift + J
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "j") {
            e.preventDefault();
        }

        // Ctrl/Cmd + Shift + C
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") {
            e.preventDefault();
        }
    });

    // 3. Handle scroll indicator click
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator) {
        scrollIndicator.addEventListener("click", () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth"
            });
        });
    }

    // 4. Countdown Timer
    const countdownEl = document.getElementById("countdown-timer");
    if (countdownEl) {
        // Fixed deadline: April 20, 2026 23:59:59 IST (UTC+5:30)
        const targetDate = new Date("2026-04-20T23:59:59+05:30").getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                countdownEl.innerHTML = "This offer has expired.";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const pad = (num) => num.toString().padStart(2, "0");

            countdownEl.innerHTML = `<span>${pad(days)}</span> days <span>${pad(hours)}</span> hrs <span>${pad(minutes)}</span> mins <span>${pad(seconds)}</span> secs`;
        };

        // Initialize immediately to prevent flash, then set interval
        updateCountdown();
        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            if (targetDate - now < 0) {
                updateCountdown();
                clearInterval(countdownInterval);
            } else {
                updateCountdown();
            }
        }, 1000);
    }
});
