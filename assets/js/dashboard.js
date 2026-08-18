/* =========================================================
   PLAZA DAYEUHLUHUR
   ADMIN DASHBOARD
   DASHBOARD.JS FINAL V3
   ---------------------------------------------------------
   Fitur:
   - Login protection sudah ditangani dashboard.html
   - Sidebar mobile
   - Logout
   - Statistik ekosistem
   - Status data
   - Aktivitas terbaru
   - Quick Action
   - Modal Tambah UMKM
   - LocalStorage UMKM
   - Integrasi Produk melalui halaman produk-admin.html
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("ADMIN DASHBOARD FINAL V3");
    console.log("====================================");

    initSidebar();
    initLogout();

    loadDashboardData();

    initQuickActions();

    createUmkmModal();
    initUmkmModal();

});


/* =========================================================
   SIDEBAR MOBILE
========================================================= */

function initSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("sidebarOverlay");

    const mobileButton =
        document.getElementById("mobileMenuBtn");


    if (!sidebar || !overlay || !mobileButton) {
        return;
    }


    mobileButton.addEventListener("click", function () {

        sidebar.classList.toggle("show");
        overlay.classList.toggle("show");

    });


    overlay.addEventListener("click", function () {

        sidebar.classList.remove("show");
        overlay.classList.remove("show");

    });

}


/* =========================================================
   LOGOUT
========================================================= */

function initLogout() {

    const logoutButton =
        document.getElementById("logoutButton");


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener("click", function (event) {

        event.preventDefault();


        const yakin =
            confirm(
                "Apakah Anda yakin ingin keluar dari Dashboard?"
            );


        if (!yakin) {
            return;
        }


        sessionStorage.removeItem(
            "plazaAdminLogin"
        );


        window.location.href =
            "login.html";

    });

}


/* =========================================================
   LOAD SEMUA DATA DASHBOARD
========================================================= */

async function loadDashboardData() {

    console.log(
        "Memuat data dashboard..."
    );


    const files = {

        desa: "data/desa.json",

        bumdes: "data/bumdes.json",

        umkm: "data/umkm.json",

        bisnis: "data/bisnis.json",

        bursa: "data/bursa.json",

        wisata: "data/wisata.json",

        berita: "data/berita.json",

        agenda: "data/agenda.json"

    };


    const result = {};


    for (const key in files) {

        try {

            const response =
                await fetch(
                    files[key],
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                console.warn(
                    "Data tidak ditemukan:",
                    files[key]
                );

                result[key] = [];

                continue;

            }


            const data =
                await response.json();


            result[key] =
                Array.isArray(data)
                    ? data
                    : [];


        }

        catch (error) {

            console.error(
                "Gagal membaca:",
                key,
                error
            );

            result[key] = [];

        }

    }


    /*
     * Simpan data dashboard
     */

    window.plazaDashboardData =
        result;


    /*
     * Statistik
     */

    updateDashboardStatistics(
        result
    );


    /*
     * Status sistem
     */

    updateSystemStatus(
        result
    );


    /*
     * Aktivitas
     */

    updateActivityList(
        result
    );


    console.log(
        "Data dashboard selesai dimuat.",
        result
    );

}


/* =========================================================
   UPDATE STATISTIK
========================================================= */

function updateDashboardStatistics(data) {

    const umkm =
        getCombinedUmkm(
            data.umkm
        );


    setText(
        "statDesa",
        data.desa.length
    );


    setText(
        "statBumdes",
        data.bumdes.length
    );


    setText(
        "statUmkm",
        umkm.length
    );


    setText(
        "statBisnis",
        data.bisnis.length
    );


    setText(
        "statBursa",
        data.bursa.length
    );


    setText(
        "statWisata",
        data.wisata.length
    );


    setText(
        "statBerita",
        data.berita.length
    );


    setText(
        "statAgenda",
        data.agenda.length
    );

}


/* =========================================================
   UPDATE STATUS EKOSISTEM
========================================================= */

function updateSystemStatus(data) {

    const umkm =
        getCombinedUmkm(
            data.umkm
        );


    setText(
        "statusDesa",
        data.desa.length + " DATA"
    );


    setText(
        "statusBumdes",
        data.bumdes.length + " DATA"
    );


    setText(
        "statusUmkm",
        umkm.length + " DATA"
    );


    setText(
        "statusBisnis",
        data.bisnis.length + " DATA"
    );


    setText(
        "statusBursa",
        data.bursa.length + " DATA"
    );


    setText(
        "statusWisata",
        data.wisata.length + " DATA"
    );


    setText(
        "statusBerita",
        data.berita.length + " DATA"
    );


    setText(
        "statusAgenda",
        data.agenda.length + " DATA"
    );

}


/* =========================================================
   GABUNG UMKM JSON + LOCAL STORAGE
========================================================= */

function getCombinedUmkm(jsonData = []) {

    let localData = [];


    try {

        const stored =
            localStorage.getItem(
                "plazaUmkm"
            );


        if (stored) {

            const parsed =
                JSON.parse(stored);


            if (Array.isArray(parsed)) {

                localData = parsed;

            }

        }

    }

    catch (error) {

        console.error(
            "LocalStorage UMKM rusak:",
            error
        );

    }


    return [
        ...jsonData,
        ...localData
    ];

}


/* =========================================================
   QUICK ACTION
========================================================= */

function initQuickActions() {

    /*
     * =====================================================
     * TAMBAH UMKM
     * =====================================================
     *
     * Dashboard HTML lama belum mempunyai ID
     * quickAddUmkm.
     *
     * Karena itu kita cari berdasarkan teks.
     */

    let umkmButton =
        document.getElementById(
            "quickAddUmkm"
        );


    if (!umkmButton) {

        const quickActions =
            document.querySelectorAll(
                ".quick-action"
            );


        quickActions.forEach(function (button) {

            const text =
                button.innerText
                    .toLowerCase();


            if (
                text.includes(
                    "tambah umkm"
                )
            ) {

                umkmButton = button;

            }

        });

    }


    if (umkmButton) {

        umkmButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openUmkmModal();

            }
        );

    }


    /*
     * =====================================================
     * TAMBAH PRODUK
     * =====================================================
     *
     * Produk sudah mempunyai halaman khusus:
     *
     * produk-admin.html
     *
     * Jadi tidak perlu modal produk di dashboard.
     */


    const produkButtons =
        document.querySelectorAll(
            ".quick-action"
        );


    produkButtons.forEach(function (button) {

        const text =
            button.innerText
                .toLowerCase();


        if (
            text.includes(
                "tambah produk"
            )
        ) {

            button.setAttribute(
                "href",
                "produk-admin.html"
            );

        }

    });

}


/* =========================================================
   BUAT MODAL TAMBAH UMKM
========================================================= */

function createUmkmModal() {

    /*
     * Jangan membuat modal dua kali
     */

    if (
        document.getElementById(
            "addUmkmModal"
        )
    ) {

        return;

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "addUmkmModal";


    modal.className =
        "umkm-modal-overlay";


    modal.innerHTML = `

        <div class="umkm-modal">

            <!-- HEADER -->

            <div class="umkm-modal-header">

                <div>

                    <span>
                        EKOSISTEM DIGITAL
                    </span>

                    <h3>

                        <i class="fa-solid fa-store"></i>

                        Tambah UMKM

                    </h3>

                    <p>
                        Tambahkan pelaku usaha baru
                        ke Direktori UMKM Dayeuhluhur.
                    </p>

                </div>


                <button
                    type="button"
                    class="umkm-modal-close"
                    id="closeUmkmModal">

                    <i class="fa-solid fa-xmark"></i>

                </button>

            </div>


            <!-- BODY -->

            <form
                id="formTambahUmkm"
                class="umkm-modal-body">


                <div class="row g-3">


                    <!-- NAMA -->

                    <div class="col-md-7">

                        <label>

                            Nama UMKM
                            <span>*</span>

                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-store"></i>

                            <input
                                type="text"
                                id="umkmNama"
                                placeholder="Contoh: WAHYU Barbershop"
                                required
                            >

                        </div>

                    </div>


                    <!-- KATEGORI -->

                    <div class="col-md-5">

                        <label>

                            Kategori
                            <span>*</span>

                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-layer-group"></i>

                            <select
                                id="umkmKategori"
                                required
                            >

                                <option value="">
                                    Pilih kategori
                                </option>

                                <option value="Kuliner">
                                    Kuliner
                                </option>

                                <option value="Jasa">
                                    Jasa
                                </option>

                                <option value="Perdagangan">
                                    Perdagangan
                                </option>

                                <option value="Kerajinan">
                                    Kerajinan
                                </option>

                                <option value="Fashion">
                                    Fashion
                                </option>

                                <option value="Pertanian">
                                    Pertanian
                                </option>

                                <option value="Produk Lokal">
                                    Produk Lokal
                                </option>

                            </select>

                        </div>

                    </div>


                    <!-- PRODUK / JASA -->

                    <div class="col-md-7">

                        <label>

                            Produk / Jasa
                            <span>*</span>

                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-briefcase"></i>

                            <input
                                type="text"
                                id="umkmProduk"
                                placeholder="Contoh: Potong Rambut Pria"
                                required
                            >

                        </div>

                    </div>


                    <!-- DESA -->

                    <div class="col-md-5">

                        <label>

                            Desa
                            <span>*</span>

                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-location-dot"></i>

                            <select
                                id="umkmDesa"
                                required
                            >

                                <option value="">
                                    Pilih desa
                                </option>

                                <option value="Dayeuhluhur">
                                    Dayeuhluhur
                                </option>

                                <option value="Panulisan">
                                    Panulisan
                                </option>

                                <option value="Hanum">
                                    Hanum
                                </option>

                                <option value="Bolang">
                                    Bolang
                                </option>

                                <option value="Datar">
                                    Datar
                                </option>

                                <option value="Matenggeng">
                                    Matenggeng
                                </option>

                                <option value="Cijeruk">
                                    Cijeruk
                                </option>

                                <option value="Cikalong">
                                    Cikalong
                                </option>

                                <option value="Ciwalen">
                                    Ciwalen
                                </option>

                                <option value="Panulisan Barat">
                                    Panulisan Barat
                                </option>

                                <option value="Sadabumi">
                                    Sadabumi
                                </option>

                                <option value="Sumpinghayu">
                                    Sumpinghayu
                                </option>

                                <option value="Kutaagung">
                                    Kutaagung
                                </option>

                                <option value="Bingkeng">
                                    Bingkeng
                                </option>

                                <option value="Cilumping">
                                    Cilumping
                                </option>

                                <option value="Bolawangi">
                                    Bolawangi
                                </option>

                            </select>

                        </div>

                    </div>


                    <!-- PEMILIK -->

                    <div class="col-md-6">

                        <label>
                            Nama Pemilik
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-user"></i>

                            <input
                                type="text"
                                id="umkmPemilik"
                                placeholder="Nama pemilik usaha"
                            >

                        </div>

                    </div>


                    <!-- WHATSAPP -->

                    <div class="col-md-6">

                        <label>
                            WhatsApp
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-brands fa-whatsapp"></i>

                            <input
                                type="text"
                                id="umkmWhatsapp"
                                placeholder="08xxxxxxxxxx"
                            >

                        </div>

                    </div>


                    <!-- ALAMAT -->

                    <div class="col-12">

                        <label>
                            Alamat
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-map-pin"></i>

                            <input
                                type="text"
                                id="umkmAlamat"
                                placeholder="Alamat lengkap UMKM"
                            >

                        </div>

                    </div>


                    <!-- DESKRIPSI -->

                    <div class="col-12">

                        <label>
                            Deskripsi UMKM
                        </label>

                        <textarea
                            id="umkmDeskripsi"
                            rows="3"
                            placeholder="Deskripsi singkat tentang usaha..."
                        ></textarea>

                    </div>


                    <!-- STATUS -->

                    <div class="col-md-6">

                        <label>
                            Status
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-circle-check"></i>

                            <select id="umkmStatus">

                                <option value="Buka">
                                    Buka
                                </option>

                                <option value="Tutup">
                                    Tutup
                                </option>

                            </select>

                        </div>

                    </div>


                    <!-- RATING -->

                    <div class="col-md-6">

                        <label>
                            Rating
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-star"></i>

                            <input
                                type="number"
                                id="umkmRating"
                                value="0"
                                min="0"
                                max="5"
                                step="0.1"
                            >

                        </div>

                    </div>


                    <!-- FOTO -->

                    <div class="col-12">

                        <div class="photo-upload-box">

                            <div class="photo-upload-icon">

                                <i class="fa-solid fa-image"></i>

                            </div>

                            <div>

                                <strong>
                                    Foto UMKM
                                </strong>

                                <span>
                                    Untuk tahap awal gunakan
                                    gambar default.
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                <!-- FOOTER -->

                <div class="umkm-modal-footer">

                    <button
                        type="button"
                        class="btn-modal-cancel"
                        id="cancelUmkmModal">

                        Batal

                    </button>


                    <button
                        type="submit"
                        class="btn-modal-save">

                        <i class="fa-solid fa-floppy-disk"></i>

                        Simpan UMKM

                    </button>

                </div>


            </form>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


/* =========================================================
   INIT MODAL
========================================================= */

function initUmkmModal() {

    const modal =
        document.getElementById(
            "addUmkmModal"
        );


    if (!modal) {
        return;
    }


    const closeButton =
        document.getElementById(
            "closeUmkmModal"
        );


    const cancelButton =
        document.getElementById(
            "cancelUmkmModal"
        );


    const form =
        document.getElementById(
            "formTambahUmkm"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeUmkmModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeUmkmModal
        );

    }


    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeUmkmModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {

                closeUmkmModal();

            }

        }
    );


    if (form) {

        form.addEventListener(
            "submit",
            saveNewUmkm
        );

    }

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openUmkmModal() {

    const modal =
        document.getElementById(
            "addUmkmModal"
        );


    if (!modal) {

        console.error(
            "Modal Tambah UMKM tidak ditemukan."
        );

        return;

    }


    modal.classList.add(
        "show"
    );


    document.body.classList.add(
        "modal-open-custom"
    );


    setTimeout(function () {

        const input =
            document.getElementById(
                "umkmNama"
            );


        if (input) {

            input.focus();

        }

    }, 200);

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeUmkmModal() {

    const modal =
        document.getElementById(
            "addUmkmModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "modal-open-custom"
    );

}


/* =========================================================
   SIMPAN UMKM
========================================================= */

function saveNewUmkm(event) {

    event.preventDefault();


    const nama =
        getValue("umkmNama");


    const kategori =
        getValue("umkmKategori");


    const produk =
        getValue("umkmProduk");


    const desa =
        getValue("umkmDesa");


    const pemilik =
        getValue("umkmPemilik");


    const whatsapp =
        getValue("umkmWhatsapp");


    const alamat =
        getValue("umkmAlamat");


    const deskripsi =
        getValue("umkmDeskripsi");


    const status =
        getValue("umkmStatus") ||
        "Buka";


    const rating =
        getValue("umkmRating") ||
        "0";


    /*
     * VALIDASI
     */

    if (
        !nama ||
        !kategori ||
        !produk ||
        !desa
    ) {

        showDashboardAlert(
            "warning",
            "Mohon lengkapi semua field yang wajib diisi."
        );

        return;

    }


    /*
     * DATABASE LOCAL
     */

    const existing =
        getStoredUmkm();


    /*
     * AMBIL SEMUA ID
     */

    const allIds =
        existing.map(function (item) {

            return Number(
                item.id
            ) || 0;

        });


    /*
     * AMBIL ID DARI JSON
     */

    const jsonData =
        window.plazaDashboardData &&
        Array.isArray(
            window.plazaDashboardData.umkm
        )
            ? window.plazaDashboardData.umkm
            : [];


    jsonData.forEach(function (item) {

        allIds.push(
            Number(item.id) || 0
        );

    });


    /*
     * ID BARU
     */

    const newId =
        allIds.length > 0
            ? Math.max(...allIds) + 1
            : 1;


    /*
     * SLUG
     */

    const slug =
        createSlug(
            nama
        );


    /*
     * DATA UMKM
     */

    const newUmkm = {

        id: newId,

        nama: nama,

        slug: slug,

        kategori: kategori,

        desa: desa,

        produk: produk,

        pemilik: pemilik,

        whatsapp: whatsapp,

        alamat: alamat,

        deskripsi: deskripsi,

        rating: rating,

        status: status,

        gambar:
            "assets/images/umkm/default.jpg",

        tanggal:
            new Date()
                .toISOString()
                .split("T")[0]

    };


    /*
     * SIMPAN
     */

    existing.push(
        newUmkm
    );


    try {

        localStorage.setItem(
            "plazaUmkm",
            JSON.stringify(
                existing
            )
        );

    }

    catch (error) {

        console.error(
            "Gagal menyimpan UMKM:",
            error
        );


        showDashboardAlert(
            "danger",
            "Data UMKM gagal disimpan ke browser."
        );


        return;

    }


    /*
     * AKTIVITAS
     */

    saveActivity(
        newUmkm
    );


    /*
     * REFRESH DASHBOARD
     */

    refreshDashboardAfterUmkm();


    /*
     * RESET FORM
     */

    const form =
        document.getElementById(
            "formTambahUmkm"
        );


    if (form) {

        form.reset();

    }


    setValue(
        "umkmStatus",
        "Buka"
    );


    setValue(
        "umkmRating",
        "0"
    );


    /*
     * TUTUP MODAL
     */

    closeUmkmModal();


    /*
     * NOTIFIKASI
     */

    showDashboardAlert(
        "success",
        "UMKM <strong>" +
        escapeHTML(nama) +
        "</strong> berhasil ditambahkan."
    );


    console.log(
        "UMKM baru:",
        newUmkm
    );

}


/* =========================================================
   REFRESH DASHBOARD SETELAH UMKM
========================================================= */

function refreshDashboardAfterUmkm() {

    if (
        !window.plazaDashboardData
    ) {

        window.plazaDashboardData = {

            desa: [],
            bumdes: [],
            umkm: [],
            bisnis: [],
            bursa: [],
            wisata: [],
            berita: [],
            agenda: []

        };

    }


    updateDashboardStatistics(
        window.plazaDashboardData
    );


    updateSystemStatus(
        window.plazaDashboardData
    );


    updateActivityList(
        window.plazaDashboardData
    );

}


/* =========================================================
   SIMPAN AKTIVITAS
========================================================= */

function saveActivity(umkm) {

    let activities = [];


    try {

        const stored =
            localStorage.getItem(
                "plazaActivities"
            );


        if (stored) {

            activities =
                JSON.parse(
                    stored
                );

        }


        if (!Array.isArray(activities)) {

            activities = [];

        }

    }

    catch (error) {

        console.error(
            "Aktivitas tidak dapat dibaca:",
            error
        );

        activities = [];

    }


    activities.unshift({

        type: "umkm",

        title:
            "UMKM baru ditambahkan",

        description:
            umkm.nama +
            " — " +
            umkm.desa,

        icon:
            "fa-store",

        date:
            new Date().toISOString()

    });


    /*
     * Maksimal 10 aktivitas
     */

    activities =
        activities.slice(
            0,
            10
        );


    try {

        localStorage.setItem(
            "plazaActivities",
            JSON.stringify(
                activities
            )
        );

    }

    catch (error) {

        console.error(
            "Gagal menyimpan aktivitas:",
            error
        );

    }

}


/* =========================================================
   RENDER AKTIVITAS
========================================================= */

function updateActivityList(data) {

    const container =
        document.getElementById(
            "activityList"
        );


    if (!container) {
        return;
    }


    let activities = [];


    try {

        const stored =
            localStorage.getItem(
                "plazaActivities"
            );


        if (stored) {

            activities =
                JSON.parse(
                    stored
                );

        }

    }

    catch (error) {

        console.error(
            "Gagal membaca aktivitas:",
            error
        );

        activities = [];

    }


    if (
        !Array.isArray(activities) ||
        activities.length === 0
    ) {

        container.innerHTML = `

            <div class="loading-state">

                <i class="fa-solid fa-circle-info"></i>

                Belum ada aktivitas terbaru.

            </div>

        `;

        return;

    }


    let html = "";


    activities.forEach(function (item) {

        const time =
            formatRelativeTime(
                item.date
            );


        html += `

            <div class="activity-item">

                <div class="activity-icon">

                    <i class="fa-solid
                        ${escapeHTML(
                            item.icon ||
                            "fa-bolt"
                        )}">
                    </i>

                </div>


                <div class="activity-content">

                    <strong>
                        ${escapeHTML(
                            item.title
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            item.description
                        )}
                    </span>

                    <small>
                        ${time}
                    </small>

                </div>

            </div>

        `;

    });


    container.innerHTML =
        html;

}


/* =========================================================
   DASHBOARD TOAST
========================================================= */

function showDashboardAlert(
    type,
    message
) {

    const old =
        document.querySelector(
            ".dashboard-toast"
        );


    if (old) {

        old.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "dashboard-toast " +
        type;


    let icon =
        "fa-circle-info";


    if (type === "success") {

        icon =
            "fa-circle-check";

    }


    if (type === "warning") {

        icon =
            "fa-triangle-exclamation";

    }


    if (type === "danger") {

        icon =
            "fa-circle-xmark";

    }


    toast.innerHTML = `

        <div class="toast-icon">

            <i class="fa-solid ${icon}"></i>

        </div>


        <div class="toast-content">

            ${message}

        </div>


        <button
            type="button"
            class="toast-close">

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    document.body.appendChild(
        toast
    );


    setTimeout(function () {

        toast.classList.add(
            "show"
        );

    }, 50);


    const close =
        toast.querySelector(
            ".toast-close"
        );


    if (close) {

        close.addEventListener(
            "click",
            function () {

                toast.remove();

            }
        );

    }


    setTimeout(function () {

        if (
            document.body.contains(
                toast
            )
        ) {

            toast.classList.remove(
                "show"
            );


            setTimeout(function () {

                if (
                    document.body.contains(
                        toast
                    )
                ) {

                    toast.remove();

                }

            }, 300);

        }

    }, 4000);

}


/* =========================================================
   GET STORED UMKM
========================================================= */

function getStoredUmkm() {

    try {

        const stored =
            localStorage.getItem(
                "plazaUmkm"
            );


        if (!stored) {

            return [];

        }


        const parsed =
            JSON.parse(
                stored
            );


        return Array.isArray(parsed)
            ? parsed
            : [];

    }

    catch (error) {

        console.error(
            "Error membaca localStorage UMKM:",
            error
        );


        return [];

    }

}


/* =========================================================
   GET VALUE
========================================================= */

function getValue(id) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return "";

    }


    return String(
        element.value || ""
    ).trim();

}


/* =========================================================
   SET VALUE
========================================================= */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value;

    }

}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   CREATE SLUG
========================================================= */

function createSlug(text) {

    return String(text)

        .toLowerCase()

        .trim()

        .replace(
            /[^a-z0-9\s-]/g,
            ""
        )

        .replace(
            /\s+/g,
            "-"
        )

        .replace(
            /-+/g,
            "-"
        );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   FORMAT RELATIVE TIME
========================================================= */

function formatRelativeTime(date) {

    const now =
        new Date();


    const then =
        new Date(date);


    if (
        isNaN(
            then.getTime()
        )
    ) {

        return "Baru saja";

    }


    const diff =
        Math.floor(
            (now - then) / 1000
        );


    if (diff < 60) {

        return "Baru saja";

    }


    if (diff < 3600) {

        return (
            Math.floor(
                diff / 60
            ) +
            " menit yang lalu"
        );

    }


    if (diff < 86400) {

        return (
            Math.floor(
                diff / 3600
            ) +
            " jam yang lalu"
        );

    }


    return (
        Math.floor(
            diff / 86400
        ) +
        " hari yang lalu"
    );

}


/* =========================================================
   END DASHBOARD.JS
========================================================= */