import { config } from "dotenv";
import z from "zod";
config({ path: `.env.${process.env.NODE_ENV}` });

const configurationSchema = z.object({
  node_env: z.string(),
  host: z.string().default("localhost"),
  port: z.number().int().default(80),
  database: z.object({
    host: z.string(),
    port: z.number().int().default(5432),
    user: z.string(),
    password: z.string(),
    database: z.string(),
  }),
  jwks_uri: z.string().url(),
  jwt_secrets: z.object({
    privateKay: z.string(),
    refresh: z.string(),
    forgot: z.string(),
  }),
  cookies: z.object({
    domain: z.string().optional(),
  }),
});

export type Configuration = z.infer<typeof configurationSchema>;

const configuration = {
  node_env: process.env.NODE_ENV,
  host: process.env.HOST ?? "localhost",
  port: Number.parseInt(process.env.PORT ?? "80"),
  allowed_origins: process.env.ALLOWED_ORIGINS?.split(",") || [],
  database: {
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT ?? "5432"),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  },
  jwks_uri: process.env.JWKS_URI,
  jwt_secrets: {
    privateKay: process.env.JWT_PRIVATE_KEY_SECRETS,
    refresh: process.env.JWT_REFRESH_TOKEN_SECRET,
    forgot: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET,
  },
  cookies: {
    domain: process.env.COOKIE_DOMAIN,
  },
};

if (configuration.node_env === "production") {
  configurationSchema.parse(configuration);
}

export default configuration;
