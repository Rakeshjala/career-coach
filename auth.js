const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { wrap } = require("../middleware/auth");

const reply = (u) => ({
  token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: "7d" }),
  user: { id: u._id, name: u.name, email: u.email },
});

router.post("/register", wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ error: "Name, email and a password of 6+ characters are required" });
  if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ error: "Email already registered" });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json(reply(user));
}));

router.post("/login", wrap(async (req, res) => {
  const user = await User.findOne({ email: (req.body.email || "").toLowerCase() });
  if (!user || !(await bcrypt.compare(req.body.password || "", user.password)))
    return res.status(401).json({ error: "Wrong email or password" });
  res.json(reply(user));
}));

module.exports = router;
