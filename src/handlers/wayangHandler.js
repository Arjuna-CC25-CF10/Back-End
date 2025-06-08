import Wayang from "../models/wayangModel.js";

const getWayangQuestions = async (request, h) => {
  try {
    const { id } = request.params;
    const wayang = await Wayang.findById(id).select(
      "nama_karakter soal_aktivasi_skill"
    );
    if (!wayang) {
      return h
        .response({ success: false, message: "Wayang tidak ditemukan" })
        .code(404);
    }

    if (
      !wayang.soal_aktivasi_skill ||
      wayang.soal_aktivasi_skill.length === 0
    ) {
      return h
        .response({
          success: false,
          message: "Soal aktivasi skill tidak ditemukan",
        })
        .code(404);
    }

    return h
      .response({
        success: true,
        message: "Soal aktivasi skill ditemukan",
        data: wayang.soal_aktivasi_skill,
      })
      .code(200);
  } catch (error) {
    console.error("Error fetching wayang questions:", error);
    if (error.kind === "ObjectId") {
      return h
        .response({ success: false, message: "ID wayang tidak valid" })
        .code(400);
    }
    return h
      .response({ success: false, message: "Internal Server Error" })
      .code(500);
  }
};

export default {
  getWayangQuestions,
};
