// Global configuration object
let config = null;

// Global variables for 3D animation
let scene, camera, renderer, particles;
let animationId;

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
  
  // Initialize 3D animation in hero section
  init3DAnimation();
  
  // Handle window resize for 3D animation
  window.addEventListener('resize', onWindowResize);
});

// Clean up animation when leaving the page
window.addEventListener('beforeunload', () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
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
    
    // Update CTA buttons
    const ctaButtons = heroSection.querySelectorAll('.hero-text .btn');
    config.band.hero.cta_buttons.forEach((button, index) => {
      if (ctaButtons[index]) {
        ctaButtons[index].textContent = button.text;
        ctaButtons[index].setAttribute('href', button.url);
      }
    });
    
    // Update latest release teaser
    updateLatestReleaseTeaser();
    
    // Punch text is now static in HTML
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
    
    // Update social links - use channels.social if available, otherwise fall back to social
    const socialLinks = contactSection.querySelectorAll('.social-icon');
    
    if (config.channels && config.channels.social) {
      // Use the new channels structure
      config.channels.social.forEach((social, index) => {
        if (socialLinks[index] && social.enabled) {
          socialLinks[index].setAttribute('href', social.url);
        }
      });
    } else if (config.social) {
      // Fall back to the old social structure
      config.social.forEach((social, index) => {
        if (socialLinks[index]) {
          socialLinks[index].setAttribute('href', social.url);
        }
      });
    }
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
  // Render channels section if it exists
  if (config.channels) {
    renderChannelsSection();
  }
}

/**
 * Render the channels section from the configuration
 */
function renderChannelsSection() {
  const channelsSection = document.querySelector('#channels');
  if (!channelsSection || !config.channels) return;
  
  // Update section title
  const titleElement = channelsSection.querySelector('h2');
  if (titleElement) {
    const titleParts = titleElement.innerHTML.split('<span');
    titleElement.innerHTML = `Our <span${titleParts[1]}`;
  }
  
  // Set up tab functionality
  const tabs = channelsSection.querySelectorAll('#channel-tabs button');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all channel categories
      const categories = channelsSection.querySelectorAll('.channel-category');
      categories.forEach(cat => cat.classList.add('hidden'));
      
      // Show the selected category
      const category = tab.getAttribute('data-category');
      const categoryElement = document.querySelector(`#${category}-channels`);
      if (categoryElement) {
        categoryElement.classList.remove('hidden');
        categoryElement.classList.add('active');
      }
    });
  });
  
  // Render each channel category
  Object.keys(config.channels).forEach(category => {
    const categoryContainer = document.querySelector(`#${category}-channels .grid`);
    if (!categoryContainer) return;
    
    // Clear existing content
    categoryContainer.innerHTML = '';
    
    // Add each channel in this category
    config.channels[category].forEach(channel => {
      if (channel.enabled) {
        const channelCard = document.createElement('div');
        channelCard.className = 'bg-navy/50 p-6 rounded-lg backdrop-blur-sm transform-gpu hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_0_15px_rgba(255,193,7,0.3)]';
        
        // Create channel content
        let channelContent = `
          <h3 class="text-xl font-heading mb-3">${channel.platform}</h3>
          <a href="${channel.url}" target="_blank" rel="noopener noreferrer" class="btn block text-center mb-4">
            Visit ${channel.platform}
          </a>
        `;
        
        // Add content preview if available
        if (channel.content) {
          channelContent += `
            <div class="mt-4 border-t border-golden-blaze/30 pt-4">
              <h4 class="text-lg font-heading mb-2">Latest Content</h4>
              <p class="text-white-spark text-sm mb-3">${channel.content.post || ''}</p>
              ${channel.content.link ? `<a href="${channel.content.link}" target="_blank" rel="noopener noreferrer" class="text-golden-blaze text-sm hover:underline">View Content</a>` : ''}
            </div>
          `;
        }
        
        // Add sub-features if available
        if (channel.sub_features && channel.sub_features.length > 0) {
          channelContent += `<div class="mt-4 border-t border-golden-blaze/30 pt-4">
            <h4 class="text-lg font-heading mb-2">Sub-Features</h4>
            <ul class="space-y-2">`;
          
          channel.sub_features.forEach(subFeature => {
            if (subFeature.enabled) {
              channelContent += `
                <li>
                  <a href="${subFeature.url}" target="_blank" rel="noopener noreferrer" class="text-golden-blaze hover:underline">
                    ${subFeature.name}
                  </a>
                </li>
              `;
            }
          });
          
          channelContent += `</ul></div>`;
        }
        
        channelCard.innerHTML = channelContent;
        categoryContainer.appendChild(channelCard);
      }
    });
    
    // If no channels in this category, show a message
    if (categoryContainer.children.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'col-span-full text-center py-8';
      emptyMessage.innerHTML = `<p class="text-white-spark">No ${category} channels available.</p>`;
      categoryContainer.appendChild(emptyMessage);
    }
  });
}

/**
 * Update the latest release teaser in the hero section
 */
function updateLatestReleaseTeaser() {
  // Find the latest release (first item in the releases array)
  if (!config.music || !config.music.releases || config.music.releases.length === 0) return;
  
  const latestRelease = config.music.releases[0];
  
  // Update the teaser content
  const titleElement = document.getElementById('latest-release-title');
  const descriptionElement = document.getElementById('latest-release-description');
  const audioSourceElement = document.getElementById('latest-release-audio-source');
  const imageElement = document.getElementById('latest-release-image');
  const spotifyLink = document.getElementById('latest-release-spotify');
  const appleLink = document.getElementById('latest-release-apple');
  
  if (titleElement) titleElement.textContent = latestRelease.title;
  if (descriptionElement) descriptionElement.textContent = latestRelease.description;
  
  // Update audio source
  if (audioSourceElement && latestRelease.file) {
    audioSourceElement.setAttribute('src', latestRelease.file);
  }
  
  // Update image if it's a video type with thumbnail
  if (imageElement) {
    if (latestRelease.type === 'video' && latestRelease.thumbnail) {
      imageElement.setAttribute('src', latestRelease.thumbnail);
    } else if (latestRelease.type === 'audio') {
      // For audio, we could use a default image or generate one
      // Here we'll just keep the default from the HTML
    }
  }
  
  // Update links
  if (latestRelease.links && latestRelease.links.length > 0) {
    latestRelease.links.forEach(link => {
      if (link.platform === 'Spotify' && spotifyLink) {
        spotifyLink.setAttribute('href', link.url);
      } else if (link.platform === 'Apple Music' && appleLink) {
        appleLink.setAttribute('href', link.url);
      }
    });
  }
  
  // Reload the audio element to apply the new source
  const audioElement = document.getElementById('latest-release-audio');
  if (audioElement) {
    audioElement.load();
  }
}

/**
 * The punch text feature is now implemented directly in HTML with static content
 * and simple CSS hover effects for better reliability.
 */

/**
 * Initialize 3D animation in the hero section
 */
function init3DAnimation() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  
  // Initialize Three.js scene
  scene = new THREE.Scene();
  
  // Set up camera
  const { width, height } = canvas.getBoundingClientRect();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 30;
  
  // Set up renderer
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // Create particle geometry
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 1500;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  const colorOptions = [
    new THREE.Color(0xFFC107), // golden-blaze
    new THREE.Color(0x26A69A), // teal-pulse
    new THREE.Color(0xFFFFFF)  // white
  ];
  
  for (let i = 0; i < particleCount; i++) {
    // Position particles in a sphere
    const radius = 20 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
    positions[i * 3 + 2] = radius * Math.cos(phi);                   // z
    
    // Assign random colors from our options
    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Create particle material
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  // Create particle system
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
  
  // Start animation loop
  animate();
}

/**
 * Animation loop for 3D particles
 */
function animate() {
  animationId = requestAnimationFrame(animate);
  
  // Rotate the particle system
  if (particles) {
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.001;
    
    // Make particles react to mouse movement
    const mouseX = (window.mouseX || 0) - window.innerWidth / 2;
    const mouseY = (window.mouseY || 0) - window.innerHeight / 2;
    
    particles.rotation.x += (mouseY * 0.00001);
    particles.rotation.y += (mouseX * 0.00001);
  }
  
  // Render the scene
  renderer.render(scene, camera);
}

/**
 * Handle window resize for 3D animation
 */
function onWindowResize() {
  if (!camera || !renderer || !canvas) return;
  
  const canvas = document.getElementById('hero-canvas');
  const { width, height } = canvas.getBoundingClientRect();
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
}

// Track mouse position for 3D animation
document.addEventListener('mousemove', (event) => {
  window.mouseX = event.clientX;
  window.mouseY = event.clientY;
});

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
 * Initialize moon cursor follower - bounded to hero section only and hidden over latest release
 */
function initCursorFollower() {
  const cursor = document.querySelector('.cursor-follower');
  const heroSection = document.querySelector('#hero');
  const latestReleaseTeaser = document.querySelector('.latest-release-teaser');
  
  if (cursor && heroSection && latestReleaseTeaser) {
    // Only enable on desktop
    if (window.innerWidth > 768) {
      cursor.style.opacity = '0'; // Start hidden
      
      // Add a slight delay to make the moon movement more smooth and celestial
      let mouseX = 0;
      let mouseY = 0;
      let cursorX = 0;
      let cursorY = 0;
      let isInHeroSection = false;
      let isOverLatestRelease = false;
      
      // Check if mouse is in hero section
      function checkIfInHeroSection(x, y) {
        const heroRect = heroSection.getBoundingClientRect();
        return (
          x >= heroRect.left &&
          x <= heroRect.right &&
          y >= heroRect.top &&
          y <= heroRect.bottom
        );
      }
      
      // Check if mouse is over latest release teaser
      function checkIfOverLatestRelease(x, y) {
        const releaseRect = latestReleaseTeaser.getBoundingClientRect();
        return (
          x >= releaseRect.left &&
          x <= releaseRect.right &&
          y >= releaseRect.top &&
          y <= releaseRect.bottom
        );
      }
      
      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Check positions
        isInHeroSection = checkIfInHeroSection(mouseX, mouseY);
        isOverLatestRelease = checkIfOverLatestRelease(mouseX, mouseY);
        
        // Show/hide cursor based on position
        // Hide when over latest release section for easier clicking
        if (isInHeroSection && !isOverLatestRelease) {
          cursor.style.opacity = '1';
        } else {
          cursor.style.opacity = '0';
        }
      });
      
      // Use requestAnimationFrame for smoother movement
      function animateMoon() {
        if (isInHeroSection && !isOverLatestRelease) {
          // Add slight lag for more natural moon-like movement
          const lagFactor = 0.1;
          cursorX += (mouseX - cursorX) * lagFactor;
          cursorY += (mouseY - cursorY) * lagFactor;
          
          gsap.set(cursor, {
            x: cursorX,
            y: cursorY,
          });
          
          // Add a subtle floating effect
          gsap.to(cursor, {
            rotation: Math.sin(Date.now() / 3000) * 5, // Gentle rotation
            duration: 0.5,
            overwrite: true
          });
        }
        
        requestAnimationFrame(animateMoon);
      }
      
      animateMoon();
      
      // Special effects on links within hero section (excluding latest release)
      const heroTextSection = heroSection.querySelector('.hero-text');
      if (heroTextSection) {
        const heroLinks = heroTextSection.querySelectorAll('a, button, .play-btn');
        heroLinks.forEach(link => {
          link.addEventListener('mouseenter', () => {
            if (isInHeroSection && !isOverLatestRelease) {
              // Make the moon glow brighter on hover
              gsap.to(cursor, {
                scale: 1.2,
                duration: 0.5,
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 50px rgba(255, 255, 255, 0.6), 0 0 70px rgba(255, 255, 255, 0.4)'
              });
              
              // Make the moon craters more visible
              gsap.to(cursor.querySelectorAll('div'), {
                opacity: '+= 0.2',
                duration: 0.5
              });
            }
          });
          
          link.addEventListener('mouseleave', () => {
            if (isInHeroSection && !isOverLatestRelease) {
              gsap.to(cursor, {
                scale: 1,
                duration: 0.5,
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4), 0 0 40px rgba(255, 255, 255, 0.2)'
              });
              
              // Return craters to normal opacity
              gsap.to(cursor.querySelectorAll('div'), {
                opacity: '-= 0.2',
                duration: 0.5
              });
            }
          });
        });
      }
    }
  }
}