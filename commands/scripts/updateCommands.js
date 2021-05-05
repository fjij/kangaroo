#!node

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const APP_ID = process.env.APP_ID;
const GUILD_ID = process.env.GUILD_ID;
const AUTHORIZATION = process.env.AUTHORIZATION;
const URL = `https://discord.com/api/v8/applications/${APP_ID}/guilds/${GUILD_ID}/commands`;
const DEFS_DIR = './definitions';

async function updateCommandsGuild() {
  const names = fs.readdirSync(DEFS_DIR);

  for(let i = 0; i < names.length; i++) {
    const filename = path.join(DEFS_DIR, names[i]);
    const command = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }));

    if (!command.name) {
      throw new Error(`Command found in ${filename} is missing a name`);
    }
    if (!command.description) {
      throw new Error(`Command found in ${filename} is missing a description`);
    }

    console.log(`Posting ${filename}...`);

    const res = await axios.post(URL, command, {
      headers: {
        Authorization: AUTHORIZATION,
        "Content-Type": "application/json"
      },
    });
    if (res.status === 200) {
      console.log('OK');
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

updateCommandsGuild().then(() => {
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
