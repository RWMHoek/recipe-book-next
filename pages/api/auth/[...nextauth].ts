import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const response = await fetch(`http://localhost:3000/api/login`, {
                        method: 'POST',
                        body: JSON.stringify({...credentials}),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    const jsonResponse = await response.json();
                    if (response.ok && jsonResponse.user) {
                        return jsonResponse.user;
                    }
                    return null;
                } catch (error) {
                    console.log(error)
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }: any) {
            session.user.username = token.username;
            session.user.id = token.userId;
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.userId = user.id;
                token.username = user.username;
            }
            return token
        }
    },
    pages: {
        signIn: '/auth/login'
    }
}

export default NextAuth(authOptions);