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
      return session
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = profile.id
        token.discriminator = profile.discriminator
        token.guild = {
          id: account.guild.id,
          name: account.guild.name,
          icon: account.guild.icon,
          roles: account.guild.roles.filter((r) => r.name != "@everyone" && !r.tags).map((r) => {
            return {id: r.id, name: r.name, color: r.color }
          })
        }
      }
      return token
    }
  }
}

export default NextAuth(authOptions)