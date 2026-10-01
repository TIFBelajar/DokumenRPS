/**
 * PORTAL RPS OBE - S1 TEKNIK INFORMATIKA UNIROW
 * Core SPA Logic & Controller
 */

// State Management
const state = {
  courses: [],
  filteredCourses: [],
  selectedCourse: null,
  currentSemester: 'all', // 'all', 1, 7
  searchQuery: '',
  activeModalTab: 'tab-overview'
};

// DOM Elements
const elements = {
  themeToggle: document.getElementById('theme-toggle'),
  themeIcon: document.getElementById('theme-icon'),
  searchInput: document.getElementById('search-input'),
  filterTabs: document.querySelectorAll('.filter-tab'),
  coursesGrid: document.getElementById('courses-grid'),
  statTotalMK: document.getElementById('stat-total-mk'),
  statSKS1: document.getElementById('stat-sks-1'),
  statSKS7: document.getElementById('stat-sks-7'),
  modalOverlay: document.getElementById('modal-overlay'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalTabBtns: document.querySelectorAll('.modal-tab-btn'),
  modalTabPanes: document.querySelectorAll('.tab-pane'),
  toast: document.getElementById('toast')
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  await loadCoursesData();
  bindEvents();
  checkUrlHash();
});

// Load Course Data
async function loadCoursesData() {
  try {
    if (window.RPS_DATA && Array.isArray(window.RPS_DATA) && window.RPS_DATA.length > 0) {
      state.courses = window.RPS_DATA;
    } else {
      const res = await fetch('rps_data.json');
      if (!res.ok) throw new Error('Network error loading rps_data.json');
      state.courses = await res.json();
    }
  } catch (err) {
    console.warn('Fallback loading:', err);
    if (window.RPS_DATA) {
      state.courses = window.RPS_DATA;
    } else {
      showToast('Gagal memuat data RPS.', 'error');
    }
  }

  updateStats();
  applyFilters();
}

// Update Hero Statistics
function updateStats() {
  if (!state.courses) return;
  const total = state.courses.length;
  const sem1Courses = state.courses.filter(c => c.semester === 1);
  const sem7Courses = state.courses.filter(c => c.semester === 7);

  const sks1 = sem1Courses.reduce((sum, c) => sum + (c.sks_total || 0), 0);
  const sks7 = sem7Courses.reduce((sum, c) => sum + (c.sks_total || 0), 0);

  if (elements.statTotalMK) elements.statTotalMK.textContent = total;
  if (elements.statSKS1) elements.statSKS1.textContent = `${sks1} SKS`;
  if (elements.statSKS7) elements.statSKS7.textContent = `${sks7} SKS`;
}

// Filter and Search Logic
function applyFilters() {
  let list = [...state.courses];

  // Semester Filter
  if (state.currentSemester !== 'all') {
    const semNum = parseInt(state.currentSemester, 10);
    list = list.filter(c => c.semester === semNum);
  }

  // Search Query
  if (state.searchQuery.trim() !== '') {
    const q = state.searchQuery.toLowerCase().trim();
    list = list.filter(c => {
      return (
        (c.kode && c.kode.toLowerCase().includes(q)) ||
        (c.nama && c.nama.toLowerCase().includes(q)) ||
        (c.pengembang && c.pengembang.toLowerCase().includes(q)) ||
        (c.deskripsi && c.deskripsi.toLowerCase().includes(q)) ||
        (c.rumpun && c.rumpun.toLowerCase().includes(q))
      );
    });
  }

  state.filteredCourses = list;
  renderCoursesGrid();
}

// Render Courses Grid
function renderCoursesGrid() {
  if (!elements.coursesGrid) return;

  if (state.filteredCourses.length === 0) {
    elements.coursesGrid.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3>Tidak ada mata kuliah yang cocok</h3>
        <p>Silakan coba kata kunci pencarian lain atau ubah pilihan semester.</p>
      </div>
    `;
    return;
  }

  elements.coursesGrid.innerHTML = state.filteredCourses.map(course => {
    const semBadgeClass = course.semester === 1 ? 'badge-sem1' : 'badge-sem7';
    const sksDetail = course.sks_praktik > 0 
      ? `${course.sks_total} SKS (${course.sks_teori}T + ${course.sks_praktik}P)` 
      : `${course.sks_total} SKS Teori`;

    return `
      <article class="course-card" data-kode="${course.kode}">
        <div>
          <div class="card-header">
            <span class="course-code">${course.kode}</span>
            <div class="badge-group">
              <span class="badge ${semBadgeClass}">Semester ${course.semester}</span>
              <span class="badge badge-sks">${sksDetail}</span>
            </div>
          </div>

          <h2 class="course-title">${course.nama}</h2>
          
          <div class="course-rumpun">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span>${course.rumpun || 'Mata Kuliah Wajib'}</span>
          </div>

          <p class="course-desc">${escapeHtml(course.deskripsi || 'Rencana Pembelajaran Semester standar OBE APTIKOM 2024.')}</p>

          <div class="dosen-info">
            <div class="dosen-avatar">
              ${(course.pengembang || 'D').charAt(0)}
            </div>
            <div class="dosen-text">
              <span class="dosen-label">Dosen Pengembang / Pengampu</span>
              <span class="dosen-name">${escapeHtml(course.pengembang || '-')}</span>
            </div>
          </div>
        </div>

        <div class="card-actions">
          <button type="button" class="btn-primary open-detail-btn" data-kode="${course.kode}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Detail RPS
          </button>
          
          <a href="${course.file_docx}" download class="btn-secondary" title="Unduh format .docx">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            .DOCX
          </a>
        </div>
      </article>
    `;
  }).join('');
}

// Open Course Detail Modal
function openCourseDetail(kode) {
  const course = state.courses.find(c => c.kode === kode);
  if (!course) return;

  state.selectedCourse = course;
  window.location.hash = `kode=${encodeURIComponent(course.kode)}`;

  // Populate Header
  document.getElementById('modal-kode').textContent = course.kode;
  document.getElementById('modal-title').textContent = course.nama;
  
  const semBadgeClass = course.semester === 1 ? 'badge-sem1' : 'badge-sem7';
  document.getElementById('modal-badges').innerHTML = `
    <span class="badge ${semBadgeClass}">Semester ${course.semester}</span>
    <span class="badge badge-sks">${course.sks_total} SKS (${course.sks_teori}T / ${course.sks_praktik}P)</span>
    <span class="badge" style="background:var(--bg-muted);color:var(--text-secondary);">${course.rumpun}</span>
  `;

  // Populate Tab 1: Overview
  renderTabOverview(course);

  // Populate Tab 2: CPL & CPMK
  renderTabCplCpmk(course);

  // Populate Tab 3: 16-Week Schedule
  renderTabSchedule(course);

  // Populate Tab 4: Assessment & Tasks
  renderTabAssessment(course);

  // Populate Tab 5: References
  renderTabReferences(course);

  // Update Footer Download Link
  const downloadBtn = document.getElementById('modal-download-link');
  if (downloadBtn) {
    downloadBtn.href = course.file_docx;
    downloadBtn.setAttribute('download', `RPS-${course.kode}-${course.nama}.docx`);
  }

  // Reset tab to overview
  switchModalTab('tab-overview');

  // Show Modal
  elements.modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
  elements.modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  state.selectedCourse = null;
  history.replaceState(null, '', window.location.pathname);
}

// Render Modal Tabs
function renderTabOverview(c) {
  document.getElementById('tab-overview').innerHTML = `
    <div class="section-block">
      <div class="info-grid">
        <div class="info-item">
          <span class="info-item-label">Dosen Pengembang</span>
          <span class="info-item-val">${escapeHtml(c.pengembang || '-')}</span>
        </div>
        <div class="info-item">
          <span class="info-item-label">Koordinator RMK</span>
          <span class="info-item-val">${escapeHtml(c.koordinator || c.pengembang || '-')}</span>
        </div>
        <div class="info-item">
          <span class="info-item-label">Ketua Program Studi</span>
          <span class="info-item-val">${escapeHtml(c.kaprodi || 'Amaludin Arifia, S.Kom., M.Kom.')}</span>
        </div>
        <div class="info-item">
          <span class="info-item-label">Mata Kuliah Prasyarat</span>
          <span class="info-item-val">${escapeHtml(c.syarat || 'Tidak ada')}</span>
        </div>
      </div>
    </div>

    <div class="section-block">
      <h3 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        Deskripsi Singkat Mata Kuliah
      </h3>
      <p style="font-size:0.95rem; line-height:1.7; color:var(--text-secondary);">${escapeHtml(c.deskripsi || '-')}</p>
    </div>

    ${c.bahan_kajian && c.bahan_kajian.length > 0 ? `
      <div class="section-block">
        <h3 class="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          Materi Pembelajaran / Bahan Kajian
        </h3>
        <div class="item-card">
          <ul style="padding-left:1.25rem; font-size:0.92rem; color:var(--text-secondary); line-height:1.7;">
            ${c.bahan_kajian.map(b => `<li>${formatMarkdownStyle(b)}</li>`).join('')}
          </ul>
        </div>
      </div>
    ` : ''}
  `;
}

function renderTabCplCpmk(c) {
  document.getElementById('tab-cpl').innerHTML = `
    <div class="section-block">
      <h3 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        Capaian Pembelajaran Lulusan (CPL-PRODI)
      </h3>
      ${c.cpl && c.cpl.length > 0 ? c.cpl.map(item => `
        <div class="item-card">
          <div class="item-card-header">
            <span class="item-code">${item.kode}</span>
          </div>
          <p class="item-card-text">${formatMarkdownStyle(item.deskripsi)}</p>
        </div>
      `).join('') : '<p class="text-muted">Tidak ada data CPL.</p>'}
    </div>

    <div class="section-block">
      <h3 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Capaian Pembelajaran Mata Kuliah (CPMK)
      </h3>
      ${c.cpmk && c.cpmk.length > 0 ? c.cpmk.map(item => `
        <div class="item-card">
          <div class="item-card-header">
            <span class="item-code">${item.kode}</span>
          </div>
          <p class="item-card-text">${formatMarkdownStyle(item.deskripsi)}</p>
        </div>
      `).join('') : '<p class="text-muted">Tidak ada data CPMK.</p>'}
    </div>

    <div class="section-block">
      <h3 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 11 12 14 22 4"></polyline>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
        Kemampuan Akhir Tiap Tahap Belajar (Sub-CPMK)
      </h3>
      ${c.sub_cpmk && c.sub_cpmk.length > 0 ? c.sub_cpmk.map(item => `
        <div class="item-card">
          <div class="item-card-header">
            <span class="item-code">${item.kode}</span>
          </div>
          <p class="item-card-text">${formatMarkdownStyle(item.deskripsi)}</p>
        </div>
      `).join('') : '<p class="text-muted">Tidak ada data Sub-CPMK.</p>'}
    </div>
  `;
}

function renderTabSchedule(c) {
  if (!c.mingguan || c.mingguan.length === 0) {
    document.getElementById('tab-schedule').innerHTML = '<p>Tidak ada jadwal pembelajaran mingguan.</p>';
    return;
  }

  document.getElementById('tab-schedule').innerHTML = `
    <div class="section-block">
      <h3 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        Matriks Rencana Pembelajaran 16 Pertemuan
      </h3>
      <div class="table-responsive">
        <table class="matrix-table">
          <thead>
            <tr>
              <th style="width:70px; text-align:center;">Mg Ke-</th>
              <th style="width:140px;">Sub-CPMK</th>
              <th>Bentuk, Metode & Waktu</th>
              <th>Pengalaman Belajar / Tugas</th>
              <th>Materi & Pustaka</th>
              <th style="width:75px; text-align:center;">Bobot</th>
            </tr>
          </thead>
          <tbody>
            ${c.mingguan.map(row => {
              const isExam = row.minggu === '8' || row.minggu === '16';
              const examStyle = isExam ? 'background:rgba(99,102,241,0.08); font-weight:600;' : '';
              return `
                <tr style="${examStyle}">
                  <td style="text-align:center; font-weight:700;">${row.minggu}</td>
                  <td><span class="table-tag">${escapeHtml(row.sub_cpmk)}</span></td>
                  <td>${row.metode.map(m => formatMarkdownStyle(m)).join('<br>')}</td>
                  <td>${row.penugasan.map(p => formatMarkdownStyle(p)).join('<br>')}</td>
                  <td>${row.materi.map(mat => formatMarkdownStyle(mat)).join('<br>')}</td>
                  <td style="text-align:center; font-weight:700; color:var(--brand-primary);">${row.bobot}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderTabAssessment(c) {
  let p1Html = '';
  if (c.p1_asesmen && c.p1_asesmen.rows && c.p1_asesmen.rows.length > 0) {
    const [headers, ...rows] = c.p1_asesmen.rows;
    p1Html = `
      <div class="section-block">
        <h3 class="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          ${c.p1_asesmen.title || 'Rencana Asesmen dan Bobot Penilaian per Sub-CPMK (%)'}
        </h3>
        <div class="table-responsive">
          <table class="matrix-table">
            <thead>
              <tr>
                ${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(r => `
                <tr>
                  ${r.map((cell, idx) => `<td ${idx > 1 ? 'style="text-align:center;"' : ''}>${formatMarkdownStyle(cell)}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  document.getElementById('tab-assessment').innerHTML = `
    ${p1Html}

    <div class="section-block">
      <h3 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        Mekanisme & Komposisi Penilaian
      </h3>
      <div class="item-card">
        <ul style="padding-left:1.25rem; font-size:0.92rem; color:var(--text-secondary); line-height:1.7;">
          ${(c.penilaian && c.penilaian.mekanisme) ? c.penilaian.mekanisme.map(m => `<li>${formatMarkdownStyle(m)}</li>`).join('') : '<li>Evaluasi UTS, UAS, Tugas terstruktur, dan Keaktifan.</li>'}
        </ul>
      </div>
    </div>
  `;
}

function renderTabReferences(c) {
  document.getElementById('tab-references').innerHTML = `
    <div class="section-block">
      <h3 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        Pustaka Utama
      </h3>
      ${c.pustaka_utama && c.pustaka_utama.length > 0 ? c.pustaka_utama.map(p => `
        <div class="item-card">
          <p class="item-card-text">${formatMarkdownStyle(p)}</p>
        </div>
      `).join('') : '<p class="text-muted">Buku referensi kurikulum APTIKOM 2024.</p>'}
    </div>

    ${c.pustaka_pendukung && c.pustaka_pendukung.length > 0 ? `
      <div class="section-block">
        <h3 class="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          Pustaka Pendukung & Jurnal Ilmiah
        </h3>
        ${c.pustaka_pendukung.map(p => `
          <div class="item-card">
            <p class="item-card-text">${formatMarkdownStyle(p)}</p>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
}

// Switch Tab inside Modal
function switchModalTab(tabId) {
  state.activeModalTab = tabId;

  elements.modalTabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  elements.modalTabPanes.forEach(pane => {
    pane.classList.toggle('active', pane.id === tabId);
  });
}

// Event Bindings
function bindEvents() {
  // Theme Toggle
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', toggleTheme);
  }

  // Search Input
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      applyFilters();
    });
  }

  // Filter Tabs
  elements.filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      elements.filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentSemester = tab.getAttribute('data-sem');
      applyFilters();
    });
  });

  // Delegate click for course details
  if (elements.coursesGrid) {
    elements.coursesGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.open-detail-btn');
      if (btn) {
        const kode = btn.getAttribute('data-kode');
        openCourseDetail(kode);
      }
    });
  }

  // Close Modal Events
  if (elements.modalCloseBtn) {
    elements.modalCloseBtn.addEventListener('click', closeModal);
  }

  if (elements.modalOverlay) {
    elements.modalOverlay.addEventListener('click', (e) => {
      if (e.target === elements.modalOverlay) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Modal Tab Switching
  elements.modalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchModalTab(btn.getAttribute('data-tab'));
    });
  });

  // Copy Link Button
  const copyBtn = document.getElementById('modal-copy-link');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        showToast('Tautan RPS berhasil disalin ke clipboard!');
      }).catch(() => {
        showToast('Gagal menyalin tautan.', 'error');
      });
    });
  }

  // Handle browser back/forward with hash
  window.addEventListener('hashchange', checkUrlHash);
}

// Check URL Hash for deep links (#kode=IF1404)
function checkUrlHash() {
  const hash = window.location.hash;
  if (hash.startsWith('#kode=')) {
    const kode = decodeURIComponent(hash.substring(6));
    if (state.courses.length > 0) {
      openCourseDetail(kode);
    }
  }
}

// Theme Handlers
function initTheme() {
  const saved = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  if (!elements.themeIcon) return;
  if (theme === 'dark') {
    // Sun icon for dark mode (click to go light)
    elements.themeIcon.innerHTML = `
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    `;
  } else {
    // Moon icon for light mode (click to go dark)
    elements.themeIcon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;
  }
}

// Toast Utility
let toastTimer = null;
function showToast(message, type = 'success') {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2800);
}

// Helper: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper: Simple Markdown formatting for bold, italic, tags
function formatMarkdownStyle(str) {
  if (!str) return '';
  let res = escapeHtml(str);
  // Bold **text**
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic *text*
  res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Highlight brackets [PB: ...]
  res = res.replace(/\[(PB|PT|KM):(.*?)\]/g, '<span class="table-tag">[$1:$2]</span>');
  return res;
}
