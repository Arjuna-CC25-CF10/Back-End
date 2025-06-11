# API Wayang Arjuna

API ini menyediakan fungsionalitas untuk manajemen pengguna, prediksi karakter wayang melalui gambar, serta pengelolaan koleksi karakter untuk setiap pengguna.

---

## 🛠️ Teknologi yang Digunakan

- **Node.js**: Lingkungan eksekusi JavaScript.
- **Hapi.js**: Framework Node.js yang robust dan kaya akan konfigurasi untuk membangun API.
- **MongoDB**: Database NoSQL untuk menyimpan data pengguna dan karakter wayang.
- **Mongoose**: ODM (Object Data Modeling) untuk berinteraksi dengan MongoDB secara elegan.
- **JWT (@hapi/jwt)**: Untuk implementasi otentikasi berbasis token.
- **Axios**: Untuk komunikasi HTTP dengan service prediksi Flask.

---

## ⚙️ Instalasi dan Persiapan

Untuk menjalankan proyek ini , ikuti langkah-langkah berikut:

### 1. Prasyarat

- [Node.js](https://nodejs.org/) (versi 18.x atau lebih tinggi)
- `npm` (biasanya terinstal bersama Node.js)
- Akun [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) untuk mendapatkan URI koneksi database.
- Pastikan API prediksi berbasis **Flask** sudah berjalan (di `https://arjuna-ml-c8dwcch7a6fdaqhk.southeastasia-01.azurewebsites.net/`).

### 2. Langkah-langkah Instalasi

1.  **Clone repository ini:**

    ```bash
    git clone <url-repository-anda>
    cd <nama-folder-proyek>
    ```

2.  **Install semua dependensi:**

    ```bash
    npm install
    ```

3.  **Buat file `.env`:**
    Buat file baru bernama `.env` di root direktori proyek. Salin konten dari contoh di bawah dan sesuaikan nilainya.

    **`.env.example`**

    ```env
    # Konfigurasi Server
    PORT=3000
    HOST=localhost

    # Koneksi MongoDB Atlas
    MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/<nama-database>?retryWrites=true&w=majority

    # Kunci Rahasia JWT (ganti dengan kunci yang Anda generate)
    JWT_SECRET=kunci_rahasia_yang_sangat_panjang_dan_aman_dari_jwtsecret_com

    # URL API Flask
    FLASK_API_URL=https://arjuna-ml-c8dwcch7a6fdaqhk.southeastasia-01.azurewebsites.net/
    ```

    Pastikan Anda sudah melakukan **IP Whitelisting** di MongoDB Atlas agar server lokal Anda bisa terhubung.

4.  **Jalankan Server:**
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:3000` dan akan otomatis restart jika ada perubahan pada file.

---

## 📖 Dokumentasi API

Berikut adalah detail dari setiap endpoint yang tersedia.

### Otentikasi

Endpoint yang dilindungi memerlukan `Authorization` header dengan format `Bearer <token>`. Token didapatkan dari endpoint `/login`.

### **`POST /register`**

Mendaftarkan pengguna baru.

- **Body (raw/json):**
  ```json
  {
    "username": "srikandi",
    "email": "srikandi@example.com",
    "password": "password123"
  }
  ```
- **Respons Sukses (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registrasi berhasil"
  }
  ```

### **`POST /login`**

Login untuk mendapatkan token otentikasi.

- **Body (raw/json):**
  ```json
  {
    "email": "srikandi@example.com",
    "password": "password123"
  }
  ```
- **Respons Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login berhasil",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### **`GET /profile`**

Mengambil data profil dan koleksi wayang dari pengguna yang sedang login.

- **Headers:**
  - `Authorization`: `Bearer <token>` **(Wajib)**
- **Respons Sukses (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "...",
      "username": "srikandi",
      "email": "srikandi@example.com",
      "jumlah_koleksi": 1,
      "koleksi": [
        {
          "_id": "...",
          "nama_karakter": "Petruk",
          "kategori_karakter": "Punokawan",
          "...": "..."
        }
      ]
    }
  }
  ```

### **`POST /predict`**

Memprediksi karakter wayang dari sebuah gambar.

- **Headers:**
  - `Authorization`: `Bearer <token>` **(Opsional)**. Jika disertakan, hasil prediksi akan ditambahkan ke koleksi.
- **Body (form-data):**
  - `key`: `image`
  - `value`: (Pilih file gambar)
- **Respons Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Prediksi berhasil! Ini adalah Petruk",
    "prediction": {
      "character": "Petruk",
      "confidence": "99.62%"
    },
    "wayang": {
      "_id": "...",
      "nama_karakter": "Petruk",
      "...": "..."
    },
    "timestamp": "..."
  }
  ```

### **`GET /wayang/{id}/questions`**

Mengambil daftar soal aktivasi skill untuk karakter wayang tertentu.

- **URL Params:**
  - `{id}`: `_id` dari karakter wayang.
- **Headers:**
  - `Authorization`: `Bearer <token>` **(Wajib)**
- **Respons Sukses (200 OK):**
  ```json
  {
    "success": true,
    "character": "Petruk",
    "questions": [
      {
        "_id": "...",
        "pertanyaan": "Siapa ayah angkat Petruk dalam pewayangan Jawa?",
        "pilihan_jawaban": ["Duryudana", "Semar", "Arjuna"],
        "jawaban_benar": "Semar"
      },
      { "...": "..." }
    ]
  }
  ```

---
