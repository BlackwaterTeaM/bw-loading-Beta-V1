// Simple script to generate config.js from config.lua
const fs = require('fs');

// Read the config.lua file
try {
    const configLua = fs.readFileSync('./config.lua', 'utf8');
    console.log('Found config.lua file');
    
    // Function to extract a value from config.lua
    function extractFromLua(pattern) {
        const match = configLua.match(pattern);
        return match ? match[1] : null;
    }
    
    // Read the existing config.js
    const configJs = fs.readFileSync('./html/config.js', 'utf8');
    
    // Create updated config.js with all the new values
    let updatedConfigJs = configJs;
    
    // Update Server Name
    const serverName = extractFromLua(/Name\s*=\s*"([^"]+)"/);
    if (serverName) {
        updatedConfigJs = updatedConfigJs.replace(
            /name:\s*"[^"]+"/,
            `name: "${serverName}"`
        );
        console.log(`Found and updated server name: "${serverName}"`);
    }
    
    // Update Staff Names
    const ownerName = extractFromLua(/Name\s*=\s*"(Owner1[^"]+)"/);
    if (ownerName) {
        updatedConfigJs = updatedConfigJs.replace(
            /name:\s*"Owner Name"/,
            `name: "${ownerName}"`
        );
        console.log(`Updated owner name to: "${ownerName}"`);
    }
    
    const adminName = extractFromLua(/Name\s*=\s*"(Admin1[^"]+)"/);
    if (adminName) {
        updatedConfigJs = updatedConfigJs.replace(
            /name:\s*"Admin Name"/,
            `name: "${adminName}"`
        );
        console.log(`Updated admin name to: "${adminName}"`);
    }
    
    const modName = extractFromLua(/Name\s*=\s*"(Mod1[^"]+)"/);
    if (modName) {
        updatedConfigJs = updatedConfigJs.replace(
            /name:\s*"Mod Name"/,
            `name: "${modName}"`
        );
        console.log(`Updated mod name to: "${modName}"`);
    }
    
    // Update Staff Roles
    const ownerRole = extractFromLua(/Role\s*=\s*"(owner1[^"]+)"/);
    if (ownerRole) {
        updatedConfigJs = updatedConfigJs.replace(
            /role:\s*"owner"/,
            `role: "${ownerRole}"`
        );
        console.log(`Updated owner role to: "${ownerRole}"`);
    }
    
    // Update Jobs
    const policeJob = extractFromLua(/Name\s*=\s*"(Police1[^"]+)"/);
    if (policeJob) {
        updatedConfigJs = updatedConfigJs.replace(
            /name:\s*"Police"/,
            `name: "${policeJob}"`
        );
        console.log(`Updated police job to: "${policeJob}"`);
    }
    
    const emsJob = extractFromLua(/Name\s*=\s*"(EMS1[^"]+)"/);
    if (emsJob) {
        updatedConfigJs = updatedConfigJs.replace(
            /name:\s*"EMS"/,
            `name: "${emsJob}"`
        );
        console.log(`Updated EMS job to: "${emsJob}"`);
    }
    
    // Update Rules
    const generalRules = extractFromLua(/Title\s*=\s*"(General Rules1[^"]+)"/);
    if (generalRules) {
        updatedConfigJs = updatedConfigJs.replace(
            /title:\s*"General Rules"/,
            `title: "${generalRules}"`
        );
        console.log(`Updated general rules title to: "${generalRules}"`);
    }
    
    const ruleText = extractFromLua(/Rules\s*=\s*{\s*"(1No[^"]+)"/);
    if (ruleText) {
        updatedConfigJs = updatedConfigJs.replace(
            /"No harassment[^"]+"/,
            `"${ruleText}"`
        );
        console.log(`Updated first rule to: "${ruleText}"`);
    }
    
    // Write the updated config.js
    fs.writeFileSync('./html/config.js', updatedConfigJs);
    console.log('Config.js has been updated with all the new values!');
    
    // Verify the changes
    const newConfigJs = fs.readFileSync('./html/config.js', 'utf8');
    let successCount = 0;
    let failCount = 0;
    
    // Check for each value
    [serverName, ownerName, adminName, modName, ownerRole, policeJob, emsJob, generalRules, ruleText].forEach(val => {
        if (val && newConfigJs.includes(val)) {
            successCount++;
        } else if (val) {
            failCount++;
            console.log(`Failed to update: ${val}`);
        }
    });
    
    console.log(`Verification complete: ${successCount} updates successful, ${failCount} failed`);
    
} catch (err) {
    console.error('ERROR:', err);
} 