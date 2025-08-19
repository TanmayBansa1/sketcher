import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DecodedTokenSchema } from "@repo/commons/authSchemas";
import Cookies from "cookies";

export default async function middleware(req: Request, res: Response, next: NextFunction){
  const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;
  
  // Debug: Check if public key is loaded
  if (!publicKey) {
    console.error("CLERK_PEM_PUBLIC_KEY environment variable is not set");
    return res.status(500).json({ error: 'Server configuration error' });
  }
  
  // Debug: Log the first and last few characters of the public key
  console.log("Public key loaded:", publicKey.substring(0, 50) + "..." + publicKey.substring(publicKey.length - 50));
  
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("No valid Authorization header");
    res.status(401).json({ error: 'No valid Authorization header' });
    return;
  }
  
  const token = authHeader.replace('Bearer ', '');
  console.log("Token received:", token.substring(0, 20) + "...");

  try {
    let decoded;
    const permittedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
    
    // Verify Clerk JWT token
    decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as DecodedTokenSchema;
    console.log("Token decoded successfully");
    
    // Validate the token's expiration (exp) and not before (nbf) claims
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime || decoded.nbf > currentTime) {
      console.log("Token is expired or not yet valid");
      throw new Error('Token is expired or not yet valid');
    }
    
    // Validate the token's authorized party (azp) claim
    if (decoded.azp && !permittedOrigins.includes(decoded.azp)) {
      console.log("Invalid 'azp' claim");
      throw new Error("Invalid 'azp' claim");
    }
    
    req.userId = decoded.sub;
    console.log("Token is valid, userId:", req.userId);
    next();
  } catch (error) {
    console.log("Token verification failed:", error);
    res.status(401).json({ error: 'Invalid token' });
  }
}
    