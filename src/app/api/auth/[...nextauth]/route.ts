import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { cert, getApps, initializeApp as initializeAdminApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";

// Initialize Firebase Admin SDK
const adminApp = getApps().length === 0
  ? initializeAdminApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  : getApps()[0];

const adminAuth = getAdminAuth(adminApp);

// Initializing Firebase client SDK
const clientApp = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

const auth = getAuth(clientApp);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      // checking if user exists in firebase
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }
// making request to firebase to check if user exists
        try {
          const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
          const user = userCredential.user;
//  extracting user data from firebase user object
          return {
            id: user.uid,
            email: user.email,
            name: user.displayName,
          };
        } catch (error: any) {
          console.error("Firebase authentication error:", error);
          
          // Handling Firebase authentication errors
          if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            throw new Error("Invalid email or password");
          } else if (error.code === 'auth/too-many-requests') {
            throw new Error("Too many failed login attempts. Please try again later.");
          } else {
            throw new Error("An error occurred during login. Please try again.");
          }
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        
        // Create a custom Firebase token
        const firebaseToken = await adminAuth.createCustomToken(user.id);
        token.firebaseToken = firebaseToken;
      }
      return token;
    },
    // checks if user is already logged in with firebase
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.firebaseToken = token.firebaseToken as string;
      }
      return session;
    },
  },
  // this is the custom auth page
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };