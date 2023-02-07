const express = require("express");
const db = require("./models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = "cat1234";
const cors = require("cors");

const jwtGenerator = (userId) => {
  const payload = {
    user: {
      id: userId,
    },
  };

  return jwt.sign(payload, jwtSecret, { expiresIn: "1hr" });
};

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const userCreated = await db["User"].create({
      username,
      email,
      password: encryptedPassword,
    });

    const token = jwtGenerator(userCreated.id);

    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await db["User"].findOne({
      where: { email: email },
    });

    if (!userFound)
      return res.status(401).json({ message: "Password or email is wrong" });

    const validPassword = await bcrypt.compare(password, userFound.password);

    if (!validPassword)
      return res
        .status(401)
        .json({ message: "Password or email is incorrect" });

    const token = jwtGenerator(userFound.id);
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = app;
