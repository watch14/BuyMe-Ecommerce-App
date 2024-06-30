const express = requrire("express");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

//Ejs as view engine
app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`Server on Port: ${port}`);
});
