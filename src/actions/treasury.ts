"use server";

import { db } from "@/db";
import { treasuries, treasuryMembers, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function createTreasury(name: string, description: string, contractAddress: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const treasuryId = randomUUID();
  
  try {
    // 1. Create the treasury
    await db.insert(treasuries).values({
      id: treasuryId,
      name,
      description,
      contractAddress,
    });
    
    // 2. Assign the creator as ADMIN, SIGNER, and TREASURER by default
    await db.insert(treasuryMembers).values({
      treasuryId,
      userId: session.user.id,
      roles: ["ADMIN", "SIGNER", "TREASURER"],
    });
    
    return { success: true, treasuryId };
  } catch (error: any) {
    console.error("Failed to create treasury:", error);
    throw new Error(error.message || "Failed to create treasury");
  }
}

export async function addTreasuryMember(treasuryId: string, memberAddress: string, roles: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  // 1. Verify caller is an ADMIN of this treasury
  const callerMembership = await db.query.treasuryMembers.findFirst({
    where: and(
      eq(treasuryMembers.treasuryId, treasuryId),
      eq(treasuryMembers.userId, session.user.id)
    )
  });
  
  if (!callerMembership || !callerMembership.roles.includes("ADMIN")) {
    throw new Error("Only an ADMIN can add members to this treasury.");
  }
  
  try {
    // 2. Check if the target user exists in the DB, if not, create a placeholder record
    // (This is so admins can add members before those members have even logged in for the first time)
    let targetUser = await db.query.users.findFirst({
      where: eq(users.stellarAddress, memberAddress)
    });
    
    if (!targetUser) {
      const [newUser] = await db.insert(users).values({
        id: memberAddress,
        stellarAddress: memberAddress,
        name: `User ${memberAddress.substring(0, 4)}`,
      }).returning();
      targetUser = newUser;
    }
    
    // 3. Add them to the treasury
    await db.insert(treasuryMembers).values({
      treasuryId,
      userId: targetUser.id,
      roles,
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add member:", error);
    throw new Error(error.message || "Failed to add member");
  }
}

export async function getTreasuriesForUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  // Query treasuries the user is a member of
  const memberships = await db.query.treasuryMembers.findMany({
    where: eq(treasuryMembers.userId, session.user.id),
    with: {
      treasury: true
    }
  });
  
  // @ts-ignore - Drizzle relations mapping requires schema configuration which we might not have perfectly typed yet
  // If `with` fails, we can just do a standard inner join
  
  return memberships;
}
