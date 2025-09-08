import { DecodedTokenSchema } from "@repo/commons/authSchemas";
import { WebSocket } from "ws";
import jwt from "jsonwebtoken";

export function checkUserToken(ws: WebSocket, token: string | null) {
    
  try{
  if(!token){
        console.log('No token provided');
        ws.send(JSON.stringify({
            type: 'error',
            message: 'No token provided'
        }));
        ws.close();
        return;
    }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedTokenSchema;

  if(!decoded.sub){
    console.log('Invalid token');
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Invalid token'
    }));
    ws.close();
    return;
  }

    return decoded.sub;
  } catch (error) {
    console.error('Error checking user token:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Error checking user token'
    }));
    ws.close();
    return null;
  }
}