require("dotenv").config();
const express = require("express");
const cors = require("cors");

const companyLoginRouter = require("./src/routes/company.login.routes");

const app = express();
global.__basedir = __dirname;

// *Middlewares
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use("/", companyLoginRouter);

console.log(process.env.PORT);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app;