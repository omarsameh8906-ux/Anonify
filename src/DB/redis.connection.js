import { createClient } from "redis"
import { REDIS_URI } from "../config.js";

export const client = createClient({
  url: REDIS_URI
});

export async function connectRedis() {
    try {
        await client.connect()
        console.log("Redis Connection Stablish Successfully");
        
    } catch (error) {
        console.log("fail to stablish Redis connection");
        
    }
}