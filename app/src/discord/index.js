import axios from 'axios';
import config from '../config/index.js';
import urljoin from 'url-join';

export async function editInteractionResponse(interaction, newResponse) {
  const url = `/webhooks/${config.appId}/${interaction.token}/messages/@original`;
  await axios.patch(urljoin(config.discordBaseUrl, url), newResponse.data, {
    headers: { Authorization: config.discordAuth }
  });
}

export async function getUserById(userId) {
  const url = `/users/${userId}`;
  const res = await axios.get(urljoin(config.discordBaseUrl, url), {
    headers: { Authorization: config.discordAuth }
  });
  return res.data;
}
