import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

const scopes = ['identify', 'guilds'].join(' ')

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {params: {scope: scopes}},
      userinfo: "https://discord.com/api/users/@me"
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      console.log("user:", user)
      session.accessToken = token.accessToken
      session.user.id = token.id
      session.user.discriminator = token.discriminator
      return session
    },
    async jwt({ token, account, profile }) {
      console.log("profile", profile)
      console.log("token", token)
      console.log("account", account)
      if (account) {
        token.accessToken = account.access_token
        token.id = profile.id
        token.discriminator = profile.discriminator
      }
      return token
    }
  }
}

export default NextAuth(authOptions)