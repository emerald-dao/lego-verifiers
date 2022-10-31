export default async function handler(req, res) {
    const { code } = req.query;
    if (code) {
      try {
        const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
          method: 'POST',
          body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: `http://localhost:3000`,
            scope: 'identify',
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        const oauthData = await oauthResult.json();
  
        let userData = await fetch('https://discord.com/api/users/@me', {
          headers: {
            authorization: `${oauthData.token_type} ${oauthData.access_token}`,
          },
        });
        let userGuilds = await fetch('https://discord.com/api/users/@me/guilds', {
          headers: {
            authorization: `${oauthData.token_type} ${oauthData.access_token}`,
          },
        });
        userData = await userData.json();
        userGuilds = await userGuilds.json();
        res.json({ userData, userGuilds, oauthData });
      } catch (error) {
        res.status(500).json({ message: error })
      }
    }
  };