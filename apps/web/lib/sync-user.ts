"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import db from "@repo/db/prisma";

export async function syncUser() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }
    
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    
    if (!user.emailAddresses[0]?.emailAddress) {
      throw new Error("User not found");
    }
    
    const dbUser = await db.user.upsert({
      where:{
          id: user.id
      },
      update:{
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          name: user.firstName + " " + user.lastName ,
      },
      create:{
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          name: user.firstName + " " + user.lastName,
      }
  })
    
    return dbUser;
  } catch (e) {
    console.log("Failed to sync user, the error is ->", e);
    throw e;
  }
} 