# DevCo Band Website

A modern, responsive single-page website for bands and musicians. This site features smooth scrolling navigation, animations, and a fully customizable content system using YAML configuration.

## Features

- Modern single-page design with smooth scrolling between sections
- Responsive layout that works on mobile and desktop
- Custom audio and video players
- Animations and visual effects (glitch text, typewriter animations, scroll-triggered animations)
- Glassmorphism UI effects with backdrop blur
- Fully customizable content via YAML configuration

## Customization

The website content is fully customizable through YAML configuration files. This makes it easy for different bands to use the same codebase with their own content.

### How to Customize

1. Edit the `config.yaml` file to update:
   - Band name and tagline
   - About section content
   - Music releases
   - Contact information
   - Social media links
   - Navigation items

2. Replace media files in the `assets` directory with your own content.

For detailed instructions on adding songs, videos, advertisements, and other content, see the [Content Guide](CONTENT_GUIDE.md).

### Testing Different Configurations

You can create multiple configuration files and switch between them using a URL parameter:

- Default configuration: `index.html` (uses `config.yaml`)
- Alternative configuration: `index.html?config=alt-config` (uses `alt-config.yaml`)

This makes it easy to preview different band configurations without modifying the code.

## Development

### Prerequisites

- Node.js and npm

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Building CSS

The site uses Tailwind CSS for styling. To build the CSS:

```
npm run build:css
```

To watch for changes during development:

```
npm run watch:css
```

To build minified CSS for production:

```
npm run minify:css
```

## Structure

- `index.html` - Main HTML file
- `config.yaml` - Default configuration file
- `js/main.js` - JavaScript functionality
- `css/tailwind.css` - Tailwind CSS source
- `css/output.css` - Compiled CSS (generated)
- `assets/` - Media files (images, audio, video)

## License

MIT