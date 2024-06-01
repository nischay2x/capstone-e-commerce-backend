import db from "../db/index.js";
import errorHandler from "../utils/errorHandler.js";

export async function createOrder(req, res) {
    const { cartId } = req.user;
    const { address, phoneNumber, paymentMode } = req.body;

    if (!cartId) return res.status(400).json({ message: 'Cart not found' });
    const orders = [];
    try {
        await db.$transaction(async (db) => {

            const cart = await db.cart.findUnique({
                where: { id: cartId }, select: {
                    items: {
                        select: {
                            quantity: true,
                            id: true,
                            product: {
                                select: {
                                    price: true,
                                    id: true,
                                    name: true,
                                    description: true,
                                    sellerId: true
                                }
                            }
                        }
                    }
                }
            });

            const cartItems = cart.items;
            if (!cartItems.length) return res.status(400).json({ message: "Cart empty" });

            // map cart items to sellerId
            const itemMap = new Map();
            for (let i = 0; i < cartItems.length; i++) {
                const item = cartItems[i];
                const key = `${item.product.sellerId}`;
                if (!itemMap.has(key)) {
                    itemMap.set(key, [item]);
                } else {
                    itemMap.get(key).push(item);
                }
            }

            // calculate total for each sellerId
            let totalPerSeller = {};
            for (const [key, value] of itemMap) {
                const sellerTotal = value.reduce((acc, curr) => acc + curr.quantity * curr.product.price, 0);
                totalPerSeller[key] = sellerTotal;
            }

            // create a order per sellerId
            for (let [sellerId, products] of itemMap.entries()) {
                orders.push({
                    sellerId: parseInt(sellerId),
                    userId: req.user.id,
                    phoneNumber,
                    address,
                    paymentMode,
                    items: JSON.stringify(products),
                    netBilledAmount: totalPerSeller[sellerId]
                })
            }

            await db.order.createMany({ data: orders });

            // empty the cart after checkout
            await db.cartItem.deleteMany({ where: { id: { in: cartItems.map(x => x.id) } } });
        });

        let totalOrders = orders.length;
        let totalPrice = orders.reduce((acc, curr) => acc + curr.netBilledAmount, 0);
        return res.status(200).json({ totalOrders, totalPrice });
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function cancelOrder(req, res) {
    const orderId = parseInt(req.params.id);
    const { id } = req.user;

    try {
        await db.order.update({
            where: {
                id: orderId,
                AND: [
                    { userId: id }
                ]
            }, data: {
                status: "CANCELLED"
            }
        });
        return res.status(200).json({ message: "Order cancelled!" })
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function getOrders(req, res) {
    const limit = parseInt(req.query.limit) || undefined;
    const offset = parseInt(req.query.offset) || undefined;

    let { year, month } = req.query;

    const today = new Date();
    if(!year) year = today.getFullYear();
    if(!month) month = today.getMonth() + 1;

    let yearInt = parseInt(year, 10);
    let monthInt = parseInt(month, 10);

    if (isNaN(yearInt) || isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
        yearInt = today.getFullYear();
        monthInt = today.getMonth() + 1;
    }

    const startDate = new Date(yearInt, monthInt - 1, 1);
    const endDate = new Date(yearInt, monthInt, 0, 23, 59, 59);


    try {
        let filter = {};
        if (!req.query.status) {
            filter = {
                userId: req.user.id,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                }
            };
        } else {
            filter = {
                userId: req.user.id,
                status: req.query.status,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                }
            };

        }
        const orders = await db.order.findMany({
            where: filter, 
            select: {
                id: true,
                netBilledAmount: true,
                createdAt: true,
                status: true,
                seller: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: "asc"
            },
            take: limit,
            skip: offset
        });
        return res.status(200).send(orders);
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function getOrderById(req, res) {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: 'Invalid parameter' });
    }

    try {
        let order = await db.order.findUnique({
            where: { id }, select: {
                createdAt: true,
                updatedAt: true,
                items: true,
                address: true,
                phoneNumber: true,
                netBilledAmount: true,
                paymentMode: true,
                status: true,
                id: true,
                seller: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
        if (order) {
            order = { ...order, items: JSON.parse(order.items) };
        }
        return res.status(200).json(order);
    } catch (error) {
        return errorHandler(error, res);
    }
}