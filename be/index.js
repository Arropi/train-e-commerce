require("dotenv").config();
const userRoute = require('./src/routes/userRoute')
const inventoriesRoute = require('./src/routes/inventoryRoute')
const express = require("express");
const cors = require("cors");
const cookie = require("cookie-parser");

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

app.get('/', (_,res)=>{
  res.json({
    'message': 'Server Ready To Use'
  })
})

app.use('/', userRoute)
app.use('/inventories', inventoriesRoute)

app.listen(port, () => {
  console.log(`Listening On Port ${port}`);
});
