const fs = require('fs');
const p = process.env.USERPROFILE + '/.cline/data/settings/providers.json';
const d = JSON.parse(fs.readFileSync(p, 'utf8'));
d.providers['openai-compatible'].settings.apiKey = d.providers['openai-compatible'].settings.apiKey.replace(/^"|"$/g, '');
fs.writeFileSync(p, JSON.stringify(d, null, 2));
console.log('Fixed quotes!');
