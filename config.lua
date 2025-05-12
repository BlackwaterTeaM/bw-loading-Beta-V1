-- FiveM Loading Screen Configuration

Config = {
    -- Server Information
    Server = {
        Name = "BlackWater", -- Server name that displays in various places
        Subtitle = "BlackWater Roleplay Experience", -- Tagline under server name
        Description = "Join Los Santos' premier roleplay community for an immersive experience with custom scripts, active staff, and regular events.",
        Logo = "img/logo.png", -- Path to your server logo
        MaxPlayers = 64
    },
    
    -- Media Elements
    Media = {
        BackgroundVideo = "video/background.mp4", -- Main background video
        IntroVideo = "video/Loading-Screen-Cinematic.webm", -- Intro cinematic video
        BackgroundMusic = {
            {
                Name = "Night City",
                Artist = "REL",
                Source = "audio/track1.mp3", 
                Artwork = "img/logo.png",
                Duration = 186 -- Duration in seconds
            },
            {
                Name = "Sunset Drive",
                Artist = "REL",
                Source = "audio/track2.mp3", 
                Artwork = "img/logo.png",
                Duration = 174 -- Duration in seconds
            }
        },
        UISound = "audio/ui-click.mp3" -- UI interaction sound
    },
    
    -- Links & Social Media
    Links = {
        Discord = "https://discord.gg/updated-server11",
        Website = "https://updated-server.com1",
        Store = "https://store.updated-server.com1",
        Teamspeak = "ts.updated-server.com1",
        Twitter = "https://twitter.com/updated-server1",
        Instagram = "https://instagram.com/updated-server1",
        Youtube = "https://youtube.com/c/updated-server1"
    },
    
    -- Server Info Section
    ServerInfo = {
        IP = "connect play.updated-server.com",
        Teamspeak = "ts.updated-server.com1",
        Owner = "UpdatedOwner",
        Founded = "February 2024",
        Location = "Los Angeles, USA"
    },
    
    -- Staff Members
    Staff = {
        {
            Name = "Owner11 Name",
            Role = "owner11",
            Avatar = "img/staff-1.jpg"
        },
        {
            Name = "Admin1 Name",
            Role = "admin1",
            Avatar = "img/staff-2.jpg"
        },
        {
            Name = "Mod11 Name",
            Role = "moderato1r",
            Avatar = "img/staff-3.jpg"
        },
        {
            Name = "Dev11 Name",
            Role = "developer1",
            Avatar = "img/staff-4.jpg"
        }
    },
    
    -- Job Status
    Jobs = {
        { Name = "Police1", Status = "high", Icon = "police" },
        { Name = "EMS1", Status = "medium", Icon = "ambulance" },
        { Name = "Mechanics1", Status = "low", Icon = "mechanic" },
        { Name = "Taxi11", Status = "high", Icon = "taxi" }
    },
    
    -- Rules Configuration
    Rules = {
        Sections = {
            {
                Title = "General Rules1",
                Rules = {
                    "1No harassment, bullying, hate speech, or discrimination.",
                    "Respect all players and staff members at all times.",
                    "Do not exploit bugs or glitches. Report them to staff.",
                    "No cheating, hacking, or using unauthorized mods."
                }
            },
            {
                Title = "1Roleplay Rules",
                Rules = {
                    "1Stay in character at all times in game.",
                    "Value your life in all situations (Value of Life).",
                    "No random deathmatch (RDM) or vehicle deathmatch (VDM).",
                    "No combat logging or rage quitting during roleplay scenarios."
                }
            }
        }
    },
    
    -- Visual Theme Settings
    Theme = {
        Default = "dark", -- Options: dark, light, neon
        AllowUserChange = true,
        HighContrast = false,
        MotionEffects = true,
        WeatherEffects = true
    }
} 