import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    '/chat/:path*',
    '/api/conversas/:path*',
    '/api/mensagens/:path*',
    '/api/imagens/:path*',
  ],
};