const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://thedevsam09:newdb1234@cluster0.qvs5ez4.mongodb.net/paytm"
);

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    lowercase: true,
    maxLength: 30,
    minLength: 3,
    required: true,
  },
  lastName: {
    type: String,
    lowercase: true,
    maxLength: 30,
    minLength: 3,
    trim: true,
    required: true,
  },
  username: {
    type: String,
    lowercase: true,
    maxLength: 25,
    trim: true,
    minLength: 3,
    unique: true,
    maxLength: 50,
    required: true,
  },
  password: { type: String, minLength: 8, required: true },
});

const User = mongoose.model("User", userSchema);

const accountSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, required: true },
});

const Account = mongoose.model("Account", accountSchema);

module.exports = {
  User,
  Account,
};
