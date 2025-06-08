import { Schema, model } from "mongoose";

const skillSchema = new Schema({
  nama_skill: String,
  deskripsi_skill: String,
  efek_skill: String,
  tipe_skill: String,
  cooldwodn_skill_sec: Number,
  durasi_skill: Number,
  jumlah_tenaga_sukma: Number,
});

const soalSchema = new Schema({
  pertanyaan: String,
  pilihan_jawaban: [String],
  jawaban_benar: String,
});

const wayangSchema = new Schema({
  nama_karakter: { type: String, required: true, unique: true },
  kategori_karakter: String,
  garis_keturunan: String,
  profile_singkat: String,
  karakteristik_dan_simbolisme: String,
  senjata_andalan: String,
  peran_perwayangan: String,
  hubungan_dengan_tokoh_lainnya: String,
  kisah_populer: String,
  skill_karakter: [skillSchema],
  soal_aktivasi_skill: [soalSchema],
});

const Wayang = model("Wayang", wayangSchema, "wayang_char");
export default Wayang;
