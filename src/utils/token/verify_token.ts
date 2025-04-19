import { JwtPayload, verify } from "jsonwebtoken";
import config from "../../config";


interface ICustomJwtPayload extends JwtPayload{
    id:string;
    role:string;
}

/**
 * verify token 
 * @param {string} token 
 * @returns {JwtPayload} Jwt PayLoad
 */
export default (token:string):ICustomJwtPayload => {
    return verify (token , config.jwt.secret) as ICustomJwtPayload
}