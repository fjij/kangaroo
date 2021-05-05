import axios from 'axios';
import config from '../config/index.js';

const baseUrl = 'https://discord.com/api/v8';

export async function editInteractionResponse(interaction, newResponse) {
  const url = `/webhooks/${config.appId}/${interaction.token}/messages/@original`;
  await axios.patch(baseUrl + url, newResponse.data, {
    headers: { Authorization: config.discordAuth }
  });
}
