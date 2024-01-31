const express = require("express");
const { User, Account } = require("../db");
const z = require("zod");
const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware");

const router = express.Router();

const signupBody = z.object({
  firstName: z.string().min(3).max(30),
  lastName: z.string().min(3).max(30),
  username: z.string().email().min(3).max(50),
  password: z.string().min(8),
});

const signinBody = z.object({
  username: z.string().email().min(3).max(50),
  password: z.string().min(8),
});

router.post("/signup", async (req, res) => {
  const payload = req.body;

  const { success } = signupBody.safeParse(req.body);

  if (!success) {
    return res
      .status(411)
      .json({ message: "Email already taken / Incorrect inputs" });
  }

  const existingUser = await User.findOne({
    username: payload.username,
  });

  if (existingUser)
    return res
      .status(411)
      .json({ message: "Email already taken / Incorrect inputs" });

  const newUser = await User.create(payload);

  const userId = newUser._id;

  const newAccount = await Account.create({
    userId,
    balance: 1 + Math.floor(Math.random() * 10000),
  });

  const token = jwt.sign({ userId }, JWT_SECRET);

  return res.json({
    message: "User created successfully",
    token: token,
  });
});

router.post("/signin", async (req, res) => {
  const payload = req.body;

  const { success } = signinBody.safeParse(payload);

  if (!success)
    return res.status(411).json({ message: "Error while logging in" });

  const userExists = await User.findOne({
    username: payload.username,
    password: payload.password,
  });

  if (!userExists)
    return res.status(411).json({ message: "Error while logging in" });

  const token = jwt.sign(
    {
      userId: userExists._id,
    },
    JWT_SECRET
  );

  res.status(200).json({
    message: "Login Successful !",
    token: token,
  });
});

const updateBody = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().optional(),
});

router.put("/update", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);

  if (!success)
    return res
      .status(411)
      .json({ message: "Error while updating information" });

  await User.updateOne(
    {
      _id: req.userId,
    },
    req.body
  );

  res.json({ message: "Update successfully" });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      { firstName: { $regex: filter, $options: "i" } },
      { lastName: { $regex: filter, $options: "i" } },
    ],
  });

  res.json({
    users: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(403).json({ message: "User is not verified !" });

  const token = authHeader.split(" ")[1];

  try {
    const decodedValue = jwt.verify(token, JWT_SECRET);

    if (!decodedValue)
      return res.status(403).json({ message: "User is not verified !" });

    const user = await User.findOne({ _id: decodedValue.userId });
    console.log(user);

    return res.status(200).json({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user._id,
    });
  } catch (err) {
    return res.status(403).json({ message: "Error occured ! " + err.message });
  }
});

module.exports = router;
