const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const PLAYLIST_ITEM_ENDPOINT = "https://api.spotify.com/v1/playlists";

const getAccessToken = async (refresh_token: any) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
};

export const getUsersPlaylists = async (refresh_token: any, offset: number, limit: number) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch(PLAYLISTS_ENDPOINT + "?offset=" + offset + "&limit=" + limit, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getPlaylistItems = async (refresh_token: any, playlist_id: string, offset: number, limit: number) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch(`${PLAYLIST_ITEM_ENDPOINT}/${playlist_id}/tracks?offset=${offset}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}
