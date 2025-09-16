-- DropForeignKey
ALTER TABLE "public"."Room" DROP CONSTRAINT "Room_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Room" ADD CONSTRAINT "Room_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
