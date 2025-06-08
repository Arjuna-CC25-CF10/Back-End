// src/handlers/userHandler.js

import User from "../models/userModel.js"; // FIX: Import default User

const registerUser = async (request, h) => {
  try {
    const { username, email, password } = request.payload;
    const userExists = await User.findOne({ $or: [{ email }, { username }] }); // FIX: Panggil User.findOne
    if (userExists) {
      return h
        .response({
          success: false,
          message: "Email atau username sudah terdaftar",
        })
        .code(400);
    }
    const user = new User({ username, email, password });
    await user.save();
    return h
      .response({ success: true, message: "Registrasi berhasil" })
      .code(201);
  } catch (error) {
    console.error(error);
    return h
      .response({ success: false, message: "Internal Server Error" })
      .code(500);
  }
};

const loginUser = async (request, h) => {
  try {
    const { email, password } = request.payload;
    const user = await User.findOne({ email }); // FIX: Panggil User.findOne
    if (user && (await user.matchPassword(password))) {
      const token = request.server.methods.jwtSign({
        id: user._id,
        username: user.username,
      });
      return h
        .response({ success: true, message: "Login berhasil", token })
        .code(200);
    }
    return h
      .response({ success: false, message: "Email atau password salah" })
      .code(401);
  } catch (error) {
    console.error(error);
    return h
      .response({ success: false, message: "Internal Server Error" })
      .code(500);
  }
};

const getUserProfile = async (request, h) => {
  try {
    const userId = request.auth.credentials.id;
    const user = await User.findById(userId)
      .select("-password -__v") // Exclude password and __v field
      .populate("koleksi"); // Populate koleksi with specific fields

    if (user) {
      return h.response({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          jumlah_koleksi: user.jumlah_koleksi,
          jumlah_mandala: user.jumlah_mandala,
          koleksi: user.koleksi, // Include populated koleksi
        },
      });
    } else {
      return h
        .response({ success: false, message: "User not found" })
        .code(404);
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return h
      .response({ success: false, message: "Internal Server Error" })
      .code(500);
  }
};

export default { registerUser, loginUser, getUserProfile };
