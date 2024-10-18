import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV}` });

const configuration = {
  node_env: process.env.NODE_ENV,
  host: process.env.HOST,
  port: process.env.PORT,
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  },
  jwks_uri: process.env.JWKS_URI,
  jwt_secrets: {
    refresh: process.env.JWT_SECRETS_REFRESH,
    forgot: process.env.JWT_SECRETS_FORGOT,
  },
  cookies: {
    domain: process.env.COOKIE_DOMAIN,
  },
};

export default configuration;
