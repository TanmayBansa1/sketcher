import { auth } from "@clerk/nextjs/server";

export const getAuthToken = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) {
    throw new Error("User not authenticated");
  }
  return token;
};
