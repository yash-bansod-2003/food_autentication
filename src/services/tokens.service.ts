import { RefreshToken } from "@/entity/RefreshToken";
import JsonWebToken from "jsonwebtoken";
import {
  DeepPartial,
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from "typeorm";

class TokensService {
  private readonly secret: JsonWebToken.Secret;
  private readonly refreshTokensRepository?: Repository<RefreshToken>;
  constructor(
    secret: JsonWebToken.Secret,
    refreshTokensRepository?: Repository<RefreshToken>,
  ) {
    this.secret = secret;
    this.refreshTokensRepository = refreshTokensRepository;
  }

  sign(
    payload: JsonWebToken.JwtPayload,
    signOptions?: JsonWebToken.SignOptions,
  ): string {
    const token = JsonWebToken.sign(payload, this.secret, signOptions);
    return token;
  }

  verify(token: string): JsonWebToken.JwtPayload | string {
    return JsonWebToken.verify(token, this.secret);
  }

  async create(
    createRefreshTokenDto: DeepPartial<RefreshToken>,
  ): Promise<RefreshToken | undefined> {
    if (this.refreshTokensRepository) {
      return await this.refreshTokensRepository.save(createRefreshTokenDto);
    }
  }

  async findOne(
    options: FindOneOptions<RefreshToken>,
  ): Promise<RefreshToken | null | undefined> {
    if (this.refreshTokensRepository) {
      return this.refreshTokensRepository.findOne(options);
    }
  }

  async delete(
    criteria: FindOptionsWhere<RefreshToken>,
  ): Promise<DeleteResult | undefined> {
    if (this.refreshTokensRepository) {
      return this.refreshTokensRepository.delete(criteria);
    }
  }
}

export default TokensService;
