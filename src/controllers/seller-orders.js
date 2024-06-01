import db from "../db/index.js";
import errorHandler from "../utils/errorHandler.js";

export async function getSellerOrders(req, res) {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const status = req.query.status;

    let { year, month } = req.query;

    const today = new Date();
    if (!year) year = today.getFullYear();
    if (!month) month = today.getMonth() + 1;

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
        if (!status) {
            filter = {
                sellerId: req.user.id,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                }
            }

        } else {
            filter = {
                sellerId: req.user.id,
                status: status,
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
                address: true,
                createdAt: true,
                updatedAt: true,
                status: true
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: perPage ?? 10,
            skip: (page - 1) * perPage
        });

        const count = await db.order.count({ where: filter });
        return res.status(200).json({
            orders,
            page,
            perPage,
            count,
            status,
            year,
            month
        });
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function getSellerOrderById(req, res) {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: 'Invalid parameter' });
    }

    try {
        let order = await db.order.findUnique({
            where: { id }, select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                items: true,
                address: true,
                phoneNumber: true,
                netBilledAmount: true,
                paymentMode: true,
                status: true,
                user: {
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

export async function dispatchOrder(req, res) {
    const { id } = req.user;
    const orderId = parseInt(req.params.id);

    try {
        await db.order.update({
            where: { id: orderId, AND: [{ sellerId: id }] }, data: {
                status: "DISPATCHED"
            }
        });

        return res.status(200).json({ message: "Order dispatched!" })
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function completeOrder(req, res) {
    const { id } = req.user;
    const orderId = parseInt(req.params.id);

    try {
        await db.order.update({
            where: { id: orderId, AND: [{ sellerId: id }] }, data: {
                status: "COMPLETED"
            }
        });

        return res.status(200).json({ message: "Order completed!" })
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function getDashboardOverview(req, res) {
    const sellerId = req.user.id;


    let { year, month } = req.query;

    const today = new Date();
    if (!year) year = today.getFullYear();
    if (!month) month = today.getMonth() + 1;

    let yearInt = parseInt(year, 10);
    let monthInt = parseInt(month, 10);

    if (isNaN(yearInt) || isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
        yearInt = today.getFullYear();
        monthInt = today.getMonth() + 1;
    }

    const startDate = new Date(yearInt, monthInt - 1, 1);
    const endDate = new Date(yearInt, monthInt, 0, 23, 59, 59);

    try {
        // Total orders count
        const totalOrders = await db.order.count({
            where: {
                sellerId: sellerId,
            },
        });

        // Orders grouped by status
        const ordersByStatus = await db.order.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
            where: {
                sellerId: sellerId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                }
            },
        });

        const ordersPerDay = await db.order.groupBy({
            by: ['createdAt'],
            where: {
                sellerId: parseInt(sellerId),
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                }
            },
            _count: {
                _all: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        let orderMap = new Map();
        ordersPerDay.forEach(order => {
            let date =  order.createdAt.toISOString().split('T')[0];
            let count = order._count._all;

            if(orderMap.has(date)){
                orderMap.set(date, orderMap.get(date) + count);
            } else {
                orderMap.set(date, count);
            }
        });
        let formattedOrders = [];
        orderMap.forEach((v, k) => {
            formattedOrders.push({date: k, count: v})
        })

        // Total revenue
        const totalRevenue = await db.order.aggregate({
            _sum: {
                netBilledAmount: true,
            },
            where: {
                sellerId: sellerId,
                status: 'COMPLETED',
            },
        });

        // Recent orders
        const recentOrders = await db.order.findMany({
            where: {
                sellerId: sellerId,
            },
            select: {
                id: true,
                address: true,
                updatedAt: true,
                netBilledAmount: true
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5, // You can change this number to show more recent orders
        });


        // Structure the data for the dashboard
        const dashboardData = {
            totalOrders,
            ordersByStatus: ordersByStatus.map(order => ({
                status: order.status,
                count: order._count.status,
            })),
            totalRevenue: totalRevenue._sum.netBilledAmount || 0,
            recentOrders,
            ordersPerDay: formattedOrders
        };

        // Send the response
        return res.status(200).json(dashboardData);
    } catch (error) {
        return errorHandler(error, res);
    }
}