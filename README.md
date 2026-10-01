# Dokumen RPS & Portal SPA - Program Studi S1 Teknik Informatika

Repositori ini memuat dokumen resmi **Rencana Pembelajaran Semester (RPS)** berbasis **Outcome-Based Education (OBE)** untuk Program Studi **S1 Teknik Informatika**, Universitas PGRI Ronggolawe (UNIROW) Tuban.

🌐 **Portal Interaktif SPA (Live Demo)**:  
👉 **[https://tifbelajar.github.io/DokumenRPS/](https://tifbelajar.github.io/DokumenRPS/)**

Penyusunan dokumen RPS ini berpedoman pada:
- **Kurikulum APTIKOM 2024** (Bidang Informatika/Ilmu Komputer).
- **Panduan Kurikulum Pendidikan Tinggi (KPT) UNIROW**.
- **Standar Nasional Pendidikan Tinggi (SN-Dikti)**.

---

## 🚀 Fitur Portal SPA

1. **Dashboard & Katalog Interaktif**: Eksplorasi 12 mata kuliah Semester 1 dan Semester 7.
2. **Pencarian Real-Time & Filter Semester**: Filter cepat berdasarkan kode MK, nama mata kuliah, dosen pengampu, atau semester.
3. **Detail RPS Lengkap**:
   - Profil mata kuliah, dosen pengembang, koordinator RMK, kaprodi.
   - Perumusan CPL, CPMK dengan Taksonomi Bloom, dan Sub-CPMK.
   - Matriks 16 Pertemuan (Minggu 1 s.d. 16, termasuk UTS dan UAS).
   - Skema Asesmen & Pembobotan Sub-CPMK (Tabel P1) serta rancangan tugas terstruktur.
   - Daftar pustaka referensi utama dan pendukung.
4. **Unduh Langsung Dokumen Word (`.docx`)** untuk setiap mata kuliah.
5. **Mode Gelap / Terang (Dark & Light Mode)** dengan transisi mulus dan penyimpanan preferensi lokal.
6. **Deep Linking Hash**: Bagikan tautan spesifik untuk masing-masing RPS (misal: `#kode=IF1404`).

---

## 📁 Struktur Direktori

```text
DokumenRPS/
├── index.html         # Halaman utama Single Page Application (SPA)
├── styles.css         # Styling modern, responsif, dan glassmorphism
├── app.js             # Logika interaktif SPA (pencarian, filter, modal, routing)
├── rps_data.js        # Dataset RPS untuk kompatibilitas offline & online
├── rps_data.json      # Endpoint data terstruktur JSON
├── .nojekyll          # Konfigurasi GitHub Pages
│
├── Output_RPS_Sem1/   # Berkas RPS Dokumen Word Semester 1 (7 Mata Kuliah)
│   ├── IF1201-Matematika/
│   ├── IF1302-Pengantar Teknologi Informasi/
│   ├── IF1303-Arsitektur Komputer/
│   ├── IF1404-Algoritma dan Pemrograman Dasar/
│   ├── IF1405-Basis Data/
│   ├── IF360424-Konsep AI/
│   └── UNV1101-Pancasila/
│
├── Output_RPS_Sem7/   # Berkas RPS Dokumen Word Semester 7 (5 Mata Kuliah)
│   ├── IF7601-Manajemen Perangkat Lunak/
│   ├── IF7602-Interaksi Manusia dan Komputer/
│   ├── IF7603-Sistem Informasi Bisnis/
│   ├── IF7604-Etika Profesi/
│   └── IF7605-Perancangan dan Pengembangan Produk/
│
└── scripts/
    └── extract_data.py # Skrip otomasi ekstraksi data RPS ke JSON
```

---

## 📚 Daftar Mata Kuliah

### Semester 1
| No | Kode MK | Nama Mata Kuliah | Bobot SKS | Format Berkas |
|:--:|:-------:|:-----------------|:---------:|:-------------:|
| 1 | `UNV1101` | Pancasila | 2 SKS | `.docx` |
| 2 | `IF1302` | Pengantar Teknologi Informasi | 3 SKS (2T + 1P) | `.docx` |
| 3 | `IF1303` | Arsitektur Komputer | 3 SKS (2T + 1P) | `.docx` |
| 4 | `IF1404` | Algoritma dan Pemrograman Dasar | 4 SKS (2T + 2P) | `.docx` |
| 5 | `IF1405` | Basis Data | 4 SKS (2T + 2P) | `.docx` |
| 6 | `IF360424` | Konsep AI | 3 SKS (2T + 1P) | `.docx` |
| 7 | `IF1201` | Matematika | 3 SKS | `.docx` |

### Semester 7
| No | Kode MK | Nama Mata Kuliah | Bobot SKS | Format Berkas |
|:--:|:-------:|:-----------------|:---------:|:-------------:|
| 1 | `IF7601` | Manajemen Perangkat Lunak | 3 SKS | `.docx` |
| 2 | `IF7602` | Interaksi Manusia dan Komputer | 3 SKS | `.docx` |
| 3 | `IF7603` | Sistem Informasi Bisnis | 3 SKS | `.docx` |
| 4 | `IF7604` | Etika Profesi | 2 SKS | `.docx` |
| 5 | `IF7605` | Perancangan dan Pengembangan Produk | 3 SKS | `.docx` |

---

## 📑 Komponen Dokumen RPS

Setiap dokumen RPS mencakup:
1. **Identitas Mata Kuliah** (Nama MK, Kode, Bobot SKS Teori/Praktik, Semester, Dosen Pengembang & Koordinator).
2. **Capaian Pembelajaran Lulusan (CPL)** yang dibebankan pada mata kuliah.
3. **Capaian Pembelajaran Mata Kuliah (CPMK) & Sub-CPMK** sesuai Taksonomi Bloom (Kognitif, Afektif, Psikomotorik).
4. **Korelasi CPL terhadap CPMK** beserta bobot kontribusinya.
5. **Deskripsi Singkat & Bahan Kajian (Materi Pembelajaran)**.
6. **Daftar Pustaka / Referensi** (Utama dan Pendukung terkini).
7. **Rencana Pembelajaran 16 Pertemuan** (Minggu 1-16, termasuk UTS pada Minggu ke-8 dan UAS pada Minggu ke-16).
8. **Rancangan Tugas Mahasiswa** (Uraian tugas, kriteria, dan indikator penilaian).
9. **Rubrik Penilaian Holistik/Analitik** berskala OBE.
