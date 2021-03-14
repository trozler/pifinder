const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = process.env.PORT || 3000;

// 1. Create an express API.
// 2. Hit 3 lamda instances each compute arctan(x) and returns value.

app.get("/calculate", (req, res) => {
  res.send("Hi");
});

app.listen(PORT, () => console.log("listening on port:", PORT));

// module.exports.handler = serverless(app);
