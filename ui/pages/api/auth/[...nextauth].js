import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

const scopes = ['identify', 'guilds', 'bot'].join(' ')

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: scopes, permissions: 8 } },
      userinfo: "https://discord.com/api/users/@me"
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.accessToken = token.accessToken
      session.user.id = token.id
      session.user.discriminator = token.discriminator
      session.guild = token.guild
      session.tokenType = token.tokenType
      return session
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = profile.id
        token.discriminator = profile.discriminator
        token.tokenType = account.token_type
        token.guild = account.guild
      }
      return token
    }
  }
}

export default NextAuth(authOptions)