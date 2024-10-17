import JsonWebToken from "jsonwebtoken";

class TokensService {
  private readonly secret: JsonWebToken.Secret;
  private readonly signOptions?: JsonWebToken.SignOptions;
  constructor(
    secret: JsonWebToken.Secret,
    signOptions?: JsonWebToken.SignOptions,
  ) {
    this.secret = secret;
    this.signOptions = signOptions;
  }

  sign(payload: JsonWebToken.JwtPayload): string {
    const token = JsonWebToken.sign(payload, this.secret, this.signOptions);
    return token;
  }

  verify(token: string): JsonWebToken.JwtPayload | string {
    return JsonWebToken.verify(token, this.secret);
  }
}

export default TokensService;
