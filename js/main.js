// Global configuration object
let config = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Load configuration from YAML file
  await loadConfiguration();
  
  // Apply configuration to the website
  applyConfiguration();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize smooth scrolling for anchor links
  initSmoothScrolling();
  
  // Initialize GSAP animations
  initAnimations();
  
  // Initialize custom audio/video players
  initMediaPlayers();
  
  // Initialize cursor follower
  initCursorFollower();
});

/**
 * Load configuration from YAML file
 * Supports loading different configurations based on URL parameter
 * Example: index.html?config=alt-config
 */
async function loadConfiguration() {
  try {
    // Check if a specific configuration is requested via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const configParam = urlParams.get('config');
    
    // Determine which configuration file to load
    const configFile = configParam ? `./${configParam}.yaml` : './config.yaml';
    
    const response = await fetch(configFile);
    
    // If the requested config file doesn't exist, fall back to the default
    if (!response.ok && configParam) {
      console.warn(`Configuration file ${configFile} not found, falling back to default config.yaml`);
      const defaultResponse = await fetch('./config.yaml');
      const yamlText = await defaultResponse.text();
      config = jsyaml.load(yamlText);
    } else {
      const yamlText = await response.text();
      config = jsyaml.load(yamlText);
    }
    
    console.log(`Configuration loaded successfully from ${configFile}:`, config);
  } catch (error) {
    console.error('Error loading configuration:', error);
  }
}

/**
 * Apply configuration to the website
 */
function applyConfiguration() {
  if (!config) {
    console.error('Configuration not loaded');
    return;
  }

  // Update document title and meta description
  document.title = config.site.title;
  document.querySelector('meta[name="description"]').setAttribute('content', config.site.description);
  
  // Update band name in header and footer
  document.querySelector('header .text-golden-blaze').textContent = config.band.name;
  document.querySelector('footer p').textContent = `© ${config.site.copyright}`;
  
  // Update hero section
  const heroSection = document.querySelector('#hero');
  if (heroSection) {
    // Update band name and tagline
    heroSection.querySelector('h1').textContent = config.band.name;
    heroSection.querySelector('h1').setAttribute('data-text', config.band.name);
    heroSection.querySelector('.typewriter-text').textContent = config.band.tagline;
    
    // Update video background
    const videoSource = heroSection.querySelector('video source');
    if (videoSource) {
      videoSource.setAttribute('src', config.band.hero.background_video);
    }
    
    // Update image fallback
    const imgFallback = heroSection.querySelector('video img');
    if (imgFallback) {
      imgFallback.setAttribute('src', config.band.hero.background_fallback);
    }
    
    // Update CTA buttons
    const ctaButtons = heroSection.querySelectorAll('.btn');
    config.band.hero.cta_buttons.forEach((button, index) => {
      if (ctaButtons[index]) {
        ctaButtons[index].textContent = button.text;
        ctaButtons[index].setAttribute('href', button.url);
      }
    });
  }
  
  // Update music section
  const musicSection = document.querySelector('#music');
  if (musicSection) {
    // Update section title
    const titleParts = musicSection.querySelector('h2').innerHTML.split('<span');
    musicSection.querySelector('h2').innerHTML = `${config.music.section_title} <span${titleParts[1]}`;
    
    // Update releases
    const releaseCards = musicSection.querySelectorAll('.teaser-card');
    config.music.releases.forEach((release, index) => {
      if (releaseCards[index]) {
        const card = releaseCards[index];
        
        // Update title and description
        card.querySelector('h3').textContent = release.title;
        card.querySelector('p').textContent = release.description;
        
        // Update media source
        if (release.type === 'audio') {
          const audio = card.querySelector('audio source');
          if (audio) {
            audio.setAttribute('src', release.file);
          }
          
          // Update links
          const links = card.querySelectorAll('a');
          release.links.forEach((link, linkIndex) => {
            if (links[linkIndex]) {
              links[linkIndex].textContent = link.platform;
              links[linkIndex].setAttribute('href', link.url);
            }
          });
        } else if (release.type === 'video') {
          const video = card.querySelector('video source');
          if (video) {
            video.setAttribute('src', release.file);
          }
          
          const thumbnail = card.querySelector('video');
          if (thumbnail) {
            thumbnail.setAttribute('poster', release.thumbnail);
          }
          
          // Update link
          const link = card.querySelector('a');
          if (link && release.links[0]) {
            link.textContent = release.links[0].text || `Watch on ${release.links[0].platform}`;
            link.setAttribute('href', release.links[0].url);
          }
        }
      }
    });
  }
  
  // Update about section
  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    // Update section title
    const titleParts = aboutSection.querySelector('h2').innerHTML.split('<span');
    aboutSection.querySelector('h2').innerHTML = `About <span${titleParts[1]}`;
    
    // Update band image
    const bandImage = aboutSection.querySelector('img');
    if (bandImage) {
      bandImage.setAttribute('src', config.band.about.image);
      bandImage.setAttribute('alt', `${config.band.name} band`);
    }
    
    // Update heading and bio text
    const bioSection = aboutSection.querySelector('.reveal-text');
    if (bioSection) {
      bioSection.querySelector('h3').textContent = config.band.about.heading;
      
      const paragraphs = bioSection.querySelectorAll('p:not(.italic)');
      config.band.about.bio.forEach((text, index) => {
        if (paragraphs[index]) {
          paragraphs[index].textContent = text;
        }
      });
      
      // Update quote
      const quoteText = bioSection.querySelector('p.italic');
      if (quoteText) {
        quoteText.textContent = config.band.about.quote.text;
      }
      
      const quoteAudio = bioSection.querySelector('audio source');
      if (quoteAudio) {
        quoteAudio.setAttribute('src', config.band.about.quote.audio);
      }
    }
  }
  
  // Update contact section
  const contactSection = document.querySelector('#contact');
  if (contactSection) {
    // Update email
    const emailLink = contactSection.querySelector('a[href^="mailto:"]');
    if (emailLink) {
      emailLink.textContent = config.band.email;
      emailLink.setAttribute('href', `mailto:${config.band.email}`);
    }
    
    // Update social links
    const socialLinks = contactSection.querySelectorAll('.social-icon');
    config.social.forEach((social, index) => {
      if (socialLinks[index]) {
        socialLinks[index].setAttribute('href', social.url);
      }
    });
  }
  
  // Update navigation
  const navLinks = document.querySelectorAll('header .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-menu .nav-link');
  
  config.navigation.forEach((item, index) => {
    if (navLinks[index]) {
      navLinks[index].textContent = item.text;
      navLinks[index].setAttribute('href', item.url);
    }
    
    if (mobileNavLinks[index]) {
      mobileNavLinks[index].textContent = item.text;
      mobileNavLinks[index].setAttribute('href', item.url);
    }
  });
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  const closeButton = document.querySelector('.close-btn');
  
  if (navToggle && mobileMenu) {
    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
      
      // Animate bars to X
      const bars = navToggle.querySelectorAll('.bar');
      bars.forEach(bar => bar.classList.toggle('active'));
    });
    
    // Close mobile menu when close button is clicked
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        
        // Reset hamburger icon
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.remove('active'));
      });
    }
    
    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        
        // Reset hamburger icon
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.remove('active'));
      });
    });
  }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Offset for fixed header
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without page reload
        history.pushState(null, null, targetId);
      }
    });
  });
  
  // Highlight active nav link based on scroll position
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('text-golden-blaze');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-golden-blaze');
          }
        });
      }
    });
  });
}

/**
 * Initialize GSAP animations
 * Requires GSAP library to be loaded
 */
function initAnimations() {
  // Check if GSAP is loaded
  if (typeof gsap !== 'undefined') {
    // Hero text animations
    gsap.from('.hero-text h1', { 
      opacity: 0, 
      y: -50, 
      duration: 1, 
      ease: 'power3.out' 
    });
    
    gsap.from('.hero-text p', { 
      opacity: 0, 
      y: 30, 
      duration: 1, 
      delay: 0.5,
      ease: 'power3.out' 
    });
    
    gsap.from('.hero-text .btn', { 
      opacity: 0, 
      y: 30, 
      duration: 1, 
      delay: 0.8,
      stagger: 0.2,
      ease: 'power3.out' 
    });
    
    // Typewriter effect for subtitle
    const typewriterText = document.querySelector('.typewriter-text');
    if (typewriterText && gsap.TextPlugin) {
      const text = typewriterText.textContent;
      typewriterText.textContent = '';
      
      gsap.to(typewriterText, {
        duration: 2,
        text: text,
        delay: 1,
        ease: "none"
      });
    }
    
    // Section title animations
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, { 
          opacity: 0, 
          y: 50, 
          duration: 1,
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      });
      
      // Teaser cards animation on scroll
      gsap.utils.toArray('.teaser-card').forEach((card, i) => {
        gsap.from(card, { 
          opacity: 0, 
          y: 50, 
          duration: 1,
          delay: i * 0.2,
          scrollTrigger: { 
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none'
          } 
        });
      });
      
      // Reveal text animation
      gsap.utils.toArray('.reveal-text > *').forEach((text, i) => {
        gsap.from(text, { 
          opacity: 0, 
          x: -50, 
          duration: 0.8,
          delay: i * 0.2,
          scrollTrigger: { 
            trigger: text,
            start: 'top 80%',
            toggleActions: 'play none none none'
          } 
        });
      });
    }
  }
}

/**
 * Initialize custom audio/video players
 */
function initMediaPlayers() {
  // Custom controls for audio players
  document.querySelectorAll('.custom-audio-player').forEach(player => {
    const audio = player.querySelector('audio');
    const playBtn = player.querySelector('.play-btn');
    const progressBar = player.querySelector('.progress-bar');
    
    if (audio && playBtn) {
      playBtn.addEventListener('click', () => {
        if (audio.paused) {
          // Pause all other audio elements first
          document.querySelectorAll('audio').forEach(a => {
            if (a !== audio && !a.paused) {
              a.pause();
              const otherBtn = a.parentElement.querySelector('.play-btn');
              if (otherBtn) otherBtn.classList.remove('playing');
            }
          });
          
          audio.play();
          playBtn.classList.add('playing');
          playBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          `;
        } else {
          audio.pause();
          playBtn.classList.remove('playing');
          playBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          `;
        }
      });
    }
    
    if (audio && progressBar) {
      audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
      });
      
      audio.addEventListener('ended', () => {
        playBtn.classList.remove('playing');
        playBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
      });
    }
  });
  
  // Custom controls for video players
  document.querySelectorAll('.custom-video-player').forEach(player => {
    const video = player.querySelector('video');
    const playBtn = player.querySelector('.play-btn');
    
    if (video && playBtn) {
      playBtn.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          playBtn.classList.add('playing');
          playBtn.style.opacity = '0';
        } else {
          video.pause();
          playBtn.classList.remove('playing');
          playBtn.style.opacity = '1';
        }
      });
      
      video.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          playBtn.classList.add('playing');
          playBtn.style.opacity = '0';
        } else {
          video.pause();
          playBtn.classList.remove('playing');
          playBtn.style.opacity = '1';
        }
      });
      
      video.addEventListener('ended', () => {
        playBtn.classList.remove('playing');
        playBtn.style.opacity = '1';
      });
    }
  });
}

/**
 * Initialize cursor follower
 */
function initCursorFollower() {
  const cursor = document.querySelector('.cursor-follower');
  
  if (cursor) {
    // Only enable on desktop
    if (window.innerWidth > 768) {
      cursor.style.opacity = '1';
      
      document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.2,
          ease: 'power2.out'
        });
      });
      
      // Scale effect on links
      const links = document.querySelectorAll('a, button, .play-btn');
      links.forEach(link => {
        link.addEventListener('mouseenter', () => {
          gsap.to(cursor, {
            scale: 1.5,
            duration: 0.3
          });
        });
        
        link.addEventListener('mouseleave', () => {
          gsap.to(cursor, {
            scale: 1,
            duration: 0.3
          });
        });
      });
    }
  }
}