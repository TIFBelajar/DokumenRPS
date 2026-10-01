import sys, os, json, re

sys.path.insert(0, '/run/media/andy/24297B1C30023129/Administrasi/RPS/SebaranMK-TIF')
import generate_rps_sem1
import generate_rps
import pandas as pd

def clean_text(t):
    if isinstance(t, str):
        return t.strip()
    return t

def format_weeks(weeks_pre, uts, weeks_post, uas):
    schedule = []
    # weeks_pre: (minggu, sub_idx, indikator, kriteria, bentuk, tugas, materi, bobot)
    for w in weeks_pre:
        schedule.append({
            'minggu': w[0],
            'sub_cpmk': f"Sub-CPMK{w[1]}",
            'indikator': w[2] if isinstance(w[2], list) else [w[2]],
            'kriteria': w[3] if isinstance(w[3], list) else [w[3]],
            'metode': w[4] if isinstance(w[4], list) else [w[4]],
            'penugasan': w[5] if isinstance(w[5], list) else [w[5]],
            'materi': w[6] if isinstance(w[6], list) else [w[6]],
            'bobot': str(w[7]) + '%' if not str(w[7]).endswith('%') else str(w[7])
        })
    
    # UTS
    uts_desc = uts[0] if isinstance(uts, (list, tuple)) else str(uts)
    uts_bobot = uts[1] if isinstance(uts, (list, tuple)) and len(uts) > 1 else '20'
    schedule.append({
        'minggu': '8',
        'sub_cpmk': 'Evaluasi Tengah Semester (UTS)',
        'indikator': ['Evaluasi penguasaan materi minggu 1 s.d. 7'],
        'kriteria': ['Kriteria: Rubrik Ujian Tertulis / Praktik'],
        'metode': ['Ujian Tengah Semester Terjadwal'],
        'penugasan': ['Mengerjakan lembar soal UTS'],
        'materi': [uts_desc],
        'bobot': str(uts_bobot) + '%' if not str(uts_bobot).endswith('%') else str(uts_bobot)
    })
    
    # weeks_post
    for w in weeks_post:
        schedule.append({
            'minggu': w[0],
            'sub_cpmk': f"Sub-CPMK{w[1]}",
            'indikator': w[2] if isinstance(w[2], list) else [w[2]],
            'kriteria': w[3] if isinstance(w[3], list) else [w[3]],
            'metode': w[4] if isinstance(w[4], list) else [w[4]],
            'penugasan': w[5] if isinstance(w[5], list) else [w[5]],
            'materi': w[6] if isinstance(w[6], list) else [w[6]],
            'bobot': str(w[7]) + '%' if not str(w[7]).endswith('%') else str(w[7])
        })
        
    # UAS
    uas_desc = uas[0] if isinstance(uas, (list, tuple)) else str(uas)
    if isinstance(uas_desc, list):
        uas_desc = ' - '.join(uas_desc)
    uas_bobot = uas[1] if isinstance(uas, (list, tuple)) and len(uas) > 1 else '20'
    schedule.append({
        'minggu': '16',
        'sub_cpmk': 'Evaluasi Akhir Semester (UAS)',
        'indikator': ['Evaluasi pencapaian kompetensi akhir seluruh materi'],
        'kriteria': ['Kriteria: Rubrik Proyek Akhir / Portofolio / Ujian Akhir'],
        'metode': ['Ujian Akhir Semester / Presentasi Proyek'],
        'penugasan': ['Laporan Akhir & Demonstrasi'],
        'materi': [uas_desc],
        'bobot': str(uas_bobot) + '%' if not str(uas_bobot).endswith('%') else str(uas_bobot)
    })
    return schedule

all_courses = []

# Process Semester 1
sem1_list = [
    ('UNV1101', 'Pancasila', generate_rps_sem1.get_c_pancasila),
    ('IF1302', 'Pengantar Teknologi Informasi', generate_rps_sem1.get_c_pti),
    ('IF1303', 'Arsitektur Komputer', generate_rps_sem1.get_c_arkom),
    ('IF1404', 'Algoritma dan Pemrograman Dasar', generate_rps_sem1.get_c_alpro),
    ('IF1405', 'Basis Data', generate_rps_sem1.get_c_basisdata),
    ('IF360424', 'Konsep AI', generate_rps_sem1.get_c_konsep_ai),
    ('IF1201', 'Matematika', generate_rps_sem1.get_c_matematika)
]

for kode, nama, fn in sem1_list:
    c = fn()
    folder_name = f"{kode}-{nama}".replace('/', '_')
    docx_rel = f"Output_RPS_Sem1/{folder_name}/RPS-{folder_name}.docx"
    abs_path = os.path.join('/run/media/andy/24297B1C30023129/Administrasi/RPS/DokumenRPS', docx_rel)
    fsize = f"{os.path.getsize(abs_path)//1024} KB" if os.path.exists(abs_path) else "55 KB"
    
    course_obj = {
        'kode': kode,
        'nama': nama,
        'semester': 1,
        'semester_label': 'Semester 1 (Gasal)',
        'sks_teori': c.get('T', 0),
        'sks_praktik': c.get('P', 0),
        'sks_total': c.get('T', 0) + c.get('P', 0),
        'rumpun': c.get('rumpun', ''),
        'tanggal': c.get('tanggal', 'September 2026'),
        'pengembang': c.get('pengembang', ''),
        'koordinator': c.get('koordinator', ''),
        'kaprodi': c.get('kaprodi', 'Amaludin Arifia, S.Kom., M.Kom.'),
        'syarat': c.get('syarat', 'Tidak ada'),
        'deskripsi': c.get('deskripsi', ''),
        'cpl': [{'kode': x[0], 'deskripsi': x[1]} for x in c.get('cpl', [])],
        'cpmk': [{'kode': x[0], 'deskripsi': x[1]} for x in c.get('cpmk', [])],
        'sub_cpmk': [{'kode': f"Sub-CPMK{i+1}", 'deskripsi': s} for i, s in enumerate(c.get('sub', []))],
        'bahan_kajian': c.get('bahan', []),
        'pustaka_utama': c.get('pustaka_utama', []),
        'pustaka_pendukung': c.get('pustaka_pendukung', []),
        'penilaian': c.get('penilaian', {}),
        'p1_asesmen': c.get('p1', {}),
        'tugas': c.get('tugas', {}),
        'mingguan': format_weeks(c.get('weeks_pre', []), c.get('uts', ('UTS', '20')), c.get('weeks_post', []), c.get('uas', ('UAS', '20'))),
        'file_docx': docx_rel,
        'file_size': fsize
    }
    all_courses.append(course_obj)

# Process Semester 7
df = pd.read_excel('/run/media/andy/24297B1C30023129/Administrasi/RPS/SebaranMK-TIF/Sebaran_MK_Unik.xlsx')
df['Semester'] = df['Semester'].astype(str).str.strip()
sem7 = df[df['Semester'] == '7']

for idx, r in sem7.iterrows():
    kode = str(r['Kode MK']).strip()
    nama = str(r['Nama MK']).strip()
    sks = r['SKS']
    dosen = str(r['Dosen Pengampu']).strip()
    koor = str(r['Dosen Koordinator MK']).strip()
    c = generate_rps.generate_default_C(nama, kode, sks, dosen, koor)
    
    folder_name = f"{kode}-{nama}".replace('/', '_')
    docx_rel = f"Output_RPS_Sem7/{folder_name}/RPS-{folder_name}.docx"
    abs_path = os.path.join('/run/media/andy/24297B1C30023129/Administrasi/RPS/DokumenRPS', docx_rel)
    fsize = f"{os.path.getsize(abs_path)//1024} KB" if os.path.exists(abs_path) else "44 KB"
    
    course_obj = {
        'kode': kode,
        'nama': nama,
        'semester': 7,
        'semester_label': 'Semester 7 (Gasal)',
        'sks_teori': c.get('T', 3),
        'sks_praktik': c.get('P', 0),
        'sks_total': c.get('T', 3) + c.get('P', 0),
        'rumpun': c.get('rumpun', '(MK Kompetensi Utama)'),
        'tanggal': c.get('tanggal', 'September 2026'),
        'pengembang': c.get('pengembang', dosen),
        'koordinator': c.get('koordinator', koor),
        'kaprodi': c.get('kaprodi', 'Amaludin Arifia, S.Kom., M.Kom.'),
        'syarat': c.get('syarat', 'Tidak ada'),
        'deskripsi': c.get('deskripsi', ''),
        'cpl': [{'kode': x[0], 'deskripsi': x[1]} for x in c.get('cpl', [])],
        'cpmk': [{'kode': x[0], 'deskripsi': x[1]} for x in c.get('cpmk', [])],
        'sub_cpmk': [{'kode': f"Sub-CPMK{i+1}", 'deskripsi': s} for i, s in enumerate(c.get('sub', []))],
        'bahan_kajian': c.get('bahan', []),
        'pustaka_utama': c.get('pustaka_utama', []),
        'pustaka_pendukung': c.get('pustaka_pendukung', []),
        'penilaian': c.get('penilaian', {}),
        'p1_asesmen': c.get('p1', {}),
        'tugas': c.get('tugas', {}),
        'mingguan': format_weeks(c.get('weeks_pre', []), c.get('uts', ('UTS', '20')), c.get('weeks_post', []), c.get('uas', ('UAS', '20'))),
        'file_docx': docx_rel,
        'file_size': fsize
    }
    all_courses.append(course_obj)

with open('/run/media/andy/24297B1C30023129/Administrasi/RPS/DokumenRPS/rps_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_courses, f, ensure_ascii=False, indent=2)

print(f"Berhasil mengekstrak {len(all_courses)} mata kuliah ke rps_data.json")
