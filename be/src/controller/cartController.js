const { getCartService, createInventoryToCartService, deleteInventoryInCartService, checkoutCartService } = require("../service/cartService")

const getCart = async (req, res) => {
    try {
        const user = req.user
        const cart = await getCartService(user.id)
        res.status(200).json({
            'message': 'Getting data cart successfully',
            'data': cart
        })
    } catch (error) {
        res.status(500).json({
            'message': error.message
        })
    }
}

const createInventoryToCart= async (req, res) => {
    try {
        const user = req.user
        const data = req.body
        const cart = await createInventoryToCartService(data.inventories, user.id)
        res.status(201).json({
            'message': 'Insert inventories to cart successfully',
            'data': cart
        })
    } catch (error) {
        console.log('error:', error.message)
        if (error.cause == 'Bad Request') {
            res.status(400).json({
                'message': error.message
            })
        } else {
            res.status(500).json({
                'message': error.message
            })
        }
    }
}

const deleteInventoryCart  = async (req, res) => {
    try {
        const user = req.user
        const inventory_id = req.params.inventory_id
        const cart = await deleteInventoryInCartService(inventory_id, user.id)
        res.status(200).json({
            'message': 'Delete inventory in cart succesfully',
            'data': cart
        })
    } catch (error) {
        console.log('Error: ', error.message)
        if (error.cause == "Not Found") {
            return res.status(404).json({
                'message': error.message
            })
        }
        return res.status(500).json({
            'message': 'Internal Server Error'
        })
    }
}

module.exports = {
    getCart,
    createInventoryToCart,
    deleteInventoryCart
}

const checkoutCart = async (req, res) => {
    try {
        const user = req.user
        const result = await checkoutCartService(user.id)
        // result from deleteMany is { count: number }
        return res.status(200).json({
            message: 'Checkout successful',
            deleted: result.count
        })
    } catch (error) {
        console.log('Error during checkout: ', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {
    getCart,
    createInventoryToCart,
    deleteInventoryCart,
    checkoutCart
}