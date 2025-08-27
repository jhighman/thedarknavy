# DevCo Band Website

A modern, responsive website for DevCo, a band with a futuristic, AI-infused aesthetic.

## Project Overview

This website is designed to showcase DevCo's music and brand with a retro-futuristic aesthetic inspired by vintage poster art. The site features:

- Responsive design that works on all devices
- Navy and golden color scheme with teal accents
- Custom audio and video players for music teasers
- Smooth animations and transitions with GSAP
- Radial gradient backgrounds reminiscent of vintage ray effects

## Tech Stack

- HTML5 for semantic markup
- TailwindCSS for styling with custom color palette
- Vanilla JavaScript for interactivity
- GSAP for animations and scroll effects

## Pages

1. **Home/Landing Page**: Features a full-screen video background, band name, tagline, and CTAs for streaming platforms.
2. **About Page**: Contains a cryptic bio, band image, and audio quote.
3. **Music Page**: Showcases audio and video teasers with links to streaming platforms.
4. **Contact Page**: Provides a contact email and newsletter signup form.

## Development

### Prerequisites

- Node.js and npm

### Setup

1. Clone the repository:
   ```
   git clone git@github.com:jhighman/devco.git
   cd devco
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build CSS:
   ```
   npm run build:css
   ```

4. For development with live CSS updates:
   ```
   npm run watch:css
   ```

### Building for Production

To build minified CSS for production:
```
npm run minify:css
```

## License

MIT

## Brand Guidelines

### Color Palette
- Navy Base (#1A2A44): Deep backgrounds
- Golden Blaze (#FFC107): Accents and CTAs
- Teal Pulse (#26A69A): Secondary elements
- White Spark (#FFFFFF): Text and highlights
- Black Void (#000000): Text outlines and contrast

### Typography
- Headings: Bebas Neue (all caps)
- Body: Open Sans
- Text features drop shadows for that vintage poster feel

## Asset Creation

### Hero Fallback Image
To create the hero-fallback.webp image from band-image.webp:

1. Use band-image.webp as the starting point
2. Crop to 16:9 ratio (e.g., 1200x675px) for a hero layout
3. Add a semi-transparent navy overlay
4. Add "DEVCO" text at 70% opacity with the tagline "Sound of the AI Age"
5. Convert using ImageMagick:
   ```
   convert band-image.webp -resize 1200x675 -quality 85 hero-fallback.webp
   ```
6. Target file size should be <150KB with 85% quality

## Credits

- Fonts: Google Fonts (Bebas Neue, Open Sans)
- Icons: SVG icons
- Animation: GSAP