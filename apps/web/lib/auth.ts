import { auth } from "@clerk/nextjs/server";

export const getAuthTokenServer = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) {
    throw new Error("User not authenticated");
  }
  return token;
};

