# Car Dealer Marketplace

Aplikasi marketplace mobil yang terdiri dari Backend API berbasis Laravel dan Frontend menggunakan Next.js. Proyek ini menyediakan fitur manajemen inventaris mobil, transaksi penjualan, serta integrasi data kendaraan eksternal.

## Fitur Utama

* **Otentikasi Pengguna**: Registrasi, Login, Logout, dan Profil User (Laravel Sanctum & NextAuth/Axios).
* **Manajemen Mobil (CRUD)**: Menambah, melihat, memperbarui, dan menghapus data mobil.
* **Sistem Transaksi**: Pencatatan transaksi penjualan mobil.
* **Integrasi NHTSA**: Mengambil data merek (brands) dan model kendaraan secara real-time dari API NHTSA.
* **Keamanan**: Proteksi rute API menggunakan middleware otentikasi.

## Teknologi yang Digunakan

### Backend
* **Bahasa Pemrograman**: PHP ^8.2
* **Framework**: Laravel ^12.0
* **Otentikasi**: Laravel Sanctum ^4.0
* **Real-time**: Laravel Reverb ^1.0
* **Database**: MySQL / SQLite (Sesuai konfigurasi)

### Frontend
* **Framework**: Next.js (React)
* **Runtime**: Node.js
* **Styling**: Tailwind CSS (Opsional, umum digunakan dengan Next.js)

## Prasyarat Instalasi

Sebelum memulai, pastikan sistem Anda memiliki:

* **PHP** >= 8.2 (untuk Backend Laravel)
* **Composer** (Manajer dependensi PHP)
* **Node.js** >= 18.x & **NPM/Yarn** (Wajib untuk menjalankan Next.js)
* **Database Server** (MySQL/MariaDB/PostgreSQL)

## Instalasi

### 1. Setup Backend (Laravel)

1.  **Clone Repositori & Masuk ke Folder Backend**
    ```bash
    git clone https://github.com/XetoND/Car-Marketplace
    cd car-dealer-backend
    ```

2.  **Instal Dependensi & Konfigurasi**
    ```bash
    composer install
    cp .env.example .env
    # Atur DB_DATABASE, DB_USERNAME, dll di file .env
    php artisan key:generate
    php artisan storage:link
    php artisan migrate
    ```

3.  **Jalankan Server Backend**
    ```bash
    php artisan serve
    ```
    Backend akan berjalan di `http://localhost:8000`.

### 2. Setup Frontend (Next.js)

1.  **Masuk ke Folder Frontend**
    (Asumsi folder frontend berada sejajar dengan backend)
    ```bash
    cd ../car-dealer-frontend
    ```

2.  **Instal Dependensi**
    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Konfigurasi Environment Frontend**
    Buat file `.env.local` dan tambahkan URL backend:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ```

4.  **Jalankan Server Frontend**
    ```bash
    npm run dev
    ```
    Aplikasi frontend dapat diakses di `http://localhost:3000`.

## Contoh Penggunaan (API Endpoints)

Berikut adalah daftar endpoint API yang tersedia. Tambahkan header `Accept: application/json` pada setiap request.

### Publik
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/register` | Mendaftar akun baru |
| `POST` | `/api/login` | Masuk dan mendapatkan token |
| `GET` | `/api/mobils` | Melihat daftar mobil |
| `GET` | `/api/mobils/{id}` | Melihat detail mobil spesifik |

### Terproteksi (Butuh Bearer Token)
Sertakan header `Authorization: Bearer <token>` untuk akses endpoint ini.

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/user` | Mendapatkan data user yang sedang login |
| `POST` | `/api/logout` | Menghapus token akses |
| `POST` | `/api/mobils` | Menambahkan data mobil baru |
| `PUT` | `/api/mobils/{id}` | Memperbarui data mobil |
| `DELETE` | `/api/mobils/{id}` | Menghapus data mobil |
| `POST` | `/api/transaksi` | Mencatat transaksi baru |
| `GET` | `/api/transaksi` | Melihat riwayat transaksi |
| `GET` | `/api/brands` | Mengambil data Brand dari NHTSA |
| `GET` | `/api/models/{brand}` | Mengambil Model berdasarkan Brand |

## Kontribusi

Kontribusi selalu diterima. Silakan ikuti langkah berikut:

1.  Fork repositori ini.
2.  Buat branch fitur baru (`git checkout -b fitur-baru`).
3.  Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`).
4.  Push ke branch (`git push origin fitur-baru`).
5.  Buat Pull Request.

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](https://opensource.org/licenses/MIT).
