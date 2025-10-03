import './style.css'
import { Flashlight } from './flashlight'

// Google Analytics types
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
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
  projects: Array<{
    name: string;
    description: string;
    tech: string[];
    link?: string;
  }>;
}



class ProfessionalCV {
  private cvData: CVData;
  private flashlight: Flashlight | null = null;

  constructor() {
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
          'Python', 'Unity (Basic)',
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
          institution: 'Vilnius Gedimina Technical University',
          year: '2021 - 2025'
        },
        {
          degree: 'Master of Artificial Intelligence Solutions Management',
          institution: 'Vilnius Gedimina Technical University',
          year: '2025 - 2027'
        }
       
      ],
      projects: [
        {
          name: 'E-Commerce Platform',
          description: 'Full-stack e-commerce solution with real-time inventory management',
          tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe API'],
          link: 'github.com/faustas/ecommerce'
        },
        {
          name: 'AI Chat Assistant',
          description: 'Intelligent chatbot with natural language processing capabilities',
          tech: ['Python', 'TensorFlow', 'FastAPI', 'WebSocket'],
          link: 'github.com/faustas/ai-chat'
        }
      ]
    };
    
    this.init();
  }

  private async init(): Promise<void> {
    // Check if Analytics is working

    // Track page view
    this.trackEvent('page_view', 'cv_loaded');
    
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
    await this.delay(1000);
    
    // Show first text
    const firstText = document.querySelector('.first-text');
    if (firstText) {
      firstText.classList.add('visible');
      await this.delay(2500);
    }

    // Show second text
    const secondText = document.querySelector('.second-text');
    if (secondText) {
      secondText.classList.add('visible');
      await this.delay(2000);
    }

    // Show choice buttons
    const choiceButtons = document.querySelector('.choice-buttons');
    if (choiceButtons) {
      choiceButtons.classList.add('visible');
      await this.delay(1000);
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

    // Track user choice
    this.trackEvent('user_interaction', 'intro_choice', choice);

    if (choice === 'yes') {
      // Fade out all intro elements
      const introElements = document.querySelectorAll('.intro-text, .choice-buttons');
      introElements.forEach(element => {
        element.classList.add('fade-out');
      });

      await this.delay(1000);

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
        await this.delay(2000);
      }

      // Fade out the search text
      if (searchText) {
        searchText.classList.add('fade-out');
        await this.delay(1000);
      }

      // Show flashlight search component
      this.trackEvent('user_interaction', 'flashlight_game_started');
      await this.showFlashlightSearch();
    } else {
      // For "No" choice - fade out everything and show download button
      const introElements = document.querySelectorAll('.intro-text, .choice-buttons');
      introElements.forEach(element => {
        element.classList.add('fade-out');
      });

      await this.delay(1000);

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
        await this.delay(1000);
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

  private async showFlashlightSearch(): Promise<void> {
    const app = document.querySelector<HTMLDivElement>('#app');
    if (!app) return;

    // Create flashlight container
    const flashlightContainer = document.createElement('div');
    flashlightContainer.id = 'flashlight-game-container';
    
    // Create game content
    flashlightContainer.innerHTML = `
      <!-- Hidden CV Icons -->
      <div class="cv-icon hidden-section" id="about-contact-section" style="top: 10%; left: 5%;">
        <div class="section-icon">👋</div>
      </div>
      
      <div class="cv-icon hidden-section" id="experience-education-section" style="top: 95%; left: 85%;">
        <div class="section-icon">💼</div>
      </div>
      
      <div class="cv-icon hidden-section" id="skills-section" style="top: 55%; left: 49%;">
        <div class="section-icon">⚡</div>
      </div>
      
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
  }

  private setupHideAndSeekGame(): void {
    const foundSections = new Set<string>();
    let gameCompleted = false;

    // Check for flashlight detection of hidden sections
    const checkFlashlightDetection = () => {
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
    
    // Store reference for cleanup
    (this as any).hideAndSeekHandler = checkFlashlightDetection;
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
    
    // Handle both click and touch events for mobile compatibility
    const handleInteraction = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Track section view
      this.trackEvent('user_interaction', 'cv_section_opened', sectionId);
      
      // Create section content next to the icon
      this.createSectionContent(section, sectionId);
    };
    
    section.addEventListener('click', handleInteraction);
    section.addEventListener('touchstart', handleInteraction, { passive: false });
    
    // Add hover effect (only for non-touch devices)
    section.addEventListener('mouseenter', () => {
      if (!('ontouchstart' in window)) {
        section.style.transform = 'scale(1.1)';
        section.style.transition = 'transform 0.3s ease';
      }
    });
    
    section.addEventListener('mouseleave', () => {
      if (!('ontouchstart' in window)) {
        section.style.transform = 'scale(1)';
      }
    });
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
      // Mobile: Center content on screen, above icon
      contentX = (viewportWidth - contentWidth) / 2;
      contentY = Math.max(20, iconRect.top - contentHeight - 20);
      
      // If content would go off top, position it below icon
      if (contentY < 20) {
        contentY = iconRect.bottom + 20;
      }
      
      // Ensure content doesn't go off bottom
      if (contentY + contentHeight > viewportHeight - 20) {
        contentY = viewportHeight - contentHeight - 20;
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
    
    // Handle both click and touch events for close button
    const handleClose = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      contentElement.style.opacity = '0';
      contentElement.style.transform = isMobile ? 'translateY(-20px)' : 'translateX(-20px)';
      setTimeout(() => {
        if (contentElement.parentNode) {
          contentElement.parentNode.removeChild(contentElement);
        }
      }, 500);
    };
    
    closeBtn.addEventListener('click', handleClose);
    closeBtn.addEventListener('touchstart', handleClose, { passive: false });
    
    // Add hover effect (only for non-touch devices)
    closeBtn.addEventListener('mouseenter', () => {
      if (!('ontouchstart' in window)) {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        closeBtn.style.transform = 'scale(1.1)';
      }
    });
    
    closeBtn.addEventListener('mouseleave', () => {
      if (!('ontouchstart' in window)) {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        closeBtn.style.transform = 'scale(1)';
      }
    });
    
    // Add touch feedback for mobile
    if ('ontouchstart' in window) {
      closeBtn.addEventListener('touchstart', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        closeBtn.style.transform = 'scale(0.95)';
      });
      
      closeBtn.addEventListener('touchend', () => {
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
    this.typeText(titleElement, contentData.title, 50, () => {
      // After title is done, create and type the content
      const contentContainer = document.createElement('div');
      container.appendChild(contentContainer);
      
      this.typeSectionContent(contentContainer, contentData.content, 30);
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

    // Animate menu elements
    setTimeout(() => {
      const menuHeader = document.querySelector('.menu-header');
      if (menuHeader) {
        menuHeader.classList.add('visible');
      }
    }, 100);

    setTimeout(() => {
      const menuCards = document.querySelectorAll('.menu-card');
      menuCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 200);
      });
    }, 300);

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

  private async completeGame(): Promise<void> {
    // Track game completion
    this.trackEvent('user_interaction', 'flashlight_game_completed');
    
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
    // Track CV download
    this.trackEvent('user_interaction', 'cv_downloaded');
    
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


  private trackEvent(eventName: string, eventCategory: string, eventLabel?: string, value?: number): void {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        event_category: eventCategory,
        event_label: eventLabel,
        value: value
      });
    } 
  }
}

// Initialize the CV when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProfessionalCV();
});
