import 'next-auth';

declare module 'next-auth' {
  interface Session {
    token?: string;
    user: {
      id: string;
      email: string;
      nome: string;
    };
  }

  interface User {
    id: string;
    email: string;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accessToken?: string;
  }
}