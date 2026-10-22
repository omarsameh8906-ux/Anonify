import { ipKeyGenerator, rateLimit } from 'express-rate-limit'
import geoip from "geoip-lite"
import { client } from '../../../src/DB/redis.connection.js'
import { successResponse } from './success.response.js';

async function fromWhere(ip){
  try {
    return geoip.lookup(ip)
  } catch (error) {
    console.log("fail to detect request origin");
    console.log(error);
  }
}
export const generateRateLimiter = ({
        ttl= 5 ,
        limit = 50 ,
        standardHeaders="draft-8" ,
        legacyHeaders = true ,
        message= "Too Many Requests" ,
        statusCode = 429 ,
        skipSuccessfulRequests ,
        skipFailedRequests
        })=>{
   return rateLimit({
  windowMs: ttl * 60 * 1000 ,
  skipSuccessfulRequests,
  legacyHeaders,
  standardHeaders,
  skipFailedRequests,
  handler: function(req,res,next){
    return successResponse({res , status:statusCode , message})
  },

  limit: async function(req) {
    const country = await fromWhere(req.ip)

    return country?.country == "EG" ? limit : 50
  } ,
  keyGenerator: function(req){
    const ip = ipKeyGenerator(req.ip , 52)
    return `${ip}::${req.path}`
  },
  store: {
    async incr(key , cb){
      try {
        const count = await client.incr(key)
        if(count === 1 ){
          await client.expire(key , ttl * 60)
        }
        cb(null , count)
      } catch (err) {
        cb(err)
      }
    },
    async decrement(key){
      if (await client.exists(key)){
        await client.decr(key)
      }
    }
  }
})
}
