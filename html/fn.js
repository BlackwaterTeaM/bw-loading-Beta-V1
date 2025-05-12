// --- START OF PREMIUM JAVASCRIPT ---

document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Rambo3Dev Elite Loading Experience...");

    // --- Global State & Configuration ---
    const config = {
        introDuration: 8000, // ms before auto-skip intro
        notificationDuration: 7000, // ms notifications stay visible
        notificationInterval: 15000, // ms between new tips/notifications
        fpsUpdateInterval: 1000, // ms for FPS counter update
        serverDataPollInterval: 30000, // ms to re-fetch server data
        connectionTestTimeout: 5000, // ms timeout for connection tests
        debugMode: false, // Set to true for more console logs
    };

    let state = {
        currentSection: 'welcome',
        musicPlaying: false,
        currentTrackIndex: 0,
        isMuted: false,
        userVolume: 0.7,
        sfxVolume: 0.8,
        introActive: true,
        introSkipped: false,
        queueActive: false,
        rulesAgreed: false,
        currentTheme: 'dark',
        showEffects: true,
        showMotion: true,
        showFPS: false,
        textSize: 'medium',
        highContrast: false,
        currentTourSlide: 0,
        reactionGame: { timeout: null, startTime: null, active: false, bestTime: localStorage.getItem('bestReactionTime') || null },
        playerName: 'Citizen',
        ping: null,
        voiceConnected: true, // Assume connected initially
        notifications: [ // Example notifications/tips
            { type: 'tip', title: 'Pro Tip', message: 'Use /report [ID] [Reason] for player issues.' },
            { type: 'info', title: 'Server Event', message: 'Beach Party this Friday at 9 PM EST!' },
            { type: 'tip', title: 'Did You Know?', message: 'You can customize vehicle handling at specific garages.' },
            { type: 'warning', title: 'Reminder', message: 'Ensure you have read the updated server rules.' },
        ],
        currentNotificationIndex: 0,
        notificationTimeout: null,
    };

    // --- DOM Element Cache ---
    const elements = {
        body: document.body,
        html: document.documentElement,
        // Intro
        cinematicIntro: document.getElementById('cinematic-intro'),
        introSkipBtn: document.getElementById('intro-skip'),
        // Interface
        interfaceContainer: document.getElementById('interface-container'),
        // Sidebar
        sidebarNav: document.getElementById('sidebar-nav'),
        navItems: document.querySelectorAll('.nav-item'),
        // Top Bar
        pingStatusValue: document.querySelector('#ping-status .value'),
        pingStatusIcon: document.querySelector('#ping-status i'),
        voiceStatusValue: document.querySelector('#voice-status .value'),
        voiceStatusIcon: document.querySelector('#voice-status i'),
        playerCountStatus: document.querySelector('#player-count-status .value'),
        // Loading Indicator
        loadingIndicator: document.getElementById('loading-indicator'),
        loadingStatusText: document.getElementById('loading-status'),
        progressBar: document.getElementById('progress-bar'),
        loadingPercentage: document.getElementById('loading-percentage'),
        queueInfo: document.getElementById('queue-info'),
        queuePosition: document.getElementById('queue-position'),
        estimatedTime: document.getElementById('estimated-time'),
        // Main Content
        mainContent: document.getElementById('main-content'),
        contentSections: document.querySelectorAll('.content-section'),
        playerName: document.getElementById('player-name'),
        // Welcome Section
        playersOnline: document.getElementById('players-online'),
        serverUptime: document.getElementById('server-uptime'),
        activeIncidents: document.getElementById('active-incidents'), // Example new element
        playersProgress: document.getElementById('players-progress'),
        tourSlides: document.querySelectorAll('.tour-slide'),
        tourIndicators: document.querySelectorAll('.indicator'),
        tourPrevBtn: document.querySelector('.tour-prev'),
        tourNextBtn: document.querySelector('.tour-next'),
        // Server Info Section
        analyzeBtn: document.getElementById('analyze-connection'),
        pingValue: document.getElementById('ping-value'),
        jitterValue: document.getElementById('jitter-value'),
        bandwidthValue: document.getElementById('bandwidth-value'),
        pingBar: document.getElementById('ping-bar'),
        jitterBar: document.getElementById('jitter-bar'),
        bandwidthBar: document.getElementById('bandwidth-bar'),
        connectionRecommendation: document.getElementById('connection-recommendation'),
        copyBtns: document.querySelectorAll('.copy-btn-premium'),
        // Rules Section
        rulesAcceptanceForm: document.getElementById('rules-acceptance-form'),
        signatureField: document.getElementById('signature-field'),
        signRulesBtn: document.getElementById('sign-rules'),
        signatureStatus: document.getElementById('signature-status'),
        // Map Section
        mapSearchInput: document.getElementById('map-search-input'),
        mapSearchBtn: document.getElementById('map-search-btn'),
        mapFilterItems: document.querySelectorAll('.filter-item-premium'),
        interactiveMap: document.getElementById('interactive-map-premium'),
        mapMarkers: [], // Will be populated after init
        locationDetails: document.getElementById('location-details-premium'),
        detailsTitle: document.getElementById('details-title'),
        detailsImageContainer: document.getElementById('details-image-container'),
        detailsImage: document.getElementById('details-image'),
        detailsDescription: document.getElementById('details-description'),
        setGpsBtn: document.getElementById('set-gps-btn'),
        detailsCloseBtn: document.getElementById('details-close'),
        // Music Section
        musicPlayerPanel: document.querySelector('.music-player-panel'),
        playPauseBtn: document.getElementById('play-pause-btn'),
        prevTrackBtn: document.getElementById('prev-track-btn'),
        nextTrackBtn: document.getElementById('next-track-btn'),
        currentTrackName: document.getElementById('current-track-name'),
        currentTrackArtist: document.getElementById('current-track-artist'),
        trackArtwork: document.getElementById('track-artwork'), // New element for artwork
        musicCurrentTime: document.getElementById('music-current-time'),
        musicTotalTime: document.getElementById('music-total-time'),
        musicProgressBar: document.getElementById('music-progress-bar'),
        musicProgressFill: document.getElementById('music-progress-fill'),
        volumeToggleIcon: document.getElementById('volume-toggle-icon'),
        volumeSlider: document.getElementById('volume-slider'),
        trackList: document.getElementById('track-list'),
        // MiniGames
        gameSelectBtns: document.querySelectorAll('.game-select-btn'),
        gameAreas: document.querySelectorAll('.game-area'),
        reactionGameArea: document.getElementById('reaction-area'),
        startReactionBtn: document.getElementById('start-reaction-game'),
        reactionInstructions: document.getElementById('reaction-instructions'),
        reactionResult: document.getElementById('reaction-result'),
        bestReactionTimeEl: document.getElementById('best-reaction-time'),
         // Settings
        musicVolumeSlider: document.getElementById('music-volume'),
        musicVolumeValue: document.getElementById('music-volume-value'),
        sfxVolumeSlider: document.getElementById('sfx-volume'),
        sfxVolumeValue: document.getElementById('sfx-volume-value'),
        muteAudioToggle: document.getElementById('mute-audio'),
        themeOptions: document.querySelectorAll('.theme-option-premium'),
        toggleEffects: document.getElementById('toggle-effects'),
        toggleMotion: document.getElementById('toggle-motion'),
        toggleFps: document.getElementById('toggle-fps'),
        languageSelect: document.getElementById('language-select'),
        textSizeOptions: document.querySelectorAll('.size-option-premium'),
        toggleContrast: document.getElementById('toggle-contrast'),
        micVisualizationBars: document.querySelectorAll('.mic-bar-premium'),
        // Floating / Misc
        fpsCounter: document.getElementById('fps-counter'),
        notificationsArea: document.getElementById('notifications-area'),
        // Audio
        backgroundMusic: document.getElementById('background-music'),
        uiSound: document.getElementById('ui-sound'),
    };

    // --- Constants ---
    const LOADING_PHASES = [ // More detailed phases
        "INITIATING CONNECTION [ENCRYPTED]",
        "AUTHENTICATING CREDENTIALS...",
        "SYNCHRONIZING CORE SYSTEMS...",
        "LOADING WORLD DATA [TERABYTES]...",
        "STREAMING ASSETS [HIGH PRIORITY]...",
        "DECOMPRESSING TEXTURES...",
        "INITIALIZING CHARACTER PROFILE...",
        "VERIFYING ORDINANCES ACKNOWLEDGEMENT...",
        "FINALIZING SESSION HANDSHAKE...",
        "AWAITING CITY ENTRY...",
    ];
    const MUSIC_TRACKS = [ // Assumed tracks from original
        { name: "Midnight Drive", artist: "SynthWave Collective", duration: 189, src: "audio/track1.mp3", artwork: "img/logo.png" },
        { name: "Neon Grid", artist: "City Pulse", duration: 72, src: "audio/track2.mp3", artwork: "img/logo.png" },
        { name: "Future Echoes", artist: "RetroFuture", duration: 243, src: "audio/track3.mp3", artwork: "img/logo.png" },
    ];
    // Map locations assumed same as original JS, maybe add more here
    const MAP_LOCATIONS = {
        police: { 
            name: "LSPD HQ", 
            description: "Mission Row Precinct. Central hub for law enforcement operations.", 
            image: "img/lspd-hq.svg" 
        },
        hospital: { 
            name: "Pillbox Hill Medical", 
            description: "State-of-the-art medical facility. Equipped for all emergencies.", 
            image: "img/pillbox-hospital.svg" 
        },
        garage: { 
            name: "Impound & Storage", 
            description: "Secure facility for vehicle impoundment and personal storage.", 
            image: "img/impound-garage.svg" 
        },
        bank: { 
            name: "Maze Bank Central", 
            description: "Primary financial institution. Offers secure banking and vault services.", 
            image: "img/maze-bank.svg" 
        },
        casino: { 
            name: "The Diamond", 
            description: "Premier destination for high-stakes gambling, luxury suites, and nightlife.", 
            image: "img/diamond-casino.svg" 
        },
        mechanic: { 
            name: "Los Santos Customs", 
            description: "Expert vehicle modification, repair, and performance tuning.", 
            image: "img/ls-customs.svg" 
        },
        beach: {
            name: "Vespucci Beach", 
            description: "Popular beachfront with boardwalk, outdoor gym, and recreational activities.", 
            image: "img/vespucci-beach.svg"
          },
        vineyard: {
            name: "Marlowe Vineyard", 
            description: "Scenic wine country estate with expansive vineyards and tasting facilities.", 
            image: "img/vineyard.svg"
        },
        golfclub: {
            name: "Los Santos Golf Club", 
            description: "Exclusive 18-hole golf course with clubhouse and luxury amenities.", 
            image: "img/golf-club.svg"
        },
        airport: {
            name: "LSIA", 
            description: "Los Santos International Airport. Main transportation hub for the city.", 
            image: "img/airport.svg"
        },
        observatory: {
            name: "Galileo Observatory", 
            description: "Historic scientific facility offering panoramic views of Los Santos.", 
            image: "img/observatory.svg"
        }
    };

    let fpsState = { lastFrameTime: performance.now(), frameCount: 0 };
    let audioContext; // For visualizers
    let micAnalyzer;
    let micDataArray;

    // --- Initialization ---
    function init() {
        logDebug("Initialization sequence started.");
        
        // Add a flag to store UI performance mode
        state.performanceMode = localStorage.getItem('performanceMode') === 'true' || false;
        
        loadSavedSettings(); // Load settings first to apply theme etc.
        
        // Reduce animations in performance mode
        if (state.performanceMode) {
            state.showMotion = false;
            state.showEffects = false;
            document.body.classList.add('performance-mode');
        }
        
        initCinematicIntro();
        initSidebarNav();
        initLoadingSimulation();
        initMusicPlayer();
        initSettingsControls();
        initServerTour();
        initMap();
        initRules();
        initGameIframe(); // Initialize the game iframe functionality
        initConnectionAnalyzer();
        initFloatingElements();
        
        // Only initialize particles if not in performance mode
        if (!state.performanceMode) {
            initParticlesIfAvailable();
        }
        
        initNotifications();
        initUtilityListeners();
        fetchServerData();
        fetchPlayerName();
        initResponsivenessAdjustments();
        
        logDebug("Initialization sequence complete.");
    }

    // --- Logging Utility ---
    function logDebug(message, ...args) {
        if (config.debugMode) {
            console.log(`[LS_DEBUG] ${message}`, ...args);
        }
    }

    // --- Cinematic Intro Logic ---
    function initCinematicIntro() {
        if (!elements.cinematicIntro) return;
        logDebug("Initializing cinematic intro...");
      document.addEventListener("keydown", handleIntroSkipKey);
        elements.introSkipBtn?.addEventListener("click", skipIntro);
      setTimeout(() => {
            if (state.introActive && !state.introSkipped) {
               logDebug("Auto-skipping intro due to timeout.");
               skipIntro();
            }
        }, config.introDuration);
    }

    function handleIntroSkipKey(e) {
        if (state.introActive && e.code === "Space") {
            logDebug("Intro skip requested via Spacebar.");
        skipIntro();
      }
    }

    function skipIntro() {
        if (!state.introActive || state.introSkipped) return;
        logDebug("Executing intro skip...");
        state.introSkipped = true;
        state.introActive = false;
        elements.cinematicIntro?.classList.remove('active');
      document.removeEventListener("keydown", handleIntroSkipKey);

        // Start interface fade-in (handled by CSS transition on #interface-container)

        // Start music softly only AFTER intro is fully faded
         setTimeout(() => {
            if (elements.backgroundMusic && !state.musicPlaying && !state.isMuted) {
                logDebug("Starting background music post-intro.");
                loadTrack(state.currentTrackIndex); // Ensure track is loaded
                playMusic(true); // Play with fade-in
            }
         }, 1500); // Delay matches intro fade-out duration

         // Start cycling notifications
         setTimeout(cycleNotifications, config.notificationInterval / 2); // Start notifications sooner after skip
    }

    // --- Loading Simulation & Status ---
    function initLoadingSimulation() {
        // NUI Placeholder: Replace this with actual NUI event listeners
        logDebug("Initializing loading simulation (NUI Placeholder).");
        
        // Ensure the progress bar starts at 1%
        updateLoadingProgress(1);
        
        let mockProgress = 1;
        
        const interval = setInterval(() => {
            if (state.introActive) return; // Don't progress during intro

            // Simulate variable progress speed
            let increment = Math.random() * 5 + 1;
            mockProgress += increment;

            if (mockProgress >= 100) {
                mockProgress = 100;
                clearInterval(interval);
                logDebug("Loading simulation complete.");
                // NUI Placeholder: Maybe call GetNuiFocus(false) here or trigger game load event
                updateLoadingProgress(100, "CITY ENTRY GRANTED");
            } else {
                updateLoadingProgress(mockProgress);
            }

        }, 350); // Update interval

        // NUI Listener Example:
        /*
        window.addEventListener('message', (event) => {
            const { eventName, data } = event.data;
            switch(eventName) {
                case 'loadProgress':
                    updateLoadingProgress(data.loadFraction * 100, data.statusText);
                    break;
                case 'setPlayerName':
                     setPlayerName(data.name);
                     break;
                case 'setServerData':
                     updateServerStats(data);
                     break;
                // Add other NUI events here
            }
        });
        */
    }

    function updateLoadingProgress(progress, customStatus = null) {
        const clampedProgress = Math.min(100, Math.max(1, progress)); // Ensure at least 1% progress
        const progressPercent = Math.floor(clampedProgress);

        if (elements.progressBar) {
            elements.progressBar.style.width = `${clampedProgress}%`;
            elements.progressBar.style.display = 'block'; // Ensure it's visible
        }
        if (elements.loadingPercentage) elements.loadingPercentage.textContent = `${progressPercent}%`;

        let statusText;
        if (customStatus) {
            statusText = customStatus;
        } else {
            const phaseIndex = Math.min(
                Math.floor(clampedProgress / (100 / LOADING_PHASES.length)),
                LOADING_PHASES.length - 1
            );
            statusText = LOADING_PHASES[phaseIndex] || "Finalizing...";
        }

        if (elements.loadingStatusText && elements.loadingStatusText.textContent !== statusText) {
            // Add a subtle fade effect for status text change
            elements.loadingStatusText.style.opacity = 0;
            setTimeout(() => {
                elements.loadingStatusText.textContent = statusText;
                elements.loadingStatusText.style.opacity = 1;
            }, 200);
        }
    }

    // --- Sidebar Navigation ---
    function initSidebarNav() {
        elements.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const sectionId = item.getAttribute('data-section');
                switchContent(sectionId);
          playUISound();
        });
      });
    }

    function switchContent(sectionId) {
        if (state.currentSection === sectionId) return;
        logDebug(`Switching content section to: ${sectionId}`);

        elements.navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-section') === sectionId);
        });

        elements.contentSections.forEach(section => {
            section.classList.toggle('active', section.id === `${sectionId}-section`);
        });

        state.currentSection = sectionId;
        // Scroll content area to top
        const activeSection = document.getElementById(`${sectionId}-section`);
        if(activeSection) activeSection.scrollTop = 0;
    }

    // --- Music Player ---
    function initMusicPlayer() {
        if (!elements.backgroundMusic || MUSIC_TRACKS.length === 0) {
          console.warn("Music player or tracks not found.");
          return;
      }
        logDebug("Initializing music player...");

        // Main music panel controls
        elements.playPauseBtn?.addEventListener('click', () => {
            toggleMusic();
            playUISound();
        });
        elements.prevTrackBtn?.addEventListener('click', () => {
            prevTrack();
            playUISound();
        });
        elements.nextTrackBtn?.addEventListener('click', () => {
            nextTrack();
            playUISound();
        });
        elements.volumeSlider?.addEventListener('input', handleVolumeChange);
        elements.volumeToggleIcon?.addEventListener('click', () => {
             toggleMute();
             playUISound();
         });
        elements.musicProgressBar?.addEventListener('click', seekMusic);
        elements.backgroundMusic.addEventListener('timeupdate', updateMusicProgress);
        elements.backgroundMusic.addEventListener('loadedmetadata', updateTrackDisplay);
        elements.backgroundMusic.addEventListener('ended', nextTrack);
        elements.backgroundMusic.addEventListener('volumechange', updateVolumeIcon); // Update icon on programmatic changes too

        // Quick music controls shortcuts
        document.getElementById('quick-play-pause')?.addEventListener('click', () => {
            toggleMusic();
            playUISound();
        });
        document.getElementById('quick-prev-track')?.addEventListener('click', () => {
            prevTrack();
            playUISound();
        });
        document.getElementById('quick-next-track')?.addEventListener('click', () => {
            nextTrack();
            playUISound();
        });
        document.getElementById('quick-mute-toggle')?.addEventListener('click', () => {
            toggleMute();
            playUISound();
        });
        document.getElementById('quick-volume-slider')?.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            state.userVolume = volume;
            if (!state.isMuted) {
                elements.backgroundMusic.volume = state.userVolume;
            }
            saveSettings('musicVolume', state.userVolume);
            // Update main volume slider if it exists
            if (elements.volumeSlider) {
                elements.volumeSlider.value = volume * 100;
            }
            updateVolumeSliderBackground(e.target);
        });

        buildPlaylist();
        loadTrack(state.currentTrackIndex); // Load initial track
        updateVolumeIcon(); // Set initial icon state
        
        // Initialize quick volume slider background
        const quickVolumeSlider = document.getElementById('quick-volume-slider');
        if (quickVolumeSlider) {
            quickVolumeSlider.value = state.userVolume * 100;
            updateVolumeSliderBackground(quickVolumeSlider);
        }
    }
    
    // Helper function for volume slider background
    function updateVolumeSliderBackground(slider) {
        if (!slider) return;
        const value = slider.value;
        const percentage = (value / slider.max) * 100;
        slider.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--color-border) ${percentage}%, var(--color-border) 100%)`;
    }

    function buildPlaylist() {
        if (!elements.trackList) return;
        elements.trackList.innerHTML = ''; // Clear placeholder or previous list
        MUSIC_TRACKS.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = 'track-item-premium';
            li.setAttribute('data-index', index);
            if (index === state.currentTrackIndex) li.classList.add('active');

            li.innerHTML = `
                <div class="track-item-info-premium">
                    <div class="track-item-title-premium">${track.name}</div>
                    <div class="track-item-artist-premium">${track.artist}</div>
                </div>
                <div class="track-item-duration-premium">${formatTime(track.duration)}</div>
            `;

            li.addEventListener('click', () => {
                loadTrack(index);
                playMusic(true); // Play with fade-in when clicked
                playUISound();
            });
            elements.trackList.appendChild(li);
        });
    }

    function loadTrack(index) {
        if (index < 0 || index >= MUSIC_TRACKS.length) return;
        logDebug(`Loading track index: ${index}`);
        state.currentTrackIndex = index;
        const track = MUSIC_TRACKS[state.currentTrackIndex];

        elements.backgroundMusic.src = track.src;
        elements.backgroundMusic.load(); // Important to load the new source

         // Update active state in playlist
         elements.trackList.querySelectorAll('.track-item-premium').forEach(item => {
            item.classList.toggle('active', parseInt(item.getAttribute('data-index')) === index);
         });

        // Update display immediately (even before metadata loads)
        if (elements.currentTrackName) elements.currentTrackName.textContent = track.name;
        if (elements.currentTrackArtist) elements.currentTrackArtist.textContent = track.artist;
        if (elements.trackArtwork) elements.trackArtwork.style.backgroundImage = `url('${track.artwork || 'https://via.placeholder.com/150/1a1f29/cccccc?text=No+Art'}')`;
        if (elements.musicTotalTime) elements.musicTotalTime.textContent = formatTime(track.duration);
        if (elements.musicCurrentTime) elements.musicCurrentTime.textContent = formatTime(0);
        if (elements.musicProgressFill) elements.musicProgressFill.style.width = '0%';
        
        // Update quick controls with track info
        const quickTrackName = document.getElementById('quick-track-name');
        const quickTrackArtist = document.getElementById('quick-track-artist');
        if (quickTrackName) quickTrackName.textContent = track.name;
        if (quickTrackArtist) quickTrackArtist.textContent = track.artist;
    }

    function playMusic(useFadeIn = false) {
        if (!elements.backgroundMusic.src) { // Ensure src is set
            loadTrack(state.currentTrackIndex);
        }
        if (elements.backgroundMusic.paused && !state.isMuted) {
            elements.backgroundMusic.play().then(() => {
                state.musicPlaying = true;
                updatePlayButton();
                logDebug("Music playback started.");
                if (useFadeIn) {
                    fadeInAudio(elements.backgroundMusic, state.userVolume, 500);
      } else {
                    elements.backgroundMusic.volume = state.userVolume;
                }
            }).catch(e => console.error("Audio play failed:", e));
        }
    }

    function pauseMusic() {
        if (!elements.backgroundMusic.paused) {
            elements.backgroundMusic.pause();
            state.musicPlaying = false;
            updatePlayButton();
            logDebug("Music playback paused.");
        }
    }

    function toggleMusic() {
        if (elements.backgroundMusic.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    }

    function nextTrack() {
        let newIndex = (state.currentTrackIndex + 1) % MUSIC_TRACKS.length;
      loadTrack(newIndex);
        if (state.musicPlaying) playMusic(); // Autoplay if it was playing
    }

    function prevTrack() {
        let newIndex = (state.currentTrackIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
        loadTrack(newIndex);
         if (state.musicPlaying) playMusic(); // Autoplay if it was playing
    }

    function handleVolumeChange() {
        const volume = elements.volumeSlider.value / 100;
        state.userVolume = volume;
        if (!state.isMuted) {
            elements.backgroundMusic.volume = state.userVolume;
        }
        // No need to update icon here, volumechange event handles it
        saveSettings('musicVolume', state.userVolume); // Persist volume immediately
    }

     function setVolume(level, fromLoad = false) { // Added fromLoad flag
        const volume = Math.max(0, Math.min(1, level));
        state.userVolume = volume;
        if (elements.volumeSlider) elements.volumeSlider.value = volume * 100;
        if (!state.isMuted) {
            elements.backgroundMusic.volume = state.userVolume;
        }
        if (!fromLoad) { // Only save if changed by user, not during load
            saveSettings('musicVolume', state.userVolume);
        }
         logDebug(`Volume set to: ${Math.round(volume * 100)}%`);
    }


    function toggleMute() {
        state.isMuted = !state.isMuted;
        elements.backgroundMusic.muted = state.isMuted;
        if (elements.uiSound) elements.uiSound.muted = state.isMuted; // Mute SFX too
        logDebug(`Audio muted state: ${state.isMuted}`);
        updateVolumeIcon();
        saveSettings('muted', state.isMuted);
    }

    function updateVolumeIcon() {
        if (!elements.volumeToggleIcon) return;
        
        let iconClass = 'fa-volume-up'; // Default
        if (state.isMuted || state.userVolume === 0) {
            iconClass = 'fa-volume-mute';
        } else if (state.userVolume < 0.1) {
             iconClass = 'fa-volume-off';
         } else if (state.userVolume < 0.6) {
            iconClass = 'fa-volume-down';
        }
        // Update main volume icon
        elements.volumeToggleIcon.className = `fas ${iconClass} volume-icon-premium`;
        
        // Update quick mute button icon
        const quickMuteBtn = document.getElementById('quick-mute-toggle');
        if (quickMuteBtn) {
            const quickIcon = quickMuteBtn.querySelector('i');
            if (quickIcon) {
                quickIcon.className = `fas ${iconClass}`;
            }
        }
        
        // Update quick volume slider
        const quickVolumeSlider = document.getElementById('quick-volume-slider');
        if (quickVolumeSlider) {
            quickVolumeSlider.value = state.userVolume * 100;
            updateVolumeSliderBackground(quickVolumeSlider);
        }
    }

    function updatePlayButton() {
        if (!elements.playPauseBtn) return;
        // Update main play button
        const icon = elements.playPauseBtn.querySelector('i');
        if (state.musicPlaying) {
            icon.className = 'fas fa-pause';
            elements.playPauseBtn.title = 'Pause';
        } else {
            icon.className = 'fas fa-play';
            elements.playPauseBtn.title = 'Play';
        }
        
        // Update quick play button
        const quickPlayBtn = document.getElementById('quick-play-pause');
        if (quickPlayBtn) {
            const quickIcon = quickPlayBtn.querySelector('i');
            if (quickIcon) {
                quickIcon.className = state.musicPlaying ? 'fas fa-pause' : 'fas fa-play';
            }
            quickPlayBtn.title = state.musicPlaying ? 'Pause' : 'Play';
        }
        
        // Update quick track info
        const quickTrackName = document.getElementById('quick-track-name');
        const quickTrackArtist = document.getElementById('quick-track-artist');
        if (quickTrackName && quickTrackArtist && MUSIC_TRACKS[state.currentTrackIndex]) {
            const track = MUSIC_TRACKS[state.currentTrackIndex];
            quickTrackName.textContent = track.name;
            quickTrackArtist.textContent = track.artist;
        }
    }

    function updateMusicProgress() {
        if (!elements.backgroundMusic || !elements.musicProgressFill || !elements.musicCurrentTime) return;
        
        if (elements.backgroundMusic.duration) {
            const progress = (elements.backgroundMusic.currentTime / elements.backgroundMusic.duration) * 100;
            // Only update DOM when progress changes by at least 1%
            if (!state.lastProgress || Math.abs(progress - state.lastProgress) >= 1) {
            elements.musicProgressFill.style.width = `${progress}%`;
                state.lastProgress = progress;
            }
            
            // Only update time display when it changes by at least 1 second
            const currentSecond = Math.floor(elements.backgroundMusic.currentTime);
            if (!state.lastSecond || currentSecond !== state.lastSecond) {
            elements.musicCurrentTime.textContent = formatTime(elements.backgroundMusic.currentTime);
                state.lastSecond = currentSecond;
            }
        }
    }

    function seekMusic(e) {
        if (!elements.backgroundMusic.duration) return;
        const progressBar = elements.musicProgressBar;
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        elements.backgroundMusic.currentTime = pos * elements.backgroundMusic.duration;
        playUISound();
    }

     function updateTrackDisplay() { // Called on loadedmetadata
         const track = MUSIC_TRACKS[state.currentTrackIndex];
         if (!track) return;
         if (elements.musicTotalTime) elements.musicTotalTime.textContent = formatTime(elements.backgroundMusic.duration || track.duration);
         // Other info updated in loadTrack
     }

    // --- Settings Logic ---
     function initSettingsControls() {
         logDebug("Initializing settings controls...");
        
        // Initialize all toggle switches based on checkbox state
        document.querySelectorAll('.toggle-switch-premium').forEach(toggle => {
            const checkbox = toggle.querySelector('input[type="checkbox"]');
            if (checkbox) {
                toggle.classList.toggle('active', checkbox.checked);
            }
            
            // Add click handler to toggle the switch
            toggle.addEventListener('click', (e) => {
                // Don't handle clicks on the checkbox itself (it will fire twice)
                if (e.target === checkbox) return;
                
                checkbox.checked = !checkbox.checked;
                toggle.classList.toggle('active', checkbox.checked);
                // Trigger the change event to run any bound handlers
                const changeEvent = new Event('change');
                checkbox.dispatchEvent(changeEvent);
            });
        });
            
        // Audio
         elements.musicVolumeSlider?.addEventListener('input', () => {
             setVolume(elements.musicVolumeSlider.value / 100);
             if(elements.musicVolumeValue) elements.musicVolumeValue.textContent = `${elements.musicVolumeSlider.value}%`;
             playUISound();
         });
         elements.sfxVolumeSlider?.addEventListener('input', () => {
             state.sfxVolume = elements.sfxVolumeSlider.value / 100;
             if(elements.sfxVolumeValue) elements.sfxVolumeValue.textContent = `${elements.sfxVolumeSlider.value}%`;
             if (elements.uiSound) elements.uiSound.volume = state.sfxVolume;
             saveSettings('sfxVolume', state.sfxVolume);
             playUISound();
         });
         elements.muteAudioToggle?.addEventListener('change', () => {
             toggleMute(); // This already saves the setting
             playUISound();
             // Update toggle appearance
             const toggle = elements.muteAudioToggle.closest('.toggle-switch-premium');
             if (toggle) toggle.classList.toggle('active', elements.muteAudioToggle.checked);
        });

        // Visuals
         elements.themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                 const theme = option.getAttribute('data-theme');
                 setTheme(theme);
                 elements.themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                playUISound();
            });
        });
         elements.toggleEffects?.addEventListener('change', (e) => {
             state.showEffects = e.target.checked;
             applyEffectSettings();
             saveSettings('effects', state.showEffects);
             playUISound();
             // Update toggle appearance
             const toggle = e.target.closest('.toggle-switch-premium');
             if (toggle) toggle.classList.toggle('active', e.target.checked);
        });
         elements.toggleMotion?.addEventListener('change', (e) => {
             state.showMotion = e.target.checked;
             applyMotionSettings();
             saveSettings('motion', state.showMotion);
             playUISound();
             // Update toggle appearance
             const toggle = e.target.closest('.toggle-switch-premium');
             if (toggle) toggle.classList.toggle('active', e.target.checked);
        });
         elements.toggleFps?.addEventListener('change', (e) => {
             state.showFPS = e.target.checked;
             applyFPSSettings();
             saveSettings('fps', state.showFPS);
             playUISound();
             // Update toggle appearance
             const toggle = e.target.closest('.toggle-switch-premium');
             if (toggle) toggle.classList.toggle('active', e.target.checked);
        });

        // Add performance mode toggle
        const performanceToggle = document.getElementById('toggle-performance');
        if (performanceToggle) {
            performanceToggle.checked = state.performanceMode;
            performanceToggle.addEventListener('change', (e) => {
                state.performanceMode = e.target.checked;
                saveSettings('performanceMode', state.performanceMode);
                
                // Apply performance mode changes
                if (state.performanceMode) {
                    // Disable effects and motion for better performance
                    if (elements.toggleEffects) elements.toggleEffects.checked = false;
                    if (elements.toggleMotion) elements.toggleMotion.checked = false;
                    state.showEffects = false;
                    state.showMotion = false;
                    
                    applyEffectSettings();
                    applyMotionSettings();
                    document.body.classList.add('performance-mode');
                    
                    // Remove particles
                    const particlesContainer = document.getElementById("particles-js");
                    if (particlesContainer) {
                        const existingCanvas = particlesContainer.querySelector('canvas');
                        if (existingCanvas) existingCanvas.remove();
                    }
                } else {
                    document.body.classList.remove('performance-mode');
                    // Re-apply regular settings
                    initParticlesIfAvailable();
                }
                
             playUISound();
                
             // Update toggle appearance
             const toggle = e.target.closest('.toggle-switch-premium');
             if (toggle) toggle.classList.toggle('active', e.target.checked);
                
                // Show notification about changes
                showNotification('info', 'Performance Mode ' + (state.performanceMode ? 'Enabled' : 'Disabled'), 
                    state.performanceMode ? 'UI animations reduced for better performance.' : 'Standard UI animations restored.');
        });
        }

        // Rest of the initialization remains the same
        // ...
     }

    function loadSavedSettings() {
         logDebug("Loading saved settings...");
         // Load settings from localStorage with defaults
         const settings = {
             musicVolume: parseFloat(localStorage.getItem('musicVolume')) || 0.7,
             sfxVolume: parseFloat(localStorage.getItem('sfxVolume')) || 0.8,
             muted: localStorage.getItem('muted') === 'true',
             theme: localStorage.getItem('theme') || 'dark',
             effects: localStorage.getItem('effects') !== 'false', // Default true
             motion: localStorage.getItem('motion') !== 'false', // Default true
             fps: localStorage.getItem('fps') === 'true', // Default false
             textSize: localStorage.getItem('textSize') || 'medium',
             highContrast: localStorage.getItem('highContrast') === 'true', // Default false
             language: localStorage.getItem('language') || 'en',
             rulesAgreed: localStorage.getItem('rulesAgreed') === 'true',
             performanceMode: localStorage.getItem('performanceMode') === 'true', // Default false
         };

         // Apply loaded settings to state
         state.userVolume = settings.musicVolume;
         state.sfxVolume = settings.sfxVolume;
         state.isMuted = settings.muted;
         state.currentTheme = settings.theme;
         state.showEffects = settings.effects;
         state.showMotion = settings.motion;
         state.showFPS = settings.fps;
         state.textSize = settings.textSize;
         state.highContrast = settings.highContrast;
         state.rulesAgreed = settings.rulesAgreed;
         state.performanceMode = settings.performanceMode;
         
         // If performance mode is enabled, override motion and effects
         if (state.performanceMode) {
             state.showEffects = false;
             state.showMotion = false;
             document.body.classList.add('performance-mode');
         }

         // Apply settings to UI elements
         setVolume(state.userVolume, true); // Pass true to prevent immediate save
         if(elements.musicVolumeValue) elements.musicVolumeValue.textContent = `${Math.round(state.userVolume * 100)}%`;

         if(elements.sfxVolumeSlider) elements.sfxVolumeSlider.value = state.sfxVolume * 100;
         if(elements.sfxVolumeValue) elements.sfxVolumeValue.textContent = `${Math.round(state.sfxVolume * 100)}%`;
         if (elements.uiSound) elements.uiSound.volume = state.sfxVolume;

         if(elements.muteAudioToggle) elements.muteAudioToggle.checked = state.isMuted;
         if (elements.backgroundMusic) elements.backgroundMusic.muted = state.isMuted;
         if (elements.uiSound) elements.uiSound.muted = state.isMuted;
         updateVolumeIcon(); // Reflect mute state in icon

         setTheme(state.currentTheme, true); // Apply theme without saving again
         elements.themeOptions.forEach(opt => opt.classList.toggle('active', opt.getAttribute('data-theme') === state.currentTheme));

         if(elements.toggleEffects) elements.toggleEffects.checked = state.showEffects;
        applyEffectSettings();

         if(elements.toggleMotion) elements.toggleMotion.checked = state.showMotion;
        applyMotionSettings();

         if(elements.toggleFps) elements.toggleFps.checked = state.showFPS;
         applyFPSSettings();

         // Performance mode toggle 
         if(document.getElementById('toggle-performance')) {
             document.getElementById('toggle-performance').checked = state.performanceMode;
             const toggle = document.getElementById('toggle-performance').closest('.toggle-switch-premium');
             if (toggle) toggle.classList.toggle('active', state.performanceMode);
         }

         setTextSize(state.textSize, true); // Apply text size without saving again
         elements.textSizeOptions.forEach(opt => opt.classList.toggle('active', opt.getAttribute('data-size') === state.textSize));

         if(elements.toggleContrast) elements.toggleContrast.checked = state.highContrast;
         elements.body.classList.toggle('high-contrast', state.highContrast);

         if(elements.languageSelect) elements.languageSelect.value = settings.language;

         // Apply rules agreed state
         if (state.rulesAgreed) {
             markRulesAsAgreed();
         }

         logDebug("Settings loaded:", settings);
    }

    function saveSettings(key, value) {
        localStorage.setItem(key, value);
        logDebug(`Setting saved: ${key} = ${value}`);
    }

    function setTheme(themeName, fromLoad = false) {
        elements.html.setAttribute('data-theme', themeName);
        state.currentTheme = themeName;
        if (!fromLoad) saveSettings('theme', themeName);
        logDebug(`Theme set to: ${themeName}`);
        initParticlesIfAvailable(); // Re-init particles for new theme colors
    }

    function applyEffectSettings() {
        elements.body.classList.toggle('no-effects', !state.showEffects);
        logDebug(`Background effects ${state.showEffects ? 'enabled' : 'disabled'}.`);
    }

     function applyMotionSettings() {
         elements.body.classList.toggle('no-motion', !state.showMotion);
         if (!state.showMotion) {
             // Reset parallax layers immediately if motion is turned off
             document.querySelectorAll('.parallax-layer').forEach(layer => {
                 // Find original transform from CSS if possible, or reset simply
                 layer.style.transform = ''; // Let CSS handle reset or set a fixed state
             });
         } else {
             // Re-trigger parallax calculation
             handleMouseMove({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
         }
         logDebug(`Motion effects ${state.showMotion ? 'enabled' : 'disabled'}.`);
     }

     function applyFPSSettings() {
         elements.body.classList.toggle('no-fps', !state.showFPS);
         if (state.showFPS) {
             requestAnimationFrame(updateFPS); // Start loop if enabled
         }
         logDebug(`FPS counter ${state.showFPS ? 'enabled' : 'disabled'}.`);
     }


    function setTextSize(size, fromLoad = false) {
        elements.body.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
        elements.body.classList.add(`text-size-${size}`);
        state.textSize = size;
        if (!fromLoad) saveSettings('textSize', size);
        logDebug(`Text size set to: ${size}`);
    }

    // --- Server Tour Logic ---
    function initServerTour() {
         // Assumed same selectors and logic as original, verify element IDs/classes if changed
         if (!elements.tourPrevBtn || !elements.tourNextBtn) return;
         elements.tourNextBtn.addEventListener('click', () => navigateTour(1));
         elements.tourPrevBtn.addEventListener('click', () => navigateTour(-1));
         elements.tourIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => setTourSlide(index));
        });
         logDebug("Server tour initialized.");
    }

    function navigateTour(direction) {
         let newIndex = (state.currentTourSlide + direction + elements.tourSlides.length) % elements.tourSlides.length;
        setTourSlide(newIndex);
    }

    function setTourSlide(index) {
         if (index < 0 || index >= elements.tourSlides.length || index === state.currentTourSlide) return;
         elements.tourSlides[state.currentTourSlide].classList.remove('active');
         elements.tourIndicators[state.currentTourSlide].classList.remove('active');
         state.currentTourSlide = index;
         elements.tourSlides[state.currentTourSlide].classList.add('active');
         elements.tourIndicators[state.currentTourSlide].classList.add('active');
         playUISound();
     }


    // --- Map Logic ---
    function initMap() {
         // Cache markers after potential dynamic loading
         elements.mapMarkers = document.querySelectorAll('.map-marker-premium');
         if(!elements.interactiveMap) return;
         logDebug("Initializing interactive map...");

         elements.mapMarkers.forEach(marker => {
            marker.addEventListener('click', () => showLocationDetails(marker));
        });
         elements.mapFilterItems.forEach(filter => {
            filter.addEventListener('click', () => filterMapMarkers(filter));
        });
         elements.detailsCloseBtn?.addEventListener('click', hideLocationDetails);
         elements.mapSearchBtn?.addEventListener('click', searchMapMarkers);
         elements.mapSearchInput?.addEventListener('keyup', (e) => { if(e.key === 'Enter') searchMapMarkers(); });
         elements.setGpsBtn?.addEventListener('click', () => {
             const locationId = elements.setGpsBtn.getAttribute('data-location');
            if(locationId) setMapWaypoint(locationId);
        });
    }

    function showLocationDetails(marker) {
        const locationId = marker.getAttribute('data-location');
        const locationData = MAP_LOCATIONS[locationId];

         if (!locationData || !elements.locationDetails) return;
         logDebug(`Showing details for map location: ${locationId}`);

         elements.detailsTitle.textContent = locationData.name;
         elements.detailsDescription.textContent = locationData.description;
         elements.detailsImage.src = locationData.image;
         elements.detailsImage.alt = locationData.name;
         elements.setGpsBtn.setAttribute('data-location', locationId);
         elements.setGpsBtn.disabled = false;

         elements.locationDetails.classList.add('visible'); // Use class for visibility on small screens
         elements.locationDetails.style.display = 'block'; // Ensure visible on large

          // Highlight selected marker
          elements.mapMarkers.forEach(m => m.classList.remove('selected')); // Define .selected style if needed
         marker.classList.add('selected');
          playUISound();
    }

    function hideLocationDetails() {
        if (elements.locationDetails) {
            elements.locationDetails.classList.remove('visible');
            // Use timeout to allow fade out animation if needed on small screens
            if (window.innerWidth < 1200) {
                setTimeout(() => { elements.locationDetails.style.display = 'none'; }, 300); // Match animation duration
            } else {
                // Keep panel visible but reset content on large screens
                elements.detailsTitle.textContent = "Select Point of Interest";
                elements.detailsDescription.textContent = "Select a marker on the map for detailed information.";
                elements.detailsImage.src = "img/downtown.svg";
                elements.setGpsBtn.disabled = true;
            }
        }
        elements.mapMarkers.forEach(m => m.classList.remove('selected'));
        playUISound();
    }

    function filterMapMarkers(filterButton) {
        const filter = filterButton.getAttribute('data-filter');
         logDebug(`Filtering map by: ${filter}`);
         elements.mapFilterItems.forEach(btn => btn.classList.remove('active'));
        filterButton.classList.add('active');

         elements.mapMarkers.forEach(marker => {
            const markerFilter = marker.getAttribute('data-filter');
             marker.style.display = (filter === 'all' || markerFilter === filter) ? 'block' : 'none';
         });
         hideLocationDetails(); // Reset details view when filter changes
         playUISound();
    }

    function searchMapMarkers() {
         const searchTerm = elements.mapSearchInput.value.toLowerCase().trim();
         logDebug(`Searching map for: "${searchTerm}"`);
          elements.mapMarkers.forEach(marker => {
            const title = marker.getAttribute('title')?.toLowerCase() || '';
            const locationId = marker.getAttribute('data-location')?.toLowerCase() || '';
             marker.style.display = (searchTerm === '' || title.includes(searchTerm) || locationId.includes(searchTerm)) ? 'block' : 'none';
        });
         // Activate 'all' filter visually when searching
          elements.mapFilterItems.forEach(btn => btn.classList.remove('active'));
          document.querySelector('.filter-item-premium[data-filter="all"]').classList.add('active');
         hideLocationDetails();
          playUISound();
    }

    function setMapWaypoint(locationId) {
        logDebug(`Setting GPS waypoint to: ${locationId}`);
        // NUI Placeholder: Send message to client to set waypoint
        /*
        fetch(`https://${GetParentResourceName()}/setWaypoint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ location: locationId })
        }).catch(err => console.error("NUI Error setting waypoint:", err));
        */
        showNotification('info', 'Navigation Updated', `Route set to ${MAP_LOCATIONS[locationId]?.name || locationId}.`);
        playUISound();
    }

    // --- Rules Logic ---
    function initRules() {
         if(!elements.rulesAcceptanceForm) return;
         logDebug("Initializing rules section...");
         elements.rulesAcceptanceForm.addEventListener('submit', handleRulesAcceptance);
         // Apply pre-filled name if available and not yet agreed
         if(elements.signatureField && state.playerName !== 'Citizen' && !state.rulesAgreed) {
             elements.signatureField.value = state.playerName;
         }
         if (state.rulesAgreed) {
             markRulesAsAgreed(); // Reflect loaded state
         }
    }

    function handleRulesAcceptance(e) {
        e.preventDefault();
         const enteredName = elements.signatureField.value.trim();
         // NUI Placeholder: Ideally, verify enteredName against actual player name from client
        if (enteredName) {
             logDebug(`Rules acknowledged by: ${enteredName}`);
             state.rulesAgreed = true;
             markRulesAsAgreed();
             saveSettings('rulesAgreed', true);
             // NUI Placeholder: Notify client/server that rules are agreed
             // fetch(`https://${GetParentResourceName()}/rulesAgreed`, { method: 'POST' });
            playUISound();
        } else {
             elements.signatureStatus.textContent = "Please enter your registered citizen name.";
             elements.signatureStatus.className = 'signature-status-premium pending';
             elements.signatureField.focus();
         }
     }

     function markRulesAsAgreed() {
         if(elements.signatureStatus) {
             elements.signatureStatus.textContent = "Ordinances Acknowledged. Proceed with compliance.";
             elements.signatureStatus.className = 'signature-status-premium agreed';
         }
         if(elements.signRulesBtn) elements.signRulesBtn.disabled = true;
         if(elements.signatureField) elements.signatureField.disabled = true;
     }

    // --- MiniGames Logic ---
    function initMiniGames() {
         logDebug("Initializing minigames...");
         // Reaction Game
         if (elements.startReactionBtn) elements.startReactionBtn.addEventListener('click', startReactionGame);
         if (elements.reactionGameArea) elements.reactionGameArea.addEventListener('click', handleReactionClick);
        displayBestReactionTime(); // Show stored best time

         // Game Selection
         elements.gameSelectBtns?.forEach(btn => {
            btn.addEventListener('click', () => {
                 if (btn.disabled) return;
                const gameId = btn.getAttribute('data-game');
                 logDebug(`Switching to minigame: ${gameId}`);
                 elements.gameSelectBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                 elements.gameAreas?.forEach(area => {
                    area.classList.toggle('active', area.id === `${gameId}-game`);
                });
                 resetReactionGame(); // Reset reaction game state when switching
                playUISound();
            });
        });
    }

     // Reaction Game Logic (Adapted from original)
    function startReactionGame() {
        resetReactionGame();
         state.reactionGame.active = true;
         elements.startReactionBtn.disabled = true;
         elements.reactionGameArea.textContent = "PREPARE...";
         elements.reactionGameArea.className = 'waiting'; // Use classes for styling states
         elements.reactionInstructions.textContent = "Click the area precisely when it signals GO!";

         const delay = Math.random() * 2500 + 1000; // 1-3.5 seconds delay
         state.reactionGame.timeout = setTimeout(() => {
             if (!state.reactionGame.active) return;
             elements.reactionGameArea.textContent = "GO!";
             elements.reactionGameArea.className = 'go';
             state.reactionGame.startTime = performance.now();
        }, delay);
          playUISound();
    }

    function handleReactionClick() {
         if (!state.reactionGame.active) {
              if (!elements.startReactionBtn.disabled) { startReactionGame(); } return;
          }
         clearTimeout(state.reactionGame.timeout);

         if (elements.reactionGameArea.classList.contains('waiting')) {
             elements.reactionResult.textContent = "Premature reaction! Wait for the signal.";
             elements.reactionGameArea.className = 'ready';
             elements.reactionGameArea.textContent = "Too Soon!";
            resetReactionGameState();
         } else if (elements.reactionGameArea.classList.contains('go')) {
            const endTime = performance.now();
             const timeTaken = Math.round(endTime - state.reactionGame.startTime);
             elements.reactionResult.innerHTML = `Response Time: <span class="time">${timeTaken} ms</span>`;
             elements.reactionGameArea.className = ''; // Reset class
             elements.reactionGameArea.textContent = `${timeTaken} ms`;
            updateBestReactionTime(timeTaken);
            resetReactionGameState();
        }
          playUISound();
    }

    function resetReactionGameState() {
          state.reactionGame.active = false;
          if(elements.startReactionBtn) elements.startReactionBtn.disabled = false;
          if(elements.reactionInstructions) elements.reactionInstructions.textContent = "Initiate test sequence below. Respond precisely when prompted.";
     }

    function resetReactionGame() {
          clearTimeout(state.reactionGame.timeout);
         resetReactionGameState();
          if(elements.reactionGameArea) {
              elements.reactionGameArea.className = '';
              elements.reactionGameArea.textContent = "Initiate";
          }
          displayBestReactionTime(); // Ensure best time is shown on reset
    }

    function updateBestReactionTime(newTime) {
         if (state.reactionGame.bestTime === null || newTime < parseInt(state.reactionGame.bestTime)) {
             state.reactionGame.bestTime = newTime;
             localStorage.setItem('bestReactionTime', state.reactionGame.bestTime);
            displayBestReactionTime();
             if(elements.reactionResult) elements.reactionResult.innerHTML += " <span class='accent-text'>[New Record]</span>";
        }
    }

    function displayBestReactionTime() {
         const bestTimeText = state.reactionGame.bestTime ? `${state.reactionGame.bestTime} ms` : 'N/A';
         if(elements.bestReactionTimeEl) {
             elements.bestReactionTimeEl.textContent = bestTimeText;
        }
          // Update result area only if game is not active
          if(elements.reactionResult && !state.reactionGame.active) {
              elements.reactionResult.textContent = `Best Recorded Time: ${bestTimeText}`;
         }
    }


    // --- Connection Analyzer ---
    function initConnectionAnalyzer() {
        if(!elements.analyzeBtn) return;
        logDebug("Initializing connection analyzer...");
        elements.analyzeBtn.addEventListener('click', runConnectionAnalysis);
    }

    async function runConnectionAnalysis() {
        if (!elements.analyzeBtn) return;
        elements.analyzeBtn.disabled = true;
        elements.analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        logDebug("Starting connection analysis...");

        try {
            updateMetric('ping', '--', 'ms', 0);
            updateMetric('jitter', '--', 'ms', 0);
            updateMetric('bandwidth', '--', 'Mbps', 0);
            if(elements.connectionRecommendation) elements.connectionRecommendation.textContent = "Running diagnostics...";

            // NUI Placeholder: Ideally, ask the client/server to perform these tests against the game server itself.
            // Simulating tests for browser environment:
            const pingPromise = testPingAndJitterSimulation();
            const bandwidthPromise = testDownloadSpeedSimulation();

            const [pingResults, downloadSpeed] = await Promise.all([pingPromise, bandwidthPromise]);

            updateMetric('ping', pingResults.ping, 'ms', calculateBarPercentage('ping', pingResults.ping));
            updateMetric('jitter', pingResults.jitter, 'ms', calculateBarPercentage('jitter', pingResults.jitter));
            updateMetric('bandwidth', downloadSpeed, 'Mbps', calculateBarPercentage('bandwidth', downloadSpeed));

            provideConnectionRecommendation(pingResults.ping, pingResults.jitter, downloadSpeed);
            updatePingStatusIndicator(pingResults.ping); // Update top bar ping

        } catch (error) {
            console.error('Connection analysis failed:', error);
             if(elements.connectionRecommendation) {
                elements.connectionRecommendation.textContent = "❌ Diagnostics failed. Check console for details.";
                elements.connectionRecommendation.style.color = 'var(--color-error)';
             }
             updatePingStatusIndicator(null); // Indicate error in top bar
        } finally {
            elements.analyzeBtn.disabled = false;
            elements.analyzeBtn.innerHTML = '<i class="fas fa-bolt"></i> Run Test';
             logDebug("Connection analysis finished.");
              playUISound();
        }
    }

    // --- Simulation Functions (Replace with NUI Calls) ---
    async function testPingAndJitterSimulation() {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500)); // Simulate network delay
        const ping = Math.floor(Math.random() * 150) + 10; // 10-160ms
        const jitter = Math.floor(Math.random() * (ping / 4)); // Jitter related to ping
        return { ping, jitter };
    }
    async function testDownloadSpeedSimulation() {
         await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // Simulate download time
         return Math.floor(Math.random() * 200) + 5; // 5-205 Mbps
    }
    // --- End Simulation Functions ---


    function updateMetric(metric, value, unit, percentage) {
        const valueElement = elements[`${metric}Value`];
        const barElement = elements[`${metric}Bar`];
        if (valueElement) valueElement.textContent = `${value} ${unit}`;
        if (barElement) barElement.style.width = `${percentage}%`;
    }

    function calculateBarPercentage(metric, value) {
         // Normalize value to percentage (0-100) where higher is generally better
         // except for ping/jitter where lower is better.
         let percentage = 0;
         value = parseFloat(value);
         if (isNaN(value)) return 0;

         switch(metric) {
             case 'ping': // Lower is better. Target < 50ms good, > 150ms bad.
                 percentage = Math.max(0, 100 - ((value - 10) / 1.4)); // Scale 10-150ms to 100-0%
                 break;
             case 'jitter': // Lower is better. Target < 10ms good, > 30ms bad.
                 percentage = Math.max(0, 100 - (value / 0.3)); // Scale 0-30ms to 100-0%
                 break;
             case 'bandwidth': // Higher is better. Target 100Mbps+ good, < 25Mbps bad.
                 percentage = Math.min(100, (value / 1.5)); // Scale 0-150Mbps+ to 0-100%
                 break;
         }
         return Math.round(Math.min(100, Math.max(0, percentage)));
    }


    function provideConnectionRecommendation(ping, jitter, downloadSpeed) {
         let recommendation = '';
         let quality = 'poor'; // poor, fair, good, excellent

         if (ping < 50 && jitter < 10 && downloadSpeed >= 100) quality = 'excellent';
         else if (ping < 100 && jitter < 20 && downloadSpeed >= 50) quality = 'good';
         else if (ping < 150 && jitter < 30 && downloadSpeed >= 25) quality = 'fair';

         switch(quality) {
             case 'excellent':
                 recommendation = "✨ Optimal Connection Detected. Network performance is excellent for all activities.";
                 if(elements.connectionRecommendation) elements.connectionRecommendation.style.color = 'var(--color-success)';
                 break;
             case 'good':
                  recommendation = "✅ Stable Connection. Performance suitable for a smooth roleplay experience.";
                  if(elements.connectionRecommendation) elements.connectionRecommendation.style.color = 'var(--color-info)';
                 break;
             case 'fair':
                  recommendation = "⚠️ Moderate Connection. You may experience minor inconsistencies during peak network load.";
                  if(elements.connectionRecommendation) elements.connectionRecommendation.style.color = 'var(--color-warning)';
                  break;
             case 'poor':
             default:
                  recommendation = "❌ Suboptimal Connection. Significant latency, jitter, or low bandwidth detected. Consider network troubleshooting (restart router, check cables, limit other downloads) or contacting your ISP.";
                  if(elements.connectionRecommendation) elements.connectionRecommendation.style.color = 'var(--color-error)';
                 break;
         }

         if(elements.connectionRecommendation) elements.connectionRecommendation.textContent = recommendation;
     }

    // --- Floating Elements & Status Updates ---
    function initFloatingElements() {
         logDebug("Initializing floating elements...");
         // Parallax (if enabled)
         if (state.showMotion) {
            // Use the throttled version of handleMouseMove
            document.addEventListener('mousemove', throttledMouseMove);
            // Center initially
            handleMouseMove({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
         }
         // FPS Counter (if enabled)
         if (state.showFPS) {
            requestAnimationFrame(updateFPS);
         }
    }

    // Throttle the mouse move handler to improve performance
    const throttledMouseMove = throttle(handleMouseMove, 20); // Process at most every 20ms (about 50fps)

    function throttle(func, limit) {
        let inThrottle;
        return function(e) {
            if (!inThrottle) {
                func(e);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function handleMouseMove(e) {
         if (!state.showMotion) return;
        
        // Cache DOM queries to avoid reflow
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        if (parallaxLayers.length === 0) return;
        
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const mouseX = (clientX / innerWidth) - 0.5;
        const mouseY = (clientY / innerHeight) - 0.5;

        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
            parallaxLayers.forEach(layer => {
            const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
                if (depth === 0) return; // Skip if no depth
                
                const moveX = -mouseX * depth * 40; // Reduced sensitivity for better performance
                const moveY = -mouseY * depth * 40;
                const scale = 1 + depth * 0.05; // Reduced scale effect for better performance
                
                // Use transform for GPU acceleration
                layer.style.transform = `translateZ(${-depth * 25}px) scale(${scale}) translate(${moveX}px, ${moveY}px)`;
            });
        });
    }

    // Optimize the FPS counter to use less resources
    function updateFPS() {
        if (!state.showFPS) return; // Stop loop if disabled

        const now = performance.now();
        fpsState.frameCount++;
        const delta = now - fpsState.lastFrameTime;

        if (delta >= config.fpsUpdateInterval) {
            const fps = Math.round((fpsState.frameCount * 1000) / delta);
            // Only update DOM if FPS changed significantly (by 5 or more)
            if (!fpsState.lastFPS || Math.abs(fps - fpsState.lastFPS) >= 5) {
                if (elements.fpsCounter) elements.fpsCounter.textContent = `${fps} FPS`;
                fpsState.lastFPS = fps;
            }
            fpsState.lastFrameTime = now;
            fpsState.frameCount = 0;
        }
        requestAnimationFrame(updateFPS); // Continue loop
    }

    // Optimize particles to use less resources
    function initParticlesIfAvailable() {
      const particlesContainer = document.getElementById("particles-js");
      if (typeof particlesJS !== "undefined" && particlesContainer && state.showEffects) {
        logDebug("Initializing/Updating particles...");
        const existingCanvas = particlesContainer.querySelector('canvas');
        if(existingCanvas) existingCanvas.remove(); // Remove old canvas if exists

         // Get theme-specific colors (ensure CSS variables are computed)
        const computedStyle = getComputedStyle(elements.html);
        const particleColor = computedStyle.getPropertyValue('--color-primary').trim();
        const linkColor = computedStyle.getPropertyValue('--color-primary-light').trim() || particleColor; // Fallback
        const particleOpacity = (state.currentTheme === 'neon') ? 0.7 : (state.currentTheme === 'light' ? 0.6 : 0.5);
        const linkOpacity = (state.currentTheme === 'neon') ? 0.5 : (state.currentTheme === 'light' ? 0.5 : 0.4);
            
            // Reduce particle count for better performance
            const particleCount = (state.currentTheme === 'neon') ? 40 : 30;

        particlesJS("particles-js", {
          particles: {
                    number: { value: particleCount, density: { enable: true, value_area: 1000 } },
            color: { value: particleColor },
            shape: { type: "circle" },
                    opacity: { value: particleOpacity, random: true, anim: { enable: true, speed: 0.3, opacity_min: 0.1, sync: false } },
            size: { value: 3, random: true, anim: { enable: false } },
            line_linked: {
              enable: true, distance: 150, color: linkColor,
              opacity: linkOpacity, width: 1,
            },
            move: {
                        enable: true, speed: 0.8, // Reduced speed
                        direction: "none", random: true,
              straight: false, out_mode: "out", bounce: false,
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
                        onhover: { enable: true, mode: "grab" },
                        onclick: { enable: false },
              resize: true,
            },
            modes: {
                        grab: { distance: 140, line_linked: { opacity: 0.8 } },
            },
          },
                retina_detect: false, // Disable retina detection for better performance
        });
      } else if (!state.showEffects) {
          const existingCanvas = particlesContainer?.querySelector('canvas');
          if(existingCanvas) existingCanvas.remove(); // Ensure removal if effects disabled
      }
    }

    // Optimize responsiveness handlers
    function initResponsivenessAdjustments() {
        logDebug("Initializing responsiveness adjustments.");
        adjustLayoutForScreenSize(); // Initial check
        
        // Use throttled versions for resize handlers
        window.addEventListener('resize', throttle(adjustLayoutForScreenSize, 250));
        window.addEventListener('resize', throttle(adjustMapLayout, 250));
    }

    // Optimize music progress updates to use less resources
    function updateMusicProgress() {
        if (!elements.backgroundMusic || !elements.musicProgressFill || !elements.musicCurrentTime) return;
        
        if (elements.backgroundMusic.duration) {
            const progress = (elements.backgroundMusic.currentTime / elements.backgroundMusic.duration) * 100;
            // Only update DOM when progress changes by at least 1%
            if (!state.lastProgress || Math.abs(progress - state.lastProgress) >= 1) {
                elements.musicProgressFill.style.width = `${progress}%`;
                state.lastProgress = progress;
            }
            
            // Only update time display when it changes by at least 1 second
            const currentSecond = Math.floor(elements.backgroundMusic.currentTime);
            if (!state.lastSecond || currentSecond !== state.lastSecond) {
                elements.musicCurrentTime.textContent = formatTime(elements.backgroundMusic.currentTime);
                state.lastSecond = currentSecond;
            }
        }
    }

     // --- Notifications ---
     function initNotifications() {
        logDebug("Initializing notifications system.");
        // Start cycling notifications after intro, but only if not skipped yet
        if (state.introActive) {
             setTimeout(() => {
                 if (!state.introSkipped) cycleNotifications();
             }, config.introDuration + 1000); // Start slightly after intro auto-skips
         } else {
            // If intro was already skipped (e.g., page reload after skip), start sooner
             setTimeout(cycleNotifications, 2000);
         }
    }

    function cycleNotifications() {
        if (!state.notifications.length || !elements.notificationsArea) {
            logDebug("Notification cycling stopped (no notifications or area).");
            return;
        }

        // Function to actually show the next notification
        const displayNext = () => {
            const notificationData = state.notifications[state.currentNotificationIndex];
            showNotification(notificationData.type, notificationData.title, notificationData.message);
            state.currentNotificationIndex = (state.currentNotificationIndex + 1) % state.notifications.length;

            // Schedule the next cycle
            clearTimeout(state.notificationTimeout); // Clear previous timeout just in case
            state.notificationTimeout = setTimeout(cycleNotifications, config.notificationInterval);
            logDebug(`Scheduled next notification in ${config.notificationInterval}ms.`);
        };

        // Remove existing notification if any, then show the next one
        const existingNotif = elements.notificationsArea.querySelector('.notification-item');
        if (existingNotif) {
            // Define exit animation (adjust keyframes if needed)
            existingNotif.style.animation = 'slideOutNotification 0.5s ease-out forwards';
            // Wait for animation to finish before removing and showing next
            setTimeout(() => {
                existingNotif.remove();
                displayNext();
            }, 500); // Match animation duration
        } else {
            // If no existing notification, just show the next one immediately
            displayNext();
        }
    }

    function showNotification(type = 'info', title, message) {
        if (!elements.notificationsArea) return;
        logDebug(`Showing notification: [${type}] ${title}`);

        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${type}`; // Add type class for styling

        let iconClass = 'fa-info-circle'; // Default icon
        if (type === 'tip') iconClass = 'fa-lightbulb';
        else if (type === 'warning') iconClass = 'fa-exclamation-triangle';
        else if (type === 'success') iconClass = 'fa-check-circle';
        else if (type === 'error') iconClass = 'fa-times-circle';

        notificationItem.innerHTML = `
            <div class="notification-icon"><i class="fas ${iconClass}"></i></div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;

        elements.notificationsArea.appendChild(notificationItem);

        // Auto-remove after a delay (only if it's not part of the cycling ones)
        // Note: The cycleNotifications function handles removal for cycled tips.
        // This part is useful if you want to show one-off notifications.
        /*
        setTimeout(() => {
            if (notificationItem.parentNode) { // Check if still exists
                 notificationItem.style.animation = 'slideOutNotification 0.5s ease-out forwards';
                 setTimeout(() => notificationItem.remove(), 500);
             }
        }, config.notificationDuration);
        */
    }

    // Keyframe animations for notifications (should be in CSS, but can add here if needed)
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes slideInNotification {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutNotification {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100%); }
        }
    `;
    document.head.appendChild(styleSheet);


    // --- Utility Listeners & Functions ---
    function initUtilityListeners() {
         logDebug("Initializing utility listeners...");
         // Copy Buttons
         elements.copyBtns?.forEach(btn => {
             btn.addEventListener('click', handleCopyClick);
         });

         // Global key listeners (Optional - if needed outside intro)
         // document.addEventListener('keydown', handleGlobalKeys);
    }

    function handleCopyClick(e) {
         const textToCopy = e.currentTarget.getAttribute('data-clipboard-text');
         if (!textToCopy) {
            showNotification('error', 'Copy Failed', 'No text available to copy.');
            return;
         }

         try {
             // Use a fallback approach first by creating a temporary textarea element
             const tempTextArea = document.createElement('textarea');
             tempTextArea.value = textToCopy;
             tempTextArea.style.position = 'fixed';
             tempTextArea.style.left = '-999999px';
             tempTextArea.style.top = '-999999px';
             document.body.appendChild(tempTextArea);
             tempTextArea.focus();
             tempTextArea.select();
             
             const successful = document.execCommand('copy');
             document.body.removeChild(tempTextArea);
             
             if (successful) {
                 // Success! Continue with visual feedback
                 logDebug(`Copied to clipboard: ${textToCopy}`);
                 const originalIcon = e.currentTarget.innerHTML;
                 e.currentTarget.innerHTML = '<i class="fas fa-check"></i>';
                 e.currentTarget.title = 'Copied!';
                 e.currentTarget.classList.add('copied');
                 
                 // Show success notification
                 showNotification('success', 'Copied Successfully', `${textToCopy} copied to clipboard.`);
                 
                 setTimeout(() => {
                     e.currentTarget.innerHTML = originalIcon;
                     e.currentTarget.title = 'Copy';
                     e.currentTarget.classList.remove('copied');
                 }, 1500);
                 playUISound();
                 return;
             }
         } catch (err) {
             console.warn('execCommand fallback failed, trying clipboard API...', err);
         }
         
         // Try the Clipboard API as a backup method
         navigator.clipboard.writeText(textToCopy).then(() => {
             logDebug(`Copied to clipboard via API: ${textToCopy}`);
             const originalIcon = e.currentTarget.innerHTML;
             e.currentTarget.innerHTML = '<i class="fas fa-check"></i>';
             e.currentTarget.title = 'Copied!';
             e.currentTarget.classList.add('copied');
             
             // Show success notification
             showNotification('success', 'Copied Successfully', `${textToCopy} copied to clipboard.`);
             
             setTimeout(() => {
                 e.currentTarget.innerHTML = originalIcon;
                 e.currentTarget.title = 'Copy';
                 e.currentTarget.classList.remove('copied');
             }, 1500);
             playUISound();
         }).catch(err => {
             console.error('Failed to copy text: ', err);
             showNotification('error', 'Copy Failed', 'Could not copy text automatically. Please try copying manually.');
         });
    }

    function playUISound() {
      if (elements.uiSound && !state.isMuted && state.sfxVolume > 0) {
        elements.uiSound.volume = state.sfxVolume; // Ensure correct volume
        elements.uiSound.currentTime = 0;
        elements.uiSound.play().catch(e => console.warn("UI sound play failed:", e));
      }
    }

    function formatTime(seconds, showMinutes = false) {
        if (isNaN(seconds) || !isFinite(seconds)) return showMinutes ? "0:00" : "--:--";
        seconds = Math.max(0, seconds); // Ensure non-negative
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    function fadeInAudio(audioElement, targetVolume, duration) {
        let currentVolume = 0;
        const steps = 20; // Fewer steps for smoother fade
        const stepDuration = duration / steps;
        const volumeIncrement = targetVolume / steps;

        audioElement.volume = 0; // Start muted
        let fadeInterval = setInterval(() => {
            currentVolume += volumeIncrement;
            if (currentVolume >= targetVolume) {
                audioElement.volume = targetVolume;
                clearInterval(fadeInterval);
            } else {
                audioElement.volume = currentVolume;
            }
        }, stepDuration);
    }

    // Debounce function for resize/mousemove events
     function debounce(func, wait) {
         let timeout;
         return function executedFunction(...args) {
             const later = () => {
                 clearTimeout(timeout);
                 func(...args);
             };
             clearTimeout(timeout);
             timeout = setTimeout(later, wait);
         };
     }

    // --- Responsiveness ---
    function initResponsivenessAdjustments() {
         logDebug("Initializing responsiveness adjustments.");
         adjustLayoutForScreenSize(); // Initial check
         window.addEventListener('resize', debounce(adjustLayoutForScreenSize, 150));
         // Also adjust map layout specifically if needed
         adjustMapLayout();
         window.addEventListener('resize', debounce(adjustMapLayout, 150));
    }

    function adjustLayoutForScreenSize() {
         // This function can adjust specific elements based on window size
         // For example, changing grid layouts, hiding/showing elements.
         // The primary layout change (sidebar to bottom bar) is handled by CSS media queries.
         logDebug(`Window resized to: ${window.innerWidth}x${window.innerHeight}`);
         // Example: Adjust number of visible staff members based on width
    }

     function adjustMapLayout() {
         const mapLayout = document.querySelector('.map-layout-premium');
         const locationDetails = elements.locationDetails;
         if (!mapLayout || !locationDetails) return;

         if (window.innerWidth < 1200) {
             // Small screens: Details panel might be hidden unless marker clicked
             if (!locationDetails.classList.contains('visible')) {
                 locationDetails.style.display = 'none';
             }
             if(elements.detailsCloseBtn) elements.detailsCloseBtn.style.display = 'block'; // Show close btn
         } else {
             // Large screens: Always show details panel
             locationDetails.style.display = 'block';
             locationDetails.classList.remove('visible'); // Not needed on large screens
             if(elements.detailsCloseBtn) elements.detailsCloseBtn.style.display = 'none'; // Hide close btn
         }
     }

    // --- Placeholder Functions ---
     function updateMicVisualization(level) {
        // Level should be 0-1
        if(!elements.micVisualizationBars || elements.micVisualizationBars.length === 0) return;
        elements.micVisualizationBars.forEach((bar, index) => {
            const barHeight = Math.max(5, Math.min(50, level * 50 * (1 - (index / elements.micVisualizationBars.length) * 0.5) )); // Example visualization logic
            bar.style.height = `${barHeight}px`;
        });
     }

    // --- Call Initialization ---
    init();

}); 






// config updaTE




// Apply configuration when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Apply server information
  applyServerInfo();
  
  // Apply media sources
  applyMediaSources();
  
  // Apply staff list
  applyStaffList();
  
  // Apply links
  applyLinks();
  
  // Apply theme settings
  applyThemeSettings();
  
  // Apply rules
  applyRules();
  
  // Apply jobs
  applyJobs();
  
  console.log("Configuration applied successfully");
});

// Apply server information from config
function applyServerInfo() {
  // Set page title
  document.getElementById('page-title').textContent = 
    `${LOADING_CONFIG.server.name} - ${LOADING_CONFIG.server.subtitle}`;
  
  // Set server name in intro
  document.querySelectorAll('.server-name').forEach(el => {
    el.textContent = LOADING_CONFIG.server.name;
  });
  
  // Set server name in header
  document.querySelectorAll('.server-title-top').forEach(el => {
    el.textContent = LOADING_CONFIG.server.name;
  });
  
  // Set server info values
  for (const [key, value] of Object.entries(LOADING_CONFIG.serverInfo)) {
    const elements = document.querySelectorAll(`.info-value-premium[data-info="${key}"]`);
    elements.forEach(el => {
      el.textContent = value;
    });
  }
  
  // Server logo
  document.querySelectorAll('.sidebar-logo, .intro-logo-wrapper img').forEach(el => {
    if (el) el.src = LOADING_CONFIG.server.logo;
  });
}

// Apply media sources from config
function applyMediaSources() {
  // Background video
  const backgroundVideo = document.getElementById('background-video');
  if (backgroundVideo) {
    backgroundVideo.innerHTML = `<source src="${LOADING_CONFIG.media.backgroundVideo}" type="video/mp4">`;
    backgroundVideo.load();
  }
  
  // Background music
  // This will be handled by the music player initialization
  // which should reference LOADING_CONFIG.media.backgroundMusic
  
  // UI sound
  const uiSound = document.getElementById('ui-sound');
  if (uiSound) {
    uiSound.src = LOADING_CONFIG.media.uiSound;
  }
  
  // Update music tracks global var if it exists
  if (typeof MUSIC_TRACKS !== 'undefined') {
    window.MUSIC_TRACKS = LOADING_CONFIG.media.backgroundMusic;
  }
}

// Apply staff list from config
function applyStaffList() {
  const staffListContainer = document.querySelector('.staff-list-premium');
  if (staffListContainer) {
    staffListContainer.innerHTML = '';
    
    LOADING_CONFIG.staff.forEach(staff => {
      const staffElement = document.createElement('div');
      staffElement.className = 'staff-member-premium';
      staffElement.innerHTML = `
        <div class="staff-avatar-premium">
          <img src="${staff.avatar}" alt="${staff.name}">
        </div>
        <div class="staff-details-premium">
          <div class="staff-name-premium">${staff.name}</div>
          <div class="staff-role-premium ${staff.role}">${staff.role}</div>
        </div>
      `;
      staffListContainer.appendChild(staffElement);
    });
  }
}

// Apply links from config
function applyLinks() {
  // Discord link
  document.querySelectorAll('a[data-link="discord"]').forEach(el => {
    el.href = LOADING_CONFIG.links.discord;
    // Update the text if it's a displayed URL
    if (el.textContent.includes('discord.gg')) {
      el.textContent = LOADING_CONFIG.links.discord.replace('https://', '');
    }
  });
  
  // Website link
  document.querySelectorAll('a[data-link="website"]').forEach(el => {
    el.href = LOADING_CONFIG.links.website;
    // Update the text if it's a displayed URL
    if (el.textContent.includes('www.')) {
      el.textContent = LOADING_CONFIG.links.website.replace('https://', '');
      // Re-add the icon if it exists
      if (el.querySelector('.fa-external-link-alt')) {
        const icon = document.createElement('i');
        icon.className = 'fas fa-external-link-alt fa-xs';
        el.appendChild(icon);
      }
    }
  });
  
  // Store link
  document.querySelectorAll('a[data-link="store"]').forEach(el => {
    el.href = LOADING_CONFIG.links.store;
    // Update the text if it's a displayed URL
    if (el.textContent.includes('store.')) {
      el.textContent = LOADING_CONFIG.links.store.replace('https://', '');
    }
  });
  
  // Other social links
  for (const [key, value] of Object.entries(LOADING_CONFIG.links)) {
    const elements = document.querySelectorAll(`a[data-link="${key}"]`);
    elements.forEach(el => {
      el.href = value;
    });
  }
  
  // Update clipboard copy buttons for links
  document.querySelectorAll('.copy-btn-premium[data-clipboard-text]').forEach(el => {
    // Check if the button has a data-copy-link attribute
    if (el.hasAttribute('data-copy-link')) {
      const linkType = el.getAttribute('data-copy-link');
      if (LOADING_CONFIG.links[linkType]) {
        el.setAttribute('data-clipboard-text', LOADING_CONFIG.links[linkType]);
      }
    }
    // Fallback to checking parent container
    else if (el.closest('.info-item-premium').querySelector('a[data-link]')) {
      const linkType = el.closest('.info-item-premium').querySelector('a[data-link]').getAttribute('data-link');
      if (LOADING_CONFIG.links[linkType]) {
        el.setAttribute('data-clipboard-text', LOADING_CONFIG.links[linkType]);
      }
    }
  });
}

// Apply theme settings
function applyThemeSettings() {
  // Set initial theme
  document.documentElement.setAttribute('data-theme', LOADING_CONFIG.theme.default);
  
  // Apply high contrast if needed
  if (LOADING_CONFIG.theme.highContrast) {
    document.body.classList.add('high-contrast');
  }
  
  // Apply motion effects if enabled
  if (!LOADING_CONFIG.theme.motionEffects) {
    document.body.classList.add('no-motion');
  }
  
  // Weather effects would be handled by the weather system
}

// Apply rules from config
function applyRules() {
  const rulesContainer = document.querySelector('.rules-grid-premium');
  if (rulesContainer) {
    rulesContainer.innerHTML = '';
    
    // Add all rules from all sections
    let ruleNumber = 1;
    LOADING_CONFIG.rules.sections.forEach(section => {
      const sectionTitle = document.createElement('div');
      sectionTitle.className = 'section-title';
      sectionTitle.textContent = section.title;
      rulesContainer.appendChild(sectionTitle);
      
      section.rules.forEach(rule => {
        const ruleElement = document.createElement('div');
        ruleElement.className = 'rule-item-premium';
        ruleElement.innerHTML = `
          <div class="rule-number-premium">${ruleNumber}</div>
          <div class="rule-text-premium">${rule}</div>
        `;
        rulesContainer.appendChild(ruleElement);
        ruleNumber++;
      });
    });
  }
}

// Apply jobs from config
function applyJobs() {
  const jobsContainer = document.querySelector('.job-list-premium');
  if (jobsContainer) {
    jobsContainer.innerHTML = '';
    
    LOADING_CONFIG.jobs.forEach(job => {
      const jobElement = document.createElement('div');
      jobElement.className = 'job-item-premium';
      jobElement.innerHTML = `
        <div class="job-icon-premium ${job.icon}">
          <i class="fas fa-${job.icon === 'police' ? 'shield-alt' : 
                             job.icon === 'ambulance' ? 'ambulance' : 
                             job.icon === 'mechanic' ? 'wrench' : 
                             job.icon === 'taxi' ? 'taxi' : 'briefcase'}"></i>
        </div>
        <div class="job-details-premium">
          <div class="job-name-premium">${job.name}</div>
          <div class="job-status-premium ${job.status}">${
            job.status === 'high' ? 'High Demand' : 
            job.status === 'medium' ? 'Medium Demand' : 
            'Low Demand'
          }</div>
        </div>
      `;
      jobsContainer.appendChild(jobElement);
    });
  }
}

// Add game iframe functionality
function initGameIframe() {
    const closeBtn = document.querySelector('.video-play-2');
    const tabletFrame = document.querySelector('.tablet-frame');
    const iframe = document.querySelector('.tablet-screen iframe');
    const videoImg = document.querySelector('.video-img-2');
    const videoText = document.querySelector('.video-text-2');
    const homeButton = document.querySelector('.tablet-home-button');
    
    if (!closeBtn || !iframe || !videoImg || !videoText || !tabletFrame) return;
    
    // Initial state - tablet frame hidden, cover visible
    tabletFrame.style.display = 'none';
    videoImg.style.display = 'block';
    videoText.style.display = 'block';
    closeBtn.textContent = 'PLAY';
    
    // Function to toggle game display
    function toggleGame() {
        if (tabletFrame.style.display === 'none') {
            // Show iframe, hide cover
            tabletFrame.style.display = 'flex';
            videoImg.style.display = 'none';
            videoText.style.display = 'none';
            closeBtn.textContent = 'CLOSE';
        } else {
            // Hide iframe, show cover
            tabletFrame.style.display = 'none';
            videoImg.style.display = 'block';
            videoText.style.display = 'block';
            closeBtn.textContent = 'PLAY';
        }
        playUISound();
    }
    
    // Toggle when close/play button is clicked
    closeBtn.addEventListener('click', toggleGame);
    
    // Home button functionality - refresh the iframe
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            if (iframe.src) {
                const currentSrc = iframe.src;
                iframe.src = '';
                setTimeout(() => {
                    iframe.src = currentSrc;
                }, 100);
                playUISound();
            }
    });
  }
}
