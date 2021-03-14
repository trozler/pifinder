const { urlencoded } = require("express");
const express = require("express");
const app = express();

app.use(urlencoded({ extended: false }));
