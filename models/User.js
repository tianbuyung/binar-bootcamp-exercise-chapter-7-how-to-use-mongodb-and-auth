const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
    role: { type: String, default: "writer" },
    verifiedToken: String,
    verifiedAt: { type: Date, default: null },
    expiredTokenAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
});

const Users = mongoose.model("users", userSchema);

module.exports = Users;
