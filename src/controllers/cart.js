import db from "../db/index.js";
import errorHandler from "../utils/errorHandler.js";

export async function getCart(req, res) {
    const { cartId } = req.user;
    try {
        const cart = await db.cart.findUnique({
            where: { id: cartId }, select: {
                id: true,
                updatedAt: true,
                items: {
                    select: {
                        id: true,
                        quantity: true,
                        product: {
                            select: {
                                name: true,
                                price: true,
                                id: true
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).json(cart);
    } catch (error) {
        return errorHandler(error, res);
    }
}

// export async function updateCart(req, res) {
//     const { productId, quantity } = req.body;
//     const { cartId } = req.user;

//     if (quantity === 0) return res.sendStatus(400);
//     // Check if the item is already in the user's cart
//     const cart = await db.cart.findUnique({
//         where: { id: cartId },
//         select: {
//             items: {
//                 take: 1,
//                 where: { productId }
//             }
//         }
//     })
    
//     if (cart?.items?.[0]) {
//         const existingItem = cart.items[0];
//         // If it does exist, we need to increment the quantity by the amount passed in the request body
//         const updatedQuantity = existingItem.quantity + quantity;
//         // We only update the 'quantity' field of the existing item and leave other fields as they are
//         await db.cartItem.update({
//             where: { id: existingItem.id }, 
//             data: { quantity: updatedQuantity }
//         });
//     } else {
//         // If the item doesn't exist in the user's cart, create a new 'Item' object with the provided values
//         await db.cartItem.create({ data: { productId, quantity, cartId }});
//     };
//     // Return the updated cart
//     return getCart(req, res);
// }