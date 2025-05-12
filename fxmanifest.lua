fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Blackwater Team'
description 'Premium FiveM Loading Screen UI (https://discord.gg/4aedhVct69)'
version '1.0.0'

-- Loading screen HTML page
loadscreen 'html/index.html'

-- Main configuration
shared_script 'config.lua'

-- Verification tool
server_script 'verification.lua'

-- HTML/CSS/JS files
files {
    -- Core files
    'html/index.html',
    'html/style.css',
    'html/fn.js',
    'html/config.js',
    
    -- Media files
    'html/video/Loading-Screen-Cinematic.webm',
    'html/video/background.mp4',
    
    -- Audio files
    'html/audio/track1.mp3',
    'html/audio/track2.mp3',
    'html/audio/ui-click.mp3',
    
    -- Image files
    'html/img/logo.png',
    'html/img/community-event.jpg',
    'html/img/staff-1.jpg',
    'html/img/staff-2.jpg',
    'html/img/staff-3.jpg',
    'html/img/staff-4.jpg',
    
    -- SVG location markers
    'html/img/sandy.svg',
    'html/img/vinewood.svg',
    'html/img/vespucci.svg',
    'html/img/downtown.svg',
    'html/img/impound-garage.svg',
    'html/img/lspd-hq.svg',
    'html/img/maze-bank.svg',
    'html/img/ls-customs.svg',
    'html/img/pillbox-hospital.svg',
    'html/img/diamond-casino.svg'
}

-- Server scripts
server_scripts {
    'server/server.lua',
}

-- Client scripts
client_scripts {
    'client/client.lua'
}

-- Documentation files (not loaded by FiveM, just for reference)
file 'README.md'
file 'CONFIG_README.md'
file 'CONFIGURATION_GUIDE.md'

-- Manual shutdown (to control when loading screen ends)
loadscreen_manual_shutdown 'yes'

-- Allow cursor in loading screen
loadscreen_cursor 'yes'

-- Console command for refreshing the config
dependency 'screenshot-basic' -- If you use this for console commands 