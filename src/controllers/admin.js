import db from "../db/index.js";
import errorHandler from "../utils/errorHandler.js";

// export async function getAdminOverview(req, res) {
//     try {
//         // Total Sales
//         const totalSales = await db.order.aggregate({
//           _sum: {
//             netBilledAmount: true,
//           },
//         });

//         // Sales by Category
//         const salesByCategory = await db.product.groupBy({
//           by: ['category'],
//           _sum: {
//             price: true,
//           },
//         });

//         // Total Users
//         const totalUsers = await db.user.count();

//         // Active Users
//         const activeUsers = await db.user.count({
//           where: {
//             suspended: false,
//           },
//         });

//         // New Registrations (last 30 days)
//         const newRegistrations = await db.user.count({
//           where: {
//             createdAt: {
//               gte: new Date(new Date().setDate(new Date().getDate() - 30)),
//             },
//           },
//         });

//         // Total Orders
//         const totalOrders = await db.order.count();
//     } catch (error) {}
// }

// now give me a controller function that returns data that I can show on overview dashboard, metrics and charts

export async function getAdminOverview(req, res) {
  try {
    // Total Sales
    const totalSales = await db.order.aggregate({
      _sum: {
        netBilledAmount: true,
      },
    });

    // Sales by Category
    const salesByCategory = await db.product.groupBy({
      by: ['category'],
      _sum: {
        price: true,
      },
    });

    // Total Users
    const totalUsers = await db.user.count();

    // Active Users
    const activeUsers = await db.user.count({
      where: {
        suspended: false,
      },
    });

    // New Registrations (last 30 days)
    const newRegistrations = await db.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    });

    // Total Orders
    const totalOrders = await db.order.count();

    // Order Status Breakdown
    const orderStatusBreakdown = await db.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // Average Order Value
    const averageOrderValue = await db.order.aggregate({
      _avg: {
        netBilledAmount: true,
      },
    });

    // Order Trends (last 30 days)
    const orderTrends = await db.order.groupBy({
      by: ['createdAt'],
      _count: {
        _all: true,
      },
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    let orderMap = new Map();
    orderTrends.forEach(order => {
      let date = order.createdAt.toISOString().split('T')[0];
      let count = order._count._all;

      if (orderMap.has(date)) {
        orderMap.set(date, orderMap.get(date) + count);
      } else {
        orderMap.set(date, count);
      }
    });
    let formattedOrders = [];
    orderMap.forEach((v, k) => {
      formattedOrders.push({ date: k, count: v })
    })

    // Top Selling Products
    const topSellingProducts = await db.product.findMany({
      orderBy: {
        cartItems: {
          _count: 'desc',
        },
      },
      select: {
        name: true,
        id: true,
        image: true,
        price: true,
        seller: {
          select: {
            name: true,
            id: true
          }
        }
      },
      take: 5,
    });


    // Data to be sent to the frontend
    const dashboardData = {
      totalSales: totalSales._sum.netBilledAmount || 0,
      salesByCategory,
      totalUsers,
      activeUsers,
      newRegistrations,
      totalOrders,
      orderStatusBreakdown,
      averageOrderValue: averageOrderValue._avg.netBilledAmount || 0,
      orderTrends: formattedOrders,
      topSellingProducts
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// ------------------------------------------------------


// async function getDashboardOverview(req, res) {
//   try {
//     // Total Sales
//     const totalSales = await db.order.aggregate({
//       _sum: {
//         netBilledAmount: true,
//       },
//     });

//     // Total Users
//     const totalUsers = await db.user.count();

//     // Total Orders
//     const totalOrders = await db.order.count();

//     // Total Products
//     const totalProducts = await db.product.count({
//       where: {
//         state: 'ACTIVE',
//       },
//     });

//     // Recent Orders
//     const recentOrders = await db.order.findMany({
//       orderBy: {
//         createdAt: 'desc',
//       },
//       take: 5,
//       include: {
//         user: true,
//         seller: true,
//       },
//     });

//     // Top Selling Products
//     const topProducts = await db.cartItem.groupBy({
//       by: ['productId'],
//       _sum: {
//         quantity: true,
//       },
//       orderBy: {
//         _sum: {
//           quantity: 'desc',
//         },
//       },
//       take: 5,
//       include: {
//         product: true,
//       },
//     });

//     // Sales Trends (past 30 days)
//     const salesTrends = await db.$queryRaw`
//       SELECT
//         DATE_TRUNC('day', "createdAt") as date,
//         SUM("netBilledAmount") as sales
//       FROM "Order"
//       WHERE "createdAt" >= NOW() - INTERVAL '30 days'
//       GROUP BY date
//       ORDER BY date;
//     `;

//     res.json({
//       totalSales: totalSales._sum.netBilledAmount,
//       totalUsers,
//       totalOrders,
//       totalProducts,
//       recentOrders,
//       topProducts: topProducts.map(tp => ({
//         product: tp.product,
//         quantity: tp._sum.quantity,
//       })),
//       salesTrends,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while fetching dashboard data.' });
//   }
// }

// --------------------------------------------------------------------------------




// const getAdminDashboardOverview = async (req, res) => {
//   try {
//     // Total Sales
//     const totalSales = await db.order.aggregate({
//       _sum: {
//         netBilledAmount: true,
//       },
//     });

//     // Total Users
//     const totalUsers = await db.user.count();

//     // Total Orders
//     const totalOrders = await db.order.count();

//     // Total Products
//     const totalProducts = await db.product.count({
//       where: { state: 'ACTIVE' },
//     });

//     // Sales Trends (last 30 days)
//     const salesTrends = await db.$queryRaw`
//       SELECT
//         DATE_TRUNC('day', "createdAt") AS date,
//         SUM("netBilledAmount") AS total
//       FROM "Order"
//       WHERE "createdAt" >= NOW() - INTERVAL '30 days'
//       GROUP BY DATE_TRUNC('day', "createdAt")
//       ORDER BY date ASC;
//     `;

//     // Recent Orders
//     const recentOrders = await db.order.findMany({
//       orderBy: {
//         createdAt: 'desc',
//       },
//       take: 10,
//       include: {
//         user: true,
//       },
//     });

//     // Top Products
//     const topProducts = await db.product.findMany({
//       where: {
//         state: 'ACTIVE',
//       },
//       orderBy: {
//         cartItems: {
//           _count: 'desc',
//         },
//       },
//       take: 10,
//     });

//     // Response Data
//     const responseData = {
//       totalSales: totalSales._sum.netBilledAmount,
//       totalUsers,
//       totalOrders,
//       totalProducts,
//       salesTrends,
//       recentOrders,
//       topProducts,
//     };

//     res.status(200).json(responseData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


