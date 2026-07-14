import { MongoClient } from "mongodb";

import { env } from "../env.js";

export const client = new MongoClient(env.DATABASE_URL);
export const db = client.db("api");