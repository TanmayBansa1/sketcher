"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import db from "@repo/db/prisma";

export async function syncUser() {
  try {
    const { userId:clerkId } = await auth();
    
    if (!clerkId) {
      throw new Error("Unauthorized");
    }
    
    const existingUser = await db.user.findUnique({
      where: {
        clerkId: clerkId
      }
    })
    
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return existingUser;
    }
    
    console.log("Syncing user with ID:", clerkId);
    
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(clerkId);
    
    if (!user.emailAddresses[0]?.emailAddress) {
      throw new Error("User email not found");
    }
    
    const email = user.emailAddresses[0].emailAddress;
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';

    const dbUser = await db.user.create({
      data: {
        clerkId: clerkId,
        email: email,
        name: name,
        password: null
      }
    });
    
    console.log("User synced successfully:", dbUser);
    return dbUser;
  } catch (e) {
    console.error("Failed to sync user:", e);
    throw e;
  }
} 