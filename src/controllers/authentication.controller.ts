import { Request, Response, NextFunction } from "express";
import JsonWebToken from "jsonwebtoken";
import UserService from "@/services/users.service";
import TokensService from "@/services/tokens.service";
import { CreateUserDto } from "@/dto/users";
import { ForgotPasswordDto, ResetPasswordDto } from "@/dto/autentication";
import { AuthenticatedRequest } from "@/middlewares/authenticate";
import { Logger } from "winston";
import createHttpError from "http-errors";

class AutenticationController {
  constructor(
    private readonly userService: UserService,
    private readonly accessTokensService: TokensService,
    private readonly refreshTokensService: TokensService,
    private readonly forgotTokensService: TokensService,
    private readonly logger: Logger,
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, ...rest } = req.body as CreateUserDto;
      this.logger.debug(`initiate registering user ${email}`);
      const userExists = await this.userService.findOne({ where: { email } });
      if (userExists) {
        this.logger.debug(`user already exists with ${email} email`);
        throw createHttpError(400, "user already exists");
      }
      this.logger.debug("registering user");
      const user = await this.userService.create({ email, ...rest });
      this.logger.debug("user registered successfully");
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as CreateUserDto;
      this.logger.debug(`Attempting login for user with email: ${email}`);
      const user = await this.userService.findOne({
        where: { email },
        relations: { restaurant: true },
      });

      this.logger.debug(`User not found for email: ${email}`);
      if (!user) {
        throw createHttpError(404, "user not found");
      }

      this.logger.debug(`Wrong credentials for email: ${email}`);
      if (user.password !== password) {
        throw createHttpError(400, "wrong credentials");
      }

      const payload: JsonWebToken.JwtPayload = {
        sub: String(user.id),
        restaurantId: user?.restaurant.id ?? null,
        role: user.role,
      };

      this.logger.debug(`User with email: ${email} logged in successfully`);
      const accessToken = this.accessTokensService.sign(payload);

      return res.json({ accessToken });
    } catch (error) {
      this.logger.error(`Error during login: ${(error as Error).message}`);
      next(error);
    }
  }

  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req as AuthenticatedRequest).user.sub;
      this.logger.debug(`Fetching profile for user id: ${id}`);
      const user = await this.userService.findOne({
        where: { id: Number(id) },
      });
      this.logger.debug(`User not found for id: ${id}`);
      if (!user) {
        this.logger.debug(`Profile fetched for user id: ${id}`);
        return next(createHttpError(404, "user not found"));
      }
      return res.json(user);
    } catch (error) {
      this.logger.error(`Error fetching profile: ${(error as Error).message}`);
      next(error);
    }
  }

  async forgot(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body as ForgotPasswordDto;
      this.logger.debug(`Initiating forgot password for email: ${email}`);
      const user = await this.userService.findOne({ where: { email } });
      this.logger.debug(`User not found for email: ${email}`);
      if (!user) {
        throw createHttpError(404, "user not found");
      }
      const payload: JsonWebToken.JwtPayload = {
        sub: String(user.id),
        role: user.role,
        email: user.email,
      };
      this.logger.debug(`Forgot password token generated for email: ${email}`);
      const token = this.forgotTokensService.sign(payload);

      return res.json({ token });
    } catch (error) {
      this.logger.error(
        `Error during forgot password: ${(error as Error).message}`,
      );
      next(error);
    }
  }

  async reset(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.debug(`Attempting password reset with token`);
      const { token } = req.params;
      const match = this.forgotTokensService.verify(token);
      this.logger.debug(`Invalid token for password reset`);
      if (!match) {
        throw createHttpError(500, "internal server error");
      }
      const { email } = match as JsonWebToken.JwtPayload;
      this.logger.debug(`Verifying user existence for email: ${email}`);

      const userExists = await this.userService.findOne({
        where: { email: email as string },
      });

      this.logger.debug(`User not found for email: ${email}`);
      if (!userExists) {
        throw createHttpError(404, "user not found");
      }

      const { password } = req.body as ResetPasswordDto;
      const user = await this.userService.update(
        { email: email as string },
        {
          password,
        },
      );

      this.logger.debug(`Failed to update password for email: ${email}`);
      if (!user) {
        throw createHttpError(500, "internal server error");
      }
      this.logger.debug(`Password reset successful for email: ${email}`);

      return res.json(user);
    } catch (error) {
      this.logger.error(
        `Error during password reset: ${(error as Error).message}`,
      );
      next(error);
    }
  }
}

export default AutenticationController;
