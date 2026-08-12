/* =========================================================
   PLAZA DAYEUHLUHUR
   DIREKTORI UMKM
   UMKM.JS V3
   PUBLIC + ADMIN
========================================================= */

let umkmDatabase = [];
let filteredUmkm = [];


/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("DIREKTORI UMKM");
    console.log("UMKM.JS V3");
    console.log("====================================");

    loadUMKM();

    setupTambahUMKM();

    setupAdminUI();

});


/* =========================================================
   LOAD DATABASE UTAMA
========================================================= */

async function loadUMKM() {

    const container =
        document.getElementById("umkmContainer");

    if (!container) {
        console.error("umkmContainer tidak ditemukan.");
        return;
    }

    try {

        const response =
            await fetch("data/umkm.json", {
                cache: "no-store"
            });

        if (!response.ok) {

            throw new Error(
                "Gagal membaca umkm.json. HTTP " +
                response.status
            );

        }

        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Format umkm.json harus berupa array."
            );

        }


        /* =========================================
           DATA UTAMA
        ========================================= */

        const dataUtama =
            data.map(function (item) {

                return {
                    ...item,
                    _source: "json"
                };

            });


        /* =========================================
           DATA TAMBAHAN LOCAL STORAGE
        ========================================= */

        const dataTambahan =
            getLocalUmkm();


        /* =========================================
           DATA EDIT / DELETE
        ========================================= */

        const dataFinal =
            mergeUmkmData(
                dataUtama,
                dataTambahan
            );


        umkmDatabase =
            dataFinal;


        window.plazaUmkm =
            dataFinal;


        filteredUmkm =
            [...dataFinal];


        console.log(
            "UMKM berhasil dimuat:",
            dataFinal.length
        );


        /* =========================================
           RENDER
        ========================================= */

        renderUMKM(
            dataFinal
        );


        updateStatistics(
            dataFinal
        );


        setupSearch();

        setupFilter();

        setupReset();

    }

    catch (error) {

        console.error(
            "ERROR UMKM:",
            error
        );


        container.innerHTML = `

            <div class="col-12">

                <div class="alert alert-danger text-center">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    Gagal memuat data UMKM.

                </div>

            </div>

        `;

    }

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function getLocalUmkm() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(
                    "plazaUmkmTambahan"
                )
            ) || [];


        if (!Array.isArray(data)) {
            return [];
        }


        return data.map(function (item) {

            return {
                ...item,
                _source: "local"
            };

        });

    }

    catch (error) {

        console.error(
            "Gagal membaca localStorage UMKM:",
            error
        );

        return [];

    }

}


/* =========================================================
   MERGE DATA
========================================================= */

function mergeUmkmData(
    dataUtama,
    dataTambahan
) {

    const map =
        new Map();


    /* =========================================
       DATA JSON
    ========================================= */

    dataUtama.forEach(function (item) {

        map.set(
            String(item.id),
            item
        );

    });


    /* =========================================
       DATA LOCAL
    ========================================= */

    dataTambahan.forEach(function (item) {

        map.set(
            String(item.id),
            item
        );

    });


    return Array.from(
        map.values()
    );

}


/* =========================================================
   RENDER UMKM
========================================================= */

function renderUMKM(data) {

    const container =
        document.getElementById(
            "umkmContainer"
        );


    if (!container) {
        return;
    }


    if (!data || data.length === 0) {

        container.innerHTML = "";

        updateResultCount(0);

        const empty =
            document.getElementById(
                "emptyUmkm"
            );


        if (empty) {
            empty.style.display = "block";
        }

        return;

    }


    const empty =
        document.getElementById(
            "emptyUmkm"
        );


    if (empty) {
        empty.style.display = "none";
    }


    let html = "";


    const isAdmin =
        sessionStorage.getItem(
            "plazaAdminLogin"
        ) === "true";


    data.forEach(function (item) {


        const status =
            item.status || "Buka";


        const statusLower =
            String(status)
                .toLowerCase();


        const isOpen =
            statusLower === "buka";


        const statusClass =
            isOpen
                ? "open"
                : "closed";


        const detailLink =
            "pages/umkm/detail.html?id=" +
            encodeURIComponent(item.id);


        html += `

        <div class="col-lg-4 col-md-6 mb-4">

            <div class="umkm-card h-100">

                <!-- IMAGE -->

                <div class="umkm-card-image">

                    <img

                        src="${escapeHTML(
                            item.gambar ||
                            "assets/images/umkm/default.jpg"
                        )}"

                        alt="${escapeHTML(
                            item.nama ||
                            "UMKM"
                        )}"

                        onerror="
                            this.onerror=null;
                            this.src='assets/images/umkm/default.jpg';
                        "
                    >


                    <!-- CATEGORY -->

                    <span class="umkm-kategori">

                        ${escapeHTML(
                            item.kategori ||
                            "Lainnya"
                        )}

                    </span>


                    <!-- STATUS -->

                    <span class="
                        umkm-status
                        ${statusClass}
                    ">

                        <span class="status-dot"></span>

                        ${escapeHTML(
                            status
                        )}

                    </span>

                </div>


                <!-- BODY -->

                <div class="umkm-card-body">


                    <h3>

                        ${escapeHTML(
                            item.nama ||
                            "-"
                        )}

                    </h3>


                    <div class="umkm-produk">

                        <i class="fa-solid fa-briefcase"></i>

                        ${escapeHTML(
                            item.produk ||
                            "-"
                        )}

                    </div>


                    <div class="umkm-info">

                        <i class="fa-solid fa-location-dot"></i>

                        ${escapeHTML(
                            item.desa ||
                            "-"
                        )}

                    </div>


                    <div class="umkm-rating">

                        <i class="fa-solid fa-star"></i>

                        ${escapeHTML(
                            item.rating ||
                            "0"
                        )}

                    </div>


                    <div class="umkm-divider"></div>


                    <a
                        href="${detailLink}"
                        class="btn-lihat-umkm"
                    >

                        <i class="fa-solid fa-eye"></i>

                        Lihat UMKM

                    </a>


                    ${
                        isAdmin
                        ? `

                        <div class="admin-card-actions">

                            <button
                                type="button"
                                class="btn btn-sm btn-outline-primary"
                                onclick="editUMKM(${Number(item.id)})"
                            >

                                <i class="fa-solid fa-pen"></i>

                                Edit

                            </button>


                            <button
                                type="button"
                                class="btn btn-sm btn-outline-danger"
                                onclick="deleteUMKM(${Number(item.id)})"
                            >

                                <i class="fa-solid fa-trash"></i>

                                Hapus

                            </button>

                        </div>

                        `
                        : ""
                    }

                </div>

            </div>

        </div>

        `;

    });


    container.innerHTML =
        html;


    updateResultCount(
        data.length
    );


    console.log(
        "Kartu UMKM ditampilkan:",
        data.length
    );

}


/* =========================================================
   STATISTIK
========================================================= */

function updateStatistics(data) {

    const total =
        data.length;


    const kuliner =
        data.filter(function (item) {

            return normalize(
                item.kategori
            ) === "kuliner";

        }).length;


    const jasa =
        data.filter(function (item) {

            return normalize(
                item.kategori
            ) === "jasa";

        }).length;


    const desaSet =
        new Set();


    data.forEach(function (item) {

        if (
            item.desa &&
            item.desa !== "-"
        ) {

            desaSet.add(
                String(item.desa)
                    .trim()
            );

        }

    });


    setText(
        "totalUmkm",
        total
    );


    setText(
        "totalKuliner",
        kuliner
    );


    setText(
        "totalJasa",
        jasa
    );


    setText(
        "totalDesa",
        desaSet.size
    );


    /* kompatibilitas dashboard */

    setText(
        "totalUmkmBuka",
        data.filter(
            item =>
                normalize(item.status)
                === "buka"
        ).length
    );


    setText(
        "totalUmkmDesa",
        desaSet.size
    );

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const searchHero =
        document.getElementById(
            "searchUmkm"
        );


    const searchDirectory =
        document.getElementById(
            "searchUmkm2"
        );


    if (searchHero) {

        searchHero.addEventListener(
            "input",
            function () {

                if (searchDirectory) {

                    searchDirectory.value =
                        searchHero.value;

                }

                applyFilter();

            }
        );

    }


    if (searchDirectory) {

        searchDirectory.addEventListener(
            "input",
            function () {

                if (searchHero) {

                    searchHero.value =
                        searchDirectory.value;

                }

                applyFilter();

            }
        );

    }

}


/* =========================================================
   FILTER
========================================================= */

function setupFilter() {

    const kategori =
        document.getElementById(
            "filterKategori"
        );


    const status =
        document.getElementById(
            "filterStatus"
        );


    if (kategori) {

        kategori.addEventListener(
            "change",
            applyFilter
        );

    }


    if (status) {

        status.addEventListener(
            "change",
            applyFilter
        );

    }

}


/* =========================================================
   APPLY FILTER
========================================================= */

function applyFilter() {

    const search =
        document.getElementById(
            "searchUmkm2"
        );


    const kategori =
        document.getElementById(
            "filterKategori"
        );


    const status =
        document.getElementById(
            "filterStatus"
        );


    const keyword =
        search
            ? search.value
                .toLowerCase()
                .trim()
            : "";


    const selectedKategori =
        kategori
            ? kategori.value
            : "";


    const selectedStatus =
        status
            ? status.value
            : "";


    filteredUmkm =
        umkmDatabase.filter(
            function (item) {


                const text = (

                    (item.nama || "") +
                    " " +
                    (item.kategori || "") +
                    " " +
                    (item.desa || "") +
                    " " +
                    (item.produk || "") +
                    " " +
                    (item.alamat || "") +
                    " " +
                    (item.deskripsi || "")

                ).toLowerCase();


                const cocokKeyword =
                    text.includes(
                        keyword
                    );


                const cocokKategori =
                    selectedKategori === "" ||
                    normalize(
                        item.kategori
                    ) === normalize(
                        selectedKategori
                    );


                const cocokStatus =
                    selectedStatus === "" ||
                    normalize(
                        item.status
                    ) === normalize(
                        selectedStatus
                    );


                return (
                    cocokKeyword &&
                    cocokKategori &&
                    cocokStatus
                );

            }
        );


    renderUMKM(
        filteredUmkm
    );

}


/* =========================================================
   RESET FILTER
========================================================= */

function setupReset() {

    const button =
        document.getElementById(
            "resetFilter"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {


            const searchHero =
                document.getElementById(
                    "searchUmkm"
                );


            const searchDirectory =
                document.getElementById(
                    "searchUmkm2"
                );


            const kategori =
                document.getElementById(
                    "filterKategori"
                );


            const status =
                document.getElementById(
                    "filterStatus"
                );


            if (searchHero) {
                searchHero.value = "";
            }


            if (searchDirectory) {
                searchDirectory.value = "";
            }


            if (kategori) {
                kategori.value = "";
            }


            if (status) {
                status.value = "";
            }


            filteredUmkm =
                [...umkmDatabase];


            renderUMKM(
                filteredUmkm
            );

        }
    );

}


/* =========================================================
   TAMBAH UMKM
========================================================= */

function setupTambahUMKM() {

    const form =
        document.getElementById(
            "formTambahUmkm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (
                sessionStorage.getItem(
                    "plazaAdminLogin"
                ) !== "true"
            ) {

                alert(
                    "Silakan login sebagai administrator."
                );

                return;

            }


            const nama =
                getValue("inputNama");


            const kategori =
                getValue("inputKategori");


            const produk =
                getValue("inputProduk");


            const desa =
                getValue("inputDesa");


            const rating =
                getValue("inputRating") ||
                "0";


            const status =
                getValue("inputStatus") ||
                "Buka";


            const gambar =
                getValue("inputGambar") ||
                "assets/images/umkm/default.jpg";


            const alamat =
                getValue("inputAlamat");


            const deskripsi =
                getValue("inputDeskripsi");


            if (
                !nama ||
                !kategori ||
                !produk ||
                !desa
            ) {

                alert(
                    "Mohon lengkapi data wajib UMKM."
                );

                return;

            }


            const newId =
                generateNewId();


            const newUmkm = {

                id: newId,

                nama: nama,

                kategori: kategori,

                desa: desa,

                produk: produk,

                rating: rating,

                status: status,

                gambar: gambar,

                alamat: alamat,

                deskripsi: deskripsi,

                _source: "local"

            };


            const tambahan =
                getLocalUmkm();


            tambahan.push(
                newUmkm
            );


            saveLocalUmkm(
                tambahan
            );


            umkmDatabase =
                mergeUmkmData(
                    umkmDatabase,
                    [newUmkm]
                );


            window.plazaUmkm =
                umkmDatabase;


            filteredUmkm =
                [...umkmDatabase];


            renderUMKM(
                filteredUmkm
            );


            updateStatistics(
                umkmDatabase
            );


            form.reset();


            setDefaultForm();


            alert(
                "✅ UMKM berhasil ditambahkan."
            );


            document
                .getElementById(
                    "umkmContainer"
                )
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


    setDefaultForm();

}


/* =========================================================
   DEFAULT FORM
========================================================= */

function setDefaultForm() {

    const rating =
        document.getElementById(
            "inputRating"
        );


    const status =
        document.getElementById(
            "inputStatus"
        );


    const gambar =
        document.getElementById(
            "inputGambar"
        );


    if (rating) {
        rating.value = "0";
    }


    if (status) {
        status.value = "Buka";
    }


    if (gambar) {

        gambar.value =
            "assets/images/umkm/default.jpg";

    }

}


/* =========================================================
   EDIT UMKM
========================================================= */

function editUMKM(id) {

    if (
        sessionStorage.getItem(
            "plazaAdminLogin"
        ) !== "true"
    ) {

        alert(
            "Akses hanya untuk administrator."
        );

        return;

    }


    const item =
        umkmDatabase.find(
            function (data) {

                return Number(data.id) ===
                    Number(id);

            }
        );


    if (!item) {

        alert(
            "Data UMKM tidak ditemukan."
        );

        return;

    }


    const nama =
        prompt(
            "Nama UMKM:",
            item.nama || ""
        );


    if (nama === null) {
        return;
    }


    const produk =
        prompt(
            "Produk / Jasa:",
            item.produk || ""
        );


    if (produk === null) {
        return;
    }


    const status =
        prompt(
            "Status (Buka/Tutup):",
            item.status || "Buka"
        );


    if (status === null) {
        return;
    }


    const tambahan =
        getLocalUmkm();


    const index =
        tambahan.findIndex(
            function (data) {

                return Number(data.id) ===
                    Number(id);

            }
        );


    if (index === -1) {

        /*
         * Data dari JSON belum memiliki
         * salinan lokal.
         */

        tambahan.push({
            ...item,
            nama: nama,
            produk: produk,
            status: status,
            _source: "local"
        });

    }

    else {

        tambahan[index] = {

            ...tambahan[index],

            nama: nama,

            produk: produk,

            status: status

        };

    }


    saveLocalUmkm(
        tambahan
    );


    /*
     * Reload data agar perubahan
     * benar-benar tersinkron.
     */

    loadUMKM();


    alert(
        "✅ Data UMKM berhasil diperbarui."
    );

}


/* =========================================================
   HAPUS UMKM
========================================================= */

function deleteUMKM(id) {

    if (
        sessionStorage.getItem(
            "plazaAdminLogin"
        ) !== "true"
    ) {

        alert(
            "Akses hanya untuk administrator."
        );

        return;

    }


    const item =
        umkmDatabase.find(
            function (data) {

                return Number(data.id) ===
                    Number(id);

            }
        );


    if (!item) {

        alert(
            "Data UMKM tidak ditemukan."
        );

        return;

    }


    const yakin =
        confirm(
            'Hapus UMKM "' +
            item.nama +
            '"?'
        );


    if (!yakin) {
        return;
    }


    const tambahan =
        getLocalUmkm();


    const index =
        tambahan.findIndex(
            function (data) {

                return Number(data.id) ===
                    Number(id);

            }
        );


    /*
     * Jika data berasal dari JSON,
     * kita tandai sebagai deleted.
     */

    if (index === -1) {

        tambahan.push({

            id: id,

            _deleted: true,

            _source: "local"

        });

    }

    else {

        tambahan.splice(
            index,
            1
        );

    }


    saveLocalUmkm(
        tambahan
    );


    loadUMKM();


    alert(
        "🗑️ UMKM berhasil dihapus."
    );

}


/* =========================================================
   GENERATE ID
========================================================= */

function generateNewId() {

    const ids =
        umkmDatabase.map(
            function (item) {

                return Number(
                    item.id
                ) || 0;

            }
        );


    const local =
        getLocalUmkm();


    local.forEach(
        function (item) {

            ids.push(
                Number(item.id) || 0
            );

        }
    );


    return Math.max(
        ...ids,
        0
    ) + 1;

}


/* =========================================================
   SAVE LOCAL STORAGE
========================================================= */

function saveLocalUmkm(data) {

    localStorage.setItem(

        "plazaUmkmTambahan",

        JSON.stringify(data)

    );

}


/* =========================================================
   ADMIN UI
========================================================= */

function setupAdminUI() {

    const adminAction =
        document.getElementById(
            "adminUmkmAction"
        );


    const isAdmin =
        sessionStorage.getItem(
            "plazaAdminLogin"
        ) === "true";


    if (
        adminAction &&
        isAdmin
    ) {

        adminAction.style.display =
            "block";

    }

}


/* =========================================================
   RESULT COUNT
========================================================= */

function updateResultCount(total) {

    const element =
        document.getElementById(
            "jumlahHasil"
        );


    if (element) {

        element.textContent =
            total;

    }


    /*
     * kompatibilitas versi sebelumnya
     */

    const oldElement =
        document.getElementById(
            "umkmResultCount"
        );


    if (oldElement) {

        oldElement.textContent =
            "Menampilkan " +
            total +
            " UMKM";

    }

}


/* =========================================================
   HELPER GET VALUE
========================================================= */

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {
        return "";
    }


    return element.value
        .trim();

}


/* =========================================================
   HELPER TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   NORMALIZE
========================================================= */

function normalize(value) {

    return String(
        value ?? ""
    )
        .toLowerCase()
        .trim();

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