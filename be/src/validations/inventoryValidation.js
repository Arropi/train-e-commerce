const { z, ZodError } = require("zod");

const inventCreateValidation = (req, res, next) => {
  try {
    const item_name = z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Field Item Name Cannot Be Empty"
            : "Invalid input on Item Name",
      })
      .parse(req.body.item_name);
    const no_inven = z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Field No Inventory Cannot Be Empty"
            : "Invalid input on No Inventory",
      })
      .parse(req.body.no_inventory);
    const type = z
      .enum(["praktikum", "projek"], {
        error: (iss) =>
          iss.input === undefined
            ? "Field Type Cannot Be Empty"
            : "Invalid input, should be praktikum or projek!",
      })
      .parse(req.body.type);
    const condition = z
      .enum(["good", "bad"], {
        error: (iss) =>
          iss.input === undefined
            ? "Field Condition Cannot Be Empty"
            : "Invalid input, should be good or bad!",
      })
      .parse(req.body.condition);
    const room_id = z
      .number({
        error: (iss) =>
          iss.input === undefined
            ? "Field Room Cannot Be Empty"
            : "Invalid input on Room Id",
      })
      .parse(req.body.room_id);
    const session = z.boolean({
      error: (iss) =>
        iss.input === undefined
          ? "Field Session Cannot Be Empty"
          : "Invalid input on Session",
    }).parse(req.body.special_session)
    const labolatory_id = z
      .number({
        error: (iss) =>
          iss.input === undefined
            ? "Field Laboratory Cannot Be Empty"
            : "Invalid input on Laboratory Id",
      }).parse(req.body.laboratory_id)
    const subject = z.array(z.number('Invalid input should be Number'), {
      error: (iss) =>
        iss.input === undefined
          ? "Field Subjects Cannot Be Empty"
          : "Invalid input on Subjects",
    }).parse(req.body.subjects)
    const img_url = z.string('Invalid input on img_url').optional().parse(req.body.img_url)
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
};

const inventUpdateValidation = (req, res, next) =>{
  try {
    const item_name = z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Field Item Name Cannot Be Empty"
            : "Invalid input on Item Name",
      })
      .optional().parse(req.body.item_name);
    const no_inven = z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Field No Inventory Cannot Be Empty"
            : "Invalid input on No Inventory",
      })
      .optional().parse(req.body.no_inventory);
    const type = z
      .enum(["praktikum", "projek"], {
        error: (iss) =>
          iss.input === undefined
            ? "Field Type Cannot Be Empty"
            : "Invalid input, should be praktikum or projek!",
      })
      .optional().parse(req.body.type);
    const condition = z
      .enum(["good", "bad"], {
        error: (iss) =>
          iss.input === undefined
            ? "Field Condition Cannot Be Empty"
            : "Invalid input, should be good or bad!",
      })
      .optional().parse(req.body.condition);
    const room_id = z
      .number({
        error: (iss) =>
          iss.input === undefined
            ? "Field Room Cannot Be Empty"
            : "Invalid input on Room Id",
      })
      .optional().parse(req.body.room_id);
    const session = z.boolean({
      error: (iss) =>
        iss.input === undefined
          ? "Field Room Cannot Be Empty"
          : "Invalid input on Session",
    }).optional().parse(req.body.special_session)
    const labolatory_id = z
      .number({
        error: (iss) =>
          iss.input === undefined
            ? "Field Laboratory Cannot Be Empty"
            : "Invalid input on Laboratory Id",
      }).optional().parse(req.body.laboratory_id)
    const subject = z.array(z.number('Invalid input should be Number'), {
      error: (iss) =>
        iss.input === undefined
          ? "Field Subjects Cannot Be Empty"
          : "Invalid input on Subjects",
    }).optional().parse(req.body.subjects)
    const img_url = z.string('Invalid input on img_url').optional().parse(req.body.img_url)
    if(!item_name && !no_inven && !type && !condition && !room_id && !session && !subject && !img_url && !labolatory_id) {
      res.status(400).json({
        'message': 'At least fill one of the field'
      })
    }
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
    inventCreateValidation,
    inventUpdateValidation
}