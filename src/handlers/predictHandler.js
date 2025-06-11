import axios from "axios";
import FormData from "form-data";
import Wayang from "../models/wayangModel.js";
import User from "../models/userModel.js";

const FLASK_API_URL = process.env.FLASK_API_URL;

const predictWayang = async (request, h) => {
  try {
    const { image } = request.payload;
    if (!image) {
      return h
        .response({ success: false, message: "Gambar harus disertakan" })
        .code(400);
    }
    const formData = new FormData();
    formData.append("image", image._data, {
      filename: image.hapi.filename || "wayang.jpg",
      contentType: image.hapi.headers["content-type"] || "image/jpeg",
    });
    const flaskResponse = await axios.post(FLASK_API_URL, formData, {
      headers: { ...formData.getHeaders() },
    });
    const predictionResult = flaskResponse.data.data[0];
    const predictedLabel = predictionResult.label;
    const wayangInfo = await Wayang.findOne({
      nama_karakter: { $regex: new RegExp(`^${predictedLabel}$`, "i") },
    }).lean();
    if (!wayangInfo) {
      return h
        .response({
          success: false,
          message: `Data wayang untuk "${predictedLabel}" tidak ditemukan`,
          prediction: predictionResult,
        })
        .code(404);
    }
    if (request.auth.isAuthenticated) {
      const userId = request.auth.credentials.id;
      const user = await User.findById(userId);
      if (user && !user.koleksi.includes(wayangInfo._id)) {
        user.koleksi.push(wayangInfo._id);
        user.jumlah_koleksi = user.koleksi.length;
        await user.save();
      }
    }
    return h
      .response({
        success: true,
        message: `Prediksi berhasil! Ini adalah ${predictedLabel}`,
        prediction: {
          character: predictedLabel,
          confidence: `${predictionResult.prediction}%`,
        },
        wayang: wayangInfo,
        timestamp: new Date().toISOString(),
      })
      .code(200);
  } catch (error) {
    console.error("Prediction Error:", error.message);
    if (error.code === "ECONNREFUSED") {
      return h
        .response({
          success: false,
          message: `Service prediksi di ${FLASK_API_URL} tidak tersedia`,
        })
        .code(503);
    }
    return h
      .response({ success: false, message: "Gagal melakukan prediksi" })
      .code(500);
  }
};

export default { predictWayang };
