const {z, ZodError} = require('zod')
const createInventoryToCartValidation = (req,res, next) =>{
    try {
        const schema = z.object({
            inventories_id: z.number({
                error: (iss) =>
                iss.input === undefined
                    ? "Field Inventory Cannot Be Empty"
                    : "Invalid input on Inventory Id",
            }),
            session_id: z.number({
                error: (iss) =>
                iss.input === undefined
                    ? "Field Session Cannot Be Empty"
                    : "Invalid input on Session Id",
            }),
            tanggal:  z.coerce.date({
                error: (iss) =>
                    iss.input === undefined
                ? "Field Tanggal Cannot Be Empty"
                : "Invalid input on Tanggal"
            })
        })
        const inventories = z.array(schema).parse(req.body.inventories)
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