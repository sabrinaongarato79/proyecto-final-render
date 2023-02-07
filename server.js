const express = require("express");
const db = require("./models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = "cat1234";
const cors = require("cors");
const path = require("path");

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

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "endpoints.html"));
});

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

    res.status(201).json({ token });
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

app.post("/api/products/new", async (req, res) => {
  try {
    const { userId, status, availableQty, price, name } = req.body;

    const createdProduct = await db["Product"].create({
      userId,
      status,
      availableQty,
      price,
      name,
    });

    res.status(201).json({ createdProduct });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/cart/add", async (req, res) => {
  try {
    const { cartId, productId, quantity, price, status } = req.body;

    const addedProductInCart = await db["ProductInCart"].create({
      cartId,
      productId,
      quantity,
      price,
      status,
    });

    res.status(201).json({ addedProductInCart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/usuarios/:id/ordenes", async (req, res) => {
  const { id } = req.params;

  try {
    const ordenes = await db["Order"].findAll({
      where: {
        userId: id,
      },
    });

    res.status(200).json({ ordenes: ordenes.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/usuarios/:id/cart", async (req, res) => {
  try {
    const { id } = req.params;

    const userCart = await db["Cart"].findAll({
      where: {
        userId: id,
      },
    });

    res.status(200).json({ userCart: userCart.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const productos = await db["Product"].findAll({
      where: {
        availableQty: {
          [Op.gt]: 0,
        },
      },
    });

    res.status(200).json({ productos: productos.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/cart/:id/purchase", async (req, res) => {
  try {
    const { id } = req.params;

    await db["ProductInCart"].update(
      { status: "purchased" },
      {
        where: {
          cartId: id,
        },
      }
    );

    res.status(200).json({ message: "Cart purchased" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "endpoints.html"));
});

module.exports = app;
