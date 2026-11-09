# THAI RONG PLENG PALEMBANG — Website + Admin CMS

Project ini meneruskan desain `index.html` awal yang memakai tema hitam-emas, Montserrat, dan Playfair Display. Desain halaman utama tetap dipertahankan, tetapi navigasi sekarang membuka halaman tersendiri.

## Isi website

- `index.html` — Home
- `artists.html` dan `artist.html?slug=...` — daftar dan detail artis
- `bl-series.html`, `gl-series.html`, `series.html?slug=...` — daftar dan detail serial
- `news.html` dan `article.html?slug=...` — daftar dan detail berita
- `about.html`, `contact.html` — informasi perusahaan
- `page.html?slug=...` — halaman tambahan yang dibuat dari admin
- `admin/index.html` — dashboard CMS

## Fitur dashboard admin

Admin bisa login, menambah/mengedit/menghapus artis, serial, berita, dan halaman; mengubah status Draft/Published; mengunggah gambar; serta mengatur tulisan hero, informasi About, kontak, dan footer. Konten Published akan terlihat oleh pengunjung. Konten Draft hanya tampil di dashboard.

## A. Siapkan Supabase (dilakukan satu kali)

1. Buat project di https://supabase.com/.
2. Buka **SQL Editor → New query**.
3. Salin seluruh isi `database/supabase-setup.sql`, lalu klik **Run**.
4. Buka **Project Settings → API**. Salin Project URL dan anon/public key.
5. Buka `assets/js/config.js`, lalu ganti:
   - `https://YOUR_PROJECT_ID.supabase.co` dengan Project URL milikmu.
   - `YOUR_SUPABASE_ANON_KEY` dengan anon/public key.
6. Jangan pernah memasukkan `service_role` key ke website.
7. Buka **Authentication → Users → Add user**. Buat email dan password admin.
8. Salin User UID akun tersebut. Di Supabase SQL Editor jalankan query berikut dengan UID asli:

   ```sql
   insert into public.site_admins (user_id) values ('GANTI-DENGAN-USER-UID');
   ```

   Query ini hanya untuk menambahkan admin. Jangan berikan akses admin ke orang yang tidak dipercaya.

## B. Upload ke GitHub

1. Ekstrak ZIP ini di laptop.
2. Buka repositori GitHub `Direktion`.
3. Upload semua isi folder `thai-rong-pleng` ke akar repositori (root), bukan folder `thai-rong-pleng` sebagai satu folder di dalam repositori.
4. Pastikan `index.html` berada langsung di root repositori.
5. Commit changes. GitHub Pages akan menerbitkan pembaruan.
6. Website publik: `https://newstory010203-bit.github.io/Direktion/`
7. Dashboard: `https://newstory010203-bit.github.io/Direktion/admin/`

## C. Cara mengelola konten

1. Buka alamat dashboard `/admin/`.
2. Login dengan email dan password admin yang dibuat di Supabase.
3. Pilih Artists, Series, News, Pages, atau Pengaturan.
4. Klik Tambah Baru atau Edit. Pilih Draft untuk menyimpan tanpa menampilkan ke publik, atau Published agar konten muncul di website.
5. Untuk gambar, pilih file pada kolom upload gambar. Setelah upload berhasil, klik Simpan.

## Catatan penting

- Perubahan konten (berita, artis, serial, pengaturan, gambar) disimpan di Supabase. Setelah CMS terpasang, perubahan tersebut tidak memerlukan pengeditan kode dan tidak memerlukan upload ulang ke GitHub.
- Perubahan desain, tata letak, fungsi website, atau penambahan fitur baru tetap membutuhkan perubahan file website dan commit ke GitHub.
- GitHub Pages adalah hosting statis. Karena itu dashboard memakai Supabase untuk login, database, dan penyimpanan gambar.
- Jika Supabase belum dikonfigurasi, halaman publik memakai data contoh dari file JavaScript. Dashboard belum bisa login dan akan menampilkan petunjuk konfigurasi.
- Halaman tambahan yang dibuat melalui menu Pages bisa dibuka dengan URL `page.html?slug=SLUG-HALAMAN`.
- `anon/public key` memang digunakan pada browser, tetapi keamanan data tetap dijaga oleh RLS dan daftar `site_admins`. Jangan menonaktifkan RLS.

## Uji lokal

Karena halaman memakai file JavaScript dan URL relatif, jalankan melalui server lokal (misalnya VS Code Live Server), bukan dengan membuka file HTML langsung dari file manager.
