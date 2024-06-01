import db from "../db/index.js";
import errorHandler from "../utils/errorHandler.js";

export async function addCartItem(req, res) {
    const { productId, quantity } = req.body;
    const { cartId } = req.user;

    try {
        // check if item exists in the cart
        const cart = await db.cart.findUnique({
            where: { id: cartId }, select: {
                items: {
                    where: { productId },
                    select: {
                        id: true,
                        productId: true
                    }
                }
            }
        });

        let isInCart = cart.items.length;

        if (isInCart) {
            let cartItemId = cart.items[0].id;
            req.params = { id: cartItemId };
            return updateCartItem(req, res);
        } else {
            const newItem = await db.cartItem.create({
                data: {
                    cartId,
                    productId,
                    quantity
                }
            });

            return res.status(200).json({
                id: newItem.id,
                quantity: newItem.quantity
            });
        }
    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function updateCartItem(req, res) {
    const { id } = req.params;
    const { cartId } = req.user;
    const { quantity } = req.body;

    if (quantity <= 0) {
        return deleteCartItem(req, res);
    }

    try {
        // If the user is trying to decrease the item's quantity below 1, set it to 1 instead.
        let newQuantity = Math.max(quantity, 1);

        const updated = await db.cartItem.update({ where: {  id , AND: [ { cartId }]} , data: { quantity: newQuantity } });
        return res.status(200).json({
            id: updated.id, quantity: updated.quantity
        });

    } catch (error) {
        return errorHandler(error, res);
    }
}

export async function deleteCartItem(req, res) {
    const { id } = req.params;
    const { cartId } = req.user;

    try {
        const updated = await db.cartItem.delete({ where: { id , AND: [ { cartId }] } });
        return res.status(200).json({
            id: updated.id, quantity: updated.quantity
        });
    } catch (error) {
        return res.status(404).json({ message: 'No cart item found with that ID.' });
    }
}