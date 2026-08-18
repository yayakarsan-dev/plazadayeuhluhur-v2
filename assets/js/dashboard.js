/* =========================================================
   PLAZA DAYEUHLUHUR
   ADMIN DASHBOARD
   DASHBOARD.JS V4 FINAL
   ---------------------------------------------------------
   Fitur:
   - Statistik seluruh ekosistem
   - Statistik Produk
   - Status ekosistem
   - Produk JSON + localStorage
   - Produk terbaru
   - Tombol Edit Produk
   - Aktivitas terbaru
   - Quick Action
   - Modal Tambah UMKM
========================================================= */


document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("ADMIN DASHBOARD V4 FINAL");
    console.log("====================================");

    initSidebar();

    initLogout();

    loadDashboardData();

    initQuickActions();

    createUmkmModal();

    initUmkmModal();

    initProductDashboard();

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

        agenda: "data/agenda.json",

        produk: "data/produk.json"

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
                    "Gagal membaca:",
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
                "Error membaca:",
                key,
                error
            );


            result[key] = [];

        }

    }


    /*
     * Gabungkan produk JSON + localStorage
     */

    result.produk =
        getCombinedProduk(
            result.produk
        );


    /*
     * Simpan data global
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


    /*
     * Produk terbaru
     */

    renderDashboardProducts(
        result.produk
    );


    console.log(
        "Data dashboard selesai dimuat.",
        result
    );

}



/* =========================================================
   GABUNG DATA PRODUK JSON + LOCAL STORAGE
========================================================= */

function getCombinedProduk(
    jsonData = []
) {

    let localData = [];


    try {

        const stored =
            localStorage.getItem(
                "plazaProduk"
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
            "LocalStorage Produk rusak:",
            error
        );

    }


    /*
     * Gabungkan.
     *
     * Produk dari JSON tetap dipertahankan.
     * Produk admin dari localStorage ditambahkan.
     */

    return [
        ...jsonData,
        ...localData
    ];

}



/* =========================================================
   UPDATE STATISTIK
========================================================= */

function updateDashboardStatistics(
    data
) {

    /*
     * DESA
     */

    setText(
        "statDesa",
        data.desa.length
    );


    /*
     * BUMDES
     */

    setText(
        "statBumdes",
        data.bumdes.length
    );


    /*
     * UMKM
     */

    const umkm =
        getCombinedUmkm(
            data.umkm
        );


    setText(
        "statUmkm",
        umkm.length
    );


    /*
     * BISNIS
     */

    setText(
        "statBisnis",
        data.bisnis.length
    );


    /*
     * BURSA
     */

    setText(
        "statBursa",
        data.bursa.length
    );


    /*
     * WISATA
     */

    setText(
        "statWisata",
        data.wisata.length
    );


    /*
     * BERITA
     */

    setText(
        "statBerita",
        data.berita.length
    );


    /*
     * AGENDA
     */

    setText(
        "statAgenda",
        data.agenda.length
    );


    /*
     * PRODUK
     */

    setText(
        "statProduk",
        data.produk.length
    );

}



/* =========================================================
   UPDATE STATUS EKOSISTEM
========================================================= */

function updateSystemStatus(
    data
) {

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


    setText(
        "statusProduk",
        data.produk.length + " DATA"
    );

}



/* =========================================================
   GABUNG DATA UMKM JSON + LOCAL STORAGE
========================================================= */

function getCombinedUmkm(
    jsonData = []
) {

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
   PRODUK DASHBOARD
========================================================= */

function initProductDashboard() {

    /*
     * Jika panel produk belum ada,
     * buat otomatis di bawah halaman dashboard.
     */

    if (
        document.getElementById(
            "dashboardProductPanel"
        )
    ) {

        return;

    }


    const main =
        document.querySelector(
            ".main-content"
        );


    if (!main) {
        return;
    }


    const footer =
        main.querySelector(
            ".dashboard-footer"
        );


    const panel =
        document.createElement(
            "section"
        );


    panel.id =
        "dashboardProductPanel";


    panel.className =
        "dashboard-panel dashboard-product-panel";


    panel.innerHTML = `

        <div class="panel-header">

            <div>

                <span>
                    ETALASE PRODUK
                </span>

                <h3>
                    Produk Terbaru
                </h3>

            </div>

            <div>

                <a
                    href="produk-admin.html"
                    class="btn btn-sm btn-primary">

                    <i class="fa-solid fa-box-open"></i>

                    Kelola Produk

                </a>

            </div>

        </div>


        <div
            id="dashboardProductList"
            class="dashboard-product-list">

            <div class="loading-state">

                <i class="fa-solid fa-spinner fa-spin"></i>

                Memuat produk...

            </div>

        </div>

    `;


    if (footer) {

        main.insertBefore(
            panel,
            footer
        );

    }

    else {

        main.appendChild(
            panel
        );

    }

}



/* =========================================================
   RENDER PRODUK DASHBOARD
========================================================= */

function renderDashboardProducts(
    products = []
) {

    const container =
        document.getElementById(
            "dashboardProductList"
        );


    if (!container) {
        return;
    }


    if (
        !Array.isArray(products) ||
        products.length === 0
    ) {

        container.innerHTML = `

            <div class="loading-state">

                <i class="fa-solid fa-box-open"></i>

                Belum ada produk.

                <br>

                <a
                    href="produk-admin.html"
                    class="btn btn-sm btn-primary mt-3">

                    Tambah Produk

                </a>

            </div>

        `;

        return;

    }


    /*
     * Ambil maksimal 8 produk terbaru
     */

    const latest =
        products
            .slice()
            .reverse()
            .slice(0, 8);


    let html = "";


    latest.forEach(
        function (product) {

            const id =
                product.id ?? "";


            const nama =
                product.nama ||
                product.namaProduk ||
                product.judul ||
                "Produk Tanpa Nama";


            const kategori =
                product.kategori ||
                product.kategoriProduk ||
                "Produk Lokal";


            const desa =
                product.desa ||
                product.desaProduk ||
                "-";


            const harga =
                product.harga ||
                product.hargaProduk ||
                "Hubungi Penjual";


            const gambar =
                product.gambar ||
                product.gambarProduk ||
                "assets/images/produk/default.jpg";


            const status =
                String(
                    product.status ||
                    product.statusProduk ||
                    "aktif"
                ).toLowerCase();


            const aktif =
                status === "aktif";


            const editUrl =
                "produk-admin.html?edit=" +
                encodeURIComponent(id);


            html += `

                <div class="dashboard-product-item">

                    <div class="dashboard-product-image">

                        <img
                            src="${escapeHTML(gambar)}"
                            alt="${escapeHTML(nama)}"
                            onerror="this.src='assets/images/produk/default.jpg'"
                        >

                    </div>


                    <div class="dashboard-product-info">

                        <strong>
                            ${escapeHTML(nama)}
                        </strong>

                        <span>
                            ${escapeHTML(kategori)}
                            •
                            ${escapeHTML(desa)}
                        </span>

                        <small>
                            ${escapeHTML(harga)}
                        </small>

                    </div>


                    <div class="dashboard-product-status">

                        <span class="
                            product-status-badge
                            ${aktif ? "active" : "inactive"}
                        ">

                            ${aktif ? "AKTIF" : "NONAKTIF"}

                        </span>

                    </div>


                    <div class="dashboard-product-action">

                        <a
                            href="${editUrl}"
                            class="btn btn-sm btn-outline-primary"
                            title="Edit Produk">

                            <i class="fa-solid fa-pen-to-square"></i>

                        </a>

                    </div>

                </div>

            `;

        }
    );


    container.innerHTML =
        html;

}



/* =========================================================
   QUICK ACTION
========================================================= */

function initQuickActions() {

    const button =
        document.getElementById(
            "quickAddUmkm"
        );


    if (!button) {

        /*
         * Tidak error.
         * Dashboard HTML lama menggunakan href="#".
         */

        return;

    }


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            openUmkmModal();

        }
    );

}



/* =========================================================
   BUAT MODAL TAMBAH UMKM
========================================================= */

function createUmkmModal() {

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


            <form
                id="formTambahUmkm"
                class="umkm-modal-body">

                <div class="row g-3">

                    <div class="col-md-7">

                        <label>
                            Nama UMKM <span>*</span>
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


                    <div class="col-md-5">

                        <label>
                            Kategori <span>*</span>
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

                            </select>

                        </div>

                    </div>


                    <div class="col-md-7">

                        <label>
                            Produk / Jasa <span>*</span>
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


                    <div class="col-md-5">

                        <label>
                            Desa <span>*</span>
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

                                <option value="Dayeuhluhur">
                                    Dayeuhluhur
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

                            </select>

                        </div>

                    </div>


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
   INIT MODAL UMKM
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
   OPEN UMKM MODAL
========================================================= */

function openUmkmModal() {

    const modal =
        document.getElementById(
            "addUmkmModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.add(
        "show"
    );


    document.body.classList.add(
        "modal-open-custom"
    );


    setTimeout(
        function () {

            const input =
                document.getElementById(
                    "umkmNama"
                );


            if (input) {
                input.focus();
            }

        },
        200
    );

}



/* =========================================================
   CLOSE UMKM MODAL
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


    const existing =
        getStoredUmkm();


    const allIds =
        existing.map(function (item) {

            return Number(
                item.id
            ) || 0;

        });


    const jsonData =
        window.plazaDashboardData &&
        Array.isArray(
            window.plazaDashboardData.umkm
        )
            ? window.plazaDashboardData.umkm
            : [];


    jsonData.forEach(
        function (item) {

            allIds.push(
                Number(item.id) || 0
            );

        }
    );


    const newId =
        allIds.length > 0
            ? Math.max(...allIds) + 1
            : 1;


    const newUmkm = {

        id: newId,

        nama: nama,

        slug:
            createSlug(nama),

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


    saveActivity(
        newUmkm
    );


    refreshDashboardAfterUmkm();


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


    closeUmkmModal();


    showDashboardAlert(
        "success",
        "UMKM <strong>" +
        escapeHTML(nama) +
        "</strong> berhasil ditambahkan."
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

            agenda: [],

            produk: []

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


    renderDashboardProducts(
        window.plazaDashboardData.produk
    );

}



/* =========================================================
   AKTIVITAS
========================================================= */

function saveActivity(
    umkm
) {

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


    activities =
        activities.slice(
            0,
            10
        );


    localStorage.setItem(
        "plazaActivities",
        JSON.stringify(
            activities
        )
    );

}



/* =========================================================
   RENDER AKTIVITAS
========================================================= */

function updateActivityList(
    data
) {

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


    activities.forEach(
        function (item) {

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

        }
    );


    container.innerHTML =
        html;

}



/* =========================================================
   ALERT
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
        icon = "fa-circle-check";
    }


    if (type === "warning") {
        icon = "fa-triangle-exclamation";
    }


    if (type === "danger") {
        icon = "fa-circle-xmark";
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


    setTimeout(
        function () {

            toast.classList.add(
                "show"
            );

        },
        50
    );


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


    setTimeout(
        function () {

            if (
                document.body.contains(
                    toast
                )
            ) {

                toast.classList.remove(
                    "show"
                );


                setTimeout(
                    function () {

                        toast.remove();

                    },
                    300
                );

            }

        },
        4000
    );

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

function getValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return "";
    }


    return element.value
        .trim();

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
   SLUG
========================================================= */

function createSlug(
    text
) {

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

function escapeHTML(
    value
) {

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

function formatRelativeTime(
    date
) {

    const now =
        new Date();


    const then =
        new Date(date);


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