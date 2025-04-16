import {config} from 'dotenv';
config();


export default{
    env:process.env.NODE_ENV,
    port:process.env.PORT,
    db:{
        uri:process.env.MONGODB_URI,
    },
    jwt:{
        secret:process.env.JWT_SECRET,
        expeirein:process.env.JWT_EXPIRESIN,
    },
    apiKey:process.env.API_KEY,
}
