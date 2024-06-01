import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;


export function createToken(user) {
    return jwt.sign({ id: user.id, role: user.role, cartId: user.cartId }, accessTokenSecret);
}

export function createRefreshToken(user) {
    return jwt.sign({ id: user.id }, refreshTokenSecret);
}

export function verifyToken(token) {
    return jwt.verify(token, accessTokenSecret);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, refreshTokenSecret);
}