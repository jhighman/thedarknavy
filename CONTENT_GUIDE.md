# DevCo Band Website Content Guide

This guide provides detailed instructions on how to customize the website content using the YAML configuration system. Follow these steps to add or modify songs, videos, advertisements, and other content.

## Table of Contents

1. [Basic Configuration Structure](#basic-configuration-structure)
2. [Adding/Modifying Music Releases](#addingmodifying-music-releases)
3. [Adding/Modifying Videos](#addingmodifying-videos)
4. [Updating Band Information](#updating-band-information)
5. [Adding Advertisements](#adding-advertisements)
6. [Customizing Social Media Links](#customizing-social-media-links)
7. [Advanced Customization](#advanced-customization)

## Basic Configuration Structure

The configuration file (`config.yaml`) is organized into several main sections:

```yaml
site:       # Website metadata (title, description)
band:       # Band information (name, tagline, email, etc.)
music:      # Music releases and tracks
social:     # Social media links
navigation: # Navigation menu items
```

## Adding/Modifying Music Releases

Music releases are defined in the `music.releases` section of the configuration file. Each release has the following structure:

```yaml
music:
  section_title: "Latest Releases"  # Title displayed at the top of the music section
  releases:
    - title: "Song Title"           # Title of the song/release
      type: "audio"                 # Type: "audio" or "video"
      description: "Description of the song"
      file: "./assets/audio/song-file.mp3"  # Path to the audio file
      links:
        - platform: "Spotify"       # Streaming platform name
          url: "https://spotify.com/link-to-song"
        - platform: "Apple Music"
          url: "https://music.apple.com/link-to-song"
```

### To add a new song:

1. Add your audio file to the `assets/audio/` directory
2. Add a new entry to the `music.releases` array in your configuration file
3. Fill in the title, description, file path, and streaming links

### Example: Adding a new song

```yaml
- title: "New Song Title"
  type: "audio"
  description: "This is our latest single featuring synthesizers and drum machines."
  file: "./assets/audio/new-song.mp3"
  links:
    - platform: "Spotify"
      url: "https://open.spotify.com/track/your-track-id"
    - platform: "Apple Music"
      url: "https://music.apple.com/album/your-album-id"
```

## Adding/Modifying Videos

Videos are added similarly to audio releases, but with the type set to "video" and additional fields for the video thumbnail:

```yaml
- title: "Video Title"
  type: "video"
  description: "Description of the video"
  file: "./assets/videos/video-file.webm"
  thumbnail: "./assets/images/video-thumbnail.webp"
  links:
    - platform: "YouTube"
      url: "https://youtube.com/watch?v=video-id"
      text: "Watch Full Video"  # Optional custom text for the button
```

### To add a new video:

1. Add your video file to the `assets/videos/` directory
2. Add a thumbnail image to the `assets/images/` directory
3. Add a new entry to the `music.releases` array with type "video"
4. Fill in the title, description, file paths, and links

## Updating Band Information

Band information is stored in the `band` section of the configuration file:

```yaml
band:
  name: "Your Band Name"
  tagline: "Your Band Tagline"
  email: "contact@yourband.com"
  
  # Hero Section
  hero:
    background_video: "./assets/videos/hero-background.webm"
    background_fallback: "./assets/images/hero-fallback.webp"
    cta_buttons:
      - text: "Stream on Spotify"
        url: "https://open.spotify.com/artist/your-artist-id"
      - text: "Stream on Apple Music"
        url: "https://music.apple.com/artist/your-artist-id"

  # About Section
  about:
    heading: "Your heading here"
    image: "./assets/images/band-image.webp"
    bio:
      - "First paragraph of your band bio."
      - "Second paragraph of your band bio."
      - "Third paragraph of your band bio."
    quote:
      text: "A memorable quote from your band"
      audio: "./assets/audio/quote.mp3"  # Optional audio clip of the quote
```

### To update band information:

1. Edit the name, tagline, and email fields
2. Update the hero section with your background video/image and call-to-action buttons
3. Update the about section with your band image, bio paragraphs, and quote

## Adding Advertisements

You can add advertisements or promotional content by customizing the existing structure or adding new sections. Here's how to add a promotional banner:

1. First, add the promotional content to your configuration file:

```yaml
# Add this to your config.yaml
promotions:
  - title: "New Album Coming Soon"
    description: "Pre-order our upcoming album and get exclusive content"
    image: "./assets/images/album-promo.webp"
    button_text: "Pre-order Now"
    button_url: "https://yourband.com/pre-order"
    start_date: "2025-09-01"
    end_date: "2025-10-15"
```

2. Then, modify the `index.html` file to include a section for promotions (this requires editing the HTML):

```html
<!-- Add this where you want the promotions to appear -->
<section id="promotions" class="py-12 relative">
  <div class="container-custom relative z-10">
    <!-- Promotions will be dynamically inserted here -->
  </div>
</section>
```

3. Update the JavaScript in `main.js` to render the promotions:

```javascript
// Add this to the applyConfiguration function in main.js
// Render promotions if they exist
if (config.promotions && config.promotions.length > 0) {
  const promotionsSection = document.querySelector('#promotions .container-custom');
  if (promotionsSection) {
    // Clear existing content
    promotionsSection.innerHTML = '';
    
    // Add each promotion
    config.promotions.forEach(promo => {
      // Check if the promotion is active based on dates
      const now = new Date();
      const startDate = promo.start_date ? new Date(promo.start_date) : null;
      const endDate = promo.end_date ? new Date(promo.end_date) : null;
      
      if ((!startDate || now >= startDate) && (!endDate || now <= endDate)) {
        const promoElement = document.createElement('div');
        promoElement.className = 'bg-navy/50 p-6 rounded-lg backdrop-blur-sm my-4';
        promoElement.innerHTML = `
          <h3 class="text-2xl font-heading mb-4">${promo.title}</h3>
          <p class="text-white-spark mb-4">${promo.description}</p>
          ${promo.image ? `<img src="${promo.image}" alt="${promo.title}" class="w-full rounded-lg mb-4">` : ''}
          <a href="${promo.button_url}" class="btn block text-center">${promo.button_text}</a>
        `;
        promotionsSection.appendChild(promoElement);
      }
    });
  }
}
```

## Customizing Social Media Links

Social media links are defined in the `social` section:

```yaml
social:
  - platform: "Instagram"
    url: "https://instagram.com/yourbandname"
    icon: "instagram"
  - platform: "Twitter"
    url: "https://twitter.com/yourbandname"
    icon: "twitter"
  - platform: "YouTube"
    url: "https://youtube.com/c/yourbandname"
    icon: "youtube"
  - platform: "Spotify"
    url: "https://open.spotify.com/artist/your-artist-id"
    icon: "spotify"
```

### To update social media links:

1. Edit the existing entries with your band's social media URLs
2. Add or remove platforms as needed
3. The `icon` field should match one of the available SVG icons in the HTML

## Advanced Customization

### Adding a New Section

To add a completely new section to the website:

1. Add the section content to your configuration file:

```yaml
# Add this to your config.yaml
tour_dates:
  section_title: "Upcoming Shows"
  shows:
    - date: "2025-10-15"
      venue: "The Music Hall"
      city: "New York, NY"
      ticket_url: "https://tickets.com/event-id"
    - date: "2025-10-18"
      venue: "Sound Garden"
      city: "Seattle, WA"
      ticket_url: "https://tickets.com/event-id"
```

2. Add the HTML structure for the new section to `index.html`:

```html
<!-- Add this where you want the tour dates section to appear -->
<section id="tour" class="py-20 relative">
  <div class="absolute inset-0 z-0 opacity-10">
    <div class="waveform-bg h-full w-full"></div>
  </div>
  <div class="container-custom relative z-10">
    <h2 class="text-5xl md:text-6xl font-heading mb-12 text-center section-title">
      <span id="tour-section-title">Upcoming Shows</span>
    </h2>
    
    <div id="tour-dates-container" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Tour dates will be dynamically inserted here -->
    </div>
  </div>
</section>
```

3. Update the JavaScript in `main.js` to render the new section:

```javascript
// Add this to the applyConfiguration function in main.js
// Render tour dates if they exist
if (config.tour_dates) {
  const tourSection = document.querySelector('#tour');
  if (tourSection) {
    // Update section title
    const titleElement = document.querySelector('#tour-section-title');
    if (titleElement) {
      titleElement.textContent = config.tour_dates.section_title;
    }
    
    // Render tour dates
    const container = document.querySelector('#tour-dates-container');
    if (container && config.tour_dates.shows) {
      // Clear existing content
      container.innerHTML = '';
      
      // Add each show
      config.tour_dates.shows.forEach(show => {
        const showDate = new Date(show.date);
        const formattedDate = showDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        const showElement = document.createElement('div');
        showElement.className = 'bg-navy/50 p-6 rounded-lg backdrop-blur-sm transform-gpu hover:scale-[1.02] transition-all duration-500';
        showElement.innerHTML = `
          <h3 class="text-2xl font-heading mb-2">${formattedDate}</h3>
          <p class="text-white-spark mb-1">${show.venue}</p>
          <p class="text-white-spark mb-4">${show.city}</p>
          <a href="${show.ticket_url}" target="_blank" rel="noopener noreferrer" class="btn block text-center">Get Tickets</a>
        `;
        container.appendChild(showElement);
      });
    }
  }
}
```

4. Add the new section to the navigation in your configuration:

```yaml
navigation:
  - text: "Home"
    url: "#hero"
  - text: "Music"
    url: "#music"
  - text: "Tour"  # Add this new navigation item
    url: "#tour"
  - text: "About"
    url: "#about"
  - text: "Contact"
    url: "#contact"
```

### Customizing Colors and Styles

While the YAML configuration focuses on content, you can also customize some visual aspects:

1. Edit the `tailwind.config.js` file to change the color scheme
2. Modify the CSS in `css/tailwind.css` to adjust animations and custom styles
3. Update the SVG patterns in the `<style>` section of `index.html` to change background patterns

## Final Tips

1. **Always back up your configuration file** before making significant changes
2. **Test your changes locally** before deploying to production
3. **Optimize media files** for web use to ensure fast loading times
4. **Keep file paths consistent** with the structure defined in the configuration
5. **Use relative paths** for all assets to ensure portability

For more advanced customization, you may need to modify the HTML, CSS, and JavaScript files directly. However, most content changes can be made entirely through the YAML configuration file.