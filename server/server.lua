-- Loading Screen Server Script

-- Load config
local resourceName = GetCurrentResourceName()

-- Configuration
local config = {
    -- Log when players agree to rules
    logRulesAgreement = true,
    
    -- Use these server stats in loading screen
    showServerStats = true,
    
    -- Maximum players
    maxPlayers = 64
}

-- Generate JS config from Lua config
local function GenerateJSConfig()
    -- First, load the config file directly instead of using require
    Config = {}
    local configFile = LoadResourceFile(resourceName, "config.lua")
    
    if not configFile then
        print("^1ERROR: config.lua file not found")
        return
    end
    
    -- Execute the config file content
    local configFunc, err = load(configFile, "config.lua", "t", _ENV)
    if not configFunc then
        print("^1ERROR: Failed to parse config.lua: " .. tostring(err))
        return
    end
    
    -- Execute the config
    local success, result = pcall(configFunc)
    if not success then
        print("^1ERROR: Failed to execute config.lua: " .. tostring(result))
        return
    end
    
    -- Make sure Config exists after loading
    if not Config then
        print("^1ERROR: Config table not defined in config.lua")
        return
    end
    
    -- Print server name to verify it's loaded correctly
    print("Loaded server name: " .. Config.Server.Name)
    
    -- Convert Lua config to JavaScript
    local jsConfig = [[// Auto-generated from config.lua - Do not edit directly
const LOADING_CONFIG = {
    // Server Information
    server: {
        name: "]] .. Config.Server.Name .. [[", // Server name that displays in various places
        subtitle: "]] .. Config.Server.Subtitle .. [[", // Tagline under server name
        description: "]] .. Config.Server.Description .. [[",
        logo: "]] .. Config.Server.Logo .. [[", // Path to your server logo
        maxPlayers: ]] .. Config.Server.MaxPlayers .. [[
    },
    
    // Media Elements
    media: {
        backgroundVideo: "]] .. Config.Media.BackgroundVideo .. [[", // Main background video
        introVideo: "]] .. Config.Media.IntroVideo .. [[", // Intro cinematic video
        backgroundMusic: [
]]

    -- Add each music track
    for i, track in ipairs(Config.Media.BackgroundMusic) do
        jsConfig = jsConfig .. [[            {
                name: "]] .. track.Name .. [[",
                artist: "]] .. track.Artist .. [[",
                src: "]] .. track.Source .. [[", 
                artwork: "]] .. track.Artwork .. [[",
                duration: ]] .. track.Duration .. [[ // Duration in seconds
            }]]
        
        -- Add comma for all but last item
        if i < #Config.Media.BackgroundMusic then
            jsConfig = jsConfig .. ","
        end
        
        jsConfig = jsConfig .. "\n"
    end

    -- Continue with the rest of the config
    jsConfig = jsConfig .. [[        ],
        uiSound: "]] .. Config.Media.UISound .. [[" // UI interaction sound
    },
    
    // Links & Social Media
    links: {
        discord: "]] .. Config.Links.Discord .. [[",
        website: "]] .. Config.Links.Website .. [[",
        store: "]] .. Config.Links.Store .. [[",
        teamspeak: "]] .. Config.Links.Teamspeak .. [[",
        twitter: "]] .. Config.Links.Twitter .. [[",
        instagram: "]] .. Config.Links.Instagram .. [[",
        youtube: "]] .. Config.Links.Youtube .. [["
    },
    
    // Server Info Section
    serverInfo: {
        ip: "]] .. Config.ServerInfo.IP .. [[",
        teamspeak: "]] .. Config.ServerInfo.Teamspeak .. [[",
        owner: "]] .. Config.ServerInfo.Owner .. [[",
        founded: "]] .. Config.ServerInfo.Founded .. [[",
        location: "]] .. Config.ServerInfo.Location .. [["
    },
    
    // Staff Members
    staff: [
]]

    -- Add each staff member
    for i, staff in ipairs(Config.Staff) do
        jsConfig = jsConfig .. [[        {
            name: "]] .. staff.Name .. [[",
            role: "]] .. staff.Role .. [[",
            avatar: "]] .. staff.Avatar .. [["
        }]]
        
        -- Add comma for all but last item
        if i < #Config.Staff then
            jsConfig = jsConfig .. ","
        end
        
        jsConfig = jsConfig .. "\n"
    end

    -- Add jobs
    jsConfig = jsConfig .. [[    ],
    
    // Job Status
    jobs: [
]]

    for i, job in ipairs(Config.Jobs) do
        jsConfig = jsConfig .. [[        { name: "]] .. job.Name .. [[", status: "]] .. job.Status .. [[", icon: "]] .. job.Icon .. [[" }]]
        
        -- Add comma for all but last item
        if i < #Config.Jobs then
            jsConfig = jsConfig .. ","
        end
        
        jsConfig = jsConfig .. "\n"
    end

    -- Add rules
    jsConfig = jsConfig .. [[    ],
    
    // Rules Configuration
    rules: {
        sections: [
]]

    for i, section in ipairs(Config.Rules.Sections) do
        jsConfig = jsConfig .. [[            {
                title: "]] .. section.Title .. [[",
                rules: [
]]

        for j, rule in ipairs(section.Rules) do
            jsConfig = jsConfig .. [[                    "]] .. rule .. [["]]
            
            -- Add comma for all but last item
            if j < #section.Rules then
                jsConfig = jsConfig .. ","
            end
            
            jsConfig = jsConfig .. "\n"
        end

        jsConfig = jsConfig .. [[                ]
            }]]
        
        -- Add comma for all but last item
        if i < #Config.Rules.Sections then
            jsConfig = jsConfig .. ","
        end
        
        jsConfig = jsConfig .. "\n"
    end

    -- Finish the config
    jsConfig = jsConfig .. [[        ]
    },
    
    // Visual Theme Settings
    theme: {
        default: "]] .. Config.Theme.Default .. [[", // Options: dark, light, neon
        allowUserChange: ]] .. (Config.Theme.AllowUserChange and "true" or "false") .. [[,
        highContrast: ]] .. (Config.Theme.HighContrast and "true" or "false") .. [[,
        motionEffects: ]] .. (Config.Theme.MotionEffects and "true" or "false") .. [[,
        weatherEffects: ]] .. (Config.Theme.WeatherEffects and "true" or "false") .. [[
    }
};]]

    -- Write to file (using io.open instead of SaveResourceFile)
    local jsFile = io.open(GetResourcePath(resourceName) .. "/html/config.js", "w")
    if not jsFile then
        print("^1ERROR: Could not open html/config.js for writing")
        return
    end
    
    jsFile:write(jsConfig)
    jsFile:close()
    
    print("^2Successfully generated config.js from config.lua")
    print("^2Updated server name to: " .. Config.Server.Name)
    
    -- Print some of the updated values to verify
    print("^2Updated owner name to: " .. Config.Staff[1].Name)
    print("^2Updated police job to: " .. Config.Jobs[1].Name)
    print("^2Updated general rules to: " .. Config.Rules.Sections[1].Title)
end

-- Generate the JS config when resource starts
AddEventHandler('onResourceStart', function(resource)
    if resource == resourceName then
        GenerateJSConfig()
    end
end)

-- Track when players agree to rules
RegisterNetEvent('loading-ui:rulesAgreed')
AddEventHandler('loading-ui:rulesAgreed', function(playerName)
    local src = source
    local identifier = GetPlayerIdentifier(src, 0) or "unknown"
    
    if config.logRulesAgreement then
        print(string.format("Player %s (%s) agreed to the server rules", GetPlayerName(src), identifier))
    end
    
    -- Here you could save this to a database or trigger other events
    -- For example:
    -- exports.oxmysql:execute('INSERT INTO rules_agreements (identifier, name, timestamp) VALUES (?, ?, ?)',
    --     {identifier, playerName, os.time()})
end)

-- Allow other resources to check if a player has agreed to rules
-- (You would need to implement the database check here)
exports('hasAgreedToRules', function(source)
    local identifier = GetPlayerIdentifier(source, 0) or "unknown"
    
    -- Example database check:
    -- local result = exports.oxmysql:executeSync('SELECT * FROM rules_agreements WHERE identifier = ? LIMIT 1',
    --     {identifier})
    -- return result and #result > 0 or false
    
    -- For this example, we'll just return true
    return true
end)

-- Refresh config command
RegisterCommand('refreshloadingconfig', function(source, args, rawCommand)
    if source == 0 then -- Only from console/server
        GenerateJSConfig()
        print("^2Loading Screen: Config refreshed")
    end
end, true)

-- Export to refresh config from other resources
exports('refreshConfig', function()
    GenerateJSConfig()
    return true
end) 