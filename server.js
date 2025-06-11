"use strict";

import "dotenv/config";
import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import connectDB from "./src/config/database.js";
import routes from "./src/routes/index.js";

const init = async () => {
  await connectDB();

  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register(Jwt);

  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400,
    },
    validate: (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: artifacts.decoded.payload,
      };
    },
  });

  server.method("jwtSign", (payload) =>
    Jwt.token.generate(payload, { key: process.env.JWT_SECRET })
  );

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
