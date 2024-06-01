import db from "../db/index.js";
import errorHandler from "../utils/errorHandler.js";
import { generatePasswordHash } from "../utils/password.js";
import uploadToS3 from "../utils/uploadToS3.js";


export async function createUser(req, res) {
    const { email, password, name, role } = req.body;
    try {
        // check if user already exist
        let user = await db.user.findFirst({ where: { email } });
        if (user) return res.status(409).json({ error: "Email is already in use." });

        // hash the password before saving to database
        let hashedPassword = await generatePasswordHash(password);

        let newUserData = {
            email, password: hashedPassword, name, role
        }

        if (role === "USER") {
            const newCart = await db.cart.create({ data: {} });
            newUserData.cartId = newCart.id;
            newUserData.verified = true;
        }

        await db.user.create({
            data: newUserData
        });

        return res.status(201).send({
            message: `User created! ${role === "USER" ? "Please login" : "Waiting for verification."}.`
        });
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function getUsers(req, res) {

    const adminId = parseInt(req.user.id);
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const suspended = req.query.suspended;
    const verified = req.query.verified;
    const role = req.query.role;
    const search = req.query.query?.toLowerCase();

    try {
        let filter = { 
            id: { not: adminId }, 
            name: { contains: search, mode: "insensitive" },
            role, 
            verified: (verified && verified === "1"),
            suspended: (suspended && suspended === "1")
        };

        const users = await db.user.findMany({
            where: filter,
            select: {
                name: true,
                email: true,
                suspended: true,
                role: true,
                id: true,
                verified: true,
                updatedAt: true,
                createdAt: true
            },
            take: perPage,
            skip: (page - 1) * perPage,
        });
        const total = await db.user.count({ where: filter });

        return res.status(200).json({ 
            users,
            count: total,
            page,
            perPage
        });
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function getUserById(req, res) {
    const id = parseInt(req.params.id);

    try {
        const user = await db.user.findUnique({ where: { id }, select: {
            id: true,
            name: true,
            role: true,
            image: true,
            email: true,
        } });

        let recentOrders = [];
        if(user.role === "USER") {
            recentOrders = await db.order.findMany({
                where: {
                    userId: user.id
                },
                select: {
                    id: true,
                    netBilledAmount: true,
                    seller: {
                        select: {
                            name: true,
                            id: true
                        }
                    },
                    address: true,
                    createdAt: true,
                    status: true,
                    paymentMode: true,
                    items: true
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 5
            })
        } else if( user.role === "SELLER") {
            recentOrders = await db.order.findMany({
                where: {
                    sellerId: user.id
                },
                select: {
                    id: true,
                    netBilledAmount: true,
                    user: {
                        select: {
                            name: true,
                            id: true
                        }
                    },
                    address: true,
                    createdAt: true,
                    status: true,
                    paymentMode: true,
                    items: true
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 5
            })
        }

        return res.status(200).json({ user, recentOrders: recentOrders.map(r => ({...r, items: JSON.parse(r.items)})) })
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function updateUser(req, res) {
    const { id } = req.user;
    const body = req.body;

    const image = req.file;
    const { newPassword } = req.body;

    let updates = {};
    if (body.name) updates.name = body.name;

    try {
        if (image) {
            let imageType = image.mimetype.split("/")[1];
            const s3Url = await uploadToS3(`users/${id}.${imageType}`, image.buffer);
            updates.image = s3Url;
        }
        if (newPassword) {
            let hashedPassword = await generatePasswordHash(newPassword);
            updates.password = hashedPassword;
        }
        await db.user.update({ where: { id }, data: updates });

        return res.status(200).json({ message: "User updated!" })
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function updatePicture(req, res) {
    const { id } = req.user;
    const image = req.files.image;

    // save the file to AWS S3
    try {
        const s3Url = await uploadToS3(`users/${id}.png`, image);
        await db.user.update({ where: { id }, data: { image: s3Url } });

        return res.status(200).json({ message: "Image updated!", image: s3Url })
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function updatePassword(req, res) {
    const { id } = req.user;
    const { newPassword } = req.body;
    try {
        let hashedPassword = await generatePasswordHash(newPassword);

        let updates = { password: hashedPassword };
        await db.user.update({ where: { id }, data: updates });

        return res.status(200).json({ message: "Password updated!" })
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function suspendUser(req, res) {
    const id  = parseInt(req.params.id);

    try {
        await db.user.update({ where: { id }, data: { suspended: true } });
        return res.status(200).json({
            message: `User has been suspended.`
        });
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function unSuspendUser(req, res) {
    const id  = parseInt(req.params.id);

    try {
        await db.user.update({ where: { id }, data: { suspended: false } });
        return res.status(200).json({
            message: `User suspension revoked.`
        });
    } catch (error) {
        return errorHandler(error, res);
    }
}