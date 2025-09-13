import { DecodedTokenSchema } from "@repo/commons/authSchemas";
import { WebSocket } from "ws";
import jwt from "jsonwebtoken";

export function checkUserToken(ws: WebSocket, token: string | null) {
  try {
    if (!token) {
      console.log("No token provided");
      ws.send(
        JSON.stringify({
          type: "error",
          message: "No token provided",
        })
      );
      ws.close();
      return;
    }
    const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;

    if (!publicKey) {
      console.error("CLERK_PEM_PUBLIC_KEY environment variable is not set");
      ws.send(
        JSON.stringify({
          type: "error",
          message: "CLERK_PEM_PUBLIC_KEY environment variable is not set",
        })
      );
      ws.close();
      return;
    }

    let decoded;
    const permittedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:8080",
    ];

    decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as DecodedTokenSchema;
    console.log("Token decoded successfully");

    // Validate the token's expiration (exp) and not before (nbf) claims
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime || decoded.nbf > currentTime) {
      console.log("Token is expired or not yet valid");
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Token is expired or not yet valid",
        })
      );
      ws.close();
      return;
    }

    // Validate the token's authorized party (azp) claim
    if (decoded.azp && !permittedOrigins.includes(decoded.azp)) {
      console.log("Invalid 'azp' claim");
      ws.send(
        JSON.stringify({
          type: "error",
          message: 'Invalid "azp" claim',
        })
      );
      ws.close();
      return;
    }

    if (!decoded.sub) {
      console.log("Invalid token");
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid token",
        })
      );
      ws.close();
      return;
    }

    return decoded.sub;
  } catch (error) {
    console.error("Error checking user token:", error);
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Error checking user token",
      })
    );
    ws.close();
    return null;
  }
}
