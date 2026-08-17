/* =========================================================
   PLAZA DAYEUHLUHUR
   ADMIN WISATA
   WISATA-ADMIN.JS V1
   Statistik + Search + Filter + Listing
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("ADMIN WISATA V1");
    console.log("====================================");

    initSidebar();
    initLogout();
    loadWisataData();
    initWisataControls();
    initTambahWisata();

});


/* =========================================================
   GLOBAL DATA
========================================================= */

let wisataData = [];


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
   LOAD DATA WISATA
========================================================= */

async function loadWisataData() {

    const loading =
        document.getElementById("wisataLoading");


    try {

        console.log(
            "Membaca data wisata..."
        );


        const response =
            await fetch(
                "data/wisata.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }


        const json =
            await response.json();


        if (!Array.isArray(json)) {

            throw new Error(
                "Format wisata.json bukan array."
            );

        }


        wisataData = json;


        console.log(
            "Data wisata berhasil:",
            wisataData
        );


        updateWisataStatistics();
        populateFilters();
        renderWisata(wisataData);


    }

    catch (error) {

        console.error(
            "Gagal memuat wisata:",
            error
        );


        wisataData = [];


        showWisataError();

    }

    finally {

        if (loading) {

            loading.style.display =
                "none";

        }

    }

}


/* =========================================================
   STATISTIK WISATA
========================================================= */

function updateWisataStatistics() {

    const total =
        wisataData.length;


    const unggulan =
        wisataData.filter(function (item) {

            return normalize(
                item.status
            ) === "destinasi unggulan";

        }).length;


    const potensi =
        wisataData.filter(function (item) {

            return normalize(
                item.status
            ) === "potensi wisata";

        }).length;


    const desaUnik =
        new Set(
            wisataData
                .map(function (item) {

                    return item.desa;

                })
                .filter(Boolean)
        );


    setText(
        "totalWisata",
        total
    );


    setText(
        "wisataUnggulan",
        unggulan
    );


    setText(
        "wisataPotensi",
        potensi
    );


    setText(
        "wisataDesa",
        desaUnik.size
    );

}


/* =========================================================
   POPULATE FILTER
========================================================= */

function populateFilters() {

    const kategoriSelect =
        document.getElementById(
            "filterKategori"
        );


    const desaSelect =
        document.getElementById(
            "filterDesa"
        );


    const statusSelect =
        document.getElementById(
            "filterStatus"
        );


    if (!kategoriSelect ||
        !desaSelect ||
        !statusSelect) {

        return;

    }


    /*
     * Simpan pilihan default
     */

    kategoriSelect.innerHTML =
        `<option value="">
            Semua Kategori
        </option>`;


    desaSelect.innerHTML =
        `<option value="">
            Semua Desa
        </option>`;


    statusSelect.innerHTML =
        `<option value="">
            Semua Status
        </option>`;


    /*
     * KATEGORI
     */

    const kategori =
        [...new Set(
            wisataData
                .map(function (item) {
                    return item.kategori;
                })
                .filter(Boolean)
        )].sort();


    kategori.forEach(function (item) {

        const option =
            document.createElement("option");

        option.value =
            item;

        option.textContent =
            item;

        kategoriSelect.appendChild(
            option
        );

    });


    /*
     * DESA
     */

    const desa =
        [...new Set(
            wisataData
                .map(function (item) {
                    return item.desa;
                })
                .filter(Boolean)
        )].sort();


    desa.forEach(function (item) {

        const option =
            document.createElement("option");

        option.value =
            item;

        option.textContent =
            item;

        desaSelect.appendChild(
            option
        );

    });


    /*
     * STATUS
     */

    const status =
        [...new Set(
            wisataData
                .map(function (item) {
                    return item.status;
                })
                .filter(Boolean)
        )].sort();


    status.forEach(function (item) {

        const option =
            document.createElement("option");

        option.value =
            item;

        option.textContent =
            item;

        statusSelect.appendChild(
            option
        );

    });

}


/* =========================================================
   SEARCH + FILTER
========================================================= */

function initWisataControls() {

    const search =
        document.getElementById(
            "searchWisata"
        );


    const kategori =
        document.getElementById(
            "filterKategori"
        );


    const desa =
        document.getElementById(
            "filterDesa"
        );


    const status =
        document.getElementById(
            "filterStatus"
        );


    const reset =
        document.getElementById(
            "resetFilter"
        );


    if (search) {

        search.addEventListener(
            "input",
            applyWisataFilter
        );

    }


    if (kategori) {

        kategori.addEventListener(
            "change",
            applyWisataFilter
        );

    }


    if (desa) {

        desa.addEventListener(
            "change",
            applyWisataFilter
        );

    }


    if (status) {

        status.addEventListener(
            "change",
            applyWisataFilter
        );

    }


    if (reset) {

        reset.addEventListener(
            "click",
            function () {

                if (search) {
                    search.value = "";
                }

                if (kategori) {
                    kategori.value = "";
                }

                if (desa) {
                    desa.value = "";
                }

                if (status) {
                    status.value = "";
                }


                renderWisata(
                    wisataData
                );

            }
        );

    }

}


/* =========================================================
   APPLY FILTER
========================================================= */

function applyWisataFilter() {

    const keyword =
        (
            document.getElementById(
                "searchWisata"
            )?.value || ""
        )
        .toLowerCase()
        .trim();


    const kategori =
        document.getElementById(
            "filterKategori"
        )?.value || "";


    const desa =
        document.getElementById(
            "filterDesa"
        )?.value || "";


    const status =
        document.getElementById(
            "filterStatus"
        )?.value || "";


    const filtered =
        wisataData.filter(function (item) {

            const text = [

                item.nama,
                item.desa,
                item.kategori,
                item.jenis,
                item.status,
                item.deskripsi

            ]
            .join(" ")
            .toLowerCase();


            const matchKeyword =
                !keyword ||
                text.includes(keyword);


            const matchKategori =
                !kategori ||
                item.kategori === kategori;


            const matchDesa =
                !desa ||
                item.desa === desa;


            const matchStatus =
                !status ||
                item.status === status;


            return (
                matchKeyword &&
                matchKategori &&
                matchDesa &&
                matchStatus
            );

        });


    renderWisata(
        filtered
    );

}


/* =========================================================
   RENDER WISATA
========================================================= */

function renderWisata(
    data
) {

    const container =
        document.getElementById(
            "wisataContainer"
        );


    const empty =
        document.getElementById(
            "wisataEmpty"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!data || data.length === 0) {

        if (empty) {
            empty.style.display =
                "block";
        }

        return;

    }


    if (empty) {
        empty.style.display =
            "none";
    }


    data.forEach(function (item) {

        const col =
            document.createElement("div");


        col.className =
            "col-xl-4 col-md-6";


        col.innerHTML =
            createWisataCard(item);


        container.appendChild(
            col
        );

    });

}


/* =========================================================
   CARD WISATA
========================================================= */

function createWisataCard(
    item
) {

    const gambar =
        item.gambar ||
        "assets/images/wisata/default.jpg";


    const ikon =
        item.ikon ||
        "🌄";


    const nama =
        escapeHTML(
            item.nama
        );


    const desa =
        escapeHTML(
            item.desa
        );


    const kategori =
        escapeHTML(
            item.kategori
        );


    const jenis =
        escapeHTML(
            item.jenis
        );


    const status =
        escapeHTML(
            item.status
        );


    const deskripsi =
        escapeHTML(
            item.deskripsi
        );


    const maps =
        item.maps ||
        "#";


    let statusClass =
        "potensi";


    if (
        normalize(item.status)
        === "destinasi unggulan"
    ) {

        statusClass =
            "unggulan";

    }


    return `

        <div class="wisata-card">

            <!-- FOTO -->

            <div class="wisata-card-image">

                <img
                    src="${escapeHTML(gambar)}"
                    alt="${nama}"
                    loading="lazy"
                    onerror="this.src='assets/images/wisata/default.jpg'"
                >


                <div class="wisata-card-icon">

                    ${escapeHTML(ikon)}

                </div>


                <span
                    class="wisata-status ${statusClass}">

                    ${status}

                </span>

            </div>


            <!-- CONTENT -->

            <div class="wisata-card-body">


                <div class="wisata-card-meta">

                    <span>

                        <i class="fa-solid fa-location-dot"></i>

                        ${desa}

                    </span>


                    <span>

                        <i class="fa-solid fa-layer-group"></i>

                        ${kategori}

                    </span>

                </div>


                <h4>
                    ${nama}
                </h4>


                <div class="wisata-card-type">

                    <i class="fa-solid fa-mountain-sun"></i>

                    ${jenis}

                </div>


                <p>
                    ${deskripsi}
                </p>


                <div class="wisata-card-footer">


                    <a
                        href="${escapeHTML(maps)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn-map-wisata">

                        <i class="fa-solid fa-location-dot"></i>

                        Lihat Maps

                    </a>


                    <button
                        type="button"
                        class="btn-detail-wisata"
                        onclick="detailWisata(${Number(item.id)})">

                        Detail

                        <i class="fa-solid fa-arrow-right"></i>

                    </button>


                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   DETAIL WISATA
========================================================= */

function detailWisata(
    id
) {

    const item =
        wisataData.find(function (wisata) {

            return Number(wisata.id) === Number(id);

        });


    if (!item) {

        alert(
            "Data wisata tidak ditemukan."
        );

        return;

    }


    alert(

        "DESTINASI WISATA\n\n" +

        "Nama: " +
        item.nama +
        "\n" +

        "Kategori: " +
        item.kategori +
        "\n" +

        "Desa: " +
        item.desa +
        "\n" +

        "Jenis: " +
        item.jenis +
        "\n" +

        "Status: " +
        item.status +
        "\n\n" +

        item.deskripsi

    );

}


/* =========================================================
   TAMBAH WISATA
========================================================= */

function initTambahWisata() {

    const button =
        document.getElementById(
            "btnTambahWisata"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            openTambahWisataModal();

        }
    );

}


/* =========================================================
   MODAL TAMBAH WISATA
========================================================= */

function openTambahWisataModal() {

    /*
     * Untuk tahap pertama,
     * gunakan form sederhana.
     */

    const existing =
        document.getElementById(
            "wisataTambahModal"
        );


    if (existing) {

        existing.classList.add(
            "show"
        );

        return;

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "wisataTambahModal";


    modal.className =
        "wisata-modal-overlay show";


    modal.innerHTML = `

        <div class="wisata-modal">

            <div class="wisata-modal-header">

                <div>

                    <span>
                        EKOSISTEM DIGITAL
                    </span>

                    <h3>
                        <i class="fa-solid fa-mountain-sun"></i>
                        Tambah Destinasi Wisata
                    </h3>

                </div>


                <button
                    type="button"
                    class="wisata-modal-close"
                    id="closeWisataModal">

                    <i class="fa-solid fa-xmark"></i>

                </button>

            </div>


            <form
                id="formTambahWisata"
                class="wisata-modal-body">


                <div class="row g-3">


                    <div class="col-md-8">

                        <label>
                            Nama Destinasi *
                        </label>

                        <input
                            type="text"
                            id="wisataNama"
                            class="form-control"
                            placeholder="Contoh: Curug ..."
                            required
                        >

                    </div>


                    <div class="col-md-4">

                        <label>
                            Ikon
                        </label>

                        <input
                            type="text"
                            id="wisataIkon"
                            class="form-control"
                            value="🌄"
                            placeholder="🌄"
                        >

                    </div>


                    <div class="col-md-6">

                        <label>
                            Kategori *
                        </label>

                        <select
                            id="wisataKategori"
                            class="form-select"
                            required>

                            <option value="">
                                Pilih kategori
                            </option>

                            <option value="Curug">
                                Curug
                            </option>

                            <option value="Bukit">
                                Bukit
                            </option>

                            <option value="Alam">
                                Alam
                            </option>

                            <option value="Wisata Air">
                                Wisata Air
                            </option>

                            <option value="Wisata Edukasi">
                                Wisata Edukasi
                            </option>

                        </select>

                    </div>


                    <div class="col-md-6">

                        <label>
                            Desa *
                        </label>

                        <select
                            id="wisataDesaForm"
                            class="form-select"
                            required>

                            <option value="">
                                Pilih desa
                            </option>

                            <option>Panulisan</option>
                            <option>Hanum</option>
                            <option>Bolang</option>
                            <option>Datar</option>
                            <option>Dayeuhluhur</option>
                            <option>Matenggeng</option>
                            <option>Cijeruk</option>
                            <option>Cikalong</option>
                            <option>Ciwalen</option>
                            <option>Panulisan Barat</option>
                            <option>Sadabumi</option>
                            <option>Sumpinghayu</option>
                            <option>Kutaagung</option>
                            <option>Bingkeng</option>

                        </select>

                    </div>


                    <div class="col-md-6">

                        <label>
                            Jenis Wisata *
                        </label>

                        <select
                            id="wisataJenis"
                            class="form-select"
                            required>

                            <option value="">
                                Pilih jenis
                            </option>

                            <option value="Wisata Alam">
                                Wisata Alam
                            </option>

                            <option value="Wisata Buatan">
                                Wisata Buatan
                            </option>

                            <option value="Wisata Edukasi">
                                Wisata Edukasi
                            </option>

                            <option value="Wisata Budaya">
                                Wisata Budaya
                            </option>

                        </select>

                    </div>


                    <div class="col-md-6">

                        <label>
                            Status *
                        </label>

                        <select
                            id="wisataStatus"
                            class="form-select"
                            required>

                            <option value="Destinasi Unggulan">
                                Destinasi Unggulan
                            </option>

                            <option value="Potensi Wisata">
                                Potensi Wisata
                            </option>

                        </select>

                    </div>


                    <div class="col-12">

                        <label>
                            Deskripsi
                        </label>

                        <textarea
                            id="wisataDeskripsi"
                            class="form-control"
                            rows="4"
                            placeholder="Deskripsikan destinasi wisata..."
                        ></textarea>

                    </div>


                    <div class="col-12">

                        <label>
                            Google Maps
                        </label>

                        <input
                            type="url"
                            id="wisataMaps"
                            class="form-control"
                            placeholder="https://www.google.com/maps/..."
                        >

                    </div>


                    <div class="col-12">

                        <label>
                            Gambar
                        </label>

                        <input
                            type="text"
                            id="wisataGambar"
                            class="form-control"
                            value="assets/images/wisata/default.jpg"
                        >

                    </div>

                </div>


                <div class="wisata-modal-footer">

                    <button
                        type="button"
                        class="btn-modal-cancel"
                        id="cancelWisataModal">

                        Batal

                    </button>


                    <button
                        type="submit"
                        class="btn-modal-save">

                        <i class="fa-solid fa-floppy-disk"></i>

                        Simpan Wisata

                    </button>

                </div>

            </form>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    document
        .getElementById("closeWisataModal")
        ?.addEventListener(
            "click",
            closeTambahWisataModal
        );


    document
        .getElementById("cancelWisataModal")
        ?.addEventListener(
            "click",
            closeTambahWisataModal
        );


    document
        .getElementById("formTambahWisata")
        ?.addEventListener(
            "submit",
            saveNewWisata
        );

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeTambahWisataModal() {

    const modal =
        document.getElementById(
            "wisataTambahModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   SAVE WISATA
========================================================= */

function saveNewWisata(
    event
) {

    event.preventDefault();


    const nama =
        getInputValue(
            "wisataNama"
        );


    const kategori =
        getInputValue(
            "wisataKategori"
        );


    const desa =
        getInputValue(
            "wisataDesaForm"
        );


    const jenis =
        getInputValue(
            "wisataJenis"
        );


    const status =
        getInputValue(
            "wisataStatus"
        );


    const ikon =
        getInputValue(
            "wisataIkon"
        ) || "🌄";


    const deskripsi =
        getInputValue(
            "wisataDeskripsi"
        );


    const maps =
        getInputValue(
            "wisataMaps"
        );


    const gambar =
        getInputValue(
            "wisataGambar"
        ) ||
        "assets/images/wisata/default.jpg";


    if (
        !nama ||
        !kategori ||
        !desa ||
        !jenis ||
        !status
    ) {

        alert(
            "Mohon lengkapi field yang wajib diisi."
        );

        return;

    }


    /*
     * ID baru
     */

    const ids =
        wisataData.map(function (item) {

            return Number(item.id) || 0;

        });


    const newId =
        ids.length
            ? Math.max(...ids) + 1
            : 1;


    const newWisata = {

        id: newId,

        nama: nama,

        slug: createSlug(
            nama
        ),

        kategori: kategori,

        ikon: ikon,

        desa: desa,

        jenis: jenis,

        status: status,

        deskripsi: deskripsi,

        gambar: gambar,

        maps: maps

    };


    /*
     * Simpan ke localStorage
     */

    let localWisata =
        getLocalWisata();


    localWisata.push(
        newWisata
    );


    localStorage.setItem(
        "plazaWisata",
        JSON.stringify(
            localWisata
        )
    );


    /*
     * Tambahkan ke tampilan
     */

    wisataData.push(
        newWisata
    );


    updateWisataStatistics();

    populateFilters();

    renderWisata(
        wisataData
    );


    closeTambahWisataModal();


    alert(
        "Destinasi \"" +
        nama +
        "\" berhasil ditambahkan."
    );


    console.log(
        "Wisata baru:",
        newWisata
    );

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function getLocalWisata() {

    try {

        const stored =
            localStorage.getItem(
                "plazaWisata"
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
            "Gagal membaca localStorage wisata:",
            error
        );


        return [];

    }

}


/* =========================================================
   ERROR STATE
========================================================= */

function showWisataError() {

    const container =
        document.getElementById(
            "wisataContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="col-12">

            <div class="wisata-empty">

                <div class="empty-icon">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                </div>

                <h3>
                    Data wisata gagal dimuat
                </h3>

                <p>
                    Pastikan file
                    <strong>
                        data/wisata.json
                    </strong>
                    tersedia dan format JSON benar.
                </p>

            </div>

        </div>

    `;

}


/* =========================================================
   HELPER
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


function getInputValue(
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


function normalize(
    value
) {

    return String(
        value || ""
    )
    .toLowerCase()
    .trim();

}


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
   WISATA ADMIN V2
   MODAL TAMBAH / EDIT WISATA
========================================================= */

function createWisataModal() {

    if (document.getElementById("wisataModal")) {
        return;
    }

    const modal = document.createElement("div");

    modal.id = "wisataModal";
    modal.className = "wisata-modal-overlay";

    modal.innerHTML = `

        <div class="wisata-modal">

            <!-- HEADER -->

            <div class="wisata-modal-header">

                <div>

                    <span>
                        EKOSISTEM DIGITAL
                    </span>

                    <h3 id="wisataModalTitle">

                        <i class="fa-solid fa-mountain-sun"></i>

                        Tambah Destinasi Wisata

                    </h3>

                    <p>
                        Tambahkan informasi destinasi wisata
                        Kecamatan Dayeuhluhur.
                    </p>

                </div>


                <button
                    type="button"
                    class="wisata-modal-close"
                    id="closeWisataModal">

                    <i class="fa-solid fa-xmark"></i>

                </button>

            </div>


            <!-- FORM -->

            <form
                id="formWisata"
                class="wisata-modal-body">

                <input
                    type="hidden"
                    id="wisataId">


                <div class="row g-3">


                    <!-- NAMA -->

                    <div class="col-md-8">

                        <label>
                            Nama Destinasi
                            <span>*</span>
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-mountain-sun"></i>

                            <input
                                type="text"
                                id="wisataNama"
                                placeholder="Contoh: Curug Cimandaway"
                                required>

                        </div>

                    </div>


                    <!-- IKON -->

                    <div class="col-md-4">

                        <label>
                            Ikon
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-icons"></i>

                            <input
                                type="text"
                                id="wisataIkon"
                                placeholder="💦">

                        </div>

                    </div>


                    <!-- KATEGORI -->

                    <div class="col-md-4">

                        <label>
                            Kategori
                            <span>*</span>
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-layer-group"></i>

                            <select
                                id="wisataKategori"
                                required>

                                <option value="">
                                    Pilih kategori
                                </option>

                                <option value="Curug">
                                    Curug
                                </option>

                                <option value="Bukit">
                                    Bukit
                                </option>

                                <option value="Alam">
                                    Alam
                                </option>

                                <option value="Wisata Air">
                                    Wisata Air
                                </option>

                                <option value="Agrowisata">
                                    Agrowisata
                                </option>

                                <option value="Budaya">
                                    Budaya
                                </option>

                                <option value="Religi">
                                    Religi
                                </option>

                                <option value="Lainnya">
                                    Lainnya
                                </option>

                            </select>

                        </div>

                    </div>


                    <!-- JENIS -->

                    <div class="col-md-4">

                        <label>
                            Jenis Wisata
                            <span>*</span>
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-tree"></i>

                            <select
                                id="wisataJenis"
                                required>

                                <option value="">
                                    Pilih jenis
                                </option>

                                <option value="Wisata Alam">
                                    Wisata Alam
                                </option>

                                <option value="Wisata Budaya">
                                    Wisata Budaya
                                </option>

                                <option value="Wisata Religi">
                                    Wisata Religi
                                </option>

                                <option value="Wisata Edukasi">
                                    Wisata Edukasi
                                </option>

                                <option value="Wisata Keluarga">
                                    Wisata Keluarga
                                </option>

                                <option value="Wisata Air">
                                    Wisata Air
                                </option>

                            </select>

                        </div>

                    </div>


                    <!-- DESA -->

                    <div class="col-md-4">

                        <label>
                            Desa
                            <span>*</span>
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-location-dot"></i>

                            <select
                                id="wisataDesa"
                                required>

                                <option value="">
                                    Pilih desa
                                </option>

                                <option>Panulisan</option>
                                <option>Hanum</option>
                                <option>Bolang</option>
                                <option>Datar</option>
                                <option>Dayeuhluhur</option>
                                <option>Matenggeng</option>
                                <option>Cijeruk</option>
                                <option>Cikalong</option>
                                <option>Ciwalen</option>
                                <option>Panulisan Barat</option>
                                <option>Sadabumi</option>
                                <option>Sumpinghayu</option>
                                <option>Kutaagung</option>
                                <option>Bingkeng</option>

                            </select>

                        </div>

                    </div>


                    <!-- STATUS -->

                    <div class="col-md-6">

                        <label>
                            Status
                            <span>*</span>
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-star"></i>

                            <select
                                id="wisataStatus"
                                required>

                                <option value="Destinasi Unggulan">
                                    Destinasi Unggulan
                                </option>

                                <option value="Potensi Wisata">
                                    Potensi Wisata
                                </option>

                            </select>

                        </div>

                    </div>


                    <!-- MAPS -->

                    <div class="col-md-6">

                        <label>
                            Link Google Maps
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-map"></i>

                            <input
                                type="url"
                                id="wisataMaps"
                                placeholder="https://www.google.com/maps/...">

                        </div>

                    </div>


                    <!-- GAMBAR -->

                    <div class="col-12">

                        <label>
                            Path Gambar
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-image"></i>

                            <input
                                type="text"
                                id="wisataGambar"
                                value="assets/images/wisata/default.jpg"
                                placeholder="assets/images/wisata/nama.jpg">

                        </div>

                        <small class="form-help">
                            Untuk sementara gunakan path gambar
                            yang sudah tersedia di folder wisata.
                        </small>

                    </div>


                    <!-- DESKRIPSI -->

                    <div class="col-12">

                        <label>
                            Deskripsi
                        </label>

                        <textarea
                            id="wisataDeskripsi"
                            rows="4"
                            placeholder="Deskripsi singkat tentang destinasi wisata...">
                        </textarea>

                    </div>

                </div>


                <!-- FOOTER -->

                <div class="wisata-modal-footer">

                    <button
                        type="button"
                        class="btn-modal-cancel"
                        id="cancelWisataModal">

                        Batal

                    </button>


                    <button
                        type="submit"
                        class="btn-modal-save">

                        <i class="fa-solid fa-floppy-disk"></i>

                        Simpan Wisata

                    </button>

                </div>

            </form>

        </div>

    `;

    document.body.appendChild(modal);
}


/* =========================================================
   INIT MODAL WISATA
========================================================= */

function initWisataModal() {

    const modal =
        document.getElementById("wisataModal");

    if (!modal) {
        return;
    }

    const close =
        document.getElementById("closeWisataModal");

    const cancel =
        document.getElementById("cancelWisataModal");

    const form =
        document.getElementById("formWisata");


    if (close) {
        close.addEventListener(
            "click",
            closeWisataModal
        );
    }


    if (cancel) {
        cancel.addEventListener(
            "click",
            closeWisataModal
        );
    }


    modal.addEventListener(
        "click",
        function(event) {

            if (event.target === modal) {
                closeWisataModal();
            }

        }
    );


    if (form) {

        form.addEventListener(
            "submit",
            saveWisata
        );

    }


    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {

                closeWisataModal();

            }

        }
    );

}


/* =========================================================
   OPEN TAMBAH WISATA
========================================================= */

function openAddWisataModal() {

    const modal =
        document.getElementById("wisataModal");

    if (!modal) {
        return;
    }

    const form =
        document.getElementById("formWisata");

    if (form) {
        form.reset();
    }

    document.getElementById("wisataId").value = "";

    document.getElementById("wisataGambar").value =
        "assets/images/wisata/default.jpg";


    document.getElementById("wisataModalTitle").innerHTML = `

        <i class="fa-solid fa-mountain-sun"></i>

        Tambah Destinasi Wisata

    `;


    modal.classList.add("show");

    document.body.classList.add(
        "modal-open-custom"
    );

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeWisataModal() {

    const modal =
        document.getElementById("wisataModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("show");

    document.body.classList.remove(
        "modal-open-custom"
    );

}


/* =========================================================
   GENERATE SLUG
========================================================= */

function createWisataSlug(nama) {

    return String(nama)

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
   SIMPAN WISATA
========================================================= */

function saveWisata(event) {

    event.preventDefault();


    const nama =
        document.getElementById("wisataNama").value.trim();

    const kategori =
        document.getElementById("wisataKategori").value;

    const ikon =
        document.getElementById("wisataIkon").value.trim();

    const desa =
        document.getElementById("wisataDesa").value;

    const jenis =
        document.getElementById("wisataJenis").value;

    const status =
        document.getElementById("wisataStatus").value;

    const deskripsi =
        document.getElementById("wisataDeskripsi").value.trim();

    const gambar =
        document.getElementById("wisataGambar").value.trim();

    const maps =
        document.getElementById("wisataMaps").value.trim();


    if (
        !nama ||
        !kategori ||
        !desa ||
        !jenis ||
        !status
    ) {

        alert(
            "Mohon lengkapi field yang wajib diisi."
        );

        return;
    }


    const stored =
        JSON.parse(
            localStorage.getItem("plazaWisata") || "[]"
        );


    const jsonData =
        window.plazaWisataData || [];


    const allData = [
        ...jsonData,
        ...stored
    ];


    const ids =
        allData.map(
            item => Number(item.id) || 0
        );


    const newId =
        ids.length
            ? Math.max(...ids) + 1
            : 1;


    const wisataBaru = {

        id: newId,

        nama: nama,

        slug:
            createWisataSlug(nama),

        kategori: kategori,

        ikon:
            ikon || "🏞️",

        desa: desa,

        jenis: jenis,

        status: status,

        deskripsi: deskripsi,

        gambar:
            gambar ||
            "assets/images/wisata/default.jpg",

        maps: maps

    };


    stored.push(
        wisataBaru
    );


    localStorage.setItem(
        "plazaWisata",
        JSON.stringify(stored)
    );


    closeWisataModal();


    showWisataNotification(
        "success",
        "Destinasi <strong>" +
        escapeWisataHTML(nama) +
        "</strong> berhasil ditambahkan."
    );


    if (typeof loadWisataData === "function") {

        loadWisataData();

    }

}


/* =========================================================
   NOTIFICATION
========================================================= */

function showWisataNotification(
    type,
    message
) {

    const old =
        document.querySelector(
            ".wisata-notification"
        );

    if (old) {
        old.remove();
    }


    const notification =
        document.createElement("div");

    notification.className =
        "wisata-notification " + type;


    notification.innerHTML = `

        <div class="notification-icon">

            <i class="fa-solid fa-circle-check"></i>

        </div>

        <div class="notification-content">

            ${message}

        </div>

        <button type="button">

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    document.body.appendChild(
        notification
    );


    setTimeout(
        () => notification.classList.add("show"),
        50
    );


    notification
        .querySelector("button")
        .addEventListener(
            "click",
            () => notification.remove()
        );


    setTimeout(
        () => {

            if (
                document.body.contains(
                    notification
                )
            ) {

                notification.classList.remove(
                    "show"
                );

                setTimeout(
                    () => notification.remove(),
                    300
                );

            }

        },
        4000
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeWisataHTML(value) {

    return String(value ?? "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
