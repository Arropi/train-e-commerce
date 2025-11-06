const { book_status } = require('@prisma/client')
const { z, ZodError} = require('zod')

const reservesCreateValidation = async (req, res, next) => {
    try {
        const pic = z.string({
            error: (iss) =>
                iss.input === undefined
            ? "Field PIC Name Cannot Be Empty"
            : "Invalid input on PIC",
        })
        const tanggal = z.coerce.date({
            error: (iss) =>
                iss.input === undefined
            ? "Field Tanggal Cannot Be Empty"
            : "Invalid input on Tanggal"
        })
        const inventories_id = z.number({
            error: (iss) =>
                iss.input === undefined
            ? "Field Inventory Cannot Be Empty"
            : "Invalid input on Inventory Id"
        })
        const session_id = z.number({
            error: (iss) =>
                iss.input === undefined
            ? "Field Session Cannot Be Empty"
            : "Invalid input on Session Id"
        })
        const subject_id = z.number({
            error: (iss) =>
                iss.input === undefined
            ? "Field Subject Cannot Be Empty"
            : "Invalid input on Subject Id"
        })
        const data = z.array(z.object({
            pic,
            tanggal,
            inventories_id,
            session_id,
            subject_id
        }, {
            error: 'Invalid Error'
        })).parse(req.body.data)
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

const reservesUpdateValidation = async (req, res, next) => {
    try {
        const pic = z.string({
            error: (iss) =>
                iss.input === undefined
            ? "Field PIC Name Cannot Be Empty"
            : "Invalid input on PIC",
        }).optional()
        const tanggal = z.coerce.date({
            error: (iss) =>
                iss.input === undefined
            ? "Field Tanggal Cannot Be Empty"
            : "Invalid input on Tanggal"
        }).optional()
        const inventories_id = z.number({
            error: (iss) =>
                iss.input === undefined
            ? "Field Inventory Cannot Be Empty"
            : "Invalid input on Inventory Id"
        }).optional()
        const session_id = z.number({
            error: (iss) =>
                iss.input === undefined
            ? "Field Session Cannot Be Empty"
            : "Invalid input on Session Id"
        }).optional()
        const status = z
        .enum(book_status, {
            error: (iss) =>
            iss.input === undefined
                ? "Field Status Cannot Be Empty"
                : "Invalid input status",
        }).optional()
        const subject_id = z.number({
            error: (iss) =>
                iss.input === undefined
            ? "Field Subject Cannot Be Empty"
            : "Invalid input on Subject Id"
        }).optional()
        z.object({
            pic,
            tanggal,
            inventories_id,
            session_id,
            status
        }, {
            error: (iss) =>
                iss.input === undefined
            ? "Cannot Be Empty Request"
            : "Invalid input"
        }).parse(req.body)
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
    reservesCreateValidation,
    reservesUpdateValidation
}