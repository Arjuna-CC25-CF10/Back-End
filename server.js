// server.js

"use strict";

import "dotenv/config"; // Cara import dotenv yang lebih modern
import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import connectDB from "./src/config/database.js";
import routes from "./src/routes/index.js"; // FIX: Menambahkan /index.js

const init = async () => {
  // 1. Hubungkan ke Database
  await connectDB();

  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // 2. Daftarkan Plugin JWT
  await server.register(Jwt);

  // 3. Definisikan Strategi Otentikasi JWT
  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400, // 4 hours
    },
    validate: (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: artifacts.decoded.payload,
      };
    },
  });

  // Helper untuk membuat token
  server.method("jwtSign", (payload) =>
    Jwt.token.generate(payload, { key: process.env.JWT_SECRET })
  );

  // 4. Daftarkan semua rute
  server.route(routes);

  await server.start();
  console.log(`🚀 Server running on ${server.info.uri}`);
  console.log(`📡 Pastikan Flask API berjalan di ${process.env.FLASK_API_URL}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
