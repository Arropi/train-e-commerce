const {z, ZodError} = require('zod')
const createInventoryToCartValidation = (req,res, next) =>{
    try {
        const inventories = z.array(z.number('Invalid input should be Number'), {
            error: (iss) =>
            iss.input === undefined
                ? "Field Inventory Cannot Be Empty"
                : "Invalid input on Subjects",
        }).parse(req.body.inventory_id)
        next()
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                message: error.issues[0].message,
            });
        } else {
            res.status(500).json({
                message: error.message,
            });
        }
    }
}

module.exports = {
    createInventoryToCartValidation
}