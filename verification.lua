-- FiveM Loading Screen Config Verification Tool
-- Run this with 'ensure loading-ui' and then execute this file

local resourceName = "loading-ui"

local function LoadConfig()
    print("^3Loading config.lua...")
    
    -- Reset Config in case it exists already
    Config = nil
    
    -- Load the file content
    local configFile = LoadResourceFile(resourceName, "config.lua")
    if not configFile then
        print("^1ERROR: config.lua file not found")
        return nil
    end
    
    -- Parse the file
    local configFunc, err = load(configFile, "config.lua", "t", _ENV)
    if not configFunc then
        print("^1ERROR: Failed to parse config.lua: " .. tostring(err))
        return nil
    end
    
    -- Execute the config
    local success, result = pcall(configFunc)
    if not success then
        print("^1ERROR: Failed to execute config.lua: " .. tostring(result))
        return nil
    end
    
    -- Check if Config was created
    if not Config then
        print("^1ERROR: Config table not defined in config.lua")
        return nil
    end
    
    return Config
end

local function VerifyJSGeneration(config)
    print("^3Verifying JavaScript generation...")
    
    -- Simple templating to test generation
    local jsName = 'name: "' .. config.Server.Name .. '"'
    
    -- Display what we expect to find in the generated JS
    print("^3The following should appear in html/config.js:")
    print("^2" .. jsName)
    
    -- Read the generated JS file to confirm the name was properly written
    local jsFile = io.open(GetResourcePath(resourceName) .. "/html/config.js", "r")
    if not jsFile then
        print("^1ERROR: Could not open html/config.js file")
        return false
    end
    
    local content = jsFile:read("*all")
    jsFile:close()
    
    -- Search for the server name in the JS file
    if string.find(content, config.Server.Name, 1, true) then
        print("^2SUCCESS: Server name found in the generated config.js!")
        return true
    else
        print("^1ERROR: Server name not found in the generated config.js!")
        return false
    end
end

local function VerifyConfig()
    print("^3Starting Config Verification")
    print("^3======================================")
    
    -- Load the config
    local config = LoadConfig()
    if not config then return end
    
    -- Display loaded values
    print("^3Loaded Server Name: ^2" .. config.Server.Name)
    print("^3Loaded Subtitle: ^2" .. config.Server.Subtitle)
    
    -- Verify JS generation
    local jsSuccess = VerifyJSGeneration(config)
    
    -- Summary
    print("^3======================================")
    if jsSuccess then
        print("^2VERIFICATION SUCCESSFUL: Config values are properly transferred to JavaScript!")
        print("^3When you load the page, you should see: ^2" .. config.Server.Name)
    else
        print("^1VERIFICATION FAILED: There's an issue with transferring config values to JavaScript.")
    end
    print("^3======================================")
end

VerifyConfig() 