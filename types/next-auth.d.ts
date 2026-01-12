// next-auth.d.ts
import "next-auth";

// Extend the default session object
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      user_role: string;
    };
  }
}

// Extend the default JWT object
declare module "next-auth/jwt" {
  interface JWT {
    user_role: string;
  }
}
