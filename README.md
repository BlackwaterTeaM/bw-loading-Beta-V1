# FiveM Premium Loading Screen

A feature-rich, highly customizable loading screen for your FiveM server with cinematic intro, interactive map, music player, and more.

## Features

* Cinematic Intro: Starts with an animated intro sequence
* Multiple Themes: Dark, Light, and Neon color schemes
* Music Player: Built-in player with playlist support
* Interactive Map: View and set waypoints directly from the loading screen
* Server Info: Display server stats, staff list, and rules
* Accessibility Options: High contrast mode and text size adjustments
* Easy Configuration: Update settings without editing code

## Installation

1. Download the resource
2. Place it in your server's resources folder
3. Add `ensure bw-loading` to your server.cfg
4. Customize the content as needed

## Customization

### Config File (Recommended)

The easiest way to customize the loading screen is to edit the `html/config.js` file:

```javascript
// Example config.js edits
LOADING_CONFIG.server.name = "Your Server Name";
LOADING_CONFIG.server.logo = "img/your-logo.png";
LOADING_CONFIG.media.backgroundVideo = "video/your-video.mp4";
LOADING_CONFIG.links.discord = "https://discord.gg/yourserver";
```

The config file lets you easily change:
- Server name, logo, and information
- Background video and music
- Staff members and their details
- Social media links (Discord, website, store)
- Jobs status and information
- Server rules
- Theme and visual settings

### Media Files

- Replace videos in `html/video/` with your own
- Replace music tracks in `html/audio/` with your own
- Update images in `html/img/` with your server's logo and staff photos

### Advanced HTML Editing

For more extensive customization, you can edit `html/index.html`:

- **Server Name**: Search for `server-name` class and update the text
- **Staff List**: Find the `staff-list-premium` section and edit staff members
- **Rules**: Update the rules section with your server's specific rules
- **Server Info**: Customize server details in the info section

### Configuration

The loading screen supports customization through the code:

- Edit `client/client.lua` to change loading behavior
- Modify `server/server.lua` to change server-side functionality

## Additional Options

### Forced Loading Screen

To keep the loading screen shown until a specific event:

1. Set `loadscreen_manual_shutdown` to `yes` in fxmanifest.lua (already set)
2. In your game scripts, trigger a shutdown when appropriate:
   ```lua
   exports['loading-ui']:shutdown()
   ```

### Debugging

While in browser, press F8 to open the console and see debugging messages.



## Support

For issues or customization help, contact: https://discord.gg/4aedhVct69
