const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = mongoose.model("User", new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
}, { timestamps: true }));

// One saved AI result (resume review, ATS score, roadmap, ...)
const Result = mongoose.model("Result", new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  kind: { type: String, required: true },
  input: String,
  data: Schema.Types.Mixed,
}, { timestamps: true }));

module.exports = { User, Result };
