const { config } = require("dotenv");

config({ path: require("node:path").resolve(__dirname, "../.env"), quiet: true });

const sourceUrl = process.env.E2E_DATABASE_URL ?? process.env.DATABASE_URL;
if (!sourceUrl) {
  throw new Error("DATABASE_URL ou E2E_DATABASE_URL deve ser definida para os testes E2E.");
}

const databaseUrl = new URL(sourceUrl);
if (!process.env.E2E_DATABASE_URL) {
  const databaseName = databaseUrl.pathname.replace(/^\//, "");
  databaseUrl.pathname = `/${databaseName}_e2e`;
}

const isolatedDatabaseName = databaseUrl.pathname.replace(/^\//, "");
if (!isolatedDatabaseName.endsWith("_e2e")) {
  throw new Error("O banco dos testes E2E deve ter nome terminado em _e2e.");
}

process.env.DATABASE_URL = databaseUrl.toString();
process.env.NODE_ENV = "test";
