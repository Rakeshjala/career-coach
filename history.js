const router = require("express").Router();
const { Result } = require("../models");
const { wrap, protect } = require("../middleware/auth");

router.use(protect);

router.get("/", wrap(async (req, res) => res.json(await Result.find({ user: req.user._id }).sort("-createdAt").limit(50))));

router.delete("/:id", wrap(async (req, res) => {
  const r = await Result.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!r) return res.status(404).json({ error: "Not found" });
  res.json({ message: "Deleted" });
}));

module.exports = router;
