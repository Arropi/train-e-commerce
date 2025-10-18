const {z, ZodError } = require("zod");

const userValidation = (req, res, next) => {
  try {
    const username = z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Field Username Cannot Be Empty"
            : "Invalid input on username",
      })
      .parse(req.body.username);
    const email = z
      .email({
        error: (iss) =>
          iss.input === undefined
            ? "Field Email Cannot Be Empty"
            : "Invalid input on email",
      })
      .endsWith("@mail.ugm.ac.id", "Invalid email, please using ugm email")
      .parse(req.body.email);
    const img_url = z.string('Invalid input on img_url').optional().parse(req.body.img_url)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        'message': error.issues[0].message
      })
    } else {
      res.status(500).json({
        'message': error.message
      })
    }
  }
};

const updateValidation = (req, res, next) =>{
  try {
     const nim = z.string('Invalid input on nim').optional().parse(req.body.nim)
     const prodi = z.string('Invalid input on prodi').optional().parse(req.body.prodi)
     if(!nim && !prodi){
      res.status(400).json({
        'message': 'Invalid request please fill nim or prodi'
      })
     }
     next()
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        'message': error.issues[0].message
      })
    } else {
      res.status(500).json({
        'message': error.message
      })
    }
  }
}


module.exports = {
  userValidation, 
  updateValidation
}