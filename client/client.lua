-- Loading screen client script

-- Vars
local isLoaded = false
local disableNUI = true
local loadingTimeout = 30000 -- 30 second timeout for loading
local startTime = GetGameTimer()

-- Utility function to safely encode JSON
local function safeJsonEncode(data)
    local success, result = pcall(json.encode, data)
    return success and result or '{}'
end

-- Utility function to send loading screen message
local function sendLoadingMessage(status, text)
    SendLoadingScreenMessage(safeJsonEncode({
        type = "loadingStatus",
        status = status,
        text = text
    }))
end

-- Main thread
Citizen.CreateThread(function()
    -- Wait until client is loaded into the game with timeout
    while not NetworkIsSessionStarted() do
        if GetGameTimer() - startTime > loadingTimeout then
            sendLoadingMessage(100, "Connection timeout. Please restart the game.")
            return
        end
        Wait(100) -- Reduced wait time for better responsiveness
    end
    
    -- Emit loading status to the NUI
    sendLoadingMessage(100, "Connecting to the server...")
    
    -- Optimized loading sequence
    Wait(100)
    ShutdownLoadingScreen()
    Wait(1000)
    
    -- Mark as loaded and handle post-loading actions
    isLoaded = true
    DoScreenFadeIn(500)
    
    -- Cleanup after loading
    if disableNUI then
        Wait(2000)
        ShutdownLoadingScreenNui()
    end
end)

-- Handle setting waypoints from the loading screen map
RegisterNUICallback('setWaypoint', function(data, cb)
    if not data or not data.x or not data.y then
        cb({ success = false, error = "Invalid coordinates" })
        return
    end
    
    local success = pcall(function()
        SetNewWaypoint(data.x, data.y)
    end)
    
    cb({ success = success })
end)

-- Handle player agreeing to rules
RegisterNUICallback('rulesAgreed', function(data, cb)
    if not data or not data.playerName then
        cb({ success = false, error = "Invalid player name" })
        return
    end
    
    TriggerServerEvent('loading-ui:rulesAgreed', data.playerName)
    cb({ success = true })
end)

-- Handle connection analysis with caching
local cachedServerData = nil
local lastDataUpdate = 0
local DATA_CACHE_TIME = 5000 -- 5 seconds cache

-- Handle connection analysis
RegisterNUICallback('getServerData', function(data, cb)
    local currentTime = GetGameTimer()
    
    -- Return cached data if it's still valid
    if cachedServerData and (currentTime - lastDataUpdate) < DATA_CACHE_TIME then
        cb(cachedServerData)
        return
    end
    
    -- Collect fresh server data
    local success, result = pcall(function()
        return {
            players = GetActivePlayers(),
            maxPlayers = GetConvarInt('sv_maxclients', 64),
            uptime = "6h 23m", -- This should be fetched from server
            serverLoad = math.random(30, 70), -- This should be actual server load
            statistics = {
                registeredPlayers = 3500,
                activeCalls = 32,
                pendingReports = 4,
                activeJobs = 75
            }
        }
    end)
    
    if success then
        cachedServerData = result
        lastDataUpdate = currentTime
        cb(result)
    else
        cb({ error = "Failed to fetch server data" })
    end
end)

-- Get player name callback with error handling
RegisterNUICallback('getPlayerName', function(data, cb)
    local success, playerName = pcall(GetPlayerName, PlayerId())
    cb({ name = success and (playerName or "Citizen") or "Citizen" })
end)

-- Cleanup on resource stop
AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        if not disableNUI then
            ShutdownLoadingScreenNui()
        end
    end
end) 