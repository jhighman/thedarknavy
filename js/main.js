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
  
  // Initialize 3D animation in hero section with lazy loading
  init3DAnimationLazy();
  
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
 * Lazy load the 3D animation using Intersection Observer
 * Only initializes when the hero section is in view
 */
function init3DAnimationLazy() {
  const heroSection = document.querySelector('#hero');
  if (!heroSection) return;
  
  console.log('Setting up lazy loading for 3D animation');
  
  // Create an intersection observer
  const observer = new IntersectionObserver((entries) => {
    // If hero section is intersecting (visible)
    if (entries[0].isIntersecting) {
      console.log('Hero section in view, initializing 3D animation');
      
      // Initialize the 3D animation
      init3DAnimation();
      
      // Disconnect the observer once animation is initialized
      observer.disconnect();
    }
  }, {
    // Initialize when at least 20% of the hero section is visible
    threshold: 0.2,
    // Start loading slightly before the section comes into view
    rootMargin: '100px 0px'
  });
  
  // Start observing the hero section
  observer.observe(heroSection);
}

/**
 * Initialize 3D animation in the hero section
 * Called by the Intersection Observer when hero section is in view
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
  // Reduce particle count for better performance, especially on mobile
  const particleCount = window.innerWidth <= 768 ? 600 : 1000;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  // Nautical-themed color palette based on the poster
  const colorOptions = [
    new THREE.Color(0x1A2A44), // dark navy blue
    new THREE.Color(0xF4A261), // sandy orange
    new THREE.Color(0xE9C46A), // golden yellow
    new THREE.Color(0x2A9D8F), // teal
    new THREE.Color(0xF4EBD0)  // cream/white
  ];
  
  // Create groups of particles for ship-like formations
  const shipCount = 3; // Number of "ships"
  const particlesPerShip = Math.floor(particleCount / (shipCount + 1)); // Reserve some particles for general sea
  
  for (let i = 0; i < particleCount; i++) {
    // Determine if this particle is part of a ship formation
    const isShipParticle = i < particlesPerShip * shipCount;
    const shipIndex = Math.floor(i / particlesPerShip);
    
    if (isShipParticle) {
      // Position particles in ship-like formations
      // Each "ship" is at a different position
      const shipOffset = (shipIndex - 1) * 15; // Spread ships horizontally
      const localIndex = i % particlesPerShip;
      const shipProgress = localIndex / particlesPerShip;
      
      // Create a more ship-like shape - denser at the center
      const radius = 5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() * 0.5 + 0.25) * Math.PI; // Concentrate around the equator
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta) + shipOffset;     // x
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 5;          // y (lower in the scene)
      positions[i * 3 + 2] = radius * Math.cos(phi) - 10 + shipIndex * 10;          // z (different depths)
      
      // Ship particles are more golden/orange
      const color = colorOptions[shipIndex % 2 + 1]; // Use sandy orange or golden yellow
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Slightly larger particles for ships
      sizes[i] = 0.15 + Math.random() * 0.05;
    } else {
      // Position remaining particles in a wave-like sea formation
      const radius = 20 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
      positions[i * 3 + 2] = radius * Math.cos(phi);                   // z
      
      // Sea particles use the full color palette with emphasis on blues and teals
      const colorIndex = Math.random() < 0.7 ?
                         (Math.random() < 0.7 ? 0 : 3) : // 49% dark navy, 21% teal
                         Math.floor(Math.random() * colorOptions.length); // 30% any color
      const color = colorOptions[colorIndex];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Varied sizes for sea particles
      sizes[i] = 0.05 + Math.random() * 0.1;
    }
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Create particle material with custom shader for better looking particles
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    vertexSizes: true // Use the size attribute
  });
  
  // Create particle system
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
  
  // Store the last animation time for frame rate control
  window.lastAnimationTime = performance.now();
  
  // Start animation loop
  animate();
}

/**
 * Animation loop for 3D particles
 */
function animate() {
  animationId = requestAnimationFrame(animate);
  
  // Frame rate control for performance
  const now = performance.now();
  const elapsed = now - (window.lastAnimationTime || 0);
  
  // Target ~60 FPS (16.67ms) but allow for some flexibility
  if (elapsed < 16) {
    return; // Skip this frame
  }
  
  // Store the time for the next frame calculation
  window.lastAnimationTime = now;
  
  if (particles) {
    const positions = particles.geometry.attributes.position.array;
    const colors = particles.geometry.attributes.color.array;
    const particleCount = positions.length / 3;
    
    // Get mouse position for interactive effects
    const mouseX = (window.mouseX || window.innerWidth / 2) - window.innerWidth / 2;
    const mouseY = (window.mouseY || window.innerHeight / 2) - window.innerHeight / 2;
    
    // Time-based animation factors
    const time = Date.now() * 0.001;
    
    // Get wave intensity from cursor follower (default to 1.0 if not set)
    const waveIntensity = window.waveIntensity || 1.0;
    const waveSpeed = 0.3 * waveIntensity;
    
    // Get wave direction from cursor follower
    const waveDirection = window.waveDirection || { x: 0, y: 0 };
    
    // Check for cursor ripple effect
    const cursorRipple = window.cursorRipple || null;
    
    // Check for hover effect on interactive elements
    const hoverEffect = window.particleHoverEffect || false;
    
    // Ship movement progress - speed up when hovering over interactive elements
    const shipSpeedMultiplier = hoverEffect ? 1.5 : 1.0;
    window.shipProgress = (window.shipProgress || 0) + (0.005 * shipSpeedMultiplier);
    if (window.shipProgress > Math.PI * 2) window.shipProgress = 0;
    
    // Process each particle
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      
      // Determine if this is a ship particle (first third of particles)
      const shipCount = 3;
      const particlesPerShip = Math.floor(particleCount / (shipCount + 1));
      const isShipParticle = i < particlesPerShip * shipCount;
      const shipIndex = Math.floor(i / particlesPerShip);
      
      if (isShipParticle) {
        // Ship-like movement pattern
        // Forward movement with slight bobbing
        positions[idx + 2] += 0.02 * shipSpeedMultiplier; // Move forward along z-axis
        
        // Reset ship position when it goes too far
        if (positions[idx + 2] > 40) {
          positions[idx + 2] = -40;
        }
        
        // Sway side to side based on ship index and time
        positions[idx] += Math.sin(window.shipProgress + shipIndex * 0.5) * 0.02;
        
        // Bob up and down like a ship on waves
        positions[idx + 1] += Math.sin(window.shipProgress * 1.5 + shipIndex) * 0.01;
        
        // Subtle color pulsing for ship particles
        const colorPulse = Math.sin(time + i * 0.1) * 0.1 * waveIntensity;
        colors[idx] = Math.min(Math.max(colors[idx] + colorPulse, 0), 1); // Red
        colors[idx + 1] = Math.min(Math.max(colors[idx + 1] + colorPulse * 0.5, 0), 1); // Green
        
        // Make ships respond to wave direction from cursor
        if (Math.abs(waveDirection.x) > 0.1 || Math.abs(waveDirection.y) > 0.1) {
          positions[idx] += waveDirection.x * 0.01 * waveIntensity;
          positions[idx + 1] += waveDirection.y * 0.01 * waveIntensity;
        }
      } else {
        // Wave-like motion for sea particles
        // Calculate base position
        const x = positions[idx];
        const y = positions[idx + 1];
        const z = positions[idx + 2];
        
        // Wave effect: particles move in a sinusoidal pattern
        // Intensity affected by cursor follower
        positions[idx + 2] += Math.sin(time * waveSpeed + x * 0.1) * 0.05 * waveIntensity;
        
        // Mouse interaction: create ripple effect from mouse position
        const dx = x - mouseX * 0.01;
        const dy = y - mouseY * 0.01;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Ripple effect - waves emanate from cursor position
        if (distance < 20) { // Only affect particles within a certain radius
          const rippleFactor = (1 - distance / 20) * 0.2 * waveIntensity;
          positions[idx + 2] += Math.sin(time * 2 - distance) * rippleFactor;
        }
        
        // Special ripple effect from cursor follower
        if (cursorRipple) {
          // Convert cursor position to particle space
          const cursorX = cursorRipple.x * 20; // Scale to particle space
          const cursorY = cursorRipple.y * 20;
          
          // Calculate distance from cursor ripple center
          const dxRipple = x - cursorX;
          const dyRipple = y - cursorY;
          const rippleDistance = Math.sqrt(dxRipple * dxRipple + dyRipple * dyRipple);
          
          // Create expanding ripple effect
          const rippleTime = time - cursorRipple.time;
          const rippleRadius = rippleTime * 10; // Expand over time
          const rippleWidth = 5;
          
          if (Math.abs(rippleDistance - rippleRadius) < rippleWidth && rippleTime < 2) {
            // Particles at the ripple edge move more
            const rippleIntensity = cursorRipple.intensity * (1 - rippleTime / 2); // Fade over time
            positions[idx + 2] += Math.sin(rippleTime * 10) * rippleIntensity * 0.5;
          }
        }
        
        // Subtle color shifts for sea particles based on height (z position)
        const heightFactor = (Math.sin(time + positions[idx + 2]) + 1) * 0.5 * 0.1 * waveIntensity;
        colors[idx + 2] += heightFactor; // Adjust blue component based on height
        colors[idx + 2] = Math.min(Math.max(colors[idx + 2], 0), 1); // Clamp to valid range
      }
    }
    
    // Update geometry attributes
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.color.needsUpdate = true;
    
    // Gentle overall rotation, affected by hover state
    const rotationSpeed = hoverEffect ? 0.003 : 0.001;
    particles.rotation.y += rotationSpeed;
    
    // Camera tilt based on mouse position for immersion
    camera.rotation.x = mouseY * 0.00005 * waveIntensity;
    camera.rotation.y = mouseX * 0.00005 * waveIntensity;
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
        // Offset for fixed header (adjusted for the single header with wave background)
        const headerOffset = 100;
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
      const sectionTop = section.offsetTop - 120; // Adjusted for single header
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
 * Initialize wave cursor follower - bounded to hero section only and hidden over latest release
 * The waves flow in the direction of the cursor movement and interact with 3D particles
 */
function initCursorFollower() {
  const cursor = document.querySelector('.cursor-follower');
  const heroSection = document.querySelector('#hero');
  const latestReleaseTeaser = document.querySelector('.latest-release-teaser');
  const waves = cursor.querySelectorAll('.wave');
  
  if (cursor && heroSection && latestReleaseTeaser && waves.length) {
    // Only enable on desktop
    if (window.innerWidth > 768) {
      cursor.style.opacity = '0'; // Start hidden
      
      // Variables for smooth movement
      let mouseX = 0;
      let mouseY = 0;
      let cursorX = 0;
      let cursorY = 0;
      let prevMouseX = 0;
      let prevMouseY = 0;
      let isInHeroSection = false;
      let isOverLatestRelease = false;
      
      // Store wave intensity for 3D particle integration
      window.waveIntensity = 1.0;
      window.waveDirection = { x: 0, y: 0 };
      
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
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Check positions
        isInHeroSection = checkIfInHeroSection(mouseX, mouseY);
        isOverLatestRelease = checkIfOverLatestRelease(mouseX, mouseY);
        
        // Show/hide cursor based on position
        // Hide when over latest release section for easier clicking
        if (isInHeroSection && !isOverLatestRelease) {
          cursor.style.opacity = '1';
          
          // Calculate movement vector for 3D particles to use
          const deltaX = mouseX - prevMouseX;
          const deltaY = mouseY - prevMouseY;
          const movementSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          
          // Update global wave direction for 3D particles to reference
          if (movementSpeed > 1) {
            window.waveDirection = {
              x: deltaX / movementSpeed,
              y: deltaY / movementSpeed
            };
          }
        } else {
          cursor.style.opacity = '0';
        }
      });
      
      // Use requestAnimationFrame for smoother movement
      function animateWaves() {
        if (isInHeroSection && !isOverLatestRelease) {
          // Add slight lag for more natural wave movement
          const lagFactor = 0.1;
          cursorX += (mouseX - cursorX) * lagFactor;
          cursorY += (mouseY - cursorY) * lagFactor;
          
          // Position the cursor follower
          gsap.set(cursor, {
            x: cursorX - cursor.offsetWidth / 2,
            y: cursorY - cursor.offsetHeight / 2,
            borderRadius: 0, // Ensure no rounded corners
            background: 'transparent' // Ensure no background
          });
          
          // Calculate direction of mouse movement
          const deltaX = mouseX - prevMouseX;
          const deltaY = mouseY - prevMouseY;
          
          // Only update wave direction if there's significant movement
          if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
            // Calculate angle of movement (in radians)
            const angle = Math.atan2(deltaY, deltaX);
            
            // Convert to degrees and adjust for SVG rotation
            const degrees = angle * (180 / Math.PI);
            
            // Apply rotation to waves with different speeds for each layer
            waves.forEach((wave, index) => {
              // Different rotation speeds for each wave layer
              const rotationSpeed = 1 - (index * 0.2); // 1, 0.8, 0.6 for the three waves
              
              // Apply transform to control wave direction
              gsap.to(wave, {
                rotation: degrees * rotationSpeed,
                transformOrigin: "center center",
                duration: 1.5,
                ease: "power1.out"
              });
              
              // Adjust wave animation speed based on mouse movement speed
              const movementSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
              const speedFactor = Math.min(Math.max(movementSpeed / 10, 0.5), 3);
              
              // Store wave intensity for 3D particles to reference
              window.waveIntensity = speedFactor;
              
              // Different durations for each wave
              const baseDuration = 7 - (index * 2); // 7s, 5s, 3s
              const newDuration = baseDuration / speedFactor;
              
              // Update animation duration
              const animateElement = wave.querySelector('animate');
              if (animateElement) {
                animateElement.setAttribute('dur', `${newDuration}s`);
              }
            });
            
            // Create a ripple in the 3D particles at cursor position
            if (particles && particles.geometry) {
              // Trigger a more intense ripple in the 3D particles
              window.cursorRipple = {
                x: (mouseX / window.innerWidth) * 2 - 1,
                y: -(mouseY / window.innerHeight) * 2 + 1,
                intensity: Math.min(movementSpeed / 5, 2),
                time: Date.now() * 0.001
              };
            }
          }
          
          // Pulse effect for the cursor
          gsap.to(cursor, {
            scale: 1 + Math.sin(Date.now() / 1000) * 0.05,
            duration: 0.5,
            overwrite: true
          });
        }
        
        requestAnimationFrame(animateWaves);
      }
      
      animateWaves();
      
      // Special effects on links within hero section (excluding latest release)
      const heroTextSection = heroSection.querySelector('.hero-text');
      if (heroTextSection) {
        const heroLinks = heroTextSection.querySelectorAll('a, button, .play-btn');
        heroLinks.forEach(link => {
          link.addEventListener('mouseenter', () => {
            if (isInHeroSection && !isOverLatestRelease) {
              // Make the waves more active and glow on hover
              gsap.to(cursor, {
                scale: 1.2,
                duration: 0.5,
                boxShadow: '0 0 30px rgba(197, 255, 69, 0.8), 0 0 50px rgba(42, 157, 143, 0.6)'
              });
              
              // Increase wave animation speed
              waves.forEach((wave, index) => {
                const animateElement = wave.querySelector('animate');
                if (animateElement) {
                  const baseDuration = 7 - (index * 2); // 7s, 5s, 3s
                  animateElement.setAttribute('dur', `${baseDuration * 0.7}s`);
                }
              });
              
              // Increase 3D particle animation intensity
              window.waveIntensity = 2.0;
              
              // Also affect the 3D particles - make them more active
              if (particles) {
                // Increase rotation speed temporarily
                window.particleHoverEffect = true;
              }
            }
          });
          
          link.addEventListener('mouseleave', () => {
            if (isInHeroSection && !isOverLatestRelease) {
              gsap.to(cursor, {
                scale: 1,
                duration: 0.5,
                boxShadow: '0 0 20px rgba(197, 255, 69, 0.4), 0 0 30px rgba(42, 157, 143, 0.3)'
              });
              
              // Return wave animation speed to normal
              waves.forEach((wave, index) => {
                const animateElement = wave.querySelector('animate');
                if (animateElement) {
                  const baseDuration = 7 - (index * 2); // 7s, 5s, 3s
                  animateElement.setAttribute('dur', `${baseDuration}s`);
                }
              });
              
              // Reset 3D particle animation intensity
              window.waveIntensity = 1.0;
              
              // Reset 3D particle hover effect
              window.particleHoverEffect = false;
            }
          });
        });
      }
    }
  }
}