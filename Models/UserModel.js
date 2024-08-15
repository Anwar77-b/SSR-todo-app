const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dueDate: Date,
  addedOn: Date,
  done: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user must have a name"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "this email is already used before"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "user should confirm his password"],
    minlength: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "confirm your password correctly",
    },
  },
  tasks: [taskSchema],
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.isPasswordChangedAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangeTime = Number.parseInt(
      this.passwordChangedAt.getTime() / 1000
    );
    return passwordChangeTime > JWTTimeStamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
