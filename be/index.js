require("dotenv").config();
const userRoute = require('./src/routes/userRoute')
const inventoriesRoute = require('./src/routes/inventoryRoute')
const laboratoriesRoute = require('./src/routes/laboratoryRoute')
const cartRoute = require('./src/routes/cartRoute')
const reservesRoute = require('./src/routes/reservesRoute')
const subjectRoute = require('./src/routes/subjectRoute')
const roomRoute = require('./src/routes/roomRoute')
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
app.use('/rooms', roomRoute)
app.use('/subjects', subjectRoute)
app.use('/inventories', inventoriesRoute)
app.use('/laboratories', laboratoriesRoute)
app.use('/cart', cartRoute)
app.use('/reserves', reservesRoute)

app.listen(port, () => {
  console.log(`Listening On Port ${port}`);
});
