import './style.css'
import { Flashlight } from './flashlight'

// Google Analytics types
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface AnalyticsData {
  sessionId: string;
  startTime: number;
  deviceInfo: {
    userAgent: string;
    platform: string;
    language: string;
    screenResolution: string;
    viewportSize: string;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };
  userJourney: {
    steps: Array<{
      action: string;
      timestamp: number;
      details?: any;
    }>;
    totalTime: number;
  };
  performance: {
    pageLoadTime: number;
    interactionTimes: Record<string, number>;
  };
}

interface CVData {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  about: string;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    description: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
}



class ProfessionalCV {
  private cvData: CVData;
  private flashlight: Flashlight | null = null;
  private analyticsData!: AnalyticsData;

  constructor() {
    // Initialize analytics data
    this.initializeAnalytics();
    
    this.cvData = {
      name: 'Faustas',
      title: 'Web & Software Developer',
      location: 'Vilnius, Lithuania',
      email: 'noreikafaustas@gmail.com',
      linkedin: 'www.linkedin.com/in/faustas-noreika-5324b4346',
      github: 'https://github.com/FaustasN',
      about: "Ambitious and detail-oriented graduate in Software Engineering from Vilnius Tech University, with hands-on experience in IT system administration, programming, and teamwork across various industries. Strong technical foundation in C++, C#, HTML, JavaScript, and TypeScript, with practical experience using Node.js and CSS, as well as server administration, system monitoring (Zabbix), and virtualization (VMware). Currently planning to pursue a Master's degree in Artificial Intelligence Solutions Management, aiming to deepen expertise in intelligent systems and real-world AI applications. Passionate about continuous learning, solving complex problems, and driving innovation through technology.",
      experience: [
        {
          title: 'Intern Critical IT Systems Administrator',
          company: 'Lithuanian airports',
          period: '2023 - 2024',
          description: [
            'Gained hands-on experience with Zabbix, VMware. BGINFO, REALVNC, TeamViewer.',
            'Optimized database queries improving performance by 40%',
            'Integrated third-party APIs and payment systems',
            'Participated in agile development processes'
          ]
        }
      ],
      skills: {
        technical: [
          'C++', 'C#', 'HTML', 'CSS', 'JavaScript', 'TypeScript',
          'Node.js', 'Express.js', 'React', 'Vue.js',
          'Python',
          'MySQL', 'PostgreSQL', 'MongoDB',
          'Zabbix', 'VMware', 'Docker', 'AWS', 'GNS3',
          'TeamViewer', 'RealVNC', 'BGInfo', 'Solar-Putty',
          'Git', 'GitHub',
          'GraphQL', 'REST APIs',
          'Webpack', 'Vite', 'Bash'
        ],
        soft: [
          'Problem Solving', 'Critical Thinking', 'Team Collaboration',
          'Team Leadership', 'Communication',
          'Project Management', 'Mentoring',
          'Agile/Scrum', 'Adaptability', 'Time Management'
        ]
      },
      education: [
        {
          degree: 'Software Engineering Specialization',
          institution: 'NKKM course',
          year: '2018 - 2020'
        },
        {
          degree: 'Bachelor of Software Engineering',
          institution: 'Vilnius Gediminas Technical University',
          year: '2021 - 2025'
        },
        {
          degree: 'Master of Artificial Intelligence Solutions Management',
          institution: 'Vilnius Gediminas Technical University',
          year: '2025 - 2027'
        }
      ],
    };
    
    this.init();
  }

  private initializeAnalytics(): void {
    const now = Date.now();
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const viewport = `${window.innerWidth}x${window.innerHeight}`;
    
    // Detect device type
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    const isDesktop = window.innerWidth > 1024;

    this.analyticsData = {
      sessionId: `cv_session_${now}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: now,
      deviceInfo: {
        userAgent,
        platform,
        language,
        screenResolution: screenRes,
        viewportSize: viewport,
        isMobile,
        isTablet,
        isDesktop
      },
      userJourney: {
        steps: [],
        totalTime: 0
      },
      performance: {
        pageLoadTime: now,
        interactionTimes: {}
      }
    };

    // Track page load performance
    window.addEventListener('load', () => {
      this.analyticsData.performance.pageLoadTime = Date.now() - now;
      this.trackEvent('page_performance', 'page_load_time', 'cv_loaded', this.analyticsData.performance.pageLoadTime);
    });

    // Track device info
    this.trackEvent('device_info', 'device_detected', 'device_type', isMobile ? 1 : isTablet ? 2 : 3);
    
    // Add initial journey step
    this.addJourneyStep('cv_initialized', { deviceInfo: this.analyticsData.deviceInfo });
    
    // Track scroll depth and engagement
    this.setupEngagementTracking();
    
    // Setup dynamic zoom handling
    this.setupZoomHandling();
  }

  private setupEngagementTracking(): void {
    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollDepth = Math.round((scrollTop + windowHeight) / documentHeight * 100);
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track significant scroll milestones
        if (scrollDepth >= 25 && scrollDepth % 25 === 0) {
          this.trackDetailedEvent('scroll_depth_reached', 'engagement', {
            label: `${scrollDepth}%`,
            value: scrollDepth,
            timeSpent: Date.now() - this.analyticsData.startTime,
            deviceInfo: true
          });
        }
      }
    };

    // Track time spent on page
    let timeOnPage = 0;
    const trackTimeOnPage = () => {
      timeOnPage += 10; // Update every 10 seconds
      
      if (timeOnPage % 30 === 0 && timeOnPage <= 300) { // Track every 30 seconds up to 5 minutes
        this.trackDetailedEvent('time_on_page', 'engagement', {
          label: `${timeOnPage}s`,
          value: timeOnPage,
          deviceInfo: true
        });
      }
    };

    // Track visibility changes (when user switches tabs)
    let visibilityStartTime = Date.now();
    const trackVisibility = () => {
      if (document.hidden) {
        const visibleTime = Date.now() - visibilityStartTime;
        this.trackDetailedEvent('page_hidden', 'engagement', {
          label: 'tab_switched',
          value: visibleTime,
          timeSpent: visibleTime,
          deviceInfo: true
        });
      } else {
        visibilityStartTime = Date.now();
        this.trackDetailedEvent('page_visible', 'engagement', {
          label: 'tab_focused',
          deviceInfo: true
        });
      }
    };

    // Set up event listeners
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    setInterval(trackTimeOnPage, 10000);
    document.addEventListener('visibilitychange', trackVisibility);
    
    // Track page exit
    window.addEventListener('beforeunload', () => {
      this.trackDetailedEvent('page_exit', 'engagement', {
        label: 'session_ended',
        value: Date.now() - this.analyticsData.startTime,
        timeSpent: Date.now() - this.analyticsData.startTime,
        deviceInfo: true
      });
    });
  }

  private setupZoomHandling(): void {
    let currentZoomLevel = this.getZoomLevel();
    let lastZoomLevel = currentZoomLevel;
    
    // Apply initial zoom-based styling
    this.applyZoomStyles(currentZoomLevel);
    
    // Track zoom changes
    const trackZoomChanges = () => {
      currentZoomLevel = this.getZoomLevel();
      
      // Only apply changes if zoom level actually changed
      if (Math.abs(currentZoomLevel - lastZoomLevel) > 0.05) { // 5% threshold
        this.applyZoomStyles(currentZoomLevel);
        lastZoomLevel = currentZoomLevel;
        
        // Track zoom change in analytics
        this.trackDetailedEvent('zoom_level_changed', 'user_interaction', {
          label: `${Math.round(currentZoomLevel * 100)}%`,
          value: Math.round(currentZoomLevel * 100),
          deviceInfo: true
        });
      }
    };
    
    // Listen for zoom changes
    window.addEventListener('resize', trackZoomChanges);
    window.addEventListener('orientationchange', trackZoomChanges);
    
    // Also check periodically for zoom changes (some browsers don't fire resize)
    setInterval(trackZoomChanges, 500);
    
    // Store reference for cleanup
    (this as any).zoomHandler = trackZoomChanges;
  }

  private getZoomLevel(): number {
    // Method 1: Using window.devicePixelRatio (most reliable)
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Method 2: Using visual viewport (fallback)
    const visualViewport = window.visualViewport;
    if (visualViewport) {
      const scale = visualViewport.scale;
      if (scale > 0) {
        return scale;
      }
    }
    
    // Method 3: Calculate based on screen dimensions (fallback)
    const screenWidth = screen.width;
    const windowWidth = window.innerWidth;
    const calculatedZoom = windowWidth / screenWidth;
    
    // Use the most reliable method available
    if (devicePixelRatio > 0 && devicePixelRatio !== 1) {
      return devicePixelRatio;
    } else if (calculatedZoom > 0 && calculatedZoom !== 1) {
      return calculatedZoom;
    }
    
    return 1; // Default to 100%
  }

  private applyZoomStyles(zoomLevel: number): void {
    // Only apply zoom styles on desktop (screens wider than 768px)
    if (window.innerWidth <= 768) return;
    
    const root = document.documentElement;
    
    // Calculate zoom-based font size multipliers
    // When zoomed in (>100%), make text smaller
    // When zoomed out (<100%), make text bigger
    let zoomMultiplier = 1;
    
    if (zoomLevel > 1) {
      // Zoomed in: reduce text size
      zoomMultiplier = Math.max(0.7, 1 - (zoomLevel - 1) * 0.3);
    } else if (zoomLevel < 1) {
      // Zoomed out: increase text size
      zoomMultiplier = Math.min(1.3, 1 + (1 - zoomLevel) * 0.3);
    }
    
    // Apply zoom-based CSS custom properties
    root.style.setProperty('--zoom-multiplier', zoomMultiplier.toString());
    root.style.setProperty('--zoom-level', zoomLevel.toString());
    
    // Apply dynamic styles to section content
    const sectionContents = document.querySelectorAll('.icon-section-content');
    sectionContents.forEach(content => {
      const element = content as HTMLElement;
      
      // Calculate dynamic font sizes
      const baseFontSize = 0.85;
      const baseH3Size = 1.0;
      const basePSize = 0.8;
      const baseH4Size = 0.9;
      
      element.style.setProperty('--dynamic-font-size', `${baseFontSize * zoomMultiplier}rem`);
      element.style.setProperty('--dynamic-h3-size', `${baseH3Size * zoomMultiplier}rem`);
      element.style.setProperty('--dynamic-p-size', `${basePSize * zoomMultiplier}rem`);
      element.style.setProperty('--dynamic-h4-size', `${baseH4Size * zoomMultiplier}rem`);
    });
    
    // Apply dynamic styles to intro text elements
    const introTexts = document.querySelectorAll('.intro-text, .first-text, .second-text, .search-text, .choice-feedback');
    introTexts.forEach(text => {
      const element = text as HTMLElement;
      const currentFontSize = parseFloat(getComputedStyle(element).fontSize);
      const newFontSize = currentFontSize * zoomMultiplier;
      element.style.fontSize = `${newFontSize}px`;
    });
    
    // Apply dynamic styles to buttons
    const buttons = document.querySelectorAll('.choice-btn, .download-cv-btn, .back-btn');
    buttons.forEach(button => {
      const element = button as HTMLElement;
      const currentFontSize = parseFloat(getComputedStyle(element).fontSize);
      const newFontSize = currentFontSize * zoomMultiplier;
      element.style.fontSize = `${newFontSize}px`;
    });
  }

  private async init(): Promise<void> {
    // Initialize cookie consent
    this.initCookieConsent();
    
    // Check if Analytics is working
   // this.checkAnalyticsStatus();
    
    // Track page view (only if consent given)
    if (this.hasAnalyticsConsent()) {
      this.trackEvent('page_view', 'cv_loaded');
    }
    
    // Lazy load intro sequence for better performance
    await this.showIntroSequence();
   // await this.showFlashlightSearch();
  }

  private async showIntroSequence(): Promise<void> {
    const app = document.querySelector<HTMLDivElement>('#app');
    if (!app) return;

    app.innerHTML = `
      <div class="intro-screen">
        <div class="intro-text-container">
          <h1 class="intro-text first-text">Hi, I'm ${this.cvData.name}</h1>
          <h2 class="intro-text second-text">Let's play a little game, shall we?</h2>
          <div class="choice-buttons">
            <button class="choice-btn" data-choice="yes">Yes</button>
            <button class="choice-btn" data-choice="no">No</button>
          </div>
        </div>
      </div>
    `;

    // Wait for first text to appear
    await this.delay(300);
    
    // Show first text
    const firstText = document.querySelector('.first-text');
    if (firstText) {
      firstText.classList.add('visible');
      await this.delay(800);
    }

    // Show second text
    const secondText = document.querySelector('.second-text');
    if (secondText) {
      secondText.classList.add('visible');
      await this.delay(600);
    }

    // Show choice buttons
    const choiceButtons = document.querySelector('.choice-buttons');
    if (choiceButtons) {
      choiceButtons.classList.add('visible');
      await this.delay(400);
    }

    // Setup button event listeners
    this.setupChoiceButtonListeners();
  }

  private setupChoiceButtonListeners(): void {
    const yesBtn = document.querySelector('[data-choice="yes"]');
    const noBtn = document.querySelector('[data-choice="no"]');

    if (yesBtn) {
      yesBtn.addEventListener('click', () => {
        this.handleChoice('yes');
      });
    }

    if (noBtn) {
      noBtn.addEventListener('click', () => {
        this.handleChoice('no');
      });
    }
  }

  private async handleChoice(choice: string): Promise<void> {
    const app = document.querySelector<HTMLDivElement>('#app');
    if (!app) return;

    // Track user choice with detailed analytics
    this.trackDetailedEvent('intro_choice_selected', 'user_interaction', {
      label: choice,
      interaction: 'button_click',
      timeSpent: Date.now() - this.analyticsData.startTime,
      deviceInfo: true
    });

    if (choice === 'yes') {
      // Fade out all intro elements
      const introElements = document.querySelectorAll('.intro-text, .choice-buttons');
      introElements.forEach(element => {
        element.classList.add('fade-out');
      });

      await this.delay(500);

      // Show "search the area" text
      app.innerHTML = `
        <div class="intro-screen">
          <div class="intro-text-container">
            <h1 class="intro-text search-text">
              Search the area
            </h1>
          </div>
        </div>
      `;

      const searchText = document.querySelector('.search-text');
      if (searchText) {
        searchText.classList.add('visible');
        await this.delay(1000);
      }

      // Fade out the search text
      if (searchText) {
        searchText.classList.add('fade-out');
        await this.delay(500);
      }

      // Show flashlight search component
      this.trackDetailedEvent('flashlight_game_started', 'user_interaction', {
        label: 'game_start',
        interaction: 'navigation',
        timeSpent: Date.now() - this.analyticsData.startTime,
        deviceInfo: true
      });
      await this.showFlashlightSearch();
    } else {
      // For "No" choice - fade out everything and show download button
      const introElements = document.querySelectorAll('.intro-text, .choice-buttons');
      introElements.forEach(element => {
        element.classList.add('fade-out');
      });

      await this.delay(500);

      // Show download CV screen
      app.innerHTML = `
        <div class="intro-screen">
          <div class="intro-text-container">
            <h1 class="choice-feedback">
             Don't have time to play?
            </h1>
            <p class="download-subtitle">Here's my CV for your reference</p>
            <div class="download-buttons">
              <button class="download-cv-btn" onclick="this.downloadCV()">
                <span class="download-text">Download CV</span>
              </button>
              <button class="back-btn" onclick="this.goBackToIntro()">
                <span class="back-text">Back</span>
              </button>
            </div>
          </div>
        </div>
      `;

      const feedback = document.querySelector('.choice-feedback');
      if (feedback) {
        feedback.classList.add('visible');
        await this.delay(600);
      }

      const subtitle = document.querySelector('.download-subtitle');
      if (subtitle) {
        subtitle.classList.add('visible');
        await this.delay(800);
      }

      // Show download buttons
      const downloadButtons = document.querySelector('.download-buttons');
      const downloadBtn = document.querySelector('.download-cv-btn');
      const backBtn = document.querySelector('.back-btn');
      
      if (downloadButtons) {
        downloadButtons.classList.add('visible');
      }
      
      if (downloadBtn) {
        downloadBtn.classList.add('visible');
        // Bind the download function to the button
        downloadBtn.addEventListener('click', () => {
          this.downloadCV();
        });
      }
      
      if (backBtn) {
        backBtn.classList.add('visible');
        // Bind the back function to the button
        backBtn.addEventListener('click', () => {
          this.goBackToIntro();
        });
      }
    }
  }

  private createResponsiveGameContent(container: HTMLElement): void {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate safe positioning based on screen size
    let iconPositions: Array<{id: string, icon: string, top: number, left: number}>;
    
    if (isSmallMobile) {
      // Very small screens (≤480px)
      iconPositions = [
        { id: 'about-contact-section', icon: '👋', top: 15, left: 20 },
        { id: 'experience-education-section', icon: '💼', top: Math.max(15, viewportHeight - 100), left: viewportWidth - 100 },
        { id: 'skills-section', icon: '⚡', top: Math.max(15, viewportHeight * 0.4), left: Math.max(20, viewportWidth - 100) }
      ];
    } else if (isMobile) {
      // Mobile screens (≤768px)
      iconPositions = [
        { id: 'about-contact-section', icon: '👋', top: 20, left: 30 },
        { id: 'experience-education-section', icon: '💼', top: Math.max(20, viewportHeight - 120), left: viewportWidth - 120 },
        { id: 'skills-section', icon: '⚡', top: Math.max(20, viewportHeight * 0.45), left: Math.max(30, viewportWidth - 120) }
      ];
    } else {
      // Desktop screens (>768px)
      iconPositions = [
        { id: 'about-contact-section', icon: '👋', top: viewportHeight * 0.1, left: viewportWidth * 0.05 },
        { id: 'experience-education-section', icon: '💼', top: viewportHeight * 0.8, left: viewportWidth * 0.8 },
        { id: 'skills-section', icon: '⚡', top: viewportHeight * 0.5, left: viewportWidth * 0.5 }
      ];
    }
    
    // Create HTML content with calculated positions
    const iconsHTML = iconPositions.map(pos => 
      `<div class="cv-icon hidden-section" id="${pos.id}" style="top: ${pos.top}px; left: ${pos.left}px;">
        <div class="section-icon">${pos.icon}</div>
      </div>`
    ).join('');
    
    container.innerHTML = `
      <!-- Hidden CV Icons -->
      ${iconsHTML}
      
      <!-- Game Progress -->
      <div class="game-progress">
        <div class="progress-text">Found: <span id="found-count">0</span>/3</div>
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
      </div>
      
      <!-- Game Instructions -->
      <div class="game-instructions">
        <p id="game-instruction-text">Find all 3 CV sections with your flashlight!</p>
      </div>
    `;
  }

  private async showFlashlightSearch(): Promise<void> {
    const app = document.querySelector<HTMLDivElement>('#app');
    if (!app) return;

    // Create flashlight container
    const flashlightContainer = document.createElement('div');
    flashlightContainer.id = 'flashlight-game-container';
    
    // Create game content with responsive positioning
    this.createResponsiveGameContent(flashlightContainer);

    app.appendChild(flashlightContainer);

    // Initialize flashlight component with mobile-friendly positioning
    const isMobile = window.innerWidth <= 768;
    this.flashlight = new Flashlight(flashlightContainer, {
      fixedPointX: window.innerWidth / 2,
      fixedPointY: isMobile ? window.innerHeight * 0.8 : window.innerHeight, // Higher on mobile
      intensity: 0.9
    });

    // Activate flashlight
    this.flashlight.activate();

    // Set up game mechanics
    this.setupHideAndSeekGame();
    
    // Set up progress bar easter egg
    this.setupProgressBarEasterEgg();
    
    // Update instructions for mobile
    this.updateMobileInstructions();
    
    // Add resize handler to reposition icons on orientation change
    this.setupResizeHandler(flashlightContainer);
  }

  private setupHideAndSeekGame(): void {
    const foundSections = new Set<string>();
    let gameCompleted = false;
    let lastCheckTime = 0;
    const THROTTLE_DELAY = 16; // ~60fps

    // Check for flashlight detection of hidden sections
    const checkFlashlightDetection = () => {
      // Throttle for performance
      const now = Date.now();
      if (now - lastCheckTime < THROTTLE_DELAY) return;
      lastCheckTime = now;
      if (gameCompleted || !this.flashlight) return;

      const hiddenSections = document.querySelectorAll('.hidden-section');
    
      
    
      
      // Get flashlight circle element
      const flashlightCircle = document.getElementById('flashlight-circle');
      if (!flashlightCircle) {
        return;
      }

      const flashlightRect = flashlightCircle.getBoundingClientRect();
      const flashlightCenterX = flashlightRect.left + flashlightRect.width / 2;
      const flashlightCenterY = flashlightRect.top + flashlightRect.height / 2;
      

      hiddenSections.forEach((section) => {
        const sectionElement = section as HTMLElement;
        const sectionId = sectionElement.id;
        
        if (foundSections.has(sectionId)) return;

        const sectionRect = sectionElement.getBoundingClientRect();
        const sectionCenterX = sectionRect.left + sectionRect.width / 2;
        const sectionCenterY = sectionRect.top + sectionRect.height / 2;

        // Calculate distance between flashlight and section
        const distance = Math.sqrt(
          Math.pow(flashlightCenterX - sectionCenterX, 2) + 
          Math.pow(flashlightCenterY - sectionCenterY, 2)
        );

        // If flashlight is close enough, reveal the section
        if (distance < 150) {
          this.revealHiddenSection(sectionId);
          foundSections.add(sectionId);
          this.updateGameProgress(foundSections.size);
          
          if (foundSections.size >= 3) {
            this.completeGame();
            gameCompleted = true;
          }
        }
      });
    };

    // Add mouse move and touch listeners for detection
    document.addEventListener('mousemove', checkFlashlightDetection);
    document.addEventListener('touchmove', checkFlashlightDetection, { passive: false });
    document.addEventListener('touchstart', checkFlashlightDetection, { passive: false });
    
    // Store references for cleanup
    (this as any).hideAndSeekHandlers = {
      mousemove: checkFlashlightDetection,
      touchmove: checkFlashlightDetection,
      touchstart: checkFlashlightDetection
    };
  }

  private revealHiddenSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Ensure the section stays in its original position
    const computedStyle = window.getComputedStyle(section);
    section.style.position = 'absolute';
    section.style.top = computedStyle.top;
    section.style.left = computedStyle.left;
    
    // Start completely invisible with fade-in animation setup
    section.style.opacity = '0';
    section.style.transform = 'scale(0.8)';
    section.style.filter = 'blur(4px)';
    
    section.classList.remove('hidden-section');
    section.classList.add('revealed-section');
    
    // Ensure mobile compatibility
    section.style.pointerEvents = 'auto';
    section.style.zIndex = '1005';
    section.style.touchAction = 'manipulation';
    
    // Apply fade-in animation
    setTimeout(() => {
      section.style.animation = 'fade-in-icon 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    }, 50);
    
    // Ensure it stays visible after animation and add interactivity
    setTimeout(() => {
      section.style.opacity = '1';
      section.style.visibility = 'visible';
      section.style.transform = 'scale(1)';
      section.style.filter = 'blur(0px)';
      
      // Add click event listener to open CV section
      this.addIconClickListener(section, sectionId);
      
      // Add visual indicator that icon is clickable
      this.addClickIndicator(section);
    }, 1500);
  }

  private addIconClickListener(section: HTMLElement, sectionId: string): void {
    section.style.cursor = 'pointer';
    
    let isProcessing = false;
    let lastInteractionTime = 0;
    const DEBOUNCE_DELAY = 500; // Prevent rapid clicks
    
    // Handle interaction with debouncing
    const handleInteraction = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
      const now = Date.now();
      
      // Prevent rapid successive clicks
      if (isProcessing || (now - lastInteractionTime) < DEBOUNCE_DELAY) {
        return;
      }
      
      isProcessing = true;
      lastInteractionTime = now;
      
      // Track section view with detailed analytics
      const sectionOpenTime = Date.now();
      this.trackDetailedEvent('cv_section_opened', 'user_interaction', {
        label: sectionId,
        section: sectionId,
        interaction: 'icon_click',
        timeSpent: sectionOpenTime - this.analyticsData.startTime,
        deviceInfo: true
      });
      
      // Create section content next to the icon
      this.createSectionContent(section, sectionId);
      
      // Reset processing flag after a delay
      setTimeout(() => {
        isProcessing = false;
      }, DEBOUNCE_DELAY);
    };
    
    // Use different event handling for touch vs mouse devices
    if ('ontouchstart' in window) {
      // Mobile: Use touchstart only to prevent double-triggering
      section.addEventListener('touchstart', handleInteraction, { passive: false });
      
      // Add touch feedback
      section.addEventListener('touchstart', () => {
        section.style.transform = 'scale(0.95)';
        section.style.transition = 'transform 0.1s ease';
      }, { passive: true });
      
      section.addEventListener('touchend', () => {
        section.style.transform = 'scale(1)';
      }, { passive: true });
    } else {
      // Desktop: Use click only
      section.addEventListener('click', handleInteraction);
      
      // Add hover effect for desktop
      section.addEventListener('mouseenter', () => {
        section.style.transform = 'scale(1.1)';
        section.style.transition = 'transform 0.3s ease';
      });
      
      section.addEventListener('mouseleave', () => {
        section.style.transform = 'scale(1)';
      });
    }
  }

  private createSectionContent(iconElement: HTMLElement, sectionId: string): void {
    // Remove any existing content
    const existingContent = document.querySelector('.icon-section-content');
    if (existingContent) {
      existingContent.remove();
    }

    // Get icon position
    const iconRect = iconElement.getBoundingClientRect();
    const container = document.getElementById('flashlight-game-container');
    if (!container) return;

    // Create content element
    const contentElement = document.createElement('div');
    contentElement.className = 'icon-section-content';
    
    // Mobile-friendly positioning
    const isMobile = window.innerWidth <= 768;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const contentWidth = isMobile ? Math.min(viewportWidth - 40, 350) : 400;
    const contentHeight = isMobile ? 250 : 300;
    
    let contentX, contentY;
    
    if (isMobile) {
      // Mobile: Position content in the upper part but allow it to expand
      contentX = (viewportWidth - contentWidth) / 2;
      
      // Start content in the upper area but allow it to grow down
      contentY = 20; // Start near the top
      
      // Ensure content doesn't go off left or right edges
      if (contentX < 20) {
        contentX = 20;
      }
      if (contentX + contentWidth > viewportWidth - 20) {
        contentX = viewportWidth - contentWidth - 20;
      }
      
      // If content would go off bottom, move it higher
      if (contentY + contentHeight > viewportHeight - 100) {
        contentY = Math.max(20, viewportHeight - contentHeight - 100);
      }
    } else {
      // Desktop: Position next to icon
      contentX = iconRect.right + 20;
      contentY = iconRect.top;
      
      // If content would go off right edge, position it to the left of icon
      if (contentX + contentWidth > viewportWidth) {
        contentX = iconRect.left - contentWidth - 20;
      }
      
      // If content would go off bottom edge, adjust Y position
      if (contentY + contentHeight > viewportHeight) {
        contentY = viewportHeight - contentHeight - 20;
      }
      
      // Ensure content doesn't go off top edge
      if (contentY < 20) {
        contentY = 20;
      }
      
      // Additional adjustment: if content is too low, move it higher
      if (contentY > viewportHeight * 0.6) {
        contentY = viewportHeight * 0.4; // Position in upper 40% of screen
      }
      
      // Special positioning for skills section - move content higher
      if (sectionId === 'skills-section') {
        contentY = Math.min(contentY, viewportHeight * 0.3); // Position in upper 30% of screen
      }
      
      // Special positioning for experience-education section - move content higher
      if (sectionId === 'experience-education-section') {
        contentY = Math.min(contentY, viewportHeight * 0.25); // Position in upper 25% of screen
      }
      
      // Ensure content doesn't go off left edge
      if (contentX < 20) {
        contentX = 20;
      }
    }
    
    
    contentElement.style.cssText = `
      position: absolute;
      left: ${contentX}px;
      top: ${contentY}px;
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      padding: ${isMobile ? '1rem' : '1.5rem'};
      max-width: ${contentWidth}px;
      width: ${contentWidth}px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      z-index: 1006;
      opacity: 0;
      transform: ${isMobile ? 'translateY(-20px)' : 'translateX(-20px)'};
      transition: all 0.5s ease;
      pointer-events: auto;
      touch-action: manipulation;
      /* Allow content to expand naturally */
      min-height: auto;
      height: auto;
    `;

    // Add content based on section with typewriter effect
    this.addTypewriterContent(contentElement, sectionId);
    
    container.appendChild(contentElement);
    
    // Animate in
    setTimeout(() => {
      contentElement.style.opacity = '1';
      contentElement.style.transform = 'translate(0, 0)';
    }, 100);

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #ffffff;
      font-size: ${isMobile ? '1.4rem' : '1.2rem'};
      cursor: pointer;
      padding: ${isMobile ? '0.4rem' : '0.25rem'};
      border-radius: 50%;
      width: ${isMobile ? '40px' : '30px'};
      height: ${isMobile ? '40px' : '30px'};
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1007;
      pointer-events: auto;
      transition: all 0.3s ease;
      touch-action: manipulation;
      -webkit-tap-highlight-color: rgba(255, 255, 255, 0.2);
    `;
    
    // Handle close button with debouncing
    let isClosing = false;
    const handleClose = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isClosing) return;
      isClosing = true;
      
      contentElement.style.opacity = '0';
      contentElement.style.transform = isMobile ? 'translateY(-20px)' : 'translateX(-20px)';
      setTimeout(() => {
        if (contentElement.parentNode) {
          contentElement.parentNode.removeChild(contentElement);
        }
        isClosing = false;
      }, 500);
    };
    
    // Use different event handling for touch vs mouse devices
    if ('ontouchstart' in window) {
      // Mobile: Use touchstart only
      closeBtn.addEventListener('touchstart', handleClose, { passive: false });
      
      // Add touch feedback
      closeBtn.addEventListener('touchstart', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        closeBtn.style.transform = 'scale(0.95)';
      }, { passive: true });
      
      closeBtn.addEventListener('touchend', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        closeBtn.style.transform = 'scale(1)';
      }, { passive: true });
    } else {
      // Desktop: Use click only
      closeBtn.addEventListener('click', handleClose);
      
      // Add hover effect for desktop
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        closeBtn.style.transform = 'scale(1.1)';
      });
      
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        closeBtn.style.transform = 'scale(1)';
      });
    }
    
    contentElement.appendChild(closeBtn);
  }

  private addTypewriterContent(container: HTMLElement, sectionId: string): void {
    const contentData = this.getSectionContentData(sectionId);
    
    // Create title element
    const titleElement = document.createElement('h3');
    titleElement.style.cssText = 'color: #ffffff; margin-bottom: 1rem; font-size: 1.3rem; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;';
    titleElement.innerHTML = '<span class="typewriter-cursor">|</span>';
    container.appendChild(titleElement);
    
    // Type the title
    this.typeText(titleElement, contentData.title, 20, () => {
      // After title is done, create and type the content
      const contentContainer = document.createElement('div');
      container.appendChild(contentContainer);  
      
      this.typeSectionContent(contentContainer, contentData.content, 10);
    });
  }

  private typeSectionContent(container: HTMLElement, content: Array<{type: string, value: string}>, speed: number): void {
    let currentIndex = 0;
    
    const typeNext = () => {
      if (currentIndex >= content.length) {
        // All content is typed, remove cursor
        const cursors = container.querySelectorAll('.typewriter-cursor');
        cursors.forEach(cursor => cursor.remove());
        return;
      }
      
      const item = content[currentIndex];
      const element = document.createElement(item.type);
      
      // Set styles based on element type
      if (item.type === 'p') {
        element.style.cssText = 'color: #cccccc; margin-bottom: 0.8rem; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;';
      } else if (item.type === 'h4') {
        element.style.cssText = 'color: #667eea; margin-bottom: 0.5rem; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;';
      } else if (item.type === 'div') {
        element.style.cssText = 'margin-bottom: 1rem;';
      }
      
      element.innerHTML = '<span class="typewriter-cursor">|</span>';
      container.appendChild(element);
      
      // Check if this is a GitHub link and make it clickable
      if (item.value.includes('GitHub:') && item.value.includes('github.com')) {
        this.typeTextWithLink(element, item.value, speed, () => {
          currentIndex++;
          setTimeout(typeNext, 200);
        });
      } else {
        this.typeText(element, item.value, speed, () => {
          currentIndex++;
          setTimeout(typeNext, 200); // Small delay between elements
        });
      }
    };
    
    typeNext();
  }

  private typeText(element: HTMLElement, text: string, speed: number, onComplete?: () => void): void {
    let currentIndex = 0;
    const cursor = element.querySelector('.typewriter-cursor');
    
    const typeChar = () => {
      if (currentIndex >= text.length) {
        // Remove cursor when done
        if (cursor) {
          cursor.remove();
        }
        if (onComplete) {
          onComplete();
        }
        return;
      }
      
      // Insert character before cursor
      if (cursor) {
        cursor.insertAdjacentText('beforebegin', text[currentIndex]);
      }
      
      currentIndex++;
      setTimeout(typeChar, speed);
    };
    
    typeChar();
  }

  private typeTextWithLink(element: HTMLElement, text: string, speed: number, onComplete?: () => void): void {
    let currentIndex = 0;
    const cursor = element.querySelector('.typewriter-cursor');
    
    // Extract the GitHub URL from the text
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0] : '';
    const label = text.replace(url, '').trim();
    
    const typeChar = () => {
      if (currentIndex >= label.length) {
        // Remove cursor when done typing the label
        if (cursor) {
          cursor.remove();
        }
        
        // Add clickable link
        if (url) {
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = url;
          link.style.cssText = 'color: #667eea; text-decoration: none; margin-left: 0.5rem;';
          link.addEventListener('mouseenter', () => {
            link.style.textDecoration = 'underline';
          });
          link.addEventListener('mouseleave', () => {
            link.style.textDecoration = 'none';
          });
          element.appendChild(link);
        }
        
        if (onComplete) {
          onComplete();
        }
        return;
      }
      
      // Insert character before cursor
      if (cursor) {
        cursor.insertAdjacentText('beforebegin', label[currentIndex]);
      }
      
      currentIndex++;
      setTimeout(typeChar, speed);
    };
    
    typeChar();
  }

  private getSectionContentData(sectionId: string): {title: string, content: Array<{type: string, value: string}>} {
    switch (sectionId) {
      case 'about-contact-section':
        return {
          title: 'About Me & Contact',
          content: [
            {type: 'p', value: `Name: ${this.cvData.name}`},
            {type: 'p', value: `Title: ${this.cvData.title}`},
            {type: 'p', value: `Location: ${this.cvData.location}`},
            {type: 'p', value: `Email: ${this.cvData.email}`},
            {type: 'p', value: `GitHub: ${this.cvData.github}`},
            {type: 'p', value: `About: ${this.cvData.about}`}
          ]
        };
        
      case 'experience-education-section':
        const experienceContent = [
          {type: 'h4', value: 'Experience'},
          {type: 'div', value: ''},
          {type: 'p', value: `${this.cvData.experience[0].title}`},
          {type: 'p', value: `${this.cvData.experience[0].company}`},
          {type: 'p', value: `${this.cvData.experience[0].period}`}
        ];
        
        const educationContent = [
          {type: 'div', value: ''},
          {type: 'h4', value: 'Education'}
        ];
        
        // Add all education entries
        this.cvData.education.forEach(edu => {
          educationContent.push({type: 'p', value: `${edu.degree}`});
          educationContent.push({type: 'p', value: `${edu.institution}`});
          educationContent.push({type: 'p', value: `${edu.year}`});
          educationContent.push({type: 'div', value: ''});
        });
        
        return {
          title: 'Experience & Education',
          content: [...experienceContent, ...educationContent]
        };

      case 'skills-section':
        return {
          title: 'Skills',
          content: [
            {type: 'div', value: ''},
            {type: 'h4', value: 'Technical Skills'},
            {type: 'p', value: this.cvData.skills.technical.join(', ')},
            {type: 'div', value: ''},
            {type: 'h4', value: 'Soft Skills'},
            {type: 'p', value: this.cvData.skills.soft.join(', ')}
          ]
        };

      default:
        return {
          title: 'Section not found',
          content: [{type: 'p', value: 'This section could not be loaded.'}]
        };
    }
  }


  private addClickIndicator(section: HTMLElement): void {
    // Add a small "click me" indicator
    const indicator = document.createElement('div');
    indicator.className = 'click-indicator';
    indicator.innerHTML = '👆';
    indicator.style.cssText = `
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 1.2rem;
      opacity: 0.8;
      animation: pulse 2s infinite;
      pointer-events: none;
    `;
    
    section.appendChild(indicator);
    
    // Remove indicator after 3 seconds
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }, 3000);
  }

  private updateGameProgress(foundCount: number): void {
    const countElement = document.getElementById('found-count');
    const progressFill = document.getElementById('progress-fill');
    
    if (countElement) {
      countElement.textContent = foundCount.toString();
    }
    
    if (progressFill) {
      progressFill.style.width = `${(foundCount / 3) * 100}%`;
    }
  }

  private setupProgressBarEasterEgg(): void {
    const progressBar = document.querySelector('.game-progress');
    if (!progressBar) return;

    let tapCount = 0;
    let tapTimeout: NodeJS.Timeout;

    const handleTap = () => {
      tapCount++;
      
      // Reset tap count after 2 seconds of no taps
      clearTimeout(tapTimeout);
      tapTimeout = setTimeout(() => {
        tapCount = 0;
      }, 2000);

      // If 3 taps within 2 seconds, trigger easter egg
      if (tapCount === 3) {
        this.triggerMainMenuEasterEgg();
        tapCount = 0;
      }
    };

    // Add invisible click listener
    progressBar.addEventListener('click', handleTap);
    
    // Store reference for cleanup
    (this as any).progressBarEasterEggHandler = handleTap;
  }

  private triggerMainMenuEasterEgg(): void {
    // Fade out current game
    const gameContainer = document.getElementById('flashlight-game-container');
    if (gameContainer) {
      gameContainer.style.opacity = '0';
      gameContainer.style.transition = 'opacity 1s ease';
    }

    // After fade out, show main menu
    setTimeout(() => {
      this.showMainMenu();
    }, 1000);
  }

  private showMainMenu(): void {
    const app = document.querySelector<HTMLDivElement>('#app');
    if (!app) return;

    app.innerHTML = `
      <div class="menu-screen">
        <div class="menu-content">
          <div class="menu-header">
            <h1 class="menu-title">Welcome to Faustas' CV</h1>
            <p class="menu-subtitle">Choose your adventure</p>
          </div>
          
          <div class="menu-grid">
            <div class="menu-card" data-action="flashlight-game">
              <span class="card-icon">🔦</span>
              <h3 class="card-title">Flashlight Adventure</h3>
              <p class="card-description">Find CV sections with your flashlight</p>
            </div>
            
            <div class="menu-card" data-action="download-cv">
              <span class="card-icon">📄</span>
              <h3 class="card-title">Download CV</h3>
              <p class="card-description">Get my CV directly</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Animate menu elements almost simultaneously
    setTimeout(() => {
      const menuHeader = document.querySelector('.menu-header');
      if (menuHeader) {
        menuHeader.classList.add('visible');
      }
    }, 5);

    setTimeout(() => {
      const menuCards = document.querySelectorAll('.menu-card');
      menuCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 20);
      });
    }, 10);

    // Setup menu card event listeners
    this.setupMenuCardListeners();
  }

  private setupMenuCardListeners(): void {
    const menuCards = document.querySelectorAll('.menu-card');
    
    menuCards.forEach(card => {
      const action = card.getAttribute('data-action');
      
      card.addEventListener('click', () => {
        if (action === 'flashlight-game') {
          this.showFlashlightSearch();
        } else if (action === 'download-cv') {
          this.downloadCV();
        }
      });
    });
  }

  private updateMobileInstructions(): void {
    const isMobile = window.innerWidth <= 768;
    const instructionText = document.getElementById('game-instruction-text');
    
    if (instructionText && isMobile) {
      instructionText.textContent = 'Touch and drag to move your flashlight! Find all 3 CV sections.';
    }
  }

  private setupResizeHandler(container: HTMLElement): void {
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      // Debounce resize events
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Only reposition if icons exist and are not all revealed
        const hiddenSections = container.querySelectorAll('.hidden-section');
        if (hiddenSections.length > 0) {
          // Recreate game content with new positions
          this.createResponsiveGameContent(container);
          
          // Update flashlight positioning
          if (this.flashlight) {
            const isMobile = window.innerWidth <= 768;
            this.flashlight.setFixedPoint(
              window.innerWidth / 2,
              isMobile ? window.innerHeight * 0.8 : window.innerHeight
            );
          }
        }
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Store reference for cleanup
    (this as any).resizeHandler = handleResize;
  }

  private async completeGame(): Promise<void> {
    // Track game completion with detailed analytics
    this.trackDetailedEvent('flashlight_game_completed', 'user_interaction', {
      label: 'game_completed',
      interaction: 'achievement',
      timeSpent: Date.now() - this.analyticsData.startTime,
      deviceInfo: true
    });
    
    // Show completion message
    const instructions = document.querySelector('.game-instructions');
    if (instructions) {
      const isMobile = window.innerWidth <= 768;
      const message = isMobile 
        ? 'Congratulations! You found all CV sections! Now you can tap on the icons to see more information.'
        : 'Congratulations! You found all CV sections! Now you can click on the icons to see more information.';
      instructions.innerHTML = `<p>${message}</p>`;
    }
  }



  private downloadCV(): void {
    // Track CV download with detailed analytics
    this.trackDetailedEvent('cv_downloaded', 'user_interaction', {
      label: 'cv_pdf_download',
      interaction: 'download',
      timeSpent: Date.now() - this.analyticsData.startTime,
      deviceInfo: true
    });
    
    // Download the actual PDF CV file
    const link = document.createElement('a');
    link.href = '/FaustasCV.pdf';
    link.download = `${this.cvData.name}_CV.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private goBackToIntro(): void {
    // Restart the intro sequence
    this.showIntroSequence();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private initCookieConsent(): void {
    const banner = document.getElementById('cookie-consent-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    
    if (!banner || !acceptBtn || !declineBtn) return;
    
    // Check if consent already given
    const consent = localStorage.getItem('analytics-consent');
    if (consent === 'accepted') {
      this.grantAnalyticsConsent();
      return;
    } else if (consent === 'declined') {
      this.denyAnalyticsConsent();
      return;
    }
    
    // Show banner if no consent given
    banner.style.display = 'block';
    
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('analytics-consent', 'accepted');
      banner.style.display = 'none';
      this.grantAnalyticsConsent();
      this.trackEvent('user_interaction', 'cookie_consent', 'accepted');
    });
    
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('analytics-consent', 'declined');
      banner.style.display = 'none';
      this.denyAnalyticsConsent();
      this.trackEvent('user_interaction', 'cookie_consent', 'declined');
    });
  }

  private hasAnalyticsConsent(): boolean {
    return localStorage.getItem('analytics-consent') === 'accepted';
  }

  private grantAnalyticsConsent(): void {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }

  private denyAnalyticsConsent(): void {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });

    }
  }



  public cleanupEventListeners(): void {
    // Clean up hide and seek game listeners
    const handlers = (this as any).hideAndSeekHandlers;
    if (handlers) {
      document.removeEventListener('mousemove', handlers.mousemove);
      document.removeEventListener('touchmove', handlers.touchmove);
      document.removeEventListener('touchstart', handlers.touchstart);
    }

    // Clean up flashlight listeners
    if (this.flashlight) {
      this.flashlight.destroy();
      this.flashlight = null;
    }

    // Clean up progress bar easter egg
    const progressHandler = (this as any).progressBarEasterEggHandler;
    if (progressHandler) {
      const progressBar = document.querySelector('.game-progress');
      if (progressBar) {
        progressBar.removeEventListener('click', progressHandler);
      }
    }

    // Clean up resize handler
    const resizeHandler = (this as any).resizeHandler;
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('orientationchange', resizeHandler);
    }

    // Clean up zoom handler
    const zoomHandler = (this as any).zoomHandler;
    if (zoomHandler) {
      window.removeEventListener('resize', zoomHandler);
      window.removeEventListener('orientationchange', zoomHandler);
    }
  }

  private addJourneyStep(action: string, details?: any): void {
    const step = {
      action,
      timestamp: Date.now(),
      details
    };
    this.analyticsData.userJourney.steps.push(step);
    this.analyticsData.userJourney.totalTime = Date.now() - this.analyticsData.startTime;
  }


  private trackEvent(eventName: string, eventCategory: string, eventLabel?: string, value?: number, customParams?: Record<string, any>): void {
    // Only track if consent is given
    if (!this.hasAnalyticsConsent()) return;
    
    // Add journey step for user interactions
    if (eventCategory === 'user_interaction') {
      this.addJourneyStep(eventName, { 
        label: eventLabel, 
        value, 
        customParams,
        sessionTime: Date.now() - this.analyticsData.startTime
      });
    }
    
    if (typeof window.gtag === 'function') {
      const eventParams: any = {
        event_category: eventCategory,
        event_label: eventLabel,
        value: value,
        // Add custom dimensions
        custom_parameter_1: this.analyticsData.deviceInfo.isMobile ? 'mobile' : this.analyticsData.deviceInfo.isTablet ? 'tablet' : 'desktop',
        custom_parameter_2: this.analyticsData.sessionId,
        custom_parameter_3: this.analyticsData.deviceInfo.platform,
        custom_parameter_4: this.analyticsData.deviceInfo.language,
        custom_parameter_5: this.analyticsData.deviceInfo.screenResolution,
        custom_parameter_6: this.analyticsData.userJourney.steps.length.toString(),
        custom_parameter_7: this.analyticsData.userJourney.totalTime.toString(),
        // Add any custom parameters
        ...customParams
      };

      window.gtag('event', eventName, eventParams);
    }
  }

  // Enhanced tracking methods
  private trackDetailedEvent(eventName: string, eventCategory: string, details: {
    label?: string;
    value?: number;
    section?: string;
    interaction?: string;
    timeSpent?: number;
    deviceInfo?: boolean;
  }): void {
    const customParams: Record<string, any> = {};
    
    if (details.section) customParams.section = details.section;
    if (details.interaction) customParams.interaction_type = details.interaction;
    if (details.timeSpent) customParams.time_spent = details.timeSpent;
    if (details.deviceInfo) {
      customParams.viewport_size = this.analyticsData.deviceInfo.viewportSize;
      customParams.user_agent = this.analyticsData.deviceInfo.userAgent;
    }
    
    this.trackEvent(eventName, eventCategory, details.label, details.value, customParams);
  }
}

// Initialize the CV when the DOM is loaded
let cvInstance: ProfessionalCV | null = null;

document.addEventListener('DOMContentLoaded', () => {
  cvInstance = new ProfessionalCV();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (cvInstance) {
    cvInstance.cleanupEventListeners();
  }
});
