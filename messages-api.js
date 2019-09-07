const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

let counterRequest = 0;
const requestLimit = (req, res, next) => {
  counterRequest++;
  if (counterRequest < 6) {
    next();
  } else {
    res.status(429).end("You got to many requests!");
  }
};

app.use(requestLimit);

app.post("/messages", (req, res) => {
  const body = req.body;
  if (Object.values(body)[0] === "" || Object.keys(body).length === 0) {
    res.status(400).end();
  } else {
    console.log(Object.keys(body), Object.values(body));
    res.json({ message: "Message received loud and clear" });
  }
});

app.listen(`${port}`, () => console.log(`Server already start at ${port}`));
