import { Socket } from "socket.io";
import { verifyToken } from "../common/utils/jwt.js";
import { SocketData, ServerToClientEvents, ClientToServerEvents, InterServerEvents } from "./types.js";
import { prisma } from "../config/prisma.js";

type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

const parseCookie = (cookieString: string, name: string) => {
  const match = cookieString.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
};

export const socketAuthMiddleware = async (socket: AppSocket, next: (err?: Error) => void) => {
  try {
    let token = socket.handshake.auth.token;

    // Fallback to cookie if token is not explicitly passed in handshake
    if (!token && socket.handshake.headers.cookie) {
      token = parseCookie(socket.handshake.headers.cookie, "token");
    }

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return next(new Error("Authentication error: Invalid token"));
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, roles: true, institutionId: true },
    });

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attach user to socket data
    socket.data.user = {
      id: user.id,
      roles: user.roles,
      institutionId: user.institutionId,
    };

    next();
  } catch {
    next(new Error("Authentication error: Token verification failed"));
  }
};
