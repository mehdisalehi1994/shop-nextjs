import connectToDatabase from "@/app/lib/db";
import Otp from "@/models/Otp";
import Users from "@/models/Users";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const { phone, code } = credentials;
        const otp = await Otp.findOne({ phone, code });
        if (!otp || otp.expiresAt < new Date()) {
          throw new Error("کد نامعتبر یا منقضی شده است، لطفا مجددا سعی کنید");
        }

        const user = await Users.findOne({ phone });
        if (!user) {
          throw new new Error("کاربر یافت نشد")();
        }

        await Otp.deleteOne({ _id: otp._id });

        return {
          id: user._id.toString(),
          phone: user.phone,
          name: user.name,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.phone = user.phone;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        phone: token.phone,
        isAdmin: token.isAdmin,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
