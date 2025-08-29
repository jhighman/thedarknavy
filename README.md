# The Dark Navy Band Website

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

## Dreamweaver Setup Guide

This section provides step-by-step instructions for setting up and modifying this website using Adobe Dreamweaver.

### Step 1: Clone the Repository

1. **Using Git (Recommended)**:
   - Open your command line or terminal
   - Navigate to your desired directory
   - Run: `git clone https://github.com/jhighman/thedarknavy.git`
   - Or if you're using SSH: `git clone git@github.com:jhighman/thedarknavy.git`

2. **Without Git**:
   - Download the ZIP file from the GitHub repository
   - Extract the ZIP file to your desired location

### Step 2: Open the Project in Dreamweaver

1. Open Adobe Dreamweaver
2. Go to **File > Open** or press **Ctrl+O** (Windows) / **Cmd+O** (Mac)
3. Navigate to the folder where you cloned/extracted the repository
4. Select the entire folder to open it as a site
5. Alternatively, set up a Dreamweaver site:
   - Go to **Site > New Site**
   - Enter a site name (e.g., "The Dark Navy")
   - Set the local site folder to your cloned repository location
   - Click **Save**

### Step 3: Preview the Website

1. In Dreamweaver's file browser, locate and open `index.html`
2. To preview the site, click the **Live** button in the top-left corner of the document window
3. Alternatively, press **F12** (Windows) / **Opt+F12** (Mac) to preview in your default browser
4. You can also right-click on `index.html` and select **Preview in Browser > [Your Browser]**

### Step 4: Modify Content

1. **Basic Text Changes**:
   - Open `index.html` in Dreamweaver
   - Use Dreamweaver's Design view or Code view to make direct HTML edits

2. **Content Configuration (Recommended)**:
   - Open `config.yaml` in Dreamweaver's Code view
   - Edit the YAML content following the structure
   - Save the file

3. **CSS Styling**:
   - For simple style changes, modify `css/output.css` directly
   - For more advanced changes, edit `css/tailwind.css`
   - If you modify `tailwind.css`, you'll need to rebuild the CSS (see below)

### Step 5: Rebuild CSS (If Needed)

If you've modified `tailwind.css` or `tailwind.config.js`, you'll need to rebuild the CSS:

1. **Using Terminal/Command Line**:
   - Open a terminal/command prompt
   - Navigate to your project directory
   - Run: `npm install` (first time only)
   - Run: `npm run build:css`

2. **Using Dreamweaver's Terminal** (if available in your version):
   - Open the Terminal panel (Window > Terminal)
   - Run the commands above

### Step 6: Add Your Media

1. Navigate to the `assets` folder in Dreamweaver's Files panel
2. Replace the existing images, audio, and video with your own content
3. Make sure to maintain the same file names or update the references in `config.yaml`

### Step 7: Publish Your Site

1. Set up your remote server in Dreamweaver:
   - Go to **Site > Manage Sites**
   - Select your site and click **Edit**
   - Go to the **Servers** category
   - Add your FTP/SFTP server details
   - Click **Save**

2. Upload your files:
   - In the Files panel, select the files you want to upload
   - Click the **Put** button (up arrow) to upload to your server

## License

MIT