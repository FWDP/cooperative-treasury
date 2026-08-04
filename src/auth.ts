import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { Keypair, TransactionBuilder, Networks, Transaction } from "@stellar/stellar-sdk"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Stellar Wallet",
      credentials: {
        address: { label: "Address", type: "text" },
        signature: { label: "Signature", type: "text" },
        message: { label: "Message", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.address || !credentials?.signature || !credentials?.message) {
          return null
        }
        
        try {
          const address = credentials.address as string;
          const signature = credentials.signature as string;
          const message = credentials.message as string;
          
          const keypair = Keypair.fromPublicKey(address);
          
          let isValid = false;
          try {
            const tx = TransactionBuilder.fromXDR(signature, Networks.TESTNET) as Transaction;
            const hash = tx.hash();
            const txSignature = tx.signatures[0].signature();
            isValid = keypair.verify(hash, txSignature);
          } catch (e) {
            console.error("Verification error:", e);
          }
          
          if (!isValid) {
            return null;
          }
          
          // 2. Check if user exists in TursoDB
          let user = await db.query.users.findFirst({
            where: eq(users.stellarAddress, address),
          });
          
          // 3. Create user if they don't exist
          if (!user) {
            const [newUser] = await db.insert(users).values({
              id: address, // Using address as ID for simplicity
              stellarAddress: address,
              name: `User ${address.substring(0, 4)}`,
            }).returning();
            user = newUser;
          }
          
          return { id: user.id, name: user.name, address: user.stellarAddress }
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.address = (user as any).address;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.address) {
        (session.user as any).address = token.address;
      }
      return session;
    }
  },
  session: { strategy: "jwt" }
})
