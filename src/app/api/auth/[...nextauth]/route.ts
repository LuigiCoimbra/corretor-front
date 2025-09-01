import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        senha: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials, req): Promise<any> {
        if (!credentials?.email || !credentials?.senha) {
          throw new Error('Email e senha são necessários');
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                senha: credentials.senha,
              }),
            }
          );

          const data = await response.json();
          console.log(data)
          if (!response.ok) {
            throw new Error(data.message || 'Erro na autenticação');
          }

          return {
            id: data.usuario.id,
            email: data.usuario.email,
            nome: data.usuario.nome,
            accessToken: data.token,
          };
        } catch (error) {
          throw new Error('Erro na autenticação');
        }
      }
    })
  ],
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          nome: token.nome,
        },
        token: token.accessToken,
      };
    },
  },
});

export { handler as GET, handler as POST };