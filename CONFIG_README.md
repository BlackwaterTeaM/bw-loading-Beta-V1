# FiveM Loading Screen Lua Configuration System

This loading screen now supports server-side configuration through a Lua config file!

## How It Works

1. You edit the `config.lua` file with your server settings
2. When the resource starts, it automatically generates the `html/config.js` file
3. The loading screen uses this JavaScript config file to customize the interface

## Advantages of Lua Configuration

- **Server-Side Configuration**: Make changes without needing to upload HTML files
- **Easier Syntax**: Lua is more familiar to FiveM server owners
- **Automatic Generation**: No need to manually update the JavaScript config
- **Console Command**: Refresh your config without restarting the server

## How to Configure

Simply edit the `config.lua` file with your settings:

```lua
Config = {
    -- Server Information
    Server = {
        Name = "Your Server Name", -- Server name that displays in various places
        Subtitle = "Your Roleplay Experience", -- Tagline under server name
        -- More settings...
    },
    
    -- Media Elements, Links, Staff, Rules, etc.
    -- ...
}
```

## Configuration Sections

### Server Info

```lua
Server = {
    Name = "My Server RP",
    Subtitle = "Premium Roleplay Experience",
    Description = "Join our server for the best RP experience!",
    Logo = "img/my-logo.png",
    MaxPlayers = 64
}
```

### Media Elements

```lua
Media = {
    BackgroundVideo = "video/my-video.mp4",
    IntroVideo = "video/my-intro.webm",
    BackgroundMusic = {
        {
            Name = "Track Name",
            Artist = "Artist Name",
            Source = "audio/my-track.mp3",
            Artwork = "img/track-cover.png",
            Duration = 180 -- Duration in seconds
        }
        -- Add more tracks...
    },
    UISound = "audio/click.mp3"
}
```

### Social Links

```lua
Links = {
    Discord = "https://discord.gg/myserver",
    Website = "https://myserver.com",
    Store = "https://store.myserver.com"
    -- Add other links...
}
```

### Staff Members

```lua
Staff = {
    {
        Name = "Staff Name",
        Role = "owner", -- Options: owner, admin, moderator, developer, etc.
        Avatar = "img/staff-avatar.jpg"
    }
    -- Add more staff members...
}
```

## Refreshing the Config

You can refresh the configuration without restarting your server using the console command:

```
refreshloadingconfig
```

This will regenerate the JavaScript config file based on your current `config.lua` settings.

## Verifying Your Changes Work

To ensure your changes are working correctly:

1. Edit the `config.lua` file (for example, change the Server.Name)
2. Restart the resource with `ensure loading-ui` or run the `refreshloadingconfig` command in your server console 
3. Check the server console for the confirmation message: "Loading Screen: Generated config.js from config.lua"
4. Verify the generated `html/config.js` file has your new values
5. Test the loading screen in a browser or connect to your server

### Using the Verification Script

You can also use the included verification script to check if your config changes are properly transferred:

1. Make your changes to `config.lua`
2. Restart the resource with `ensure loading-ui` or run the `refreshloadingconfig` command
3. In your server console, execute the verification script:
   ```
   start loading-ui
   exec verification.lua
   ```
4. The script will verify that your changes appear in the generated JavaScript file

The verification script will check:
- If your config.lua can be loaded
- If the server name appears in the generated JavaScript file
- If the config values are correctly formatted

## Using from Other Resources

You can also refresh the config from other resources using the export:

```lua
exports['loading-ui']:refreshConfig()
```

This is useful if you have a server management panel or other systems that need to update the loading screen configuration dynamically.

## Troubleshooting

If your configuration isn't applying correctly:

1. Check the server console for any error messages during resource start
2. Make sure your `config.lua` file has valid Lua syntax
3. Try the `refreshloadingconfig` command to manually regenerate the config
4. Look at the generated `html/config.js` file to verify it has the correct content
5. Use the verification script to check for issues
6. Try clearing your browser cache (Ctrl+F5) when testing

### Common Issues

- **Quotes in Text**: If you use quotes in your text, make sure to escape them: `Name = "My \"Cool\" Server"`
- **File Paths**: Double-check all file paths, especially for custom media files
- **JS Not Updating**: If your config.js doesn't update, check server permissions or manually delete it before refresh
- **Module Not Found Error**: If you see "module not found" errors, restart your server completely or try the fix in the updated server.lua file

## Advanced Integration

For advanced users who want to integrate with a database or admin panel:

1. Create your own resource that modifies the `config.lua` file dynamically
2. Call the `refreshConfig` export after updating the file
3. Your changes will be applied the next time a player connects 