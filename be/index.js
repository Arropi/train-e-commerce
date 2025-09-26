require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const cookie = require("cookie-parser");
const prisma = require("./src/config/dbConfig");
const { z, ZodError } = require("zod");
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookie());

app.get("/", async (req, res) => {
  const cookies = req.cookies.token;
  console.log(cookies);
  const data = await prisma.user.findFirst({
    select: {
      email: true,
      name: true,
      id: true,
    },
    where: {
      email: "ahmedi@mail.ugm.ac.id",
    },
  });
  if (data) {
    console.log("Oke");
  }
  return res.json({
    message: "Hello world",
    data: data,
  });
});



app.get("/verified", (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      res.status(200).json({
        message: "Get Succesfully This is Your Token",
        token: token,
      });
    } else {
      res.status(404).json({
        message: "Token not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

app.get('/check', (req,res) =>{
  const {authorization} = req.headers
  if(!authorization){
    return res.status(403).json({
      "message": "Token needed"
    })
  } 
  try {
    const secretToken = process.env.SECRET_TOKEN
    const token = authorization.split(' ')[1]
    const jwtDecode = jwt.verify(token, secretToken)
    req.user = jwtDecode
    return res.json({
      user: jwtDecode
    }).status(200)
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      "message": "Authorize failed"
    })
  }
})

app.post("/login", async (req, res) => {
  try {
    const data = req.body;
    const username = z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Field Username Cannot Be Empty"
            : "Invalid input",
      })
      .parse(data.username);
    const email = z
      .email({
        error: (iss) =>
          iss.input === undefined
            ? "Field Email Cannot Be Empty"
            : "Invalid input",
      })
      .endsWith("@mail.ugm.ac.id", "Invalid email, please using ugm email")
      .parse(data.email);
      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (user) {
        const token = jwt.sign({id: user.id}, process.env.SECRET_TOKEN, {expiresIn: 60 * 60 * 24,});
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24,
          path: "/",
          sameSite: "lax",
        });
        return res.status(200).json({
        success: true,
        message: "Login berhasil",
        token: token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    } else {
      const user = await prisma.user.create({
        data: {
          email: email,
          name: username,
        },
      });
      const token = jwt.sign({id: user.id}, process.env.SECRET_TOKEN, {expiresIn: 60 * 60 * 24,});
      res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24,
          path: "/",
          sameSite: "lax",
        });
      return res.status(201).json({
        success: true,
        message: "Sign Up berhasil",
        token: token,
        user: {
          id: user.id,
          email: user.email,
          username: user.name,
        },
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    return res.status(400).json({
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Listening On Port ${port}`);
});
