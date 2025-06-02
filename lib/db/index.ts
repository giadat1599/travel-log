import { drizzle } from "drizzle-orm/libsql";

import env from "../env";
import * as schema from "./schema";

export default drizzle({ connection: {
  url: env.TURSO_DATABASE_URL,
  authToken: env.NODE_ENV === "development" ? undefined : env.TURSO_AUTH_TOKEN,
}, schema, casing: "snake_case" });
