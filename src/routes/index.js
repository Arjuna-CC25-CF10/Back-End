import userHandler from "../handlers/userHandler.js";
import predictHandler from "../handlers/predictHandler.js";
import wayangHandler from "../handlers/wayangHandler.js";

const routes = [
  {
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return { message: "Wayang API Service v1.0" };
    },
  },
  {
    method: "POST",
    path: "/register",
    handler: userHandler.registerUser,
    options: { auth: false },
  },
  {
    method: "POST",
    path: "/login",
    handler: userHandler.loginUser,
    options: { auth: false },
  },
  {
    method: "GET",
    path: "/profile",
    handler: userHandler.getUserProfile,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "POST",
    path: "/predict",
    handler: predictHandler.predictWayang,
    options: {
      auth: {
        strategy: "jwt",
        mode: "optional",
      },
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024,
      },
    },
  },
  {
    method: "GET",
    path: "/wayang/{id}/questions",
    handler: wayangHandler.getWayangQuestions,
    options: {
      auth: "jwt",
    }, 
  },
];

export default routes;
