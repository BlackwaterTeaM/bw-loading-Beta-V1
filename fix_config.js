// Full configuration generator to simulate the server.lua function
const fs = require('fs');

try {
    // Read config.lua file
    const configLua = fs.readFileSync('./config.lua', 'utf8');
    console.log('Reading config.lua file...');
    
    // Function to extract Lua table values
    function extractLuaTable(content, tableName) {
        // Create regex to find the table
        const tableRegex = new RegExp(`${tableName}\\s*=\\s*{([\\s\\S]*?)(?=\\},)`, 'g');
        const match = tableRegex.exec(content);
        if (!match) return null;
        return match[1].trim();
    }
    
    // Function to extract all staff members
    function extractStaff(content) {
        const staffStr = extractLuaTable(content, 'Staff');
        if (!staffStr) return [];
        
        const staff = [];
        const staffRegex = /{([^}]+)}/g;
        let match;
        
        while ((match = staffRegex.exec(staffStr)) !== null) {
            const staffBlock = match[1];
            const nameMatch = /Name\s*=\s*"([^"]+)"/.exec(staffBlock);
            const roleMatch = /Role\s*=\s*"([^"]+)"/.exec(staffBlock);
            const avatarMatch = /Avatar\s*=\s*"([^"]+)"/.exec(staffBlock);
            
            if (nameMatch && roleMatch && avatarMatch) {
                staff.push({
                    name: nameMatch[1],
                    role: roleMatch[1],
                    avatar: avatarMatch[1]
                });
            }
        }
        
        return staff;
    }
    
    // Function to extract links
    function extractLinks(content) {
        const linksStr = extractLuaTable(content, 'Links');
        if (!linksStr) return null;
        
        const links = {};
        const linkRegex = /(\w+)\s*=\s*"([^"]+)"/g;
        let match;
        
        while ((match = linkRegex.exec(linksStr)) !== null) {
            const key = match[1].toLowerCase(); // Convert to lowercase for JS
            const value = match[2];
            links[key] = value;
        }
        
        return links;
    }
    
    // Function to extract server info
    function extractServerInfo(content) {
        const serverInfoStr = extractLuaTable(content, 'ServerInfo');
        if (!serverInfoStr) return null;
        
        const serverInfo = {};
        const infoRegex = /(\w+)\s*=\s*"([^"]+)"/g;
        let match;
        
        while ((match = infoRegex.exec(serverInfoStr)) !== null) {
            const key = match[1].toLowerCase(); // Convert to lowercase for JS
            const value = match[2];
            serverInfo[key] = value;
        }
        
        return serverInfo;
    }
    
    // Function to extract all jobs
    function extractJobs(content) {
        const jobsStr = extractLuaTable(content, 'Jobs');
        if (!jobsStr) return [];
        
        const jobs = [];
        const jobRegex = /{([^}]+)}/g;
        let match;
        
        while ((match = jobRegex.exec(jobsStr)) !== null) {
            const jobBlock = match[1];
            const nameMatch = /Name\s*=\s*"([^"]+)"/.exec(jobBlock);
            const statusMatch = /Status\s*=\s*"([^"]+)"/.exec(jobBlock);
            const iconMatch = /Icon\s*=\s*"([^"]+)"/.exec(jobBlock);
            
            if (nameMatch && statusMatch && iconMatch) {
                jobs.push({
                    name: nameMatch[1],
                    status: statusMatch[1],
                    icon: iconMatch[1]
                });
            }
        }
        
        return jobs;
    }
    
    // Function to extract all rule sections
    function extractRules(content) {
        // First extract the Sections block
        const rulesStr = content.match(/Rules\s*=\s*{\s*Sections\s*=\s*{([\s\S]*?)(?=\s*}\s*})/);
        if (!rulesStr) return [];
        
        const sections = [];
        const sectionRegex = /{([^{]*?Title\s*=\s*"[^"]+",\s*Rules\s*=\s*{[\s\S]*?})}/g;
        let match;
        
        while ((match = sectionRegex.exec(rulesStr[1])) !== null) {
            const sectionBlock = match[1];
            const titleMatch = /Title\s*=\s*"([^"]+)"/.exec(sectionBlock);
            
            if (titleMatch) {
                const section = {
                    title: titleMatch[1],
                    rules: []
                };
                
                // Extract rules
                const rulesMatch = sectionBlock.match(/Rules\s*=\s*{([\s\S]*?)}/);
                if (rulesMatch) {
                    const ruleRegex = /"([^"]+)"/g;
                    let ruleMatch;
                    
                    while ((ruleMatch = ruleRegex.exec(rulesMatch[1])) !== null) {
                        section.rules.push(ruleMatch[1]);
                    }
                }
                
                sections.push(section);
            }
        }
        
        return sections;
    }
    
    // Extract server info
    const serverName = configLua.match(/Name\s*=\s*"([^"]+)"/)[1];
    const serverSubtitle = configLua.match(/Subtitle\s*=\s*"([^"]+)"/)[1];
    const serverDesc = configLua.match(/Description\s*=\s*"([^"]+)"/)[1];
    const serverLogo = configLua.match(/Logo\s*=\s*"([^"]+)"/)[1];
    const serverMaxPlayers = configLua.match(/MaxPlayers\s*=\s*(\d+)/)[1];
    
    // Extract media info
    const bgVideo = configLua.match(/BackgroundVideo\s*=\s*"([^"]+)"/)[1];
    const introVideo = configLua.match(/IntroVideo\s*=\s*"([^"]+)"/)[1];
    const uiSound = configLua.match(/UISound\s*=\s*"([^"]+)"/)[1];
    
    // Extract links, server info, staff, jobs, and rules
    const links = extractLinks(configLua);
    const serverInfo = extractServerInfo(configLua);
    const staff = extractStaff(configLua);
    const jobs = extractJobs(configLua);
    const ruleSections = extractRules(configLua);
    
    // Create the new JavaScript config
    let newConfig = `// Auto-generated from config.lua - Do not edit directly
const LOADING_CONFIG = {
    // Server Information
    server: {
        name: "${serverName}", // Server name that displays in various places
        subtitle: "${serverSubtitle}", // Tagline under server name
        description: "${serverDesc}",
        logo: "${serverLogo}", // Path to your server logo
        maxPlayers: ${serverMaxPlayers}
    },
    
    // Media Elements
    media: {
        backgroundVideo: "${bgVideo}", // Main background video
        introVideo: "${introVideo}", // Intro cinematic video
        backgroundMusic: [
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
        ],
        uiSound: "${uiSound}" // UI interaction sound
    },
    
    // Links & Social Media
    links: {
        discord: "${links.discord}",
        website: "${links.website}",
        store: "${links.store}",
        teamspeak: "${links.teamspeak}",
        twitter: "${links.twitter}",
        instagram: "${links.instagram}",
        youtube: "${links.youtube}"
    },
    
    // Server Info Section
    serverInfo: {
        ip: "${serverInfo.ip}",
        teamspeak: "${serverInfo.teamspeak}",
        owner: "${serverInfo.owner}",
        founded: "${serverInfo.founded}",
        location: "${serverInfo.location}"
    },
    
    // Staff Members
    staff: [
`;
    
    // Add staff members
    staff.forEach((member, index) => {
        newConfig += `        {
            name: "${member.name}",
            role: "${member.role}",
            avatar: "${member.avatar}"
        }${index < staff.length - 1 ? ',' : ''}\n`;
    });
    
    newConfig += `    ],
    
    // Job Status
    jobs: [
`;
    
    // Add jobs
    jobs.forEach((job, index) => {
        newConfig += `        { name: "${job.name}", status: "${job.status}", icon: "${job.icon}" }${index < jobs.length - 1 ? ',' : ''}\n`;
    });
    
    newConfig += `    ],
    
    // Rules Configuration
    rules: {
        sections: [
`;
    
    // Add rule sections
    ruleSections.forEach((section, sIndex) => {
        newConfig += `            {
                title: "${section.title}",
                rules: [
`;
        
        // Add rules
        section.rules.forEach((rule, rIndex) => {
            newConfig += `                    "${rule}"${rIndex < section.rules.length - 1 ? ',' : ''}\n`;
        });
        
        newConfig += `                ]
            }${sIndex < ruleSections.length - 1 ? ',' : ''}\n`;
    });
    
    newConfig += `        ]
    },
    
    // Visual Theme Settings
    theme: {
        default: "dark", // Options: dark, light, neon
        allowUserChange: true,
        highContrast: false,
        motionEffects: true,
        weatherEffects: true
    }
};`;
    
    // Write the new config.js file
    fs.writeFileSync('./html/config.js', newConfig);
    
    console.log('Successfully updated config.js with all values from config.lua!');
    console.log(`Server name: ${serverName}`);
    console.log(`Links updated: ${links.discord}`);
    console.log(`Server owner: ${serverInfo.owner}`);
    console.log(`Staff count: ${staff.length}`);
    console.log(`Jobs count: ${jobs.length}`);
    console.log(`Rule sections: ${ruleSections.length}`);
    
} catch (err) {
    console.error('ERROR:', err);
} 