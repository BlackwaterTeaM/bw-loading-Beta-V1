# FiveM Loading Screen Configuration Guide

This guide will help you complete the implementation of the config system for your loading screen.

## Updating MUSIC_TRACKS Variable

1. Find line ~2464 in `html/index.html` where `MUSIC_TRACKS` is defined
2. Replace it with:

```javascript
// --- Global Music Tracks ---
const MUSIC_TRACKS = typeof LOADING_CONFIG !== 'undefined' ? 
    LOADING_CONFIG.media.backgroundMusic : 
    [ // Fallback tracks if config not loaded yet
        {
            name: "Night City",
            artist: "REL",
            src: "audio/track1.mp3", 
            artwork: "img/logo.png",
            duration: 186 // Duration in seconds
        },
        {
            name: "Sunset Drive",
            artist: "REL",
            src: "audio/track2.mp3", 
            artwork: "img/logo.png",
            duration: 174 // Duration in seconds
        }
    ];
```

## Adding data-attributes to HTML elements

For the configuration system to work properly, add the following data attributes to your HTML elements:

1. **Links and URLs** - Add `data-link` attributes:
   ```html
   <a href="#" data-link="discord">Join Discord</a>
   <a href="#" data-link="website">Website</a>
   <a href="#" data-link="store">Store</a>
   ```

2. **Server Info** - Add `data-info` attributes:
   ```html
   <div class="info-value-premium" data-info="ip">connect play.yourserver.com</div>
   <div class="info-value-premium" data-info="teamspeak">ts.yourserver.com</div>
   <div class="info-value-premium" data-info="owner">ServerOwner</div>
   ```

3. **Server Name Elements** - Make sure these classes exist:
   - `.server-name` - For the main server name
   - `.server-title-top` - For the server name in the top bar

4. **Logo Elements** - Make sure the logo has appropriate classes:
   - `.sidebar-logo` - For the sidebar logo
   - `.intro-logo-wrapper img` - For the intro logo

5. **Sidebar Social Links** - Update the sidebar links in the HTML:
   ```html
   <!-- Find this section around line 1523 -->
   <div class="sidebar-footer">
       <a href="#" data-link="discord" target="_blank" class="social-link-sidebar" title="Discord">
           <i class="fab fa-discord"></i>
       </a>
       <a href="#" data-link="website" target="_blank" class="social-link-sidebar" title="Website">
           <i class="fas fa-globe"></i>
       </a>
       <a href="#" data-link="store" target="_blank" class="social-link-sidebar" title="Store">
           <i class="fas fa-shopping-cart"></i>
       </a>
       <!-- Add other social links as needed -->
   </div>
   ```

## Container Elements for Dynamic Content

Make sure these container elements exist with the correct classes:

1. **Staff List Container**:
   ```html
   <div class="staff-list-premium">
     <!-- Staff members will be inserted here by JavaScript -->
   </div>
   ```

2. **Rules Container**:
   ```html
   <div class="rules-grid-premium">
     <!-- Rules will be inserted here by JavaScript -->
   </div>
   ```

3. **Jobs List Container**:
   ```html
   <div class="job-list-premium">
     <!-- Jobs will be inserted here by JavaScript -->
   </div>
   ```

## Initialization Order

The loading sequence should be:

1. Browser loads `html/index.html`
2. Browser loads `html/config.js` (the configuration file)
3. When DOM is ready, the configuration script applies all settings
4. The main loading screen script uses the configured values

## Testing Configuration Changes

To test your configuration:

1. Edit `html/config.js` and change some values:
   ```javascript
   LOADING_CONFIG.server.name = "My Server Name";
   LOADING_CONFIG.links.discord = "https://discord.gg/myserver";
   LOADING_CONFIG.media.backgroundVideo = "video/my-custom-video.mp4";
   ```

2. Open the loading screen in a browser or restart your server
3. Verify that your changes are applied correctly

## Specific Examples for Customization

### Changing Server Name and Top Bar Title

```javascript
// In config.js
LOADING_CONFIG.server.name = "My Awesome RP Server";
LOADING_CONFIG.server.subtitle = "Premium Roleplay Experience";
```

### Updating Social Media Links

```javascript
// In config.js
LOADING_CONFIG.links.discord = "https://discord.gg/myserver";
LOADING_CONFIG.links.website = "https://myserver.com";
LOADING_CONFIG.links.store = "https://store.myserver.com";
```

### Changing Media Sources

```javascript
// In config.js
LOADING_CONFIG.media.backgroundVideo = "video/my-custom-video.mp4";
LOADING_CONFIG.media.introVideo = "video/my-intro.webm";
LOADING_CONFIG.media.backgroundMusic[0].src = "audio/my-music.mp3";
```

### Adding Staff Members

```javascript
// In config.js
LOADING_CONFIG.staff = [
    {
        name: "My Username",
        role: "owner",
        avatar: "img/my-avatar.jpg"
    },
    // Add more staff members
];
```

## Troubleshooting

If your configuration isn't applying correctly:

1. Check the browser console for errors (F12 > Console)
2. Verify that `config.js` is being loaded before the configuration is applied
3. Check that your HTML elements have the correct data attributes
4. Make sure the container elements exist with the right class names

## Important JavaScript Functions

The following JavaScript functions handle configuration application:

- `applyServerInfo()` - Applies server name, logo, etc.
- `applyMediaSources()` - Sets video and audio sources
- `applyStaffList()` - Populates the staff list
- `applyLinks()` - Updates all links and URLs
- `applyThemeSettings()` - Sets theme and visual preferences
- `applyRules()` - Populates the rules section
- `applyJobs()` - Populates the jobs list

If you need to modify how specific settings are applied, edit these functions in the `html/index.html` file. 