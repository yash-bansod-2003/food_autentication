import { Request } from "express";
import { expressjwt } from "express-jwt";
import configuration from "@/config/configuration";
import { AppDataSource } from "@/data-source";
import { RefreshToken } from "@/models/RefreshToken";
import logger from "@/config/logger";

export default expressjwt({
  secret: String(configuration.jwt_secrets.refresh),
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken: token } = req.cookies as Record<
      string,
      string | undefined
    >;
    return token;
  },
  isRevoked: async (req: Request, token) => {
    try {
      const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
      const refreshToken = await refreshTokenRepository.findOne({
        where: {
          id: Number((token?.payload as { jti: string }).jti),
          user: { id: Number(token?.payload.sub) },
        },
      });
      return refreshToken === null;
    } catch (error) {
      logger.error("error refresh token", error);
      return true;
    }
  },
});

export interface AuthenticatedRequest extends Request {
  auth: {
    sub: string;
    role: string;
    restaurantId: number;
    iat: number;
    exp: number;
  };
}
