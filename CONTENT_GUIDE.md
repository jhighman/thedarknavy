# DevCo Band Website Content Guide

This guide provides detailed instructions on how to customize the website content using the YAML configuration system. Follow these steps to add or modify songs, videos, advertisements, and other content.

## Table of Contents

1. [Basic Configuration Structure](#basic-configuration-structure)
2. [Adding/Modifying Music Releases](#addingmodifying-music-releases)
3. [Adding/Modifying Videos](#addingmodifying-videos)
4. [Updating Band Information](#updating-band-information)
5. [Managing Omni-Channel Content](#managing-omni-channel-content)
6. [Adding Advertisements](#adding-advertisements)
7. [Customizing Social Media Links](#customizing-social-media-links)
8. [Advanced Customization](#advanced-customization)

## Basic Configuration Structure

The configuration file (`config.yaml`) is organized into several main sections:

```yaml
site:       # Website metadata (title, description)
band:       # Band information (name, tagline, email, etc.)
music:      # Music releases and tracks
channels:   # Omni-channel content for various platforms
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

## Managing Omni-Channel Content

The website now features an omni-channel structure that allows you to manage content across multiple platforms. This is defined in the `channels` section of the configuration file.

### Channels Structure

The channels section is organized into several categories:

```yaml
channels:
  streaming:     # Music streaming platforms (Spotify, Apple Music, etc.)
  social:        # Social media platforms (Instagram, TikTok, etc.)
  video:         # Video platforms (Vevo, YouTube Music, etc.)
  digital_stores: # Digital music stores (iTunes, Beatport, etc.)
  misc:          # Miscellaneous platforms (Peloton, etc.)
```

Each category contains an array of platforms, and each platform has the following structure:

```yaml
- platform: "Platform Name"         # Name of the platform
  url: "https://platform.com/artist/your-artist-id"  # URL to your profile on the platform
  icon: "platform-icon"             # Icon name for the platform
  enabled: true                     # Whether the platform is enabled
  content:                          # Content specific to this platform
    post: "Your post text here"     # Text for posts on this platform
    link: "https://platform.com/specific-content-link"  # Link to specific content
    media: "./assets/path/to/media.file"  # Media file for this platform
```

Some platforms may also have sub-features:

```yaml
sub_features:
  - name: "Sub-feature Name"        # Name of the sub-feature (e.g., Instagram Reels)
    url: "https://platform.com/sub-feature"  # URL to your profile for this sub-feature
    enabled: true                   # Whether the sub-feature is enabled
    content:                        # Content specific to this sub-feature
      post: "Your post text here"   # Text for posts on this sub-feature
      link: "https://platform.com/specific-content-link"  # Link to specific content
      media: "./assets/path/to/media.file"  # Media file for this sub-feature
```

### Creating Content for Each Channel Type

#### Streaming Platforms

For streaming platforms (Spotify, Apple Music, Tidal, etc.), focus on:

1. **Post Text**: Create short, engaging messages that encourage listeners to stream your music. Include the track name and relevant hashtags.
2. **Link**: Provide a direct link to your track on the platform.
3. **Media**: Link to a preview audio file that represents the track.

Example:
```yaml
- platform: "Spotify"
  url: "https://open.spotify.com/artist/devco"
  icon: "spotify"
  enabled: true
  content:
    post: "Stream our latest track 'Digital Dystopia' on Spotify now! #DevCo #NewRelease"
    link: "https://open.spotify.com/track/digital-dystopia"
    media: "./assets/audio/teaser-1.mp3"
```

#### Social Media Platforms

For social media platforms (TikTok, Instagram, Facebook, etc.), focus on:

1. **Post Text**: Create platform-specific messages that match the platform's style and audience. Keep TikTok posts short and trendy, Instagram posts visual and hashtag-rich, and Facebook posts more informative.
2. **Link**: Provide a direct link to your post or content on the platform.
3. **Media**: Link to appropriate media for the platform (videos for TikTok, images for Instagram, etc.).

Example:
```yaml
- platform: "TikTok"
  url: "https://tiktok.com/@devco"
  icon: "tiktok"
  enabled: true
  content:
    post: "Check out our latest beat drop on TikTok! Join the #DevCoChallenge 🌀"
    link: "https://tiktok.com/@devco/video/digital-dystopia"
    media: "./assets/videos/tiktok-teaser.webm"
```

For platforms with sub-features (like Instagram Reels or YouTube Shorts), create specific content for each:

```yaml
sub_features:
  - name: "Instagram Reels"
    url: "https://instagram.com/devco/reels"
    enabled: true
    content:
      post: "Quick hit of 'Digital Dystopia' on Reels! #DevCo #Reels"
      link: "https://instagram.com/devco/reels/digital-dystopia"
      media: "./assets/videos/reels-teaser.webm"
```

#### Video Platforms

For video platforms (Vevo, YouTube Music, etc.), focus on:

1. **Post Text**: Create descriptions that highlight the visual aspects of your content and encourage viewers to watch.
2. **Link**: Provide a direct link to your video on the platform.
3. **Media**: Link to the video file or a preview.

Example:
```yaml
- platform: "Vevo"
  url: "https://vevo.com/artist/devco"
  icon: "vevo"
  enabled: true
  content:
    post: "'Neural Network' music video now live on Vevo! #DevCo #MusicVideo"
    link: "https://vevo.com/watch/neural-network"
    media: "./assets/videos/neural-network.webm"
```

#### Digital Stores

For digital stores (iTunes, Beatport, etc.), focus on:

1. **Post Text**: Create messages that encourage purchases and downloads. Highlight any special offers or exclusive content.
2. **Link**: Provide a direct link to your music on the store.
3. **Media**: Link to a preview of the content.

Example:
```yaml
- platform: "iTunes"
  url: "https://music.apple.com/artist/devco"
  icon: "itunes"
  enabled: true
  content:
    post: "Download 'Digital Dystopia' on iTunes now! #DevCo #NewMusic"
    link: "https://music.apple.com/track/digital-dystopia"
    media: "./assets/audio/teaser-1.mp3"
```

#### Miscellaneous Platforms

For miscellaneous platforms (Peloton, etc.), tailor your content to the specific platform's audience and purpose:

Example:
```yaml
- platform: "Peloton"
  url: "https://onepeloton.com/artists/devco"
  icon: "peloton"
  enabled: true
  content:
    post: "Ride to 'Digital Dystopia' on Peloton! #DevCo #WorkoutVibes"
    link: "https://onepeloton.com/class/devco-workout"
    media: "./assets/audio/teaser-1.mp3"
```

### Best Practices for Omni-Channel Content

1. **Platform-Specific Content**: Tailor your content to each platform's unique audience and format.
2. **Consistent Branding**: Maintain consistent messaging and branding across all channels.
3. **Appropriate Media**: Use platform-appropriate media formats and sizes.
4. **Relevant Hashtags**: Include platform-specific and trending hashtags to increase visibility.
5. **Call to Action**: Always include a clear call to action in your post text.
6. **Track Performance**: Use the `enabled` flag to manage which platforms are active and focus on those that perform best.
7. **Update Regularly**: Keep your content fresh and up-to-date across all channels.

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

Social media links are now managed through the omni-channel structure in the `channels` section. The old `social` section has been replaced with a more comprehensive structure.

To update your social media links:

1. Navigate to the appropriate category in the `channels` section (usually `channels.social`)
2. Edit the existing entries with your band's social media URLs
3. Set `enabled: true` for platforms you want to display, and `enabled: false` for those you want to hide
4. The `icon` field should match one of the available SVG icons in the HTML

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
6. **Maintain platform-specific content** for each channel to maximize engagement
7. **Regularly update your omni-channel content** to keep it fresh and relevant

For more advanced customization, you may need to modify the HTML, CSS, and JavaScript files directly. However, most content changes can be made entirely through the YAML configuration file.