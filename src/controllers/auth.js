import db from "../db/index.js";
import errorHandler from "../utils/errorHandler.js";
import { generatePasswordHash, matchPassword } from "../utils/password.js";
import { createRefreshToken, createToken, verifyRefreshToken } from "../utils/tokens.js";

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        let user = await db.user.findUnique({ where: { email }});
        if(!user) return res.status(401).json({ error: "No account found with this email!" });

        if(!user.verified) return res.status(401).json({ error: "This account has not been verified yet!" });

        if(user.suspended) return res.status(401).json({ error: "This account has been suspended!" });

        let hashed = user.password;

        const isMatch = matchPassword(password, hashed);

        if (!isMatch) return res.status(401).json({ error: "Invalid Password" });
        
        const token = createToken(user);
        const refreshToken = createRefreshToken(user);

        return res.status(200).json({
            role: user.role,
            name: user.name,
            email: user.email,
            cartId: user.cartId,
            image: user.image,
            token: token,
            refreshToken: refreshToken
        });
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function getNewToken(req, res) {
    const refreshToken = req.headers['x-refresh-token'];
    if(!refreshToken) return res.status(400).json({ error: "No refresh token" });
    const { id } = verifyRefreshToken(refreshToken);

    try {
        let user = await db.user.findUnique({ where: { id }});

        if(user.suspended) return res.status(401).json({ error: "This account has been suspended!" });
        const token = createToken(user);
        const refreshToken = createRefreshToken(user);

        return res.status(200).json({
            role: user.role,
            name: user.name,
            email: user.email,
            cartId: user.cartId,
            token: token,
            refreshToken: refreshToken
        });
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function sendEmailOtp(req, res) {
    const { email } = req.body;

    // create a random 6 digit number
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {

        const user = await db.user.findFirst({ where: {email}, select: { email: true } });

        if(!user) return res.status(400).json({ error: "User does not exist with this email." });

        await db.emailOtp.upsert({
            create: { email, otp },
            update: { otp },
            where: { email }
        });

        return res.status(200).json({
            message: `OTP sent to ${email} (${otp})`
        });
    } catch (error) {
        return errorHandler(error);
    }
}

export async function verifyOtpAndChangePassword(req, res) {
    const { email, otp, password } = req.body;
    try {
        const emailOtp = await db.emailOtp.findUnique({ where: { email }});
        if(!emailOtp) return res.status(400).json({ error: "Invalid OTP" });
        if(emailOtp.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

        const hashedPassword = await generatePasswordHash(password);
        const user = await db.user.update({
            where: { email },
            data: { password: hashedPassword }
        });
        return res.status(200).json({
            message: "Password changed! Now login"
        })
    } catch (error) {
        return errorHandler(error);
    }
}