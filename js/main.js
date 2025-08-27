// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize smooth scrolling for anchor links
  initSmoothScrolling();
  
  // Initialize GSAP animations
  initAnimations();
  
  // Initialize custom audio/video players
  initMediaPlayers();
});

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
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
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
    // Hero text fade in
    gsap.from('.hero-text', { 
      opacity: 0, 
      y: 30, 
      duration: 1.5, 
      ease: 'power3.out' 
    });
    
    // Teaser cards animation on scroll
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.from('.teaser-card', { 
        opacity: 0, 
        y: 50, 
        duration: 1,
        stagger: 0.2,
        scrollTrigger: { 
          trigger: '.teaser-section',
          start: 'top 80%'
        } 
      });
    }
  }
}

/**
 * Initialize custom audio/video players
 */
function initMediaPlayers() {
  // Custom controls for audio players
  document.querySelectorAll('audio').forEach(audio => {
    const playBtn = audio.parentElement.querySelector('.play-btn');
    const progressBar = audio.parentElement.querySelector('.progress-bar');
    
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (audio.paused) {
          audio.play();
          playBtn.classList.add('playing');
        } else {
          audio.pause();
          playBtn.classList.remove('playing');
        }
      });
    }
    
    if (progressBar) {
      audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
      });
    }
  });
  
  // Custom controls for video players
  document.querySelectorAll('video').forEach(video => {
    const playBtn = video.parentElement.querySelector('.play-btn');
    
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          playBtn.classList.add('playing');
        } else {
          video.pause();
          playBtn.classList.remove('playing');
        }
      });
    }
  });
}