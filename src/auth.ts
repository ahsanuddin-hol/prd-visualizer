
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    trustHost: true,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const parsedCredentials = credentials

                if (parsedCredentials.username === process.env.AUTH_USER && parsedCredentials.password === process.env.AUTH_PASSWORD) {
                    return { id: "1", name: "Admin", email: "admin@example.com" }
                }

                return null
            },
        }),
    ],
})
