/* =========================================================
   PLAZA DAYEUHLUHUR
   ADMIN DESTINASI WISATA
   WISATA-ADMIN.JS V1
   Statistik + Load JSON + Search + Filter + Render
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("ADMIN DESTINASI WISATA");
    console.log("WISATA ADMIN V1");
    console.log("====================================");

    initSidebar();
    initLogout();

    loadWisataData();

    initSearch();
    initFilters();
    initResetButton();
    initTambahWisata();

});


/* =========================================================
   DATA GLOBAL
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


    mobileButton.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle("show");
            overlay.classList.toggle("show");

        }
    );


    overlay.addEventListener(
        "click",
        function () {

            sidebar.classList.remove("show");
            overlay.classList.remove("show");

        }
    );

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


    logoutButton.addEventListener(
        "click",
        function (event) {

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

        }
    );

}


/* =========================================================
   LOAD DATA WISATA
========================================================= */

async function loadWisataData() {

    console.log(
        "Memuat data wisata..."
    );


    showLoading();


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
                "HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Format wisata.json harus berupa Array."
            );

        }


        wisataData = data;


        /*
         * Simpan global
         */

        window.plazaWisataData =
            wisataData;


        console.log(
            "Data wisata berhasil dimuat:",
            wisataData
        );


        /*
         * Statistik
         */

        updateStatistics();


        /*
         * Isi filter
         */

        populateFilters();


        /*
         * Render kartu
         */

        renderWisata(
            wisataData
        );


    }

    catch (error) {

        console.error(
            "Gagal memuat data wisata:",
            error
        );


        showError(
            error
        );

    }

}


/* =========================================================
   STATISTIK
========================================================= */

function updateStatistics() {

    const total =
        wisataData.length;


    const unggulan =
        wisataData.filter(
            function (item) {

                return normalize(
                    item.status
                ) ===
                "destinasi unggulan";

            }
        ).length;


    const potensi =
        wisataData.filter(
            function (item) {

                return normalize(
                    item.status
                ) ===
                "potensi wisata";

            }
        ).length;


    const desaSet =
        new Set();


    wisataData.forEach(
        function (item) {

            if (item.desa) {

                desaSet.add(
                    normalize(
                        item.desa
                    )
                );

            }

        }
    );


    const jumlahDesa =
        desaSet.size;


    /*
     * Statistik utama
     */

    setText(
        [
            "statTotal",
            "statWisata",
            "totalWisata"
        ],
        total
    );


    setText(
        [
            "statUnggulan",
            "statWisataUnggulan",
            "totalUnggulan"
        ],
        unggulan
    );


    setText(
        [
            "statPotensi",
            "statWisataPotensi",
            "totalPotensi"
        ],
        potensi
    );


    setText(
        [
            "statDesaWisata",
            "statDesa",
            "totalDesaWisata"
        ],
        jumlahDesa
    );


    console.log(
        "Statistik:",
        {
            total,
            unggulan,
            potensi,
            jumlahDesa
        }
    );

}


/* =========================================================
   POPULATE FILTER
========================================================= */

function populateFilters() {

    const kategoriSelect =
        findElement([
            "filterKategori",
            "wisataKategoriFilter"
        ]);


    const desaSelect =
        findElement([
            "filterDesa",
            "wisataDesaFilter"
        ]);


    const statusSelect =
        findElement([
            "filterStatus",
            "wisataStatusFilter"
        ]);


    /*
     * KATEGORI
     */

    if (kategoriSelect) {

        const kategori =
            [
                ...new Set(
                    wisataData
                        .map(
                            item =>
                                item.kategori
                        )
                        .filter(Boolean)
                )
            ]
            .sort();


        kategoriSelect.innerHTML = `
            <option value="">
                Semua Kategori
            </option>
        `;


        kategori.forEach(
            function (item) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    item;

                option.textContent =
                    item;

                kategoriSelect.appendChild(
                    option
                );

            }
        );

    }


    /*
     * DESA
     */

    if (desaSelect) {

        const desa =
            [
                ...new Set(
                    wisataData
                        .map(
                            item =>
                                item.desa
                        )
                        .filter(Boolean)
                )
            ]
            .sort();


        desaSelect.innerHTML = `
            <option value="">
                Semua Desa
            </option>
        `;


        desa.forEach(
            function (item) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    item;

                option.textContent =
                    item;

                desaSelect.appendChild(
                    option
                );

            }
        );

    }


    /*
     * STATUS
     */

    if (statusSelect) {

        const status =
            [
                ...new Set(
                    wisataData
                        .map(
                            item =>
                                item.status
                        )
                        .filter(Boolean)
                )
            ]
            .sort();


        statusSelect.innerHTML = `
            <option value="">
                Semua Status
            </option>
        `;


        status.forEach(
            function (item) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    item;

                option.textContent =
                    item;

                statusSelect.appendChild(
                    option
                );

            }
        );

    }

}


/* =========================================================
   SEARCH
========================================================= */

function initSearch() {

    const searchInput =
        findElement([
            "searchWisata",
            "wisataSearch",
            "searchInput"
        ]);


    if (!searchInput) {

        console.warn(
            "Input search wisata belum ditemukan."
        );

        return;

    }


    searchInput.addEventListener(
        "input",
        applyFilters
    );

}


/* =========================================================
   FILTER
========================================================= */

function initFilters() {

    const elements = [

        findElement([
            "filterKategori",
            "wisataKategoriFilter"
        ]),

        findElement([
            "filterDesa",
            "wisataDesaFilter"
        ]),

        findElement([
            "filterStatus",
            "wisataStatusFilter"
        ])

    ];


    elements.forEach(
        function (element) {

            if (element) {

                element.addEventListener(
                    "change",
                    applyFilters
                );

            }

        }
    );

}


/* =========================================================
   APPLY SEARCH + FILTER
========================================================= */

function applyFilters() {

    const searchInput =
        findElement([
            "searchWisata",
            "wisataSearch",
            "searchInput"
        ]);


    const kategoriSelect =
        findElement([
            "filterKategori",
            "wisataKategoriFilter"
        ]);


    const desaSelect =
        findElement([
            "filterDesa",
            "wisataDesaFilter"
        ]);


    const statusSelect =
        findElement([
            "filterStatus",
            "wisataStatusFilter"
        ]);


    const keyword =
        searchInput
            ? normalize(
                searchInput.value
            )
            : "";


    const kategori =
        kategoriSelect
            ? normalize(
                kategoriSelect.value
            )
            : "";


    const desa =
        desaSelect
            ? normalize(
                desaSelect.value
            )
            : "";


    const status =
        statusSelect
            ? normalize(
                statusSelect.value
            )
            : "";


    const filtered =
        wisataData.filter(
            function (item) {

                const text =
                    normalize(
                        [
                            item.nama,
                            item.desa,
                            item.kategori,
                            item.jenis,
                            item.status,
                            item.deskripsi
                        ].join(" ")
                    );


                const matchSearch =
                    !keyword ||
                    text.includes(
                        keyword
                    );


                const matchKategori =
                    !kategori ||
                    normalize(
                        item.kategori
                    ) === kategori;


                const matchDesa =
                    !desa ||
                    normalize(
                        item.desa
                    ) === desa;


                const matchStatus =
                    !status ||
                    normalize(
                        item.status
                    ) === status;


                return (
                    matchSearch &&
                    matchKategori &&
                    matchDesa &&
                    matchStatus
                );

            }
        );


    renderWisata(
        filtered
    );

}


/* =========================================================
   RESET FILTER
========================================================= */

function initResetButton() {

    const button =
        findElement([
            "resetWisata",
            "btnResetWisata",
            "resetFilter"
        ]);


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            const searchInput =
                findElement([
                    "searchWisata",
                    "wisataSearch",
                    "searchInput"
                ]);


            const kategori =
                findElement([
                    "filterKategori",
                    "wisataKategoriFilter"
                ]);


            const desa =
                findElement([
                    "filterDesa",
                    "wisataDesaFilter"
                ]);


            const status =
                findElement([
                    "filterStatus",
                    "wisataStatusFilter"
                ]);


            if (searchInput) {
                searchInput.value = "";
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


/* =========================================================
   RENDER WISATA
========================================================= */

function renderWisata(
    data
) {

    const container =
        findElement([
            "wisataList",
            "wisataContainer",
            "destinationList",
            "daftarWisata"
        ]);


    if (!container) {

        console.error(
            "Container daftar wisata tidak ditemukan."
        );

        return;

    }


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    <i class="fa-solid fa-mountain-sun"></i>
                </div>

                <h4>
                    Destinasi tidak ditemukan
                </h4>

                <p>
                    Belum ada destinasi wisata
                    yang sesuai dengan pencarian.
                </p>

            </div>

        `;

        return;

    }


    let html = "";


    data.forEach(
        function (item) {

            html += createWisataCard(
                item
            );

        }
    );


    container.innerHTML =
        html;


    /*
     * Update jumlah hasil jika tersedia
     */

    setText(
        [
            "jumlahHasilWisata",
            "resultCount"
        ],
        data.length
    );

}


/* =========================================================
   CREATE CARD
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
        "status-potensi";


    if (
        normalize(
            item.status
        ) ===
        "destinasi unggulan"
    ) {

        statusClass =
            "status-unggulan";

    }


    return `

        <article class="wisata-card">

            <!-- FOTO -->

            <div class="wisata-card-image">

                <img
                    src="${escapeHTML(gambar)}"
                    alt="${nama}"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.src='assets/images/wisata/default.jpg';
                    "
                >

                <div class="wisata-card-icon">
                    ${escapeHTML(ikon)}
                </div>

                <span class="wisata-status ${statusClass}">
                    ${status}
                </span>

            </div>


            <!-- CONTENT -->

            <div class="wisata-card-body">

                <div class="wisata-card-category">

                    <span>
                        ${kategori}
                    </span>

                    <span>
                        ${jenis}
                    </span>

                </div>


                <h3>
                    ${nama}
                </h3>


                <div class="wisata-location">

                    <i class="fa-solid fa-location-dot"></i>

                    <span>
                        Desa ${desa}
                    </span>

                </div>


                <p>
                    ${deskripsi}
                </p>


                <div class="wisata-card-footer">

                    <a
                        href="${escapeHTML(maps)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn-map"
                    >

                        <i class="fa-solid fa-map-location-dot"></i>

                        Google Maps

                    </a>


                    <button
                        type="button"
                        class="btn-edit-wisata"
                        data-id="${item.id}"
                        onclick="editWisata(${Number(item.id)})"
                    >

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        type="button"
                        class="btn-delete-wisata"
                        data-id="${item.id}"
                        onclick="deleteWisata(${Number(item.id)})"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {

    const container =
        findElement([
            "wisataList",
            "wisataContainer",
            "destinationList",
            "daftarWisata"
        ]);


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="loading-state">

            <i class="fa-solid fa-spinner fa-spin"></i>

            Memuat data destinasi wisata...

        </div>

    `;

}


/* =========================================================
   ERROR
========================================================= */

function showError(
    error
) {

    const container =
        findElement([
            "wisataList",
            "wisataContainer",
            "destinationList",
            "daftarWisata"
        ]);


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="error-state">

            <div class="error-icon">

                <i class="fa-solid fa-triangle-exclamation"></i>

            </div>

            <h4>
                Data wisata gagal dimuat
            </h4>

            <p>
                Pastikan file
                <strong>data/wisata.json</strong>
                tersedia dan format JSON benar.
            </p>

            <small>
                ${escapeHTML(
                    error.message
                )}
            </small>

        </div>

    `;

}


/* =========================================================
   TAMBAH WISATA
========================================================= */

function initTambahWisata() {

    const button =
        findElement([
            "btnTambahWisata",
            "tambahWisata",
            "addWisata"
        ]);


    if (!button) {

        console.warn(
            "Tombol Tambah Wisata belum memiliki ID yang dikenali."
        );

        return;

    }


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            showDashboardMessage(
                "success",
                "Modul Tambah Wisata siap dikembangkan pada tahap berikutnya."
            );

        }
    );

}


/* =========================================================
   EDIT WISATA
========================================================= */

function editWisata(
    id
) {

    const wisata =
        wisataData.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    if (!wisata) {

        alert(
            "Data wisata tidak ditemukan."
        );

        return;

    }


    showDashboardMessage(
        "info",
        "Edit <strong>" +
        escapeHTML(
            wisata.nama
        ) +
        "</strong> akan kita aktifkan pada modul CRUD Wisata."
    );

}


/* =========================================================
   DELETE WISATA
========================================================= */

function deleteWisata(
    id
) {

    const wisata =
        wisataData.find(
            function (item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    if (!wisata) {

        alert(
            "Data wisata tidak ditemukan."
        );

        return;

    }


    /*
     * BELUM menghapus JSON.
     *
     * JSON di server tidak dapat
     * diubah langsung menggunakan
     * JavaScript frontend.
     */

    const yakin =
        confirm(
            'Destinasi "' +
            wisata.nama +
            '" akan masuk modul penghapusan pada tahap CRUD berikutnya.\n\n' +
            "Untuk sementara data JSON tidak akan dihapus."
        );


    if (yakin) {

        showDashboardMessage(
            "info",
            "Modul Hapus Wisata akan kita aktifkan setelah sistem CRUD dibuat."
        );

    }

}


/* =========================================================
   MESSAGE
========================================================= */

function showDashboardMessage(
    type,
    message
) {

    const old =
        document.querySelector(
            ".wisata-dashboard-message"
        );


    if (old) {
        old.remove();
    }


    const box =
        document.createElement(
            "div"
        );


    box.className =
        "wisata-dashboard-message " +
        type;


    box.innerHTML = `

        <div>

            <i class="fa-solid fa-circle-info"></i>

            <span>
                ${message}
            </span>

        </div>

        <button type="button">

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    document.body.appendChild(
        box
    );


    const close =
        box.querySelector(
            "button"
        );


    if (close) {

        close.addEventListener(
            "click",
            function () {

                box.remove();

            }
        );

    }


    setTimeout(
        function () {

            if (
                document.body.contains(
                    box
                )
            ) {

                box.remove();

            }

        },
        4000
    );

}


/* =========================================================
   FIND ELEMENT
========================================================= */

function findElement(
    ids
) {

    for (
        let i = 0;
        i < ids.length;
        i++
    ) {

        const element =
            document.getElementById(
                ids[i]
            );


        if (element) {
            return element;
        }

    }


    return null;

}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    ids,
    value
) {

    if (!Array.isArray(ids)) {

        ids = [ids];

    }


    ids.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.textContent =
                    value;

            }

        }
    );

}


/* =========================================================
   NORMALIZE
========================================================= */

function normalize(
    value
) {

    return String(
        value ?? ""
    )
        .toLowerCase()
        .trim();

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
   GLOBAL ACCESS
========================================================= */

window.editWisata =
    editWisata;

window.deleteWisata =
    deleteWisata;

window.loadWisataData =
    loadWisataData;