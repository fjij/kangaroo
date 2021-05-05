import axios from 'axios';
import config from '../config/index.js';

const baseUrl = 'https://discord.com/api/v8/';

export async function editInteractionResponse(interaction, newResponse) {
  const url = `/${config.appId}/${interaction.token}/messages/@original`;
  await axios.patch(new URL(url, baseUrl), newResponse.data);
}
