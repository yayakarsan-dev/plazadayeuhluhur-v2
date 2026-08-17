/* =========================================================
   PLAZA DAYEUHLUHUR
   WISATA ADMIN V2
   =========================================================
   Fitur:
   - Load data wisata.json
   - Gabung data JSON + localStorage
   - Statistik wisata
   - Search
   - Filter kategori
   - Filter desa
   - Filter status
   - Reset filter
   - Tambah wisata
   - Edit wisata
   - Hapus wisata
   - Modal form
   - Generate slug otomatis
   - Aktivitas dashboard
   - Responsive
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("WISATA ADMIN V2");
    console.log("====================================");

    initSidebar();
    initLogout();
    loadWisataData();
    initWisataEvents();

});


/* =========================================================
   GLOBAL DATA
========================================================= */

let wisataData = [];

let filteredWisata = [];

const WISATA_STORAGE_KEY = "plazaWisata";


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

        const yakin = confirm(
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

    showLoading(true);

    try {

        const response =
            await fetch(
                "data/wisata.json",
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                "Gagal membaca data/wisata.json"
            );

        }

        const jsonData =
            await response.json();

        const dataJson =
            Array.isArray(jsonData)
                ? jsonData
                : [];

        const localData =
            getStoredWisata();

        /*
         * Jika localStorage sudah memiliki data,
         * gunakan data local sebagai tambahan.
         */

        wisataData = [
            ...dataJson,
            ...localData
        ];

        /*
         * Hindari ID duplikat
         */

        wisataData =
            removeDuplicateWisata(
                wisataData
            );

        filteredWisata =
            [...wisataData];

        updateStatistics();
        populateFilters();
        renderWisata();

        console.log(
            "Data wisata berhasil dimuat:",
            wisataData
        );

    }

    catch (error) {

        console.error(
            "Error memuat wisata:",
            error
        );

        /*
         * Jika JSON gagal tetapi localStorage
         * memiliki data, tetap tampilkan data.
         */

        wisataData =
            getStoredWisata();

        filteredWisata =
            [...wisataData];

        updateStatistics();
        populateFilters();
        renderWisata();

        showToast(
            "danger",
            "Data wisata.json gagal dimuat."
        );

    }

    finally {

        showLoading(false);

    }

}


/* =========================================================
   REMOVE DUPLICATE
========================================================= */

function removeDuplicateWisata(
    data
) {

    const map =
        new Map();

    data.forEach(function (item) {

        const id =
            String(
                item.id ?? ""
            );

        const key =
            id || createSlug(
                item.nama || ""
            );

        map.set(
            key,
            item
        );

    });

    return Array.from(
        map.values()
    );

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function getStoredWisata() {

    try {

        const stored =
            localStorage.getItem(
                WISATA_STORAGE_KEY
            );

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];

    }

    catch (error) {

        console.error(
            "LocalStorage wisata rusak:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE LOCAL STORAGE
========================================================= */

function saveStoredWisata() {

    try {

        /*
         * Yang disimpan hanya data tambahan
         * dari administrator.
         */

        const jsonIds =
            getJsonWisataIds();

        const customData =
            wisataData.filter(function (item) {

                return !jsonIds.has(
                    String(item.id)
                );

            });

        localStorage.setItem(
            WISATA_STORAGE_KEY,
            JSON.stringify(
                customData
            )
        );

        return true;

    }

    catch (error) {

        console.error(
            "Gagal menyimpan wisata:",
            error
        );

        return false;

    }

}


/* =========================================================
   JSON IDS
========================================================= */

function getJsonWisataIds() {

    const ids =
        new Set();

    /*
     * Data awal dari JSON
     * memiliki ID yang biasanya numerik.
     */

    const knownIds = [
        1,
        2,
        3,
        4,
        5
    ];

    knownIds.forEach(function (id) {

        ids.add(
            String(id)
        );

    });

    return ids;

}


/* =========================================================
   INIT EVENTS
========================================================= */

function initWisataEvents() {

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

    const tambah =
        document.getElementById(
            "btnTambahWisata"
        );


    if (search) {

        search.addEventListener(
            "input",
            applyFilters
        );

    }


    if (kategori) {

        kategori.addEventListener(
            "change",
            applyFilters
        );

    }


    if (desa) {

        desa.addEventListener(
            "change",
            applyFilters
        );

    }


    if (status) {

        status.addEventListener(
            "change",
            applyFilters
        );

    }


    if (reset) {

        reset.addEventListener(
            "click",
            resetFilters
        );

    }


    if (tambah) {

        tambah.addEventListener(
            "click",
            function () {

                openWisataModal();

            }
        );

    }

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {

    const total =
        wisataData.length;

    const unggulan =
        wisataData.filter(function (item) {

            return String(
                item.status || ""
            ).toLowerCase()
            === "destinasi unggulan";

        }).length;

    const potensi =
        wisataData.filter(function (item) {

            return String(
                item.status || ""
            ).toLowerCase()
            === "potensi wisata";

        }).length;

    const desa =
        new Set(
            wisataData.map(function (item) {

                return String(
                    item.desa || ""
                ).trim();

            }).filter(Boolean)
        ).size;


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
        desa
    );

}


/* =========================================================
   POPULATE FILTER
========================================================= */

function populateFilters() {

    populateSelect(
        "filterKategori",
        getUniqueValues(
            "kategori"
        ),
        "Semua Kategori"
    );

    populateSelect(
        "filterDesa",
        getUniqueValues(
            "desa"
        ),
        "Semua Desa"
    );

    populateSelect(
        "filterStatus",
        getUniqueValues(
            "status"
        ),
        "Semua Status"
    );

}


/* =========================================================
   GET UNIQUE VALUES
========================================================= */

function getUniqueValues(
    field
) {

    return [
        ...new Set(
            wisataData
                .map(function (item) {

                    return String(
                        item[field] || ""
                    ).trim();

                })
                .filter(Boolean)
        )
    ].sort(
        function (a, b) {

            return a.localeCompare(
                b,
                "id"
            );

        }
    );

}


/* =========================================================
   POPULATE SELECT
========================================================= */

function populateSelect(
    id,
    values,
    placeholder
) {

    const select =
        document.getElementById(id);

    if (!select) {
        return;
    }

    const current =
        select.value;

    select.innerHTML =
        `<option value="">
            ${placeholder}
        </option>`;

    values.forEach(function (value) {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            value;

        option.textContent =
            value;

        select.appendChild(
            option
        );

    });

    if (
        values.includes(current)
    ) {

        select.value =
            current;

    }

}


/* =========================================================
   APPLY FILTER
========================================================= */

function applyFilters() {

    const search =
        getValue(
            "searchWisata"
        ).toLowerCase();

    const kategori =
        getValue(
            "filterKategori"
        ).toLowerCase();

    const desa =
        getValue(
            "filterDesa"
        ).toLowerCase();

    const status =
        getValue(
            "filterStatus"
        ).toLowerCase();


    filteredWisata =
        wisataData.filter(
            function (item) {

                const text =
                    [
                        item.nama,
                        item.desa,
                        item.kategori,
                        item.jenis,
                        item.status,
                        item.deskripsi
                    ]
                    .join(" ")
                    .toLowerCase();


                const matchSearch =
                    !search ||
                    text.includes(
                        search
                    );


                const matchKategori =
                    !kategori ||
                    String(
                        item.kategori || ""
                    ).toLowerCase()
                    === kategori;


                const matchDesa =
                    !desa ||
                    String(
                        item.desa || ""
                    ).toLowerCase()
                    === desa;


                const matchStatus =
                    !status ||
                    String(
                        item.status || ""
                    ).toLowerCase()
                    === status;


                return (
                    matchSearch &&
                    matchKategori &&
                    matchDesa &&
                    matchStatus
                );

            }
        );


    renderWisata();

}


/* =========================================================
   RESET FILTER
========================================================= */

function resetFilters() {

    setValue(
        "searchWisata",
        ""
    );

    setValue(
        "filterKategori",
        ""
    );

    setValue(
        "filterDesa",
        ""
    );

    setValue(
        "filterStatus",
        ""
    );

    filteredWisata =
        [...wisataData];

    renderWisata();

}


/* =========================================================
   RENDER WISATA
========================================================= */

function renderWisata() {

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


    if (
        !filteredWisata.length
    ) {

        container.innerHTML = "";

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


    let html = "";


    filteredWisata.forEach(
        function (item) {

            html += createWisataCard(
                item
            );

        }
    );


    container.innerHTML =
        html;


    bindCardButtons();

}


/* =========================================================
   CREATE CARD
========================================================= */

function createWisataCard(
    item
) {

    const status =
        String(
            item.status || "Potensi Wisata"
        );


    const statusClass =
        status
            .toLowerCase()
            .includes("unggulan")
            ? "unggulan"
            : "potensi";


    const image =
        item.gambar ||
        "assets/images/wisata/default.jpg";


    const icon =
        item.ikon ||
        "🌿";


    return `

        <div class="col-xl-4 col-md-6">

            <div class="wisata-admin-card">

                <div class="wisata-card-image">

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(item.nama || "Wisata")}"
                        onerror="this.src='assets/images/wisata/default.jpg';"
                    >

                    <div class="wisata-card-icon">

                        ${escapeHTML(icon)}

                    </div>

                    <span
                        class="wisata-status ${statusClass}">

                        ${escapeHTML(status)}

                    </span>

                </div>


                <div class="wisata-card-body">

                    <div class="wisata-card-category">

                        ${escapeHTML(item.kategori || "Wisata")}

                    </div>


                    <h4>

                        ${escapeHTML(item.nama || "-")}

                    </h4>


                    <div class="wisata-card-location">

                        <i class="fa-solid fa-location-dot"></i>

                        ${escapeHTML(item.desa || "-")}

                    </div>


                    <p>

                        ${escapeHTML(
                            item.deskripsi ||
                            "Belum ada deskripsi."
                        )}

                    </p>


                    <div class="wisata-card-meta">

                        <span>

                            <i class="fa-solid fa-leaf"></i>

                            ${escapeHTML(
                                item.jenis ||
                                "Wisata Alam"
                            )}

                        </span>

                    </div>


                    <div class="wisata-card-actions">

                        <button
                            type="button"
                            class="btn-wisata-edit"
                            data-id="${escapeHTML(item.id)}">

                            <i class="fa-solid fa-pen"></i>

                            Edit

                        </button>


                        <button
                            type="button"
                            class="btn-wisata-delete"
                            data-id="${escapeHTML(item.id)}">

                            <i class="fa-solid fa-trash"></i>

                            Hapus

                        </button>


                        ${
                            item.maps
                            ? `
                            <a
                                href="${escapeHTML(item.maps)}"
                                target="_blank"
                                rel="noopener"
                                class="btn-wisata-map">

                                <i class="fa-solid fa-map-location-dot"></i>

                                Maps

                            </a>
                            `
                            : ""
                        }

                    </div>

                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   BIND CARD BUTTONS
========================================================= */

function bindCardButtons() {

    document
        .querySelectorAll(
            ".btn-wisata-edit"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        this.dataset.id;

                    editWisata(id);

                }
            );

        });


    document
        .querySelectorAll(
            ".btn-wisata-delete"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        this.dataset.id;

                    deleteWisata(id);

                }
            );

        });

}


/* =========================================================
   MODAL
========================================================= */

function openWisataModal(
    item = null
) {

    let modal =
        document.getElementById(
            "wisataModal"
        );


    if (!modal) {

        createWisataModal();

        modal =
            document.getElementById(
                "wisataModal"
            );

    }


    const title =
        document.getElementById(
            "wisataModalTitle"
        );


    const form =
        document.getElementById(
            "formWisata"
        );


    if (!form) {
        return;
    }


    form.reset();


    document.getElementById(
        "wisataEditId"
    ).value =
        item
            ? item.id
            : "";


    if (item) {

        title.innerHTML =
            `<i class="fa-solid fa-pen"></i>
             Edit Destinasi Wisata`;

        setValue(
            "wisataNama",
            item.nama
        );

        setValue(
            "wisataKategori",
            item.kategori
        );

        setValue(
            "wisataDesa",
            item.desa
        );

        setValue(
            "wisataJenis",
            item.jenis
        );

        setValue(
            "wisataStatus",
            item.status
        );

        setValue(
            "wisataIkon",
            item.ikon
        );

        setValue(
            "wisataGambar",
            item.gambar
        );

        setValue(
            "wisataMaps",
            item.maps
        );

        setValue(
            "wisataDeskripsi",
            item.deskripsi
        );

    }

    else {

        title.innerHTML =
            `<i class="fa-solid fa-mountain-sun"></i>
             Tambah Destinasi Wisata`;

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
                "wisataNama"
            );

        if (input) {
            input.focus();
        }

    }, 200);

}


/* =========================================================
   CREATE MODAL
========================================================= */

function createWisataModal() {

    if (
        document.getElementById(
            "wisataModal"
        )
    ) {
        return;
    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "wisataModal";

    modal.className =
        "wisata-modal-overlay";


    modal.innerHTML = `

        <div class="wisata-modal">

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
                        Kelola informasi destinasi wisata Dayeuhluhur.
                    </p>

                </div>


                <button
                    type="button"
                    class="wisata-modal-close"
                    id="closeWisataModal">

                    <i class="fa-solid fa-xmark"></i>

                </button>

            </div>


            <form
                id="formWisata"
                class="wisata-modal-body">

                <input
                    type="hidden"
                    id="wisataEditId">


                <div class="row g-3">


                    <div class="col-md-8">

                        <label>
                            Nama Destinasi *
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


                    <div class="col-md-6">

                        <label>
                            Kategori *
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

                                <option value="Pantai">
                                    Pantai
                                </option>

                                <option value="Agrowisata">
                                    Agrowisata
                                </option>

                                <option value="Wisata Desa">
                                    Wisata Desa
                                </option>

                            </select>

                        </div>

                    </div>


                    <div class="col-md-6">

                        <label>
                            Desa *
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


                    <div class="col-md-6">

                        <label>
                            Jenis Wisata
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-leaf"></i>

                            <select
                                id="wisataJenis">

                                <option value="Wisata Alam">
                                    Wisata Alam
                                </option>

                                <option value="Wisata Buatan">
                                    Wisata Buatan
                                </option>

                                <option value="Wisata Desa">
                                    Wisata Desa
                                </option>

                                <option value="Agrowisata">
                                    Agrowisata
                                </option>

                            </select>

                        </div>

                    </div>


                    <div class="col-md-6">

                        <label>
                            Status
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-circle-check"></i>

                            <select
                                id="wisataStatus">

                                <option value="Destinasi Unggulan">
                                    Destinasi Unggulan
                                </option>

                                <option value="Potensi Wisata">
                                    Potensi Wisata
                                </option>

                            </select>

                        </div>

                    </div>


                    <div class="col-12">

                        <label>
                            URL Gambar
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-image"></i>

                            <input
                                type="text"
                                id="wisataGambar"
                                placeholder="assets/images/wisata/nama-file.jpg">

                        </div>

                    </div>


                    <div class="col-12">

                        <label>
                            Google Maps
                        </label>

                        <div class="input-group-premium">

                            <i class="fa-solid fa-map-location-dot"></i>

                            <input
                                type="url"
                                id="wisataMaps"
                                placeholder="https://www.google.com/maps/...">

                        </div>

                    </div>


                    <div class="col-12">

                        <label>
                            Deskripsi
                        </label>

                        <textarea
                            id="wisataDeskripsi"
                            rows="4"
                            placeholder="Deskripsikan destinasi wisata..."></textarea>

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


    const close =
        document.getElementById(
            "closeWisataModal"
        );

    const cancel =
        document.getElementById(
            "cancelWisataModal"
        );

    const form =
        document.getElementById(
            "formWisata"
        );


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
        function (event) {

            if (
                event.target === modal
            ) {

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
        function (event) {

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
   CLOSE MODAL
========================================================= */

function closeWisataModal() {

    const modal =
        document.getElementById(
            "wisataModal"
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
   SAVE WISATA
========================================================= */

function saveWisata(
    event
) {

    event.preventDefault();


    const editId =
        getValue(
            "wisataEditId"
        );


    const nama =
        getValue(
            "wisataNama"
        );

    const kategori =
        getValue(
            "wisataKategori"
        );

    const desa =
        getValue(
            "wisataDesa"
        );

    const jenis =
        getValue(
            "wisataJenis"
        ) || "Wisata Alam";

    const status =
        getValue(
            "wisataStatus"
        ) || "Potensi Wisata";

    const ikon =
        getValue(
            "wisataIkon"
        ) || "🌿";

    const gambar =
        getValue(
            "wisataGambar"
        ) ||
        "assets/images/wisata/default.jpg";

    const maps =
        getValue(
            "wisataMaps"
        );

    const deskripsi =
        getValue(
            "wisataDeskripsi"
        );


    if (
        !nama ||
        !kategori ||
        !desa
    ) {

        showToast(
            "warning",
            "Nama, kategori dan desa wajib diisi."
        );

        return;

    }


    /*
     * EDIT
     */

    if (editId) {

        const index =
            wisataData.findIndex(
                function (item) {

                    return String(
                        item.id
                    ) === String(
                        editId
                    );

                }
            );


        if (index === -1) {

            showToast(
                "danger",
                "Data wisata tidak ditemukan."
            );

            return;

        }


        const old =
            wisataData[index];


        wisataData[index] = {

            ...old,

            nama,
            slug: createSlug(nama),
            kategori,
            ikon,
            desa,
            jenis,
            status,
            deskripsi,
            gambar,
            maps

        };


        /*
         * Untuk data bawaan JSON,
         * buat salinan edit ke localStorage.
         */

        saveEditedWisata(
            wisataData[index]
        );


        saveActivity(
            "Wisata diperbarui",
            nama + " — " + desa,
            "fa-pen"
        );


        showToast(
            "success",
            "Destinasi <strong>" +
            escapeHTML(nama) +
            "</strong> berhasil diperbarui."
        );

    }


    /*
     * TAMBAH
     */

    else {

        const newId =
            getNextWisataId();


        const newWisata = {

            id: newId,

            nama: nama,

            slug:
                createSlug(
                    nama
                ),

            kategori:
                kategori,

            ikon:
                ikon,

            desa:
                desa,

            jenis:
                jenis,

            status:
                status,

            deskripsi:
                deskripsi,

            gambar:
                gambar,

            maps:
                maps

        };


        wisataData.push(
            newWisata
        );


        saveStoredWisata();


        saveActivity(
            "Wisata baru ditambahkan",
            nama + " — " + desa,
            "fa-mountain-sun"
        );


        showToast(
            "success",
            "Destinasi <strong>" +
            escapeHTML(nama) +
            "</strong> berhasil ditambahkan."
        );

    }


    filteredWisata =
        [...wisataData];


    updateStatistics();

    populateFilters();

    renderWisata();

    closeWisataModal();

}


/* =========================================================
   SAVE EDITED WISATA
========================================================= */

function saveEditedWisata(
    item
) {

    let stored =
        getStoredWisata();


    const index =
        stored.findIndex(
            function (data) {

                return String(
                    data.id
                ) === String(
                    item.id
                );

            }
        );


    if (index >= 0) {

        stored[index] =
            item;

    }

    else {

        stored.push(
            item
        );

    }


    try {

        localStorage.setItem(
            WISATA_STORAGE_KEY,
            JSON.stringify(
                stored
            )
        );

    }

    catch (error) {

        console.error(
            "Gagal menyimpan perubahan wisata:",
            error
        );

        showToast(
            "danger",
            "Perubahan gagal disimpan."
        );

    }

}


/* =========================================================
   GET NEXT ID
========================================================= */

function getNextWisataId() {

    const ids =
        wisataData.map(
            function (item) {

                return Number(
                    item.id
                ) || 0;

            }
        );


    return ids.length
        ? Math.max(...ids) + 1
        : 1;

}


/* =========================================================
   EDIT WISATA
========================================================= */

function editWisata(
    id
) {

    const item =
        wisataData.find(
            function (data) {

                return String(
                    data.id
                ) === String(
                    id
                );

            }
        );


    if (!item) {

        showToast(
            "danger",
            "Data wisata tidak ditemukan."
        );

        return;

    }


    openWisataModal(
        item
    );

}


/* =========================================================
   DELETE WISATA
========================================================= */

function deleteWisata(
    id
) {

    const item =
        wisataData.find(
            function (data) {

                return String(
                    data.id
                ) === String(
                    id
                );

            }
        );


    if (!item) {

        showToast(
            "danger",
            "Data wisata tidak ditemukan."
        );

        return;

    }


    const yakin =
        confirm(
            "Hapus destinasi \"" +
            item.nama +
            "\"?"
        );


    if (!yakin) {
        return;
    }


    /*
     * Jika data berasal dari JSON,
     * kita tidak menghapus JSON.
     * Kita simpan daftar ID yang dihapus.
     */

    let deleted =
        getDeletedWisata();


    if (
        !deleted.includes(
            String(item.id)
        )
    ) {

        deleted.push(
            String(item.id)
        );

    }


    localStorage.setItem(
        "plazaWisataDeleted",
        JSON.stringify(
            deleted
        )
    );


    wisataData =
        wisataData.filter(
            function (data) {

                return String(
                    data.id
                ) !== String(
                    id
                );

            }
        );


    filteredWisata =
        filteredWisata.filter(
            function (data) {

                return String(
                    data.id
                ) !== String(
                    id
                );

            }
        );


    /*
     * Hapus juga dari localStorage
     */

    const stored =
        getStoredWisata()
            .filter(
                function (data) {

                    return String(
                        data.id
                    ) !== String(
                        id
                    );

                }
            );


    localStorage.setItem(
        WISATA_STORAGE_KEY,
        JSON.stringify(
            stored
        )
    );


    saveActivity(
        "Wisata dihapus",
        item.nama + " — " + item.desa,
        "fa-trash"
    );


    updateStatistics();

    populateFilters();

    renderWisata();


    showToast(
        "success",
        "Destinasi <strong>" +
        escapeHTML(item.nama) +
        "</strong> berhasil dihapus."
    );

}


/* =========================================================
   DELETED WISATA
========================================================= */

function getDeletedWisata() {

    try {

        const stored =
            localStorage.getItem(
                "plazaWisataDeleted"
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

        return [];

    }

}


/* =========================================================
   ACTIVITY
========================================================= */

function saveActivity(
    title,
    description,
    icon
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


        if (
            !Array.isArray(
                activities
            )
        ) {

            activities = [];

        }

    }

    catch (error) {

        activities = [];

    }


    activities.unshift({

        type:
            "wisata",

        title:
            title,

        description:
            description,

        icon:
            icon || "fa-mountain-sun",

        date:
            new Date()
                .toISOString()

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
   LOADING
========================================================= */

function showLoading(
    show
) {

    const loading =
        document.getElementById(
            "wisataLoading"
        );

    if (!loading) {
        return;
    }

    loading.style.display =
        show
            ? "flex"
            : "none";

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    type,
    message
) {

    const old =
        document.querySelector(
            ".wisata-toast"
        );

    if (old) {
        old.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "wisata-toast " +
        type;


    let icon =
        "fa-circle-info";


    if (type === "success") {

        icon =
            "fa-circle-check";

    }

    else if (type === "warning") {

        icon =
            "fa-triangle-exclamation";

    }

    else if (type === "danger") {

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
            value ?? "";

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

function createSlug(
    text
) {

    return String(
        text || ""
    )

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