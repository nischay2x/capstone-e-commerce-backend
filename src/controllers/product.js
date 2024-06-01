import db from "../db/index.js";
import errorHandler from "../utils/errorHandler.js";
import uploadToS3 from "../utils/uploadToS3.js";

export async function search(req, res) {
    const q = req.query.q;

    if(!q) return res.status(200).json([]);

    try {
        const result = await db.product.findMany({ where: {
            description: {
                search: q
            }
        }, select: {
            id: true,
            name: true,
            category: true
        }, take: 5});

        return res.status(200).json(result);
    } catch (error) {
        return res.status(200).json([]);
    }
}

export async function addProduct(req, res) {
    const body = req.body;
    const sellerId = req.user.id;
    
    const image = req.file;

    try {
        const newProduct = await db.product.create({
            data: {
                image: "",
                name: body.name,
                category: body.category,
                description: body.description,
                price: body.price,
                sellerId: sellerId
            }
        });
        if (image) {
            let imageType = image.mimetype.split("/")[1];
            const s3Url = await uploadToS3(`products/${newProduct.id}.${imageType}`, image.buffer);
            await db.product.update({
                where: { id: newProduct.id },
                data: { image: s3Url }
            });
        }
        return res.status(201).json({ message: "Product added!" });
    } catch (error) {
        errorHandler(error, res);
    }
}

export async function getProductsBySeller(req, res) {
    const sellerId = req.user.id;

    const query = req.query.query;
    const category = req.query.category;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    try {
        let filter = {
            sellerId,
            AND: [
                { name: { search: query } },
                { category }
            ]
        }
        const products = await db.product.findMany({
            where: filter,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                category: true,
                image: true,
                updatedAt: true
            },
            take: perPage ?? 10,
            skip: (page - 1) * perPage
        });

        const count = await db.product.count({ where: filter });

        return res.status(200).json({
            products,
            page,
            perPage,
            category,
            query,
            count
        });
    } catch (error) {
        errorHandler(error, res);
    }
}

const productCategories = [
    "Bedding",
    "Kitchen",
    "Home Decor",
    "Furniture",
    "Lighting",
    "Home Organization",
    "Home Appliances"
]

function getRandomCategories(arr, count) {
    if (count > arr.length) {
        throw new Error("Count can't be greater than the array length.");
    }

    let categories = [];
    while (categories.length < count) {
        let randomIndex = Math.floor(Math.random() * arr.length);
        if (!categories.includes(arr[randomIndex])) {
            categories.push(arr[randomIndex]);
        }
    }

    return categories;
}
export async function getProducts(req, res) {
    const userId = req.user?.id;

    try {
        let previosOrderItemIds = [];
        if (userId && (Math.random() > 0.5)) {
            const orders = await db.order.findMany({ where: { userId }, select: { items: true }, orderBy: { createdAt: 'desc' }, take: 2 });
            if(orders.length){
                // chose an random order out of this two
                let chosenIndex = 0;
                let r = Math.random();
                if(orders.length === 2 && r > 0.5){
                    chosenIndex = 1;
                }

                try {
                    let orderItems = JSON.parse(orders[chosenIndex].items);
                    previosOrderItemIds = orderItems.map(i => i.id);
                } catch (e) {

                }
                
            }
        }

        let previousProducts = [];
        if(previosOrderItemIds.length) {
            previousProducts = await db.product.findMany({ where: { id: { in: previosOrderItemIds } },
                select: {
                    id: true,
                    image: true,
                    name: true,
                    description: true,
                    price: true,
                    category: true,
                }}
            )
        }

        // select any 4 categories in random from 'productCategories'
        let categories = getRandomCategories(productCategories, previousProducts.length ? 3: 4);

        const products = await db.product.findMany({ where: { category: { in: categories } },
            select: {
                id: true,
                image: true,
                name: true,
                description: true,
                price: true,
                category: true,
            },
            take: (previousProducts.length ? 3:4) * 4,
            orderBy: {
                name: "asc"
            },
        });

        // group products by category
        let grouping = [];
        categories.forEach(c => {
            grouping.push({category: c, products: products.filter(p => p.category === c)});
        })

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        return res.status(200).json({
            grouping,
            previousProducts
        });
    } catch (error) {
        errorHandler(error, res);
    }
}

export async function deleteProduct(req, res) {
    const id = parseInt(req.params.id);
    const sellerId = req.user.id; 

    try {
        await db.product.delete({ where: { id, AND: [{ sellerId }]}});
        return res.status(200).json({ message: "Product Deleted!" });
    } catch (error) {
        errorHandler(error, res);   
    }
}

export async function updateProduct(req, res) {
    const id = parseInt(req.params.id);
    const body = req.body;
    const sellerId = req.user.id;
    const image = req.file;

    let updateData = {};
    if(body.name) updateData.name = body.name;
    if(body.description) updateData.description = body.description;
    if(body.price !== undefined) updateData.price = body.price;
    if(body.category !== undefined) updateData.category = body.category;

    if (!image && !Object.keys(updateData).length){
        return res.status(400).json({
          error: "Nothing to update"  
        })
    }

    try {
        if(image) {
            let imageType = image.mimetype.split("/")[1];
            const s3Url = await uploadToS3(`products/${id}.${imageType}`, image.buffer);
            updateData.image = s3Url;
        }

        await db.product.update({ where: { id, AND: [{sellerId}]}, data: updateData });
        return res.status(200).json({ message: "Product updated!" })
    } catch (error) {
        errorHandler(error, res);
    }
}

export async function getProductById(req, res) {
    const id  = parseInt(req.params.id);
    
    const sellerId = req.user.id;
    const role = req.user.role;

    const recommend = req.query.recommend;

    try {
        let product = {};
        if(role === "SELLER"){
            product = await db.product.findUnique({
                where: { id, sellerId }
            });
        } else {
            product = await db.product.findUnique({ where: { id, state: "ACTIVE" }, select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image: true,
                category: true,
                seller: {
                    select: {
                        name: true,
                        id: true,
                    }
                }
            } });
        }

        let recs = [];
        if(recommend) {
            recs = await db.product.findMany({
                where: {
                    category: product.category
                },
                select: {
                    name: true,
                    image: true,
                    id: true
                },
                take: 5,
                skip: 0
            })
        }

        return res.status(200).json({product, recs: recs.filter(r => r.id !== product.id)});
    } catch (error) {
        errorHandler(error, res);
    }
}