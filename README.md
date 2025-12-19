# Car Dealer Backend

Backend API untuk aplikasi marketplace mobil. Proyek ini dibangun menggunakan framework Laravel dan menyediakan fitur manajemen inventaris mobil, transaksi penjualan, serta integrasi data kendaraan eksternal.

## Fitur Utama

* **Otentikasi Pengguna**: Registrasi, Login, Logout, dan Profil User menggunakan Laravel Sanctum.
* **Manajemen Mobil (CRUD)**: Menambah, melihat, memperbarui, dan menghapus data mobil.
* **Sistem Transaksi**: Pencatatan transaksi penjualan mobil.
* **Integrasi NHTSA**: Mengambil data merek (brands) dan model kendaraan secara real-time dari API NHTSA.
* **Keamanan**: Proteksi rute menggunakan middleware otentikasi (Sanctum).

## Teknologi yang Digunakan

* **Bahasa Pemrograman**: PHP ^8.2
* **Framework**: Laravel ^12.0
* **Otentikasi**: Laravel Sanctum ^4.0
* **Real-time**: Laravel Reverb ^1.0
* **Database**: MySQL / SQLite (Sesuai konfigurasi `.env`)

## Prasyarat Instalasi

Sebelum memulai, pastikan sistem Anda memiliki:

* PHP >= 8.2
* Composer
* Node.js & NPM (untuk aset frontend jika diperlukan)
* Database Server (MySQL/MariaDB/PostgreSQL)

## Instalasi

1.  **Clone Repositori**
    ```bash
    git clone [https://github.com/username/car-dealer-backend.git](https://github.com/username/car-dealer-backend.git)
    cd car-dealer-backend
    ```

2.  **Instal Dependensi PHP**
    ```bash
    composer install
    ```

3.  **Konfigurasi Environment**
    Salin file contoh konfigurasi dan sesuaikan kredensial database Anda.
    ```bash
    cp .env.example .env
    ```
    Buka file `.env` dan atur `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD`.

4.  **Generate Application Key**
    ```bash
    php artisan key:generate
    ```

5.  **Jalankan Migrasi Database**
    ```bash
    php artisan migrate
    ```

6.  **Jalankan Server Lokal**
    ```bash
    php artisan serve
    ```
    Aplikasi akan berjalan di `http://localhost:8000`.

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
