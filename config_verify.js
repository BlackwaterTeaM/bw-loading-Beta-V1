// Simple config verification script
const fs = require('fs');

// Read the config.js file
try {
    const configJs = fs.readFileSync('./html/config.js', 'utf8');
    console.log('Found config.js file');
    
    // Check if our test server name is in the file
    if (configJs.includes('TEST CONFIG WORKS')) {
        console.log('SUCCESS: Config.lua values are correctly reflected in config.js!');
        console.log('Server name has been updated to "TEST CONFIG WORKS"');
    } else {
        console.log('ERROR: Config.lua changes are not reflected in config.js.');
        console.log('Server name was not updated. The config generation may not be working.');
    }
} catch (err) {
    console.error('ERROR: Could not read the config.js file', err);
} 