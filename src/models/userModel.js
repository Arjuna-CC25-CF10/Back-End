// src/models/userModel.js

import { Schema, model } from "mongoose";
import bcrypt from "bcrypt"; // FIX: Import dari 'bcrypt' bukan 'bcryptjs'

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    jumlah_koleksi: {
      // Anda menamainya 'jumlah_koleksi' di kode awal
      type: Number,
      default: 0,
    },
    jumlah_mandala: {
      type: Number,
      default: 0,
    },
    koleksi: [
      {
        type: Schema.Types.ObjectId,
        ref: "Wayang",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10); // FIX: Panggil bcrypt.genSalt
  this.password = await bcrypt.hash(this.password, salt); // FIX: Panggil bcrypt.hash
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // FIX: Panggil bcrypt.compare
};

const User = model("User", userSchema, "user");
export default User;
